import React, { useState } from 'react';
import { GraduationCap, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getStudents, getRecruiters, saveStudents, saveRecruiters } from '@/utils/seedData';
import { fileToBase64 } from '@/utils/fileHelpers';
import { useToast } from '@/components/Toast';

interface RegisterProps {
  navigate: (page: string) => void;
  initialTab?: 'student' | 'recruiter';
}

const SKILLS = ['EXCEL', 'Power BI', 'SQL', 'Python'];
const ID_PROOFS = ['Aadhar', 'PAN', 'Voter ID'];

export function Register({ navigate, initialTab = 'student' }: RegisterProps) {
  const [tab, setTab] = useState<'student' | 'recruiter'>(initialTab);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Student form
  const [sName, setSName] = useState('');
  const [sDob, setSDob] = useState('');
  const [sGender, setSGender] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sMobile, setSMobile] = useState('');
  const [sPassword, setSPassword] = useState('');
  const [sIdProof, setSIdProof] = useState('');
  const [sSkills, setSSkills] = useState<string[]>([]);
  const [sPhoto, setSPhoto] = useState<File | null>(null);
  const [sResume, setSResume] = useState<File | null>(null);

  // Recruiter form
  const [rName, setRName] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPhone, setRPhone] = useState('');
  const [rPassword, setRPassword] = useState('');
  const [rCompany, setRCompany] = useState('');
  const [rOwner, setROwner] = useState('');
  const [rOwnerIdProof, setROwnerIdProof] = useState('');
  const [rDin, setRDin] = useState('');
  const [rCin, setRCin] = useState('');
  const [rAddress, setRAddress] = useState('');

  const toggleSkill = (skill: string) => {
    setSSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const validateStudent = () => {
    const e: Record<string, string> = {};
    if (!sName.trim()) e.sName = 'Name is required';
    if (!sDob) e.sDob = 'Date of birth is required';
    if (!sGender) e.sGender = 'Gender is required';
    if (!sEmail.trim()) e.sEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(sEmail)) e.sEmail = 'Invalid email';
    if (!sMobile.trim()) e.sMobile = 'Mobile is required';
    if (!sPassword || sPassword.length < 6) e.sPassword = 'Password must be at least 6 characters';
    if (!sIdProof) e.sIdProof = 'ID proof is required';
    if (sSkills.length === 0) e.sSkills = 'Select at least one skill';
    const students = getStudents();
    if (students.find(s => s.email === sEmail)) e.sEmail = 'Email already registered';
    return e;
  };

  const validateRecruiter = () => {
    const e: Record<string, string> = {};
    if (!rName.trim()) e.rName = 'Name is required';
    if (!rEmail.trim()) e.rEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(rEmail)) e.rEmail = 'Invalid email';
    if (!rPhone.trim()) e.rPhone = 'Phone is required';
    if (!rPassword || rPassword.length < 6) e.rPassword = 'Password must be at least 6 characters';
    if (!rCompany.trim()) e.rCompany = 'Company name is required';
    if (!rOwner.trim()) e.rOwner = 'Owner name is required';
    if (!rOwnerIdProof) e.rOwnerIdProof = 'Owner ID proof is required';
    if (!rDin.trim()) e.rDin = 'DIN number is required';
    if (!rCin.trim()) e.rCin = 'CIN number is required';
    if (!rAddress.trim()) e.rAddress = 'Address is required';
    const recruiters = getRecruiters();
    if (recruiters.find(r => r.email === rEmail)) e.rEmail = 'Email already registered';
    return e;
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStudent();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const photoBase64 = sPhoto ? await fileToBase64(sPhoto) : '';
    const resumeBase64 = sResume ? await fileToBase64(sResume) : '';

    const students = getStudents();
    const newStudent = {
      id: `student-${Date.now()}`,
      name: sName,
      dob: sDob,
      gender: sGender,
      email: sEmail,
      mobile: sMobile,
      password: sPassword,
      idProof: sIdProof,
      skills: sSkills,
      photo: photoBase64,
      resume: resumeBase64,
      resumeFilename: sResume?.name || '',
      certificates: [],
      verified: false,
      verificationStatus: 'pending' as const,
      assessments: [],
    };
    saveStudents([...students, newStudent]);
    showToast('Registration successful! Please login.', 'success');
    setLoading(false);
    navigate('login');
  };

  const handleRecruiterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateRecruiter();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const recruiters = getRecruiters();
    const newRecruiter = {
      id: `recruiter-${Date.now()}`,
      name: rName,
      email: rEmail,
      phone: rPhone,
      password: rPassword,
      companyName: rCompany,
      ownerName: rOwner,
      ownerIdProof: rOwnerIdProof,
      dinNumber: rDin,
      cinNumber: rCin,
      address: rAddress,
      verified: false,
      verificationStatus: 'pending' as const,
    };
    saveRecruiters([...recruiters, newRecruiter]);
    showToast('Registration successful! Please login.', 'success');
    setLoading(false);
    navigate('login');
  };

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-red-500 text-xs mt-1">{errors[field]}</p> : null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Create Your Account</h1>
          <p className="text-slate-500 text-sm mt-1">Join InternBridge and start your journey</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => { setTab('student'); setErrors({}); }}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${tab === 'student' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <GraduationCap className="w-4 h-4" />
              Student
            </button>
            <button
              onClick={() => { setTab('recruiter'); setErrors({}); }}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${tab === 'recruiter' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Building2 className="w-4 h-4" />
              Recruiter
            </button>
          </div>

          <div className="p-6">
            {tab === 'student' ? (
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Full Name *</Label>
                    <Input value={sName} onChange={e => setSName(e.target.value)} placeholder="Priya Sharma" className="mt-1.5" />
                    <FieldError field="sName" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Date of Birth *</Label>
                    <Input type="date" value={sDob} onChange={e => setSDob(e.target.value)} className="mt-1.5" />
                    <FieldError field="sDob" />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">Gender *</Label>
                  <div className="flex gap-4 mt-2">
                    {['Male', 'Female', 'Other'].map(g => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={sGender === g}
                          onChange={() => setSGender(g)}
                          className="text-blue-600"
                        />
                        <span className="text-sm text-slate-700">{g}</span>
                      </label>
                    ))}
                  </div>
                  <FieldError field="sGender" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Email *</Label>
                    <Input type="email" value={sEmail} onChange={e => setSEmail(e.target.value)} placeholder="you@example.com" className="mt-1.5" />
                    <FieldError field="sEmail" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Mobile *</Label>
                    <Input type="tel" value={sMobile} onChange={e => setSMobile(e.target.value)} placeholder="9876543210" className="mt-1.5" />
                    <FieldError field="sMobile" />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">Password *</Label>
                  <Input type="password" value={sPassword} onChange={e => setSPassword(e.target.value)} placeholder="Min. 6 characters" className="mt-1.5" />
                  <FieldError field="sPassword" />
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">ID Proof *</Label>
                  <select
                    value={sIdProof}
                    onChange={e => setSIdProof(e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select ID Proof</option>
                    {ID_PROOFS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <FieldError field="sIdProof" />
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">Skills *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {SKILLS.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${sSkills.includes(skill) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'}`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  <FieldError field="sSkills" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Profile Photo</Label>
                    <Input type="file" accept="image/*" onChange={e => setSPhoto(e.target.files?.[0] || null)} className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Resume (PDF)</Label>
                    <Input type="file" accept=".pdf,.doc,.docx" onChange={e => setSResume(e.target.files?.[0] || null)} className="mt-1.5" />
                  </div>
                </div>

                <Button type="submit" className="w-full gradient-primary text-white border-0 hover:opacity-90 mt-2" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Student Account'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRecruiterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Your Name *</Label>
                    <Input value={rName} onChange={e => setRName(e.target.value)} placeholder="Anita Patel" className="mt-1.5" />
                    <FieldError field="rName" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Email *</Label>
                    <Input type="email" value={rEmail} onChange={e => setREmail(e.target.value)} placeholder="you@company.com" className="mt-1.5" />
                    <FieldError field="rEmail" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Phone *</Label>
                    <Input type="tel" value={rPhone} onChange={e => setRPhone(e.target.value)} placeholder="9876543210" className="mt-1.5" />
                    <FieldError field="rPhone" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Password *</Label>
                    <Input type="password" value={rPassword} onChange={e => setRPassword(e.target.value)} placeholder="Min. 6 characters" className="mt-1.5" />
                    <FieldError field="rPassword" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Company Name *</Label>
                    <Input value={rCompany} onChange={e => setRCompany(e.target.value)} placeholder="TechCorp Solutions" className="mt-1.5" />
                    <FieldError field="rCompany" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Owner Name *</Label>
                    <Input value={rOwner} onChange={e => setROwner(e.target.value)} placeholder="Rajesh Patel" className="mt-1.5" />
                    <FieldError field="rOwner" />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">Owner ID Proof *</Label>
                  <select
                    value={rOwnerIdProof}
                    onChange={e => setROwnerIdProof(e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select ID Proof</option>
                    {ID_PROOFS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <FieldError field="rOwnerIdProof" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700">DIN Number *</Label>
                    <Input value={rDin} onChange={e => setRDin(e.target.value)} placeholder="DIN12345678" className="mt-1.5" />
                    <FieldError field="rDin" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">CIN Number *</Label>
                    <Input value={rCin} onChange={e => setRCin(e.target.value)} placeholder="CIN98765432" className="mt-1.5" />
                    <FieldError field="rCin" />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">Company Address *</Label>
                  <Textarea value={rAddress} onChange={e => setRAddress(e.target.value)} placeholder="123 Tech Park, Bangalore..." className="mt-1.5" rows={3} />
                  <FieldError field="rAddress" />
                </div>

                <Button type="submit" className="w-full gradient-primary text-white border-0 hover:opacity-90 mt-2" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Recruiter Account'}
                </Button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <button onClick={() => navigate('login')} className="text-blue-600 font-medium hover:underline">
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
}
