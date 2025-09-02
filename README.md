
# 📝 NoteWave  

A full-stack **note-taking application** built with **React (TypeScript, Vite)** and **Node.js (Express, TypeScript, MongoDB)**.  
Users can **sign up using email + OTP**, log in, and securely **create & delete notes**.  

---

## 📸 Screenshots / Demo

[NoteWave-demo.webm](https://github.com/user-attachments/assets/3ae416ad-d3f3-499d-9889-be6d225c5da0)

---

## 🚀 Features
- 📧 **Signup/Login with Email + OTP** (via Google SMTP server).  
- 🔑 **JWT Authentication** for secure API access.  
- 🗒️ **Create & Delete Notes** linked to the authenticated user.  
- 📱 **Responsive Design** (mobile-friendly, follows provided UI).  
- 🔒 **CORS & Env-based Config** for secure deployment.  

---

## 🛠️ Tech Stack
**Frontend**  
- React + TypeScript (Vite)  
- Material-UI / TailwindCSS (UI styling)  

**Backend**  
- Node.js + Express (TypeScript)  
- MongoDB (via Mongoose)  
- JWT for authentication  
- Nodemailer (Google SMTP for OTP)  

**Other**  
- Git for version control  
- Deployed on Render (backend) + Vercel/Netlify (frontend)  

---

## 📂 Project Structure
```
NoteWave/
│
├── backend/         # Node.js + Express + TS backend
│   ├── src/         
│   ├── package.json 
│   ├── tsconfig.json
│
├── frontend/        # React + Vite + TS frontend
│   ├── src/         
│   ├── public/      
│   ├── vite.config.ts
│   ├── package.json 
│   ├── tsconfig.json
```
---

## ⚙️ Environment Variables

### 🔹 Backend (`.env`)
```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
SMTP_USER=your_gmail_username
SMTP_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secret_key
```

### 🔹 Frontend (`.env`)
```env
VITE_BACKEND_URL=http://localhost:3000
```

---

## 🖥️ Installation & Setup

### Backend
```bash
cd backend
npm install
npm run dev   # runs backend in dev mode
```

### Frontend
```bash
cd frontend
npm install
npm run dev   # starts Vite dev server (default http://localhost:5173)
```

---

## 🔐 Authentication Flow
1. User enters email → receives OTP via **Google SMTP**.  
2. OTP is verified → backend issues a **JWT**.  
3. Frontend stores token → attaches it in `Authorization: Bearer <token>` headers for protected routes.  
4. Users can create/delete notes only when authenticated.  

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/request-otp-up` → Sign up with OTP  
- `POST /api/auth/request-otp-in` → Login with OTP  
- `POST /api/auth/verify-otp` → Verify OTP  

### Notes (protected)
- `POST /api/notes` → Create Note  
- `DELETE /api/notes/:id` → Delete Note  
- `GET /api/notes` → Fetch user notes  

---

## 🚀 Deployment
- **Backend** → Render 
- **Frontend** → Vercel   
- **Database** → MongoDB Atlas  



