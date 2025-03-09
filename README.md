# Recruitment App 🚀

Repository for the project in the course IV1201, Architecture and global application.

This project is a **recruitment application** with:

- **Frontend**: Next.js (Runs on `localhost:3000`)
- **Backend**: Express.js with Sequelize & PostgreSQL (Runs on `localhost:4000`)
- **Database**: PostgreSQL (Runs inside Docker)

## **Deployed versions**
- Production: 
 - Front-end: **https://recruit-web-prod-9edf25da5b44.herokuapp.com/en**
 - Back-end: **https://recruit-api-prod-296be8f05b81.herokuapp.com/api**

- Staging:
 - Front-end: **https://recruit-web-staging-f49d79e1168e.herokuapp.com/en**
 - Back-end: **https://recruit-api-staging-1372e4e3a3b5.herokuapp.com/api**


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
> - When the database starts, it will **automatically import `dump.sql`** if the database is empty.

---

## **4️⃣ Verify Everything is Running**

- Open **http://localhost:3000/** → Frontend
- Open **http://localhost:4000/api** → Test database connection
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

## Completely Reset and Rebuild Everything

Remove Local node_modules and Lockfile in respective invironment (back-end or front-end)

```sh
rm -rf node_modules package-lock.json
```

Rebuild Docker Container

```sh
docker compose down --rmi all --volumes --remove-orphans
docker compose up --build --watch
```

---

## Migrate data from old database to new database
- Instructions on how to migrate from the old database using `dump.sql` are provided in the README file within the `migrate-db` directory.