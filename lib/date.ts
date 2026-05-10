const DEFAULT_TIME_ZONE = "Asia/Kolkata";

function partsFor(date: Date, timeZone = DEFAULT_TIME_ZONE) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  return formatter.format(date);
}

export function todayInputDate() {
  return partsFor(new Date());
}

export function toDateInput(date: Date) {
  return partsFor(date);
}

export function parseDateInput(value?: string | null) {
  const date = value && value.trim().length ? value : todayInputDate();
  return new Date(`${date}T00:00:00.000Z`);
}

export function toDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: DEFAULT_TIME_ZONE,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

export function startOfWeek(date = new Date()) {
  const input = parseDateInput(toDateInput(date));
  const day = input.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  input.setUTCDate(input.getUTCDate() - diff);
  return input;
}

export function endOfWeek(date = new Date()) {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  return end;
}

export function startOfMonth(date = new Date()) {
  const input = parseDateInput(toDateInput(date));
  input.setUTCDate(1);
  return input;
}

export function daysAgo(days: number) {
  const date = parseDateInput(todayInputDate());
  date.setUTCDate(date.getUTCDate() - days);
  return date;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
