import React from 'react';
import { BusinessCase } from '../types';
import { StatusBadge } from './StatusBadge';

interface CaseCardProps {
  businessCase: BusinessCase;
}

export const CaseCard: React.FC<CaseCardProps> = ({ businessCase }) => {
  return (
    <div
      data-testid="business-case-card"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '24px',
        marginTop: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-accent)', textTransform: 'uppercase' }}>
            КЕЙС ПОДРАЗДЕЛЕНИЯ: {businessCase.department}
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
            {businessCase.title}
          </h3>
        </div>
        <StatusBadge status={businessCase.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '14px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', marginBottom: '6px' }}>
            Проблема
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
            {businessCase.problem}
          </p>
        </div>

        <div style={{ padding: '14px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
            Текущий процесс (Ручной)
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            {businessCase.currentProcess}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <div style={{ border: '1px solid var(--border-color)', padding: '14px', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', marginBottom: '6px' }}>
            Роль ИИ (Эвристика / OCR)
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {businessCase.aiRole}
          </p>
        </div>

        <div style={{ border: '1px solid var(--border-color)', padding: '14px', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '6px' }}>
            Роль детерминированных алгоритмов
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {businessCase.deterministicAlgorithmRole}
          </p>
        </div>

        <div style={{ border: '1px solid var(--border-color)', padding: '14px', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '6px' }}>
            Точка контроля человеком (Human-in-the-loop)
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {businessCase.humanControl}
          </p>
        </div>
      </div>
    </div>
  );
};
