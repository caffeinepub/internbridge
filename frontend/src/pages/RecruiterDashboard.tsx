import React, { useState, useEffect } from 'react';
import {
  Building2, Shield, PlusCircle, List, Users, CheckCircle, Clock, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { VerificationBadge } from '@/components/VerificationBadge';
import { StatusPill } from '@/components/StatusPill';
import {
  getRecruiters, getInternships, saveInternships, getApplications, saveApplications,
  Recruiter, Internship, Application
} from '@/utils/seedData';

type Section = 'profile' | 'verification' | 'post' | 'postings' | 'applicants';

interface RecruiterDashboardProps {
  navigate: (page: string) => void;
}

const SKILLS = ['EXCEL', 'Power BI', 'SQL', 'Python'];
const WORK_TYPES: Array<'Offline' | 'Online' | 'Hybrid'> = ['Offline', 'Online', 'Hybrid'];

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
  { id: 'verification', label: 'Verification Status', icon: <Shield className="w-4 h-4" /> },
  { id: 'post', label: 'Post Internship', icon: <PlusCircle className="w-4 h-4" /> },
  { id: 'postings', label: 'My Postings', icon: <List className="w-4 h-4" /> },
  { id: 'applicants', label: 'Applicants', icon: <Users className="w-4 h-4" /> },
];

