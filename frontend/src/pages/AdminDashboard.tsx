import React, { useState, useEffect } from 'react';
import { Users, Building2, FileText, CheckCircle, XCircle, Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { VerificationBadge } from '@/components/VerificationBadge';
import {
  getStudents, saveStudents, getRecruiters, saveRecruiters,
  Student, Recruiter
} from '@/utils/seedData';

type Tab = 'students' | 'recruiters' | 'documents';

interface AdminDashboardProps {
  navigate: (page: string) => void;
}

export function AdminDashboard({ navigate }: AdminDashboardProps) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('login');
      return;
    }
    loadData();
  }, [currentUser]);

  const loadData = () => {
    setStudents(getStudents());
    setRecruiters(getRecruiters());
  };

  const updateStudentStatus = (id: string, verified: boolean, status: Student['verificationStatus']) => {
    const all = getStudents();
    const updated = all.map(s => s.id === id ? { ...s, verified, verificationStatus: status } : s);
    saveStudents(updated);
    setStudents(updated);
    showToast(`Student status updated to ${status}`, 'success');
  };

  const updateRecruiterStatus = (id: string, verified: boolean, status: Recruiter['verificationStatus']) => {
    const all = getRecruiters();
    const updated = all.map(r => r.id === id ? { ...r, verified, verificationStatus: status } : r);
    saveRecruiters(updated);
    setRecruiters(updated);
    showToast(`Recruiter status updated to ${status}`, 'success');
  };

  const updateCertStatus = (studentId: string, certId: string, status: 'pending' | 'approved' | 'rejected' | 'more_info') => {
    const all = getStudents();
    const updated = all.map(s =>
      s.id === studentId
        ? { ...s, certificates: s.certificates.map(c => c.id === certId ? { ...c, status } : c) }
        : s
    );
    saveStudents(updated);
    setStudents(updated);
    showToast('Document status updated', 'success');
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
    { id: 'recruiters', label: 'Recruiters', icon: <Building2 className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage students, recruiters, and documents</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Students', value: students.length, color: 'text-blue-600 bg-blue-50' },
            { label: 'Verified Students', value: students.filter(s => s.verified).length, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Total Recruiters', value: recruiters.length, color: 'text-indigo-600 bg-indigo-50' },
            { label: 'Verified Recruiters', value: recruiters.filter(r => r.verified).length, color: 'text-purple-600 bg-purple-50' },
          ].map(stat => (
            <div key={stat.label} className={`p-4 rounded-xl border border-slate-200 bg-white shadow-card`}>
              <p className={`text-2xl font-bold font-display ${stat.color.split(' ')[0]}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
          <div className="flex border-b border-slate-200">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors ${tab === t.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Students Tab */}
            {tab === 'students' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900">All Students ({students.length})</h2>
                  <Button size="sm" variant="outline" onClick={loadData}>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
                  </Button>
                </div>
                {students.length === 0 ? (
                  <p className="text-slate-500 text-sm">No students registered yet.</p>
                ) : (
                  <div className="space-y-3">
                    {students.map(student => (
                      <div key={student.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-slate-900">{student.name}</p>
                              <VerificationBadge status={student.verificationStatus} size="sm" />
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5">{student.email}</p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {student.skills.map(s => (
                                <span key={s} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{s}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0 flex-wrap">
                            <Button
                              size="sm"
                              onClick={() => updateStudentStatus(student.id, true, 'verified')}
                              disabled={student.verificationStatus === 'verified'}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 text-xs"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" /> Verify
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateStudentStatus(student.id, false, 'rejected')}
                              disabled={student.verificationStatus === 'rejected'}
                              className="bg-red-600 hover:bg-red-700 text-white border-0 text-xs"
                            >
                              <XCircle className="w-3 h-3 mr-1" /> Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStudentStatus(student.id, false, 'more_info')}
                              disabled={student.verificationStatus === 'more_info'}
                              className="text-xs"
                            >
                              <Info className="w-3 h-3 mr-1" /> More Info
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recruiters Tab */}
            {tab === 'recruiters' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900">All Recruiters ({recruiters.length})</h2>
                  <Button size="sm" variant="outline" onClick={loadData}>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
                  </Button>
                </div>
                {recruiters.length === 0 ? (
                  <p className="text-slate-500 text-sm">No recruiters registered yet.</p>
                ) : (
                  <div className="space-y-3">
                    {recruiters.map(recruiter => (
                      <div key={recruiter.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-slate-900">{recruiter.companyName}</p>
                              <VerificationBadge status={recruiter.verificationStatus} size="sm" />
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5">{recruiter.name} · {recruiter.email}</p>
                            <p className="text-xs text-slate-400 mt-0.5">DIN: {recruiter.dinNumber} · CIN: {recruiter.cinNumber}</p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0 flex-wrap">
                            <Button
                              size="sm"
                              onClick={() => updateRecruiterStatus(recruiter.id, true, 'verified')}
                              disabled={recruiter.verificationStatus === 'verified'}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 text-xs"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" /> Verify
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateRecruiterStatus(recruiter.id, false, 'rejected')}
                              disabled={recruiter.verificationStatus === 'rejected'}
                              className="bg-red-600 hover:bg-red-700 text-white border-0 text-xs"
                            >
                              <XCircle className="w-3 h-3 mr-1" /> Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRecruiterStatus(recruiter.id, false, 'more_info')}
                              disabled={recruiter.verificationStatus === 'more_info'}
                              className="text-xs"
                            >
                              <Info className="w-3 h-3 mr-1" /> More Info
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {tab === 'documents' && (
              <div>
                <h2 className="font-semibold text-slate-900 mb-4">All Documents</h2>
                {students.every(s => s.certificates.length === 0 && !s.resumeFilename) ? (
                  <p className="text-slate-500 text-sm">No documents uploaded yet.</p>
                ) : (
                  <div className="space-y-4">
                    {students.map(student => {
                      const hasDocs = student.resumeFilename || student.certificates.length > 0;
                      if (!hasDocs) return null;
                      return (
                        <div key={student.id} className="border border-slate-200 rounded-xl overflow-hidden">
                          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                            <p className="font-medium text-slate-900 text-sm">{student.name}</p>
                            <p className="text-xs text-slate-500">{student.email}</p>
                          </div>
                          <div className="p-4 space-y-2">
                            {student.resumeFilename && (
                              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-slate-400" />
                                  <div>
                                    <p className="text-sm font-medium text-slate-900">{student.resumeFilename}</p>
                                    <p className="text-xs text-slate-500">Resume</p>
                                  </div>
                                </div>
                                <span className="badge-pending text-xs">Pending</span>
                              </div>
                            )}
                            {student.certificates.map(cert => (
                              <div key={cert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 gap-3">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{cert.filename}</p>
                                    <p className="text-xs text-slate-500">Certificate · {cert.uploadDate}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <select
                                    value={cert.status}
                                    onChange={e => updateCertStatus(student.id, cert.id, e.target.value as 'pending' | 'approved' | 'rejected' | 'more_info')}
                                    className="text-xs rounded border border-slate-200 bg-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="more_info">Need More Info</option>
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
