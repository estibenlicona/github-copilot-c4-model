# Comparativo de librerías para el C2 Despliegue de GitHub Copilot

Este documento compara **6 implementaciones** del mismo diagrama (C2 Despliegue de GitHub Copilot en Tuya) usando librerías de visualización diferentes, con el fin de elegir la mejor opción para diagramas de arquitectura C4 interactivos.

> **Punto de partida:** [`presentation/02-deployment-copilot-premium.html`](../presentation/02-deployment-copilot-premium.html) (Cytoscape.js + ELK), que ya rinde el C2 con detalle premium.
>
> **Reto:** ¿Existe una librería que dé un resultado **visualmente superior** o con mejor UX/routing/anidamiento?

---

## 1. Variantes implementadas

| # | Librería            | Stack                         | Carpeta                                     | Cómo abrirla |
|---|---------------------|-------------------------------|---------------------------------------------|--------------|
| 0 | **Cytoscape.js + ELK** (baseline) | CDN vanilla         | [`02-deployment-copilot-premium.html`](../presentation/02-deployment-copilot-premium.html) | Abrir directo |
| 1 | **G6 v5 (AntV)**    | CDN vanilla                   | [`02-deployment-g6/`](../presentation/02-deployment-g6/) | Abrir `index.html` |
| 2 | **React Flow v12**  | Vite + React + ELK            | [`02-deployment-reactflow/`](../presentation/02-deployment-reactflow/) | `npm install && npm run dev` |
| 3 | **D3 + dagre-d3**   | CDN vanilla                   | [`02-deployment-d3-dagre/`](../presentation/02-deployment-d3-dagre/) | Abrir `index.html` |
| 4 | **Sigma.js v2 + Graphology** | CDN vanilla         | [`02-deployment-sigma/`](../presentation/02-deployment-sigma/) | Abrir `index.html` |
| 5 | **Structurizr DSL** | DSL + Structurizr Lite/Cloud  | [`02-deployment-structurizr/`](../presentation/02-deployment-structurizr/) | Docker (ver README) |

---

## 2. Matriz comparativa

| Criterio                              | Cytoscape (baseline) | G6 v5      | React Flow v12 | D3+dagre-d3  | Sigma.js v2  | Structurizr |
|---------------------------------------|----------------------|------------|----------------|--------------|--------------|-------------|
| **Soporte de anidamiento (compound)** | ✅ Nativo (3 niveles) | ✅ Combos nativos | ✅ `parentId` + ELK | 🟡 Clusters limitados | ❌ No nativo | ✅ deployment nodes |
| **Layout engine**                     | ELK layered          | antv-dagre | ELK layered    | dagre-d3     | ForceAtlas2  | Graphviz oficial |
| **Routing ortogonal real**            | ✅ ELK ortho          | ✅ Polyline | ✅ Smoothstep   | 🟡 Curvas    | ❌ Línea recta | ✅ Auto |
| **Labels multilínea**                 | ✅                    | ✅          | ✅ (HTML/JSX)  | ✅ (HTML)    | ❌ Una línea | ✅ |
| **Tooltips ricos**                    | ✅ Custom HTML        | ✅ Plugin   | ✅ Componente React | ✅ Custom HTML | 🟡 title nativo | ✅ Viewer oficial |
| **Edge labels con protocolo**         | ✅                    | ✅          | ✅              | ✅            | ❌            | ✅ |
| **Pan/zoom**                          | ✅                    | ✅          | ✅ + minimap   | ✅            | ✅            | ✅ |
| **Export PNG**                        | ✅                    | ✅ nativo   | ✅ html-to-image | ✅ SVG→canvas | ✅ canvas merge | ✅ desde viewer |
| **Apto para C4 corporativo**          | ⭐⭐⭐⭐⭐               | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐         | ⭐⭐⭐         | ⭐            | ⭐⭐⭐⭐ |
| **Esfuerzo de implementación**        | Medio                | Bajo       | Alto (Vite)    | Medio        | Bajo         | Muy bajo |
| **Tamaño bundle aprox.**              | ~600 KB              | ~700 KB    | ~400 KB + React | ~400 KB    | ~200 KB      | n/a (servidor) |
| **Licencia**                          | MIT                  | MIT        | MIT            | MIT          | MIT          | Apache 2.0 |

---

## 3. Pros / contras por librería

### 0. Cytoscape.js + ELK (baseline)
**Pros**
- Maduro, estable, ecosistema enorme.
- ELK `layered` con `INCLUDE_CHILDREN` produce anidamiento limpio.
- Selectores tipo CSS muy potentes para estilizar.

**Contras**
- API algo verbosa para casos simples.
- Estilos vía objeto JS, no HTML/JSX.

### 1. G6 v5 (AntV)
**Pros**
- **Combos** nativos: anidamiento de hasta 3 niveles sin trucos.
- API moderna (v5 reescrita con TypeScript) y muy declarativa.
- Plugins listos (tooltip, minimap, legend).
- Layouts integrados (dagre, force, radial, circular).
- Routing **polyline ortogonal** con obstacle-avoidance fuera de la caja.

