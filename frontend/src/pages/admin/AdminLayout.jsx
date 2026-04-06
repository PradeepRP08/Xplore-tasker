import React from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, PlusSquare } from 'lucide-react';
import Sidebar from '../../components/shared/Sidebar';

const navItems = [
  { path: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/employees',  icon: Users,            label: 'Employees' },
  { path: '/admin/tasks',      icon: ClipboardList,    label: 'Task Monitor' },
  { path: '/admin/assign-task',icon: PlusSquare,       label: 'Assign Task' },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--quantum-bg)] text-white">
      <Sidebar navItems={navItems} role="admin" />
      <main className="flex-1 min-w-0 lg:overflow-y-auto">
        <div className="pt-16 lg:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
