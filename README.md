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

<p align="center">
  <img src="https://github.com/user-attachments/assets/feb2e997-c1fb-4174-88e7-861734d7001b" width="450" />
  <img src="https://github.com/user-attachments/assets/98ab252c-7cc9-44f0-96d5-36e1c3634e8d" width="450" />
  <img src="https://github.com/user-attachments/assets/974b07d8-cc1d-4f75-a61f-bc6300249a7c" width="450" />
  <img src="https://github.com/user-attachments/assets/12058a59-6176-414f-8393-fcfe7c876e89" width="450" />
</p>

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
