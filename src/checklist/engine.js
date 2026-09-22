export function getPhaseProgress(phase, state, stateKey) {
  const key = stateKey !== undefined ? stateKey : phase.id;
  const completed = new Set(state.completed?.[key] || []);
  const requiredItems = phase.items.filter(item => item.required !== false);
  const done = requiredItems.filter(item => completed.has(item.id)).length;
  const total = requiredItems.length;
  return {
    done,
    total,
    percent: total === 0 ? 100 : Math.round((done / total) * 100),
    isComplete: total > 0 && done === total
  };
}

export function getNextPendingItem(phase, state, stateKey) {
  const key = stateKey !== undefined ? stateKey : phase.id;
  const completed = new Set(state.completed?.[key] || []);
  return phase.items.find(item => item.required !== false && !completed.has(item.id)) || null;
}

function lastCompletedIndex(phase, completed) {
  for (let i = phase.items.length - 1; i >= 0; i--) {
    if (completed.has(phase.items[i].id)) return i;
  }
  return -1;
}

// The item the crew is on: the one right after the last checked item.
export function getCurrentItem(phase, state, stateKey) {
  const key = stateKey !== undefined ? stateKey : phase.id;
  const completed = new Set(state.completed?.[key] || []);
  return phase.items[lastCompletedIndex(phase, completed) + 1] || null;
}

// An unchecked item counts as not accomplished ("skipped") as soon as any
// item below it in the same checklist has been checked.
export function getItemStatus(phase, item, state, stateKey) {
  const key = stateKey !== undefined ? stateKey : phase.id;
  const completed = new Set(state.completed?.[key] || []);
  if (completed.has(item.id)) return "completed";
  const idx = phase.items.indexOf(item);
  const last = lastCompletedIndex(phase, completed);
  if (idx < last) return "skipped";
  return idx === last + 1 ? "active" : "pending";
}

export function toggleItem(phase, itemId, state, stateKey, timestamp) {
  const key = stateKey !== undefined ? stateKey : phase.id;
  const current = new Set(state.completed?.[key] || []);
  const tsMap = { ...(state.completedTimestamps?.[key] || {}) };

  if (current.has(itemId)) {
    current.delete(itemId);
    delete tsMap[itemId];
  } else {
    current.add(itemId);
    if (timestamp) tsMap[itemId] = timestamp;
  }

  const nextState = {
    ...state,
    completed: { ...state.completed, [key]: Array.from(current) },
    completedTimestamps: { ...(state.completedTimestamps || {}), [key]: tsMap }
  };
  nextState.activeItemId = getCurrentItem(phase, nextState, key)?.id || null;
  return nextState;
}

export function resetPhase(phase, state, stateKey) {
  const key = stateKey !== undefined ? stateKey : phase.id;
  const completed = { ...state.completed };
  const skipped = { ...state.skipped };
  const completedTimestamps = { ...(state.completedTimestamps || {}) };
  delete completed[key];
  delete skipped[key];
  delete completedTimestamps[key];
  return {
    ...state,
    activeItemId: phase.items[0]?.id || null,
    completed,
    skipped,
    completedTimestamps
  };
}
