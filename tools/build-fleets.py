#!/usr/bin/env python3
"""Regenerate src/data/fleets.js from the caderno .docx.

Usage: python3 tools/build-fleets.py caderno-checklists-frota-omni-padronizado-v7.docx

Reads every "FROTA <name>" heading and the checklist tables that follow it.
Each table must be: title row "<PHASE> (C/R|R/D)", "Gatilho: …" row, item
rows (challenge | response), "► Checklist complete…" row. Text is copied
verbatim; the script stops with an error if a table does not match.
"""
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
PHASE_IDS = {
    "PREFLIGHT": "preflight", "BEFORE START": "before-start", "AFTER START": "after-start",
    "BEFORE TAXI": "before-taxi", "BEFORE TAKEOFF": "before-takeoff", "AFTER TAKEOFF": "after-takeoff",
    "CRUISE": "cruise", "DESCENT": "descent", "LANDING": "landing",
    "AFTER LANDING": "after-landing", "SHUT DOWN": "shut-down",
}
DEFAULT_FLEET = "aw139"


def para_text(p):
    out = ""
    for r in p.iter(W + "r"):
        for c in r:
            if c.tag == W + "t":
                out += c.text or ""
            elif c.tag == W + "br" and c.get(W + "type") is None:
                out += "\n"
    return out


def cell_text(tc):
    return "\n".join(para_text(p) for p in tc.findall(W + "p")).strip()


def fill(tc):
    shd = tc.find(W + "tcPr/" + W + "shd")
    return shd.get(W + "fill") if shd is not None else None


def part_text(zf, name):
    root = ET.fromstring(zf.read(name))
    return "".join(para_text(p) for p in root.iter(W + "p"))


def parse(path):
    with zipfile.ZipFile(path) as zf:
        body = ET.fromstring(zf.read("word/document.xml")).find(W + "body")
        header = part_text(zf, "word/header1.xml")
        footer = part_text(zf, "word/footer1.xml")
    intro, fleets, fleet = [], [], None
    for el in body:
        if el.tag == W + "p":
            text = para_text(el).strip()
            if not text:
                continue
            m = re.match(r"^FROTA (.+)$", text)
            if m:
                name = m.group(1).strip()
                fleet = {"id": re.sub(r"[^a-z0-9]", "", name.lower()), "name": name, "heading": text, "phases": []}
                fleets.append(fleet)
            elif fleet is None:
                intro.append(text)
        elif el.tag == W + "tbl":
            rows = [tr.findall(W + "tc") for tr in el.findall(W + "tr")]
            title = cell_text(rows[0][0])
            m = re.match(r"^(.+?) \((C/R|R/D)\)$", title)
            assert m and fill(rows[0][0]) == "1B365D", f"title row: {title!r}"
            trigger, complete = cell_text(rows[1][0]), cell_text(rows[-1][0])
            assert trigger.startswith("Gatilho: "), f"trigger row: {trigger!r}"
            assert complete.startswith("► "), f"complete row: {complete!r}"
            phase_id = PHASE_IDS[m.group(1)]
            items = []
            for k, cells in enumerate(rows[2:-1]):
                assert len(cells) == 2, f"{fleet['name']} {title}: row {k + 1} has {len(cells)} cells"
                items.append({
                    "id": f"{fleet['id']}-{phase_id}-{k + 1:02d}",
                    "challenge": cell_text(cells[0]),
                    "response": cell_text(cells[1]),
                })
            fleet["phases"].append({
                "id": phase_id, "title": m.group(1), "method": m.group(2),
                "trigger": trigger[len("Gatilho: "):], "complete": complete[len("► "):],
                "items": items,
            })
    for f in fleets:
        got = [p["id"] for p in f["phases"]]
        assert got == list(PHASE_IDS.values()), f"{f['name']}: unexpected phases {got}"
    return intro, header, footer, fleets


def to_js(source, intro, header, footer, fleets):
    j = lambda v: json.dumps(v, ensure_ascii=False)
    version = re.search(r"(v\d+)", source)
    lines = [
        f"// Generated from {j(source)} by tools/build-fleets.py.",
        "// Text is reproduced verbatim from the document — do not edit by hand.",
        "export const caderno = {",
        f'  "title": {j(intro[0])},',
        f'  "subtitle": {j(intro[1])},',
        f'  "notes": [{", ".join(j(n) for n in intro[2].split(chr(10)))}],',
        f'  "pageHeader": {j(header)},',
        f'  "pageFooter": {j(footer)},',
        f'  "source": {j(source)},',
        f'  "version": {j(version.group(1) if version else "")},',
        f'  "defaultFleetId": {j(DEFAULT_FLEET)},',
        '  "fleets": [',
    ]
    for fi, f in enumerate(fleets):
        lines += ["    {", f'      "id": {j(f["id"])}, "name": {j(f["name"])}, "heading": {j(f["heading"])},', '      "phases": [']
        for pi, p in enumerate(f["phases"]):
            lines += [
                "        {",
                f'          "id": {j(p["id"])}, "title": {j(p["title"])}, "method": {j(p["method"])},',
                f'          "trigger": {j(p["trigger"])},',
                f'          "complete": {j(p["complete"])},',
                '          "items": [',
            ]
            for ii, it in enumerate(p["items"]):
                comma = "," if ii < len(p["items"]) - 1 else ""
                lines.append(f'            {{ "id": {j(it["id"])}, "challenge": {j(it["challenge"])}, "response": {j(it["response"])} }}{comma}')
            lines += ["          ]", "        }" + ("," if pi < len(f["phases"]) - 1 else "")]
        lines += ["      ]", "    }" + ("," if fi < len(fleets) - 1 else "")]
    lines += ["  ]", "};"]
    return "\n".join(lines) + "\n"


if __name__ == "__main__":
    src = sys.argv[1]
    intro, header, footer, fleets = parse(src)
    js = to_js(src.split("/")[-1], intro, header, footer, fleets)
    with open("src/data/fleets.js", "w", encoding="utf-8") as fh:
        fh.write(js)
    for f in fleets:
        print(f"{f['heading']}: {len(f['phases'])} checklists, {sum(len(p['items']) for p in f['phases'])} itens")
