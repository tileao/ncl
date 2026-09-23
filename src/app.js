import { caderno } from "./data/fleets.js";
import {
  loadState, saveState, resetAllState,
  loadFlightLog, saveFlightLog,
  loadSettings, saveSettings
} from "./checklist/storage.js";
import {
  getPhaseProgress, getNextPendingItem, getCurrentItem, getItemStatus,
  toggleItem, resetPhase
} from "./checklist/engine.js";

const app = document.querySelector("#app");
let state = loadState();
let settings = loadSettings();
if (settings.nightMode) document.body.classList.add('night');
if (settings.rowColors) document.body.classList.add('row-colors');
let currentView = "groups"; // "groups" | "checklist"
let viewMode = "doc";       // "doc" (caderno) | "cockpit" (cards)
let showingInitial = false;
let settingsOpen = false;
let landingsDraft = state.landings || 1;
let overviewLeg = null;     // leg shown on the caderno overview; null → leg of the open group
let lastDocWidth = 0;

const MAX_LANDINGS = 12;

if (state.fleetId && !state.completedAt) {
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
const ICON_CURRENT = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><polyline points="9,14 11,16 15,11"/></svg>`;
const ICON_GRID = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`;
const ICON_DOC = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`;
const ICON_MOON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const ICON_SUN = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

// ─── Fleets & flight legs ───────────────────────────────────────────────────

function getFleet(fleetId) {
  return caderno.fleets.find(f => f.id === fleetId)
    || caderno.fleets.find(f => f.id === caderno.defaultFleetId);
}

const settingsFleet = () => getFleet(settings.fleetId);
const flightFleet = () => getFleet(state.fleetId || settings.fleetId);

function clampLandings(n) {
  const v = parseInt(n, 10);
  return Math.min(MAX_LANDINGS, Math.max(1, isNaN(v) ? 1 : v));
}

// The caderno has a single checklist per fleet (onshore and offshore items
// are merged). The flight is split into one leg per landing: leg 1 starts at
// PREFLIGHT, every following leg restarts at BEFORE TAKEOFF, and only the
// last leg ends with SHUT DOWN.
const DEPARTURE_PHASES = ["preflight", "before-start", "after-start", "before-taxi"];
const LEG_PHASES = ["before-takeoff", "after-takeoff", "cruise", "descent", "landing", "after-landing"];
const SHUTDOWN_PHASES = ["shut-down"];

function legPhaseIds(leg, landings) {
  return [
    ...(leg === 1 ? DEPARTURE_PHASES : []),
    ...LEG_PHASES,
    ...(leg === landings ? SHUTDOWN_PHASES : [])
  ];
}

function buildFlightSteps(fleetId, landings) {
  const fleet = getFleet(fleetId);
  const n = clampLandings(landings);
  const steps = [];
  for (let leg = 1; leg <= n; leg++) {
    legPhaseIds(leg, n).forEach(phaseId => {
      const phase = fleet.phases.find(p => p.id === phaseId);
      if (phase) steps.push({ stepId: `${leg}:${phaseId}`, leg, phaseId, phase });
    });
  }
  return steps;
}

function getMissionSteps() {
  if (!state.fleetId) return [];
  return buildFlightSteps(state.fleetId, state.landings);
}

function isStepAccessible(steps, stepIdx) {
  if (settings.barriersDisabled) return true;
  for (let i = 0; i < stepIdx; i++) {
    if (!getPhaseProgress(steps[i].phase, state, steps[i].stepId).isComplete) return false;
  }
  return true;
}

const phaseHeader = phase => `${phase.title} (${phase.method})`;
const landingsText = n => `${n} ${n === 1 ? "pouso" : "pousos"}`;

function flightLabelFor(fleetId, landings) {
  return `${getFleet(fleetId).name} • ${landingsText(clampLandings(landings))}`;
}

function getProfileLabel() {
  return flightLabelFor(state.fleetId, state.landings);
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
  const stepIdx = steps.findIndex(s => s.stepId === stepId);
  if (stepIdx < 0) return;
  if (!isStepAccessible(steps, stepIdx)) return;
  const step = steps[stepIdx];
  currentView = "checklist";
  overviewLeg = null;
  persist({
    ...state,
    selectedStepId: stepId,
    activeItemId: getCurrentItem(step.phase, state, stepId)?.id || null,
    flightSessionStartedAt: state.flightSessionStartedAt || new Date().toISOString()
  });
}

function handleStartFlight() {
  const landings = clampLandings(landingsDraft);
  const fleet = settingsFleet();
  const regInput = document.getElementById("reg-input");
  const registration = (regInput ? regInput.value.trim().toUpperCase() : settings.registration) || "";
  const remarksInput = document.getElementById("remarks-input");
  const remarks = remarksInput ? remarksInput.value.trim() : (state.flightRemarks || "");

  const hasProgress = state.fleetId && !state.completedAt &&
    Object.values(state.completed || {}).some(a => a.length > 0);
  if (hasProgress) {
    const ok = window.confirm(
      `Iniciar novo voo ${fleet.name} com ${landingsText(landings)}? O progresso atual será perdido.`
    );
    if (!ok) return;
  }

  settings = { ...settings, registration };
  saveSettings(settings);
  showingInitial = false;
  currentView = "groups";
  viewMode = "doc";
  overviewLeg = null;

  const first = buildFlightSteps(fleet.id, landings)[0];
  persist({
    fleetId: fleet.id,
    landings,
    flightRegistration: registration,
    flightRemarks: remarks,
    selectedStepId: first?.stepId || null,
    activeItemId: first?.phase.items[0]?.id || null,
    completed: {},
    skipped: {},
    completedTimestamps: {},
    completedAt: null,
    lastUpdatedAt: null,
    flightSessionStartedAt: new Date().toISOString(),
    flightTimes: { acionamento: null, decolagens: [], pousos: [], corte: null }
  });
}

function handleHome() {
  showingInitial = true;
  if (state.landings) landingsDraft = state.landings;
  render();
}

// ─── Flight times ────────────────────────────────────────────────────────────

// Take-off / landing times are stored per leg (index = leg − 1).
function handleMarkTime(marker, legIdx) {
  const now = Date.now();
  const ft = state.flightTimes || { acionamento: null, decolagens: [], pousos: [], corte: null };
  const setAt = list => {
    const next = [...list];
    if (Number.isInteger(legIdx) && legIdx >= 0) next[legIdx] = now;
    else next.push(now);
    return next;
  };
  let next;
  if (marker === "acionamento") next = { ...ft, acionamento: now };
  else if (marker === "decolagem") next = { ...ft, decolagens: setAt(ft.decolagens) };
  else if (marker === "pouso")     next = { ...ft, pousos: setAt(ft.pousos) };
  else if (marker === "corte")     next = { ...ft, corte: now };
  else return;
  state = saveState({ ...state, flightTimes: next });
  render();
}

function fmtHHMM(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function fmtDuration(ms) {
  if (!ms || ms <= 0) return "—";
  const m = Math.round(ms / 60000);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return h > 0 ? `${h}h${String(mm).padStart(2, "0")}` : `${mm}min`;
}

function renderTimingMarker(marker, label, recordedTs, legIdx = -1) {
  const done = recordedTs != null;
  return `
    <div class="timing-marker timing-${marker}${done ? " timing-done" : ""}">
      <button class="timing-tap" data-action="mark-time" data-marker="${marker}" data-leg="${legIdx}">
        <span class="timing-tap-label">${label}</span>
        <span class="timing-tap-val">${done ? fmtHHMM(recordedTs) : "Registrar"}</span>
      </button>
    </div>`;
}

function renderFlightTimesSection() {
  const ft = state.flightTimes;
  if (!ft) return "";
  const { acionamento, decolagens, pousos, corte } = ft;
  if (!acionamento && !decolagens.some(Boolean) && !corte) return "";

  const nLegs = Math.max(decolagens.length, pousos.length);
  let flightMs = 0;
  let legsHtml = "";
  for (let i = 0; i < nLegs; i++) {
    const dep = decolagens[i] ?? null;
    const arr = pousos[i] ?? null;
    const legMs = dep && arr ? arr - dep : null;
    if (legMs) flightMs += legMs;
    const suffix = nLegs > 1 ? ` ${i + 1}` : "";
    legsHtml += `
      <div class="ft-leg-row">
        <div class="ft-cell"><span class="ft-cell-lbl">Decolagem${suffix}</span><span class="ft-cell-val">${fmtHHMM(dep)}</span></div>
        <div class="ft-cell"><span class="ft-cell-lbl">Pouso${suffix}</span><span class="ft-cell-val">${fmtHHMM(arr)}</span></div>
        ${legMs ? `<div class="ft-cell ft-cell-dur"><span class="ft-cell-val ft-dur">${fmtDuration(legMs)}</span></div>` : ""}
      </div>`;
  }

  const lastPouso = [...pousos].reverse().find(Boolean) ?? null;
  const totalStart = acionamento ?? (corte && lastPouso ? lastPouso : null);
  const totalEnd   = corte ?? (acionamento && lastPouso ? lastPouso : null);
  const totalMs    = totalStart && totalEnd ? totalEnd - totalStart : null;
  const totalsHtml = (totalMs || flightMs) ? `
    <div class="ft-totals">
      ${totalMs ? `<div class="ft-total-item"><span class="ft-total-lbl">Total</span><span class="ft-total-val">${fmtDuration(totalMs)}</span></div>` : ""}
      ${flightMs ? `<div class="ft-total-item"><span class="ft-total-lbl">Voo</span><span class="ft-total-val">${fmtDuration(flightMs)}</span></div>` : ""}
    </div>` : "";

  return `
    <div class="initial-section-label">Tempos do voo</div>
    <div class="ft-card">
      ${acionamento ? `<div class="ft-main-row"><span class="ft-cell-lbl">Acionamento</span><span class="ft-cell-val">${fmtHHMM(acionamento)}</span></div>` : ""}
      ${legsHtml}
      ${corte ? `<div class="ft-main-row"><span class="ft-cell-lbl">Corte</span><span class="ft-cell-val">${fmtHHMM(corte)}</span></div>` : ""}
      ${totalsHtml}
    </div>`;
}

function handleToggleNightMode() {
  const isNight = document.body.classList.toggle('night');
  settings = { ...settings, nightMode: isNight };
  saveSettings(settings);
  render();
}

function handleShowGroups() { currentView = "groups"; viewMode = "cockpit"; render(); }
function handleShowDoc()    { currentView = "groups"; viewMode = "doc";     render(); }
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

// The group the flight is on: the furthest group with a checked item while
// it is incomplete, otherwise the one after it. Peeking at a later group or
// leaving not-accomplished items behind does not move it.
function getCurrentStep() {
  const steps = getMissionSteps();
  if (!steps.length) return null;
  let last = -1;
  steps.forEach((s, i) => { if ((state.completed?.[s.stepId] || []).length) last = i; });
  if (last < 0) return steps[0];
  const done = getPhaseProgress(steps[last].phase, state, steps[last].stepId).isComplete;
  return done ? (steps[last + 1] || steps[last]) : steps[last];
}

function handleGoCurrent() {
  const step = getCurrentStep();
  if (!step) return;
  if (currentView === "checklist" && step.stepId === state.selectedStepId) {
    const item = getCurrentItem(step.phase, state, step.stepId);
    if (item) scrollToItem(item.id);
    return;
  }
  selectStep(step.stepId);
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
  const doneGroups = steps.filter(s => getPhaseProgress(s.phase, state, s.stepId).isComplete).length;
  const doneItems = steps.reduce((s, step) => {
    const done = new Set(state.completed?.[step.stepId] || []);
    return s + step.phase.items.filter(i => i.required !== false && done.has(i.id)).length;
  }, 0);
  const startedAt = state.flightSessionStartedAt;
  const completedAt = new Date().toISOString();
  const durationMs = startedAt ? new Date(completedAt) - new Date(startedAt) : 0;
  return { totalGroups, totalItems, doneGroups, doneItems, startedAt, completedAt, durationMs };
}

function handleCompleteFlight() {
  const stats = getMissionStats();
  const log = loadFlightLog();
  log.unshift({
    id: stats.completedAt,
    fleetId: state.fleetId,
    landings: clampLandings(state.landings),
    registration: state.flightRegistration || settings.registration || "",
    remarks: state.flightRemarks || "",
    startedAt: stats.startedAt,
    completedAt: stats.completedAt,
    durationMs: stats.durationMs,
    totalGroups: stats.totalGroups,
    totalItems: stats.totalItems,
    doneGroups: stats.doneGroups,
    doneItems: stats.doneItems,
    completed: { ...state.completed },
    completedTimestamps: { ...(state.completedTimestamps || {}) }
  });
  saveFlightLog(log.slice(0, 10));
  persist({ ...state, completedAt: stats.completedAt });
}

function handleToggleItem(id) {
  const step = selectedStep();
  if (!step) return;
  persist(toggleItem(step.phase, id, state, step.stepId, new Date().toISOString()));
}

function handleResetPhase() {
  const step = selectedStep();
  if (!step) return;
  const ok = window.confirm(`Resetar o grupo ${phaseHeader(step.phase)}?`);
  if (!ok) return;
  persist(resetPhase(step.phase, state, step.stepId));
}

function handleResetAll() {
  const ok = window.confirm("Resetar todo o progresso e iniciar novo voo?");
  if (!ok) return;
  showingInitial = true;
  currentView = "groups";
  overviewLeg = null;
  state = resetAllState();
  render();
}

function handleReviewChecklist() {
  currentView = "checklist";
  persist({ ...state, completedAt: null });
}

function autoScrollToActiveItem() {
  const step = selectedStep();
  const id = step && getCurrentItem(step.phase, state, step.stepId)?.id;
  if (!id) return;
  requestAnimationFrame(() => {
    document.querySelector(`[data-item-id="${id}"]`)?.scrollIntoView({ behavior: "instant", block: "center" });
  });
}

function scrollToItem(id) {
  requestAnimationFrame(() => {
    document.querySelector(`[data-item-id="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function handleNextGroup() {
  const step = selectedStep();
  if (!step) return;
  const progress = getPhaseProgress(step.phase, state, step.stepId);
  const nextPending = getNextPendingItem(step.phase, state, step.stepId);

  if (!progress.isComplete) {
    if (nextPending) {
      persist({ ...state, activeItemId: nextPending.id });
      scrollToItem(nextPending.id);
    }
    return;
  }

  const steps = getMissionSteps();
  const idx = steps.findIndex(s => s.stepId === step.stepId);
  const next = steps[idx + 1];
  if (!next) { handleCompleteFlight(); return; }
  selectStep(next.stepId);
}

// ─── Flight record (print / PDF) ────────────────────────────────────────────

function generateFlightPDF(flightId) {
  const entry = loadFlightLog().find(e => e.id === flightId);
  if (!entry) return;

  const fleet = getFleet(entry.fleetId);
  const landings = clampLandings(entry.landings);
  const steps = buildFlightSteps(fleet.id, landings);
  const doneMap = entry.completed || {};
  const tsMap = entry.completedTimestamps || {};

  const fmtTime = iso => {
    if (!iso) return "";
    return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const groupsHTML = steps.map(step => {
    const { phase } = step;
    const done = new Set(doneMap[step.stepId] || []);
    const stepTs = tsMap[step.stepId] || {};
    const cnt = phase.items.filter(i => done.has(i.id)).length;
    // Not accomplished = unchecked with a checked item below it
    const lastDone = phase.items.reduce((last, it, i) => (done.has(it.id) ? i : last), -1);
    const rows = phase.items.map((item, i) => {
      const isDone = done.has(item.id), isSkip = !isDone && i < lastDone;
      const cl = isDone ? "done" : (isSkip ? "attn" : "pend");
      const ic = isDone ? "✓" : (isSkip ? "⚠" : "");
      const ts = isDone && stepTs[item.id] ? fmtTime(stepTs[item.id]) : "";
      return `<tr class="z${i % 2} ${cl}"><td class="ch">${escapeHtml(item.challenge)}</td><td class="rs">${escapeHtml(item.response)}</td><td class="st">${ic}</td><td class="ts">${ts}</td></tr>`;
    }).join("");
    const legInfo = landings > 1 ? `Perna ${step.leg}/${landings} · ` : "";
    return `<div class="grp">
      <div class="cap">${legInfo}${cnt}/${phase.items.length} itens</div>
      <table>
        <colgroup><col class="c-ch"><col><col class="c-st"><col class="c-ts"></colgroup>
        <thead>
          <tr><th colspan="4" class="hdr">${escapeHtml(phaseHeader(phase))}</th></tr>
          <tr><td colspan="4" class="trg">Gatilho: ${escapeHtml(phase.trigger)}</td></tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><td colspan="4" class="cmp">► ${escapeHtml(phase.complete)}</td></tr></tfoot>
      </table>
    </div>`;
  }).join("");

  const doneGroups = entry.doneGroups ?? entry.totalGroups;
  const doneItems  = entry.doneItems  ?? entry.totalItems;

  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<title>${escapeHtml(fleet.name)} — ${escapeHtml(entry.registration || "—")} — ${formatDate(entry.completedAt)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:Arial,Helvetica,sans-serif;font-size:8pt;color:#000;background:#fff}
.nop{padding:8px 12mm;background:#f0f0f0;border-bottom:1px solid #ccc;display:flex;gap:8px;align-items:center}
.nop button{padding:6px 14px;cursor:pointer;font-size:8.5pt;border:1px solid #888;background:#fff;border-radius:4px}
.phdr{padding:6mm 12mm 0;text-align:right;color:#888;font-size:8pt}
.hdr-block{padding:3mm 12mm 4mm;text-align:center}
.htitle{font-size:16pt;font-weight:700;color:#1B365D}
.hsub{font-size:11pt;font-style:italic;color:#444;margin-top:2pt}
.hmeta{margin-top:6pt;display:flex;flex-wrap:wrap;justify-content:center;gap:4pt 14pt;font-size:8.5pt;color:#1F4E79}
.fleet{padding:0 12mm;font-size:13pt;font-weight:700;color:#1B365D;margin:4pt 0 6pt}
.body{padding:0 12mm 8mm;columns:2;column-gap:7mm;column-rule:1px solid #000}
.grp{break-inside:avoid;margin-bottom:14pt}
.cap{font-size:7pt;color:#888;text-align:right;margin-bottom:1pt}
table{width:100%;border-collapse:collapse;table-layout:fixed;line-height:1.32}
td,th{padding:1.25pt 1.5pt 1.25pt 2pt;vertical-align:top}
.hdr{background:#1B365D;color:#fff;font-size:9.5pt;font-weight:700;text-align:center;padding:2pt 2.5pt}
.trg{background:#D9E1F2;color:#1F4E79;font-style:italic;padding:1.5pt 2.5pt}
.cmp{background:#D9E1F2;color:#1F4E79;font-weight:700;font-style:italic;padding:3.75pt 2.5pt}
.z0 td{background:#fff}.z1 td{background:#C8C8C8}
.c-ch{width:52%}.c-st{width:10pt}.c-ts{width:38pt}
.ch{text-align:left}
.rs{text-align:right}
.st{text-align:center;font-weight:700}
.ts{text-align:right;color:#666;font-size:7pt;white-space:nowrap}
.done .st{color:#007700}
.attn td{color:#b52a1a}
.pend .st{color:#b52a1a}
.pftr{padding:0 12mm 6mm;text-align:center;color:#888;font-size:8pt}
@page{margin:8mm 0;size:A4}
@media print{.nop{display:none!important}}
</style></head><body>
<div class="nop">
  <button onclick="window.print()">🖨 Imprimir / Salvar PDF</button>
  <button onclick="window.close()">✕ Fechar</button>
</div>
<div class="phdr">${escapeHtml(caderno.pageHeader)}</div>
<div class="hdr-block">
  <div class="htitle">REGISTRO DE VOO — CHECKLISTS NORMAIS</div>
  <div class="hsub">${escapeHtml(caderno.subtitle)}</div>
  <div class="hmeta">
    <span><strong>Matrícula:</strong> ${escapeHtml(entry.registration || "—")}</span>
    <span><strong>Data:</strong> ${formatDate(entry.completedAt)}</span>
    <span><strong>Duração:</strong> ${formatDuration(entry.durationMs)}</span>
    <span><strong>Pousos:</strong> ${landings}</span>
    ${entry.remarks ? `<span><strong>Obs.:</strong> ${escapeHtml(entry.remarks)}</span>` : ""}
    <span><strong>Grupos:</strong> ${doneGroups}/${entry.totalGroups}</span>
    <span><strong>Itens:</strong> ${doneItems}/${entry.totalItems}</span>
    <span><strong>Caderno:</strong> ${escapeHtml(caderno.version)}</span>
  </div>
</div>
<div class="fleet">${escapeHtml(fleet.heading)}</div>
<div class="body">${groupsHTML}</div>
<div class="pftr">${escapeHtml(caderno.pageFooter)}${escapeHtml(caderno.source)}</div>
</body></html>`;

  const win = window.open("", "_blank");
  if (win) { win.document.write(html); win.document.close(); }
}

// ─── Caderno rendering (visual reproduced from the .docx) ───────────────────
// One table per checklist: navy title bar, light-blue "Gatilho" row, items in
// alternating white / gray rows (challenge left, response right) and the
// light-blue "► Checklist complete" row.

function renderCadTable(phase, statusOf, sectionDone = false) {
  const rows = phase.items.map((item, i) => {
    const status = statusOf(item);
    return `<div class="cad-row cad-z${i % 2} ${status}">
      <span class="cad-ch">${escapeHtml(item.challenge)}</span>
      <span class="cad-rs">${escapeHtml(item.response)}</span>
    </div>`;
  }).join("");
  return `<div class="cad-table">
    <div class="cad-hdr">${escapeHtml(phaseHeader(phase))}${sectionDone ? `<span class="cad-sec-check">✓</span>` : ""}</div>
    <div class="cad-trigger">Gatilho: ${escapeHtml(phase.trigger)}</div>
    ${rows}
    <div class="cad-complete">► ${escapeHtml(phase.complete)}</div>
  </div>`;
}

function renderCadTitleBlock() {
  return `<div class="cad-title-block">
    <div class="cad-title">${escapeHtml(caderno.title)}</div>
    <div class="cad-subtitle">${escapeHtml(caderno.subtitle)}</div>
    <div class="cad-notes">${caderno.notes.map(escapeHtml).join("<br>")}</div>
  </div>`;
}

// Page geometry in em, with 1em = 8pt (the caderno body text size):
// Letter 612 × 792pt, 0.5in margins, two columns 14.4pt apart with a
// separator line, 8pt header/footer lines.
const DOC = {
  pageH: 99,
  margin: 4.5,
  headerH: 1.15,
  colW: 32.85,
  colGap: 1.8,
  tableGap: 2.68,  // empty 11pt paragraph (+6pt after) below every table
  titleGap: 3.18   // empty section-break paragraph after the title block
};
const DOC_BODY_H = DOC.pageH - 2 * (DOC.margin + DOC.headerH);

// Two columns like the document when they fit at a legible size; on narrow
// phones each sheet carries a single column of the same tables.
function docLayout() {
  // Pages are sized before they exist, so leave room for the scrollbar they
  // bring on desktop browsers (touch devices use overlay scrollbars).
  const scrollbar = window.matchMedia("(pointer: coarse)").matches ? 0 : 16;
  const avail = Math.max(280, document.documentElement.clientWidth - 16 - scrollbar);
  const twoColW = DOC.colW * 2 + DOC.colGap + DOC.margin * 2;
  const oneColW = DOC.colW + DOC.margin * 2;
  if (avail / twoColW >= 8.5) return { cols: 2, pageW: twoColW, fontPx: Math.min(14, avail / twoColW) };
  return { cols: 1, pageW: oneColW, fontPx: Math.min(14, avail / oneColW) };
}

function measureHeights(htmlList, widthEm, fontPx) {
  const box = document.createElement("div");
  box.className = "cad-measure";
  box.style.fontSize = `${fontPx}px`;
  box.style.width = `${widthEm}em`;
  box.innerHTML = htmlList.join("");
  document.body.appendChild(box);
  const heights = Array.from(box.children, el => el.getBoundingClientRect().height / fontPx);
  box.remove();
  return heights;
}

// Every row in the caderno is "keep with next", so Word never splits a
// table: one that does not fit in what is left of a column starts the next.
function paginate(heights, firstCap, cap, cols) {
  const pages = [];
  let cur;
  const openPage = pageCap => {
    cur = { cap: pageCap, col: 0, cols: Array.from({ length: cols }, () => ({ idx: [], used: 0 })) };
    pages.push(cur);
  };
  openPage(firstCap);
  heights.forEach((h, i) => {
    let column = cur.cols[cur.col];
    if (column.idx.length && column.used + DOC.tableGap + h > cur.cap) {
      if (cur.col + 1 < cols) cur.col++;
      else openPage(cap);
      column = cur.cols[cur.col];
    }
    column.used += (column.idx.length ? DOC.tableGap : 0) + h;
    column.idx.push(i);
  });
  return pages;
}

function currentOverviewLeg() {
  const n = clampLandings(state.landings);
  const leg = overviewLeg ?? selectedStep()?.leg ?? 1;
  return Math.min(n, Math.max(1, leg));
}

function renderDocPage() {
  const steps = getMissionSteps();
  const fleet = flightFleet();
  const n = clampLandings(state.landings);
  const leg = currentOverviewLeg();
  const legSteps = steps.filter(s => s.leg === leg);
  const reg = state.flightRegistration || settings.registration;

  const blocks = fleet.phases.map((phase, pi) => {
    const step = legSteps.find(s => s.phaseId === phase.id);
    const stepIdx = step ? steps.indexOf(step) : -1;
    const isLocked = step && !isStepAccessible(steps, stepIdx);
    const done = step && getPhaseProgress(phase, state, step.stepId).isComplete;
    const statusOf = item => {
      if (!step) return "";
      const s = getItemStatus(phase, item, state, step.stepId);
      return s === "active" ? "" : s;
    };
    const cls = [
      "cad-sec",
      !step ? "cad-off" : "",
      isLocked ? "cad-locked" : "",
      step && step.stepId === state.selectedStepId ? "cad-active" : ""
    ].filter(Boolean).join(" ");
    const interactive = step && !isLocked
      ? ` data-action="select-step" data-step-id="${escapeHtml(step.stepId)}" role="button" tabindex="0"`
      : "";
    const heading = pi === 0 ? `<div class="cad-fleet-heading">${escapeHtml(fleet.heading)}</div>` : "";
    return `<div class="cad-block">${heading}<div class="${cls}"${interactive}>${renderCadTable(phase, statusOf, done)}</div></div>`;
  });

  const { cols, pageW, fontPx } = docLayout();
  lastDocWidth = document.documentElement.clientWidth;
  const regionW = DOC.colW * cols + DOC.colGap * (cols - 1);
  // The title block only exists on the first page of the caderno (first
  // fleet); every other fleet starts a new page directly with its heading.
  const titleHtml = fleet.id === caderno.fleets[0].id ? renderCadTitleBlock() : "";
  const titleSpace = titleHtml ? measureHeights([titleHtml], regionW, fontPx)[0] + DOC.titleGap : 0;
  const heights = measureHeights(blocks, DOC.colW, fontPx);
  const pages = paginate(heights, DOC_BODY_H - titleSpace, DOC_BODY_H, cols);

  const pagesHtml = pages.map((pg, pi) => {
    const colsHtml = pg.cols.map((c, ci) =>
      `${ci ? `<div class="cad-col-sep"></div>` : ""}<div class="cad-col">${c.idx.map(i => blocks[i]).join(`<div class="cad-gap"></div>`)}</div>`
    ).join("");
    return `
      <div class="cad-sheet" style="font-size:${fontPx}px;width:${pageW}em;height:${DOC.pageH}em">
        <div class="cad-page-header">${escapeHtml(caderno.pageHeader)}</div>
        <div class="cad-page-body">
          ${pi === 0 && titleHtml ? `${titleHtml}<div class="cad-title-gap"></div>` : ""}
          <div class="cad-cols cad-cols-${cols}" style="height:${pg.cap}em">${colsHtml}</div>
        </div>
        <div class="cad-page-footer">${escapeHtml(caderno.pageFooter)}</div>
      </div>`;
  }).join("");

  const legChips = n > 1 ? `
    <div class="leg-chips">
      <span class="leg-chips-lbl">Perna</span>
      ${Array.from({ length: n }, (_, i) => {
        const l = i + 1;
        const done = steps.filter(s => s.leg === l).every(s => getPhaseProgress(s.phase, state, s.stepId).isComplete);
        return `<button class="leg-chip${done ? " done" : ""}${l === leg ? " cur" : ""}" data-action="overview-leg" data-leg="${l}">${l}</button>`;
      }).join("")}
    </div>` : "";

  return `
    <div class="pdf-view-page">
      <div class="pdf-topbar">
        <div class="pdf-topbar-info">
          <div class="pdf-doc-kicker">Caderno ${escapeHtml(caderno.version)} • ${escapeHtml(fleet.heading)}</div>
          <div class="pdf-doc-mission">${escapeHtml(getProfileLabel())}</div>
          <div class="pdf-doc-kicker">${reg ? `${escapeHtml(reg)} • ` : ""}${n > 1 ? `Perna ${leg}/${n} • ` : ""}Toque num checklist para abrir</div>
        </div>
        ${legChips}
      </div>
      <div class="pdf-body cad-doc">
        ${pagesHtml}
      </div>
      ${renderBottomBar()}
    </div>
  `;
}

function renderChecklistPage() {
  const step = selectedStep();
  if (!step) return `<div class="pdf-view-page"><div class="empty-state">Nenhuma checklist.</div></div>`;

  const steps = getMissionSteps();
  const fleet = flightFleet();
  const n = clampLandings(state.landings);
  const fi = steps.findIndex(s => s.stepId === step.stepId);
  const progress = getPhaseProgress(step.phase, state, step.stepId);
  const { phase, leg } = step;
  const legIdx = leg - 1;
  const ft = state.flightTimes || { acionamento: null, decolagens: [], pousos: [], corte: null };

  // The table cells stay exactly as in the caderno; item state is marked in
  // the margins, outside the table: ▶ next item on the left, ✓ / ⚠ on the right.
  const rows = phase.items.map((item, i) => {
    const status = getItemStatus(phase, item, state, step.stepId);
    const mark = status === "completed" ? "✓" : status === "skipped" ? "⚠" : "";
    return `<button class="cad-row cad-row-tap cad-z${i % 2} ${status}" data-action="toggle-item" data-item-id="${escapeHtml(item.id)}">
      <span class="cad-mk cad-mk-l">${status === "active" ? "▶" : ""}</span>
      <span class="cad-ch">${escapeHtml(item.challenge)}</span>
      <span class="cad-rs">${escapeHtml(item.response)}</span>
      <span class="cad-mk cad-mk-r">${mark}</span>
    </button>`;
  });

  // Optional timing markers (Configurações → Marcação de tempos)
  if (settings.timingEnabled) {
    if (phase.id === "before-start")
      rows.push(renderTimingMarker("acionamento", "ACIONAMENTO", ft.acionamento));
    if (phase.id === "before-takeoff")
      rows.push(renderTimingMarker("decolagem", "DECOLAGEM", ft.decolagens[legIdx] ?? null, legIdx));
    if (phase.id === "after-landing")
      rows.unshift(renderTimingMarker("pouso", "POUSO", ft.pousos[legIdx] ?? null, legIdx));
    if (phase.id === "shut-down")
      rows.push(renderTimingMarker("corte", "CORTE", ft.corte));
  }

  const completionBanner = progress.isComplete ? `
    <div class="group-complete-banner">
      <div class="gcb-inner">
        <div class="gcb-check">✓</div>
        <div class="gcb-text">
          <div class="gcb-title">${escapeHtml(phase.title)} — CONCLUÍDO</div>
          <div class="gcb-sub">${escapeHtml(phase.complete)}</div>
        </div>
        <button class="gcb-btn" data-action="nav-next">Próximo →</button>
      </div>
    </div>
  ` : "";

  return `
    <div class="pdf-view-page">
      <div class="pdf-topbar pdf-topbar-detail">
        <button class="pdfd-back-btn" data-action="nav-doc">← Caderno</button>
        <div class="pdf-topbar-info">
          <div class="pdf-doc-kicker">${fi + 1}/${steps.length} • ${escapeHtml(fleet.name)}${n > 1 ? ` • Perna ${leg}/${n}` : ""}</div>
          <div class="pdfd-detail-prog">${progress.done}/${progress.total} itens${progress.isComplete ? " ✓" : ""}</div>
          <div class="pdfd-detail-progbar"><div class="pdfd-detail-progfill" style="width:${progress.percent}%"></div></div>
        </div>
      </div>
      <div class="pdf-body cad-detail" style="padding-bottom:calc(var(--bar-h) + ${progress.isComplete ? "88px" : "20px"})">
        <div class="cad-detail-sheet">
          <div class="cad-page-header">${escapeHtml(caderno.pageHeader)}</div>
          <div class="cad-fleet-heading">${escapeHtml(fleet.heading)}</div>
          <div class="cad-table">
            <div class="cad-hdr">${escapeHtml(phaseHeader(phase))}</div>
            <div class="cad-trigger">Gatilho: ${escapeHtml(phase.trigger)}</div>
            ${rows.join("")}
            <div class="cad-complete">► ${escapeHtml(phase.complete)}</div>
          </div>
          <div class="cad-page-footer">${escapeHtml(caderno.pageFooter)}</div>
        </div>
      </div>
      ${completionBanner}
      ${renderBottomBar()}
    </div>
  `;
}

// ─── App screens ──────────────────────────────────────────────────────────

function renderBottomBar() {
  const isGroupsView = currentView === "groups";
  const onChecklist = currentView === "checklist";
  const currentStep = getCurrentStep();
  const onCurrent = onChecklist && currentStep?.stepId === state.selectedStepId;

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
      <button class="bottom-btn ${onCurrent ? "bb-active" : ""}" data-action="nav-current" title="Grupo atual">
        ${ICON_CURRENT}
        <span class="bottom-label">Atual</span>
      </button>
      <button class="bottom-btn ${isGroupsView && viewMode === "cockpit" ? "bb-active" : ""}" data-action="nav-groups" title="Grupos">
        ${ICON_GRID}
        <span class="bottom-label">Grupos</span>
      </button>
      <button class="bottom-btn ${isGroupsView && viewMode === "doc" ? "bb-active" : ""}" data-action="nav-doc" title="Caderno de checklists">
        ${ICON_DOC}
        <span class="bottom-label">Caderno</span>
      </button>
    </nav>
  `;
}

// Summary of how the landings split the flight into legs
function renderLegPlan(n) {
  const fleet = settingsFleet();
  const range = (leg, label) => {
    const ids = legPhaseIds(leg, n);
    const first = fleet.phases.find(p => p.id === ids[0]);
    const last = fleet.phases.find(p => p.id === ids[ids.length - 1]);
    return `<div class="leg-plan-row">
      <span class="leg-plan-num">${label}</span>
      <span class="leg-plan-range">${escapeHtml(first.title)} → ${escapeHtml(last.title)}</span>
      <span class="leg-plan-count">${ids.length} grupos</span>
    </div>`;
  };
  if (n === 1) return range(1, "Perna única");
  const rows = [range(1, "Perna 1")];
  if (n === 3) rows.push(range(2, "Perna 2"));
  if (n > 3) rows.push(range(2, `Pernas 2–${n - 1}`));
  rows.push(range(n, `Perna ${n}`));
  return rows.join("");
}

function renderInitialScreen() {
  const hasFlight = !!state.fleetId && !state.completedAt;
  const fleet = settingsFleet();
  const log = loadFlightLog();
  const n = clampLandings(landingsDraft);
  const totalGroups = buildFlightSteps(fleet.id, n).length;

  const historyRows = log.slice(0, 10).map(entry => `
      <div class="history-entry">
        <span class="history-type">${escapeHtml(getFleet(entry.fleetId).name)}</span>
        <span class="history-reg">${escapeHtml(entry.registration || "—")}</span>
        <span class="history-date">${formatDate(entry.completedAt)} • ${landingsText(clampLandings(entry.landings))}</span>
        <span class="history-dur">${formatDuration(entry.durationMs)}</span>
        <button class="history-pdf" data-action="export-pdf" data-flight-id="${escapeHtml(entry.id)}">PDF</button>
      </div>
    `).join("");

  const fleetHint = hasFlight && state.fleetId !== fleet.id
    ? `<div class="settings-hint">Voo em andamento continua na frota ${escapeHtml(getFleet(state.fleetId).name)}. ${escapeHtml(fleet.name)} vale a partir do próximo voo.</div>`
    : "";

  return `
    <div class="initial-screen">
      <div class="initial-inner">
        <div class="initial-toprow">
          <div class="initial-brand">
            <div class="brand-title">Checklist OMNI</div>
            <div class="initial-sub">Frota ${escapeHtml(fleet.name)} • Caderno unificado ${escapeHtml(caderno.version)}</div>
          </div>
          <div class="toprow-actions">
            <button class="night-toggle-btn" data-action="toggle-night" title="${settings.nightMode ? "Modo dia" : "Modo noite"}">
              ${settings.nightMode ? ICON_SUN : ICON_MOON}
            </button>
            <button class="settings-gear-btn${settingsOpen ? " settings-gear-open" : ""}" data-action="toggle-settings" title="Configurações">⚙</button>
          </div>
        </div>

        ${settingsOpen ? `
        <div class="settings-panel">
          <div class="settings-row">
            <label class="settings-row-label" for="fleet-select">Modelo de aeronave</label>
            <select id="fleet-select" class="fleet-select" data-action="select-fleet">
              ${caderno.fleets.map(f => `<option value="${escapeHtml(f.id)}"${f.id === fleet.id ? " selected" : ""}>${escapeHtml(f.name)}</option>`).join("")}
            </select>
          </div>
          ${fleetHint}
          <div class="settings-divider"></div>
          <div class="settings-row">
            <span class="settings-row-label">Barreiras de avanço</span>
            <button class="sw-toggle${settings.barriersDisabled ? "" : " sw-on"}" data-action="toggle-barriers" role="switch" aria-checked="${!settings.barriersDisabled}">
              <span class="sw-thumb"></span>
            </button>
          </div>
          <div class="settings-divider"></div>
          <div class="settings-row">
            <span class="settings-row-label">Marcação de tempos</span>
            <button class="sw-toggle${settings.timingEnabled ? " sw-on" : ""}" data-action="toggle-timing" role="switch" aria-checked="${settings.timingEnabled}">
              <span class="sw-thumb"></span>
            </button>
          </div>
          <div class="settings-divider"></div>
          <div class="settings-row">
            <span class="settings-row-label">Cores nos itens marcados</span>
            <button class="sw-toggle${settings.rowColors ? " sw-on" : ""}" data-action="toggle-row-colors" role="switch" aria-checked="${settings.rowColors}">
              <span class="sw-thumb"></span>
            </button>
          </div>
        </div>
        ` : ""}

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

        <div class="reg-field">
          <label class="reg-label" for="remarks-input">Observações</label>
          <input type="text" id="remarks-input" class="reg-input remarks-input"
            value="${escapeHtml(state.flightRemarks || '')}"
            placeholder="Nº do voo, rota…"
            maxlength="60"
            autocomplete="off"
            spellcheck="false">
        </div>

        ${hasFlight ? `
          <button class="continue-flight-btn" data-action="continue-flight">
            ← Continuar voo ${escapeHtml(getProfileLabel())}
          </button>
        ` : ""}

        <div class="initial-section-label">Iniciar voo</div>
        <div class="start-card">
          <div class="start-row">
            <div>
              <div class="start-label">Quantidade de pousos</div>
              <div class="start-sub">${escapeHtml(fleet.heading)} • ${totalGroups} grupos</div>
            </div>
            <div class="landings-stepper">
              <button class="leg-stepper" data-action="landings-dec" ${n <= 1 ? "disabled" : ""} aria-label="Menos pousos">−</button>
              <span class="leg-stepper-val">${n}</span>
              <button class="leg-stepper" data-action="landings-inc" ${n >= MAX_LANDINGS ? "disabled" : ""} aria-label="Mais pousos">+</button>
            </div>
          </div>
          <div class="leg-plan">${renderLegPlan(n)}</div>
          <button class="start-btn" data-action="start-flight">Iniciar voo →</button>
        </div>

        ${settings.timingEnabled ? renderFlightTimesSection() : ""}

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

// ─── Cockpit groups page (cards) ────────────────────────────────────────────

function renderGroupsPage() {
  if (viewMode === "doc") return renderDocPage();

  const steps = getMissionSteps();
  const n = clampLandings(state.landings);
  const doneCount = steps.filter(s => getPhaseProgress(s.phase, state, s.stepId).isComplete).length;
  const reg = state.flightRegistration || settings.registration;

  const cardsHtml = steps.map((step, idx) => {
    const progress = getPhaseProgress(step.phase, state, step.stepId);
    const isActive = step.stepId === state.selectedStepId;
    const isLocked = !isStepAccessible(steps, idx);
    const legLabel = n > 1 && (idx === 0 || steps[idx - 1].leg !== step.leg)
      ? `<div class="groups-section-label section-normal">PERNA ${step.leg}/${n}</div>`
      : "";
    return `${legLabel}
      <button class="group-card${progress.isComplete ? " complete" : ""}${isActive ? " active-group" : ""}${isLocked ? " locked" : ""}"
        data-action="select-step" data-step-id="${escapeHtml(step.stepId)}"${isLocked ? ' disabled aria-disabled="true"' : ""}>
        <div class="group-card-num">${isLocked ? "🔒" : idx + 1}</div>
        <div class="group-card-title">${escapeHtml(step.phase.title)}</div>
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
        <div>
          <div class="brand-title">${escapeHtml(getProfileLabel())}</div>
          <div class="groups-meta">
            ${reg ? `<span class="groups-reg">${escapeHtml(reg)}</span> • ` : ""}
            ${doneCount}/${steps.length} grupos concluídos
          </div>
        </div>
      </header>
      <div class="groups-grid">${cardsHtml}</div>
      ${renderBottomBar()}
    </div>
  `;
}

function renderCompletion() {
  const steps = getMissionSteps();
  const totalGroups = steps.length;
  const totalItems = steps.reduce((s, step) => s + step.phase.items.filter(i => i.required !== false).length, 0);
  const doneGroups = steps.filter(s => getPhaseProgress(s.phase, state, s.stepId).isComplete).length;
  const doneItems = steps.reduce((s, step) => {
    const done = new Set(state.completed?.[step.stepId] || []);
    return s + step.phase.items.filter(i => i.required !== false && done.has(i.id)).length;
  }, 0);
  const durationMs = state.flightSessionStartedAt && state.completedAt
    ? new Date(state.completedAt) - new Date(state.flightSessionStartedAt) : 0;
  const reg = state.flightRegistration || settings.registration;
  const log = loadFlightLog();
  const currentEntry = log[0];

  const logRows = log.slice(0, 6).map((entry, i) => `
      <div class="log-entry ${i === 0 ? "current-entry" : ""}">
        <span class="log-type">${escapeHtml(getFleet(entry.fleetId).name)}</span>
        <span class="log-date">${formatDate(entry.completedAt)}</span>
        <span class="log-duration">${formatDuration(entry.durationMs)}</span>
        <span class="log-items">${entry.doneItems ?? entry.totalItems}/${entry.totalItems} itens</span>
        <button class="log-pdf-btn" data-action="export-pdf" data-flight-id="${escapeHtml(entry.id)}">PDF</button>
      </div>
    `).join("");

  return `
    <div class="completion-screen">
      <div class="completion-inner">
        <div class="completion-icon">✓</div>
        <h1 class="completion-title">VOO CONCLUÍDO</h1>
        <div class="completion-meta">
          ${reg ? `<strong>${escapeHtml(reg)}</strong> • ` : ""}${escapeHtml(getProfileLabel())} • Caderno ${escapeHtml(caderno.version)} • ${formatDate(state.completedAt)}
          ${state.flightRemarks ? `<br><span class="completion-remarks">${escapeHtml(state.flightRemarks)}</span>` : ""}
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${formatDuration(durationMs)}</div>
            <div class="stat-label">Duração</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${doneGroups}/${totalGroups}</div>
            <div class="stat-label">Grupos</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${doneItems}/${totalItems}</div>
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

function isDocOverview() {
  return !!state.fleetId && !showingInitial && !state.completedAt &&
    currentView === "groups" && viewMode === "doc";
}

function render() {
  if (!state.fleetId || showingInitial) {
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
    btn.addEventListener("click", e => {
      e.stopPropagation();
      selectStep(btn.dataset.stepId);
    });
  });

  document.querySelectorAll("[data-action='overview-leg']").forEach(btn => {
    btn.addEventListener("click", () => {
      overviewLeg = parseInt(btn.dataset.leg, 10);
      render();
    });
  });

  document.querySelectorAll("[data-action='toggle-item']").forEach(btn => {
    btn.addEventListener("click", () => handleToggleItem(btn.dataset.itemId));
  });

  document.querySelectorAll("[data-action='export-pdf']").forEach(btn => {
    btn.addEventListener("click", () => generateFlightPDF(btn.dataset.flightId));
  });

  document.querySelector("[data-action='nav-home']")?.addEventListener("click", handleHome);
  document.querySelector("[data-action='nav-reset-group']")?.addEventListener("click", handleResetGroupFromBar);
  document.querySelector("[data-action='nav-current']")?.addEventListener("click", handleGoCurrent);
  document.querySelectorAll("[data-action='nav-groups']").forEach(btn =>
    btn.addEventListener("click", handleShowGroups)
  );
  document.querySelectorAll("[data-action='nav-doc']").forEach(btn =>
    btn.addEventListener("click", handleShowDoc)
  );
  document.querySelector("[data-action='nav-next']")?.addEventListener("click", handleNextFromBar);
  document.querySelector("[data-action='continue-flight']")?.addEventListener("click", handleContinueFlight);
  document.querySelector("[data-action='review-checklist']")?.addEventListener("click", handleReviewChecklist);
  document.querySelector("[data-action='reset-all']")?.addEventListener("click", handleResetAll);
  document.querySelector("[data-action='toggle-night']")?.addEventListener("click", handleToggleNightMode);
  document.querySelector("[data-action='start-flight']")?.addEventListener("click", handleStartFlight);

  const reRenderInitial = () => { app.innerHTML = renderInitialScreen(); bindEvents(); };

  document.querySelector("[data-action='toggle-settings']")?.addEventListener("click", () => {
    settingsOpen = !settingsOpen;
    reRenderInitial();
  });
  document.querySelector("[data-action='select-fleet']")?.addEventListener("change", e => {
    settings = { ...settings, fleetId: e.target.value };
    saveSettings(settings);
    reRenderInitial();
  });
  document.querySelector("[data-action='toggle-barriers']")?.addEventListener("click", () => {
    settings = { ...settings, barriersDisabled: !settings.barriersDisabled };
    saveSettings(settings);
    reRenderInitial();
  });
  document.querySelector("[data-action='toggle-timing']")?.addEventListener("click", () => {
    settings = { ...settings, timingEnabled: !settings.timingEnabled };
    saveSettings(settings);
    reRenderInitial();
  });
  document.querySelector("[data-action='toggle-row-colors']")?.addEventListener("click", () => {
    settings = { ...settings, rowColors: !settings.rowColors };
    document.body.classList.toggle("row-colors", settings.rowColors);
    saveSettings(settings);
    reRenderInitial();
  });
  document.querySelector("[data-action='landings-dec']")?.addEventListener("click", () => {
    landingsDraft = clampLandings(landingsDraft - 1);
    reRenderInitial();
  });
  document.querySelector("[data-action='landings-inc']")?.addEventListener("click", () => {
    landingsDraft = clampLandings(landingsDraft + 1);
    reRenderInitial();
  });
  // Note: mark-time clicks are handled by a single delegated listener on `app`
  // (see bottom of file) so they work reliably across checklist re-renders.
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .catch(err => console.warn("Service worker registration failed", err));
  });
}

// Global delegation for mark-time — works even when checklist re-renders
app.addEventListener("click", e => {
  const btn = e.target.closest("[data-action='mark-time']");
  if (btn) handleMarkTime(btn.dataset.marker, parseInt(btn.dataset.leg, 10));
});

// The caderno pages are laid out for the current width — redo the
// pagination when it changes (rotation, split view).
let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (isDocOverview() && document.documentElement.clientWidth !== lastDocWidth) render();
  }, 150);
});

render();
