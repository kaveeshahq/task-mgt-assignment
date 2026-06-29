# TaskFlow — Task Management System

A full-stack task management application built as a take-home technical assignment. Supports role-based access, task CRUD with priority/status workflows, search and filtering, and JWT authentication.

## Live Demo

- **Frontend:** https://task-mgt-assignment.vercel.app/
- **Backend API:** https://task-mgt-assignment.onrender.com
- **Repository:** https://github.com/kaveeshahq/task-mgt-assignment

> Note: the backend is hosted on Render's free tier, which spins down after periods of inactivity. The first request after idle time may take 30–60 seconds to respond while the server wakes up.

## Tech Stack

**Frontend**
- React + Vite + TypeScript
- Tailwind CSS v4
- Zustand (state management)
- React Router
- Axios

**Backend**
- Express.js + Node.js + TypeScript
- Prisma ORM
- JWT authentication + bcrypt password hashing

**Database**
- MySQL (hosted on Aiven)

**Deployment**
- Frontend: Vercel
- Backend: Render

## Features

- User registration and login with JWT-based authentication
- Role-based access control:
  - **Admin** — can view, edit, and delete all tasks
  - **User** — can only view/manage tasks they created or are assigned to
- Full task CRUD:
  - Title, description, priority (Low / Medium / High)
  - Status workflow (Open / In Progress / Testing / Done)
  - Due date and assignee
- Search and filter tasks by title, status, and priority
- Table view and card view toggle for task listing
- Responsive, custom-styled UI

## Project Structure

```
task-management-system/
├── backend/          # Express + Prisma + MySQL API
│   ├── prisma/       # Schema and migrations
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── utils/
└── frontend/         # React + Vite + TypeScript client
    └── src/
        ├── api/
        ├── components/
        ├── pages/
        ├── store/
        └── types/
```

## Local Setup

### Prerequisites
- Node.js v18+
- A MySQL database (e.g. a free instance from [Aiven](https://aiven.io))

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DBNAME?ssl-mode=REQUIRED"
JWT_SECRET="your_long_random_secret_string"
PORT=5000
```

Run the database migration and start the server:
```bash
npx prisma migrate dev
npm run dev
```

The API will be running at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:
```bash
npm run dev
```

The app will be running at `http://localhost:5173` (or whichever port Vite assigns).

## API Endpoints

| Method | Endpoint              | Description                          | Auth required |
|--------|------------------------|---------------------------------------|----------------|
| POST   | `/api/auth/register`  | Register a new user                  | No             |
| POST   | `/api/auth/login`     | Log in and receive a JWT              | No             |
| GET    | `/api/tasks`           | List tasks (filtered by role/query)  | Yes            |
| POST   | `/api/tasks`           | Create a new task                    | Yes            |
| GET    | `/api/tasks/:id`       | Get a single task by ID              | Yes            |
| PUT    | `/api/tasks/:id`       | Update a task                        | Yes            |
| DELETE | `/api/tasks/:id`       | Delete a task                        | Yes            |
| GET    | `/api/users`           | List users (for task assignment)     | Yes            |

Task list supports query params: `?status=`, `?priority=`, `?search=`

## Test Account

You can register a new account directly on the live site — the registration form lets you choose **Admin** or **User** role at signup, making it easy to test both permission levels.

## Author

Dissanayake — Computing & Information Systems, Sabaragamuwa University of Sri Lanka
