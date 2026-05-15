# C2 Despliegue — Variante Structurizr

Esta variante usa **Structurizr DSL** (`workspace.dsl`) como única fuente de verdad y un renderizador oficial (Structurizr Lite o el viewer online) para visualizar el diagrama.

A diferencia de las otras 4 variantes, **aquí no hay JS de render**: Structurizr es un DSL pensado para describir modelos C4 de forma textual y delegar el layout al motor oficial.

## Ventajas

- **DSL declarativo**: jerarquía `softwareSystem → container` mapea 1:1 a C4.
- **Una sola fuente** para múltiples vistas (Context, Container, Deployment, Component).
- **Estilos por tag**: paleta Tuya aplicada con `element "Future"`, `"Core"`, etc.
- **Versionable**: el `.dsl` es texto plano, ideal para PRs.
- **Exports**: PNG, SVG, PlantUML, Mermaid, draw.io desde el viewer.

## Limitaciones

- **No es JS**: requiere un viewer externo (Structurizr Lite o Cloud).
- **Auto-layout únicamente** (`autoLayout`) — no se puede hacer drag de posiciones desde el DSL; sólo desde la UI del viewer.
- **Edge routing limitado** comparado con ELK/dagre puros.

## Cómo visualizar

### Opción A — Structurizr Lite (Docker, recomendada)

```powershell
cd presentation\02-deployment-structurizr
docker run -it --rm -p 8080:8080 -v ${PWD}:/usr/local/structurizr structurizr/lite
```

Luego abre <http://localhost:8080> y navega a **Diagrams → Production**.

### Opción B — Structurizr DSL online

1. Abre <https://structurizr.com/dsl>.
2. Copia el contenido de `workspace.dsl` en el editor.
3. Pulsa **Render**.

### Opción C — Structurizr CLI (export a PNG/SVG/PlantUML)

```powershell
# Requiere structurizr-cli en PATH
structurizr-cli export -workspace workspace.dsl -format png -output .\out
```

## Archivos

- `workspace.dsl` — modelo + relaciones + vistas + estilos.
- (generados) `*.png` / `*.svg` — exportados del viewer.

## Por qué Structurizr no compite con las otras 4 variantes

Las otras variantes (Cytoscape, G6, React Flow, D3+dagre, Sigma) son **librerías JS de render**. Structurizr es un **DSL + motor de modelado C4** que produce diagramas opinados según el estándar C4. Lo incluimos en la comparativa porque es el **enfoque más "puro" C4-as-code** y es relevante para arquitectos que valoran consistencia sobre flexibilidad visual.