**Contras**
- v5 es nueva (oct/2024); algunos ejemplos de internet aún usan v4 con API distinta.
- Documentación parcialmente en chino.

**Veredicto:** mejor candidato si quieres permanecer en vanilla JS.

### 2. React Flow v12 (@xyflow)
**Pros**
- **Mejor experiencia visual** de las 5: nodos son componentes React → control total del DOM, tipografía y animaciones.
- Edges `smoothstep` se ven elegantes; soporta handles fijos y bezier custom.
- MiniMap, Controls y Background nativos.
- ELK como motor de layout funciona perfectamente con `INCLUDE_CHILDREN`.

**Contras**
- Requiere build (Vite) — no es CDN vanilla.
- Más esfuerzo inicial para wiring.
- Bundle React añade ~130 KB gzipped.

**Veredicto:** mejor opción si el repo ya usa React, o si se acepta build step.

### 3. D3 + dagre-d3
**Pros**
- Control total — D3 es el "lego" de la visualización.
- Compound graphs vía `setParent`.

**Contras**
- **dagre-d3** está prácticamente sin mantener (último release 2020).
- No ofrece routing ortogonal real (sólo curvas).
- Mucho código boilerplate para algo que Cytoscape/G6 dan gratis.
- Edge labels y tooltips se construyen a mano.

**Veredicto:** sólo si necesitas algo muy custom que las librerías de alto nivel no permiten.

### 4. Sigma.js v2 + Graphology
**Pros**
- Renderizador **WebGL** ultra-rápido.
- Ideal para grafos densos (>1.000 nodos).
- API limpia, separación clara modelo/renderer.

**Contras**
- **Sin soporte nativo para clusters/compound** — los entornos/nodos se simulan como nodos grandes con relaciones de "membership", lo que no representa C4 fielmente.
- Labels son una sola línea.
- Edge labels sólo en hover.
- No es la herramienta adecuada para diagramas de arquitectura — está pensada para análisis de redes (citation graphs, social graphs).

**Veredicto:** **descartar** para C4. Útil si algún día visualizamos un grafo de dependencias de microservicios (cientos de nodos).

### 5. Structurizr
**Pros**
- **C4-as-code puro**: DSL que mapea 1:1 al modelo C4.
- Una sola fuente, múltiples vistas (Context, Container, Deployment).
- Estilos por tag, paleta Tuya aplicable.
- Versionable como texto plano.
- Exports a PNG/SVG/PlantUML/Mermaid/draw.io.

**Contras**
- No es JS — requiere Structurizr Lite (Docker) o Cloud para visualizar.
- Auto-layout únicamente; el ajuste fino se hace en la UI del viewer.
- Edge routing es opinado, no parametrizable en detalle.

**Veredicto:** **complemento ideal** del repo, no reemplazo. Es la forma más "limpia" de mantener el modelo C4 sincronizado con los diagramas.

---

## 4. Ranking final

| Posición | Librería            | Cuándo usarla |
|---|---|---|
| 🥇 | **React Flow v12**  | Si quieres la mejor calidad visual y el repo soporta build (React/Vite). Es la única que da look-and-feel de UI moderna real. |
| 🥈 | **G6 v5 (AntV)**    | Si quieres permanecer en vanilla JS sin build step. Mejor que Cytoscape en API y combos. |
| 🥉 | **Cytoscape.js + ELK** (baseline) | Solución actual, sigue siendo excelente. No hay razón para migrar si funciona. |
| 4 | **Structurizr**      | Como **fuente de verdad C4** paralela a los diagramas web. Complementa, no compite. |
| 5 | **D3 + dagre-d3**   | Sólo si necesitas un layout muy custom. Para C4 no aporta vs G6/Cytoscape. |
| 6 | **Sigma.js**        | No recomendada para C4 — diseñada para otro problema. |

---

## 5. Recomendación

Para los diagramas C4 del repo `github-copilot-c4-model`:

1. **Mantener** Cytoscape.js + ELK como solución web actual (es sólido y ya funciona).
2. **Migrar** a **G6 v5** o **React Flow v12** si se busca mejor anidamiento/visual:
   - **G6 v5** si se quiere mantener CDN vanilla.
   - **React Flow v12** si se acepta build (recomendado a mediano plazo).
3. **Adoptar Structurizr DSL** como **fuente de verdad paralela** del modelo C4 (similar a cómo .drawio es la fuente de verdad de los diagramas estáticos). El DSL puede generar PlantUML/Mermaid/PNG automáticamente y mantiene los 4 niveles C4 sincronizados.
4. **Descartar** Sigma.js y D3+dagre-d3 para arquitectura C4.

---

## 6. Capturas

> Pendiente: capturar PNG de cada variante (usar el botón "Exportar PNG" de cada index.html) y enlazarlas aquí.

| Variante | Captura |
|---|---|
| Cytoscape (baseline) | _pendiente_ |
| G6 v5                | _pendiente_ |
| React Flow v12       | _pendiente_ |
| D3 + dagre-d3        | _pendiente_ |
| Sigma.js v2          | _pendiente_ |
| Structurizr          | _pendiente_ |
