# Recruitment App 🚀

Repository for the project in the course IV1201, Architecture and global application.

This project is a **recruitment application** with:

- **Frontend**: Next.js (Runs on `localhost:3000`)
- **Backend**: Express.js with Sequelize & PostgreSQL (Runs on `localhost:4000`)
- **Database**: PostgreSQL (Runs inside Docker)

## **Prerequisites**

Ensure you have the following installed on your system:

- [Docker](https://www.docker.com/get-started) 🐳
- [Docker Compose](https://docs.docker.com/compose/) (Included with Docker)

## **1️⃣ Clone the Repository**

```sh
git clone https://github.com/thepoppe/IV1201-Recruitment_Application.git
cd IV1201-Recruitment_Application
```

---

## **2️⃣ Add Environment Variables**

Create a **`.env` file** in the `back-end/` directory and add:

```sh
DB_HOST=db
DB_USER=user
DB_PASSWORD=password
DB_NAME=recruitment
DB_PORT=5432
```

---

## **3️⃣ Start the Development Environment**

Run the following command to build and start everything:

```sh
docker compose up --build --watch
```

> This will:
>
> - Start **PostgreSQL** (`localhost:5432`)
> - Start **Backend (Express.js)** (`localhost:4000`)
> - Start **Frontend (Next.js)** (`localhost:3000`)
> - Enable **hot reloading** for both frontend and backend

---

## **4️⃣ Verify Everything is Running**

- Open **http://localhost:3000/** → Frontend
- Open **http://localhost:4000/test-db** → Test database connection
- Run in terminal:
  ```sh
  docker ps
  ```
  This should show running containers for:
  - `recruitment_db`
  - `recruitment_backend`
  - `recruitment_frontend`

---

## **5️⃣ Common Development Commands**

📌 **Access the PostgreSQL database**:

```sh
docker exec -it recruitment_db psql -U user -d recruitment
```

📌 **List database tables**:

```sh
docker exec -it recruitment_db psql -U user -d recruitment -c "\dt"
```

---
