import React, { useState, useEffect, useCallback } from 'react';
import { presentationSections } from './data/presentation';
import { SectionView } from './components/SectionView';
import { SectionMap } from './components/SectionMap';

export const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const currentSection = presentationSections[currentIndex] ?? presentationSections[0]!;

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev < presentationSections.length - 1 ? prev + 1 : prev));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMapOpen) {
        if (e.key === 'Escape') setIsMapOpen(false);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      } else if (e.key === 'm' || e.key === 'M' || e.key === 'ь' || e.key === 'Ь') {
        setIsMapOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isMapOpen]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-main)'
      }}
    >
      {/* Навигационная панель */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'var(--bg-header)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border-color)',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'var(--text-accent)',
              borderRadius: '2px'
            }}
          />
          <div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.02em', color: 'var(--text-main)' }}>
              FACADE AI APPLICATIONS
            </span>
            <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              Сквозной демо-объект: «Северный порт»
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsMapOpen(true)}
            data-testid="open-map-button"
            aria-label="Открыть карту разделов"
            style={{
              padding: '6px 14px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              borderRadius: '6px',
              fontSize: '0.825rem',
              fontWeight: 600
            }}
          >
            Карта разделов [M]
          </button>

          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            data-testid="prev-section-button"
            aria-label="Предыдущий раздел"
            style={{
              padding: '6px 12px',
              backgroundColor: currentIndex === 0 ? 'transparent' : 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: currentIndex === 0 ? 'var(--text-muted)' : 'var(--text-main)',
              borderRadius: '6px',
              fontSize: '0.825rem',
              opacity: currentIndex === 0 ? 0.5 : 1
            }}
          >
            ← Назад
          </button>

          <span
            data-testid="section-counter"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.825rem',
              color: 'var(--text-accent)',
              padding: '0 6px',
              fontWeight: 600
            }}
          >
            {currentIndex + 1} / {presentationSections.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex === presentationSections.length - 1}
            data-testid="next-section-button"
            aria-label="Следующий раздел"
            style={{
              padding: '6px 12px',
              backgroundColor: currentIndex === presentationSections.length - 1 ? 'transparent' : 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: currentIndex === presentationSections.length - 1 ? 'var(--text-muted)' : 'var(--text-main)',
              borderRadius: '6px',
              fontSize: '0.825rem',
              opacity: currentIndex === presentationSections.length - 1 ? 0.5 : 1
            }}
          >
            Вперёд →
          </button>
        </div>
      </header>

      {/* Основной контент */}
      <main
        style={{
          flex: 1,
          padding: '24px 20px 48px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <SectionView section={currentSection} />
      </main>

      {/* Модальная карта разделов */}
      {isMapOpen && (
        <SectionMap
          sections={presentationSections}
          currentIndex={currentIndex}
          onSelectSection={idx => setCurrentIndex(idx)}
          onClose={() => setIsMapOpen(false)}
        />
      )}

      {/* Подвал */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '16px 20px',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}
      >
        <span>Facade AI Applications © 2026</span>
        <span>Синтетический объект: «Северный порт»</span>
        <span>Статус лицензирования: TBD</span>
        <span>Клавиатура: [←] Назад, [→] Вперёд, [M] Карта</span>
      </footer>
    </div>
  );
};
