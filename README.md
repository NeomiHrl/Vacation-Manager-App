📌 Features

For All Users:
- Browse available vacations  
- Register/Login  
- Like or unlike vacations (only when logged in)  

Admin Capabilities:
- Add new vacations  
- Edit existing vacations  
- Delete vacations  

---

🔐 Authentication
- Role-based access (admin / user)  
- JWT tokens used for authentication  
- Protected routes for vacation management and like/unlike actions

- 🧪 API Testing
- Frontend can be accessed and tested in the browser (React client)  
- Backend API can also be tested via Postman  

---

🗄 Database
- MySQL database  
- Tables: users, vacations, likes, roles, countries  
- Sample data loaded on container start (via init_data.sql)  

---

🐳 Dockerized Setup
- Full Docker support using Dockerfile and docker-compose.yml  
- Containers:  
  - React frontend  
  - Flask backend  
  - MySQL database  
- Shared network and volumes  

---

🚀 Technologies
- Frontend: React, JavaScript  
- Backend: Python (Flask), REST API  
- Database: MySQL  
- Deployment: Docker & Docker Compose
