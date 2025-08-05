# 🚀 Velora Backend

This repository contains the backend RESTful API server powering the Velora platform. It handles user authentication, data management, and integration with external services.

---

## 🔗 Live API Base URL

`https://velora-backend.onrender.com`

---

## 📦 Tech Stack

- Node.js & Express.js  
- MongoDB with Mongoose  
- JWT for authentication  
- dotenv for environment variables  

---

## 🌟 Features

- 🔐 User authentication with JWT and secure cookies  
- 💾 CRUD operations for user data, watchlists, and portfolios  
- ⚙️ RESTful API endpoints built with Express.js  
- 🛡️ CORS and security middleware  
- 📈 Scalable backend server architecture  

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Anirudh-Singh-26/Velora-backend.git
cd Velora-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file:

```env
PORT=3000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your_jwt_secret_key
```

### 4. Start the server

For production:

```bash
npm run start
```

For development with auto-reload:

```bash
npm run dev
```

---

## 📚 Usage

- Provides secure API endpoints consumed by Velora frontend and dashboard  
- Handles user authentication, session management, and data persistence  
- Integrates with MongoDB database for reliable storage  

---

## 🔗 Related Repositories

- **Velora Frontend** - [https://github.com/Anirudh-Singh-26/Velora-frontend](https://github.com/Anirudh-Singh-26/Velora-frontend)  
- **Velora Dashboard** - [https://github.com/Anirudh-Singh-26/Velora-dashboard](https://github.com/Anirudh-Singh-26/Velora-dashboard)  

---

## 👤 Author

Anirudh Singh Rathore  
[GitHub Profile](https://github.com/Anirudh-Singh-26)

---

## 📄 License

MIT © Anirudh Singh Rathore