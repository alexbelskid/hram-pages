import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const appSource = readFileSync(resolve('src/App.tsx'), 'utf8');

describe('public church front integration', () => {
  it('keeps the approved public form without the removed payment-information section', () => {
    expect(appSource).toContain('Подать записку');
    expect(appSource).not.toContain('Информация об услугах и оплате');
    expect(appSource).not.toContain('Сайт проходит подготовку к подключению онлайн-платежей');
    expect(appSource).not.toContain('Оказываемые услуги');
    expect(appSource).not.toContain('Оплата и безопасность');
    expect(appSource).not.toContain('Отмена и возврат');
    expect(appSource).not.toContain('Контакты и реквизиты');
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
