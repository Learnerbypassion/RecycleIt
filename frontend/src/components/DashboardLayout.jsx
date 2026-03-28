import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="flex-1 p-6 max-w-[1200px] mx-auto overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
