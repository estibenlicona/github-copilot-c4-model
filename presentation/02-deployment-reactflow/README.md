# C2 Despliegue — Variante React Flow (XY Flow)

Implementación del diagrama C2 de despliegue de GitHub Copilot usando **React Flow v12 (XY Flow)** con layout calculado mediante **ELK** y exportación PNG vía `html-to-image`.

## Stack

| Pieza | Versión |
|-------|---------|
| React | 18 |
| Vite | 5 |
| `@xyflow/react` | 12 |
| `elkjs` | 0.9 |
| `html-to-image` | 1.11 |

## Cómo correrlo

```powershell
cd presentation\02-deployment-reactflow
npm install
npm run dev
```

Abre <http://localhost:5173> automáticamente.

## Decisiones

- **Layout:** ELK `layered` con `hierarchyHandling: INCLUDE_CHILDREN` y `edgeRouting: ORTHOGONAL` para respetar los 3 niveles de anidamiento (env → node-active → ns-mcp → unit).
- **Nodos:** dos tipos custom (`leaf` y `group`) con HTML/CSS estilizados con paleta Tuya.
- **Edges:** `smoothstep` (curvas con esquinas redondeadas), animadas y discontinuas para relaciones `future`.
- **Interacción:** drag de canvas, zoom con rueda, minimapa, controles, todo nativo de React Flow.

## Diferencias vs Cytoscape.js

| Aspecto | React Flow | Cytoscape |
|---------|-----------|-----------|
| Nodos HTML/CSS | nativo (componentes React) | requiere plugin `node-html-label` |
| Routing nested | requiere ELK externo | ELK también; mejor integrado |
| MiniMap/Controles | incluidos | requieren código manual |
| Tooltips ricos | `title` attribute o lib externa | `cytoscape-popper` + tippy |
| Edge labels con fondo | nativo | sí |
| Tamaño bundle | pesado (React + RF) | ligero |

## Limitaciones conocidas

- ELK no garantiza cero cruces; con grafos densos como el C2 algunos edges pueden cruzar nodos.
- Las posiciones quedan fijas tras el cálculo; arrastrar nodos requiere `draggable: true` (deshabilitado para preservar layout).
