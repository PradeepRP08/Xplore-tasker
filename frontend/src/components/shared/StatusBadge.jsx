import React from 'react';
import { Clock, Loader2, CheckCircle2 } from 'lucide-react';

export default function StatusBadge({ status }) {
  const map = {
    'Pending':     { cls: 'badge-pending',    icon: Clock,      label: 'Pending' },
    'In Progress': { cls: 'badge-inprogress', icon: Loader2,    label: 'In Progress' },
    'Completed':   { cls: 'badge-completed',  icon: CheckCircle2, label: 'Completed' },
  };
  const cfg = map[status] || map['Pending'];
  const Icon = cfg.icon;

  return (
    <span className={cfg.cls}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}
