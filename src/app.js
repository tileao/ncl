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
let legPicker = null; // { profile: string, count: number } | null

if (state.profileId && !state.completedAt) {
  currentView = state.selectedStepId ? "checklist" : "groups";
}

// ─── Utilities ─────────────────────────────────────────────────────────────

function escapeHtml(v = "") {
  return String(v)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

// ─── Mission profiles ───────────────────────────────────────────────────────

function buildMissionSteps(profileId, params = {}) {
  const all = checklistData.phases;
  const byId = id => all.find(p => p.id === id);
  const step = (id, phaseId, label = null) => ({ stepId: id, phaseId, phase: byId(phaseId), label });

  const DEP = [
    "normal-cockpit-checks", "normal-before-engine-start", "normal-system-checks",
    "normal-first-engine-start", "normal-second-engine-start", "normal-flight-configuration",
    "normal-taxing", "normal-before-take-off", "normal-after-take-off"
  ];
  const CRUISE = "normal-cruise";
  const N_INTERM = [
    "normal-before-descent", "normal-before-landing", "normal-final-approach", "normal-after-landing"
  ];
  const N_IDEP = ["normal-before-take-off", "normal-after-take-off"];
  const N_ARR = [
    "normal-before-descent", "normal-before-landing", "normal-final-approach",
    "normal-after-landing", "normal-engines-shut-down", "normal-after-rotor-stops"
  ];
  const O_ARR = [
    "offshore-before-descent", "offshore-before-landing", "offshore-traffic-pattern",
    "offshore-final-approach", "offshore-after-landing"
  ];
  const O_DEP = ["offshore-before-takeoff", "offshore-after-take-off"];

  const steps = [];

  if (profileId === "normal") {
    all.filter(p => p.categoryId === "normal").forEach((p, i) => steps.push(step(`n${i}`, p.id)));

  } else if (profileId === "offshore") {
    all.filter(p => p.categoryId === "offshore").forEach((p, i) => steps.push(step(`o${i}`, p.id)));

  } else if (profileId === "normal_offshore") {
    const legs = params.offshoreLegs || 1;
    DEP.forEach((id, i) => steps.push(step(`no_d${i}`, id)));
    for (let l = 0; l < legs; l++) {
      const cLabel = legs === 1 ? "CRUISE — IDA" : `CRUISE — IDA ${l + 1}`;
      steps.push(step(`no_ci${l}`, CRUISE, cLabel));
      O_ARR.forEach((id, i) => steps.push(step(`no_oa${l}_${i}`, id)));
      O_DEP.forEach((id, i) => steps.push(step(`no_od${l}_${i}`, id)));
    }
    steps.push(step(`no_cr`, CRUISE, "CRUISE — RETORNO"));
    N_ARR.forEach((id, i) => steps.push(step(`no_a${i}`, id)));

  } else if (profileId === "normal_stops") {
    const stops = params.stops || 1;
    DEP.forEach((id, i) => steps.push(step(`ns_d${i}`, id)));
    for (let s = 0; s < stops; s++) {
      const cLabel = stops === 1 ? "CRUISE" : `CRUISE — TRECHO ${s + 1}`;
      steps.push(step(`ns_c${s}`, CRUISE, cLabel));
      N_INTERM.forEach((id, i) => steps.push(step(`ns_ia${s}_${i}`, id)));
      N_IDEP.forEach((id, i) => steps.push(step(`ns_id${s}_${i}`, id)));
    }
    steps.push(step(`ns_cr`, CRUISE, "CRUISE — RETORNO"));
    N_ARR.forEach((id, i) => steps.push(step(`ns_a${i}`, id)));
  }

  return steps;
}

function getMissionSteps() {
  if (!state.profileId) return [];
  return buildMissionSteps(state.profileId, state.profileParams || {});
}

function getProfileLabelFor(profileId, params = {}) {
  if (profileId === "normal") return "NORMAL CHECK LIST";
  if (profileId === "offshore") return "OFFSHORE CHECK LIST";
  if (profileId === "normal_offshore") {
    const legs = params.offshoreLegs || 1;
    return legs === 1 ? "NCL + OCL" : `NCL + OCL (${legs}× offshore)`;
  }
  if (profileId === "normal_stops") {
    const stops = params.stops || 1;
    return stops === 1 ? "NORMAL c/ PARADA" : `NORMAL c/ ${stops} PARADAS`;
  }
  return "CHECK LIST";
}

function getProfileLabel() {
  return getProfileLabelFor(state.profileId, state.profileParams || {});
}

function getLogTypeLabel(entry) {
  if (!entry.profileId) {
    return entry.flightType === "offshore" ? "OCL" : "NCL";
  }
  if (entry.profileId === "offshore") return "OCL";
  if (entry.profileId === "normal_offshore") {
    const legs = entry.profileParams?.offshoreLegs || 1;
    return legs > 1 ? `NCL+OCL ×${legs}` : "NCL+OCL";
  }
  if (entry.profileId === "normal_stops") {
    const stops = entry.profileParams?.stops || 1;
    return stops > 1 ? `NCL+${stops}P` : "NCL+PAR";
  }
  return "NCL";
}

// ─── State helpers ──────────────────────────────────────────────────────────

const selectedStep = () => {
  const steps = getMissionSteps();
  if (!steps.length) return null;
  if (state.selectedStepId) {
    const found = steps.find(s => s.stepId === state.selectedStepId);
    if (found) return found;
  }
  return steps[0] || null;
};

function persist(nextState) {
  state = saveState(nextState);
  render();
}

// ─── Navigation ────────────────────────────────────────────────────────────

function selectStep(stepId) {
  const steps = getMissionSteps();
  const step = steps.find(s => s.stepId === stepId);
  if (!step) return;
  currentView = "checklist";
  lastAutoScrolledId = null;
  const active = getNextPendingItem(step.phase, state, stepId);
  persist({
    ...state,
    selectedStepId: stepId,
    activeItemId: active?.id || step.phase.items[0]?.id || null,
    flightSessionStartedAt: state.flightSessionStartedAt || new Date().toISOString()
  });
}

function handleSelectProfile(profileId, params = {}) {
  legPicker = null;
  const regInput = document.getElementById("reg-input");
  const registration = (regInput ? regInput.value.trim().toUpperCase() : settings.registration) || "";

  const hasProgress = state.profileId &&
    Object.values(state.completed || {}).some(a => a.length > 0);
  if (hasProgress) {
    const ok = window.confirm(
      `Iniciar ${getProfileLabelFor(profileId, params)}? O progresso atual será perdido.`
    );
    if (!ok) return;
  }

  settings = { ...settings, registration };
  saveSettings(settings);
  showingInitial = false;
  currentView = "groups";
  lastAutoScrolledId = null;

  const steps = buildMissionSteps(profileId, params);
  const first = steps[0];
  persist({
    profileId,
    profileParams: params,
    flightRegistration: registration,
    selectedStepId: first?.stepId || null,
    activeItemId: first?.phase.items[0]?.id || null,
    completed: {},
    skipped: {},
    completedAt: null,
    lastUpdatedAt: null,
    flightSessionStartedAt: new Date().toISOString()
  });
}

function handleHome() { showingInitial = true; legPicker = null; render(); }
function handleShowGroups() { currentView = "groups"; render(); }
function handleContinueFlight() {
  showingInitial = false;
  currentView = state.selectedStepId ? "checklist" : "groups";
  render();
}

function handleNextFromBar() {
  if (currentView === "groups") {
    const steps = getMissionSteps();
    const next = steps.find(s => !getPhaseProgress(s.phase, state, s.stepId).isComplete);
    if (next) { selectStep(next.stepId); return; }
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
  const steps = getMissionSteps();
  return steps.length > 0 && steps.every(s => getPhaseProgress(s.phase, state, s.stepId).isComplete);
}

function getMissionStats() {
  const steps = getMissionSteps();
  const totalGroups = steps.length;
  const totalItems = steps.reduce((s, step) => s + step.phase.items.filter(i => i.required !== false).length, 0);
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
    profileId: state.profileId,
    profileParams: state.profileParams || {},
    flightType: state.profileId === "offshore" ? "offshore" : "normal",
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
  const step = selectedStep();
  if (!step) return;
  persist(toggleItem(step.phase, id, state, step.stepId));
}

function handleSkipItem(id) {
  const ok = window.confirm("Marcar este item como ATENÇÃO / NÃO CUMPRIDO? Ele continuará impedindo o avanço até ser cumprido.");
  if (!ok) return;
  const step = selectedStep();
  if (!step) return;
  persist(markSkipped(step.phase, id, state, step.stepId));
}

function handleResetPhase() {
  const step = selectedStep();
  if (!step) return;
  const ok = window.confirm(`Resetar o grupo ${step.label || step.phase.title}?`);
  if (!ok) return;
  lastAutoScrolledId = null;
  persist(resetPhase(step.phase, state, step.stepId));
}

function handleResetAll() {
  const ok = window.confirm("Resetar todo o progresso e iniciar novo voo?");
  if (!ok) return;
  showingInitial = true;
  currentView = "groups";
  lastAutoScrolledId = null;
  state = resetAllState();
  render();
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
  const step = selectedStep();
  if (!step) return;
  const next = getNextPendingItem(step.phase, state, step.stepId);
  if (!next) return;
  persist({ ...state, selectedStepId: step.stepId, activeItemId: next.id });
  scrollToItem(next.id);
}

function handleNextGroup() {
  const step = selectedStep();
  if (!step) return;
  const progress = getPhaseProgress(step.phase, state, step.stepId);
  const nextPending = getNextPendingItem(step.phase, state, step.stepId);

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

  const steps = getMissionSteps();
  const idx = steps.findIndex(s => s.stepId === step.stepId);
  const next = steps[idx + 1];
  if (!next) { handleCompleteFlight(); return; }
  selectStep(next.stepId);
}

function getStatusLabel(s) {
  return s === "completed" ? "DONE" : s === "active" ? "NEXT" : s === "skipped" ? "ATTN" : "PENDING";
}

// ─── PDF generation ────────────────────────────────────────────────────────

function generateFlightPDF(flightId) {
  const log = loadFlightLog();
  const entry = log.find(e => e.id === flightId);
  if (!entry) return;

  let steps;
  if (entry.profileId) {
    steps = buildMissionSteps(entry.profileId, entry.profileParams || {});
  } else {
    steps = checklistData.phases
      .filter(p => p.categoryId === entry.flightType)
      .map((p, i) => ({ stepId: `${entry.flightType[0]}${i}`, phaseId: p.id, phase: p, label: null }));
  }

  const doneMap = entry.completed || {};
  const skipMap = entry.skipped || {};
  const typeLabel = entry.profileId
    ? getProfileLabelFor(entry.profileId, entry.profileParams || {})
    : (entry.flightType === "offshore" ? "OFFSHORE CHECK LIST" : "NORMAL CHECK LIST");

  const groupsHTML = steps.map(step => {
    const items = step.phase.items.filter(i => i.required !== false);
    const done = new Set(doneMap[step.stepId] || []);
    const skip = new Set(skipMap[step.stepId] || []);
    const cnt = items.filter(i => done.has(i.id)).length;
    const title = step.label ? `${step.phase.title} — ${step.label}` : step.phase.title;
    const rows = items.map(item => {
      const isDone = done.has(item.id), isSkip = skip.has(item.id);
      const ic = isDone ? "✓" : (isSkip ? "⚠" : "○");
      const cl = isDone ? "done" : (isSkip ? "attn" : "pend");
      return `<tr class="${cl}"><td class="ic">${ic}</td><td class="ch">${item.challenge}</td><td class="rs">${item.response}</td></tr>`;
    }).join("");
    return `<div class="grp"><div class="gh"><span>${title}</span><span>${cnt}/${items.length}</span></div><table><tbody>${rows}</tbody></table></div>`;
  }).join("");

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
  <div class="htitle">AW139 ${typeLabel}</div>
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
  const steps = getMissionSteps();
  const completedGroups = steps.filter(s => getPhaseProgress(s.phase, state, s.stepId).isComplete).length;
  const isGroupsView = currentView === "groups";
  const onChecklist = currentView === "checklist";
  const step = onChecklist ? selectedStep() : null;
  const hasNextPending = onChecklist && step ? !!getNextPendingItem(step.phase, state, step.stepId) : false;

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
        <span class="bottom-label">${completedGroups}/${steps.length}</span>
      </button>
    </nav>
  `;
}

function renderLegButtons(profile, paramKey, max = 5) {
  if (legPicker?.profile === profile) {
    const n = legPicker.count;
    const params = JSON.stringify({ [paramKey]: n });
    return `
      <div class="mission-legs-picker">
        <button class="leg-stepper" data-action="leg-dec" data-profile="${profile}" ${n <= 2 ? "disabled" : ""}>−</button>
        <span class="leg-stepper-val">${n}</span>
        <button class="leg-stepper" data-action="leg-inc" data-profile="${profile}" ${n >= max ? "disabled" : ""}>+</button>
        <button class="leg-btn leg-start" data-action="select-profile" data-profile="${profile}" data-params='${params}'>OK</button>
      </div>
    `;
  }
  const p1 = JSON.stringify({ [paramKey]: 1 });
  const cls = profile === "normal_offshore" ? " offshore" : "";
  return `
    <div class="mission-legs-btns">
      <button class="leg-btn${cls}" data-action="select-profile" data-profile="${profile}" data-params='${p1}'>1</button>
      <button class="leg-btn${cls} leg-more" data-action="expand-legs" data-profile="${profile}">+</button>
    </div>
  `;
}

function renderInitialScreen() {
  const hasFlight = !!state.profileId && !state.completedAt;
  const log = loadFlightLog();

  const historyRows = log.slice(0, 10).map(entry => {
    const typeLabel = getLogTypeLabel(entry);
    const isOff = entry.profileId === "offshore" || entry.profileId === "normal_offshore";
    return `
      <div class="history-entry">
        <span class="history-type ${isOff ? "offshore" : ""}">${typeLabel}</span>
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
            ← Continuar ${escapeHtml(getProfileLabel())}
          </button>
        ` : ""}

        <div class="initial-section-label">Iniciar voo</div>
        <div class="mission-grid">

          <button class="mission-btn" data-action="select-profile" data-profile="normal">
            <span class="mission-btn-label">Normal</span>
            <span class="mission-btn-title">NCL</span>
            <span class="mission-btn-desc">16 grupos</span>
          </button>

          <button class="mission-btn offshore" data-action="select-profile" data-profile="offshore">
            <span class="mission-btn-label">Offshore</span>
            <span class="mission-btn-title">OCL</span>
            <span class="mission-btn-desc">7 grupos</span>
          </button>

          <div class="mission-btn mission-multi offshore">
            <span class="mission-btn-label">Normal + Offshore</span>
            <span class="mission-btn-title">NCL + OCL</span>
            <div class="mission-legs">
              <span class="mission-legs-label">Pousos offshore</span>
              ${renderLegButtons("normal_offshore", "offshoreLegs", 5)}
            </div>
          </div>

          <div class="mission-btn mission-multi">
            <span class="mission-btn-label">Normal c/ Paradas</span>
            <span class="mission-btn-title">NCL</span>
            <div class="mission-legs">
              <span class="mission-legs-label">Paradas intermediárias</span>
              ${renderLegButtons("normal_stops", "stops", 4)}
            </div>
          </div>

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
  const steps = getMissionSteps();
  const doneCount = steps.filter(s => getPhaseProgress(s.phase, state, s.stepId).isComplete).length;
  const label = getProfileLabel();
  const reg = state.flightRegistration || settings.registration;

  const cards = steps.map((step, idx) => {
    const progress = getPhaseProgress(step.phase, state, step.stepId);
    const isComplete = progress.isComplete;
    const isActive = step.stepId === state.selectedStepId;
    const title = step.label || step.phase.title;
    return `
      <button class="group-card ${isComplete ? "complete" : ""} ${isActive ? "active-group" : ""}"
        data-action="select-step" data-step-id="${escapeHtml(step.stepId)}">
        <div class="group-card-num">${idx + 1}</div>
        <div class="group-card-title">${escapeHtml(title)}</div>
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
          ${doneCount}/${steps.length} grupos concluídos
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
  const step = selectedStep();
  if (!step) return `<div class="empty-state">Nenhuma checklist carregada.</div>`;

  const steps = getMissionSteps();
  const fi = steps.findIndex(s => s.stepId === step.stepId);
  const progress = getPhaseProgress(step.phase, state, step.stepId);
  const nextPending = getNextPendingItem(step.phase, state, step.stepId);
  const title = step.label || step.phase.title;
  const groupKicker = `Grupo ${fi + 1}/${steps.length} • ${escapeHtml(step.phase.categoryTitle)} • PDF p.${escapeHtml(String(step.phase.pdfPage))}`;
  const resumeText = nextPending
    ? `Próximo item pendente: <strong>${escapeHtml(nextPending.challenge)}</strong> — ${escapeHtml(nextPending.response)}`
    : `Grupo completo. Conferir visualmente e avançar para o próximo grupo.`;

  const rows = step.phase.items.map((item, i) => {
    const status = getItemStatus(step.phase, item, state, step.stepId);
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
            <h2 class="card-title">${escapeHtml(title)}</h2>
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
  const reg = state.flightRegistration || settings.registration;
  const label = getProfileLabel();

  return `
    <main class="app-shell checklist-view">
      <header class="topbar">
        <div class="brand">
          <div class="brand-title">${escapeHtml(checklistData.title)}</div>
          <div class="brand-subtitle">
            ${reg ? `${escapeHtml(reg)} • ` : ""}${escapeHtml(label)}
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
  const steps = getMissionSteps();
  const totalGroups = steps.length;
  const totalItems = steps.reduce((s, step) => s + step.phase.items.filter(i => i.required !== false).length, 0);
  const durationMs = state.flightSessionStartedAt && state.completedAt
    ? new Date(state.completedAt) - new Date(state.flightSessionStartedAt) : 0;
  const label = getProfileLabel();
  const reg = state.flightRegistration || settings.registration;
  const log = loadFlightLog();
  const currentEntry = log[0];

  const logRows = log.slice(0, 6).map((entry, i) => {
    const typeLabel = getLogTypeLabel(entry);
    const isOff = entry.profileId === "offshore" || entry.profileId === "normal_offshore";
    return `
      <div class="log-entry ${i === 0 ? "current-entry" : ""} ${isOff ? "offshore-entry" : ""}">
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
          ${reg ? `<strong>${escapeHtml(reg)}</strong> • ` : ""}${escapeHtml(label)} • Rev. ${escapeHtml(checklistData.revision.sourceRevision)} • ${formatDate(state.completedAt)}
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
  if (!state.profileId || showingInitial) {
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
  document.querySelectorAll("[data-action='select-step']").forEach(btn => {
    btn.addEventListener("click", () => selectStep(btn.dataset.stepId));
  });

  document.querySelectorAll("[data-action='select-profile']").forEach(btn => {
    btn.addEventListener("click", () => {
      const profileId = btn.dataset.profile;
      const params = btn.dataset.params ? JSON.parse(btn.dataset.params) : {};
      handleSelectProfile(profileId, params);
    });
  });

  document.querySelectorAll("[data-action='expand-legs']").forEach(btn => {
    btn.addEventListener("click", () => {
      legPicker = { profile: btn.dataset.profile, count: 2 };
      app.innerHTML = renderInitialScreen();
      bindEvents();
    });
  });

  document.querySelectorAll("[data-action='leg-dec']").forEach(btn => {
    btn.addEventListener("click", () => {
      if (legPicker) legPicker = { ...legPicker, count: Math.max(2, legPicker.count - 1) };
      app.innerHTML = renderInitialScreen();
      bindEvents();
    });
  });

  document.querySelectorAll("[data-action='leg-inc']").forEach(btn => {
    btn.addEventListener("click", () => {
      if (legPicker) legPicker = { ...legPicker, count: Math.min(legPicker.profile === "normal_stops" ? 4 : 5, legPicker.count + 1) };
      app.innerHTML = renderInitialScreen();
      bindEvents();
    });
  });

  document.querySelectorAll("[data-action='toggle-item']").forEach(btn => {
    let x0 = 0, y0 = 0, didSwipe = false;
    const id = btn.dataset.itemId;

    btn.addEventListener("pointerdown", e => {
      x0 = e.clientX; y0 = e.clientY; didSwipe = false;
      btn.style.transition = "none";
    });

    btn.addEventListener("pointermove", e => {
      const dx = e.clientX - x0, dy = e.clientY - y0;
      if (dx < 0 && Math.abs(dx) > Math.abs(dy)) {
        const t = Math.min(Math.abs(dx), 100);
        btn.style.transform = `translateX(${-t}px)`;
        btn.style.background = `rgba(255,92,92,${(t / 100) * 0.28})`;
      }
    });

    const release = e => {
      const dx = (e.clientX ?? x0) - x0;
      const dy = (e.clientY ?? y0) - y0;
      btn.style.transition = "transform 220ms ease, background 220ms ease";
      btn.style.transform = "";
      btn.style.background = "";
      if (dx < -60 && Math.abs(dy) < 50) {
        didSwipe = true;
        handleSkipItem(id);
      }
    };

    btn.addEventListener("pointerup", release);
    btn.addEventListener("pointercancel", () => {
      btn.style.transition = "transform 220ms ease, background 220ms ease";
      btn.style.transform = "";
      btn.style.background = "";
    });
    btn.addEventListener("click", e => {
      if (didSwipe) { e.preventDefault(); didSwipe = false; return; }
      handleToggleItem(id);
    });
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
