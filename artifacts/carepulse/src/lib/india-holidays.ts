export interface Holiday {
  date: string;
  name: string;
  type: "national" | "hindu" | "muslim" | "christian" | "sikh" | "jain" | "buddhist";
}

const INDIA_HOLIDAYS: Holiday[] = [
  // ─── 2025 Official Public Holidays ───
  { date: "2025-01-26", name: "Republic Day", type: "national" },
  { date: "2025-02-26", name: "Maha Shivaratri", type: "hindu" },
  { date: "2025-03-14", name: "Holi", type: "hindu" },
  { date: "2025-03-31", name: "Eid-ul-Fitr (Ramzan Id)", type: "muslim" },
  { date: "2025-04-06", name: "Ram Navami", type: "hindu" },
  { date: "2025-04-10", name: "Mahavir Jayanti", type: "jain" },
  { date: "2025-04-14", name: "Dr. Ambedkar Jayanti / Baisakhi", type: "national" },
  { date: "2025-04-18", name: "Good Friday", type: "christian" },
  { date: "2025-05-12", name: "Buddha Purnima", type: "buddhist" },
  { date: "2025-06-07", name: "Eid-ul-Adha (Bakrid)", type: "muslim" },
  { date: "2025-06-27", name: "Muharram", type: "muslim" },
  { date: "2025-08-15", name: "Independence Day", type: "national" },
  { date: "2025-08-16", name: "Janmashtami (Sri Krishna Jayanti)", type: "hindu" },
  { date: "2025-09-05", name: "Milad-un-Nabi (Id-e-Milad)", type: "muslim" },
  { date: "2025-10-02", name: "Mahatma Gandhi Jayanti / Dussehra", type: "national" },
  { date: "2025-10-20", name: "Diwali (Deepavali)", type: "hindu" },
  { date: "2025-10-21", name: "Govardhan Puja", type: "hindu" },
  { date: "2025-10-22", name: "Bhai Dooj", type: "hindu" },
  { date: "2025-11-05", name: "Guru Nanak Jayanti (Gurpurab)", type: "sikh" },
  { date: "2025-12-25", name: "Christmas Day", type: "christian" },

  // ─── 2026 Official Public Holidays ───
  { date: "2026-01-26", name: "Republic Day", type: "national" },
  { date: "2026-02-15", name: "Maha Shivaratri", type: "hindu" },
  { date: "2026-03-03", name: "Holi", type: "hindu" },
  { date: "2026-03-20", name: "Eid-ul-Fitr (Ramzan Id)", type: "muslim" },
  { date: "2026-03-27", name: "Ram Navami", type: "hindu" },
  { date: "2026-04-02", name: "Mahavir Jayanti", type: "jain" },
  { date: "2026-04-03", name: "Good Friday", type: "christian" },
  { date: "2026-04-14", name: "Dr. Ambedkar Jayanti / Baisakhi", type: "national" },
  { date: "2026-05-01", name: "Buddha Purnima", type: "buddhist" },
  { date: "2026-05-28", name: "Eid-ul-Adha (Bakrid)", type: "muslim" },
  { date: "2026-06-16", name: "Muharram", type: "muslim" },
  { date: "2026-08-05", name: "Janmashtami (Sri Krishna Jayanti)", type: "hindu" },
  { date: "2026-08-15", name: "Independence Day", type: "national" },
  { date: "2026-08-25", name: "Milad-un-Nabi (Id-e-Milad)", type: "muslim" },
  { date: "2026-10-02", name: "Mahatma Gandhi Jayanti", type: "national" },
  { date: "2026-10-21", name: "Dussehra (Vijaya Dashami)", type: "hindu" },
  { date: "2026-11-08", name: "Diwali (Deepavali)", type: "hindu" },
  { date: "2026-11-09", name: "Govardhan Puja", type: "hindu" },
  { date: "2026-11-25", name: "Guru Nanak Jayanti (Gurpurab)", type: "sikh" },
  { date: "2026-12-25", name: "Christmas Day", type: "christian" },

  // ─── 2027 Official Public Holidays ───
  { date: "2027-01-26", name: "Republic Day", type: "national" },
  { date: "2027-08-15", name: "Independence Day", type: "national" },
  { date: "2027-10-02", name: "Mahatma Gandhi Jayanti", type: "national" },
  { date: "2027-12-25", name: "Christmas Day", type: "christian" },
];

const holidayMap = new Map<string, Holiday>(
  INDIA_HOLIDAYS.map((h) => [h.date, h])
);

export function getHolidayInfo(dateStr: string): Holiday | null {
  return holidayMap.get(dateStr) || null;
}

export function isHoliday(dateStr: string): boolean {
  return holidayMap.has(dateStr);
}

export function getHolidayEmoji(type: Holiday["type"]): string {
  const map: Record<Holiday["type"], string> = {
    national: "🇮🇳",
    hindu: "🪔",
    muslim: "🌙",
    christian: "✝️",
    sikh: "☬",
    jain: "🙏",
    buddhist: "☸️",
  };
  return map[type];
}

export function getTodayIST(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffset);
  return ist.toISOString().split("T")[0];
}
