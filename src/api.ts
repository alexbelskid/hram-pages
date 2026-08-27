export type NoteStatus =
  | 'pending_payment'
  | 'paid'
  | 'printing'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type ChurchNote = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: NoteStatus;
  version: number;
  treba: string;
  type: 'zdravie' | 'upokoenie';
  names: string[];
  senderName: string;
  duration?: string | null;
  akafistTarget?: string | null;
  amount: number;
  currency: string;
  paymentId?: string | null;
  paidAt?: string | null;
};

const apiBase = import.meta.env.VITE_API_BASE ?? '';

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? `HTTP ${response.status}`);
  return body as T;
}

export function createNote(
  input: {
    treba: string;
    type: 'zdravie' | 'upokoenie';
    names: string[];
    senderName: string;
    duration?: string;
    akafistTarget?: string;
  },
  idempotencyKey: string,
) {
  return api<{ note: ChurchNote; duplicate?: boolean }>('/api/notes', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(input),
  });
}

function adminHeaders(token: string, json = false): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    ...(json ? { 'content-type': 'application/json' } : {}),
  };
}

export function validateAdminSession(token: string) {
  return api<{ authenticated: true }>('/api/admin/session', {
    headers: adminHeaders(token),
  });
}

export function listNotes(token: string, status?: string) {
  const suffix = status ? `?status=${encodeURIComponent(status)}` : '';
  return api<{ notes: ChurchNote[] }>(`/api/admin/notes${suffix}`, {
    headers: adminHeaders(token),
  });
}

export function getNote(token: string, id: string) {
  return api<{ note: ChurchNote; audit: Array<Record<string, unknown>> }>(`/api/admin/notes/${id}`, {
    headers: adminHeaders(token),
  });
}

export function changeNoteStatus(token: string, note: ChurchNote, status: NoteStatus) {
  return api<{ note: ChurchNote }>(`/api/admin/notes/${note.id}/status`, {
    method: 'PATCH',
    headers: adminHeaders(token, true),
    body: JSON.stringify({ status, expectedVersion: note.version }),
  });
}

export function getPrintDocument(token: string, note: ChurchNote) {
  return api<{ printDocument: string; note: ChurchNote }>(`/api/admin/notes/${note.id}/print`, {
    method: 'POST',
    headers: adminHeaders(token, true),
    body: JSON.stringify({ expectedVersion: note.version }),
  });
}

export function listOutbox(token: string) {
  return api<{ items: Array<Record<string, unknown>> }>('/api/admin/outbox', {
    headers: adminHeaders(token),
  });
}
