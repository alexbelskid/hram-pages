import crypto from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../server/app.ts';

const secret = 'test-webhook-secret';

function sign(body: string) {
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

describe('church notes API', () => {
  let app: ReturnType<typeof createApp>['app'];
  let close: () => void;
  const dbPath = path.join(os.tmpdir(), `hram-${crypto.randomUUID()}.sqlite`);

  beforeEach(() => {
    const created = createApp({
      dbPath,
      webhookSecret: secret,
      adminToken: 'admin-test-token',
      telegramMode: 'outbox',
    });
    app = created.app;
    close = created.close;
  });

  afterEach(() => close());

  it('creates one pending payment note and calculates amount on the server', async () => {
    const payload = {
      treba: 'Проскомидия',
      type: 'zdravie',
      names: ['Алексия'],
      senderName: 'Алексей',
    };

    const first = await request(app)
      .post('/api/notes')
      .set('Idempotency-Key', 'note-create-0001')
      .send(payload)
      .expect(201);

    expect(first.body.note.amount).toBe(3);
    expect(first.body.note.status).toBe('pending_payment');

    const duplicate = await request(app)
      .post('/api/notes')
      .set('Idempotency-Key', 'note-create-0001')
      .send(payload)
      .expect(200);

    expect(duplicate.body.note.id).toBe(first.body.note.id);
  });

  it('rejects reuse of an idempotency key with another payload', async () => {
    await request(app)
      .post('/api/notes')
      .set('Idempotency-Key', 'note-create-0002')
      .send({ treba: 'Молебен', type: 'zdravie', names: ['Анны'], senderName: 'Иван' })
      .expect(201);

    await request(app)
      .post('/api/notes')
      .set('Idempotency-Key', 'note-create-0002')
      .send({ treba: 'Панихида', type: 'upokoenie', names: ['Анны'], senderName: 'Иван' })
      .expect(409);
  });

  it('accepts a signed payment webhook once and creates one telegram outbox item', async () => {
    const created = await request(app)
      .post('/api/notes')
      .set('Idempotency-Key', 'note-create-0003')
      .send({ treba: 'Сорокоуст', type: 'zdravie', names: ['Петра'], senderName: 'Ольга' })
      .expect(201);

    const event = JSON.stringify({
      eventId: 'evt-payment-0001',
      type: 'payment.succeeded',
      noteId: created.body.note.id,
      paymentId: 'pay-0001',
      amount: 10,
      currency: 'BYN',
    });

    await request(app)
      .post('/api/webhooks/payment')
      .set('Content-Type', 'application/json')
      .set('X-Webhook-Signature', sign(event))
      .send(event)
      .expect(200);

    await request(app)
      .post('/api/webhooks/payment')
      .set('Content-Type', 'application/json')
      .set('X-Webhook-Signature', sign(event))
      .send(event)
      .expect(200);

    const admin = await request(app)
      .get('/api/admin/notes')
      .set('Authorization', 'Bearer admin-test-token')
      .expect(200);

    expect(admin.body.notes[0].status).toBe('paid');

    const outbox = await request(app)
      .get('/api/admin/outbox')
      .set('Authorization', 'Bearer admin-test-token')
      .expect(200);

    expect(outbox.body.items).toHaveLength(1);
  });

  it('rejects a forged webhook and amount mismatch', async () => {
    const created = await request(app)
      .post('/api/notes')
      .set('Idempotency-Key', 'note-create-0004')
      .send({ treba: 'Обедня', type: 'zdravie', names: ['Марии'], senderName: 'Елена' })
      .expect(201);

    const event = JSON.stringify({
      eventId: 'evt-payment-0002',
      type: 'payment.succeeded',
      noteId: created.body.note.id,
      paymentId: 'pay-0002',
      amount: 999,
      currency: 'BYN',
    });

    await request(app)
      .post('/api/webhooks/payment')
      .set('Content-Type', 'application/json')
      .set('X-Webhook-Signature', 'forged')
      .send(event)
      .expect(401);

    await request(app)
      .post('/api/webhooks/payment')
      .set('Content-Type', 'application/json')
      .set('X-Webhook-Signature', sign(event))
      .send(event)
      .expect(409);
  });

  it('validates an admin token before opening the admin panel', async () => {
    await request(app)
      .get('/api/admin/session')
      .set('Authorization', 'Bearer wrong-token')
      .expect(401);

    const valid = await request(app)
      .get('/api/admin/session')
      .set('Authorization', 'Bearer admin-test-token')
      .expect(200);

    expect(valid.body.authenticated).toBe(true);
  });

  it('rejects payment events without a stable payment ID', async () => {
    const created = await request(app)
      .post('/api/notes')
      .set('Idempotency-Key', 'note-create-0006')
      .send({ treba: 'Проскомидия', type: 'zdravie', names: ['Иоанна'], senderName: 'Анна' })
      .expect(201);

    const event = JSON.stringify({
      eventId: 'evt-payment-missing-id',
      type: 'payment.succeeded',
      noteId: created.body.note.id,
      amount: 3,
      currency: 'BYN',
    });

    await request(app)
      .post('/api/webhooks/payment')
      .set('Content-Type', 'application/json')
      .set('X-Webhook-Signature', sign(event))
      .send(event)
      .expect(400);
  });

  it('does not allow an administrator to mark a payment as refunded locally', async () => {
    const created = await request(app)
      .post('/api/notes')
      .set('Idempotency-Key', 'note-create-0007')
      .send({ treba: 'Проскомидия', type: 'zdravie', names: ['Ирины'], senderName: 'Павел' })
      .expect(201);

    const event = JSON.stringify({
      eventId: 'evt-payment-0004',
      type: 'payment.succeeded',
      noteId: created.body.note.id,
      paymentId: 'pay-0004',
      amount: 3,
      currency: 'BYN',
    });
    await request(app)
      .post('/api/webhooks/payment')
      .set('Content-Type', 'application/json')
      .set('X-Webhook-Signature', sign(event))
      .send(event)
      .expect(200);

    await request(app)
      .patch(`/api/admin/notes/${created.body.note.id}/status`)
      .set('Authorization', 'Bearer admin-test-token')
      .send({ status: 'refunded', expectedVersion: 1 })
      .expect(409);
  });

  it('requires admin auth and records printable/status transitions', async () => {
    const created = await request(app)
      .post('/api/notes')
      .set('Idempotency-Key', 'note-create-0005')
      .send({ treba: 'Панихида', type: 'upokoenie', names: ['Николая'], senderName: 'Мария' })
      .expect(201);

    await request(app).get('/api/admin/notes').expect(401);

    const event = JSON.stringify({
      eventId: 'evt-payment-0003',
      type: 'payment.succeeded',
      noteId: created.body.note.id,
      paymentId: 'pay-0003',
      amount: 5,
      currency: 'BYN',
    });
    await request(app)
      .post('/api/webhooks/payment')
      .set('Content-Type', 'application/json')
      .set('X-Webhook-Signature', sign(event))
      .send(event)
      .expect(200);

    const print = await request(app)
      .post(`/api/admin/notes/${created.body.note.id}/print`)
      .set('Authorization', 'Bearer admin-test-token')
      .send({ expectedVersion: 1 })
      .expect(200);

    expect(print.body.printDocument).toContain('Николая');
    expect(print.body.note.status).toBe('printing');
    expect(print.body.note.version).toBe(2);

    const updated = await request(app)
      .patch(`/api/admin/notes/${created.body.note.id}/status`)
      .set('Authorization', 'Bearer admin-test-token')
      .send({ status: 'completed', expectedVersion: 2 })
      .expect(200);

    expect(updated.body.note.status).toBe('completed');
  });
});
