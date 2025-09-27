import { promises as fs } from 'fs';
import path from 'path';

export type Settings = {
  ordersOpen: boolean;
  autoClose: {
    enabled: boolean;
    // 0-6 (0=Sunday) using JS getDay convention
    weekday: number | null;
    // "HH:MM" 24h
    time: string | null;
  };
};

const dataDir = path.join(process.cwd(), '.data');
const settingsPath = path.join(dataDir, 'settings.json');

const defaultSettings: Settings = {
  ordersOpen: true,
  autoClose: { enabled: false, weekday: null, time: null }
};

export async function getSettings(): Promise<Settings> {
  try {
    const raw = await fs.readFile(settingsPath, 'utf-8');
    const parsed = JSON.parse(raw) as Settings;
    return {
      ordersOpen: parsed.ordersOpen ?? true,
      autoClose: {
        enabled: parsed.autoClose?.enabled ?? false,
        weekday: parsed.autoClose?.weekday ?? null,
        time: parsed.autoClose?.time ?? null,
      }
    };
  } catch {
    await ensureDir();
    await fs.writeFile(settingsPath, JSON.stringify(defaultSettings, null, 2));
    return defaultSettings;
  }
}

export async function setSettings(next: Settings): Promise<void> {
  await ensureDir();
  await fs.writeFile(settingsPath, JSON.stringify(next, null, 2));
}

export async function toggleOrdersOpen(): Promise<Settings> {
  const s = await getSettings();
  const next = { ...s, ordersOpen: !s.ordersOpen };
  await setSettings(next);
  return next;
}

export async function updateSchedule(params: { enabled: boolean; weekday: number | null; time: string | null }): Promise<Settings> {
  const s = await getSettings();
  const next: Settings = { ...s, autoClose: { enabled: params.enabled, weekday: params.weekday, time: params.time } };
  await setSettings(next);
  return next;
}

export async function applyAutoCloseIfDue(now = new Date()): Promise<Settings> {
  const s = await getSettings();
  if (!s.autoClose.enabled || s.autoClose.weekday == null || !s.autoClose.time) return s;

  const [hh, mm] = s.autoClose.time.split(':').map((n) => Number(n));
  if (Number.isNaN(hh) || Number.isNaN(mm)) return s;

  const dow = now.getDay(); // 0-6, 0=Sunday
  if (dow !== s.autoClose.weekday) return s;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = hh * 60 + mm;
  if (nowMinutes >= targetMinutes && s.ordersOpen) {
    const next = { ...s, ordersOpen: false };
    await setSettings(next);
    return next;
  }
  return s;
}

async function ensureDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch {}
}
