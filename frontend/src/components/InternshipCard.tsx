import React from 'react';
import { Building2, Clock, DollarSign, Wifi, MapPin, Layers } from 'lucide-react';
import { Internship } from '@/utils/seedData';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface InternshipCardProps {
  internship: Internship;
  onApply?: (internship: Internship) => void;
  alreadyApplied?: boolean;
}

const workTypeConfig = {
  Online: { className: 'bg-blue-100 text-blue-700', icon: <Wifi className="w-3 h-3" /> },
  Offline: { className: 'bg-slate-100 text-slate-700', icon: <MapPin className="w-3 h-3" /> },
  Hybrid: { className: 'bg-purple-100 text-purple-700', icon: <Layers className="w-3 h-3" /> },
};

export function InternshipCard({ internship, onApply, alreadyApplied }: InternshipCardProps) {
  const { currentUser } = useAuth();
  const wtConfig = workTypeConfig[internship.workType] || workTypeConfig.Hybrid;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 card-hover shadow-card flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base leading-tight">{internship.designation}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{internship.companyName}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${wtConfig.className}`}>
          {wtConfig.icon}
          {internship.workType}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-slate-600">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          {internship.duration}
        </span>
        <span className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          {internship.stipend}
        </span>
      </div>

      <p className="text-sm text-slate-600 line-clamp-2">{internship.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {internship.skillsRequired.map(skill => (
          <span key={skill} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium border border-indigo-100">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          Posted {new Date(internship.postedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        {currentUser?.role === 'student' && onApply && (
          <Button
            size="sm"
            onClick={() => onApply(internship)}
            disabled={alreadyApplied}
            className={alreadyApplied ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'gradient-primary text-white border-0 hover:opacity-90'}
          >
            {alreadyApplied ? 'Applied ✓' : 'Apply Now'}
          </Button>
        )}
      </div>
    </div>
  );
}
