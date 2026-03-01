import React, { useState, useEffect } from 'react';
import {
  User, Award, FileText, BookOpen, Search, ClipboardList,
  Edit2, Save, X, Upload, Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { VerificationBadge } from '@/components/VerificationBadge';
import { StatusPill } from '@/components/StatusPill';
import { getStudents, saveStudents, getApplications, Student, Application, Certificate } from '@/utils/seedData';
import { fileToBase64 } from '@/utils/fileHelpers';

type Section = 'profile' | 'skills' | 'documents' | 'assessment' | 'search' | 'applications';

interface StudentDashboardProps {
  navigate: (page: string) => void;
}

const SKILLS = ['EXCEL', 'Power BI', 'SQL', 'Python'];

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  { id: 'skills', label: 'Skills', icon: <Award className="w-4 h-4" /> },
  { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
  { id: 'assessment', label: 'Skill Assessment', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'search', label: 'Search Internships', icon: <Search className="w-4 h-4" /> },
  { id: 'applications', label: 'My Applications', icon: <ClipboardList className="w-4 h-4" /> },
];

// Map Certificate status to VerificationBadge status
function certStatusToVerification(status: Certificate['status']): 'verified' | 'pending' | 'rejected' | 'more_info' {
  if (status === 'approved') return 'verified';
  return status;
}

export function StudentDashboard({ navigate }: StudentDashboardProps) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [section, setSection] = useState<Section>('profile');
  const [student, setStudent] = useState<Student | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editSkills, setEditSkills] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'student') {
      navigate('login');
      return;
    }
    loadData();
  }, [currentUser]);

  const loadData = () => {
    const students = getStudents();
    const s = students.find(s => s.id === currentUser?.id);
    if (s) {
      setStudent(s);
      setEditName(s.name);
      setEditMobile(s.mobile);
      setEditSkills([...s.skills]);
    }
    const apps = getApplications().filter(a => a.studentId === currentUser?.id);
    setApplications(apps);
  };

  const handleSaveProfile = () => {
    if (!student) return;
    const students = getStudents();
    const updated = students.map(s =>
      s.id === student.id ? { ...s, name: editName, mobile: editMobile, skills: editSkills } : s
    );
    saveStudents(updated);
    setStudent(prev => prev ? { ...prev, name: editName, mobile: editMobile, skills: editSkills } : prev);
    setEditing(false);
    showToast('Profile updated successfully!', 'success');
  };

  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !student) return;
    const base64 = await fileToBase64(file);
    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      filename: file.name,
      data: base64,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    const students = getStudents();
    const updated = students.map(s =>
      s.id === student.id ? { ...s, certificates: [...s.certificates, newCert] } : s
    );
    saveStudents(updated);
    setStudent(prev => prev ? { ...prev, certificates: [...prev.certificates, newCert] } : prev);
    showToast('Certificate uploaded successfully!', 'success');
    e.target.value = '';
  };

  if (!student) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-slate-900">Student Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {student.name}!</p>
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
            {/* Profile */}
            {section === 'profile' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-lg font-semibold text-slate-900">My Profile</h2>
                  {!editing ? (
                    <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                      <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveProfile} className="gradient-primary text-white border-0">
                        <Save className="w-3.5 h-3.5 mr-1.5" /> Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Photo */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200">
                      {student.photo ? (
                        <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="w-8 h-8 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <VerificationBadge status={student.verificationStatus} size="sm" />
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-slate-500 uppercase tracking-wide">Full Name</Label>
                      {editing ? (
                        <Input value={editName} onChange={e => setEditName(e.target.value)} className="mt-1" />
                      ) : (
                        <p className="text-slate-900 font-medium mt-1">{student.name}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500 uppercase tracking-wide">Email</Label>
                      <p className="text-slate-900 font-medium mt-1">{student.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500 uppercase tracking-wide">Mobile</Label>
                      {editing ? (
                        <Input value={editMobile} onChange={e => setEditMobile(e.target.value)} className="mt-1" />
                      ) : (
                        <p className="text-slate-900 font-medium mt-1">{student.mobile}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500 uppercase tracking-wide">Date of Birth</Label>
                      <p className="text-slate-900 font-medium mt-1">{student.dob}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500 uppercase tracking-wide">Gender</Label>
                      <p className="text-slate-900 font-medium mt-1">{student.gender}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500 uppercase tracking-wide">ID Proof</Label>
                      <p className="text-slate-900 font-medium mt-1">{student.idProof}</p>
                    </div>
                  </div>
                </div>

                {editing && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <Label className="text-xs text-slate-500 uppercase tracking-wide">Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {SKILLS.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => setEditSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${editSkills.includes(skill) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'}`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assessments */}
                {student.assessments.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <h3 className="font-medium text-slate-900 mb-3">Assessment Results</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {student.assessments.map((a, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{a.testName}</p>
                            <p className="text-xs text-slate-500">{a.date}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-lg font-bold ${a.score >= 4 ? 'text-emerald-600' : a.score >= 3 ? 'text-amber-600' : 'text-red-600'}`}>
                              {a.score}/5
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Skills */}
            {section === 'skills' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
                <h2 className="font-display text-lg font-semibold text-slate-900 mb-6">My Skills</h2>
                <div className="space-y-3">
                  {student.skills.length === 0 ? (
                    <p className="text-slate-500 text-sm">No skills added yet. Edit your profile to add skills.</p>
                  ) : (
                    student.skills.map(skill => (
                      <div key={skill} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Award className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="font-medium text-slate-900">{skill}</span>
                        </div>
                        <VerificationBadge status={student.verificationStatus} />
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-700">
                    <strong>Tip:</strong> Take skill assessments to improve your profile and get verified by our admin team.
                  </p>
                  <Button size="sm" className="mt-3 gradient-primary text-white border-0" onClick={() => setSection('assessment')}>
                    Take Assessment
                  </Button>
                </div>
              </div>
            )}

            {/* Documents */}
            {section === 'documents' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
                <h2 className="font-display text-lg font-semibold text-slate-900 mb-6">Documents</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Resume</p>
                          <p className="text-xs text-slate-500">{student.resumeFilename || 'Not uploaded'}</p>
                        </div>
                      </div>
                      <VerificationBadge status="pending" size="sm" />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">ID Proof</p>
                        <p className="text-xs text-slate-500">{student.idProof}</p>
                      </div>
                    </div>
                  </div>

                  {/* Certificates */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-slate-900">Certificates</h3>
                      <label className="cursor-pointer">
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleCertUpload} className="hidden" />
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          Upload Certificate
                        </span>
                      </label>
                    </div>
                    {student.certificates.length === 0 ? (
                      <p className="text-sm text-slate-500 py-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No certificates uploaded yet
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {student.certificates.map(cert => (
                          <div key={cert.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-slate-400" />
                              <div>
                                <p className="text-sm font-medium text-slate-900">{cert.filename}</p>
                                <p className="text-xs text-slate-500">{cert.uploadDate}</p>
                              </div>
                            </div>
                            {/* Map 'approved' -> 'verified' for VerificationBadge */}
                            <VerificationBadge status={certStatusToVerification(cert.status)} size="sm" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Assessment link */}
            {section === 'assessment' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
                <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">Skill Assessment</h2>
                <p className="text-slate-500 text-sm mb-6">
                  Test your knowledge in Excel, SQL, Power BI, and Python. Each test has 5 questions and results are saved to your profile.
                </p>
                <Button className="gradient-primary text-white border-0 hover:opacity-90" onClick={() => navigate('assessment')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Assessment
                </Button>
              </div>
            )}

            {/* Search link */}
            {section === 'search' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
                <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">Search Internships</h2>
                <p className="text-slate-500 text-sm mb-6">
                  Browse all available internships and apply with a single click.
                </p>
                <Button className="gradient-primary text-white border-0 hover:opacity-90" onClick={() => navigate('search')}>
                  <Search className="w-4 h-4 mr-2" />
                  Browse Internships
                </Button>
              </div>
            )}

            {/* Applications */}
            {section === 'applications' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
                <h2 className="font-display text-lg font-semibold text-slate-900 mb-6">My Applications</h2>
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No applications yet.</p>
                    <Button size="sm" className="mt-4 gradient-primary text-white border-0" onClick={() => navigate('search')}>
                      Browse Internships
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.map(app => (
                      <div key={app.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-slate-900">{app.designation}</p>
                            <p className="text-sm text-slate-500">{app.companyName}</p>
                            <p className="text-xs text-slate-400 mt-1">Applied: {app.appliedDate}</p>
                          </div>
                          <StatusPill status={app.status} />
                        </div>
                      </div>
                    ))}
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
