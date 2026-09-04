import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const appSource = readFileSync(resolve('src/App.tsx'), 'utf8');

describe('public church front integration', () => {
  it('keeps the information cards but removes the preparation message and navigation panel', () => {
    expect(appSource).toContain('Подать записку');
    expect(appSource).toContain('Информация об услугах и оплате');
    expect(appSource).not.toContain('Сайт проходит подготовку к подключению онлайн-платежей');
    expect(appSource).not.toContain('Разделы с информацией');
    expect(appSource).toContain('Оказываемые услуги');
    expect(appSource).toContain('Оплата и безопасность');
    expect(appSource).toContain('Отмена и возврат');
    expect(appSource).toContain('Контакты и реквизиты');
    expect(appSource).not.toContain('Вход для администратора');
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
