import React from 'react';
import { PresentationSection } from '../types';
import { StatusBadge } from './StatusBadge';

interface SectionMapProps {
  sections: PresentationSection[];
  currentIndex: number;
  onSelectSection: (index: number) => void;
  onClose: () => void;
}

export const SectionMap: React.FC<SectionMapProps> = ({
  sections,
  currentIndex,
  onSelectSection,
  onClose
}) => {
  return (
    <div
      role="dialog"
      aria-label="Карта разделов презентации"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        overflowY: 'auto'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '16px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Карта разделов презентации
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Всего 12 разделов архитектурного маршрута
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Закрыть карту разделов"
          style={{
            background: 'transparent',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '0.875rem'
          }}
        >
          ✕ Закрыть [Esc]
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        {sections.map((sec, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={sec.id}
              onClick={() => {
                onSelectSection(idx);
                onClose();
              }}
              style={{
                textAlign: 'left',
                padding: '16px',
                backgroundColor: isActive ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                border: isActive ? '2px solid var(--text-accent)' : '1px solid var(--border-color)',
                borderRadius: '8px',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                color: 'inherit'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-accent)', fontWeight: 700 }}>
                  РАЗДЕЛ {String(sec.order).padStart(2, '0')}
                </span>
                <StatusBadge status={sec.status} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {sec.title}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {sec.thesis}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
