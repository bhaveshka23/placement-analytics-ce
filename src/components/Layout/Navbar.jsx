import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, User, ChevronDown, LogOut } from 'lucide-react';
import { logoutUser } from '../../services/authApi';

export default function Navbar({ onToggleSidebar }) {
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();

  const userName = useMemo(
    () => localStorage.getItem('userName') || 'User',
    []
  );

  const userRole = useMemo(
    () => (localStorage.getItem('isAdmin') === 'true'
      ? 'Administrator'
      : 'Student'),
    []
  );

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore logout failures and clear client state.
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          <Menu size={20} />
        </button>
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students, companies..."
            className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200 rounded-lg px-2 py-1.5 transition-colors">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <User size={16} className="text-indigo-600" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700 leading-none">{userName}</p>
            <p className="text-xs text-gray-400 mt-0.5">{userRole}</p>
          </div>
          
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <LogOut size={16} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
}
