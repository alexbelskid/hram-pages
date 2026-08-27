import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createApp } from './app.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT ?? 8787);
const production = process.env.NODE_ENV === 'production';
const dbPath = process.env.DB_PATH ?? path.join(root, 'data', 'hram.sqlite');
const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET ?? (production ? '' : 'dev-payment-secret-change-me');
const adminToken = process.env.ADMIN_TOKEN ?? (production ? '' : 'dev-admin-token-change-me');
if (!webhookSecret || webhookSecret.length < 32) throw new Error('PAYMENT_WEBHOOK_SECRET must be at least 32 characters in production');
if (!adminToken || adminToken.length < 32) throw new Error('ADMIN_TOKEN must be at least 32 characters in production');
if (production && process.env.TELEGRAM_MODE === 'live' && (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID)) {
  throw new Error('Telegram live mode requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID');
}
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const created = createApp({
  dbPath,
  webhookSecret,
  adminToken,
  telegramMode: process.env.TELEGRAM_MODE === 'live' ? 'live' : 'outbox',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID,
});

created.app.use(express.static(path.join(root, 'dist')));
created.app.get('*', (_req, res) => res.sendFile(path.join(root, 'dist', 'index.html')));

created.app.listen(port, '127.0.0.1', () => {
  console.log(`Hram app listening on http://127.0.0.1:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    created.close();
    process.exit(0);
  });
}
