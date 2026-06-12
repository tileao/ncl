export function getPhaseProgress(phase, state) {
  const completed = new Set(state.completed?.[phase.id] || []);
  const requiredItems = phase.items.filter(item => item.required !== false);
  const completedRequired = requiredItems.filter(item => completed.has(item.id));
  const total = requiredItems.length;
  const done = completedRequired.length;

  return {
    done,
    total,
    percent: total === 0 ? 100 : Math.round((done / total) * 100),
    isComplete: total > 0 && done === total
  };
}

export function getNextPendingItem(phase, state) {
  const completed = new Set(state.completed?.[phase.id] || []);
  return phase.items.find(item => item.required !== false && !completed.has(item.id)) || null;
}

export function getItemStatus(phase, item, state) {
  const completed = new Set(state.completed?.[phase.id] || []);
  const skipped = new Set(state.skipped?.[phase.id] || []);

  if (completed.has(item.id)) return "completed";
  if (skipped.has(item.id)) return "skipped";
  if (state.activeItemId === item.id) return "active";
  return "pending";
}

export function toggleItem(phase, itemId, state) {
  const current = new Set(state.completed?.[phase.id] || []);
  const skipped = new Set(state.skipped?.[phase.id] || []);

  if (current.has(itemId)) {
    current.delete(itemId);
  } else {
    current.add(itemId);
    skipped.delete(itemId);
  }

  const nextState = {
    ...state,
    selectedPhaseId: phase.id,
    completed: {
      ...state.completed,
      [phase.id]: Array.from(current)
    },
    skipped: {
      ...state.skipped,
      [phase.id]: Array.from(skipped)
    }
  };

  const nextPending = getNextPendingItem(phase, nextState);
  nextState.activeItemId = nextPending?.id || null;

  return nextState;
}

export function markSkipped(phase, itemId, state) {
  const completed = new Set(state.completed?.[phase.id] || []);
  const skipped = new Set(state.skipped?.[phase.id] || []);

  completed.delete(itemId);
  skipped.add(itemId);

  const nextState = {
    ...state,
    selectedPhaseId: phase.id,
    activeItemId: itemId,
    completed: {
      ...state.completed,
      [phase.id]: Array.from(completed)
    },
    skipped: {
      ...state.skipped,
      [phase.id]: Array.from(skipped)
    }
  };

  return nextState;
}

export function resetPhase(phase, state) {
  const completed = { ...state.completed };
  const skipped = { ...state.skipped };
  delete completed[phase.id];
  delete skipped[phase.id];

  return {
    ...state,
    selectedPhaseId: phase.id,
    activeItemId: phase.items[0]?.id || null,
    completed,
    skipped
  };
}
