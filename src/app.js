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

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getPhaseIndex(phaseId) {
  return checklistData.phases.findIndex(phase => phase.id === phaseId);
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
  const totalMinutes = Math.round(ms / 60000);
  if (totalMinutes < 1) return "< 1 min";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}min`;
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

// On first load, don't force a phase — mission selector handles it
state.selectedPhaseId = getValidPhaseId(state.selectedPhaseId);

const selectedPhase = () => {
  if (state.selectedPhaseId) {
    const found = checklistData.phases.find(p => p.id === state.selectedPhaseId);
    if (found) return found;
  }
  return getFilteredPhases()[0] || null;
};

function persist(nextState) {
  state = saveState({
    ...nextState,
    selectedPhaseId: getValidPhaseId(nextState.selectedPhaseId)
  });
  render();
}

function selectPhase(phaseId) {
  const phase = checklistData.phases.find(item => item.id === phaseId);
  if (!phase) return;
  const active = getNextPendingItem(phase, state);
  persist({
    ...state,
    selectedPhaseId: phase.id,
    activeItemId: active?.id || phase.items[0]?.id || null,
    flightSessionStartedAt: state.flightSessionStartedAt || new Date().toISOString()
  });
}

function handleSelectFlightType(type) {
  const phases = checklistData.phases.filter(p => p.categoryId === type);
  const firstPhase = phases[0];
  persist({
    ...state,
    flightType: type,
    completedAt: null,
    selectedPhaseId: firstPhase?.id || null,
    activeItemId: firstPhase?.items[0]?.id || null,
    flightSessionStartedAt: new Date().toISOString()
  });
}

function isMissionComplete() {
  const filtered = getFilteredPhases();
  return filtered.length > 0 && filtered.every(phase => getPhaseProgress(phase, state).isComplete);
}

function getMissionStats() {
  const filtered = getFilteredPhases();
  const totalGroups = filtered.length;
  const totalItems = filtered.reduce((sum, phase) =>
    sum + phase.items.filter(i => i.required !== false).length, 0);
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
  const phase = selectedPhase();
  persist(toggleItem(phase, itemId, state));
}

function handleSkipItem(itemId) {
  const phase = selectedPhase();
  const ok = window.confirm("Marcar este item como ATENÇÃO / NÃO CUMPRIDO? Ele continuará impedindo o avanço normal até ser cumprido.");
  if (!ok) return;
  persist(markSkipped(phase, itemId, state));
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
  state = resetAllState();
  persist(state);
}

function handleReviewChecklist() {
  persist({ ...state, completedAt: null });
}

function scrollToItem(itemId) {
  requestAnimationFrame(() => {
    document.querySelector(`[data-item-id="${itemId}"]`)?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
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
  const currentIndex = filtered.findIndex(p => p.id === state.selectedPhaseId);
  if (currentIndex <= 0) return;
  selectPhase(filtered[currentIndex - 1].id);
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
  const currentIndex = filtered.findIndex(p => p.id === phase.id);
  const next = filtered[currentIndex + 1];

  if (!next) {
    handleCompleteFlight();
    return;
  }

  selectPhase(next.id);
}

function getStatusLabel(status) {
  switch (status) {
    case "completed": return "DONE";
    case "active": return "NEXT";
    case "skipped": return "ATTN";
    default: return "PENDING";
  }
}

function getCategorySummary(categoryId) {
  const phases = checklistData.phases.filter(phase => phase.categoryId === categoryId);
  const complete = phases.filter(phase => getPhaseProgress(phase, state).isComplete).length;
  return { complete, total: phases.length };
}

function renderPhaseList() {
  const categories = [...new Map(checklistData.phases.map(phase => [phase.categoryId, phase.categoryTitle])).entries()];

  return categories.map(([categoryId, categoryTitle]) => {
    const summary = getCategorySummary(categoryId);
    const isActiveCategory = state.flightType === categoryId;
    const buttons = checklistData.phases
      .filter(phase => phase.categoryId === categoryId)
      .map(phase => {
        const progress = getPhaseProgress(phase, state);
        const active = phase.id === state.selectedPhaseId ? "active" : "";
        const complete = progress.isComplete ? "complete" : "";
        const index = checklistData.phases.findIndex(item => item.id === phase.id) + 1;

        return `
          <button class="phase-button ${active}" data-action="select-phase" data-phase-id="${escapeHtml(phase.id)}">
            <span>
              <span class="phase-name"><span class="phase-number">${index}</span>${escapeHtml(phase.title)}</span>
              <span class="phase-group">PDF p.${escapeHtml(phase.pdfPage)} • ${escapeHtml(phase.categoryTitle)}</span>
            </span>
            <span class="phase-progress-pill ${complete}">${progress.done}/${progress.total}</span>
          </button>
        `;
      }).join("");

    return `
      <section class="phase-category ${isActiveCategory ? "active-category" : ""}">
        <div class="category-row">
          <span>${escapeHtml(categoryTitle)}</span>
          <strong>${summary.complete}/${summary.total}</strong>
        </div>
        ${buttons}
      </section>
    `;
  }).join("");
}

function renderTags(item) {
  if (!item.tags?.length && !item.callout) return "";
  const tags = [...(item.callout ? ["●"] : []), ...(item.tags || [])];
  return `<span class="tag-row">${tags.map(tag => `<span class="item-tag">${escapeHtml(tag)}</span>`).join("")}</span>`;
}

function renderMissionSelector() {
  const normalCount = checklistData.phases.filter(p => p.categoryId === "normal").length;
  const offshoreCount = checklistData.phases.filter(p => p.categoryId === "offshore").length;

  return `
    <div class="mission-selector">
      <div class="mission-selector-inner">
        <div class="mission-selector-brand">
          <div class="brand-title">${escapeHtml(checklistData.title)}</div>
          <div class="mission-selector-subtitle">${escapeHtml(checklistData.revision.source)} • Rev. ${escapeHtml(checklistData.revision.sourceRevision)}</div>
        </div>
        <div class="mission-selector-title">Selecionar missão</div>
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

