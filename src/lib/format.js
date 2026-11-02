export function formatMoney(value, digits = 2) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatNumber(value, digits = 2) {
  return Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatPct(value) {
  const number = Number(value || 0);
  const sign = number > 0 ? "+" : "";
  return `${sign}${number.toFixed(2)}%`;
}

export function formatSignedMoney(value) {
  const number = Number(value || 0);
  const core = formatMoney(Math.abs(number));
  if (number > 0) return `+${core}`;
  if (number < 0) return `-${core}`;
  return core;
}

export function formatSignedPoints(value) {
  const number = Number(value || 0);
  const sign = number > 0 ? "+" : "";
  return `${sign}${number.toFixed(2)}`;
}

export function formatQuote(quote) {
  if (!quote) return "—";
  if (quote.kind === "index") return formatNumber(quote.price);
  return formatMoney(quote.price);
}

export function formatDelta(quote) {
  if (!quote) return "—";
  const diff = quote.price - quote.prevClose;
  return quote.kind === "index" ? formatSignedPoints(diff) : formatSignedMoney(diff);
}

export function toneClass(value) {
  return Number(value) >= 0 ? "text-[#3ddc97]" : "text-[#ff5c7a]";
}

export function formatClockMinutes(mins) {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function sessionState(now, session) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: session.tz,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const map = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  const weekend = map.weekday === "Sat" || map.weekday === "Sun";
  const mins = Number(map.hour) * 60 + Number(map.minute);
  let phase = "Closed";
  if (!weekend && mins >= session.open && mins < session.close) phase = "Open";
  else if (!weekend && mins >= session.close && mins < session.close + 180) phase = "After hours";
  else if (weekend) phase = "Weekend";
  const clock = new Intl.DateTimeFormat("en-US", {
    timeZone: session.tz,
    hour: "numeric",
    minute: "2-digit",
  }).format(now);
  return { open: phase === "Open", phase, clock };
}

export function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}
