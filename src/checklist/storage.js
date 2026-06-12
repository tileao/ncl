const STORAGE_KEY = "aw139-checklist-state-v2-rev23";

const defaultState = {
  flightType: null,
  selectedPhaseId: null,
  activeItemId: null,
  completed: {},
  skipped: {},
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
  const next = {
    ...state,
    lastUpdatedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function resetAllState() {
  localStorage.removeItem(STORAGE_KEY);
  return { ...defaultState };
}
