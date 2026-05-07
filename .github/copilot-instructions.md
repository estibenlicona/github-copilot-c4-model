# Copilot instructions

## Project purpose

This repository contains **C4 model architecture diagrams for GitHub Copilot**, authored as **draw.io** files and produced/edited via the draw.io MCP server.

The C4 model has four levels — use them as the organizing principle for any diagram added here:

1. **Context** — Copilot and the people / external systems it interacts with.
2. **Container** — the deployable/runnable units that make up Copilot (IDE extensions, CLI, backend services, model providers, etc.).
3. **Component** — internals of a single container.
4. **Code** — class/structure level (rarely needed; only add when a component is non-obvious).

When asked to add or modify a diagram, first identify which C4 level it belongs to and place it accordingly.

## Tooling

- Diagrams are authored in **draw.io** (`.drawio` / `.drawio.svg` / `.drawio.png` / `.drawio.pdf`).
- **Primary workflow: the drawio skill** — see [`.github/skills/drawio/SKILL.md`](skills/drawio/SKILL.md). Read it before authoring or editing any diagram. It defines how to write `.drawio` XML directly to disk and how to invoke the local draw.io desktop CLI (`C:\Program Files\draw.io\draw.io.exe`) for PNG/SVG/PDF export with embedded XML.
- The draw.io MCP tools (`drawio-open_drawio_xml`, `drawio-open_drawio_mermaid`, `drawio-open_drawio_csv`) remain available as an alternative renderer for previewing in chat.
- Prefer **draw.io XML** (not Mermaid) for C4 diagrams — it gives precise control over containers, swimlanes, and the C4 shape library.

## Conventions for C4 diagrams in draw.io

- **One file per C4 level per scope.** Suggested layout:
  - `diagrams/01-context.drawio`
  - `diagrams/02-container.drawio`
  - `diagrams/03-component-<container-name>.drawio`
- **Use the C4 shape style strings** from draw.io's built-in C4 library rather than generic rectangles. Examples:
  - Person: `shape=mxgraph.c4.person2;...;html=1;`
  - Software System: `rounded=1;whiteSpace=wrap;html=1;fillColor=#1168BD;strokeColor=#0B4884;fontColor=#ffffff;`
  - External System: `fillColor=#999999;strokeColor=#6B6B6B;fontColor=#ffffff;`
  - Container: `fillColor=#438DD5;strokeColor=#2E6295;fontColor=#ffffff;`
  - Component: `fillColor=#85BBF0;strokeColor=#5D82A8;fontColor=#000000;`
- **Every element label must include**: name, `[Type]` (e.g. `[Container: TypeScript]`), and a one-line description. Use `<br>` with `html=1` for line breaks.
- **Every relationship label must include**: verb phrase + protocol/technology, e.g. `Sends prompts to<br>[HTTPS/JSON]`.
- **Edges**: `edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;` for container/component diagrams; let routing be automatic — don't add `<mxPoint>` waypoints.
- **Boundaries** (system boundary, container boundary) are `swimlane` containers with `startSize=24` and pastel fill; nested elements use `parent="<boundary-id>"` with coordinates relative to the boundary.
- **Match the user's language** in all diagram labels.

## When exporting

- Commit both the editable source (`.drawio` or `.drawio.xml`) and a rendered `.drawio.svg` (or `.png`) alongside it, so diagrams are reviewable without opening draw.io.
- Keep file names kebab-case and prefixed with the C4 level number.

## Out of scope

There is no application code, build, test, or lint pipeline in this repo — it is a documentation/diagram repository. Skip "run tests / run build" steps; review work by opening the diagram in draw.io (via MCP) and visually verifying it.
