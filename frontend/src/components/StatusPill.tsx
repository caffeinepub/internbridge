import React from 'react';

type ApplicationStatus = 'applied' | 'under_review' | 'accepted' | 'rejected';

interface StatusPillProps {
  status: ApplicationStatus;
}

export function StatusPill({ status }: StatusPillProps) {
  const configs = {
    applied: { className: 'status-applied', label: 'Applied' },
    under_review: { className: 'status-under-review', label: 'Under Review' },
    accepted: { className: 'status-accepted', label: 'Accepted' },
    rejected: { className: 'status-rejected', label: 'Rejected' },
  };

  const config = configs[status];
  return <span className={config.className}>{config.label}</span>;
}
