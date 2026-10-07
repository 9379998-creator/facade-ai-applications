import React from 'react';
import { PresentationSection } from '../types';
import { StatusBadge } from './StatusBadge';
import { CaseCard } from './CaseCard';
import { businessCases } from '../data/presentation';

interface SectionViewProps {
  section: PresentationSection;
}

export const SectionView: React.FC<SectionViewProps> = ({ section }) => {
  const matchingCases = businessCases.filter(c => section.relatedCases.includes(c.id));

  return (
    <article
      data-testid="presentation-section-content"
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-accent)', fontWeight: 700 }}>
            РАЗДЕЛ {String(section.order).padStart(2, '0')} / 12
          </span>
          <StatusBadge status={section.status} />
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
          {section.title}
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'var(--text-accent)', lineHeight: 1.4, fontWeight: 500 }}>
          {section.thesis}
        </p>
      </header>

      {/* Содержательные пункты */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
          Ключевые положения
        </h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {section.points.map((pt, idx) => (
            <li
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '6px',
                borderLeft: '3px solid var(--text-accent)',
                fontSize: '0.95rem',
                lineHeight: 1.5
              }}
            >
              <span style={{ color: 'var(--text-accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                0{idx + 1}.
              </span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Место для визуализации */}
      <section
        style={{
          padding: '24px',
          border: '1px dashed var(--border-light)',
          borderRadius: '8px',
          backgroundColor: 'rgba(30, 41, 59, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          textAlign: 'center',
          minHeight: '140px'
        }}
      >
        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-accent)', textTransform: 'uppercase' }}>
          [ Модуль визуализации / Схема данных ]
        </span>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 500 }}>
          {section.visualizationPlaceholder}
        </p>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Интерактивная диаграмма будет подключена на следующем этапе разработки
        </span>
      </section>

      {/* Заметки докладчика */}
      <section
        style={{
          padding: '16px',
          borderRadius: '6px',
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid var(--border-color)'
        }}
      >
        <h3 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Тезис докладчика (Speaker Note)
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
          «{section.speakerNotes}»
        </p>
      </section>

      {/* Связанные кейсы */}
      {matchingCases.length > 0 && (
        <section>
          {matchingCases.map(bc => (
            <CaseCard key={bc.id} businessCase={bc} />
          ))}
        </section>
      )}
    </article>
  );
};
