import React from 'react';
import { ImplementationStatus } from '../types';

interface StatusBadgeProps {
  status: ImplementationStatus;
}

const statusStyles: Record<ImplementationStatus, { bg: string; color: string; label: string }> = {
  WORKING: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', label: 'WORKING (Работает)' },
  PROTOTYPE: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', label: 'PROTOTYPE (Прототип)' },
  CONCEPT: { bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', label: 'CONCEPT (Концепт)' },
  TBD: { bg: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', label: 'TBD (Уточняется)' }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const current = statusStyles[status] || statusStyles.TBD;

  return (
    <span
      data-testid="status-badge"
      data-status={status}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.04em',
        backgroundColor: current.bg,
        color: current.color,
        border: `1px solid ${current.color}40`,
        whiteSpace: 'nowrap'
      }}
    >
      {current.label}
    </span>
  );
};
