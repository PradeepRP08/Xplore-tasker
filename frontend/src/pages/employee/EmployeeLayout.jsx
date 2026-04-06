import React from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, ClipboardList } from 'lucide-react';
import Sidebar from '../../components/shared/Sidebar';

const navItems = [
  { path: '/employee/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/employee/tasks',     icon: ClipboardList,    label: 'My Tasks' },
];

export default function EmployeeLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--quantum-bg)] text-white">
      <Sidebar navItems={navItems} role="employee" />
      <main className="flex-1 min-w-0">
        <div className="pt-16 lg:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
