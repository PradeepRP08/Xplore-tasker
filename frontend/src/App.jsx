import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import AdminLogin from './pages/auth/AdminLogin';
import EmployeeLogin from './pages/auth/EmployeeLogin';
import EmployeeRegister from './pages/auth/EmployeeRegister';
import Landing from './pages/Landing';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import TaskManagement from './pages/admin/TaskManagement';
import AssignTask from './pages/admin/AssignTask';

// Employee Pages
import EmployeeLayout from './pages/employee/EmployeeLayout';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyTasks from './pages/employee/MyTasks';

const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
};

const ProtectedEmployeeRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'employee') return <Navigate to="/employee/login" replace />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin/login" element={
        user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />
      } />
      <Route path="/employee/login" element={
        user?.role === 'employee' ? <Navigate to="/employee/dashboard" replace /> : <EmployeeLogin />
      } />
      <Route path="/employee/register" element={<EmployeeRegister />} />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employees" element={<EmployeeManagement />} />
        <Route path="tasks" element={<TaskManagement />} />
        <Route path="assign-task" element={<AssignTask />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Employee Routes */}
      <Route path="/employee" element={
        <ProtectedEmployeeRoute><EmployeeLayout /></ProtectedEmployeeRoute>
      }>
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="tasks" element={<MyTasks />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              borderRadius: '12px',
              padding: '14px 18px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#fff' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
