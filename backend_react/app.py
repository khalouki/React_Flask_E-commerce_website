from flask import Flask, request, jsonify, session, send_from_directory
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import bleach
import os
from werkzeug.utils import secure_filename
from config import Config
from models import db, User, Part, ContactMessage, Comment, Order, OrderPart
from datetime import datetime
import json
import re
import logging

# Configure logging for suspicious inputs and errors
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# File handler for app.log
file_handler = logging.FileHandler('app.log')
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logger.addHandler(file_handler)


def sanitize_input(value):
    """Sanitize inputs to prevent XSS and SQL injection with strict validation."""
    if not value:
        return ""
    
    # Strip HTML tags and attributes
    cleaned = bleach.clean(value, tags=[], attributes={'strip': True}, strip=True)

    # Remove any suspicious SQL characters
    sql_pattern = re.compile(r'[\'";-]', re.IGNORECASE)
    if sql_pattern.search(cleaned):
        logger.warning(f"Suspicious input detected: {cleaned}")
        return ""
    
    # Remove any suspicious JavaScript patterns
    js_pattern = re.compile(r'(javascript:|on\w+=|<\s*script|alert\()', re.IGNORECASE)
    if js_pattern.search(cleaned):
        logger.warning(f"Suspicious JavaScript input detected: {cleaned}")
        return ""
    
    return cleaned[:255]

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'avif'}

