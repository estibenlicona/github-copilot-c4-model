# Copilot instructions

## Project purpose

This repository contains **C4 model architecture diagrams for GitHub Copilot**, authored as **draw.io** files and produced/edited via the draw.io MCP server.

The C4 model has four levels — use them as the organizing principle for any diagram added here:

1. **Context (C1)** — Copilot and the people / external systems it interacts with.
2. **Container (C2)** — the deployable/runnable units that make up Copilot (IDE extensions, CLI, backend services, model providers, etc.).
3. **Component (C3)** — internals of a single container (called "módulos" in Tuya).
4. **Code (C4)** — class/structure level (rarely needed; only add when a component is non-obvious).

When asked to add or modify a diagram, first identify which C4 level it belongs to and place it accordingly.

## Tooling

### Diagramas (draw.io)

- Diagrams are authored in **draw.io** (`.drawio` / `.drawio.svg` / `.drawio.png` / `.drawio.pdf`).
- **Primary workflow: the drawio skill** — see [`.github/skills/drawio/SKILL.md`](skills/drawio/SKILL.md). **Read it first** — it defines:
  - **Paleta de colores oficial de Tuya** (Persona `#08427B`, Sistema `#1168BD`, Contenedor `#438DD5`, Módulo `#63BEF2`, Externo `#999999`, etc.)
  - **Nomenclatura corporativa** (nombres en negrita, sufijos `++`/`**`, tipos en corchetes)
  - **Estilos XML copiables** para cada elemento C4
  - **Ejemplos XML** para C1, C2 y C3
- The draw.io MCP tools (`drawio-open_drawio_xml`, `drawio-open_drawio_mermaid`, `drawio-open_drawio_csv`) remain available as an alternative renderer for previewing in chat.
- Prefer **draw.io XML** (not Mermaid) for C4 diagrams — it gives precise control over containers, swimlanes, and the C4 shape library.

### Documentación Wiki (Azure DevOps)

- **Documentación técnica:** usa el skill [`.github/skills/azdo-wiki/SKILL.md`](skills/azdo-wiki/SKILL.md) para generar Markdown compatible con Azure DevOps Wiki.
- **Características especiales:** `[[_TOC_]]`, alertas (`::: tip`, `::: warning`), diagramas Mermaid (`::: mermaid`), referencias a Work Items (`#ID`), menciones (`@usuario`).
- **Cuándo usar cada skill:**
  | Contenido | Skill |
  |-----------|-------|
  | Diagramas C4 detallados | `drawio` |
  | Diagramas simples en Wiki | `azdo-wiki` (Mermaid) |
  | Documentación técnica | `azdo-wiki` |
  | Arquitectura visual compleja | `drawio` → exportar PNG → `azdo-wiki` |

## Conventions for C4 diagrams in draw.io

> **Fuente de verdad:** para colores hex y estilos completos, consultar el skill en `.github/skills/drawio/SKILL.md`.

- **One file per C4 level per scope.** Suggested layout:
  - `diagrams/01-context.drawio`
  - `diagrams/02-container.drawio`
  - `diagrams/03-component-<container-name>.drawio`

### Nomenclatura Tuya

- **Nombres en negrita:** `<b>Nombre</b>`
- **Sufijo `++`** para elementos nuevos (a crear)
- **Sufijo `**`** para elementos modificados
- **Tipo en corchetes:** `[Deployment unit: API]`, `[Module: Data Access]`, `[Software System]`
- **Relaciones:** verbo + protocolo en corchetes, e.g. `Consulta datos<br>[JSON/HTTPS]`

### Labels

- **Every element label must include**: name (bold), `[Type]`, and a one-line description. Use `<br>` with `html=1` for line breaks.
- **Every relationship label must include**: verb phrase + protocol/technology in brackets.

### Edges and containers

- **Edges**: `edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeColor=#828282;` — let routing be automatic.
- **Boundaries** (system boundary, container boundary) are `swimlane` containers with `startSize=24` or `startSize=30` and pastel/transparent fill.
- **Match the user's language** in all diagram labels.

## When exporting

- Commit both the editable source (`.drawio` or `.drawio.xml`) and a rendered `.drawio.svg` (or `.png`) alongside it, so diagrams are reviewable without opening draw.io.
- Keep file names kebab-case and prefixed with the C4 level number.

## Out of scope

There is no application code, build, test, or lint pipeline in this repo — it is a documentation/diagram repository. Skip "run tests / run build" steps; review work by opening the diagram in draw.io (via MCP) and visually verifying it.
