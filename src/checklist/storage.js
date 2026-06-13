const STORAGE_KEY = "aw139-checklist-state-v3-rev23";
const LOG_KEY = "aw139-flight-log-v2-rev23";
const SETTINGS_KEY = "aw139-app-settings-v1";

const defaultState = {
  profileId: null,       // "normal" | "offshore" | "normal_offshore" | "normal_stops"
  profileParams: {},     // { offshoreLegs: 1 } or { stops: 1 }
  flightRegistration: "",
  flightRemarks: "",
  selectedStepId: null,
  activeItemId: null,
  completed: {},
  skipped: {},
  completedTimestamps: {},
  completedAt: null,
  lastUpdatedAt: null,
  flightSessionStartedAt: null
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : { ...defaultState };
  } catch {
    return { ...defaultState };
  }
}

export function saveState(state) {
  const next = { ...state, lastUpdatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function resetAllState() {
  localStorage.removeItem(STORAGE_KEY);
  return { ...defaultState };
}

export function loadFlightLog() {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFlightLog(log) {
  localStorage.setItem(LOG_KEY, JSON.stringify(log));
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { registration: "", nightMode: false, ...JSON.parse(raw) } : { registration: "", nightMode: false };
  } catch {
    return { registration: "", nightMode: false };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
