# 🚗 Car Parts E-Commerce Website

An **E-commerce web application** for selling car parts, built with **React (frontend)** and **Flask (backend)** using a **MySQL database**.  
The project demonstrates **full-stack development**, including **security best practices** against common web vulnerabilities (SQL Injection, XSS).

---

## ✨ Features

- 🔍 Browse car parts by category
- 🛒 Add to cart & checkout
- 🔐 User authentication & authorization
- 📦 Order management
- 🛡️ Security fundamentals:
  - Input validation & sanitization
  - Protection against **SQL Injection**
  - Escaping to prevent **Cross-Site Scripting (XSS)**
  - Secure password hashing

---

## 🖼️ Screenshots

👉 *(Replace the placeholders with your own images)*

![Homepage Screenshot](./assets/homepage.png)  
![Product Page Screenshot](./assets/product.png)  
![Checkout Screenshot](./assets/checkout.png)  

---

## 🛠️ Tech Stack

**Frontend**  
- React.js (Hooks, Axios, React Router)  
- Tailwind CSS (or your chosen styling framework)  

**Backend**  
- Flask (Python)  
- Flask-CORS for API communication  
- Flask-SQLAlchemy (ORM with MySQL)  

**Database**  
- MySQL  

**Security**  
- Parameterized queries to prevent SQL Injection  
- Input sanitization & escaping for XSS  
- Password hashing with `werkzeug.security`

---

## 🚀 Live Demo

- 🌐 Frontend: [Deployed on Vercel/Netlify](#)  
- ⚙️ Backend API: [Deployed on Render/Railway](#)  

*(Replace `#` with your real links once deployed)*

---

## 📂 Project Structure

```bash
car-parts-ecommerce/
│
├── frontend/               # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
├── backend/                # Flask backend
│   ├── app.py
│   ├── models.py
│   ├── routes/
│   ├── services/
│   └── requirements.txt
│
└── README.md
