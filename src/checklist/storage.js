// v4: unified fleet caderno (one checklist per fleet, flight split into legs
// by the number of landings). State and log from the old NCL/OCL AW139
// dataset are not compatible, so they get new keys.
const STORAGE_KEY = "omni-checklist-state-v4-caderno-v7";
const LOG_KEY = "omni-flight-log-v3-caderno-v7";
const SETTINGS_KEY = "aw139-app-settings-v1";

const defaultState = {
  fleetId: null,
  landings: 1,
  flightRegistration: "",
  flightRemarks: "",
  selectedStepId: null,
  activeItemId: null,
  completed: {},
  skipped: {},
  completedTimestamps: {},
  completedAt: null,
  lastUpdatedAt: null,
  flightSessionStartedAt: null,
  flightTimes: { acionamento: null, decolagens: [], pousos: [], corte: null }
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

const defaultSettings = {
  fleetId: null, // null → caderno.defaultFleetId
  registration: "",
  nightMode: false,
  barriersDisabled: true,
  timingEnabled: false
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : { ...defaultSettings };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
