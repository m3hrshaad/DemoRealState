const KEY = 'amlak_visitor_id';

export function getVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
    return id;
  } catch {
    return 'anonymous';
  }
}
