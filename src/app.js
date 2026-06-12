import { checklistData } from "./data/checklist-data.js";
import {
  loadState, saveState, resetAllState,
  loadFlightLog, saveFlightLog,
  loadSettings, saveSettings
} from "./checklist/storage.js";
import {
  getPhaseProgress, getNextPendingItem, getItemStatus,
  toggleItem, markSkipped, resetPhase
} from "./checklist/engine.js";

const app = document.querySelector("#app");
let state = loadState();
let settings = loadSettings();
let currentView = "groups"; // "groups" | "checklist"
let showingInitial = false;
let lastAutoScrolledId = null;

if (state.flightType && !state.completedAt) {
  currentView = state.selectedPhaseId ? "checklist" : "groups";
}

// ─── Utilities ─────────────────────────────────────────────────────────────

function escapeHtml(v = "") {
  return String(v)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getPhaseIndex(id) {
  return checklistData.phases.findIndex(p => p.id === id);
}

function getFilteredPhases() {
  if (!state.flightType) return checklistData.phases;
  return checklistData.phases.filter(p => p.categoryId === state.flightType);
}

function getValidPhaseId(id) {
  if (!id) return null;
  return getPhaseIndex(id) >= 0 ? id : null;
}

function formatDuration(ms) {
  if (!ms || ms < 0) return "—";
  const m = Math.round(ms / 60000);
  if (m < 1) return "< 1 min";
  const h = Math.floor(m / 60), min = m % 60;
  if (h === 0) return `${min} min`;
  return min === 0 ? `${h}h` : `${h}h ${min}min`;
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

// ─── SVG Icons ─────────────────────────────────────────────────────────────

const ICON_HOME = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`;
const ICON_RESET = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/></svg>`;
const ICON_SEEK = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="15"/><polyline points="8,11 12,15 16,11"/><circle cx="12" cy="20" r="2" fill="currentColor" stroke="none"/></svg>`;
const ICON_GRID = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`;
const ICON_NEXT = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,18 15,12 9,6"/></svg>`;

// ─── State ─────────────────────────────────────────────────────────────────

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

// ─── Navigation ────────────────────────────────────────────────────────────

function selectPhase(phaseId) {
  const phase = checklistData.phases.find(p => p.id === phaseId);
  if (!phase) return;
  currentView = "checklist";
  lastAutoScrolledId = null;
  const active = getNextPendingItem(phase, state);
  persist({
    ...state,
    selectedPhaseId: phase.id,
    activeItemId: active?.id || phase.items[0]?.id || null,
    flightSessionStartedAt: state.flightSessionStartedAt || new Date().toISOString()
  });
}

function handleSelectFlightType(type) {
  const regInput = document.getElementById("reg-input");
  const registration = (regInput ? regInput.value.trim().toUpperCase() : settings.registration) || "";

  const hasProgress = state.flightType &&
    Object.values(state.completed || {}).some(a => a.length > 0);
  if (hasProgress) {
    const ok = window.confirm(
      `Iniciar novo voo ${type === "offshore" ? "Offshore" : "Normal"}? O progresso atual será perdido.`
    );
    if (!ok) return;
  }

  settings = { ...settings, registration };
  saveSettings(settings);
  showingInitial = false;
  currentView = "groups";
  lastAutoScrolledId = null;

  const phases = checklistData.phases.filter(p => p.categoryId === type);
  const first = phases[0];
  persist({
    ...state,
    flightType: type,
    flightRegistration: registration,
    completedAt: null,
    selectedPhaseId: first?.id || null,
    activeItemId: first?.items[0]?.id || null,
    completed: {},
    skipped: {},
    flightSessionStartedAt: new Date().toISOString()
  });
}

function handleHome() { showingInitial = true; render(); }
function handleShowGroups() { currentView = "groups"; render(); }
function handleContinueFlight() {
  showingInitial = false;
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

function handleResetGroupFromBar() {
  if (currentView !== "checklist") return;
  handleResetPhase();
}

function handleNextPendingFromBar() {
  if (currentView !== "checklist") return;
  handleGoNextPending();
}

// ─── Checklist handlers ────────────────────────────────────────────────────

function isMissionComplete() {
  const f = getFilteredPhases();
  return f.length > 0 && f.every(p => getPhaseProgress(p, state).isComplete);
}

function getMissionStats() {
  const f = getFilteredPhases();
  const totalGroups = f.length;
  const totalItems = f.reduce((s, p) => s + p.items.filter(i => i.required !== false).length, 0);
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
    registration: state.flightRegistration || settings.registration || "",
    startedAt: stats.startedAt,
    completedAt: stats.completedAt,
    durationMs: stats.durationMs,
    totalGroups: stats.totalGroups,
    totalItems: stats.totalItems,
    completed: { ...state.completed },
    skipped: { ...state.skipped }
  });
  saveFlightLog(log.slice(0, 10));
  persist({ ...state, completedAt: stats.completedAt });
}

function handleToggleItem(id) {
  persist(toggleItem(selectedPhase(), id, state));
}

function handleSkipItem(id) {
  const ok = window.confirm("Marcar este item como ATENÇÃO / NÃO CUMPRIDO? Ele continuará impedindo o avanço até ser cumprido.");
  if (!ok) return;
  persist(markSkipped(selectedPhase(), id, state));
}

function handleResetPhase() {
  const phase = selectedPhase();
  const ok = window.confirm(`Resetar o grupo ${phase.title}?`);
  if (!ok) return;
  lastAutoScrolledId = null;
  persist(resetPhase(phase, state));
}

function handleResetAll() {
  const ok = window.confirm("Resetar todo o progresso e iniciar novo voo?");
  if (!ok) return;
  showingInitial = false;
  currentView = "groups";
  lastAutoScrolledId = null;
  state = resetAllState();
  persist(state);
}

function handleReviewChecklist() {
  currentView = "checklist";
  persist({ ...state, completedAt: null });
}

function autoScrollToActiveItem() {
  const id = state.activeItemId;
  if (!id) return;
  requestAnimationFrame(() => {
    const el = document.querySelector(`[data-item-id="${id}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: "instant", block: "center" });
    lastAutoScrolledId = id;
  });
}

function scrollToItem(id) {
  requestAnimationFrame(() => {
    document.querySelector(`[data-item-id="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
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
  const f = getFilteredPhases();
  const idx = f.findIndex(p => p.id === state.selectedPhaseId);
  if (idx <= 0) return;
  selectPhase(f[idx - 1].id);
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
      window.setTimeout(() =>
        window.alert(`Grupo ainda incompleto. Próximo item pendente: ${nextPending.challenge} — ${nextPending.response}`),
        80);
    }
    return;
  }

  const f = getFilteredPhases();
  const idx = f.findIndex(p => p.id === phase.id);
  const next = f[idx + 1];
  if (!next) { handleCompleteFlight(); return; }
  selectPhase(next.id);
}

function getStatusLabel(s) {
  return s === "completed" ? "DONE" : s === "active" ? "NEXT" : s === "skipped" ? "ATTN" : "PENDING";
}

// ─── PDF generation ────────────────────────────────────────────────────────

function generateFlightPDF(flightId) {
  const log = loadFlightLog();
  const entry = log.find(e => e.id === flightId);
  if (!entry) return;

  const filtered = checklistData.phases.filter(p => p.categoryId === entry.flightType);
  const doneMap = entry.completed || {};
  const skipMap = entry.skipped || {};

  const groupsHTML = filtered.map(phase => {
    const items = phase.items.filter(i => i.required !== false);
    const done = new Set(doneMap[phase.id] || []);
    const skip = new Set(skipMap[phase.id] || []);
    const cnt = items.filter(i => done.has(i.id)).length;
    const rows = items.map(item => {
      const isDone = done.has(item.id), isSkip = skip.has(item.id);
      const ic = isDone ? "✓" : (isSkip ? "⚠" : "○");
      const cl = isDone ? "done" : (isSkip ? "attn" : "pend");
      return `<tr class="${cl}"><td class="ic">${ic}</td><td class="ch">${item.challenge}</td><td class="rs">${item.response}</td></tr>`;
    }).join("");
    return `<div class="grp"><div class="gh"><span>${phase.title}</span><span>${cnt}/${items.length}</span></div><table><tbody>${rows}</tbody></table></div>`;
  }).join("");

  const typeLabel = entry.flightType === "offshore" ? "OFFSHORE" : "NORMAL";
  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<title>AW139 ${typeLabel} — ${entry.registration || "—"} — ${formatDate(entry.completedAt)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,Helvetica,sans-serif;font-size:9pt;color:#000;background:#fff}
.nop{padding:8px 15mm;background:#f0f0f0;border-bottom:1px solid #ccc;display:flex;gap:8px;align-items:center}
.nop button{padding:6px 14px;cursor:pointer;font-size:8.5pt;border:1px solid #888;background:#fff;border-radius:4px}
.hdr{padding:10mm 15mm 7mm;border-bottom:2px solid #000}
.htitle{font-size:15pt;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
.hmeta{margin-top:6px;display:flex;flex-wrap:wrap;gap:16px;font-size:8.5pt;color:#333}
.body{padding:6mm 15mm 12mm}
.grp{margin:7mm 0 0;break-inside:avoid}
.gh{display:flex;justify-content:space-between;padding:4px 7px;background:#e8e8e8;font-weight:700;font-size:8.5pt;text-transform:uppercase;border-bottom:1px solid #ccc}
table{width:100%;border-collapse:collapse;font-size:8pt}
td{padding:2.5px 6px;border-bottom:1px solid #f0f0f0;vertical-align:top;line-height:1.35}
.ic{width:16px;text-align:center;font-weight:700}
.ch{width:55%;font-weight:600}
.rs{color:#555}
.done .ic{color:#007700}.attn .ic{color:#cc6600}.pend .ic{color:#bbb}
.ftr{margin:10mm 15mm 0;padding-top:4mm;border-top:1px solid #ddd;font-size:7.5pt;color:#888;text-align:center}
@page{margin:10mm 12mm;size:A4}
@media print{.nop{display:none!important}}
</style></head><body>
<div class="nop">
  <button onclick="window.print()">🖨 Imprimir / Salvar PDF</button>
  <button onclick="window.close()">✕ Fechar</button>
</div>
<div class="hdr">
  <div class="htitle">AW139 ${typeLabel} CHECK LIST</div>
  <div class="hmeta">
    <span><strong>Matrícula:</strong> ${entry.registration || "—"}</span>
    <span><strong>Data:</strong> ${formatDate(entry.completedAt)}</span>
    <span><strong>Duração:</strong> ${formatDuration(entry.durationMs)}</span>
    <span><strong>Grupos:</strong> ${entry.totalGroups}</span>
    <span><strong>Itens:</strong> ${entry.totalItems}</span>
    <span><strong>Rev.:</strong> ${checklistData.revision.sourceRevision} (${checklistData.revision.effectiveDate})</span>
  </div>
</div>
<div class="body">${groupsHTML}</div>
<div class="ftr">${checklistData.revision.source} • Rev. ${checklistData.revision.sourceRevision} • ${checklistData.revision.sourceBasis} • Dataset: ${checklistData.revision.datasetVersion}</div>
</body></html>`;

  const win = window.open("", "_blank");
  if (win) { win.document.write(html); win.document.close(); }
}

// ─── Rendering ────────────────────────────────────────────────────────────

function renderBottomBar() {
  const f = getFilteredPhases();
  const completedGroups = f.filter(p => getPhaseProgress(p, state).isComplete).length;
  const isGroupsView = currentView === "groups";
  const onChecklist = currentView === "checklist";
  const phase = onChecklist ? selectedPhase() : null;
  const hasNextPending = onChecklist && phase ? !!getNextPendingItem(phase, state) : false;

  return `
    <nav class="bottom-bar">
      <button class="bottom-btn" data-action="nav-home" title="Início">
        ${ICON_HOME}
        <span class="bottom-label">Início</span>
      </button>
      <button class="bottom-btn ${!onChecklist ? "bb-dim" : ""}" data-action="nav-reset-group" ${!onChecklist ? "disabled" : ""} title="Reset grupo">
        ${ICON_RESET}
        <span class="bottom-label">Reset</span>
      </button>
      <button class="bottom-btn ${hasNextPending ? "bb-seek" : "bb-dim"}" data-action="nav-next-pending" ${!hasNextPending ? "disabled" : ""} title="Próximo pendente">
        ${ICON_SEEK}
        <span class="bottom-label">Pendente</span>
      </button>
      <button class="bottom-btn ${isGroupsView ? "bb-active" : ""}" data-action="nav-groups" title="Grupos">
        ${ICON_GRID}
        <span class="bottom-label">Grupos</span>
      </button>
      <button class="bottom-btn bb-next" data-action="nav-next" title="Próximo grupo">
        ${ICON_NEXT}
        <span class="bottom-label">${completedGroups}/${f.length}</span>
      </button>
    </nav>
  `;
}

function renderInitialScreen() {
  const normalCount = checklistData.phases.filter(p => p.categoryId === "normal").length;
  const offshoreCount = checklistData.phases.filter(p => p.categoryId === "offshore").length;
  const hasFlight = !!state.flightType && !state.completedAt;
  const log = loadFlightLog();

  const historyRows = log.slice(0, 10).map(entry => {
    const typeLabel = entry.flightType === "offshore" ? "OFFSHORE" : "NORMAL";
    return `
      <div class="history-entry">
        <span class="history-type ${entry.flightType === "offshore" ? "offshore" : ""}">${typeLabel}</span>
        <span class="history-reg">${escapeHtml(entry.registration || "—")}</span>
        <span class="history-date">${formatDate(entry.completedAt)}</span>
        <span class="history-dur">${formatDuration(entry.durationMs)}</span>
        <button class="history-pdf" data-action="export-pdf" data-flight-id="${escapeHtml(entry.id)}">PDF</button>
      </div>
    `;
  }).join("");

  return `
    <div class="initial-screen">
      <div class="initial-inner">
        <div class="initial-brand">
          <div class="brand-title">${escapeHtml(checklistData.title)}</div>
          <div class="initial-sub">Rev. ${escapeHtml(checklistData.revision.sourceRevision)} • ${escapeHtml(checklistData.revision.source)}</div>
        </div>

        <div class="reg-field">
          <label class="reg-label" for="reg-input">Matrícula</label>
          <input type="text" id="reg-input" class="reg-input"
            value="${escapeHtml(settings.registration)}"
            placeholder="PP-MHT"
            maxlength="8"
            autocomplete="off"
            autocapitalize="characters"
            spellcheck="false">
        </div>

        ${hasFlight ? `
          <button class="continue-flight-btn" data-action="continue-flight">
            ← Continuar ${state.flightType === "offshore" ? "Offshore" : "Normal"} Check List
          </button>
        ` : ""}

        <div class="initial-section-label">Iniciar voo</div>
        <div class="mission-grid">
          <button class="mission-btn" data-action="select-flight-type" data-flight-type="normal">
            <span class="mission-btn-label">Normal</span>
            <span class="mission-btn-title">NCL</span>
            <span class="mission-btn-desc">${normalCount} grupos</span>
          </button>
          <button class="mission-btn offshore" data-action="select-flight-type" data-flight-type="offshore">
            <span class="mission-btn-label">Offshore</span>
            <span class="mission-btn-title">OCL</span>
            <span class="mission-btn-desc">${offshoreCount} grupos</span>
          </button>
        </div>

        ${log.length > 0 ? `
          <div class="initial-section-label">Últimos voos</div>
          <div class="history-list">${historyRows}</div>
        ` : ""}

        ${hasFlight ? `
          <button class="action-btn danger initial-reset" data-action="reset-all">Reset voo</button>
        ` : ""}
      </div>
    </div>
  `;
}

function renderGroupsPage() {
  const f = getFilteredPhases();
  const doneCount = f.filter(p => getPhaseProgress(p, state).isComplete).length;
  const label = state.flightType === "offshore" ? "OFFSHORE CHECK LIST" : "NORMAL CHECK LIST";
  const reg = state.flightRegistration || settings.registration;

  const cards = f.map((phase, idx) => {
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
          <div class="group-card-bar"><div class="group-card-fill" style="width:${progress.percent}%"></div></div>
        </div>
      </button>
    `;
  }).join("");

  return `
    <div class="groups-page">
      <header class="groups-header">
        <div class="brand-title">${escapeHtml(label)}</div>
        <div class="groups-meta">
          ${reg ? `<span class="groups-reg">${escapeHtml(reg)}</span> • ` : ""}
          ${doneCount}/${f.length} grupos concluídos
        </div>
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

  const f = getFilteredPhases();
  const fi = f.findIndex(p => p.id === phase.id);
  const inSeq = fi !== -1;
  const progress = getPhaseProgress(phase, state);
  const nextPending = getNextPendingItem(phase, state);
  const groupKicker = inSeq
    ? `Grupo ${fi + 1}/${f.length} • ${escapeHtml(phase.categoryTitle)} • PDF p.${escapeHtml(phase.pdfPage)}`
    : `Fora da sequência • ${escapeHtml(phase.categoryTitle)} • PDF p.${escapeHtml(phase.pdfPage)}`;
  const resumeText = nextPending
    ? `Próximo item pendente: <strong>${escapeHtml(nextPending.challenge)}</strong> — ${escapeHtml(nextPending.response)}`
    : `Grupo completo. Conferir visualmente e avançar para o próximo grupo.`;

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
        ${checklistData.contentStatus !== "APPROVED" ? `<div class="warning-banner">CHECKLIST DATASET: ${escapeHtml(checklistData.contentStatus)} — REV. ${escapeHtml(checklistData.revision.sourceRevision)}. CONFERIR ANTES DE USO OPERACIONAL.</div>` : ""}
        <div class="resume-banner ${progress.isComplete ? "complete" : ""}">${resumeText}</div>
        ${rows}
        <div class="checklist-end-spacer"></div>
      </div>
    </div>
  `;
}

function renderChecklistPage() {
  const statusClass = checklistData.contentStatus === "APPROVED" ? "ok" : "draft";
  const flightTypeLabel = state.flightType === "offshore" ? "OFFSHORE" : "NORMAL";
  const reg = state.flightRegistration || settings.registration;

  return `
    <main class="app-shell checklist-view">
      <header class="topbar">
        <div class="brand">
          <div class="brand-title">${escapeHtml(checklistData.title)}</div>
          <div class="brand-subtitle">
            ${reg ? `${escapeHtml(reg)} • ` : ""}PWA offline • ${escapeHtml(flightTypeLabel)}
          </div>
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
  const f = getFilteredPhases();
  const totalGroups = f.length;
  const totalItems = f.reduce((s, p) => s + p.items.filter(i => i.required !== false).length, 0);
  const durationMs = state.flightSessionStartedAt && state.completedAt
    ? new Date(state.completedAt) - new Date(state.flightSessionStartedAt) : 0;
  const missionTitle = state.flightType === "offshore" ? "OFFSHORE CHECK LIST" : "NORMAL CHECK LIST";
  const reg = state.flightRegistration || settings.registration;
  const log = loadFlightLog();
  const currentEntry = log[0];

  const logRows = log.slice(0, 6).map((entry, i) => {
    const typeLabel = entry.flightType === "offshore" ? "OFFSHORE" : "NORMAL";
    return `
      <div class="log-entry ${i === 0 ? "current-entry" : ""} ${entry.flightType === "offshore" ? "offshore-entry" : ""}">
        <span class="log-type">${typeLabel}</span>
        <span class="log-date">${formatDate(entry.completedAt)}</span>
        <span class="log-duration">${formatDuration(entry.durationMs)}</span>
        <span class="log-items">${entry.totalItems} itens</span>
        <button class="log-pdf-btn" data-action="export-pdf" data-flight-id="${escapeHtml(entry.id)}">PDF</button>
      </div>
    `;
  }).join("");

  return `
    <div class="completion-screen">
      <div class="completion-inner">
        <div class="completion-icon">✓</div>
        <h1 class="completion-title">VOO CONCLUÍDO</h1>
        <div class="completion-meta">
          ${reg ? `<strong>${escapeHtml(reg)}</strong> • ` : ""}${escapeHtml(missionTitle)} • Rev. ${escapeHtml(checklistData.revision.sourceRevision)} • ${formatDate(state.completedAt)}
        </div>
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
            <div class="stat-label">Itens</div>
          </div>
        </div>
        ${log.length > 0 ? `
          <div class="flight-log">
            <div class="flight-log-title">Histórico de voos</div>
            ${logRows}
          </div>
        ` : ""}
        <div class="completion-actions">
          ${currentEntry ? `<button class="action-btn" data-action="export-pdf" data-flight-id="${escapeHtml(currentEntry.id)}">Exportar PDF</button>` : ""}
          <button class="action-btn" data-action="review-checklist">Rever</button>
          <button class="action-btn primary" data-action="reset-all">Novo voo</button>
        </div>
      </div>
    </div>
  `;
}

// ─── Main render ─────────────────────────────────────────────────────────────

function render() {
  if (!state.flightType || showingInitial) {
    app.innerHTML = renderInitialScreen();
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
  if (currentView === "checklist") autoScrollToActiveItem();
}

// ─── Events ──────────────────────────────────────────────────────────────────

function bindEvents() {
  document.querySelectorAll("[data-action='select-phase']").forEach(btn => {
    btn.addEventListener("click", () => selectPhase(btn.dataset.phaseId));
  });

  document.querySelectorAll("[data-action='toggle-item']").forEach(btn => {
    let timer = null, triggered = false, startY = 0;
    const id = btn.dataset.itemId;
    const cancel = () => window.clearTimeout(timer);
    btn.addEventListener("pointerdown", e => {
      triggered = false;
      startY = e.clientY;
      timer = window.setTimeout(() => { triggered = true; handleSkipItem(id); }, 700);
    });
    btn.addEventListener("pointermove", e => { if (Math.abs(e.clientY - startY) > 8) cancel(); });
    btn.addEventListener("pointerup",     cancel);
    btn.addEventListener("pointerleave",  cancel);
    btn.addEventListener("pointercancel", cancel);
    btn.addEventListener("click", e => { if (triggered) { e.preventDefault(); return; } handleToggleItem(id); });
  });

  document.querySelectorAll("[data-action='select-flight-type']").forEach(btn => {
    btn.addEventListener("click", () => handleSelectFlightType(btn.dataset.flightType));
  });

  document.querySelectorAll("[data-action='export-pdf']").forEach(btn => {
    btn.addEventListener("click", () => generateFlightPDF(btn.dataset.flightId));
  });

  document.querySelector("[data-action='nav-home']")?.addEventListener("click", handleHome);
  document.querySelector("[data-action='nav-reset-group']")?.addEventListener("click", handleResetGroupFromBar);
  document.querySelector("[data-action='nav-next-pending']")?.addEventListener("click", handleNextPendingFromBar);
  document.querySelector("[data-action='nav-groups']")?.addEventListener("click", handleShowGroups);
  document.querySelector("[data-action='nav-next']")?.addEventListener("click", handleNextFromBar);
  document.querySelector("[data-action='continue-flight']")?.addEventListener("click", handleContinueFlight);
  document.querySelector("[data-action='review-checklist']")?.addEventListener("click", handleReviewChecklist);
  document.querySelector("[data-action='reset-all']")?.addEventListener("click", handleResetAll);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .catch(err => console.warn("Service worker registration failed", err));
  });
}

render();
