import React, { useState } from 'react';
import { Menu, X, GraduationCap, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

type Page = string;

interface NavbarProps {
  currentPage: Page;
  navigate: (page: Page) => void;
}

export function Navbar({ currentPage, navigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('home');
    setMobileOpen(false);
  };

  const handleNav = (page: Page) => {
    navigate(page);
    setMobileOpen(false);
  };

  const getDashboardPage = () => {
    if (!currentUser) return 'login';
    if (currentUser.role === 'student') return 'student-dashboard';
    if (currentUser.role === 'recruiter') return 'recruiter-dashboard';
    return 'admin-dashboard';
  };

  const getRoleLabel = () => {
    if (!currentUser) return '';
    if (currentUser.role === 'admin') return 'Admin';
    if (currentUser.role === 'student') return 'Student';
    return 'Recruiter';
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
              Intern<span className="gradient-text">Bridge</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 'home' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('search')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 'search' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              Internships
            </button>
            {!currentUser ? (
              <>
                <button
                  onClick={() => handleNav('login')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 'login' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Login
                </button>
                <Button
                  size="sm"
                  onClick={() => handleNav('register')}
                  className="ml-2 gradient-primary text-white border-0 hover:opacity-90"
                >
                  Register
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => handleNav(getDashboardPage())}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span>{currentUser.name}</span>
                  <span className="text-xs text-slate-400">({getRoleLabel()})</span>
                </button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-slate-600"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 flex flex-col gap-1">
          <button onClick={() => handleNav('home')} className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Home</button>
          <button onClick={() => handleNav('search')} className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Internships</button>
          {!currentUser ? (
            <>
              <button onClick={() => handleNav('login')} className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Login</button>
              <button onClick={() => handleNav('register')} className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50">Register</button>
            </>
          ) : (
            <>
              <button onClick={() => handleNav(getDashboardPage())} className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                Dashboard ({getRoleLabel()})
              </button>
              <button onClick={handleLogout} className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