function renderCompletion() {
  const filtered = getFilteredPhases();
  const totalGroups = filtered.length;
  const totalItems = filtered.reduce((sum, p) =>
    sum + p.items.filter(i => i.required !== false).length, 0);
  const durationMs = state.flightSessionStartedAt && state.completedAt
    ? new Date(state.completedAt) - new Date(state.flightSessionStartedAt)
    : 0;
  const missionTitle = state.flightType === "offshore" ? "OFFSHORE CHECK LIST" : "NORMAL CHECK LIST";

  const log = loadFlightLog();
  const logRows = log.slice(0, 6).map((entry, i) => {
    const typeLabel = entry.flightType === "offshore" ? "OFFSHORE" : "NORMAL";
    const isCurrent = i === 0;
    return `
      <div class="log-entry ${isCurrent ? "current-entry" : ""} ${entry.flightType === "offshore" ? "offshore-entry" : ""}">
        <span class="log-type">${typeLabel}</span>
        <span class="log-date">${formatDate(entry.completedAt)}</span>
        <span class="log-duration">${formatDuration(entry.durationMs)}</span>
        <span class="log-items">${entry.totalItems} itens</span>
      </div>
    `;
  }).join("");

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

function renderChecklist() {
  const phase = selectedPhase();
  if (!phase) {
    return `<div class="empty-state">Nenhuma checklist carregada.</div>`;
  }

  const filtered = getFilteredPhases();
  const filteredIndex = filtered.findIndex(p => p.id === phase.id);
  const inSequence = filteredIndex !== -1;
  const isFirst = !inSequence || filteredIndex === 0;
  const isLast = !inSequence || filteredIndex === filtered.length - 1;
  const progress = getPhaseProgress(phase, state);
  const nextPending = getNextPendingItem(phase, state);
  const isLastComplete = inSequence && isLast && progress.isComplete;

  const rows = phase.items.map((item, index) => {
    const status = getItemStatus(phase, item, state);
    const symbol = status === "completed" ? "✓" : String(index + 1).padStart(2, "0");
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

  const resumeText = nextPending
    ? `Próximo item pendente: <strong>${escapeHtml(nextPending.challenge)}</strong> — ${escapeHtml(nextPending.response)}`
    : `Grupo completo. Conferir visualmente e avançar para o próximo grupo.`;

  const groupKicker = inSequence
    ? `Grupo ${filteredIndex + 1}/${filtered.length} • ${escapeHtml(phase.categoryTitle)} • PDF p.${escapeHtml(phase.pdfPage)}`
    : `Fora da sequência • ${escapeHtml(phase.categoryTitle)} • PDF p.${escapeHtml(phase.pdfPage)}`;

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

function render() {
  if (!state.flightType) {
    app.innerHTML = renderMissionSelector();
    bindEvents();
    return;
  }

  if (state.completedAt) {
    app.innerHTML = renderCompletion();
    bindEvents();
    return;
  }

  const statusClass = checklistData.contentStatus === "APPROVED" ? "ok" : "draft";
  const flightTypeLabel = state.flightType === "offshore" ? "OFFSHORE" : "NORMAL";
  const filtered = getFilteredPhases();
  const completedGroups = filtered.filter(p => getPhaseProgress(p, state).isComplete).length;
  const missionPercent = filtered.length ? Math.round((completedGroups / filtered.length) * 100) : 0;
  const currentIndex = filtered.findIndex(p => p.id === state.selectedPhaseId);

  app.innerHTML = `
    <main class="app-shell">
      <header class="topbar">
        <div class="brand">
          <div class="brand-title">${escapeHtml(checklistData.title)}</div>
          <div class="brand-subtitle">PWA offline • ${escapeHtml(flightTypeLabel)} • avanço bloqueado se houver item pendente</div>
        </div>
        <div class="badge ${statusClass}">${escapeHtml(checklistData.contentStatus)}</div>
      </header>

      <section class="layout">
        <aside class="card nav-card">
          <div class="card-header">
            <div class="nav-header-row">
              <h1 class="card-title">Grupos</h1>
              <span class="mission-progress-text">${completedGroups}/${filtered.length}</span>
            </div>
            <div class="progress-bar nav-progress-bar" aria-label="Progresso da missão">
              <div class="progress-fill" style="width:${missionPercent}%"></div>
            </div>
          </div>
          <div class="phase-list">${renderPhaseList()}</div>
        </aside>

        ${renderChecklist()}
      </section>

      <div class="footer-note">
        Fonte: ${escapeHtml(checklistData.revision.source)} • Revisão: ${escapeHtml(checklistData.revision.sourceRevision)} • Data: ${escapeHtml(checklistData.revision.effectiveDate)} • ${escapeHtml(checklistData.revision.sourceBasis)} • Dataset: ${escapeHtml(checklistData.revision.datasetVersion)}.
        <br />Sequência: ${escapeHtml(flightTypeLabel)} • Grupo ${currentIndex >= 0 ? currentIndex + 1 : "?"} de ${filtered.length}. Toque normal marca/desmarca. Toque longo em uma linha marca ATENÇÃO / NÃO CUMPRIDO.
      </div>
    </main>
  `;

  bindEvents();
}

function bindEvents() {
  document.querySelectorAll("[data-action='select-phase']").forEach(button => {
    button.addEventListener("click", () => selectPhase(button.dataset.phaseId));
  });

  document.querySelectorAll("[data-action='toggle-item']").forEach(button => {
    let longPressTimer = null;
    let longPressTriggered = false;
    const itemId = button.dataset.itemId;

    button.addEventListener("pointerdown", () => {
      longPressTriggered = false;
      longPressTimer = window.setTimeout(() => {
        longPressTriggered = true;
        handleSkipItem(itemId);
      }, 700);
    });

    button.addEventListener("pointerup", () => window.clearTimeout(longPressTimer));
    button.addEventListener("pointerleave", () => window.clearTimeout(longPressTimer));

    button.addEventListener("click", event => {
      if (longPressTriggered) { event.preventDefault(); return; }
      handleToggleItem(itemId);
    });
  });

  document.querySelectorAll("[data-action='select-flight-type']").forEach(button => {
    button.addEventListener("click", () => handleSelectFlightType(button.dataset.flightType));
  });

  document.querySelector("[data-action='next-pending']")?.addEventListener("click", handleGoNextPending);
  document.querySelector("[data-action='previous-group']")?.addEventListener("click", handlePreviousGroup);
  document.querySelector("[data-action='next-group']")?.addEventListener("click", handleNextGroup);
  document.querySelector("[data-action='reset-phase']")?.addEventListener("click", handleResetPhase);
  document.querySelector("[data-action='reset-all']")?.addEventListener("click", handleResetAll);
  document.querySelector("[data-action='review-checklist']")?.addEventListener("click", handleReviewChecklist);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(error => {
      console.warn("Service worker registration failed", error);
    });
  });
}

render();
