import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const appSource = readFileSync(resolve('src/App.tsx'), 'utf8');

describe('public church front integration', () => {
  it('keeps the approved public form and exposes the complete payment-readiness information', () => {
    const requiredMarkers = [
      'Подать записку',
      'Оказываемые услуги',
      'Оплата и безопасность',
      'Отмена и возврат',
      'Контакты и реквизиты',
      'Онлайн-оплата пока не подключена',
      'Юридические реквизиты организации',
      'Будут опубликованы после получения и проверки официальных данных',
    ];

    for (const marker of requiredMarkers) {
      expect(appSource).toContain(marker);
    }
  });

  it('does not pretend that legal data, payment or submission is already operational', () => {
    expect(appSource).toContain('Оплата ещё не подключена');
    expect(appSource).toContain('не считается оплаченной');
    expect(appSource).not.toContain('Visa');
    expect(appSource).not.toContain('Mastercard');
    expect(appSource).not.toContain('БЕЛКАРТ');
    expect(appSource).not.toContain('ЕРИП');
  });
});
