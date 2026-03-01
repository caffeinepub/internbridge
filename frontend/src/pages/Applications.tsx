import React, { useState, useEffect } from 'react';
import { ClipboardList, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { StatusPill } from '@/components/StatusPill';
import { getApplications, saveApplications, getInternships, Application, Internship } from '@/utils/seedData';

interface ApplicationsProps {
  navigate: (page: string) => void;
}

export function Applications({ navigate }: ApplicationsProps) {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);

  useEffect(() => {
    if (!currentUser) {
      navigate('login');
      return;
    }
    loadData();
  }, [currentUser]);

  const loadData = () => {
    const allApps = getApplications();
    const allInternships = getInternships();
    setInternships(allInternships);

    if (currentUser?.role === 'student') {
      setApplications(allApps.filter(a => a.studentId === currentUser.id));
    } else if (currentUser?.role === 'recruiter') {
      const myInternshipIds = allInternships
        .filter(i => i.recruiterId === currentUser.id)
        .map(i => i.id);
      setApplications(allApps.filter(a => myInternshipIds.includes(a.internshipId)));
    }
  };

  const handleStatusChange = (appId: string, newStatus: Application['status']) => {
    const allApps = getApplications();
    const updated = allApps.map(a => a.id === appId ? { ...a, status: newStatus } : a);
    saveApplications(updated);
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
  };

  if (!currentUser) return null;

  // Student view
  if (currentUser.role === 'student') {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-slate-900">My Applications</h1>
            <p className="text-slate-500 text-sm mt-1">{applications.length} application(s)</p>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-12 text-center">
              <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No applications yet</p>
              <p className="text-slate-400 text-sm mt-1">Browse internships and apply to get started</p>
              <Button size="sm" className="mt-4 gradient-primary text-white border-0" onClick={() => navigate('search')}>
                Browse Internships
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map(app => (
                <div key={app.id} className="bg-white rounded-xl border border-slate-200 shadow-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{app.designation}</p>
                        <p className="text-sm text-slate-500">{app.companyName}</p>
                        <p className="text-xs text-slate-400 mt-1">Applied on {app.appliedDate}</p>
                      </div>
                    </div>
                    <StatusPill status={app.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Recruiter view
  if (currentUser.role === 'recruiter') {
    const myInternships = internships.filter(i => i.recruiterId === currentUser.id);

    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-slate-900">Application Management</h1>
            <p className="text-slate-500 text-sm mt-1">{applications.length} total application(s)</p>
          </div>

          {myInternships.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-12 text-center">
              <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No internships posted yet</p>
              <Button size="sm" className="mt-4 gradient-primary text-white border-0" onClick={() => navigate('recruiter-dashboard')}>
                Post an Internship
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {myInternships.map(intern => {
                const internApps = applications.filter(a => a.internshipId === intern.id);
                return (
                  <div key={intern.id} className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
                    <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">{intern.designation}</h3>
                          <p className="text-sm text-slate-500">{intern.companyName} · {intern.workType}</p>
                        </div>
                        <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                          {internApps.length} applicant(s)
                        </span>
                      </div>
                    </div>
                    {internApps.length === 0 ? (
                      <p className="text-sm text-slate-400 p-5">No applications yet.</p>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {internApps.map(app => (
                          <div key={app.id} className="flex items-center justify-between p-4 gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 text-sm">{app.studentName}</p>
                              <p className="text-xs text-slate-500">{app.studentEmail} · Applied {app.appliedDate}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <StatusPill status={app.status} />
                              <select
                                value={app.status}
                                onChange={e => handleStatusChange(app.id, e.target.value as Application['status'])}
                                className="text-xs rounded border border-slate-200 bg-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                              >
                                <option value="applied">Applied</option>
                                <option value="under_review">Under Review</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
