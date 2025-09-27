import type { Actions, PageServerLoad } from './$types';
import { getSettings, toggleOrdersOpen, updateSchedule } from '$lib/server/settings';

export const load: PageServerLoad = async () => {
  const settings = await getSettings();
  return { settings };
};

export const actions: Actions = {
  toggleOpen: async () => {
    const settings = await toggleOrdersOpen();
    return { success: true, settings } as const;
  },
  setSchedule: async ({ request }) => {
    const data = await request.formData();
    const enabled = data.get('enabled') === 'on' || data.get('enabled') === 'true';
    const weekdayStr = data.get('weekday');
    const time = (data.get('time') as string) || null;
    const weekday = weekdayStr != null && String(weekdayStr) !== '' ? Number(weekdayStr) : null;

    const settings = await updateSchedule({ enabled, weekday, time });
    return { success: true, settings } as const;
  }
};
