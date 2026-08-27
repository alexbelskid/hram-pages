import crypto from 'node:crypto';
import express, { type NextFunction, type Request, type Response } from 'express';
import Database from 'better-sqlite3';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

export type NoteStatus =
  | 'pending_payment'
  | 'paid'
  | 'printing'
  | 'completed'
  | 'cancelled'
  | 'refunded';

type AppConfig = {
  dbPath: string;
  webhookSecret: string;
  adminToken: string;
  telegramMode?: 'outbox' | 'live';
  telegramBotToken?: string;
  telegramChatId?: string;
};

type CreateNoteInput = {
  treba: string;
  type: 'zdravie' | 'upokoenie';
  names: string[];
  senderName: string;
  duration?: string;
  akafistTarget?: string;
};

const PER_NOTE_PRICES: Record<string, number> = {
  Проскомидия: 3,
  Обедня: 8,
  Молебен: 5,
  Панихида: 5,
  Акафист: 8,
};

const ALLOWED_TREBAS = new Set([...Object.keys(PER_NOTE_PRICES), 'Сорокоуст']);
const STATUS_TRANSITIONS: Record<NoteStatus, NoteStatus[]> = {
  pending_payment: ['cancelled'],
  paid: ['printing', 'completed'],
  printing: ['completed'],
  completed: [],
  cancelled: [],
  refunded: [],
};

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function calculateAmount(treba: string, namesCount: number): number {
  if (treba === 'Сорокоуст') return namesCount * 10;
  const price = PER_NOTE_PRICES[treba];
  return price ? Math.ceil(namesCount / 12) * price : 0;
}

function validateNoteInput(body: unknown): CreateNoteInput {
  if (!body || typeof body !== 'object') throw new Error('Некорректный JSON');
  const value = body as Partial<CreateNoteInput>;
  if (!value.treba || !ALLOWED_TREBAS.has(value.treba)) throw new Error('Неизвестная треба');
  if (value.type !== 'zdravie' && value.type !== 'upokoenie') throw new Error('Некорректный тип записки');
  if (value.treba === 'Панихида' && value.type !== 'upokoenie') throw new Error('Панихида доступна только об упокоении');
  if ((value.treba === 'Молебен' || value.treba === 'Акафист') && value.type !== 'zdravie') {
    throw new Error(`${value.treba} доступен только о здравии`);
  }
  if (!Array.isArray(value.names)) throw new Error('Имена обязательны');
  const names = value.names.map(name => String(name).trim()).filter(Boolean);
  if (names.length < 1 || names.length > 120) throw new Error('Укажите от 1 до 120 имён');
  if (names.some(name => name.length > 100)) throw new Error('Имя слишком длинное');
  const senderName = String(value.senderName ?? '').trim();
  if (!senderName || senderName.length > 120) throw new Error('Укажите имя отправителя');
  return {
    treba: value.treba,
    type: value.type,
    names,
    senderName,
    duration: value.duration ? String(value.duration) : undefined,
    akafistTarget: value.akafistTarget ? String(value.akafistTarget) : undefined,
  };
}

function safeCompareHex(actual: string, expected: string): boolean {
  if (!/^[a-f0-9]{64}$/i.test(actual) || !/^[a-f0-9]{64}$/i.test(expected)) return false;
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
}

