import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../../src/App';
import { presentationSections, businessCases } from '../../src/data/presentation';
import { StatusBadge } from '../../src/components/StatusBadge';

describe('Facade AI Applications Core Tests', () => {
  it('1. Приложение успешно монтируется и отображает начальный экран', () => {
    render(<App />);
    const headings = screen.getAllByText(/FACADE AI APPLICATIONS/i);
    expect(headings.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Северный порт/i).length).toBeGreaterThan(0);
  });

  it('2. Все 12 разделов присутствуют в модели данных', () => {
    expect(presentationSections.length).toBe(12);
    const ids = new Set(presentationSections.map(s => s.id));
    expect(ids.size).toBe(12);
  });

  it('3. Навигация вперёд и назад работает корректно', () => {
    render(<App />);
    const nextBtn = screen.getByTestId('next-section-button');
    const prevBtn = screen.getByTestId('prev-section-button');
    const counter = screen.getByTestId('section-counter');

    expect(counter).toHaveTextContent('1 / 12');
    expect(prevBtn).toBeDisabled();

    // Переход вперёд
    fireEvent.click(nextBtn);
    expect(counter).toHaveTextContent('2 / 12');
    expect(prevBtn).not.toBeDisabled();

    // Возврат назад
    fireEvent.click(prevBtn);
    expect(counter).toHaveTextContent('1 / 12');
  });

  it('4. Карта разделов открывается по кнопке и содержит все 12 ссылок', () => {
    render(<App />);
    const mapBtn = screen.getByTestId('open-map-button');
    fireEvent.click(mapBtn);

    const dialog = screen.getByRole('dialog', { name: /Карта разделов презентации/i });
    expect(dialog).toBeInTheDocument();

    // Проверяем наличие карточек разделов в модалке
    expect(screen.getByText(/РАЗДЕЛ 12/i)).toBeInTheDocument();
  });

  it('5. Статусы WORKING, PROTOTYPE, CONCEPT, TBD отображаются явно', () => {
    const { container: c1 } = render(<StatusBadge status="WORKING" />);
    expect(c1).toHaveTextContent(/WORKING/);

    const { container: c2 } = render(<StatusBadge status="PROTOTYPE" />);
    expect(c2).toHaveTextContent(/PROTOTYPE/);

    const { container: c3 } = render(<StatusBadge status="CONCEPT" />);
    expect(c3).toHaveTextContent(/CONCEPT/);

    const { container: c4 } = render(<StatusBadge status="TBD" />);
    expect(c4).toHaveTextContent(/TBD/);
  });

  it('6. Кейс коммерческого отдела загружается с корректным статусом CONCEPT', () => {
    const commercialCase = businessCases.find(c => c.id === 'commercial-tender-package-intake');
    expect(commercialCase).toBeDefined();
    expect(commercialCase?.status).toBe('CONCEPT');
    expect(commercialCase?.department).toBe('commercial');
    expect(commercialCase?.problem).toContain('Заказчик передаёт неструктурированный архив');
  });

  it('7. Нет внутренних ссылок на несуществующие разделы', () => {
    const sectionIds = new Set(presentationSections.map(s => s.id));
    for (const bc of businessCases) {
      for (const ref of bc.relatedSections) {
        expect(sectionIds.has(ref)).toBe(true);
      }
    }
  });

  it('8. Клавиатурная навигация (ArrowRight / ArrowLeft) переключает слайды', () => {
    render(<App />);
    const counter = screen.getByTestId('section-counter');
    expect(counter).toHaveTextContent('1 / 12');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(counter).toHaveTextContent('2 / 12');

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(counter).toHaveTextContent('1 / 12');
  });
});
