import { NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineLogout } from 'react-icons/hi';

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'user';

  const tabs = [
    { to: '/dashboard', label: 'Home' },
    ...(role === 'user' ? [{ to: '/report', label: 'Report Waste' }] : []),
    ...(role === 'user' ? [{ to: '/my-reports', label: 'My Reports' }] : []),
    ...(role === 'user' ? [{ to: '/impact', label: 'Impact' }] : [{ to: '/history', label: 'History' }]),
  ];

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('collectorId');
    navigate('/');
  };

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
          <span className="ml-2 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-gray-100 text-gray-600 rounded-md border border-gray-200">
            {role} mode
          </span>
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

      {/* Right — Logout */}
      <div className="flex items-center gap-4">
        <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
          <HiOutlineLogout className="w-4 h-4" />
          Exit
        </button>
      </div>
    </header>
  );
}