function initDb(db: Database.Database) {
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      status TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 0,
      treba TEXT NOT NULL,
      note_type TEXT NOT NULL,
      names_json TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      duration TEXT,
      akafist_target TEXT,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'BYN',
      payment_id TEXT UNIQUE,
      paid_at TEXT,
      idempotency_key TEXT NOT NULL UNIQUE,
      payload_sha256 TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS webhook_events (
      event_id TEXT PRIMARY KEY,
      received_at TEXT NOT NULL,
      payload_sha256 TEXT NOT NULL,
      result TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS audit_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      actor TEXT NOT NULL,
      created_at TEXT NOT NULL,
      data_json TEXT NOT NULL,
      FOREIGN KEY(note_id) REFERENCES notes(id)
    );
    CREATE TABLE IF NOT EXISTS notification_outbox (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note_id TEXT NOT NULL,
      event_key TEXT NOT NULL UNIQUE,
      channel TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      attempts INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      sent_at TEXT,
      receipt TEXT,
      FOREIGN KEY(note_id) REFERENCES notes(id)
    );
  `);
}

function mapNote(row: any) {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    version: row.version,
    treba: row.treba,
    type: row.note_type,
    names: JSON.parse(row.names_json),
    senderName: row.sender_name,
    duration: row.duration,
    akafistTarget: row.akafist_target,
    amount: row.amount,
    currency: row.currency,
    paymentId: row.payment_id,
    paidAt: row.paid_at,
  };
}

async function deliverTelegram(config: AppConfig, message: string): Promise<string> {
  if (config.telegramMode !== 'live') return 'stored-in-outbox';
  if (!config.telegramBotToken || !config.telegramChatId) throw new Error('Telegram credentials are not configured');
  const response = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: config.telegramChatId, text: message }),
  });
  const result = await response.json() as { ok?: boolean; result?: { message_id?: number }; description?: string };
  if (!response.ok || !result.ok) throw new Error(result.description ?? 'Telegram delivery failed');
  return `telegram:${result.result?.message_id ?? 'unknown'}`;
}

export function createApp(config: AppConfig) {
  if (!config.webhookSecret) throw new Error('webhookSecret is required');
  if (!config.adminToken) throw new Error('adminToken is required');
  const db = new Database(config.dbPath);
  initDb(db);
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", 'data:'],
        "connect-src": ["'self'"],
        "object-src": ["'none'"],
        "base-uri": ["'self'"],
        "frame-ancestors": ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));
  const publicLimiter = rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false });
  const adminLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 60, standardHeaders: 'draft-8', legacyHeaders: false });
  const webhookLimiter = rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false });

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.post('/api/webhooks/payment', webhookLimiter, express.text({ type: 'application/json', limit: '64kb' }), async (req, res) => {
    const raw = typeof req.body === 'string' ? req.body : '';
    const signature = String(req.header('X-Webhook-Signature') ?? '');
    const expected = crypto.createHmac('sha256', config.webhookSecret).update(raw).digest('hex');
    if (!safeCompareHex(signature, expected)) return res.status(401).json({ error: 'invalid_signature' });

    let event: any;
    try { event = JSON.parse(raw); } catch { return res.status(400).json({ error: 'invalid_json' }); }
    if (!event.eventId || !event.noteId || !event.paymentId || event.type !== 'payment.succeeded') {
      return res.status(400).json({ error: 'unsupported_event' });
    }

    const existing = db.prepare('SELECT result FROM webhook_events WHERE event_id = ?').get(event.eventId) as any;
    if (existing) return res.json({ ok: true, duplicate: true, result: existing.result });

    const noteRow = db.prepare('SELECT * FROM notes WHERE id = ?').get(event.noteId) as any;
    if (!noteRow) return res.status(404).json({ error: 'note_not_found' });
    if (event.currency !== noteRow.currency || Number(event.amount) !== noteRow.amount) {
      return res.status(409).json({ error: 'amount_mismatch' });
    }

    const now = new Date().toISOString();
    const transaction = db.transaction(() => {
      const fresh = db.prepare('SELECT * FROM notes WHERE id = ?').get(event.noteId) as any;
      if (fresh.status !== 'pending_payment' && fresh.status !== 'paid') throw new Error('invalid_note_state');
      if (fresh.payment_id && fresh.payment_id !== event.paymentId) throw new Error('payment_conflict');
      if (fresh.status === 'pending_payment') {
        db.prepare(`UPDATE notes SET status='paid', version=version+1, payment_id=?, paid_at=?, updated_at=? WHERE id=?`)
          .run(event.paymentId, now, now, event.noteId);
        db.prepare(`INSERT INTO audit_events(note_id,event_type,actor,created_at,data_json) VALUES(?,?,?,?,?)`)
          .run(event.noteId, 'payment_confirmed', 'payment_webhook', now, JSON.stringify({ paymentId: event.paymentId, eventId: event.eventId }));
        const message = `Новая оплаченная записка №${event.noteId}\nТреба: ${fresh.treba}\nТип: ${fresh.note_type}\nИмен: ${JSON.parse(fresh.names_json).length}\nСумма: ${fresh.amount} ${fresh.currency}`;
        db.prepare(`INSERT INTO notification_outbox(note_id,event_key,channel,message,created_at) VALUES(?,?,?,?,?)`)
          .run(event.noteId, `payment:${event.paymentId}`, 'telegram', message, now);
      }
      db.prepare(`INSERT INTO webhook_events(event_id,received_at,payload_sha256,result) VALUES(?,?,?,?)`)
        .run(event.eventId, now, sha256(raw), 'accepted');
    });

    try { transaction(); } catch (error) {
      return res.status(409).json({ error: error instanceof Error ? error.message : 'conflict' });
    }

    const outbox = db.prepare(`SELECT * FROM notification_outbox WHERE event_key=?`).get(`payment:${event.paymentId}`) as any;
    if (outbox && outbox.status === 'pending') {
      try {
        const receipt = await deliverTelegram(config, outbox.message);
        db.prepare(`UPDATE notification_outbox SET status='sent',attempts=attempts+1,sent_at=?,receipt=? WHERE id=?`)
          .run(new Date().toISOString(), receipt, outbox.id);
      } catch (error) {
        db.prepare(`UPDATE notification_outbox SET status='failed',attempts=attempts+1,receipt=? WHERE id=?`)
          .run(error instanceof Error ? error.message : 'delivery failed', outbox.id);
      }
    }
    return res.json({ ok: true });
  });

  app.use(express.json({ limit: '64kb' }));

  app.post('/api/notes', publicLimiter, (req, res) => {
    const idempotencyKey = String(req.header('Idempotency-Key') ?? '').trim();
    if (idempotencyKey.length < 8 || idempotencyKey.length > 120) return res.status(400).json({ error: 'invalid_idempotency_key' });
    let input: CreateNoteInput;
    try { input = validateNoteInput(req.body); } catch (error) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'invalid_input' });
    }
    const payloadHash = sha256(canonicalJson(input));
    const existing = db.prepare('SELECT * FROM notes WHERE idempotency_key = ?').get(idempotencyKey) as any;
    if (existing) {
      if (existing.payload_sha256 !== payloadHash) return res.status(409).json({ error: 'idempotency_payload_mismatch' });
      return res.json({ note: mapNote(existing), duplicate: true });
    }
    const now = new Date().toISOString();
    const id = `note_${crypto.randomUUID().replaceAll('-', '').slice(0, 16)}`;
    const amount = calculateAmount(input.treba, input.names.length);
    db.prepare(`INSERT INTO notes(id,created_at,updated_at,status,version,treba,note_type,names_json,sender_name,duration,akafist_target,amount,idempotency_key,payload_sha256)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .run(id, now, now, 'pending_payment', 0, input.treba, input.type, JSON.stringify(input.names), input.senderName, input.duration ?? null, input.akafistTarget ?? null, amount, idempotencyKey, payloadHash);
    db.prepare(`INSERT INTO audit_events(note_id,event_type,actor,created_at,data_json) VALUES(?,?,?,?,?)`)
      .run(id, 'note_created', 'public_form', now, JSON.stringify({ amount, currency: 'BYN' }));
    const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
    return res.status(201).json({ note: mapNote(note) });
  });

  function requireAdmin(req: Request, res: Response, next: NextFunction) {
    const token = String(req.header('Authorization') ?? '').replace(/^Bearer\s+/i, '');
    const a = Buffer.from(token);
    const b = Buffer.from(config.adminToken);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).json({ error: 'unauthorized' });
    next();
  }

  app.use('/api/admin', adminLimiter, requireAdmin);

  app.get('/api/admin/session', (_req, res) => {
    res.json({ authenticated: true });
  });

  app.get('/api/admin/notes', (req, res) => {
    const status = typeof req.query.status === 'string' ? req.query.status : null;
    const rows = status
      ? db.prepare('SELECT * FROM notes WHERE status = ? ORDER BY created_at DESC').all(status)
      : db.prepare('SELECT * FROM notes ORDER BY created_at DESC').all();
    res.json({ notes: rows.map(mapNote) });
  });

  app.get('/api/admin/notes/:id', (req, res) => {
    const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id) as any;
    if (!note) return res.status(404).json({ error: 'not_found' });
    const audit = db.prepare('SELECT * FROM audit_events WHERE note_id = ? ORDER BY id').all(req.params.id);
    res.json({ note: mapNote(note), audit });
  });

  app.get('/api/admin/outbox', (_req, res) => {
    res.json({ items: db.prepare('SELECT * FROM notification_outbox ORDER BY id DESC').all() });
  });

  app.post('/api/admin/notes/:id/print', (req, res) => {
    const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id) as any;
    if (!note) return res.status(404).json({ error: 'not_found' });
    const expectedVersion = Number(req.body?.expectedVersion);
    if (note.version !== expectedVersion) return res.status(409).json({ error: 'version_conflict', currentVersion: note.version });
    if (note.status !== 'paid' && note.status !== 'printing') return res.status(409).json({ error: 'illegal_transition' });
    const names = JSON.parse(note.names_json) as string[];
    const document = [
      `Записка №${note.id}`,
      `${note.treba} — ${note.note_type === 'zdravie' ? 'о здравии' : 'об упокоении'}`,
      '',
      ...names.map((name, index) => `${index + 1}. ${name}`),
      '',
      'Статус оплаты: оплачено',
    ].join('\n');
    const now = new Date().toISOString();
    const transaction = db.transaction(() => {
      if (note.status === 'paid') {
        const changed = db.prepare(`UPDATE notes SET status='printing',version=version+1,updated_at=? WHERE id=? AND version=?`)
          .run(now, note.id, expectedVersion);
        if (changed.changes !== 1) throw new Error('version_conflict');
        db.prepare(`INSERT INTO audit_events(note_id,event_type,actor,created_at,data_json) VALUES(?,?,?,?,?)`)
          .run(note.id, 'status_changed', 'admin', now, JSON.stringify({ from: 'paid', to: 'printing' }));
      }
      db.prepare(`INSERT INTO audit_events(note_id,event_type,actor,created_at,data_json) VALUES(?,?,?,?,?)`)
        .run(note.id, 'print_generated', 'admin', now, '{}');
    });
    try { transaction(); } catch { return res.status(409).json({ error: 'version_conflict' }); }
    const updated = db.prepare('SELECT * FROM notes WHERE id = ?').get(note.id);
    res.json({ printDocument: document, note: mapNote(updated) });
  });

  app.patch('/api/admin/notes/:id/status', (req, res) => {
    const status = req.body?.status as NoteStatus;
    const expectedVersion = Number(req.body?.expectedVersion);
    if (!Object.hasOwn(STATUS_TRANSITIONS, status)) return res.status(400).json({ error: 'invalid_status' });
    const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id) as any;
    if (!note) return res.status(404).json({ error: 'not_found' });
    if (note.version !== expectedVersion) return res.status(409).json({ error: 'version_conflict', currentVersion: note.version });
    if (!STATUS_TRANSITIONS[note.status as NoteStatus].includes(status)) return res.status(409).json({ error: 'illegal_transition' });
    const now = new Date().toISOString();
    const changed = db.prepare(`UPDATE notes SET status=?,version=version+1,updated_at=? WHERE id=? AND version=?`)
      .run(status, now, note.id, expectedVersion);
    if (changed.changes !== 1) return res.status(409).json({ error: 'version_conflict' });
    db.prepare(`INSERT INTO audit_events(note_id,event_type,actor,created_at,data_json) VALUES(?,?,?,?,?)`)
      .run(note.id, 'status_changed', 'admin', now, JSON.stringify({ from: note.status, to: status }));
    const updated = db.prepare('SELECT * FROM notes WHERE id = ?').get(note.id);
    res.json({ note: mapNote(updated) });
  });

  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error);
    res.status(500).json({ error: 'internal_error' });
  });

  return { app, db, close: () => db.close() };
}

export { calculateAmount };
