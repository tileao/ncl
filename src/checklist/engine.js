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

export function getItemStatus(phase, item, state, stateKey) {
  const key = stateKey !== undefined ? stateKey : phase.id;
  const completed = new Set(state.completed?.[key] || []);
  const skipped = new Set(state.skipped?.[key] || []);
  if (completed.has(item.id)) return "completed";
  if (skipped.has(item.id)) return "skipped";
  if (state.activeItemId === item.id) return "active";
  return "pending";
}

export function toggleItem(phase, itemId, state, stateKey) {
  const key = stateKey !== undefined ? stateKey : phase.id;
  const current = new Set(state.completed?.[key] || []);
  const skipped = new Set(state.skipped?.[key] || []);
  if (current.has(itemId)) {
    current.delete(itemId);
  } else {
    current.add(itemId);
    skipped.delete(itemId);
  }
  const nextState = {
    ...state,
    completed: { ...state.completed, [key]: Array.from(current) },
    skipped: { ...state.skipped, [key]: Array.from(skipped) }
  };
  const nextPending = getNextPendingItem(phase, nextState, key);
  nextState.activeItemId = nextPending?.id || null;
  return nextState;
}

export function markSkipped(phase, itemId, state, stateKey) {
  const key = stateKey !== undefined ? stateKey : phase.id;
  const completed = new Set(state.completed?.[key] || []);
  const skipped = new Set(state.skipped?.[key] || []);
  completed.delete(itemId);
  skipped.add(itemId);
  return {
    ...state,
    activeItemId: itemId,
    completed: { ...state.completed, [key]: Array.from(completed) },
    skipped: { ...state.skipped, [key]: Array.from(skipped) }
  };
}

export function resetPhase(phase, state, stateKey) {
  const key = stateKey !== undefined ? stateKey : phase.id;
  const completed = { ...state.completed };
  const skipped = { ...state.skipped };
  delete completed[key];
  delete skipped[key];
  return {
    ...state,
    activeItemId: phase.items[0]?.id || null,
    completed,
    skipped
  };
}
