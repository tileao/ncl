import { checklistData } from "./data/checklist-data.js";
import { loadState, saveState, resetAllState, loadFlightLog, saveFlightLog } from "./checklist/storage.js";
import {
  getPhaseProgress,
  getNextPendingItem,
  getItemStatus,
  toggleItem,
  markSkipped,
  resetPhase
} from "./checklist/engine.js";

const app = document.querySelector("#app");
let state = loadState();
let currentView = "groups"; // "groups" | "checklist"
let showingSelector = false;

// Restore last view on reload
if (state.flightType && !state.completedAt) {
  currentView = state.selectedPhaseId ? "checklist" : "groups";
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getPhaseIndex(phaseId) {
  return checklistData.phases.findIndex(p => p.id === phaseId);
}

function getFilteredPhases() {
  if (!state.flightType) return checklistData.phases;
  return checklistData.phases.filter(p => p.categoryId === state.flightType);
}

function getValidPhaseId(phaseId) {
  if (!phaseId) return null;
  return getPhaseIndex(phaseId) >= 0 ? phaseId : null;
}

function formatDuration(ms) {
  if (!ms || ms < 0) return "—";
  const totalMin = Math.round(ms / 60000);
  if (totalMin < 1) return "< 1 min";
  const h = Math.floor(totalMin / 60), m = totalMin % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

// SVG icons
const ICON_HOME = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`;
const ICON_GRID = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`;
const ICON_NEXT = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,18 15,12 9,6"/></svg>`;

// ─── State ────────────────────────────────────────────────────────────────────

state.selectedPhaseId = getValidPhaseId(state.selectedPhaseId);

const selectedPhase = () => {
  if (state.selectedPhaseId) {
    const found = checklistData.phases.find(p => p.id === state.selectedPhaseId);
    if (found) return found;
  }
  return getFilteredPhases()[0] || null;
};

function persist(nextState) {
  state = saveState({ ...nextState, selectedPhaseId: getValidPhaseId(nextState.selectedPhaseId) });
  render();
}

// ─── Navigation handlers ──────────────────────────────────────────────────────

function selectPhase(phaseId) {
  const phase = checklistData.phases.find(p => p.id === phaseId);
  if (!phase) return;
  currentView = "checklist";
  const active = getNextPendingItem(phase, state);
  persist({
    ...state,
    selectedPhaseId: phase.id,
    activeItemId: active?.id || phase.items[0]?.id || null,
    flightSessionStartedAt: state.flightSessionStartedAt || new Date().toISOString()
  });
}

function handleSelectFlightType(type) {
  showingSelector = false;
  currentView = "groups";
  const phases = checklistData.phases.filter(p => p.categoryId === type);
  const first = phases[0];
  persist({
    ...state,
    flightType: type,
    completedAt: null,
    selectedPhaseId: first?.id || null,
    activeItemId: first?.items[0]?.id || null,
    flightSessionStartedAt: new Date().toISOString()
  });
}

function handleHome() {
  showingSelector = true;
  render();
}

function handleShowGroups() {
  currentView = "groups";
  render();
}

function handleContinueFlight() {
  showingSelector = false;
  currentView = state.selectedPhaseId ? "checklist" : "groups";
  render();
}

function handleNextFromBar() {
  if (currentView === "groups") {
    const filtered = getFilteredPhases();
    const next = filtered.find(p => !getPhaseProgress(p, state).isComplete);
    if (next) { selectPhase(next.id); return; }
    if (isMissionComplete()) { handleCompleteFlight(); return; }
    return;
  }
  handleNextGroup();
}

// ─── Checklist handlers ───────────────────────────────────────────────────────

function isMissionComplete() {
  const filtered = getFilteredPhases();
  return filtered.length > 0 && filtered.every(p => getPhaseProgress(p, state).isComplete);
}

function getMissionStats() {
  const filtered = getFilteredPhases();
  const totalGroups = filtered.length;
  const totalItems = filtered.reduce((s, p) => s + p.items.filter(i => i.required !== false).length, 0);
  const startedAt = state.flightSessionStartedAt;
  const completedAt = new Date().toISOString();
  const durationMs = startedAt ? new Date(completedAt) - new Date(startedAt) : 0;
  return { totalGroups, totalItems, startedAt, completedAt, durationMs };
}

function handleCompleteFlight() {
  const stats = getMissionStats();
  const log = loadFlightLog();
  log.unshift({
    id: stats.completedAt,
    flightType: state.flightType,
    startedAt: stats.startedAt,
    completedAt: stats.completedAt,
    durationMs: stats.durationMs,
    totalGroups: stats.totalGroups,
    totalItems: stats.totalItems
  });
  saveFlightLog(log.slice(0, 30));
  persist({ ...state, completedAt: stats.completedAt });
}

function handleToggleItem(itemId) {
  persist(toggleItem(selectedPhase(), itemId, state));
}

function handleSkipItem(itemId) {
  const ok = window.confirm("Marcar este item como ATENÇÃO / NÃO CUMPRIDO? Ele continuará impedindo o avanço normal até ser cumprido.");
  if (!ok) return;
  persist(markSkipped(selectedPhase(), itemId, state));
}

function handleResetPhase() {
  const phase = selectedPhase();
  const ok = window.confirm(`Resetar o grupo ${phase.title}?`);
  if (!ok) return;
  persist(resetPhase(phase, state));
}

function handleResetAll() {
  const ok = window.confirm("Resetar todo o progresso e iniciar novo voo?");
  if (!ok) return;
  showingSelector = false;
  currentView = "groups";
  state = resetAllState();
  persist(state);
}

function handleReviewChecklist() {
  currentView = "checklist";
  persist({ ...state, completedAt: null });
}

function scrollToItem(itemId) {
  requestAnimationFrame(() => {
    document.querySelector(`[data-item-id="${itemId}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function handleGoNextPending() {
  const phase = selectedPhase();
  const next = getNextPendingItem(phase, state);
  if (!next) return;
  persist({ ...state, selectedPhaseId: phase.id, activeItemId: next.id });
  scrollToItem(next.id);
}

function handlePreviousGroup() {
  const filtered = getFilteredPhases();
  const idx = filtered.findIndex(p => p.id === state.selectedPhaseId);
  if (idx <= 0) return;
  selectPhase(filtered[idx - 1].id);
}

function handleNextGroup() {
  const phase = selectedPhase();
  if (!phase) return;
  const progress = getPhaseProgress(phase, state);
  const nextPending = getNextPendingItem(phase, state);

  if (!progress.isComplete && checklistData.flowRules.blockNextGroupUntilComplete) {
    if (nextPending) {
      persist({ ...state, activeItemId: nextPending.id });
      scrollToItem(nextPending.id);
      window.setTimeout(() => {
        window.alert(`Grupo ainda incompleto. Próximo item pendente: ${nextPending.challenge} — ${nextPending.response}`);
      }, 80);
    }
    return;
  }

  const filtered = getFilteredPhases();
  const idx = filtered.findIndex(p => p.id === phase.id);
  const next = filtered[idx + 1];
  if (!next) { handleCompleteFlight(); return; }
  selectPhase(next.id);
}

function getStatusLabel(status) {
  switch (status) {
    case "completed": return "DONE";
    case "active":    return "NEXT";
    case "skipped":   return "ATTN";
    default:          return "PENDING";
  }
}

// ─── Rendering ────────────────────────────────────────────────────────────────

function renderBottomBar() {
  const filtered = getFilteredPhases();
  const completedGroups = filtered.filter(p => getPhaseProgress(p, state).isComplete).length;
  const isGroupsView = currentView === "groups";
  const isChecklistView = currentView === "checklist";
  const nextLabel = `${completedGroups}/${filtered.length}`;

  return `
    <nav class="bottom-bar">
      <button class="bottom-btn ${!isGroupsView && !isChecklistView ? "active" : ""}" data-action="nav-home">
        ${ICON_HOME}
        <span class="bottom-label">Início</span>
      </button>
      <button class="bottom-btn ${isGroupsView ? "active" : ""}" data-action="nav-groups">
        ${ICON_GRID}
        <span class="bottom-label">Grupos</span>
      </button>
      <button class="bottom-btn can-advance" data-action="nav-next">
        ${ICON_NEXT}
        <span class="bottom-label">${nextLabel}</span>
      </button>
    </nav>
  `;
}

function renderMissionSelector() {
  const normalCount = checklistData.phases.filter(p => p.categoryId === "normal").length;
  const offshoreCount = checklistData.phases.filter(p => p.categoryId === "offshore").length;
  const hasFlight = !!state.flightType && !state.completedAt;

  return `
    <div class="mission-selector">
      <div class="mission-selector-inner">
        ${hasFlight ? `
          <button class="continue-flight-btn" data-action="continue-flight">
            ← Continuar ${state.flightType === "offshore" ? "Offshore" : "Normal"} Check List
          </button>
        ` : ""}
        <div class="mission-selector-brand">
          <div class="brand-title">${escapeHtml(checklistData.title)}</div>
          <div class="mission-selector-subtitle">${escapeHtml(checklistData.revision.source)} • Rev. ${escapeHtml(checklistData.revision.sourceRevision)}</div>
        </div>
        <div class="mission-selector-title">${hasFlight ? "Nova missão" : "Selecionar missão"}</div>
        <button class="mission-btn" data-action="select-flight-type" data-flight-type="normal">
          <span class="mission-btn-label">Normal</span>
          <span class="mission-btn-title">NORMAL CHECK LIST</span>
          <span class="mission-btn-desc">${normalCount} grupos — COCKPIT CHECKS até AFTER ROTOR STOPS</span>
        </button>
        <button class="mission-btn offshore" data-action="select-flight-type" data-flight-type="offshore">
          <span class="mission-btn-label">Offshore</span>
          <span class="mission-btn-title">OFFSHORE CHECK LIST</span>
          <span class="mission-btn-desc">${offshoreCount} grupos — BEFORE DESCENT até AFTER TAKE OFF</span>
        </button>
      </div>
    </div>
  `;
}

function renderGroupsPage() {
  const filtered = getFilteredPhases();
  const completedCount = filtered.filter(p => getPhaseProgress(p, state).isComplete).length;
  const missionLabel = state.flightType === "offshore" ? "OFFSHORE CHECK LIST" : "NORMAL CHECK LIST";

  const cards = filtered.map((phase, idx) => {
    const progress = getPhaseProgress(phase, state);
    const isComplete = progress.isComplete;
    const isActive = phase.id === state.selectedPhaseId;

    return `
      <button class="group-card ${isComplete ? "complete" : ""} ${isActive ? "active-group" : ""}"
        data-action="select-phase" data-phase-id="${escapeHtml(phase.id)}">
        <div class="group-card-num">${idx + 1}</div>
        <div class="group-card-title">${escapeHtml(phase.title)}</div>
        <div class="group-card-footer">
          <span class="group-card-progress">${progress.done}/${progress.total}</span>
          <div class="group-card-bar">
            <div class="group-card-fill" style="width:${progress.percent}%"></div>
          </div>
        </div>
      </button>
    `;
  }).join("");

  return `
    <div class="groups-page">
      <header class="groups-header">
        <div class="brand-title">${escapeHtml(missionLabel)}</div>
        <div class="groups-meta">${completedCount} / ${filtered.length} grupos concluídos</div>
      </header>
      <div class="groups-grid">${cards}</div>
      ${renderBottomBar()}
    </div>
  `;
}

function renderTags(item) {
  if (!item.tags?.length && !item.callout) return "";
  const tags = [...(item.callout ? ["●"] : []), ...(item.tags || [])];
  return `<span class="tag-row">${tags.map(t => `<span class="item-tag">${escapeHtml(t)}</span>`).join("")}</span>`;
}

function renderChecklist() {
  const phase = selectedPhase();
  if (!phase) return `<div class="empty-state">Nenhuma checklist carregada.</div>`;

  const filtered = getFilteredPhases();
  const filteredIndex = filtered.findIndex(p => p.id === phase.id);
  const inSequence = filteredIndex !== -1;
  const isFirst = !inSequence || filteredIndex === 0;
  const isLast = !inSequence || filteredIndex === filtered.length - 1;
  const progress = getPhaseProgress(phase, state);
  const nextPending = getNextPendingItem(phase, state);
  const isLastComplete = inSequence && isLast && progress.isComplete;

  const rows = phase.items.map((item, i) => {
    const status = getItemStatus(phase, item, state);
    const symbol = status === "completed" ? "✓" : String(i + 1).padStart(2, "0");
    const note = item.note ? `<span class="item-note">${escapeHtml(item.note)}</span>` : "";
    return `
      <button class="check-row ${status}" data-action="toggle-item" data-item-id="${escapeHtml(item.id)}">
        <span class="check-index">${escapeHtml(symbol)}</span>
        <span class="check-main">
          <span class="challenge">${escapeHtml(item.challenge)}</span>
          <span class="response">${escapeHtml(item.response)}</span>
          ${renderTags(item)}
          ${note}
        </span>
        <span class="status-chip">${getStatusLabel(status)}</span>
      </button>
    `;
  }).join("");

  const nextGroupLabel = isLastComplete ? "Encerrar voo" : isLast ? "Fim da checklist" : "Próximo grupo";
  const nextGroupClass = isLastComplete ? "action-btn primary" : "action-btn advance";
  const nextGroupDisabled = !inSequence || (isLast && !isLastComplete);
  const groupKicker = inSequence
    ? `Grupo ${filteredIndex + 1}/${filtered.length} • ${escapeHtml(phase.categoryTitle)} • PDF p.${escapeHtml(phase.pdfPage)}`
    : `Fora da sequência • ${escapeHtml(phase.categoryTitle)} • PDF p.${escapeHtml(phase.pdfPage)}`;
  const resumeText = nextPending
    ? `Próximo item pendente: <strong>${escapeHtml(nextPending.challenge)}</strong> — ${escapeHtml(nextPending.response)}`
    : `Grupo completo. Conferir visualmente e avançar para o próximo grupo.`;

  return `
    <div class="card checklist-card">
      <div class="card-header sticky-header">
        <div class="checklist-header-main">
          <div>
            <div class="page-kicker">${groupKicker}</div>
            <h2 class="card-title">${escapeHtml(phase.title)}</h2>
          </div>
          <div class="progress-block">
            <div class="progress-count">${progress.done}/${progress.total}</div>
            <div class="progress-label">Itens</div>
          </div>
        </div>
        <div class="progress-bar" aria-label="Progresso da checklist">
          <div class="progress-fill" style="width:${progress.percent}%"></div>
        </div>
      </div>

      <div class="checklist-items">
        ${checklistData.contentStatus !== "APPROVED" ? `<div class="warning-banner">CHECKLIST DATASET: ${escapeHtml(checklistData.contentStatus)} — IMPORTADO DA REV. ${escapeHtml(checklistData.revision.sourceRevision)}. CONFERIR ITEM POR ITEM ANTES DE USO OPERACIONAL.</div>` : ""}
        <div class="resume-banner ${progress.isComplete ? "complete" : ""}">${resumeText}</div>
        ${rows}
      </div>

      <div class="actions sticky-actions">
        <button class="action-btn" data-action="previous-group" ${isFirst ? "disabled" : ""}>Grupo anterior</button>
        <button class="action-btn primary" data-action="next-pending" ${!nextPending ? "disabled" : ""}>Ir ao próximo pendente</button>
        <button class="${nextGroupClass}" data-action="next-group" ${nextGroupDisabled ? "disabled" : ""}>${nextGroupLabel}</button>
        <button class="action-btn warn" data-action="reset-phase">Reset grupo</button>
        <button class="action-btn danger" data-action="reset-all">Reset voo</button>
      </div>
    </div>
  `;
}

function renderChecklistPage() {
  const statusClass = checklistData.contentStatus === "APPROVED" ? "ok" : "draft";
  const flightTypeLabel = state.flightType === "offshore" ? "OFFSHORE" : "NORMAL";

  return `
    <main class="app-shell checklist-view">
      <header class="topbar">
        <div class="brand">
          <div class="brand-title">${escapeHtml(checklistData.title)}</div>
          <div class="brand-subtitle">PWA offline • ${escapeHtml(flightTypeLabel)}</div>
        </div>
        <div class="badge ${statusClass}">${escapeHtml(checklistData.contentStatus)}</div>
      </header>
      <div class="checklist-wrapper">
        ${renderChecklist()}
      </div>
      ${renderBottomBar()}
    </main>
  `;
}

function renderCompletion() {
  const filtered = getFilteredPhases();
  const totalGroups = filtered.length;
  const totalItems = filtered.reduce((s, p) => s + p.items.filter(i => i.required !== false).length, 0);
  const durationMs = state.flightSessionStartedAt && state.completedAt
    ? new Date(state.completedAt) - new Date(state.flightSessionStartedAt) : 0;
  const missionTitle = state.flightType === "offshore" ? "OFFSHORE CHECK LIST" : "NORMAL CHECK LIST";
  const log = loadFlightLog();

  const logRows = log.slice(0, 6).map((entry, i) => `
    <div class="log-entry ${i === 0 ? "current-entry" : ""} ${entry.flightType === "offshore" ? "offshore-entry" : ""}">
      <span class="log-type">${entry.flightType === "offshore" ? "OFFSHORE" : "NORMAL"}</span>
      <span class="log-date">${formatDate(entry.completedAt)}</span>
      <span class="log-duration">${formatDuration(entry.durationMs)}</span>
      <span class="log-items">${entry.totalItems} itens</span>
    </div>
  `).join("");

  return `
    <div class="completion-screen">
      <div class="completion-inner">
        <div class="completion-icon">✓</div>
        <h1 class="completion-title">VOO CONCLUÍDO</h1>
        <div class="completion-meta">${escapeHtml(missionTitle)} • Rev. ${escapeHtml(checklistData.revision.sourceRevision)} • ${formatDate(state.completedAt)}</div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${formatDuration(durationMs)}</div>
            <div class="stat-label">Duração</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${totalGroups}/${totalGroups}</div>
            <div class="stat-label">Grupos</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${totalItems}</div>
            <div class="stat-label">Itens cumpridos</div>
          </div>
        </div>
        ${log.length > 0 ? `
          <div class="flight-log">
            <div class="flight-log-title">Histórico de voos</div>
            ${logRows}
          </div>
        ` : ""}
        <div class="completion-actions">
          <button class="action-btn" data-action="review-checklist">Rever checklist</button>
          <button class="action-btn primary" data-action="reset-all">Novo voo</button>
        </div>
      </div>
    </div>
  `;
}

// ─── Main render ──────────────────────────────────────────────────────────────

function render() {
  if (!state.flightType || showingSelector) {
    app.innerHTML = renderMissionSelector();
    bindEvents();
    return;
  }
  if (state.completedAt) {
    app.innerHTML = renderCompletion();
    bindEvents();
    return;
  }
  app.innerHTML = currentView === "groups" ? renderGroupsPage() : renderChecklistPage();
  bindEvents();
}

// ─── Events ───────────────────────────────────────────────────────────────────

function bindEvents() {
  document.querySelectorAll("[data-action='select-phase']").forEach(btn => {
    btn.addEventListener("click", () => selectPhase(btn.dataset.phaseId));
  });

  document.querySelectorAll("[data-action='toggle-item']").forEach(btn => {
    let timer = null, triggered = false;
    const id = btn.dataset.itemId;
    btn.addEventListener("pointerdown", () => {
      triggered = false;
      timer = window.setTimeout(() => { triggered = true; handleSkipItem(id); }, 700);
    });
    btn.addEventListener("pointerup",    () => window.clearTimeout(timer));
    btn.addEventListener("pointerleave", () => window.clearTimeout(timer));
    btn.addEventListener("click", e => { if (triggered) { e.preventDefault(); return; } handleToggleItem(id); });
  });

  document.querySelectorAll("[data-action='select-flight-type']").forEach(btn => {
    btn.addEventListener("click", () => handleSelectFlightType(btn.dataset.flightType));
  });

  document.querySelector("[data-action='nav-home']")?.addEventListener("click", handleHome);
  document.querySelector("[data-action='nav-groups']")?.addEventListener("click", handleShowGroups);
  document.querySelector("[data-action='nav-next']")?.addEventListener("click", handleNextFromBar);
  document.querySelector("[data-action='continue-flight']")?.addEventListener("click", handleContinueFlight);
  document.querySelector("[data-action='next-pending']")?.addEventListener("click", handleGoNextPending);
  document.querySelector("[data-action='previous-group']")?.addEventListener("click", handlePreviousGroup);
  document.querySelector("[data-action='next-group']")?.addEventListener("click", handleNextGroup);
  document.querySelector("[data-action='reset-phase']")?.addEventListener("click", handleResetPhase);
  document.querySelector("[data-action='reset-all']")?.addEventListener("click", handleResetAll);
  document.querySelector("[data-action='review-checklist']")?.addEventListener("click", handleReviewChecklist);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .catch(err => console.warn("Service worker registration failed", err));
  });
}

render();