export function RecruiterDashboard({ navigate }: RecruiterDashboardProps) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [section, setSection] = useState<Section>('profile');
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  // Post form state
  const [designation, setDesignation] = useState('');
  const [duration, setDuration] = useState('');
  const [stipend, setStipend] = useState('');
  const [workType, setWorkType] = useState<'Offline' | 'Online' | 'Hybrid'>('Online');
  const [reqSkills, setReqSkills] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [postErrors, setPostErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'recruiter') {
      navigate('login');
      return;
    }
    loadData();
  }, [currentUser]);

  const loadData = () => {
    const recruiters = getRecruiters();
    const r = recruiters.find(r => r.id === currentUser?.id);
    if (r) setRecruiter(r);
    const allInternships = getInternships();
    const myInternships = allInternships.filter(i => i.recruiterId === currentUser?.id);
    setInternships(myInternships);
    const allApps = getApplications();
    const myApps = allApps.filter(a => myInternships.some(i => i.id === a.internshipId));
    setApplications(myApps);
  };

  const toggleSkill = (skill: string) => {
    setReqSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handlePostInternship = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!designation.trim()) errs.designation = 'Designation is required';
    if (!duration.trim()) errs.duration = 'Duration is required';
    if (!stipend.trim()) errs.stipend = 'Stipend is required';
    if (!description.trim()) errs.description = 'Description is required';
    if (reqSkills.length === 0) errs.skills = 'Select at least one skill';
    if (Object.keys(errs).length > 0) { setPostErrors(errs); return; }
    setPostErrors({});

    const allInternships = getInternships();
    const newInternship: Internship = {
      id: `intern-${Date.now()}`,
      recruiterId: currentUser!.id,
      companyName: recruiter!.companyName,
      designation,
      duration,
      stipend,
      workType,
      skillsRequired: reqSkills,
      description,
      postedDate: new Date().toISOString().split('T')[0],
    };
    saveInternships([...allInternships, newInternship]);
    setInternships(prev => [...prev, newInternship]);
    // Reset form
    setDesignation('');
    setDuration('');
    setStipend('');
    setWorkType('Online');
    setReqSkills([]);
    setDescription('');
    showToast('Internship posted successfully!', 'success');
    setSection('postings');
  };

  const handleStatusChange = (appId: string, newStatus: Application['status']) => {
    const allApps = getApplications();
    const updated = allApps.map(a => a.id === appId ? { ...a, status: newStatus } : a);
    saveApplications(updated);
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    showToast('Application status updated!', 'success');
  };

  if (!recruiter) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-slate-900">Recruiter Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {recruiter.name}!</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-card sticky top-24">
              <nav className="space-y-1">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSection(item.id)}
                    className={`sidebar-nav-item w-full ${section === item.id ? 'sidebar-nav-item-active' : 'sidebar-nav-item-inactive'}`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile tabs */}
          <div className="lg:hidden overflow-x-auto">
            <div className="flex gap-2 pb-2 min-w-max">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${section === item.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Company Profile */}
            {section === 'profile' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
                <h2 className="font-display text-lg font-semibold text-slate-900 mb-6">Company Profile</h2>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">{recruiter.companyName}</h3>
                    <VerificationBadge status={recruiter.verificationStatus} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Contact Name', value: recruiter.name },
                    { label: 'Email', value: recruiter.email },
                    { label: 'Phone', value: recruiter.phone },
                    { label: 'Owner Name', value: recruiter.ownerName },
                    { label: 'Owner ID Proof', value: recruiter.ownerIdProof },
                    { label: 'DIN Number', value: recruiter.dinNumber },
                    { label: 'CIN Number', value: recruiter.cinNumber },
                  ].map(field => (
                    <div key={field.label} className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">{field.label}</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">{field.value}</p>
                    </div>
                  ))}
                  <div className="p-3 bg-slate-50 rounded-lg sm:col-span-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Address</p>
                    <p className="text-sm font-medium text-slate-900 mt-0.5">{recruiter.address}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Status */}
            {section === 'verification' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
                <h2 className="font-display text-lg font-semibold text-slate-900 mb-6">Verification Status</h2>
                <div className={`p-6 rounded-xl border-2 text-center ${recruiter.verified ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                  {recruiter.verified ? (
                    <>
                      <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                      <h3 className="font-display text-xl font-bold text-emerald-700 mb-1">Verified Employer</h3>
                      <p className="text-emerald-600 text-sm">Your company has been verified by our admin team. You can post internships and hire talent.</p>
                    </>
                  ) : (
                    <>
                      <Clock className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                      <h3 className="font-display text-xl font-bold text-amber-700 mb-1">Pending Verification</h3>
                      <p className="text-amber-600 text-sm">Your company verification is pending. Our admin team will review your documents and verify your account.</p>
                      {recruiter.verificationStatus === 'more_info' && (
                        <p className="text-blue-600 text-sm mt-2 font-medium">Admin has requested more information. Please contact support.</p>
                      )}
                      {recruiter.verificationStatus === 'rejected' && (
                        <p className="text-red-600 text-sm mt-2 font-medium">Your verification was rejected. Please contact support for more details.</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Post Internship */}
            {section === 'post' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
                <h2 className="font-display text-lg font-semibold text-slate-900 mb-6">Post New Internship</h2>
                <form onSubmit={handlePostInternship} className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Company Name</Label>
                    <Input value={recruiter.companyName} disabled className="mt-1.5 bg-slate-50" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700">Designation *</Label>
                      <Input value={designation} onChange={e => setDesignation(e.target.value)} placeholder="e.g. Data Analyst Intern" className="mt-1.5" />
                      {postErrors.designation && <p className="text-red-500 text-xs mt-1">{postErrors.designation}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700">Duration *</Label>
                      <Input value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 3 months" className="mt-1.5" />
                      {postErrors.duration && <p className="text-red-500 text-xs mt-1">{postErrors.duration}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-700">Stipend *</Label>
                      <Input value={stipend} onChange={e => setStipend(e.target.value)} placeholder="e.g. ₹15,000/month" className="mt-1.5" />
                      {postErrors.stipend && <p className="text-red-500 text-xs mt-1">{postErrors.stipend}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700">Work Type *</Label>
                      <select
                        value={workType}
                        onChange={e => setWorkType(e.target.value as 'Offline' | 'Online' | 'Hybrid')}
                        className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {WORK_TYPES.map(wt => <option key={wt} value={wt}>{wt}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Skills Required *</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {SKILLS.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${reqSkills.includes(skill) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'}`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                    {postErrors.skills && <p className="text-red-500 text-xs mt-1">{postErrors.skills}</p>}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Description *</Label>
                    <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the internship role, responsibilities, and requirements..." className="mt-1.5" rows={4} />
                    {postErrors.description && <p className="text-red-500 text-xs mt-1">{postErrors.description}</p>}
                  </div>
                  <Button type="submit" className="gradient-primary text-white border-0 hover:opacity-90">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Post Internship
                  </Button>
                </form>
              </div>
            )}

            {/* My Postings */}
            {section === 'postings' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-lg font-semibold text-slate-900">My Internship Postings</h2>
                  <Button size="sm" className="gradient-primary text-white border-0" onClick={() => setSection('post')}>
                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Post New
                  </Button>
                </div>
                {internships.length === 0 ? (
                  <div className="text-center py-12">
                    <List className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No internships posted yet.</p>
                    <Button size="sm" className="mt-4 gradient-primary text-white border-0" onClick={() => setSection('post')}>
                      Post Your First Internship
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {internships.map(intern => (
                      <div key={intern.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{intern.designation}</h3>
                            <p className="text-sm text-slate-500 mt-0.5">{intern.duration} · {intern.stipend} · {intern.workType}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {intern.skillsRequired.map(s => (
                                <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">{s}</span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs text-slate-400">{intern.postedDate}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {applications.filter(a => a.internshipId === intern.id).length} applicant(s)
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Applicants */}
            {section === 'applicants' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
                <h2 className="font-display text-lg font-semibold text-slate-900 mb-6">Application Management</h2>
                {internships.length === 0 ? (
                  <p className="text-slate-500 text-sm">No internships posted yet.</p>
                ) : (
                  <div className="space-y-6">
                    {internships.map(intern => {
                      const internApps = applications.filter(a => a.internshipId === intern.id);
                      return (
                        <div key={intern.id}>
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-semibold text-slate-900">{intern.designation}</h3>
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                              {internApps.length} applicant(s)
                            </span>
                          </div>
                          {internApps.length === 0 ? (
                            <p className="text-sm text-slate-400 pl-2">No applications yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {internApps.map(app => (
                                <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{app.studentName}</p>
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
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
