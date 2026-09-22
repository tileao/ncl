// Generated from "caderno-checklists-frota-omni-padronizado-v7.docx" by tools/build-fleets.py.
// Text is reproduced verbatim from the document — do not edit by hand.
export const caderno = {
  "title": "CADERNO UNIFICADO DE CHECKLISTS NORMAIS",
  "subtitle": "Padronização Operacional da Frota (7 Frotas) — OMNI Táxi Aéreo",
  "notes": ["MÉTODOS DE EXECUÇÃO:  C/R = Challenge and Response (Desafio e Resposta)  |  R/D = Read and Do (Ler e Fazer - exclusivo para Before Start)", "GATILHOS PADRONIZADOS: Altitude de tráfego (500 ft / 700 ft noturno) & Aproximações/Descidas a 5 NM"],
  "pageHeader": "OMNI TÁXI AÉREO — CADERNO DE CHECKLISTS NORMAIS",
  "pageFooter": "Padronização Operacional de Voo — ",
  "source": "caderno-checklists-frota-omni-padronizado-v7.docx",
  "version": "v7",
  "defaultFleetId": "aw139",
  "fleets": [
    {
      "id": "h160", "name": "H-160", "heading": "FROTA H-160",
      "phases": [
        {
          "id": "preflight", "title": "PREFLIGHT", "method": "C/R",
          "trigger": "Entrada do PM após briefing dos PAX.",
          "complete": "Checklist complete. Standby Before Start",
          "items": [
            { "id": "h160-preflight-01", "challenge": "Dtd", "response": "Card Inserted / Flap Closed" },
            { "id": "h160-preflight-02", "challenge": "Collective Pitch", "response": "Locked" },
            { "id": "h160-preflight-03", "challenge": "Static / Shed / Rlg", "response": "Condition Checked" },
            { "id": "h160-preflight-04", "challenge": "Bat 1 + Bat 2", "response": "On" },
            { "id": "h160-preflight-05", "challenge": "Gen 1 + Gen 2 + Emerg. Gen", "response": "On" },
            { "id": "h160-preflight-06", "challenge": "Lamp / Audio Test", "response": "Audible / All Illuminated" },
            { "id": "h160-preflight-07", "challenge": "Eng. Oil Level and Temp", "response": "Checked" },
            { "id": "h160-preflight-08", "challenge": "Dispatch", "response": "Checked" },
            { "id": "h160-preflight-09", "challenge": "Fuel Quantity", "response": "Confirm ____ kg" },
            { "id": "h160-preflight-10", "challenge": "Weight Data", "response": "Enter / Validated" },
            { "id": "h160-preflight-11", "challenge": "Hdg", "response": "Compare with Stby Compass" },
            { "id": "h160-preflight-12", "challenge": "Dh", "response": "1000 ft" },
            { "id": "h160-preflight-13", "challenge": "Altimeters (+Iesi)", "response": "Set / Xchecked" },
            { "id": "h160-preflight-14", "challenge": "Htaws", "response": "On" },
            { "id": "h160-preflight-15", "challenge": "Wx Radar", "response": "Stby" },
            { "id": "h160-preflight-16", "challenge": "Oei Rating", "response": "Hi / Lo / Ct / Hi" },
            { "id": "h160-preflight-17", "challenge": "Flight Controls", "response": "Checked / Then Coll. Locked" },
            { "id": "h160-preflight-18", "challenge": "Wx Radar (If GPU Connected – Test)", "response": "Stby" },
            { "id": "h160-preflight-19", "challenge": "Acas / Radios", "response": "Test All" },
            { "id": "h160-preflight-20", "challenge": "Emrg. Exit", "response": "Armed" }
          ]
        },
        {
          "id": "before-start", "title": "BEFORE START", "method": "R/D",
          "trigger": "Preflight completo, cabine/cockpit prontos e autorização obtida.",
          "complete": "Checklist complete. Standby After Start",
          "items": [
            { "id": "h160-before-start-01", "challenge": "Anti Coll. / Lights", "response": "Red / On" },
            { "id": "h160-before-start-02", "challenge": "Batt Voltage (> 23)", "response": "Check Voltage ____" }
          ]
        },
        {
          "id": "after-start", "title": "AFTER START", "method": "C/R",
          "trigger": "Partida completa dos motores, parâmetros normais/estabilizados e GPU desconectada.",
          "complete": "Checklist complete. Standby Before Taxi",
          "items": [
            { "id": "h160-after-start-01", "challenge": "Gpu (If Connected)", "response": "Off / Disconnected" },
            { "id": "h160-after-start-02", "challenge": "Rlg", "response": "Off / Guarded" },
            { "id": "h160-after-start-03", "challenge": "Floats", "response": "Area Clear / Test / Off" },
            { "id": "h160-after-start-04", "challenge": "Collective Pitch", "response": "Unlock / Reduce Min" },
            { "id": "h160-after-start-05", "challenge": "Pre-Flight / RA Test", "response": "Perform" },
            { "id": "h160-after-start-06", "challenge": "Collective Pitch", "response": "Reduce Min / Locked" }
          ]
        },
        {
          "id": "before-taxi", "title": "BEFORE TAXI", "method": "C/R",
          "trigger": "After Start completo, portas/passageiros prontos e intenção de táxi.",
          "complete": "Checklist complete. Standby Before Takeoff",
          "items": [
            { "id": "h160-before-taxi-01", "challenge": "Eng 1 + Eng 2", "response": "Flight / Guarded" },
            { "id": "h160-before-taxi-02", "challenge": "Master List / Dispatch", "response": "Checked" },
            { "id": "h160-before-taxi-03", "challenge": "Atc", "response": "Cleared" },
            { "id": "h160-before-taxi-04", "challenge": "Nose Wheel", "response": "Unlocked" },
            { "id": "h160-before-taxi-05", "challenge": "Park Brake", "response": "Off" },
            { "id": "h160-before-taxi-06", "challenge": "Brakes Test (Collective Full Down)", "response": "Perform" },
            { "id": "h160-before-taxi-07", "challenge": "Hsi Hdg / Compass (After Turn)", "response": "Aligned" }
          ]
        },
        {
          "id": "before-takeoff", "title": "BEFORE TAKEOFF", "method": "C/R",
          "trigger": "Onshore: Linha de parada/pista. Offshore: Helideck e passageiros prontos.",
          "complete": "Checklist complete. Standby After Takeoff",
          "items": [
            { "id": "h160-before-takeoff-01", "challenge": "Eng 1 / Eng 2", "response": "Flight / Guarded" },
            { "id": "h160-before-takeoff-02", "challenge": "Nr Hi", "response": "A/R" },
            { "id": "h160-before-takeoff-03", "challenge": "Dh", "response": "Adjust _____ ft" },
            { "id": "h160-before-takeoff-04", "challenge": "Fuel", "response": "Check Endurance" },
            { "id": "h160-before-takeoff-05", "challenge": "Float", "response": "A/R" },
            { "id": "h160-before-takeoff-06", "challenge": "Brake", "response": "A/R" },
            { "id": "h160-before-takeoff-07", "challenge": "Radar", "response": "A/R" },
            { "id": "h160-before-takeoff-08", "challenge": "Alt. A", "response": "Adjusted" },
            { "id": "h160-before-takeoff-09", "challenge": "Transponder", "response": "Activated" },
            { "id": "h160-before-takeoff-10", "challenge": "Ldg Anti Coll", "response": "White" },
            { "id": "h160-before-takeoff-11", "challenge": "Light", "response": "A/R" },
            { "id": "h160-before-takeoff-12", "challenge": "Alph", "response": "Thumbs Up" },
            { "id": "h160-before-takeoff-13", "challenge": "Takeoff Briefing", "response": "Perform" }
          ]
        },
        {
          "id": "after-takeoff", "title": "AFTER TAKEOFF", "method": "C/R",
          "trigger": "Cruzando 500 ft AGL e livre de tráfego/obstáculos.",
          "complete": "Checklist complete. Standby Cruise",
          "items": [
            { "id": "h160-after-takeoff-01", "challenge": "Radar", "response": "On" },
            { "id": "h160-after-takeoff-02", "challenge": "Nose Wheel", "response": "Unlocked" },
            { "id": "h160-after-takeoff-03", "challenge": "L/G", "response": "Up" },
            { "id": "h160-after-takeoff-04", "challenge": "Park Brake", "response": "Off" },
            { "id": "h160-after-takeoff-05", "challenge": "Compass", "response": "MG" },
            { "id": "h160-after-takeoff-06", "challenge": "Nr Hi", "response": "Off" }
          ]
        },
        {
          "id": "cruise", "title": "CRUISE", "method": "C/R",
          "trigger": "Nivelado na altitude de cruzeiro e estabilizado em rota.",
          "complete": "Checklist complete. Standby Descent",
          "items": [
            { "id": "h160-cruise-01", "challenge": "Afcs Upper Modes", "response": "Coupled" },
            { "id": "h160-cruise-02", "challenge": "Htaws Mode", "response": "Set" },
            { "id": "h160-cruise-03", "challenge": "Ldg Light", "response": "Off" },
            { "id": "h160-cruise-04", "challenge": "Fuel Quantity", "response": "Monitor" }
          ]
        },
        {
          "id": "descent", "title": "DESCENT", "method": "C/R",
          "trigger": "A 5 NM do TOD (FMS) ou autorização de descida ATC.",
          "complete": "Checklist complete. Standby Landing",
          "items": [
            { "id": "h160-descent-01", "challenge": "Altimeters (+Iesi)", "response": "Set" },
            { "id": "h160-descent-02", "challenge": "Da / Dh", "response": "Adjust _____ ft" },
            { "id": "h160-descent-03", "challenge": "Htaws Mode", "response": "Set A/R" },
            { "id": "h160-descent-04", "challenge": "Cr. Ht", "response": "Set A/R" },
            { "id": "h160-descent-05", "challenge": "Ldg Light", "response": "On" }
          ]
        },
        {
          "id": "landing", "title": "LANDING", "method": "C/R",
          "trigger": "Onshore/Offshore: A 5 NM do destino, na altitude de tráfego.",
          "complete": "Checklist complete. Standby After Landing",
          "items": [
            { "id": "h160-landing-01", "challenge": "Nr Hi", "response": "A/R" },
            { "id": "h160-landing-02", "challenge": "Dh", "response": "A/R" },
            { "id": "h160-landing-03", "challenge": "Dg", "response": "Set Only Offshore" },
            { "id": "h160-landing-04", "challenge": "Park Brake", "response": "Set A/R" },
            { "id": "h160-landing-05", "challenge": "L/G", "response": "Down (3 Greens)" },
            { "id": "h160-landing-06", "challenge": "Nose Wheel", "response": "A/R" },
            { "id": "h160-landing-07", "challenge": "Float", "response": "A/R" },
            { "id": "h160-landing-08", "challenge": "Radar", "response": "A/R" },
            { "id": "h160-landing-09", "challenge": "Alt. A", "response": "Adjust _____ ft" },
            { "id": "h160-landing-10", "challenge": "Landing Briefing", "response": "Perform" },
            { "id": "h160-landing-11", "challenge": "Landing Area", "response": "Green Deck" }
          ]
        },
        {
          "id": "after-landing", "title": "AFTER LANDING", "method": "C/R",
          "trigger": "Onshore: Pista livre. Offshore: Pousado, coletivo embaixo e equalizado.",
          "complete": "Checklist complete. Standby Shut Down",
          "items": [
            { "id": "h160-after-landing-01", "challenge": "Afcs Upper Mode", "response": "Disengage" },
            { "id": "h160-after-landing-02", "challenge": "Flight Controls", "response": "Center / Full Down" },
            { "id": "h160-after-landing-03", "challenge": "Collective Pitch", "response": "A/R" },
            { "id": "h160-after-landing-04", "challenge": "Floats", "response": "Off" },
            { "id": "h160-after-landing-05", "challenge": "Radar / Transponder", "response": "Stnd-By" },
            { "id": "h160-after-landing-06", "challenge": "Anti Coll", "response": "A/R" }
          ]
        },
        {
          "id": "shut-down", "title": "SHUT DOWN", "method": "C/R",
          "trigger": "Aeronave estacionada, freio aplicado e calços colocados.",
          "complete": "Checklist complete.",
          "items": [
            { "id": "h160-shut-down-01", "challenge": "Collective Pitch", "response": "Locked" },
            { "id": "h160-shut-down-02", "challenge": "Park Brake", "response": "On" },
            { "id": "h160-shut-down-03", "challenge": "Cyclic / Pedals", "response": "Centered" },
            { "id": "h160-shut-down-04", "challenge": "Eng 1 / Eng 2", "response": "(Idle 2 min)" },
            { "id": "h160-shut-down-05", "challenge": "Ecs", "response": "Off" },
            { "id": "h160-shut-down-06", "challenge": "Eng 1 / Eng 2", "response": "Off" }
          ]
        }
      ]
    },
    {
      "id": "s92", "name": "S-92", "heading": "FROTA S-92",
      "phases": [
        {
          "id": "preflight", "title": "PREFLIGHT", "method": "C/R",
          "trigger": "Tripulação técnica sentada e ajustada no cockpit (pós-scanflow).",
          "complete": "Checklist complete. Standby Before Start",
          "items": [
            { "id": "s92-preflight-01", "challenge": "Cockpit Preparation & Scan Flow", "response": "Completed" },
            { "id": "s92-preflight-02", "challenge": "Parking Brake", "response": "Reset / On" },
            { "id": "s92-preflight-03", "challenge": "EFBs / Documents", "response": "Onboard" }
          ]
        },
        {
          "id": "before-start", "title": "BEFORE START", "method": "R/D",
          "trigger": "Preflight completo, preparação de cabine/cockpit finalizada e autorização obtida.",
          "complete": "Checklist complete. Standby After Start",
          "items": [
            { "id": "s92-before-start-01", "challenge": "Battery Switch", "response": "On" },
            { "id": "s92-before-start-02", "challenge": "Fuel Qty", "response": "Check" },
            { "id": "s92-before-start-03", "challenge": "HUMS Data Card", "response": "Installed" },
            { "id": "s92-before-start-04", "challenge": "Ext Lights", "response": "A/R" },
            { "id": "s92-before-start-05", "challenge": "Fire Det", "response": "Test" },
            { "id": "s92-before-start-06", "challenge": "APU Control & APU Gen", "response": "On" },
            { "id": "s92-before-start-07", "challenge": "ECS", "response": "Vent" },
            { "id": "s92-before-start-08", "challenge": "MFDs Overlays", "response": "Adjusted" },
            { "id": "s92-before-start-09", "challenge": "RTUs", "response": "Tuned" },
            { "id": "s92-before-start-10", "challenge": "FMS, FM, WX Radar", "response": "On / Stby" },
            { "id": "s92-before-start-11", "challenge": "Backup Att Ind", "response": "Test Then Arm" },
            { "id": "s92-before-start-12", "challenge": "Fire Det, PB Lamp, Flt Ctrl, AFCS, LDI, CVR/FDR, EGPWS, TCAS", "response": "Test" },
            { "id": "s92-before-start-13", "challenge": "Flotation, Life Raft (DSC)", "response": "Test" },
            { "id": "s92-before-start-14", "challenge": "MGB Pressure System (OBE)", "response": "Check" },
            { "id": "s92-before-start-15", "challenge": "Aux Fuel Panel", "response": "All Open and Off" }
          ]
        },
        {
          "id": "after-start", "title": "AFTER START", "method": "C/R",
          "trigger": "Partida completa dos motores, parâmetros normais/estabilizados e GPU desconectada.",
          "complete": "Checklist complete. Standby Before Taxi",
          "items": [
            { "id": "s92-after-start-01", "challenge": "Throttles and Fuel", "response": "Fly / Direct" },
            { "id": "s92-after-start-02", "challenge": "AC GEN #2 (2 Sec) Then #1", "response": "On" },
            { "id": "s92-after-start-03", "challenge": "VIB CTRL", "response": "On" },
            { "id": "s92-after-start-04", "challenge": "APU Ctrl – (If SID IMC)", "response": "Off / On" },
            { "id": "s92-after-start-05", "challenge": "Air Source Heat", "response": "Eng" }
          ]
        },
        {
          "id": "before-taxi", "title": "BEFORE TAXI", "method": "C/R",
          "trigger": "After Start completo, portas/passageiros prontos e intenção de táxi.",
          "complete": "Checklist complete. Standby Before Takeoff",
          "items": [
            { "id": "s92-before-taxi-01", "challenge": "Cockpit Setup (MFD/DCP/TCAS/NAV-AIDS)", "response": "Set / Xcheck" },
            { "id": "s92-before-taxi-02", "challenge": "Emerg / Heels Lights", "response": "Arm" },
            { "id": "s92-before-taxi-03", "challenge": "Backup Att Ind", "response": "Uncage" },
            { "id": "s92-before-taxi-04", "challenge": "EICAS Parameters", "response": "Green and Fuel Qty" },
            { "id": "s92-before-taxi-05", "challenge": "Altimeters, FMS Flight Plan", "response": "Set / Xcheck" },
            { "id": "s92-before-taxi-06", "challenge": "Door / Ramp", "response": "Secured" },
            { "id": "s92-before-taxi-07", "challenge": "Compass / Heading", "response": "Slaved / Xcheck" },
            { "id": "s92-before-taxi-08", "challenge": "Area / Chocks", "response": "Clear / Removed / Thumbs Up" },
            { "id": "s92-before-taxi-09", "challenge": "Takeoff Briefing – (VFR / IFR)", "response": "Completed" },
            { "id": "s92-before-taxi-10", "challenge": "Taxi Clearance and Transponder", "response": "Request" },
            { "id": "s92-before-taxi-11", "challenge": "Cabin Lights", "response": "A/R" },
            { "id": "s92-before-taxi-12", "challenge": "Landing Lights", "response": "On" },
            { "id": "s92-before-taxi-13", "challenge": "HISL Strobe Lts", "response": "A/R" },
            { "id": "s92-before-taxi-14", "challenge": "Parking Brake", "response": "Released, No Advisory" }
          ]
        },
        {
          "id": "before-takeoff", "title": "BEFORE TAKEOFF", "method": "C/R",
          "trigger": "Onshore: Linha de parada/pista. Offshore: Helideck e passageiros prontos.",
          "complete": "Checklist complete. Standby After Takeoff",
          "items": [
            { "id": "s92-before-takeoff-01", "challenge": "Throttles and Fuel", "response": "Fly & Direct" },
            { "id": "s92-before-takeoff-02", "challenge": "Heading Bugs / Course Selectors", "response": "Set" },
            { "id": "s92-before-takeoff-03", "challenge": "Cautions / Warnings / Advisories", "response": "Checked" },
            { "id": "s92-before-takeoff-04", "challenge": "AFCS", "response": "All Green / Att / FD #1 or #2" },
            { "id": "s92-before-takeoff-05", "challenge": "Weather Radar", "response": "On / Test (A/R)" },
            { "id": "s92-before-takeoff-06", "challenge": "Flight Attendant Briefing", "response": "A/R" },
            { "id": "s92-before-takeoff-07", "challenge": "Door / Ramp (Offshore)", "response": "Secured" },
            { "id": "s92-before-takeoff-08", "challenge": "Area / Chocks (Offshore)", "response": "Clear / Thumbs Up" },
            { "id": "s92-before-takeoff-09", "challenge": "AC GEN #2 Then #1 / VIB CTRL", "response": "On" },
            { "id": "s92-before-takeoff-10", "challenge": "APU Ctrl", "response": "A/R" },
            { "id": "s92-before-takeoff-11", "challenge": "NAV AIDS / DCP (All References)", "response": "Set" },
            { "id": "s92-before-takeoff-12", "challenge": "All EICAS Parameters", "response": "Green and Fuel Qty" },
            { "id": "s92-before-takeoff-13", "challenge": "Compass / Heading", "response": "Xcheck" },
            { "id": "s92-before-takeoff-14", "challenge": "Takeoff Briefing", "response": "Completed" },
            { "id": "s92-before-takeoff-15", "challenge": "Floats", "response": "Arm" },
            { "id": "s92-before-takeoff-16", "challenge": "Anti-Coll, Pos. and Landing Lights", "response": "On" }
          ]
        },
        {
          "id": "after-takeoff", "title": "AFTER TAKEOFF", "method": "C/R",
          "trigger": "Cruzando 500 ft AGL e livre de tráfego/obstáculos.",
          "complete": "Checklist complete. Standby Cruise",
          "items": [
            { "id": "s92-after-takeoff-01", "challenge": "Landing Gear", "response": "Up" },
            { "id": "s92-after-takeoff-02", "challenge": "FD", "response": "A/R" },
            { "id": "s92-after-takeoff-03", "challenge": "Search Light", "response": "Off / Centered" },
            { "id": "s92-after-takeoff-04", "challenge": "Floats Safe", "response": "≤ 80 KIAS" },
            { "id": "s92-after-takeoff-05", "challenge": "Parking Brake", "response": "A/R" },
            { "id": "s92-after-takeoff-06", "challenge": "Compass / Headings", "response": "A/R" },
            { "id": "s92-after-takeoff-07", "challenge": "HISL Strobe Lts", "response": "A/R" },
            { "id": "s92-after-takeoff-08", "challenge": "WX Radar", "response": "A/R" }
          ]
        },
        {
          "id": "cruise", "title": "CRUISE", "method": "C/R",
          "trigger": "Nivelado na altitude de cruzeiro e estabilizado em rota.",
          "complete": "Checklist complete. Standby Descent",
          "items": [
            { "id": "s92-cruise-01", "challenge": "Landing Lights / APU", "response": "A/R / Off" },
            { "id": "s92-cruise-02", "challenge": "Altimeters", "response": "Set / Xcheck" },
            { "id": "s92-cruise-03", "challenge": "Compass / Headings", "response": "Slaved / Xcheck" },
            { "id": "s92-cruise-04", "challenge": "EPAC", "response": "Perform" },
            { "id": "s92-cruise-05", "challenge": "Cruise Power", "response": "Set" },
            { "id": "s92-cruise-06", "challenge": "VNAV", "response": "Set" },
            { "id": "s92-cruise-07", "challenge": "Aux Fuel Mode Select", "response": "IAFS A/R" },
            { "id": "s92-cruise-08", "challenge": "EICAS Parameters", "response": "Green and Fuel Qty" }
          ]
        },
        {
          "id": "descent", "title": "DESCENT", "method": "C/R",
          "trigger": "A 5 NM do TOD (FMS) ou autorização de descida ATC.",
          "complete": "Checklist complete. Standby Landing",
          "items": [
            { "id": "s92-descent-01", "challenge": "ATIS and Clearance", "response": "Check" },
            { "id": "s92-descent-02", "challenge": "Descent / Approach Briefing (IMC - APU)", "response": "Completed" },
            { "id": "s92-descent-03", "challenge": "FMS / DCPs / Nav Aids", "response": "Set / Xcheck" },
            { "id": "s92-descent-04", "challenge": "EICAS Parameters", "response": "Green and Fuel Qty" },
            { "id": "s92-descent-05", "challenge": "Flight Attendant (ETA)", "response": "A/R" },
            { "id": "s92-descent-06", "challenge": "Landing Lights", "response": "On" },
            { "id": "s92-descent-07", "challenge": "Altimeters", "response": "QNH Set / Xcheck" }
          ]
        },
        {
          "id": "landing", "title": "LANDING", "method": "C/R",
          "trigger": "Onshore/Offshore: A 5 NM do destino, na altitude de tráfego.",
          "complete": "Checklist complete. Standby After Landing",
          "items": [
            { "id": "s92-landing-01", "challenge": "Landing Gear", "response": "Down, 3 Green No Red" },
            { "id": "s92-landing-02", "challenge": "Parking Brake", "response": "Check Release, No Advisory" },
            { "id": "s92-landing-03", "challenge": "Flight Attendant Briefing", "response": "A/R" },
            { "id": "s92-landing-04", "challenge": "Landing Briefing", "response": "Completed" },
            { "id": "s92-landing-05", "challenge": "RWY / Landing Site", "response": "In Sight / Unit Confirmation" },
            { "id": "s92-landing-06", "challenge": "Green Deck (Offshore)", "response": "Confirmed" },
            { "id": "s92-landing-07", "challenge": "APU Ctrl", "response": "A/R" },
            { "id": "s92-landing-08", "challenge": "Floats", "response": "Arm" }
          ]
        },
        {
          "id": "after-landing", "title": "AFTER LANDING", "method": "C/R",
          "trigger": "Onshore: Pista livre. Offshore: Pousado, coletivo embaixo e equalizado.",
          "complete": "Checklist complete. Standby Shut Down",
          "items": [
            { "id": "s92-after-landing-01", "challenge": "APU Ctrl & APU Gen / Int & Search Lts", "response": "On / A/R" },
            { "id": "s92-after-landing-02", "challenge": "WX Radar", "response": "Stby" },
            { "id": "s92-after-landing-03", "challenge": "DISC Horizontal", "response": "Set" },
            { "id": "s92-after-landing-04", "challenge": "Floats", "response": "Safe" },
            { "id": "s92-after-landing-05", "challenge": "APU On", "response": "Check" },
            { "id": "s92-after-landing-06", "challenge": "VIB CTRL", "response": "Off" },
            { "id": "s92-after-landing-07", "challenge": "Electric Conv", "response": "Done" },
            { "id": "s92-after-landing-08", "challenge": "Throttles", "response": "Idle" },
            { "id": "s92-after-landing-09", "challenge": "Anti-Coll, Pos. and Landing Lights", "response": "Off" },
            { "id": "s92-after-landing-10", "challenge": "Chocks", "response": "Apply" }
          ]
        },
        {
          "id": "shut-down", "title": "SHUT DOWN", "method": "C/R",
          "trigger": "Aeronave estacionada, freio aplicado e calços colocados.",
          "complete": "Checklist complete.",
          "items": [
            { "id": "s92-shut-down-01", "challenge": "Parking Brake", "response": "Apply" },
            { "id": "s92-shut-down-02", "challenge": "LDG / Emerg / Heels / Interior Lights", "response": "Off" },
            { "id": "s92-shut-down-03", "challenge": "APU On", "response": "Check" },
            { "id": "s92-shut-down-04", "challenge": "VIB CTRL", "response": "Off" },
            { "id": "s92-shut-down-05", "challenge": "Electric Conv", "response": "Done" },
            { "id": "s92-shut-down-06", "challenge": "Throttles (2 Min)", "response": "Idle" },
            { "id": "s92-shut-down-07", "challenge": "Fire Det", "response": "Test" },
            { "id": "s92-shut-down-08", "challenge": "FMS, FM and WX Radar", "response": "Off" },
            { "id": "s92-shut-down-09", "challenge": "AUX FUEL Mode Select", "response": "Off" },
            { "id": "s92-shut-down-10", "challenge": "Backup Att Ind", "response": "Off Then Cage" },
            { "id": "s92-shut-down-11", "challenge": "Throttles", "response": "Stop" },
            { "id": "s92-shut-down-12", "challenge": "Fuel Control Switch #1 & #2", "response": "Off" },
            { "id": "s92-shut-down-13", "challenge": "Rotor Brake", "response": "Apply" },
            { "id": "s92-shut-down-14", "challenge": "EICAS Parameters", "response": "Note Fuel Qty" },
            { "id": "s92-shut-down-15", "challenge": "ECS", "response": "Vent / Off" },
            { "id": "s92-shut-down-16", "challenge": "HUMS", "response": "Crew Change" },
            { "id": "s92-shut-down-17", "challenge": "APU Gen & APU Ctrl", "response": "Off" },
            { "id": "s92-shut-down-18", "challenge": "Interior Lights", "response": "Off" },
            { "id": "s92-shut-down-19", "challenge": "Battery", "response": "Off" },
            { "id": "s92-shut-down-20", "challenge": "Chocks", "response": "Apply" }
          ]
        }
      ]
    },
    {
      "id": "aw189", "name": "AW189", "heading": "FROTA AW189",
      "phases": [
        {
          "id": "preflight", "title": "PREFLIGHT", "method": "C/R",
          "trigger": "Tripulação técnica sentada e ajustada no cockpit (pós-scanflow).",
          "complete": "Checklist complete. Standby Before Start",
          "items": [
            { "id": "aw189-preflight-01", "challenge": "Seat Belts / Life Jackets", "response": "Fasten" },
            { "id": "aw189-preflight-02", "challenge": "Circuit Breakers", "response": "All In" },
            { "id": "aw189-preflight-03", "challenge": "Rotor Brake", "response": "Off / Check CAS" },
            { "id": "aw189-preflight-04", "challenge": "Static Sources", "response": "Guarded" },
            { "id": "aw189-preflight-05", "challenge": "Fire Panel", "response": "Check" },
            { "id": "aw189-preflight-06", "challenge": "Center Console Switches", "response": "Off / Normal" },
            { "id": "aw189-preflight-07", "challenge": "Skytrac / CPI Controller", "response": "Norm / Guarded" },
            { "id": "aw189-preflight-08", "challenge": "Emerg. Float Panel", "response": "Off" },
            { "id": "aw189-preflight-09", "challenge": "Ldg Gear / Parking Brake", "response": "Down / On" },
            { "id": "aw189-preflight-10", "challenge": "Coll Switches", "response": "Guarded" }
          ]
        },
        {
          "id": "before-start", "title": "BEFORE START", "method": "R/D",
          "trigger": "Preflight completo, preparação de cabine/cockpit finalizada e autorização obtida.",
          "complete": "Checklist complete. Standby After Start",
          "items": [
            { "id": "aw189-before-start-01", "challenge": "Bat Master", "response": "On" },
            { "id": "aw189-before-start-02", "challenge": "APU", "response": "Start" },
            { "id": "aw189-before-start-03", "challenge": "Main Batt", "response": "On" },
            { "id": "aw189-before-start-04", "challenge": "Emerg Light", "response": "Test / Arm" },
            { "id": "aw189-before-start-05", "challenge": "ECDU", "response": "Check / Stat" },
            { "id": "aw189-before-start-06", "challenge": "ECDU Lights", "response": "A/R" },
            { "id": "aw189-before-start-07", "challenge": "Pitot Heater / Camera / Wiper", "response": "Auto / On / A/R" },
            { "id": "aw189-before-start-08", "challenge": "Ldshare", "response": "A/R" },
            { "id": "aw189-before-start-09", "challenge": "EMS Power", "response": "As Req'd" },
            { "id": "aw189-before-start-10", "challenge": "Fire Panel", "response": "Check" },
            { "id": "aw189-before-start-11", "challenge": "AFCS Panel", "response": "APs Off" },
            { "id": "aw189-before-start-12", "challenge": "Ldg Gear / Nose Wheel / Prkg Brake", "response": "3 Green / Locked / On" },
            { "id": "aw189-before-start-13", "challenge": "Nose Wheel Locked Pin", "response": "In Sight" },
            { "id": "aw189-before-start-14", "challenge": "ECDU Tests", "response": "Complete" },
            { "id": "aw189-before-start-15", "challenge": "ECDU Hyd", "response": "Flt Ctl Check" },
            { "id": "aw189-before-start-16", "challenge": "Floats", "response": "Test" },
            { "id": "aw189-before-start-17", "challenge": "Radar / TCAS / TAWS", "response": "Set" },
            { "id": "aw189-before-start-18", "challenge": "ATC (Clearance)", "response": "Obtained" },
            { "id": "aw189-before-start-19", "challenge": "MCDU / Perf Init / FPL", "response": "Perform" },
            { "id": "aw189-before-start-20", "challenge": "Fuel Qty", "response": "Check" },
            { "id": "aw189-before-start-21", "challenge": "MFD", "response": "Power Plant" },
            { "id": "aw189-before-start-22", "challenge": "ITT", "response": "< 150°C" },
            { "id": "aw189-before-start-23", "challenge": "ECDU Fuel", "response": "On / Open / Xfeed" }
          ]
        },
        {
          "id": "after-start", "title": "AFTER START", "method": "C/R",
          "trigger": "Partida completa dos motores, parâmetros normais/estabilizados e GPU desconectada.",
          "complete": "Checklist complete. Standby Before Taxi",
          "items": [
            { "id": "aw189-after-start-01", "challenge": "External Power Source", "response": "Disconnect" },
            { "id": "aw189-after-start-02", "challenge": "APU", "response": "Off" },
            { "id": "aw189-after-start-03", "challenge": "AFCS", "response": "Test" },
            { "id": "aw189-after-start-04", "challenge": "Fuel Pump / Xfeed", "response": "Test" },
            { "id": "aw189-after-start-05", "challenge": "Altimeters", "response": "Set QNH" },
            { "id": "aw189-after-start-06", "challenge": "Rad Alt / DH", "response": "Test / Set 200 ft" },
            { "id": "aw189-after-start-07", "challenge": "Nav / Fuel Qty", "response": "Set / Check" },
            { "id": "aw189-after-start-08", "challenge": "HSI / Compass", "response": "Check" },
            { "id": "aw189-after-start-09", "challenge": "Powerplant", "response": "All Green / No CAS" }
          ]
        },
        {
          "id": "before-taxi", "title": "BEFORE TAXI", "method": "C/R",
          "trigger": "After Start completo, portas/passageiros prontos e intenção de táxi.",
          "complete": "Checklist complete. Standby Before Takeoff",
          "items": [
            { "id": "aw189-before-taxi-01", "challenge": "Doors", "response": "Closed" },
            { "id": "aw189-before-taxi-02", "challenge": "Takeoff Briefing", "response": "Perform" },
            { "id": "aw189-before-taxi-03", "challenge": "Engine Mode Selectors", "response": "Flt / Nr 102%" },
            { "id": "aw189-before-taxi-04", "challenge": "T's & P's", "response": "Check" },
            { "id": "aw189-before-taxi-05", "challenge": "AP 1 & 2", "response": "Engaged / FD Set" },
            { "id": "aw189-before-taxi-06", "challenge": "Alt Selector", "response": "Set" },
            { "id": "aw189-before-taxi-07", "challenge": "APU", "response": "Ready" },
            { "id": "aw189-before-taxi-08", "challenge": "Air Cond / Heater", "response": "Set As Req'd / Check SOV" },
            { "id": "aw189-before-taxi-09", "challenge": "ATC Clearance", "response": "Obtain" },
            { "id": "aw189-before-taxi-10", "challenge": "Nose Wheel", "response": "Unlock" },
            { "id": "aw189-before-taxi-11", "challenge": "Parking Brake", "response": "Off" },
            { "id": "aw189-before-taxi-12", "challenge": "Wheel Brakes", "response": "Check" }
          ]
        },
        {
          "id": "before-takeoff", "title": "BEFORE TAKEOFF", "method": "C/R",
          "trigger": "Onshore: Linha de parada/pista. Offshore: Helideck e passageiros prontos.",
          "complete": "Checklist complete. Standby After Takeoff",
          "items": [
            { "id": "aw189-before-takeoff-01", "challenge": "Eng Mode Selectors", "response": "Flt / Nr 102%" },
            { "id": "aw189-before-takeoff-02", "challenge": "MFD", "response": "PF FPL / PM Powerplant" },
            { "id": "aw189-before-takeoff-03", "challenge": "AP", "response": "ATT / FD Set" },
            { "id": "aw189-before-takeoff-04", "challenge": "Fuel Qty", "response": "Check" },
            { "id": "aw189-before-takeoff-05", "challenge": "AEO Limiter", "response": "A/R" },
            { "id": "aw189-before-takeoff-06", "challenge": "XPDR / TCAS", "response": "TA / RA" },
            { "id": "aw189-before-takeoff-07", "challenge": "Lights", "response": "Set As Req'd" },
            { "id": "aw189-before-takeoff-08", "challenge": "Nose Wheel Lock", "response": "Locked" },
            { "id": "aw189-before-takeoff-09", "challenge": "Floats (Over Water)", "response": "Armed" },
            { "id": "aw189-before-takeoff-10", "challenge": "HLO / ATC", "response": "Cleared" },
            { "id": "aw189-before-takeoff-11", "challenge": "Takeoff Briefing", "response": "Perform" }
          ]
        },
        {
          "id": "after-takeoff", "title": "AFTER TAKEOFF", "method": "C/R",
          "trigger": "Cruzando 500 ft AGL e livre de tráfego/obstáculos.",
          "complete": "Checklist complete. Standby Cruise",
          "items": [
            { "id": "aw189-after-takeoff-01", "challenge": "Ldg Gear", "response": "Up" },
            { "id": "aw189-after-takeoff-02", "challenge": "Parking Brake", "response": "Off" },
            { "id": "aw189-after-takeoff-03", "challenge": "AEO Limiter", "response": "Off" }
          ]
        },
        {
          "id": "cruise", "title": "CRUISE", "method": "C/R",
          "trigger": "Nivelado na altitude de cruzeiro e estabilizado em rota.",
          "complete": "Checklist complete. Standby Descent",
          "items": [
            { "id": "aw189-cruise-01", "challenge": "Ldg Light", "response": "Off" },
            { "id": "aw189-cruise-02", "challenge": "Power Plant", "response": "All Green / No CAS" },
            { "id": "aw189-cruise-03", "challenge": "Pitot Htr / Anti-Ice", "response": "Check / Set" },
            { "id": "aw189-cruise-04", "challenge": "Altimeter / DH", "response": "Set / Adjust" },
            { "id": "aw189-cruise-05", "challenge": "Radios / Xponder", "response": "Crosscheck" },
            { "id": "aw189-cruise-06", "challenge": "Nav Aids / FD Modes", "response": "Set / Check" },
            { "id": "aw189-cruise-07", "challenge": "Fuel Qty", "response": "Check Every 30 min" }
          ]
        },
        {
          "id": "descent", "title": "DESCENT", "method": "C/R",
          "trigger": "A 5 NM do TOD (FMS) ou autorização de descida ATC.",
          "complete": "Checklist complete. Standby Landing",
          "items": [
            { "id": "aw189-descent-01", "challenge": "Briefing", "response": "Perform" },
            { "id": "aw189-descent-02", "challenge": "Nav Aids", "response": "Set" },
            { "id": "aw189-descent-03", "challenge": "Altimeter / DH", "response": "Set / Adjust" },
            { "id": "aw189-descent-04", "challenge": "Ldg Light", "response": "As Req'd" },
            { "id": "aw189-descent-05", "challenge": "TAWS / Radar", "response": "As Req'd" },
            { "id": "aw189-descent-06", "challenge": "Alt. A", "response": "Set / Engage" }
          ]
        },
        {
          "id": "landing", "title": "LANDING", "method": "C/R",
          "trigger": "Onshore/Offshore: A 5 NM do destino, na altitude de tráfego.",
          "complete": "Checklist complete. Standby After Landing",
          "items": [
            { "id": "aw189-landing-01", "challenge": "Ldg Gear / Nose Wheel", "response": "Down / 3 Green / Locked" },
            { "id": "aw189-landing-02", "challenge": "Parking Brake", "response": "A/R" },
            { "id": "aw189-landing-03", "challenge": "Powerplant", "response": "Check / CAS" },
            { "id": "aw189-landing-04", "challenge": "Ldg Light / AEO Lim", "response": "On / As Req'd" },
            { "id": "aw189-landing-05", "challenge": "DH", "response": "Set LDP" },
            { "id": "aw189-landing-06", "challenge": "Landing Briefing", "response": "Perform" }
          ]
        },
        {
          "id": "after-landing", "title": "AFTER LANDING", "method": "C/R",
          "trigger": "Onshore: Pista livre. Offshore: Pousado, coletivo embaixo e equalizado.",
          "complete": "Checklist complete. Standby Shut Down",
          "items": [
            { "id": "aw189-after-landing-01", "challenge": "Nose Wheel / Park Brake", "response": "As Req'd" },
            { "id": "aw189-after-landing-02", "challenge": "XPDR / WX Radar", "response": "As Req / Stby" },
            { "id": "aw189-after-landing-03", "challenge": "Floats", "response": "As Req / Stby" },
            { "id": "aw189-after-landing-04", "challenge": "Lights", "response": "As Req'd" },
            { "id": "aw189-after-landing-05", "challenge": "APU", "response": "As Req" }
          ]
        },
        {
          "id": "shut-down", "title": "SHUT DOWN", "method": "C/R",
          "trigger": "Aeronave estacionada, freio aplicado e calços colocados.",
          "complete": "Checklist complete.",
          "items": [
            { "id": "aw189-shut-down-01", "challenge": "Flight Controls", "response": "Centered / MPOG" },
            { "id": "aw189-shut-down-02", "challenge": "Nose Wheel / Parking Brake", "response": "Locked / On" },
            { "id": "aw189-shut-down-03", "challenge": "AFCS", "response": "Off" },
            { "id": "aw189-shut-down-04", "challenge": "MFD", "response": "Power Plant" },
            { "id": "aw189-shut-down-05", "challenge": "Eng Mode Switches", "response": "Idle / Time (2 min)" },
            { "id": "aw189-shut-down-06", "challenge": "WX Radar / VHF FM / Emerg Lights", "response": "Off / Off / Off" },
            { "id": "aw189-shut-down-07", "challenge": "APU", "response": "Confirm On" },
            { "id": "aw189-shut-down-08", "challenge": "Eng Mode Selector (After 2 min)", "response": "Off" },
            { "id": "aw189-shut-down-09", "challenge": "Fuel Xfeed / Pumps 2", "response": "Closed / Off" },
            { "id": "aw189-shut-down-10", "challenge": "Rotor Brake (≤ 40% Nr)", "response": "Apply" },
            { "id": "aw189-shut-down-11", "challenge": "Air Cond / Fan", "response": "Off" },
            { "id": "aw189-shut-down-12", "challenge": "Internal Lights / Anti-Coll", "response": "Off" },
            { "id": "aw189-shut-down-13", "challenge": "Fuel Qty", "response": "Record" },
            { "id": "aw189-shut-down-14", "challenge": "APU", "response": "Off & Wait Cldw (1 min)" },
            { "id": "aw189-shut-down-15", "challenge": "Main Batt", "response": "Off" },
            { "id": "aw189-shut-down-16", "challenge": "Batt Master", "response": "Off" }
          ]
        }
      ]
    },
    {
      "id": "h145", "name": "H145", "heading": "FROTA H145",
      "phases": [
        {
          "id": "preflight", "title": "PREFLIGHT", "method": "C/R",
          "trigger": "Tripulação técnica sentada e ajustada no cockpit (pós-scanflow).",
          "complete": "Checklist complete. Standby Before Start",
          "items": [
            { "id": "h145-preflight-01", "challenge": "Exterior Check", "response": "Completed" },
            { "id": "h145-preflight-02", "challenge": "Cards / Life Vests / Headsets", "response": "Checked" },
            { "id": "h145-preflight-03", "challenge": "Seat and Pedals / Belt", "response": "Adjust / Fastened" },
            { "id": "h145-preflight-04", "challenge": "First Aid Kit", "response": "Stowed" },
            { "id": "h145-preflight-05", "challenge": "Fire Extinguishers", "response": "Secured" },
            { "id": "h145-preflight-06", "challenge": "Loose Items", "response": "Stowed" },
            { "id": "h145-preflight-07", "challenge": "Pins (3) and Covers", "response": "Stowed" },
            { "id": "h145-preflight-08", "challenge": "Overhead Panel", "response": "Completed" },
            { "id": "h145-preflight-09", "challenge": "Instrument Panel", "response": "Completed" },
            { "id": "h145-preflight-10", "challenge": "Center Console", "response": "Completed" },
            { "id": "h145-preflight-11", "challenge": "Coll. Pitch Levers", "response": "Latched" },
            { "id": "h145-preflight-12", "challenge": "Rotor Brake", "response": "Released" }
          ]
        },
        {
          "id": "before-start", "title": "BEFORE START", "method": "R/D",
          "trigger": "Preflight completo, preparação de cabine/cockpit finalizada e autorização obtida.",
          "complete": "Checklist complete. Standby After Start",
          "items": [
            { "id": "h145-before-start-01", "challenge": "BAT MST (20sec system boot)", "response": "On" },
            { "id": "h145-before-start-02", "challenge": "VMS", "response": "Press NUM" },
            { "id": "h145-before-start-03", "challenge": "Weight", "response": "Set / Validated" },
            { "id": "h145-before-start-04", "challenge": "Master List", "response": "Power-Up Test OK" },
            { "id": "h145-before-start-05", "challenge": "Iso Call", "response": "A/R" },
            { "id": "h145-before-start-06", "challenge": "Passenger Advisory Lights", "response": "A/R" },
            { "id": "h145-before-start-07", "challenge": "Fire SYS 1 + 2", "response": "Tested" },
            { "id": "h145-before-start-08", "challenge": "LAMP", "response": "Tested" },
            { "id": "h145-before-start-09", "challenge": "IBF Open (10 sec)", "response": "Tested & Normal" },
            { "id": "h145-before-start-10", "challenge": "ADELT TST (On 24h duty)", "response": "Completed" },
            { "id": "h145-before-start-11", "challenge": "Night Flight (EMS)", "response": "Prepared" },
            { "id": "h145-before-start-12", "challenge": "Master List", "response": "Checked" },
            { "id": "h145-before-start-13", "challenge": "Flight Controls", "response": "Checked" },
            { "id": "h145-before-start-14", "challenge": "DC Volts", "response": "≥ 23.5V" },
            { "id": "h145-before-start-15", "challenge": "Fuel Quantity", "response": "Sufficient" },
            { "id": "h145-before-start-16", "challenge": "ATIS + BARO (3)", "response": "Note and Set" },
            { "id": "h145-before-start-17", "challenge": "Start Clearance", "response": "Received" }
          ]
        },
        {
          "id": "after-start", "title": "AFTER START", "method": "C/R",
          "trigger": "Partida completa dos motores, parâmetros normais/estabilizados e GPU desconectada.",
          "complete": "Checklist complete. Standby Before Taxi",
          "items": [
            { "id": "h145-after-start-01", "challenge": "OVHD SW's", "response": "Set A/R" },
            { "id": "h145-after-start-02", "challenge": "Air Conditioning (ECS)", "response": "On - Ckpt / Cab" },
            { "id": "h145-after-start-03", "challenge": "Avionics", "response": "GTN Check and Set" },
            { "id": "h145-after-start-04", "challenge": "Coll. / MFD 4", "response": "Unlatch / Syst" },
            { "id": "h145-after-start-05", "challenge": "LAMP", "response": "Check: MKR, DME, NMS" },
            { "id": "h145-after-start-06", "challenge": "P-FLT TST (IFR flight)", "response": "P-FLT Test OK" },
            { "id": "h145-after-start-07", "challenge": "Floats ARMED", "response": "Tested" },
            { "id": "h145-after-start-08", "challenge": "WXR (IFR flight)", "response": "Tested, then STBY" }
          ]
        },
        {
          "id": "before-taxi", "title": "BEFORE TAXI", "method": "C/R",
          "trigger": "After Start completo, portas/passageiros prontos e intenção de táxi.",
          "complete": "Checklist complete. Standby Before Takeoff",
          "items": [
            { "id": "h145-before-taxi-01", "challenge": "Doors", "response": "Closed" },
            { "id": "h145-before-taxi-02", "challenge": "Fuel Quantity", "response": "Sufficient" },
            { "id": "h145-before-taxi-03", "challenge": "Flight Plan", "response": "Set / Load" },
            { "id": "h145-before-taxi-04", "challenge": "Collective", "response": "Unlatched" },
            { "id": "h145-before-taxi-05", "challenge": "ENG 1/2 Main Sw's", "response": "Flight / Closed" },
            { "id": "h145-before-taxi-06", "challenge": "WRN / Cautions", "response": "Clear" },
            { "id": "h145-before-taxi-07", "challenge": "IESI", "response": "Aligned, IAS and ALT Valid" },
            { "id": "h145-before-taxi-08", "challenge": "NR / N2", "response": "VMS & FND Normal Range" },
            { "id": "h145-before-taxi-09", "challenge": "MFD's", "response": "A/R" },
            { "id": "h145-before-taxi-10", "challenge": "ALT.A / HDG / Course", "response": "Set" },
            { "id": "h145-before-taxi-11", "challenge": "AP / BKUP SAS", "response": "On" },
            { "id": "h145-before-taxi-12", "challenge": "Landing / Ext. Lights", "response": "A/R" },
            { "id": "h145-before-taxi-13", "challenge": "Takeoff Clearance", "response": "Confirmed" },
            { "id": "h145-before-taxi-14", "challenge": "Takeoff Briefing", "response": "Performed" }
          ]
        },
        {
          "id": "before-takeoff", "title": "BEFORE TAKEOFF", "method": "C/R",
          "trigger": "Onshore: Linha de parada/pista. Offshore: Helideck e passageiros prontos.",
          "complete": "Checklist complete. Standby After Takeoff",
          "items": [
            { "id": "h145-before-takeoff-01", "challenge": "Upper Modes", "response": "A/R" },
            { "id": "h145-before-takeoff-02", "challenge": "WXR", "response": "A/R" },
            { "id": "h145-before-takeoff-03", "challenge": "Landing / Ext. Lights", "response": "A/R" }
          ]
        },
        {
          "id": "after-takeoff", "title": "AFTER TAKEOFF", "method": "C/R",
          "trigger": "Cruzando 500 ft AGL e livre de tráfego/obstáculos.",
          "complete": "Checklist complete. Standby Cruise",
          "items": [
            { "id": "h145-after-takeoff-01", "challenge": "Upper Modes", "response": "A/R" },
            { "id": "h145-after-takeoff-02", "challenge": "WXR", "response": "A/R" },
            { "id": "h145-after-takeoff-03", "challenge": "Landing / Ext. Lights", "response": "A/R" }
          ]
        },
        {
          "id": "cruise", "title": "CRUISE", "method": "C/R",
          "trigger": "Nivelado na altitude de cruzeiro e estabilizado em rota.",
          "complete": "Checklist complete. Standby Descent",
          "items": [
            { "id": "h145-cruise-01", "challenge": "Altimeter", "response": "Check" },
            { "id": "h145-cruise-02", "challenge": "FLI / IAS / VNE", "response": "Check" },
            { "id": "h145-cruise-03", "challenge": "Flight Plan / V.CALC (GTN)", "response": "Set" },
            { "id": "h145-cruise-04", "challenge": "Fuel Plan (GTN)", "response": "Check" },
            { "id": "h145-cruise-05", "challenge": "Power Check (EPC)", "response": "A/R" }
          ]
        },
        {
          "id": "descent", "title": "DESCENT", "method": "C/R",
          "trigger": "A 5 NM do TOD (FMS) ou autorização de descida ATC.",
          "complete": "Checklist complete. Standby Landing",
          "items": [
            { "id": "h145-descent-01", "challenge": "Flight Plan / NAVD / FND", "response": "Set / X-Check" },
            { "id": "h145-descent-02", "challenge": "Altimeter / ALT.A", "response": "Set" },
            { "id": "h145-descent-03", "challenge": "DA / DH", "response": "Set" },
            { "id": "h145-descent-04", "challenge": "Descent Briefing", "response": "Completed" },
            { "id": "h145-descent-05", "challenge": "IAS / ALT.A", "response": "Engaged" }
          ]
        },
        {
          "id": "landing", "title": "LANDING", "method": "C/R",
          "trigger": "Onshore/Offshore: A 5 NM do destino, na altitude de tráfego.",
          "complete": "Checklist complete. Standby After Landing",
          "items": [
            { "id": "h145-landing-01", "challenge": "WXR", "response": "A/R" },
            { "id": "h145-landing-02", "challenge": "WRN / Cautions", "response": "Check" },
            { "id": "h145-landing-03", "challenge": "Landing / Search Light", "response": "On" },
            { "id": "h145-landing-04", "challenge": "Landing Briefing", "response": "Perform" }
          ]
        },
        {
          "id": "after-landing", "title": "AFTER LANDING", "method": "C/R",
          "trigger": "Onshore: Pista livre. Offshore: Pousado, coletivo embaixo e equalizado.",
          "complete": "Checklist complete. Standby Shut Down",
          "items": [
            { "id": "h145-after-landing-01", "challenge": "Cyclic and Pedals", "response": "Neutral" },
            { "id": "h145-after-landing-02", "challenge": "Collective", "response": "Latched" },
            { "id": "h145-after-landing-03", "challenge": "Landing / Search Light", "response": "Off / Stowed" }
          ]
        },
        {
          "id": "shut-down", "title": "SHUT DOWN", "method": "C/R",
          "trigger": "Aeronave estacionada, freio aplicado e calços colocados.",
          "complete": "Checklist complete.",
          "items": [
            { "id": "h145-shut-down-01", "challenge": "ENG 1 / 2", "response": "Idle (Start Clock)" },
            { "id": "h145-shut-down-02", "challenge": "MFD 4", "response": "VMS" },
            { "id": "h145-shut-down-03", "challenge": "All Consumers (Expt A-Coll & BLT/SMK)", "response": "Off" },
            { "id": "h145-shut-down-04", "challenge": "ENG 1 / 2 (After 30 sec)", "response": "Off / TOT Monitor" },
            { "id": "h145-shut-down-05", "challenge": "Rotor Brake (Nr < 50%)", "response": "Apply" },
            { "id": "h145-shut-down-06", "challenge": "Rotor Brake (After rotor stop)", "response": "Release" },
            { "id": "h145-shut-down-07", "challenge": "A-Coll / BLT / SMK", "response": "Off" },
            { "id": "h145-shut-down-08", "challenge": "Flight Report", "response": "Validated" },
            { "id": "h145-shut-down-09", "challenge": "FND ML", "response": "Download Complete" },
            { "id": "h145-shut-down-10", "challenge": "BAT MSTR", "response": "Off" }
          ]
        }
      ]
    },
    {
      "id": "h175", "name": "H175", "heading": "FROTA H175",
      "phases": [
        {
          "id": "preflight", "title": "PREFLIGHT", "method": "C/R",
          "trigger": "Tripulação técnica sentada e ajustada no cockpit (pós-scanflow).",
          "complete": "Checklist complete. Standby Before Start",
          "items": [
            { "id": "h175-preflight-01", "challenge": "Pedals and Seats", "response": "Adjust" },
            { "id": "h175-preflight-02", "challenge": "Access Doors", "response": "Check" },
            { "id": "h175-preflight-03", "challenge": "Jettison Handles", "response": "Check" },
            { "id": "h175-preflight-04", "challenge": "Fire Extinguisher", "response": "In Place / Check" },
            { "id": "h175-preflight-05", "challenge": "Collective Pitch", "response": "Latched" },
            { "id": "h175-preflight-06", "challenge": "Shed Switch", "response": "Off" },
            { "id": "h175-preflight-07", "challenge": "Circuit Breakers", "response": "All Set" },
            { "id": "h175-preflight-08", "challenge": "Static Port Valves", "response": "Normal" },
            { "id": "h175-preflight-09", "challenge": "Rotor Brake", "response": "Released" },
            { "id": "h175-preflight-10", "challenge": "Standby Compass", "response": "Check" },
            { "id": "h175-preflight-11", "challenge": "FMS Switches", "response": "Off" },
            { "id": "h175-preflight-12", "challenge": "Ice Sensor / Windshield De-Ice", "response": "Off" },
            { "id": "h175-preflight-13", "challenge": "Floats", "response": "Off" },
            { "id": "h175-preflight-14", "challenge": "Radio Altimeters 1&2", "response": "Off" },
            { "id": "h175-preflight-15", "challenge": "ACAS", "response": "Armed" },
            { "id": "h175-preflight-16", "challenge": "HTAWS", "response": "Standby" },
            { "id": "h175-preflight-17", "challenge": "Hydraulic Auxiliary Pump", "response": "Auto" },
            { "id": "h175-preflight-18", "challenge": "Wipers Control Box", "response": "Off" },
            { "id": "h175-preflight-19", "challenge": "ECS", "response": "Off" },
            { "id": "h175-preflight-20", "challenge": "Skytrac", "response": "Normal" },
            { "id": "h175-preflight-21", "challenge": "HUMS Card", "response": "Check" },
            { "id": "h175-preflight-22", "challenge": "Fuel Pumps", "response": "Off" },
            { "id": "h175-preflight-23", "challenge": "Engine Control Panel", "response": "Off / SOV Normal" },
            { "id": "h175-preflight-24", "challenge": "Fire Exting", "response": "Guarded Engine" },
            { "id": "h175-preflight-25", "challenge": "Training", "response": "Flight" },
            { "id": "h175-preflight-26", "challenge": "Weather Radar", "response": "Off" },
            { "id": "h175-preflight-27", "challenge": "Marine VHF", "response": "Off" },
            { "id": "h175-preflight-28", "challenge": "CPI", "response": "Guarded / Lights Off" },
            { "id": "h175-preflight-29", "challenge": "Landing Gear Panel", "response": "Down / Emerg Off" },
            { "id": "h175-preflight-30", "challenge": "Parking Brake", "response": "Applied" },
            { "id": "h175-preflight-31", "challenge": "Hydraulic Bypass 1&2", "response": "Normal" },
            { "id": "h175-preflight-32", "challenge": "Emergency Cut Off 1&2", "response": "On" },
            { "id": "h175-preflight-33", "challenge": "Generator 1&2 / Battery 1&2", "response": "Off" },
            { "id": "h175-preflight-34", "challenge": "Emergency Generator / Alternator", "response": "Off" },
            { "id": "h175-preflight-35", "challenge": "Lights Control Panel & Cabin Signs", "response": "All Off" },
            { "id": "h175-preflight-36", "challenge": "Mission Selector", "response": "Off" },
            { "id": "h175-preflight-37", "challenge": "ELT", "response": "Armed" }
          ]
        },
        {
          "id": "before-start", "title": "BEFORE START", "method": "R/D",
          "trigger": "Preflight completo, preparação de cabine/cockpit finalizada e autorização obtida.",
          "complete": "Checklist complete. Standby After Start",
          "items": [
            { "id": "h175-before-start-01", "challenge": "Battery 1&2 / Generator 1&2", "response": "On" },
            { "id": "h175-before-start-02", "challenge": "EPU", "response": "As Required" },
            { "id": "h175-before-start-03", "challenge": "Emergency Exit Switch", "response": "On, Then Arm" },
            { "id": "h175-before-start-04", "challenge": "VMS Subpages", "response": "Check" },
            { "id": "h175-before-start-05", "challenge": "Fuel Quantity", "response": "Check" },
            { "id": "h175-before-start-06", "challenge": "Weight Data", "response": "Enter" },
            { "id": "h175-before-start-07", "challenge": "Power-Up Test", "response": "OK" },
            { "id": "h175-before-start-08", "challenge": "Hydraulic Auxiliary Pump", "response": "Test, Then Auto" },
            { "id": "h175-before-start-09", "challenge": "Pre Start Test OK", "response": "Check" },
            { "id": "h175-before-start-10", "challenge": "Collective Pitch", "response": "Latched" },
            { "id": "h175-before-start-11", "challenge": "Cyclic Stick", "response": "Centered" },
            { "id": "h175-before-start-12", "challenge": "FMS 1&2", "response": "On" },
            { "id": "h175-before-start-13", "challenge": "Radio Altimeters 1&2", "response": "On" },
            { "id": "h175-before-start-14", "challenge": "ATC Clearance", "response": "Obtain" },
            { "id": "h175-before-start-15", "challenge": "Altimeter", "response": "Set" }
          ]
        },
        {
          "id": "after-start", "title": "AFTER START", "method": "C/R",
          "trigger": "Partida completa dos motores, parâmetros normais/estabilizados e GPU desconectada.",
          "complete": "Checklist complete. Standby Before Taxi",
          "items": [
            { "id": "h175-after-start-01", "challenge": "EPU Switch", "response": "Off / Disconnected" },
            { "id": "h175-after-start-02", "challenge": "Generator 1 & 2 Parameters", "response": "Normal Range" },
            { "id": "h175-after-start-03", "challenge": "Emergency Generator", "response": "On" },
            { "id": "h175-after-start-04", "challenge": "Alternator (If Installed)", "response": "On" },
            { "id": "h175-after-start-05", "challenge": "Ice Sensor / Windshield (If Installed)", "response": "As Required" },
            { "id": "h175-after-start-06", "challenge": "HTAWS", "response": "On" },
            { "id": "h175-after-start-07", "challenge": "Lamp Switch", "response": "Test" },
            { "id": "h175-after-start-08", "challenge": "Fuel Pumps", "response": "Test" },
            { "id": "h175-after-start-09", "challenge": "ECS", "response": "As Required" },
            { "id": "h175-after-start-10", "challenge": "Backup Radio", "response": "Test" },
            { "id": "h175-after-start-11", "challenge": "Weather Radar", "response": "Standby" },
            { "id": "h175-after-start-12", "challenge": "Marine VHF", "response": "On" },
            { "id": "h175-after-start-13", "challenge": "CPI", "response": "Guarded / Lights Off" },
            { "id": "h175-after-start-14", "challenge": "Collective", "response": "Unlatched" },
            { "id": "h175-after-start-15", "challenge": "P. FLT Switch", "response": "Test" },
            { "id": "h175-after-start-16", "challenge": "P. FLT Test OK", "response": "Check" },
            { "id": "h175-after-start-17", "challenge": "AP 1/2", "response": "On" },
            { "id": "h175-after-start-18", "challenge": "Position Lights", "response": "On" }
          ]
        },
        {
          "id": "before-taxi", "title": "BEFORE TAXI", "method": "C/R",
          "trigger": "After Start completo, portas/passageiros prontos e intenção de táxi.",
          "complete": "Checklist complete. Standby Before Takeoff",
          "items": [
            { "id": "h175-before-taxi-01", "challenge": "Takeoff Briefing", "response": "Perform" },
            { "id": "h175-before-taxi-02", "challenge": "Landing Light", "response": "On" },
            { "id": "h175-before-taxi-03", "challenge": "Parking Brake", "response": "Released" },
            { "id": "h175-before-taxi-04", "challenge": "Nose Wheel", "response": "Unlocked" },
            { "id": "h175-before-taxi-05", "challenge": "Wheel Brakes (During Taxi)", "response": "Check" },
            { "id": "h175-before-taxi-06", "challenge": "HSI", "response": "Marks Increasing / Decreasing" },
            { "id": "h175-before-taxi-07", "challenge": "Alt. A", "response": "Set" }
          ]
        },
        {
          "id": "before-takeoff", "title": "BEFORE TAKEOFF", "method": "C/R",
          "trigger": "Onshore: Linha de parada/pista. Offshore: Helideck e passageiros prontos.",
          "complete": "Checklist complete. Standby After Takeoff",
          "items": [
            { "id": "h175-before-takeoff-01", "challenge": "Anti Collision", "response": "White" },
            { "id": "h175-before-takeoff-02", "challenge": "Transponder", "response": "On" },
            { "id": "h175-before-takeoff-03", "challenge": "Floats", "response": "Test / Auto" },
            { "id": "h175-before-takeoff-04", "challenge": "CWP & Master List", "response": "Check" },
            { "id": "h175-before-takeoff-05", "challenge": "Nose Wheel", "response": "Locked" },
            { "id": "h175-before-takeoff-06", "challenge": "Engines 1&2 (Offshore)", "response": "Flight & Guarded" },
            { "id": "h175-before-takeoff-07", "challenge": "Weight Data", "response": "Entered" },
            { "id": "h175-before-takeoff-08", "challenge": "Alt. A", "response": "Set" },
            { "id": "h175-before-takeoff-09", "challenge": "External Lights", "response": "On" },
            { "id": "h175-before-takeoff-10", "challenge": "Cabin Sign", "response": "On" },
            { "id": "h175-before-takeoff-11", "challenge": "Landing Lights", "response": "On" },
            { "id": "h175-before-takeoff-12", "challenge": "Helideck Area", "response": "Clear" },
            { "id": "h175-before-takeoff-13", "challenge": "Collective", "response": "Unlatched" },
            { "id": "h175-before-takeoff-14", "challenge": "Takeoff Briefing", "response": "Perform" }
          ]
        },
        {
          "id": "after-takeoff", "title": "AFTER TAKEOFF", "method": "C/R",
          "trigger": "Cruzando 500 ft AGL e livre de tráfego/obstáculos.",
          "complete": "Checklist complete. Standby Cruise",
          "items": [
            { "id": "h175-after-takeoff-01", "challenge": "Landing Gear", "response": "Up / Lights Off" },
            { "id": "h175-after-takeoff-02", "challenge": "Weather Radar", "response": "On" },
            { "id": "h175-after-takeoff-03", "challenge": "Parking Brake", "response": "Released" },
            { "id": "h175-after-takeoff-04", "challenge": "Compass", "response": "MG" },
            { "id": "h175-after-takeoff-05", "challenge": "HTAWS", "response": "Normal" }
          ]
        },
        {
          "id": "cruise", "title": "CRUISE", "method": "C/R",
          "trigger": "Nivelado na altitude de cruzeiro e estabilizado em rota.",
          "complete": "Checklist complete. Standby Descent",
          "items": [
            { "id": "h175-cruise-01", "challenge": "Fuel Quantity", "response": "Check (Every 30 min)" },
            { "id": "h175-cruise-02", "challenge": "Landing Light", "response": "Off" },
            { "id": "h175-cruise-03", "challenge": "Alt. A / Cr. Ht", "response": "Set" }
          ]
        },
        {
          "id": "descent", "title": "DESCENT", "method": "C/R",
          "trigger": "A 5 NM do TOD (FMS) ou autorização de descida ATC.",
          "complete": "Checklist complete. Standby Landing",
          "items": [
            { "id": "h175-descent-01", "challenge": "Landing Lights", "response": "On" },
            { "id": "h175-descent-02", "challenge": "Weather Radar", "response": "As Required" }
          ]
        },
        {
          "id": "landing", "title": "LANDING", "method": "C/R",
          "trigger": "Onshore/Offshore: A 5 NM do destino, na altitude de tráfego.",
          "complete": "Checklist complete. Standby After Landing",
          "items": [
            { "id": "h175-landing-01", "challenge": "Landing Gear", "response": "Down / 3 Greens" },
            { "id": "h175-landing-02", "challenge": "Parking Brake", "response": "Released" },
            { "id": "h175-landing-03", "challenge": "Nose Wheel", "response": "Locked" },
            { "id": "h175-landing-04", "challenge": "DH / DA", "response": "Check" },
            { "id": "h175-landing-05", "challenge": "Landing Briefing", "response": "Perform" },
            { "id": "h175-landing-06", "challenge": "Compass (Offshore)", "response": "DG" },
            { "id": "h175-landing-07", "challenge": "Weather Radar (Offshore)", "response": "Standby" },
            { "id": "h175-landing-08", "challenge": "HTAWS (Offshore)", "response": "Low Alt" },
            { "id": "h175-landing-09", "challenge": "Landing Site (Offshore)", "response": "Green Deck" },
            { "id": "h175-landing-10", "challenge": "Traffic Pattern (Offshore)", "response": "Unit Confirmed" }
          ]
        },
        {
          "id": "after-landing", "title": "AFTER LANDING", "method": "C/R",
          "trigger": "Onshore: Pista livre. Offshore: Pousado, coletivo embaixo e equalizado.",
          "complete": "Checklist complete. Standby Shut Down",
          "items": [
            { "id": "h175-after-landing-01", "challenge": "Nose Wheel", "response": "Unlocked" },
            { "id": "h175-after-landing-02", "challenge": "Transponder", "response": "Standby" },
            { "id": "h175-after-landing-03", "challenge": "Anticolision Light", "response": "Red" },
            { "id": "h175-after-landing-04", "challenge": "Floats", "response": "Off" },
            { "id": "h175-after-landing-05", "challenge": "Collective (Offshore)", "response": "Latched" },
            { "id": "h175-after-landing-06", "challenge": "Cyclic Stick & Pedals (Offshore)", "response": "Centered" },
            { "id": "h175-after-landing-07", "challenge": "Landing Lights (Offshore)", "response": "Off" },
            { "id": "h175-after-landing-08", "challenge": "Cabin Sign (Offshore)", "response": "Off" },
            { "id": "h175-after-landing-09", "challenge": "External Lights (Offshore)", "response": "Off" }
          ]
        },
        {
          "id": "shut-down", "title": "SHUT DOWN", "method": "C/R",
          "trigger": "Aeronave estacionada, freio aplicado e calços colocados.",
          "complete": "Checklist complete.",
          "items": [
            { "id": "h175-shut-down-01", "challenge": "Collective Pitch", "response": "Latched" },
            { "id": "h175-shut-down-02", "challenge": "Parking Brake", "response": "Applied" },
            { "id": "h175-shut-down-03", "challenge": "Cyclic Stick & Pedals", "response": "Centered" },
            { "id": "h175-shut-down-04", "challenge": "Landing Lights", "response": "Off" },
            { "id": "h175-shut-down-05", "challenge": "Engine Control Switch", "response": "Idle (1 min)" },
            { "id": "h175-shut-down-06", "challenge": "AFCS", "response": "AP & SAS Off" },
            { "id": "h175-shut-down-07", "challenge": "Ice Sensor / Windshield", "response": "Off" },
            { "id": "h175-shut-down-08", "challenge": "HTAWS", "response": "Standby" },
            { "id": "h175-shut-down-09", "challenge": "Wiper Control Box", "response": "Off" },
            { "id": "h175-shut-down-10", "challenge": "Weather Radar", "response": "Off" },
            { "id": "h175-shut-down-11", "challenge": "Marine VHF", "response": "Off" },
            { "id": "h175-shut-down-12", "challenge": "ECS", "response": "Off" },
            { "id": "h175-shut-down-13", "challenge": "Fuel Pumps", "response": "Off" },
            { "id": "h175-shut-down-14", "challenge": "Engine Control Switches", "response": "Off" },
            { "id": "h175-shut-down-15", "challenge": "FMS 1 & 2", "response": "Off" },
            { "id": "h175-shut-down-16", "challenge": "Radar Altimeters 1&2", "response": "Off" },
            { "id": "h175-shut-down-17", "challenge": "Rotor Brake", "response": "Apply (< 50%)" },
            { "id": "h175-shut-down-18", "challenge": "Cabin Signs", "response": "Off" },
            { "id": "h175-shut-down-19", "challenge": "External Lights", "response": "Off" },
            { "id": "h175-shut-down-20", "challenge": "Cabin Emergency & Cockpit Lights", "response": "Off" },
            { "id": "h175-shut-down-21", "challenge": "Emergency Generator / Alternator", "response": "Off" },
            { "id": "h175-shut-down-22", "challenge": "Generator 1 & 2", "response": "Off" },
            { "id": "h175-shut-down-23", "challenge": "Hydraulic Auxiliary Pump", "response": "Off" },
            { "id": "h175-shut-down-24", "challenge": "HUMS", "response": "Download Complete" },
            { "id": "h175-shut-down-25", "challenge": "Battery 1 & 2", "response": "Off" }
          ]
        }
      ]
    },
    {
      "id": "aw139", "name": "AW139", "heading": "FROTA AW139",
      "phases": [
        {
          "id": "preflight", "title": "PREFLIGHT", "method": "C/R",
          "trigger": "Tripulação técnica sentada e ajustada no cockpit (pós-scanflow).",
          "complete": "Checklist complete. Standby Before Start",
          "items": [
            { "id": "aw139-preflight-01", "challenge": "Circuit Breakers", "response": "Checked" },
            { "id": "aw139-preflight-02", "challenge": "ECL", "response": "Flight" },
            { "id": "aw139-preflight-03", "challenge": "Fire Extinguisher Panel", "response": "Btl Set Center" },
            { "id": "aw139-preflight-04", "challenge": "Emerg Floats Switches", "response": "Guarded" }
          ]
        },
        {
          "id": "before-start", "title": "BEFORE START", "method": "R/D",
          "trigger": "Preflight completo, preparação de cabine/cockpit finalizada e autorização obtida.",
          "complete": "Checklist complete. Standby After Start",
          "items": [
            { "id": "aw139-before-start-01", "challenge": "Electrical Switches", "response": "A/R" },
            { "id": "aw139-before-start-02", "challenge": "MFD & CAS", "response": "Checked" },
            { "id": "aw139-before-start-03", "challenge": "Fuel Qty", "response": "Cross-Checked" },
            { "id": "aw139-before-start-04", "challenge": "Nose Wheel / Pedals", "response": "Locked / Centralized" },
            { "id": "aw139-before-start-05", "challenge": "Flight Controls", "response": "Checked" },
            { "id": "aw139-before-start-06", "challenge": "Test Control Panel", "response": "Checked" },
            { "id": "aw139-before-start-07", "challenge": "Emerg Floats", "response": "No Float on CAS / Checked" },
            { "id": "aw139-before-start-08", "challenge": "Eng Beep Trim", "response": "Checked" },
            { "id": "aw139-before-start-09", "challenge": "Eng Gov Switches", "response": "Auto" },
            { "id": "aw139-before-start-10", "challenge": "Main Bus Voltage", "response": "Above 23V" },
            { "id": "aw139-before-start-11", "challenge": "ATC Clearance", "response": "Obtain" },
            { "id": "aw139-before-start-12", "challenge": "Altimeters Setting", "response": "Set / Cross-Checked" },
            { "id": "aw139-before-start-13", "challenge": "Fuel Panel", "response": "Set" }
          ]
        },
        {
          "id": "after-start", "title": "AFTER START", "method": "C/R",
          "trigger": "Partida completa dos motores, parâmetros normais/estabilizados e GPU desconectada.",
          "complete": "Checklist complete. Standby Before Taxi",
          "items": [
            { "id": "aw139-after-start-01", "challenge": "Electrical Switches", "response": "A/R" },
            { "id": "aw139-after-start-02", "challenge": "Center Console", "response": "A/R" },
            { "id": "aw139-after-start-03", "challenge": "MCDU Preflight", "response": "Completed" },
            { "id": "aw139-after-start-04", "challenge": "Engine Mode Switches", "response": "Flight" },
            { "id": "aw139-after-start-05", "challenge": "Fuel Xfeed / Fuel Pumps", "response": "Tested" },
            { "id": "aw139-after-start-06", "challenge": "AFCS", "response": "Tested / AP1 & AP2 On / ATT" },
            { "id": "aw139-after-start-07", "challenge": "Power Plant", "response": "All Green / Normal CAS" }
          ]
        },
        {
          "id": "before-taxi", "title": "BEFORE TAXI", "method": "C/R",
          "trigger": "After Start completo, portas/passageiros prontos e intenção de táxi.",
          "complete": "Checklist complete. Standby Before Takeoff",
          "items": [
            { "id": "aw139-before-taxi-01", "challenge": "ATC Clearance", "response": "Obtained" },
            { "id": "aw139-before-taxi-02", "challenge": "Nose Wheel", "response": "Unlocked" },
            { "id": "aw139-before-taxi-03", "challenge": "Park Brk", "response": "Off" }
          ]
        },
        {
          "id": "before-takeoff", "title": "BEFORE TAKEOFF", "method": "C/R",
          "trigger": "Onshore: Linha de parada/pista. Offshore: Helideck e passageiros prontos.",
          "complete": "Checklist complete. Standby After Takeoff",
          "items": [
            { "id": "aw139-before-takeoff-01", "challenge": "HLO", "response": "Thumbs Up" },
            { "id": "aw139-before-takeoff-02", "challenge": "Power Plant", "response": "All Green / Normal CAS" },
            { "id": "aw139-before-takeoff-03", "challenge": "Take Off Briefing", "response": "Performed" },
            { "id": "aw139-before-takeoff-04", "challenge": "ATC Clearance", "response": "Obtained" },
            { "id": "aw139-before-takeoff-05", "challenge": "Xponder / TCAS", "response": "TA-RA" },
            { "id": "aw139-before-takeoff-06", "challenge": "External Lights", "response": "On" }
          ]
        },
        {
          "id": "after-takeoff", "title": "AFTER TAKEOFF", "method": "C/R",
          "trigger": "Cruzando 500 ft AGL e livre de tráfego/obstáculos.",
          "complete": "Checklist complete. Standby Cruise",
          "items": [
            { "id": "aw139-after-takeoff-01", "challenge": "RPM Switch (≤ 90kt)", "response": "100% Nr" },
            { "id": "aw139-after-takeoff-02", "challenge": "Ldg Gear", "response": "A/R" },
            { "id": "aw139-after-takeoff-03", "challenge": "Park Brk", "response": "A/R" },
            { "id": "aw139-after-takeoff-04", "challenge": "Compass", "response": "MAG" },
            { "id": "aw139-after-takeoff-05", "challenge": "DH", "response": "Set _____ ft" }
          ]
        },
        {
          "id": "cruise", "title": "CRUISE", "method": "C/R",
          "trigger": "Nivelado na altitude de cruzeiro e estabilizado em rota.",
          "complete": "Checklist complete. Standby Descent",
          "items": [
            { "id": "aw139-cruise-01", "challenge": "Altimeter Setting", "response": "Set" },
            { "id": "aw139-cruise-02", "challenge": "External Lights", "response": "A/R" },
            { "id": "aw139-cruise-03", "challenge": "Power Plant", "response": "All Green / Normal CAS" }
          ]
        },
        {
          "id": "descent", "title": "DESCENT", "method": "C/R",
          "trigger": "A 5 NM do TOD (FMS) ou autorização de descida ATC.",
          "complete": "Checklist complete. Standby Landing",
          "items": [
            { "id": "aw139-descent-01", "challenge": "Helideck Contact", "response": "Done" },
            { "id": "aw139-descent-02", "challenge": "Altimeter Setting", "response": "Set" },
            { "id": "aw139-descent-03", "challenge": "Alt Sel", "response": "Set _____ ft" },
            { "id": "aw139-descent-04", "challenge": "External Lights", "response": "A/R" },
            { "id": "aw139-descent-05", "challenge": "EGPWS / Radar", "response": "A/R" },
            { "id": "aw139-descent-06", "challenge": "Approach Briefing", "response": "Performed" }
          ]
        },
        {
          "id": "landing", "title": "LANDING", "method": "C/R",
          "trigger": "Onshore/Offshore: A 5 NM do destino, na altitude de tráfego.",
          "complete": "Checklist complete. Standby After Landing",
          "items": [
            { "id": "aw139-landing-01", "challenge": "Ldg Gear", "response": "Down / 3 Greens" },
            { "id": "aw139-landing-02", "challenge": "Park Brk", "response": "A/R" },
            { "id": "aw139-landing-03", "challenge": "Compass", "response": "DG" },
            { "id": "aw139-landing-04", "challenge": "DH", "response": "Set LDP" },
            { "id": "aw139-landing-05", "challenge": "Floats", "response": "A/R" },
            { "id": "aw139-landing-06", "challenge": "Landing Briefing", "response": "Performed" },
            { "id": "aw139-landing-07", "challenge": "Power Plant", "response": "All Green / No CAS" },
            { "id": "aw139-landing-08", "challenge": "Landing Area", "response": "Green Deck" }
          ]
        },
        {
          "id": "after-landing", "title": "AFTER LANDING", "method": "C/R",
          "trigger": "Onshore: Pista livre. Offshore: Pousado, coletivo embaixo e equalizado.",
          "complete": "Checklist complete. Standby Shut Down",
          "items": [
            { "id": "aw139-after-landing-01", "challenge": "Nose Wheel / Park Brk", "response": "Unlocked / Off" },
            { "id": "aw139-after-landing-02", "challenge": "RPM Switch", "response": "100% Nr" },
            { "id": "aw139-after-landing-03", "challenge": "Floats", "response": "Off" },
            { "id": "aw139-after-landing-04", "challenge": "Radar / Xponder", "response": "Stby" },
            { "id": "aw139-after-landing-05", "challenge": "External Lights", "response": "A/R" }
          ]
        },
        {
          "id": "shut-down", "title": "SHUT DOWN", "method": "C/R",
          "trigger": "Aeronave estacionada, freio aplicado e calços colocados.",
          "complete": "Checklist complete.",
          "items": [
            { "id": "aw139-shut-down-01", "challenge": "Nose Wheel / Park Brk", "response": "Locked / On" },
            { "id": "aw139-shut-down-02", "challenge": "Flight Controls", "response": "Centered / MPOG" },
            { "id": "aw139-shut-down-03", "challenge": "Bus Tie", "response": "On" },
            { "id": "aw139-shut-down-04", "challenge": "Eng Mode Switches", "response": "Idle / Timing" },
            { "id": "aw139-shut-down-05", "challenge": "Center Console", "response": "A/R" },
            { "id": "aw139-shut-down-06", "challenge": "Fuel Panel", "response": "A/R" },
            { "id": "aw139-shut-down-07", "challenge": "Eng Mode Switches (After 1 min)", "response": "Off" },
            { "id": "aw139-shut-down-08", "challenge": "Eng Fuel (≤ 10% Ng)", "response": "Off" },
            { "id": "aw139-shut-down-09", "challenge": "Rotor Brake (≤ 40% Nr)", "response": "Apply A/R" },
            { "id": "aw139-shut-down-10", "challenge": "External Lights", "response": "Off" },
            { "id": "aw139-shut-down-11", "challenge": "Fuel Qty", "response": "Noted" },
            { "id": "aw139-shut-down-12", "challenge": "Electrical Switches", "response": "A/R" }
          ]
        }
      ]
    },
    {
      "id": "h225", "name": "H225", "heading": "FROTA H225",
      "phases": [
        {
          "id": "preflight", "title": "PREFLIGHT", "method": "C/R",
          "trigger": "Tripulação técnica sentada e ajustada no cockpit (pós-scanflow).",
          "complete": "Checklist complete. Standby Before Start",
          "items": [
            { "id": "h225-preflight-01", "challenge": "Overhead Panel", "response": "Checked" },
            { "id": "h225-preflight-02", "challenge": "Engine Panel", "response": "Checked" },
            { "id": "h225-preflight-03", "challenge": "Emerg Fuel Shutoff Levers", "response": "Fwd & Snap Wired" },
            { "id": "h225-preflight-04", "challenge": "Arm Lever (Rotor Brake)", "response": "After" },
            { "id": "h225-preflight-05", "challenge": "Rotor Brake (If Wind < 30kt)", "response": "Forward" },
            { "id": "h225-preflight-06", "challenge": "Standby Compass", "response": "Checked" },
            { "id": "h225-preflight-07", "challenge": "Clocks", "response": "Set" },
            { "id": "h225-preflight-08", "challenge": "Sub Panel", "response": "Checked" },
            { "id": "h225-preflight-09", "challenge": "Static Sources", "response": "Norm & Snap Wired" },
            { "id": "h225-preflight-10", "challenge": "Landing Gear / Safety Pin", "response": "Down / Removed" },
            { "id": "h225-preflight-11", "challenge": "Collective & AP Hyd Cut-Out", "response": "Locked / Norm" },
            { "id": "h225-preflight-12", "challenge": "Circuit Breakers", "response": "All In" },
            { "id": "h225-preflight-13", "challenge": "AFCAU / RCU", "response": "Checked" },
            { "id": "h225-preflight-14", "challenge": "Emergency L/G Handle", "response": "Down & Guarded" },
            { "id": "h225-preflight-15", "challenge": "Parking Brake", "response": "On" },
            { "id": "h225-preflight-16", "challenge": "Nose Wheel", "response": "As Required" },
            { "id": "h225-preflight-17", "challenge": "Utility Hyd Accumulator Press", "response": "Green Arc" },
            { "id": "h225-preflight-18", "challenge": "Cabin & Safety Items", "response": "Checked" }
          ]
        },
        {
          "id": "before-start", "title": "BEFORE START", "method": "R/D",
          "trigger": "Preflight completo, preparação de cabine/cockpit finalizada e autorização obtida.",
          "complete": "Checklist complete. Standby After Start",
          "items": [
            { "id": "h225-before-start-01", "challenge": "DC GPU (If utilizing, Batt On within 5 sec)", "response": "On" },
            { "id": "h225-before-start-02", "challenge": "Battery (Min 25 Volts)", "response": "On" },
            { "id": "h225-before-start-03", "challenge": "Triple Tachs", "response": "Flags Off" },
            { "id": "h225-before-start-04", "challenge": "WCP", "response": "Test & Rearm" },
            { "id": "h225-before-start-05", "challenge": "FADEC & GOV", "response": "No Lights" },
            { "id": "h225-before-start-06", "challenge": "AC GPU (If utilizing, first Batt On)", "response": "On" },
            { "id": "h225-before-start-07", "challenge": "AC PWR / DC PWR Lights On", "response": "Check" },
            { "id": "h225-before-start-08", "challenge": "Emergency Bat", "response": "No Flow" },
            { "id": "h225-before-start-09", "challenge": "Air Conditioning (If utilizing 115VAC)", "response": "As Required" },
            { "id": "h225-before-start-10", "challenge": "Emerg / Heel Lights", "response": "Test & Arm" },
            { "id": "h225-before-start-11", "challenge": "PAX Signs", "response": "On" },
            { "id": "h225-before-start-12", "challenge": "Anticol / Position Lights", "response": "Red / On" },
            { "id": "h225-before-start-13", "challenge": "AVCS", "response": "On" },
            { "id": "h225-before-start-14", "challenge": "MGB / Engine Fire Test", "response": "Line & Fire Test" },
            { "id": "h225-before-start-15", "challenge": "Chip Detectors / IGB.T / TGB.T", "response": "Test" },
            { "id": "h225-before-start-16", "challenge": "VMS Lights (2 & 4 Lights)", "response": "Check" },
            { "id": "h225-before-start-17", "challenge": "Sub Panel", "response": "Checked" },
            { "id": "h225-before-start-18", "challenge": "Door Panel Lights", "response": "Check" },
            { "id": "h225-before-start-19", "challenge": "Fuel Qtd & Transfer", "response": "Check / Off" },
            { "id": "h225-before-start-20", "challenge": "Centre Console", "response": "On / Standby" },
            { "id": "h225-before-start-21", "challenge": "HUMS Card", "response": "Checked" },
            { "id": "h225-before-start-22", "challenge": "Perfo (MCDU)", "response": "Insert / Checked" },
            { "id": "h225-before-start-23", "challenge": "Flight Controls", "response": "Full and Free, Centred" },
            { "id": "h225-before-start-24", "challenge": "Collective & AP Hyd Cut-Out", "response": "Locked / Norm" },
            { "id": "h225-before-start-25", "challenge": "ATC (Clearance)", "response": "Obtained" }
          ]
        },
        {
          "id": "after-start", "title": "AFTER START", "method": "C/R",
          "trigger": "Partida completa dos motores, parâmetros normais/estabilizados e GPU desconectada.",
          "complete": "Checklist complete. Standby Before Taxi",
          "items": [
            { "id": "h225-after-start-01", "challenge": "Cockpit / Cabin Air Cond", "response": "On / As Required" },
            { "id": "h225-after-start-02", "challenge": "Engine Intake Anti-Ice", "response": "Tested & As Required" },
            { "id": "h225-after-start-03", "challenge": "VMS & Systems", "response": "Checked Normal" },
            { "id": "h225-after-start-04", "challenge": "Hydro Alt & Icedet", "response": "Tested & Off" },
            { "id": "h225-after-start-05", "challenge": "AFCS Preflight Test", "response": "Performed / AP 1 & 2 On" },
            { "id": "h225-after-start-06", "challenge": "Pitot & Windscreen Deice", "response": "On / As Required" },
            { "id": "h225-after-start-07", "challenge": "Floats & Fuel Pumps", "response": "Tested & Off / Tested & On" },
            { "id": "h225-after-start-08", "challenge": "Centre Console (FMS/TCAS/XPDR/SATCOM)", "response": "On / Standby" },
            { "id": "h225-after-start-09", "challenge": "ISIS, Compass & Altimeters (QNH)", "response": "Set / Compare" },
            { "id": "h225-after-start-10", "challenge": "WCP", "response": "No Lights" },
            { "id": "h225-after-start-11", "challenge": "Mecanic / Chock", "response": "Clear / Removed" }
          ]
        },
        {
          "id": "before-taxi", "title": "BEFORE TAXI", "method": "C/R",
          "trigger": "After Start completo, portas/passageiros prontos e intenção de táxi.",
          "complete": "Checklist complete. Standby Before Takeoff",
          "items": [
            { "id": "h225-before-taxi-01", "challenge": "NR ILS", "response": "Off / NR 100%" },
            { "id": "h225-before-taxi-02", "challenge": "Collective", "response": "Unlocked" },
            { "id": "h225-before-taxi-03", "challenge": "Parking Brake", "response": "Released" },
            { "id": "h225-before-taxi-04", "challenge": "Nose Wheel", "response": "Unlocked" },
            { "id": "h225-before-taxi-05", "challenge": "Landing Light", "response": "A/R" },
            { "id": "h225-before-taxi-06", "challenge": "Wheels Brakes", "response": "Check Pilot / Copilot" },
            { "id": "h225-before-taxi-07", "challenge": "ADI / ISIS / HSI", "response": "Check" },
            { "id": "h225-before-taxi-08", "challenge": "Fuel Quantity / Fuel Transfer", "response": "Check / Off" },
            { "id": "h225-before-taxi-09", "challenge": "Take Off Briefing / VTOSS / V1", "response": "Announced" }
          ]
        },
        {
          "id": "before-takeoff", "title": "BEFORE TAKEOFF", "method": "C/R",
          "trigger": "Onshore: Linha de parada/pista. Offshore: Helideck e passageiros prontos.",
          "complete": "Checklist complete. Standby After Takeoff",
          "items": [
            { "id": "h225-before-takeoff-01", "challenge": "Upper Modes", "response": "Preset" },
            { "id": "h225-before-takeoff-02", "challenge": "Anticolision / Flood Light", "response": "Both / On" },
            { "id": "h225-before-takeoff-03", "challenge": "NR", "response": "100%" },
            { "id": "h225-before-takeoff-04", "challenge": "AP / WCP / VMS", "response": "On / No Lights / Normal" },
            { "id": "h225-before-takeoff-05", "challenge": "Heating", "response": "Off" },
            { "id": "h225-before-takeoff-06", "challenge": "Bleed OFS Pushbutton (If OAT ≥ +25°C)", "response": "Press" },
            { "id": "h225-before-takeoff-07", "challenge": "ACAS / Transponder", "response": "Auto / Alt" },
            { "id": "h225-before-takeoff-08", "challenge": "Nose Wheel (When aligned)", "response": "Locked" },
            { "id": "h225-before-takeoff-09", "challenge": "Parking Brake", "response": "As Required" },
            { "id": "h225-before-takeoff-10", "challenge": "Flight Instruments / Margin Power / VMS", "response": "Checked" }
          ]
        },
        {
          "id": "after-takeoff", "title": "AFTER TAKEOFF", "method": "C/R",
          "trigger": "Cruzando 500 ft AGL e livre de tráfego/obstáculos.",
          "complete": "Checklist complete. Standby Cruise",
          "items": [
            { "id": "h225-after-takeoff-01", "challenge": "Landing Gear (300 ft / 80 kts)", "response": "Up / Lights Off" },
            { "id": "h225-after-takeoff-02", "challenge": "Bleed OFS Pushbutton", "response": "Depressed / Check VMS" },
            { "id": "h225-after-takeoff-03", "challenge": "WX Radar", "response": "On" },
            { "id": "h225-after-takeoff-04", "challenge": "Fuel (Qtd) / Transfer", "response": "Check Every 30 min / On" },
            { "id": "h225-after-takeoff-05", "challenge": "Landing Light", "response": "Off" },
            { "id": "h225-after-takeoff-06", "challenge": "Upper Modes", "response": "As Required" },
            { "id": "h225-after-takeoff-07", "challenge": "VMS", "response": "Normal" }
          ]
        },
        {
          "id": "cruise", "title": "CRUISE", "method": "C/R",
          "trigger": "Nivelado na altitude de cruzeiro e estabilizado em rota.",
          "complete": "Checklist complete. Standby Descent",
          "items": [
            { "id": "h225-cruise-01", "challenge": "WCP / VMS", "response": "No Lights / Normal" },
            { "id": "h225-cruise-02", "challenge": "Radio / Nav", "response": "Set" },
            { "id": "h225-cruise-03", "challenge": "Auto-Transfer", "response": "On" }
          ]
        },
        {
          "id": "descent", "title": "DESCENT", "method": "C/R",
          "trigger": "A 5 NM do TOD (FMS) ou autorização de descida ATC.",
          "complete": "Checklist complete. Standby Landing",
          "items": [
            { "id": "h225-descent-01", "challenge": "Type & App Briefing", "response": "Perform" },
            { "id": "h225-descent-02", "challenge": "Alt A. / DH / QNH", "response": "Set / Adjust" },
            { "id": "h225-descent-03", "challenge": "Nav Aids Setting", "response": "Set" },
            { "id": "h225-descent-04", "challenge": "WCP / VMS", "response": "No Lights / Normal" },
            { "id": "h225-descent-05", "challenge": "Helideck Contact", "response": "Done" }
          ]
        },
        {
          "id": "landing", "title": "LANDING", "method": "C/R",
          "trigger": "Onshore/Offshore: A 5 NM do destino, na altitude de tráfego.",
          "complete": "Checklist complete. Standby After Landing",
          "items": [
            { "id": "h225-landing-01", "challenge": "Fuel (Qtd) / Transfer", "response": "Check / Off" },
            { "id": "h225-landing-02", "challenge": "WX Radar", "response": "As Required" },
            { "id": "h225-landing-03", "challenge": "Bleed OFS Pushbutton (If OAT ≥ +25°C)", "response": "Press" },
            { "id": "h225-landing-04", "challenge": "Landing Gear", "response": "Down '3 Greens'" },
            { "id": "h225-landing-05", "challenge": "Landing Light", "response": "As Required" },
            { "id": "h225-landing-06", "challenge": "Parking Brake", "response": "As Required" },
            { "id": "h225-landing-07", "challenge": "Nose Wheel", "response": "Locked" },
            { "id": "h225-landing-08", "challenge": "WCP / VMS", "response": "No Lights / Normal" }
          ]
        },
        {
          "id": "after-landing", "title": "AFTER LANDING", "method": "C/R",
          "trigger": "Onshore: Pista livre. Offshore: Pousado, coletivo embaixo e equalizado.",
          "complete": "Checklist complete. Standby Shut Down",
          "items": [
            { "id": "h225-after-landing-01", "challenge": "Nose Wheel / Parking Brake", "response": "As Required" },
            { "id": "h225-after-landing-02", "challenge": "Landing Light", "response": "As Required" },
            { "id": "h225-after-landing-03", "challenge": "Anticolision", "response": "Red" },
            { "id": "h225-after-landing-04", "challenge": "Flood Light", "response": "Off" },
            { "id": "h225-after-landing-05", "challenge": "XPDR / TCAS / WX Radar", "response": "Std By" }
          ]
        },
        {
          "id": "shut-down", "title": "SHUT DOWN", "method": "C/R",
          "trigger": "Aeronave estacionada, freio aplicado e calços colocados.",
          "complete": "Checklist complete.",
          "items": [
            { "id": "h225-shut-down-01", "challenge": "Parking Brake", "response": "On" },
            { "id": "h225-shut-down-02", "challenge": "Cyclic", "response": "Centered & Locked" },
            { "id": "h225-shut-down-03", "challenge": "Collective", "response": "Full Down & Locked" },
            { "id": "h225-shut-down-04", "challenge": "Collective & Cyclic Trim", "response": "Press" },
            { "id": "h225-shut-down-05", "challenge": "APM 1 / APM 2", "response": "Off" },
            { "id": "h225-shut-down-06", "challenge": "MFDs", "response": "Off" },
            { "id": "h225-shut-down-07", "challenge": "Ldg Lgt / Sat Com / Floats", "response": "Off" },
            { "id": "h225-shut-down-08", "challenge": "Pitot / Windscreen / Bleed OFS", "response": "Off" },
            { "id": "h225-shut-down-09", "challenge": "WX Radar / Radios", "response": "Off" },
            { "id": "h225-shut-down-10", "challenge": "FMS / RADALT", "response": "Off" },
            { "id": "h225-shut-down-11", "challenge": "Booster Pumps", "response": "Off" },
            { "id": "h225-shut-down-12", "challenge": "Air Cond. / Heater / Eng Deice", "response": "Off" },
            { "id": "h225-shut-down-13", "challenge": "Eng Control Switches (Af. 1')", "response": "Idle 2 Sec. Then Stop" },
            { "id": "h225-shut-down-14", "challenge": "Arm Lever (Rotor Brake - Nr<45%)", "response": "Aft & Light On" },
            { "id": "h225-shut-down-15", "challenge": "Rotor Brake", "response": "Apply (Nr<45%)" },
            { "id": "h225-shut-down-16", "challenge": "A.Pump / Hyd Heating", "response": "Off" },
            { "id": "h225-shut-down-17", "challenge": "After Rotor Stops - PAX Signs", "response": "Off" },
            { "id": "h225-shut-down-18", "challenge": "Overhead Lighting Control Panel", "response": "All Switches Off" },
            { "id": "h225-shut-down-19", "challenge": "Fuel Qty", "response": "Check" },
            { "id": "h225-shut-down-20", "challenge": "N1/N2 Cycles (FADEC page)", "response": "Check" },
            { "id": "h225-shut-down-21", "challenge": "Main Hyd. Accumulator", "response": "Checked" },
            { "id": "h225-shut-down-22", "challenge": "Ldg Gear / Eng Safety Pins", "response": "Installed" },
            { "id": "h225-shut-down-23", "challenge": "M'ARMS Data Transfer (N1<5%)", "response": "Done" },
            { "id": "h225-shut-down-24", "challenge": "Flight Data", "response": "Acknowledge" },
            { "id": "h225-shut-down-25", "challenge": "Bat. Switch / Emerg Bat", "response": "Off / No Flow" }
          ]
        }
      ]
    }
  ]
};
