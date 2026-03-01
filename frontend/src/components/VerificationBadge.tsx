import React from 'react';
import { CheckCircle, Clock, XCircle, Info } from 'lucide-react';

type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'more_info';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md';
}

export function VerificationBadge({ status, size = 'md' }: VerificationBadgeProps) {
  const configs = {
    verified: {
      className: 'badge-verified',
      icon: <CheckCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
      label: 'Verified',
    },
    pending: {
      className: 'badge-pending',
      icon: <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
      label: 'Pending',
    },
    rejected: {
      className: 'badge-rejected',
      icon: <XCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
      label: 'Rejected',
    },
    more_info: {
      className: 'badge-moreinfo',
      icon: <Info className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
      label: 'More Info',
    },
  };

  const config = configs[status];
  return (
    <span className={config.className}>
      {config.icon}
      {config.label}
    </span>
  );
}