def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def setup_database(app):
    """Initialize the database without default data."""
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username='admin').first():
            hashed_password = Bcrypt().generate_password_hash('admin').decode('utf-8')
            admin = User(
                username='admin',
                email='admin@carmarket.com',
                password=hashed_password,
                is_admin=True
            )
            db.session.add(admin)
            db.session.commit()
        logger.info("Database initialized with admin user")

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'images')

    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    db.init_app(app)
    bcrypt = Bcrypt(app)
    CORS(app, supports_credentials=True, origins=[
        "https://utterly-better-sculpin.ngrok-free.app",
        "http://localhost:3000"
    ])
    setup_database(app)

    # CSP Configuration
    csp_policy = {
        "default-src": "'self'",
        "script-src": "'self' http://localhost:3000 https://utterly-better-sculpin.ngrok-free.app",
        "style-src": "'self' 'unsafe-inline'",
        "img-src": "'self' data: http://localhost:5000/images https://utterly-better-sculpin.ngrok-free.app/images",
        "connect-src": "'self' http://localhost:5000 https://utterly-better-sculpin.ngrok-free.app",
        "font-src": "'self'",
        "object-src": "'none'",
        "frame-src": "'none'",
        "base-uri": "'self'",
        "form-action": "'self'"
    }
    csp_header = "; ".join(f"{key} {value}" for key, value in csp_policy.items())

    @app.after_request
    def add_csp_header(response):
        response.headers['Content-Security-Policy'] = csp_header
        return response

    @app.route('/api/delete-account', methods=['DELETE'])
    def delete_account():
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        try:
            data = request.get_json(silent=True)
            if not data:
                logger.error("Invalid JSON data in delete account request")
                return jsonify({"error": "Invalid JSON data"}), 400
            current_password = data.get('currentPassword', '')
            if not current_password:
                logger.warning("Missing current password in delete account request")
                return jsonify({'error': 'Current password is required'}), 400
            user = User.query.get(session['user_id'])
            if not user or not bcrypt.check_password_hash(user.password, current_password):
                logger.warning(f"Invalid password for user {session['user_id']}")
                return jsonify({'error': 'Invalid current password'}), 401
            
            # Check if user has any non-delivered orders
            non_delivered_orders = Order.query.filter_by(user_id=user.id).filter(Order.status != 'Delivered').count()
            if non_delivered_orders > 0:
                logger.info(f"User {user.username} has {non_delivered_orders} non-delivered orders")
                return jsonify({'error': 'You still have orders not delivered yet.'}), 400
            
            # Get order IDs for delivered orders
            delivered_order_ids = [order.id for order in Order.query.filter_by(user_id=user.id, status='Delivered').all()]
            
            # Delete associated order_parts for delivered orders
            if delivered_order_ids:
                OrderPart.query.filter(OrderPart.order_id.in_(delivered_order_ids)).delete(synchronize_session=False)
            
            # Delete delivered orders
            Order.query.filter_by(user_id=user.id, status='Delivered').delete(synchronize_session=False)
            # Delete contact messages
            ContactMessage.query.filter_by(user_id=user.id).delete(synchronize_session=False)
            # Delete user
            db.session.delete(user)
            session.clear()
            db.session.commit()
            logger.info(f"User account deleted: {user.username}")
            return jsonify({'message': 'Account deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error deleting account: {str(e)}")
            return jsonify({'error': f'Failed to delete account: {str(e)}'}), 500

    @app.route('/api/admin/parts/<int:part_id>', methods=['PUT'])
    def update_part(part_id):
        if 'user_id' not in session or not session.get('is_admin'):
            return jsonify({'error': 'Unauthorized'}), 401
        part = Part.query.get_or_404(part_id)
        data = request.form
        
        try:
            part.name = sanitize_input(data.get('name', part.name))
            part.car_model = sanitize_input(data.get('car_model', part.car_model))
            part.price = float(data.get('price', part.price))
            part.description = sanitize_input(data.get('description', part.description))
            
            if 'image' in request.files:
                file = request.files['image']
                if file and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    unique_filename = f"{part_id}_{filename}"
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                    file.save(file_path)
                    part.image = f"images/{unique_filename}"
            
            if part.price < 0:
                return jsonify({'error': 'Price cannot be negative'}), 400
            
            db.session.commit()
            return jsonify({'message': 'Part updated successfully'}), 200
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid input data'}), 400
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating part: {str(e)}")
            return jsonify({'error': f'Failed to update part: {str(e)}'}), 500

    @app.route('/api/admin/parts/<int:part_id>', methods=['DELETE'])
    def delete_part(part_id):
        if 'user_id' not in session or not session.get('is_admin'):
            return jsonify({'error': 'Unauthorized'}), 401
        part = Part.query.get_or_404(part_id)
        try:
            if part.image and os.path.exists(os.path.join(app.root_path, part.image)):
                os.remove(os.path.join(app.root_path, part.image))
            db.session.delete(part)
            db.session.commit()
            return jsonify({'message': 'Part deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error deleting part: {str(e)}")
            return jsonify({'error': f'Failed to delete part: {str(e)}'}), 500

    @app.route('/api/register', methods=['POST'])
    def register():
        try:
            data = request.get_json(silent=True)
            # Check if the request data is valid JSON
            if not data:
                logger.error("Invalid JSON data in register request")
                return jsonify({'error': 'Invalid JSON data'}), 400
            # Sanitize the input data
            username = sanitize_input(data.get('username', ''))
            email = sanitize_input(data.get('email', ''))
            password = data.get('password', '')
            # Check if all fields are provided
            if not username or not email or not password:
                logger.warning(f"Missing fields in register request: username={username}, email={email}")
                return jsonify({'error': 'All fields are required'}), 400
            if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
                logger.warning(f"Duplicate username or email: {username}, {email}")
                return jsonify({'error': 'Username or email already exists'}), 400
            # Hash the password
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            user = User(username=username, email=email, password=hashed_password, is_admin=False)
            # Add the user to the database
            db.session.add(user)
            db.session.commit()
            logger.info(f"User registered successfully: {username}")
            return jsonify({'message': 'Registration successful'}), 201
        except Exception as e:
            db.session.rollback()
            logger.error(f"Registration error: {str(e)}")
            return jsonify({'error': f'Failed to register: {str(e)}'}), 500

    @app.route('/api/login', methods=['POST'])
    def login():
        try:
            data = request.get_json(silent=True)
            if not data:
                logger.error("Invalid JSON data in login request")
                return jsonify({'error': 'Invalid JSON data'}), 400
            # Sanitize input to prevent SQL injection
            username = sanitize_input(data.get('username', ''))
            password = data.get('password', '')
            user = User.query.filter_by(username=username).first()
            # Check if the user exists and the password is correct
            if user and bcrypt.check_password_hash(user.password, password):
                session['user_id'] = user.id
                session['username'] = user.username
                session['is_admin'] = user.is_admin
                session.permanent = True
                logger.info(f"User logged in: {username}")
                return jsonify({
                    'message': 'Login successful',
                    'user': {'username': user.username, 'email': user.email, 'is_admin': user.is_admin}
                }), 200
            logger.warning(f"Invalid login attempt: {username}")
            return jsonify({'error': 'Invalid credentials'}), 401
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return jsonify({'error': f'Failed to login: {str(e)}'}), 500

    @app.route('/api/logout', methods=['POST'])
    def logout():
        session.clear()
        logger.info("User logged out")
        return jsonify({'message': 'Logged out successfully'}), 200

    @app.route('/api/parts', methods=['GET'])
    def get_parts():
        try:
            car_model = request.args.get('car_model', '')
            name = request.args.get('name', '')
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 6, type=int)

            query = Part.query
            if car_model:
                sanitized_car_model = sanitize_input(car_model)
                if not sanitized_car_model:
                    logger.warning(f"Invalid car model input: {car_model}")
                    return jsonify({'error': 'Invalid car model input'}), 400
                query = query.filter(Part.car_model.ilike(f'%{sanitized_car_model}%'))
            if name:
                sanitized_name = sanitize_input(name)
                if not sanitized_name:
                    logger.warning(f"Invalid name input: {name}")
                    return jsonify({'error': 'Invalid name input'}), 400
                query = query.filter(Part.name.ilike(f'%{sanitized_name}%'))

            total_parts = query.count()
            parts = query.offset((page - 1) * per_page).limit(per_page).all()
            
            return jsonify({
                'parts': [{
                    'id': part.id,
                    'name': part.name,
                    'car_model': part.car_model,
                    'price': part.price,
                    'description': part.description,
                    'image': part.image
                } for part in parts],
                'total_parts': total_parts,
                'total_pages': (total_parts + per_page - 1) // per_page,
                'current_page': page
            }), 200
        except Exception as e:
            logger.error(f"Error in get_parts: {str(e)}")
            return jsonify({'error': f'Failed to retrieve parts: {str(e)}'}), 500

    @app.route('/api/contact', methods=['POST'])
    def contact():
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        data = request.get_json(silent=True)
        if not data:
            logger.error("Invalid JSON data in contact request")
            return jsonify({'error': 'Invalid JSON data'}), 400
        message = sanitize_input(data.get('message', ''))
        if not message:
            logger.warning("Missing message in contact request")
            return jsonify({'error': 'Message is required'}), 400
        contact_message = ContactMessage(user_id=session['user_id'], message=message)
        db.session.add(contact_message)
        db.session.commit()
        logger.info("Contact message sent")
        return jsonify({'message': 'Message sent successfully'}), 201

    @app.route('/api/check-auth', methods=['GET'])
    def check_auth():
        if 'user_id' in session:
            user = User.query.filter_by(id=session['user_id']).first()
            if user:
                return jsonify({
                    'isLoggedIn': True,
                    'user': {'username': user.username, 'email': user.email, 'is_admin': user.is_admin}
                }), 200
        return jsonify({'isLoggedIn': False, 'user': None}), 200

    @app.route('/api/orders', methods=['POST'])
    def create_order():
        try:
            if 'user_id' not in session:
                return jsonify({'error': 'Unauthorized'}), 401
            data = request.get_json(silent=True)
            if not data:
                logger.error("Invalid JSON data in order request")
                return jsonify({'error': 'Invalid JSON data'}), 400
            address = data.get('address')
            part_ids = session.get('panel', [])
            
            if not address or not part_ids:
                logger.warning("Missing address or parts in order request")
                return jsonify({'error': 'Address and parts are required'}), 400
            
            address_json = json.dumps({
                'street': sanitize_input(address.get('street', '')),
                'city': sanitize_input(address.get('city', '')),
                'postal_code': sanitize_input(address.get('postal_code', '')),
                'country': sanitize_input(address.get('country', ''))
            })
            
            order = Order(
                user_id=session['user_id'],
                address=address_json,
                status='Pending',
                delivery_delay_days=7
            )
            db.session.add(order)
            db.session.flush()
            
            for part_id in part_ids:
                order_part = OrderPart(order_id=order.id, part_id=part_id)
                db.session.add(order_part)
            
            session['panel'] = []
            session.modified = True
            db.session.commit()
            logger.info(f"Order created: {order.id}")
            return jsonify({'message': 'Commande crÃ©Ã©e avec succÃ¨s', 'order_id': order.id}), 201
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating order: {str(e)}")
            return jsonify({'error': f'Failed to create order: {str(e)}'}), 500

    @app.route('/api/orders', methods=['GET'])
    def get_orders():
        try:
            if 'user_id' not in session:
                return jsonify({'error': 'Unauthorized'}), 401
            orders = Order.query.filter_by(user_id=session['user_id']).order_by(Order.created_at.desc())
            return jsonify([{
                'id': order.id,
                'address': json.loads(order.address),
                'status': order.status,
                'created_at': order.created_at.isoformat(),
                'delivery_delay_days': order.delivery_delay_days,
                'parts': [{
                    'id': part.id,
                    'name': part.name,
                    'car_model': part.car_model,
                    'price': part.price,
                    'description': part.description,
                    'image': part.image
                } for part in order.parts]
            } for order in orders]), 200
        except Exception as e:
            logger.error(f"Error retrieving orders: {str(e)}")
            return jsonify({'error': f'Failed to retrieve orders: {str(e)}'}), 500

    @app.route('/api/orders/<int:order_id>', methods=['DELETE'])
    def delete_order(order_id):
        if 'user_id' not in session or session.get('is_admin'):
            return jsonify({'error': 'Unauthorized'}), 401
        try:
            order = Order.query.get_or_404(order_id)
            if not order or order.user_id != session['user_id']:
                return jsonify({'error': 'Unauthorized'}), 403
            if order.status != 'Pending':
                return jsonify({'error': 'Only pending orders can be deleted'}), 400
            db.session.delete(order)
            db.session.commit()
            logger.info(f"Order {order_id} deleted")
            return jsonify({'message': 'Order deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error deleting order: {str(e)}")
            return jsonify({'error': f'Failed to delete order: {str(e)}'}), 500

    @app.route('/api/panel', methods=['POST'])
    def add_to_panel():
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        try:
            data = request.get_json(silent=True)
            if not data:
                logger.error("Invalid JSON data in panel request")
                return jsonify({'error': 'Invalid JSON data'}), 400
            part_id = data.get('partId')
            if not part_id:
                logger.warning("Missing partId in panel request")
                return jsonify({'error': 'Part ID is required'}), 400
            if 'panel' not in session:
                session['panel'] = []
            if part_id not in session['panel']:
                session['panel'].append(part_id)
                session.modified = True
            logger.info(f"Part added to panel: {part_id}")
            return jsonify({'message': 'Part added to panel'}), 201
        except Exception as e:
            logger.error(f"Error adding part to panel: {str(e)}")
            return jsonify({'error': f'Failed to add part to panel: {str(e)}'}), 500

    @app.route('/api/panel', methods=['GET'])
    def get_panel():
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        try:
            panel_part_ids = session.get('panel', [])
            parts = Part.query.filter(Part.id.in_(panel_part_ids)).all()
            return jsonify([{
                'id': part.id,
                'name': part.name,
                'car_model': part.car_model,
                'price': part.price,
                'description': part.description,
                'image': part.image
            } for part in parts]), 200
        except Exception as e:
            logger.error(f"Error retrieving panel: {str(e)}")
            return jsonify({'error': f'Failed to retrieve panel: {str(e)}'}), 500

    @app.route('/api/panel', methods=['DELETE'])
    def remove_from_panel():
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        try:
            data = request.get_json(silent=True)
            if not data:
                logger.error("Invalid JSON data in panel delete request")
                return jsonify({'error': 'Invalid JSON data'}), 400
            part_id = data.get('partId')
            if not part_id:
                logger.warning("Missing partId in panel delete request")
                return jsonify({'error': 'Part ID is required'}), 400
            if 'panel' in session and part_id in session['panel']:
                session['panel'].remove(part_id)
                session.modified = True
                logger.info(f"Part removed from panel: {part_id}")
                return jsonify({'message': 'Part removed from panel'}), 200
            logger.warning(f"Part not found in panel: {part_id}")
            return jsonify({'error': 'Part not found in panel'}), 404
        except Exception as e:
            logger.error(f"Error removing part from panel: {str(e)}")
            return jsonify({'error': f'Failed to remove part from panel: {str(e)}'}), 500

    @app.route('/api/admin/parts', methods=['POST'])
    def add_part():
        if 'user_id' not in session or not session.get('is_admin'):
            return jsonify({'error': 'Unauthorized'}), 401
        data = request.form
        name = sanitize_input(data.get('name', ''))
        car_model = sanitize_input(data.get('car_model', ''))
        price = data.get('price', type=float)
        description = sanitize_input(data.get('description', ''))
        
        if not all([name, car_model, price, description]):
            logger.warning("Missing fields in add part request")
            return jsonify({'error': 'Name, car model, price, and description are required'}), 400
        
        if 'image' not in request.files:
            logger.warning("Missing image in add part request")
            return jsonify({'error': 'Image is required'}), 400
        
        file = request.files['image']
        if not file or not allowed_file(file.filename):
            logger.warning(f"Invalid image file: {file.filename if file else 'None'}")
            return jsonify({'error': 'Invalid image file'}), 400
        
        try:
            part = Part(
                name=name,
                car_model=car_model,
                price=price,
                description=description,
                image=''
            )
            db.session.add(part)
            db.session.flush()
            
            filename = secure_filename(file.filename)
            unique_filename = f"{part.id}_{filename}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(file_path)
            part.image = f"images/{unique_filename}"
            
            db.session.commit()
            logger.info(f"Part added: {part.id}")
            return jsonify({'message': 'Part added successfully'}), 201
        except Exception as e:
            db.session.rollback()
            logger.error(f"Failed to add part: {str(e)}")
            return jsonify({'error': f'Failed to add part: {str(e)}'}), 500

    @app.route('/api/comments', methods=['POST'])
    def add_comment():
        try:
            data = request.get_json(silent=True)
            if not data:
                logger.error("Invalid JSON data in comment request")
                return jsonify({'error': 'Invalid JSON data'}), 400
            name = sanitize_input(data.get('name', ''))
            comment = sanitize_input(data.get('comment', ''))
            if not name or not comment:
                logger.warning("Missing name or comment in comment request")
                return jsonify({'error': 'Name and comment are required'}), 400
            if len(name) > 100 or len(comment) > 1000:
                logger.warning(f"Input too long: name={len(name)}, comment={len(comment)}")
                return jsonify({'error': 'Input too long'}), 400
            new_comment = Comment(name=name, comment=comment)
            db.session.add(new_comment)
            db.session.commit()
            logger.info("Comment submitted")
            return jsonify({'message': 'Comment submitted successfully'}), 201
        except Exception as e:
            logger.error(f"Error in add_comment: {str(e)}")
            return jsonify({'error': f'Failed to submit comment: {str(e)}'}), 500

    @app.route('/api/comments', methods=['GET'])
    def get_comments():
        try:
            comments = Comment.query.order_by(Comment.created_at.desc()).limit(5).all()
            return jsonify([{
                'id': comment.id,
                'name': comment.name,
                'comment': comment.comment,
                'created_at': comment.created_at.isoformat()
            } for comment in comments]), 200
        except Exception as e:
            logger.error(f"Error in get_comments: {str(e)}")
            return jsonify({'error': f'Failed to retrieve comments: {str(e)}'}), 500

    @app.route('/api/admin/orders', methods=['GET'])
    def get_all_orders():
        if 'user_id' not in session or not session.get('is_admin'):
            return jsonify({'error': 'Unauthorized'}), 401
        try:
            orders = Order.query.order_by(Order.created_at.desc()).all()
            return jsonify([{
                'id': order.id,
                'user': {
                    'username': order.user.username,
                    'email': order.user.email
                },
                'address': json.loads(order.address),
                'status': order.status,
                'created_at': order.created_at.isoformat(),
                'delivery_delay_days': order.delivery_delay_days,
                'parts': [{
                    'id': part.id,
                    'name': part.name,
                    'car_model': part.car_model,
                    'price': part.price
                } for part in order.parts]
            } for order in orders]), 200
        except Exception as e:
            logger.error(f"Error retrieving orders: {str(e)}")
            return jsonify({'error': f'Failed to retrieve orders: {str(e)}'}), 500

    @app.route('/api/admin/orders/<int:order_id>/status', methods=['PUT'])
    def update_order_status(order_id):
        if 'user_id' not in session or not session.get('is_admin'):
            return jsonify({'error': 'Unauthorized'}), 401
        try:
            data = request.get_json(silent=True)
            if not data:
                logger.error("Invalid JSON data in order status update request")
                return jsonify({'error': 'Invalid JSON data'}), 400
            status = sanitize_input(data.get('status', ''))
            valid_statuses = ['Pending', 'Shipped', 'Arrived', 'Delivered', 'Cancelled']
            if not status or status not in valid_statuses:
                logger.warning(f"Invalid status: {status}")
                return jsonify({'error': f'Status must be one of {valid_statuses}'}), 400
            order = Order.query.get_or_404(order_id)
            order.status = status
            db.session.commit()
            logger.info(f"Order {order_id} status updated to: {status}")
            return jsonify({'message': 'Order status updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating order status: {str(e)}")
            return jsonify({'error': f'Failed to update order status: {str(e)}'}), 500

    @app.route('/images/<path:filename>')
    def serve_image(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=False)