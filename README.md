# Recruitment App 🚀

Repository for the project in the course IV1201, Architecture and global application.

This project is a **recruitment application** with:

- **Frontend**: Next.js (Runs on `localhost:3000`)
- **Backend**: Express.js with Sequelize & PostgreSQL (Runs on `localhost:4000`)
- **Database**: PostgreSQL (Runs inside Docker)

## **Deployed versions**
### Production: 
 - Front-end: [https://recruit-web-prod-9edf25da5b44.herokuapp.com/en](https://recruit-web-prod-9edf25da5b44.herokuapp.com/en)
 - Back-end: [https://recruit-api-prod-296be8f05b81.herokuapp.com/api](https://recruit-api-prod-296be8f05b81.herokuapp.com/api)

### Staging:
 - Front-end: [https://recruit-web-staging-f49d79e1168e.herokuapp.com/en](https://recruit-web-staging-f49d79e1168e.herokuapp.com/en)
 - Back-end: [https://recruit-api-staging-1372e4e3a3b5.herokuapp.com/api](https://recruit-api-staging-1372e4e3a3b5.herokuapp.com/api)

(Ctrl+click or ⌘+click links to open in a new tab)

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

JWT_SECRET=jwt_secret
JWT_EXPIRES_IN=1h
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

## Running Unit Tests for the Backend

To run unit tests for the backend locally, follow these steps:

### 1. Install dependencies (if not already installed)
```sh
cd back-end
npm i
```
### 2. Running Test Locally
- Run all tests concurrently (default):
```sh
npm test
```
- Run all tests sequentially (used in CI/CD):
```sh
npm run test:ci
```
- Run a specific test file (useful for debugging):
```sh
npm test -- /src/__tests__/folder/testfile
```

### Environment & Database setup
- The application uses a local .env file, so ensure it exists.
- The test suite automatically sets up an in-memory SQLite database using databaseMock. No manual setup is required.
- Each test mocks the layer below it, and middleware is also mocked if needed, except for server.test.js, which tests full use cases.

### CI/CD Testing
- In the CI pipeline, tests run using:
```sh
npm run test:ci
```
- This ensures sequential execution, reducing potential conflicts in test environments.
- The CI/CD workflow defines required environment variables (e.g., JWT_SECRET and JWT_EXPIRES_IN) directly in the YAML configuration.


---

## Migrate data from old database to new database
- Instructions on how to migrate from the old database using `dump.sql` are provided in the README file within the `migrate-db` directory.

---

## Developing a Mobile Application
- It is really easy to develop a mobile application using our easy-to-use API for the Amusement Park back-end application. Documentation will be provided for the developed routes and how to use them.