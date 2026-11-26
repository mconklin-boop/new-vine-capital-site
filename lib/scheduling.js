// Investor intake call availability (Mountain Time).
// Edit WEEKLY_HOURS to change when calls can be booked. Keys: 0=Sun ... 6=Sat.

export const TIME_ZONE = "America/Denver";
export const CALL_MINUTES = 30;
export const DAYS_AHEAD = 14; // calendar days shown
export const WEEKLY_HOURS = {
  1: ["09:00", "10:30", "13:00", "14:30"], // Mon (ends before evening shift)
  2: ["09:00", "10:30", "13:00", "14:30"], // Tue
  3: ["09:00", "10:30", "13:00", "14:30"], // Wed
  4: ["09:00", "10:30", "13:00", "14:30", "16:00"], // Thu
  5: ["09:00", "10:30", "13:00", "14:30", "16:00"], // Fri
};

// Current wall-clock time in Mountain Time as "YYYY-MM-DDTHH:MM".
export function nowLocal(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(now).map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function addDays(dateString, days) {
  const [y, m, d] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
}

function weekday(dateString) {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addMinutes(local, minutes) {
  const [date, time] = local.split("T");
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  return new Date(Date.UTC(y, mo - 1, d, h, mi + minutes)).toISOString().slice(0, 16);
}

export function labelForSlot(local) {
  const [date, time] = local.split("T");
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const asUtc = new Date(Date.UTC(y, mo - 1, d, h, mi));
  const day = asUtc.toLocaleDateString("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric" });
  const clock = asUtc.toLocaleTimeString("en-US", { timeZone: "UTC", hour: "numeric", minute: "2-digit" });
  return { day, time: clock, display: `${day} at ${clock} MT` };
}

// Bookable slots: starting tomorrow, configured hours only, minus booked starts.
export function buildAvailability({ now = new Date(), booked = [] } = {}) {
  const today = nowLocal(now).slice(0, 10);
  const taken = new Set(booked.map((value) => String(value).slice(0, 16)));
  const days = [];
  for (let offset = 1; offset <= DAYS_AHEAD; offset += 1) {
    const date = addDays(today, offset);
    const times = WEEKLY_HOURS[weekday(date)] || [];
    const slots = times.map((t) => `${date}T${t}`).filter((slot) => !taken.has(slot));
    if (slots.length) days.push({ date, label: labelForSlot(slots[0]).day, slots: slots.map((start) => ({ start, label: labelForSlot(start).time })) });
  }
  return days;
}

export function isBookable(start, opts) {
  return buildAvailability(opts).some((day) => day.slots.some((slot) => slot.start === start));
}
