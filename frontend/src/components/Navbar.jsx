import { NavLink } from 'react-router-dom';
import { HiOutlineBell } from 'react-icons/hi';

const tabs = [
  { to: '/dashboard', label: 'Home' },
  { to: '/impact', label: 'Impact' },
];

export default function Navbar() {
  return (
    <header className="h-[60px] bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Left — Logo + Title + Tabs */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="M8 12l3 3 5-5"/>
            </svg>
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-gray-900 leading-tight">RecycleIt</h1>
            <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">The Living Ledger</p>
          </div>
        </div>

        <div className="w-px h-7 bg-gray-200" />

        <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>

        <nav className="flex items-center gap-1">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Right — Notification only */}
      <div className="flex items-center">
        <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors duration-200">
          <HiOutlineBell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
