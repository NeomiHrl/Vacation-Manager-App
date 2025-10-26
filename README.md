**🛠 How to Run with Docker**

1. Clone the repository  
   bash
   git clone https://github.com/NeomiHrl/Vacation-Manager-App.git
   

2. Run the project with Docker Compose  
   bash
   docker-compose up --build
   

3. Access the application:
   - Frontend (React): http://localhost:3000
   - Backend (Flask): http://localhost:5000
   - MySQL: accessible on port 3307

4. Stop all containers  
   To stop the app when you're done, run:
   bash
   docker-compose down


---

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
