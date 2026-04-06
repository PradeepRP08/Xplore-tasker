# 🚀 TaskFlow — Admin & Employee Task Management System

A full-stack MERN application with a premium, modern UI featuring two portals: **Admin** and **Employee**.

---

## 🖥️ Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | React 18 + Vite, Tailwind CSS, Framer Motion    |
| Charts     | Recharts                                        |
| Icons      | Lucide React                                    |
| Toasts     | React Hot Toast                                 |
| Backend    | Node.js + Express.js                            |
| Database   | MongoDB + Mongoose                              |
| Auth       | JWT + bcryptjs                                  |

---

## 📁 Folder Structure

```
taskflow/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   └── employeeController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Employee.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   └── employeeRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── shared/
    │   │       ├── Loader.jsx
    │   │       ├── Sidebar.jsx
    │   │       ├── StatCard.jsx
    │   │       └── StatusBadge.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── AdminLogin.jsx
    │   │   │   ├── EmployeeLogin.jsx
    │   │   │   └── EmployeeRegister.jsx
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── AdminLayout.jsx
    │   │   │   ├── AssignTask.jsx
    │   │   │   ├── EmployeeManagement.jsx
    │   │   │   └── TaskManagement.jsx
    │   │   ├── employee/
    │   │   │   ├── EmployeeDashboard.jsx
    │   │   │   ├── EmployeeLayout.jsx
    │   │   │   └── MyTasks.jsx
    │   │   └── Landing.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher
- **MongoDB** (local) or a **MongoDB Atlas** URI
- **npm** or **yarn**

---

## 🛠️ Setup & Run Instructions

### 1. Clone / Extract the Project

```bash
# If downloaded as zip, extract it
cd taskflow
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env and set your MONGODB_URI if using Atlas
```

**`.env` file contents:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=taskflow_super_secret_jwt_key_2024
NODE_ENV=development
```

### 3. Seed Default Admin

```bash
# Inside the backend folder
npm run seed
```

This creates the default admin account:
- **Email:** `admin@gmail.com`
- **Password:** `admin123`

### 4. Start the Backend

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 5. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
# App runs on http://localhost:5173
```

---

## 🌐 Accessing the App

Open your browser and go to:

```
http://localhost:5173
```

You'll see the **Landing Page** with two portals.

---

## 👤 Default Admin Credentials

| Field    | Value             |
|----------|-------------------|
| Email    | admin@gmail.com   |
| Password | admin123          |

---

## 🔄 Typical Workflow

1. **Admin logs in** → `admin@gmail.com` / `admin123`
2. **Employee registers** via the Employee Portal → Register page
3. **Admin approves** the employee in "Employee Management"
4. **Admin assigns** a task in "Assign Task" page
5. **Employee logs in** and sees their tasks on the dashboard
6. **Employee updates** task status (Pending → In Progress → Completed)
7. **Admin monitors** all tasks in "Task Monitor"

---

## 📡 API Reference

### Admin Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | `/api/admin/login`          | Admin login              |
| GET    | `/api/admin/employees`      | Get all employees        |
| PUT    | `/api/admin/approve/:id`    | Toggle employee approval |
| POST   | `/api/admin/assign-task`    | Assign a task            |
| GET    | `/api/admin/tasks`          | Get all tasks            |
| GET    | `/api/admin/stats`          | Dashboard statistics     |
| DELETE | `/api/admin/tasks/:id`      | Delete a task            |

### Employee Endpoints

| Method | Endpoint                         | Description              |
|--------|----------------------------------|--------------------------|
| POST   | `/api/employee/register`         | Register employee        |
| POST   | `/api/employee/login`            | Employee login           |
| GET    | `/api/employee/tasks`            | Get my tasks             |
| PUT    | `/api/employee/update-task/:id`  | Update task status       |
| GET    | `/api/employee/stats`            | My task statistics       |

---

## ✨ Features

### Admin Portal
- ✅ Secure JWT login
- ✅ Dashboard with live stats & charts (Recharts)
- ✅ Employee list with search & filter
- ✅ One-click approve / revoke access
- ✅ Assign tasks with priority, due date
- ✅ Task monitor with status filtering
- ✅ Delete tasks with confirmation

### Employee Portal
- ✅ Register and wait for approval
- ✅ Login blocked until approved
- ✅ Personal dashboard with progress ring
- ✅ View all assigned tasks
- ✅ Update task status via dropdown
- ✅ Search & filter tasks

### UI/UX
- ✅ Premium SaaS-style design
- ✅ Framer Motion animations
- ✅ Fully responsive (mobile/tablet/desktop)
- ✅ Collapsible mobile sidebar drawer
- ✅ Toast notifications
- ✅ Loading skeletons
- ✅ Empty states
- ✅ Tailwind CSS utility-first styling

---

## 🔧 Build for Production

```bash
# Frontend
cd frontend
npm run build
# Output in frontend/dist/

# Backend (no build needed, just run)
cd backend
npm start
```

---

## 🐛 Troubleshooting

**MongoDB connection failed?**
- Make sure MongoDB is running locally: `mongod`
- Or update `MONGODB_URI` in `.env` to your Atlas connection string

**Port already in use?**
- Change `PORT` in `backend/.env`
- Change `server.port` in `frontend/vite.config.js`

**Employee can't login?**
- Admin must approve the employee account first

---

## 📄 License

MIT — feel free to use and modify.
