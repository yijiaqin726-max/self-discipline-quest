import { useStorage } from '../composables/useStorage';

function migrateLegacyCheckins() {
  try {
    const raw = localStorage.getItem('sq_checkins');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || Object.keys(parsed).length === 0) return null;
    localStorage.removeItem('sq_checkins');
    return parsed;
  } catch {
    return null;
  }
}

export function useCalendarStore() {
  const legacyData = migrateLegacyCheckins();
  const defaultId = `cal_${Date.now()}`;

  const defaultState = {
    calendars: [{ id: defaultId, name: 'Default Calendar', color: '#4DFFA0', createdAt: Date.now() }],
    activeCalendarId: defaultId,
    data: { [defaultId]: legacyData || {} },
  };

  const store = useStorage('sq_calendars_v2', defaultState);

  const PALETTE = ['#4DFFA0', '#FFE03D', '#5BC8FF', '#FF6FB0', '#FF8C3D'];

  function save(next) {
    store.value = next;
  }

  function getSnapshot() {
    return store.value;
  }

  function addCalendar(name, color) {
    const current = getSnapshot();
    const id = `cal_${Date.now()}`;
    const usedColors = current.calendars.map((c) => c.color);
    const autoColor = color || PALETTE.find((c) => !usedColors.includes(c)) || PALETTE[current.calendars.length % PALETTE.length];

    save({
      ...current,
      calendars: [...current.calendars, { id, name: (name || '').trim() || 'New Calendar', color: autoColor, createdAt: Date.now() }],
      activeCalendarId: id,
      data: { ...current.data, [id]: {} },
    });
  }

  function deleteCalendar(id) {
    const current = getSnapshot();
    if (current.calendars.length <= 1) return;

    const calendars = current.calendars.filter((c) => c.id !== id);
    const data = { ...current.data };
    delete data[id];

    save({
      ...current,
      calendars,
      data,
      activeCalendarId: current.activeCalendarId === id ? calendars[0].id : current.activeCalendarId,
    });
  }

  function renameCalendar(id, newName) {
    const trimmed = (newName || '').trim();
    if (!trimmed) return;

    const current = getSnapshot();
    save({
      ...current,
      calendars: current.calendars.map((c) => (c.id === id ? { ...c, name: trimmed } : c)),
    });
  }

  function setActiveCalendar(id) {
    const current = getSnapshot();
    if (!current.calendars.some((c) => c.id === id)) return;
    save({ ...current, activeCalendarId: id });
  }

  function getMonthCheckins(year, month) {
    const key = `${year}-${String(month).padStart(2, '0')}`;
    const current = getSnapshot();
    const activeData = current.data[current.activeCalendarId] || {};
    return activeData[key] || [];
  }

  function isCheckedIn(year, month, day) {
    return getMonthCheckins(year, month).includes(day);
  }

  function toggleCheckin(year, month, day) {
    const key = `${year}-${String(month).padStart(2, '0')}`;
    const current = getSnapshot();
    const activeId = current.activeCalendarId;
    const activeData = { ...(current.data[activeId] || {}) };
    const monthDays = activeData[key] || [];

    activeData[key] = monthDays.includes(day) ? monthDays.filter((d) => d !== day) : [...monthDays, day];

    save({
      ...current,
      data: {
        ...current.data,
        [activeId]: activeData,
      },
    });
  }

  function clearMonth(year, month) {
    const key = `${year}-${String(month).padStart(2, '0')}`;
    const current = getSnapshot();
    const activeId = current.activeCalendarId;
    const activeData = { ...(current.data[activeId] || {}), [key]: [] };

    save({
      ...current,
      data: {
        ...current.data,
        [activeId]: activeData,
      },
    });
  }

  function getCurrentStreak() {
    const today = new Date();
    let streak = 0;
    const cursor = new Date(today);

    while (true) {
      const y = cursor.getFullYear();
      const m = cursor.getMonth() + 1;
      const d = cursor.getDate();
      if (!isCheckedIn(y, m, d)) break;
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  }

  return {
    PALETTE,
    getSnapshot,
    addCalendar,
    deleteCalendar,
    renameCalendar,
    setActiveCalendar,
    getMonthCheckins,
    isCheckedIn,
    toggleCheckin,
    clearMonth,
    getCurrentStreak,
  };
}
