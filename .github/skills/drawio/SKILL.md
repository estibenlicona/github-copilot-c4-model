---
name: drawio
description: Use whenever the user asks to create, generate, draw, design, edit, or export a diagram (flowchart, architecture, C4, ER, sequence, class, state, network, mockup, wireframe), or mentions draw.io / drawio / .drawio files / export to PNG/SVG/PDF.
---

# Draw.io Diagram Skill (Copilot CLI · Windows)

Adapted from the official Anthropic Claude Code skill at
https://github.com/jgraph/drawio-mcp/tree/main/skill-cli
for **GitHub Copilot CLI on Windows native**.

Generate draw.io diagrams as native `.drawio` files. Optionally export to PNG, SVG, or PDF with the diagram XML embedded so the exported file remains editable in draw.io.

## How to create a diagram

1. **Generate draw.io XML** in mxGraphModel format for the requested diagram. Follow the XML reference (link below) — especially the rules on edges (every edge needs a child `<mxGeometry relative="1" as="geometry"/>`), containers (`swimlane;startSize=...`), HTML labels (`html=1` + escaped `&lt;` `&gt;` `&amp;`), and **never include XML comments** (`<!-- -->`).
2. **Write the XML** to a `.drawio` file in the current working directory using the `create` tool (or `edit` if updating an existing file).
3. **If the user requested an export format** (`png`, `svg`, `pdf`), run the draw.io CLI export command (see below) with `-e` to embed the XML, then delete the intermediate `.drawio` file with `Remove-Item`. If draw.io desktop is not installed, keep the `.drawio` file and tell the user.
4. **Open the result** with `Invoke-Item` (or `Start-Process`). If opening fails, print the absolute file path so the user can open it manually.

## Choosing the output format

Inspect the user's request for a format hint. Examples:

- "create a flowchart" → `flowchart.drawio`
- "png flowchart for login" → `login-flow.drawio.png`
- "svg ER diagram" → `er-diagram.drawio.svg`
- "pdf architecture overview" → `architecture-overview.drawio.pdf`

If no format is mentioned, just write the `.drawio` file and open it. The user can always ask to export later.

### Supported export formats

| Format | Embed XML | Notes |
|--------|-----------|-------|
| `png`  | Yes (`-e`) | Viewable everywhere, editable in draw.io |
| `svg`  | Yes (`-e`) | Scalable, editable in draw.io |
| `pdf`  | Yes (`-e`) | Printable, editable in draw.io |
| `jpg`  | No         | Lossy, no embedded XML |

## draw.io CLI on Windows

Detected install path on this machine:

```
C:\Program Files\draw.io\draw.io.exe
```

If that path doesn't exist, also check:

```
$env:LOCALAPPDATA\Programs\draw.io\draw.io.exe
```

Use `where.exe drawio` first — fall back to the explicit path if not on PATH.

### Export command (PowerShell)

```powershell
& "C:\Program Files\draw.io\draw.io.exe" -x -f png -e -b 10 -o diagram.drawio.png diagram.drawio
```

Key flags:
- `-x` / `--export` — export mode
- `-f` / `--format` — `png`, `svg`, `pdf`, `jpg`
- `-e` / `--embed-diagram` — embed XML (PNG/SVG/PDF)
- `-o` / `--output` — output file
- `-b` / `--border` — border width (default 0)
- `-t` / `--transparent` — transparent background (PNG only)
- `-s` / `--scale` — scale factor
- `--width` / `--height` — fit into dimensions (preserves aspect)
- `-a` / `--all-pages` — export all pages (PDF)
- `-p` / `--page-index` — specific page (1-based)

Note: The draw.io desktop GUI may need to be **closed** before running CLI export — only one instance can hold the app's IPC socket on Windows.

### Opening the result

```powershell
Invoke-Item .\diagram.drawio
# or
Start-Process .\diagram.drawio.png
```

## File naming

- Descriptive, kebab-case filenames: `login-flow`, `database-schema`, `01-context-copilot`.
- Double extension for exports — `name.drawio.png`, `name.drawio.svg`, `name.drawio.pdf` — signals embedded XML.
- Delete the intermediate `.drawio` after a successful embedded export; the exported file is fully editable.

## XML format

A `.drawio` file is native mxGraphModel XML. Always generate XML directly — Mermaid and CSV require draw.io's server-side conversion and cannot be saved as native files.

### Minimum structure

```xml
<mxGraphModel adaptiveColors="auto">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
  </root>
</mxGraphModel>
```

- `id="0"` is the root.
- `id="1"` is the default layer; all elements use `parent="1"` unless layered.

## XML reference

For the complete draw.io XML reference (styles, edge routing, containers, layers, tags, metadata, dark-mode colors, well-formedness rules, C4 patterns), fetch and follow:

https://raw.githubusercontent.com/jgraph/drawio-mcp/main/shared/xml-reference.md

Copilot's built-in `drawio-open_drawio_xml` tool prompt is also a faithful copy of this reference — consult it when offline.

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `draw.io.exe` not found | Desktop app not installed | Keep the `.drawio` file; ask the user to install draw.io Desktop |
| Empty/corrupt export | Invalid XML (comments, unescaped `<`/`&`) | Re-validate well-formedness; remove all `<!-- -->` |
| Diagram opens blank | Missing `id="0"` / `id="1"` root cells | Include the minimum mxGraphModel structure |
| Edges not rendering | Self-closing edge `<mxCell ... edge="1" />` | Every edge needs `<mxGeometry relative="1" as="geometry"/>` as a child |
| CLI hangs / locks file | draw.io GUI is open | Close the GUI window, retry export |
| File won't open | Path issues | Print the absolute path so the user can open it manually |

## CRITICAL: XML well-formedness

- **NEVER include any XML comments** (`<!-- -->`).
- Escape special characters in attribute values: `&amp;`, `&lt;`, `&gt;`, `&quot;`.
- Every `mxCell` `id` must be unique.
- Every edge cell must have a child `<mxGeometry relative="1" as="geometry"/>` — never self-closing.

## Differences vs the original Claude Code skill

| Aspect | Claude Code (original) | Copilot CLI (this adaptation) |
|--------|------------------------|-------------------------------|
| File-write tool | `Write` | `create` / `edit` |
| Shell | bash (Linux/macOS/WSL2) | PowerShell on Windows |
| Open command | `open` / `xdg-open` / `cmd.exe /c start` | `Invoke-Item` / `Start-Process` |
| draw.io path | `/mnt/c/Program Files/draw.io/draw.io.exe` (WSL2) | `C:\Program Files\draw.io\draw.io.exe` |
| Skill loader | `~/.claude/skills/drawio/SKILL.md` (auto) | Referenced from `.github/copilot-instructions.md` (manual) |
| Edge post-process | `npx @drawio/postprocess` if available | Same — skip silently if not installed |
| MCP fallback | None — XML only | Copilot's `drawio-open_*` MCP tools available as alternative renderer |
