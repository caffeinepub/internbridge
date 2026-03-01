import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { InternshipCard } from '@/components/InternshipCard';
import { getInternships, getApplications, saveApplications, Internship, Application } from '@/utils/seedData';

interface SearchInternshipsProps {
  navigate: (page: string) => void;
}

export function SearchInternships({ navigate }: SearchInternshipsProps) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [workTypeFilter, setWorkTypeFilter] = useState<string>('All');

  useEffect(() => {
    setInternships(getInternships());
    if (currentUser?.role === 'student') {
      setApplications(getApplications().filter(a => a.studentId === currentUser.id));
    }
  }, [currentUser]);

  const filtered = internships.filter(intern => {
    const q = query.toLowerCase();
    const matchesQuery = !q ||
      intern.designation.toLowerCase().includes(q) ||
      intern.companyName.toLowerCase().includes(q) ||
      intern.description.toLowerCase().includes(q) ||
      intern.skillsRequired.some(s => s.toLowerCase().includes(q));
    const matchesWorkType = workTypeFilter === 'All' || intern.workType === workTypeFilter;
    return matchesQuery && matchesWorkType;
  });

  const handleApply = (internship: Internship) => {
    if (!currentUser || currentUser.role !== 'student') {
      navigate('login');
      return;
    }
    const allApps = getApplications();
    const alreadyApplied = allApps.some(a => a.internshipId === internship.id && a.studentId === currentUser.id);
    if (alreadyApplied) {
      showToast('You have already applied to this internship.', 'warning');
      return;
    }
    const newApp: Application = {
      id: `app-${Date.now()}`,
      internshipId: internship.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      companyName: internship.companyName,
      designation: internship.designation,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'applied',
    };
    saveApplications([...allApps, newApp]);
    setApplications(prev => [...prev, newApp]);
    showToast(`Successfully applied to ${internship.designation} at ${internship.companyName}!`, 'success');
  };

  const isApplied = (internshipId: string) =>
    applications.some(a => a.internshipId === internshipId);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="gradient-primary py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-3xl font-bold text-white mb-2">Find Your Perfect Internship</h1>
          <p className="text-blue-100 mb-6">Browse {internships.length} internship opportunities</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by role, company, or skill..."
              className="pl-12 py-3 text-base bg-white border-0 shadow-lg rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter:</span>
          </div>
          {['All', 'Online', 'Offline', 'Hybrid'].map(wt => (
            <button
              key={wt}
              onClick={() => setWorkTypeFilter(wt)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${workTypeFilter === wt ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400'}`}
            >
              {wt}
            </button>
          ))}
          <span className="ml-auto text-sm text-slate-500">{filtered.length} result(s)</span>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No internships found</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(intern => (
              <InternshipCard
                key={intern.id}
                internship={intern}
                onApply={handleApply}
                alreadyApplied={isApplied(intern.id)}
              />
            ))}
          </div>
        )}

        {!currentUser && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <p className="text-blue-700 text-sm">
              <button onClick={() => navigate('login')} className="font-semibold underline">Login as a student</button> to apply for internships.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
