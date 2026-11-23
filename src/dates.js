// Local-date helpers. Dates are stored as "YYYY-MM-DD" strings in local time.

export function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function today() {
  return toISODate(new Date());
}

export function addDays(iso, n) {
  const [y, m, d] = iso.split('-').map(Number);
  return toISODate(new Date(y, m - 1, d + n));
}

function parse(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** 'overdue' | 'today' | 'future' | null */
export function dueState(iso) {
  if (!iso) return null;
  const t = today();
  if (iso < t) return 'overdue';
  if (iso === t) return 'today';
  return 'future';
}

export function formatDue(iso) {
  if (!iso) return '';
  const t = today();
  if (iso === t) return 'Due today';
  if (iso === addDays(t, 1)) return 'Due tomorrow';
  if (iso === addDays(t, -1)) return 'Overdue · yesterday';
  const d = parse(iso);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  const label = d.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  return iso < t ? `Overdue · ${label}` : `Due ${label}`;
}

export function formatLongToday() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}
