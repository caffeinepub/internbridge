import React, { useState, useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/Toast';
import { Navbar } from '@/components/Navbar';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { StudentDashboard } from '@/pages/StudentDashboard';
import { RecruiterDashboard } from '@/pages/RecruiterDashboard';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { SearchInternships } from '@/pages/SearchInternships';
import { Assessment } from '@/pages/Assessment';
import { Applications } from '@/pages/Applications';
import { seedData } from '@/utils/seedData';

export type Page =
  | 'home'
  | 'login'
  | 'register'
  | 'register-recruiter'
  | 'student-dashboard'
  | 'recruiter-dashboard'
  | 'admin-dashboard'
  | 'search'
  | 'assessment'
  | 'applications';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    seedData();
  }, []);

  const navigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home navigate={navigate} />;
      case 'login':
        return <Login navigate={navigate} />;
      case 'register':
        return <Register navigate={navigate} initialTab="student" />;
      case 'register-recruiter':
        return <Register navigate={navigate} initialTab="recruiter" />;
      case 'student-dashboard':
        return <StudentDashboard navigate={navigate} />;
      case 'recruiter-dashboard':
        return <RecruiterDashboard navigate={navigate} />;
      case 'admin-dashboard':
        return <AdminDashboard navigate={navigate} />;
      case 'search':
        return <SearchInternships navigate={navigate} />;
      case 'assessment':
        return <Assessment navigate={navigate} />;
      case 'applications':
        return <Applications navigate={navigate} />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  // Pages that should NOT show the navbar (they have their own full-page layout)
  const noNavbarPages: Page[] = [];
  const showNavbar = !noNavbarPages.includes(currentPage);

  return (
    <div className="min-h-screen bg-background">
      {showNavbar && <Navbar currentPage={currentPage} navigate={navigate} />}
      {renderPage()}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
