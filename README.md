# Hram Notes — локальный end-to-end MVP

Рабочий прототип подачи церковных записок с backend, SQLite, подписанным payment webhook, Telegram outbox, админ-панелью и печатью.

## Что работает

- публичная форма создаёт записку через `POST /api/notes`;
- сумма считается повторно на сервере;
- idempotency key не допускает двойную записку;
- payment webhook принимается только с HMAC-SHA256 подписью;
- повторный webhook не создаёт повторных событий/уведомлений;
- после подтверждения оплаты записка появляется в статусе `paid`;
- создаётся Telegram outbox-запись; настоящий Telegram включается только через env;
- администратор видит очередь, фильтрует, открывает записку, печатает и завершает её;
- изменения фиксируются в append-only audit log.

## Локальный запуск

```bash
cp .env.example .env
npm install
npm run dev
```

- форма: http://localhost:3000/
- админка: кнопка «Вход для администратора» или `/admin`
- API: http://localhost:8787/api/health
- dev admin token: значение `ADMIN_TOKEN` из `.env`

## Тест webhook

Webhook payload должен соответствовать сумме записки:

```bash
BODY='{"eventId":"evt-demo-1","type":"payment.succeeded","noteId":"NOTE_ID","paymentId":"pay-demo-1","amount":3,"currency":"BYN"}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$PAYMENT_WEBHOOK_SECRET" -hex | cut -d' ' -f2)
curl -X POST http://localhost:8787/api/webhooks/payment \
  -H 'Content-Type: application/json' \
  -H "X-Webhook-Signature: $SIG" \
  --data "$BODY"
```

## Production-блокеры

Этот MVP нельзя подключать к реальным платежам или публиковать без отдельной проверки и approval. Нужны:

1. утверждённый платёжный провайдер и его точная webhook-схема;
2. реальные юрреквизиты, правила оплаты/возврата и политика данных;
3. production-аутентификация администратора: парольный hash/SSO, secure cookie, MFA, rate limit;
4. TLS, backup, monitoring, secret manager и журнал доступа;
5. подтверждённые Telegram bot/chat IDs и решение, какие PII допустимо отправлять;
6. миграция SQLite → PostgreSQL либо обоснованная single-instance эксплуатация;
7. белорусский production-хостинг/домен по требованиям банка.

См. `ASSUMPTIONS.md` и `process-definition.json`.
