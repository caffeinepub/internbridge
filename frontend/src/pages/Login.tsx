import React, { useState } from 'react';
import { GraduationCap, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { getStudents, getRecruiters } from '@/utils/seedData';

interface LoginProps {
  navigate: (page: string) => void;
}

export function Login({ navigate }: LoginProps) {
  const [tab, setTab] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));

    const students = getStudents();
    const student = students.find(s => s.email === email && s.password === password);
    if (student) {
      login({ id: student.id, role: 'student', email: student.email, name: student.name });
      navigate('student-dashboard');
      setLoading(false);
      return;
    }

    const recruiters = getRecruiters();
    const recruiter = recruiters.find(r => r.email === email && r.password === password);
    if (recruiter) {
      login({ id: recruiter.id, role: 'recruiter', email: recruiter.email, name: recruiter.name });
      navigate('recruiter-dashboard');
      setLoading(false);
      return;
    }

    setError('Invalid email or password. Please try again.');
    setLoading(false);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));

    if (adminUser === 'admin' && adminPass === 'admin') {
      login({ id: 'admin-001', role: 'admin', email: 'admin@internbridge.com', name: 'Administrator' });
      navigate('admin-dashboard');
    } else {
      setError('Invalid admin credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your InternBridge account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => { setTab('user'); setError(''); }}
              className={`flex-1 py-3.5 text-sm font-medium transition-colors ${tab === 'user' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Student / Recruiter
            </button>
            <button
              onClick={() => { setTab('admin'); setError(''); }}
              className={`flex-1 py-3.5 text-sm font-medium transition-colors ${tab === 'admin' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Admin Login
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {tab === 'user' ? (
              <form onSubmit={handleUserLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="password"
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-primary text-white border-0 hover:opacity-90" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                <div className="text-center text-sm text-slate-500 mt-2">
                  <span className="text-xs text-slate-400">Demo: priya@example.com / password123</span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <Label htmlFor="adminUser" className="text-sm font-medium text-slate-700">Username</Label>
                  <Input
                    id="adminUser"
                    type="text"
                    value={adminUser}
                    onChange={e => setAdminUser(e.target.value)}
                    placeholder="admin"
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="adminPass" className="text-sm font-medium text-slate-700">Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="adminPass"
                      type={showPass ? 'text' : 'password'}
                      value={adminPass}
                      onChange={e => setAdminPass(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-primary text-white border-0 hover:opacity-90" disabled={loading}>
                  {loading ? 'Signing in...' : 'Admin Sign In'}
                </Button>
                <div className="text-center">
                  <span className="text-xs text-slate-400">Credentials: admin / admin</span>
                </div>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{' '}
          <button onClick={() => navigate('register')} className="text-blue-600 font-medium hover:underline">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}
