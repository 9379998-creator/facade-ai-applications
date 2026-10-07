import { test, expect } from '@playwright/test';

test.describe('Facade AI Applications E2E Tests', () => {
  test('1. Стартовый экран открывается, заголовок и counter видны', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await expect(page).toHaveTitle(/Facade AI Applications/i);
    await expect(page.getByTestId('section-counter')).toHaveText('1 / 12');
    expect(consoleErrors).toHaveLength(0);
  });

  test('2. Навигация по 12 разделам и клавиатурные стрелки работают', async ({ page }) => {
    await page.goto('/');
    const nextBtn = page.getByTestId('next-section-button');
    const counter = page.getByTestId('section-counter');

    await nextBtn.click();
    await expect(counter).toHaveText('2 / 12');

    // Нажатие стрелки вправо
    await page.keyboard.press('ArrowRight');
    await expect(counter).toHaveText('3 / 12');

    // Нажатие стрелки влево
    await page.keyboard.press('ArrowLeft');
    await expect(counter).toHaveText('2 / 12');
  });

  test('3. Карта разделов открывается и позволяет перейти к разделу', async ({ page }) => {
    await page.goto('/');
    const mapBtn = page.getByTestId('open-map-button');
    await mapBtn.click();

    const dialog = page.getByRole('dialog', { name: /Карта разделов презентации/i });
    await expect(dialog).toBeVisible();

    // Кликаем по разделу 7 (Северный порт)
    await page.getByRole('button', { name: /Сквозной проект «Северный порт»/i }).click();
    await expect(page.getByTestId('section-counter')).toHaveText('7 / 12');
  });

  test('4. Мобильная адаптивность при ширине 375px (нет горизонтального скролла)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // допустима погрешность 1-2px на округление
  });

  test('5. Коммерческий кейс корректно отображается', async ({ page }) => {
    await page.goto('/');
    // Переход к разделу 1 (содержит кейс)
    await expect(page.getByTestId('business-case-card')).toBeVisible();
    await expect(page.getByText('Приёмка и структуризация входящего тендерного пакета документации')).toBeVisible();
  });
});
