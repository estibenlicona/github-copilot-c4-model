---
name: drawio
description: Use whenever the user asks to create, generate, draw, design, edit, or export a diagram (flowchart, architecture, C4, ER, sequence, class, state, network, mockup, wireframe), or mentions draw.io / drawio / .drawio files / export to PNG/SVG/PDF.
---

# Draw.io Diagram Skill (Copilot CLI · Windows)

Adapted from the official Anthropic Claude Code skill at https://github.com/jgraph/drawio-mcp/tree/main/skill-cli for **GitHub Copilot CLI on Windows native**, with **estándares C4 de Tuya** integrados.

Generate draw.io diagrams as native `.drawio` files. Optionally export to PNG, SVG, or PDF with the diagram XML embedded so the exported file remains editable in draw.io.

---

## Tabla de contenido

1. [Estándar C4 en Tuya](#estándar-c4-en-tuya)
2. [Paleta de colores oficial](#paleta-de-colores-oficial)
3. [Nomenclatura corporativa](#nomenclatura-corporativa)
4. [Checklist de calidad visual](#checklist-de-calidad-visual) ⭐
5. [Estilos XML copiables](#estilos-xml-copiables)
6. [Ejemplos XML por nivel C4](#ejemplos-xml-por-nivel-c4)
7. [How to create a diagram](#how-to-create-a-diagram)
8. [Export formats and CLI](#draw.io-cli-on-windows)
9. [XML format basics](#xml-format)
10. [Troubleshooting](#troubleshooting)

---

## Estándar C4 en Tuya

El modelo C4 define 4 niveles de abstracción. En Tuya cada nivel se mapea a un entregable específico:

| Nivel | Nombre | Entregable Tuya | Descripción |
|-------|--------|-----------------|-------------|
| **C1** | Contexto | Diagrama de contexto | Vista de alto nivel: sistema en foco + actores + sistemas externos |
| **C2** | Contenedores | Diagrama de despliegue | Unidades de despliegue, nodos de infraestructura, entornos |
| **C3** | Componentes | Diagrama de módulos | Módulos internos de una unidad de despliegue |
| **C4** | Código | Diagrama de código | Namespaces, clases, interfaces (solo si es necesario) |

> **Referencia wiki:** `Gobierno/Arquitectura/Estándar-Entregables/C4-Model-en-Tuya.md`

### Ejemplos visuales de referencia

En la carpeta `examples/` de este skill hay diagramas de contexto corporativos en **dos formatos**:

| Archivo | Formato | Uso |
|---------|---------|-----|
| `ejemplo-contexto-1.drawio` | XML editable | Abrir en draw.io para modificar |
| `ejemplo-contexto-1.png` | Imagen | Referencia visual rápida |
| `ejemplo-contexto-2.drawio` | XML editable | Diagrama con múltiples sistemas externos |
| `ejemplo-contexto-2.png` | Imagen | Referencia visual rápida |

**Patrones visuales clave observados en los ejemplos:**

| Elemento | Estilo visual |
|----------|---------------|
| Sistema principal | Rectángulo azul oscuro (`#1E4D8C`), esquinas redondeadas, texto blanco |
| Sistema externo | Rectángulo gris (`#6B6B6B`), bordes muy redondeados (`arcSize=25`), texto blanco |
| Persona | Shape C4 `mxgraph.c4.person2` (silueta gris), texto negro debajo |
| Relaciones | Líneas **discontinuas** grises (`dashed=1;strokeColor=#707070`), etiquetas en gris |
| Fondo | Gris muy claro (`#F5F5F5`) |
| Labels | Nombre en negrita, `[Software System]` o `[Person]`, descripción normal |

Usar estos archivos como plantilla base para nuevos diagramas de contexto.

---

## Paleta de colores oficial

Colores hex extraídos de los **ejemplos visuales reales** de Tuya (ver `examples/*.png`):

| Elemento | Fill | Stroke | Texto | Notas |
|----------|------|--------|-------|-------|
| **Sistema principal (C1)** | `#1E4D8C` | `#163A6B` | `#FFFFFF` | Azul oscuro, esquinas redondeadas |
| **Sistema externo** | `#6B6B6B` | `#555555` | `#FFFFFF` | Gris, bordes muy redondeados |
| **Persona (C1)** | `#FFFFFF` | `#6B6B6B` | `#000000` | Shape `mxgraph.c4.person2` (silueta, fondo blanco) |
| **Unidad de despliegue (C2)** | `#438DD5` | `#2E6295` | `#FFFFFF` | Contenedores |
| **Nodo pasivo (C2)** | `#F5F5F5` | `#CCCCCC` | `#333333` | Infraestructura |
| **Relaciones** | — | `#707070` | `#333333` | **Siempre discontinuas** (`dashed=1`) |
| **Fondo diagrama** | `#F5F5F5` | — | — | Gris claro |

> **Fuente:** Ejemplos visuales en `examples/ejemplo-contexto-*.png`

---

## Nomenclatura corporativa

### Etiquetas de elementos

- **Nombre en negrita:** `<b>Nombre del Elemento</b>`
- **Tipo en corchetes:** `[Deployment unit: API]`, `[Module: Data Access]`, `[Software System]`, `[Core System]`
- **Descripción breve:** una línea describiendo la responsabilidad

### Formato de etiquetas (según ejemplos visuales)

El formato estándar observado en los ejemplos de Tuya es:

```
<b>Nombre del Elemento</b>
[Tipo]

Descripción breve de responsabilidad.
```

**Tipos estándar observados:**
- `[Person]` — para actores humanos
- `[Software System]` — para sistemas de software
- `[External System]` — para sistemas externos (opcional, también se usa `[Software System]`)

### Sufijos de estado (para diagramas de propuesta)

| Sufijo | Significado |
|--------|-------------|
| `++` | Elemento **nuevo** (a crear) |
| `**` | Elemento **modificado** (a cambiar) |

**Ejemplo de etiqueta con sufijo:**
```
<b>API Customers++</b>
[Deployment unit: API]

Expone operaciones CRUD de clientes.
```

### Etiquetas de relaciones

- **Verbo + descripción:** `Consulta datos de cliente`
- **Protocolo en corchetes:** `[JSON/HTTPS]`, `[AMQP]`, `[gRPC]`

**Ejemplo:**
```
Consulta datos de cliente
[JSON/HTTPS]
```

---

## Checklist de calidad visual

Antes de finalizar cualquier diagrama, verificar **todos** estos puntos:

### ✅ Grid y simetría

| Regla | Implementación |
|-------|----------------|
| **Grid rígido** | `x = col * 220 + 40`, `y = row * 160 + 60` — todos los nodos alineados a este grid |
| **Columnas simétricas** | Centrar el diagrama: si hay 3 columnas, usar cols 0, 1, 2 con el sistema principal en col 1 |
| **Filas balanceadas** | Misma cantidad de elementos por fila cuando sea posible |
| **Ancho uniforme** | Todos los nodos del mismo tipo: mismo `width` (180px personas, 240px sistemas, 200px contenedores) |
| **Alto uniforme** | Misma altura para elementos del mismo nivel: 120px estándar, 160px si tiene descripción larga |

### ✅ Espaciado uniforme

| Métrica | Valor estándar |
|---------|----------------|
| **Separación horizontal** | 220px entre centros de nodos adyacentes |
| **Separación vertical** | 160px entre filas |
| **Margen exterior** | 40px mínimo desde el borde del canvas |
| **Padding interno** | `spacingTop=8`, `spacingLeft=10`, `spacingRight=10` en todos los nodos |
| **Espacio título-contenido** | 60px entre título del diagrama y primer elemento |

### ✅ Sin traslapes ni cruces

| Verificación | Cómo validar |
|--------------|--------------|
| **Nodos no se superponen** | Ningún `mxGeometry` comparte coordenadas que causen intersección visual |
| **Líneas no cruzan nodos** | Ver técnicas abajo — requiere layout cuidadoso |
| **Líneas paralelas separadas** | Si dos edges van en la misma dirección, separar nodos origen/destino para evitar superposición |
| **Etiquetas de relación visibles** | Labels de edges no deben quedar sobre nodos ni otras líneas |

#### Técnicas para evitar cruces de líneas

**⚠️ Limitación:** draw.io XML no garantiza automáticamente cero cruces. El algoritmo `orthogonalEdgeStyle` toma decisiones de routing que pueden cruzar otros elementos. Para minimizar cruces:

1. **Alinear origen y destino verticalmente u horizontalmente:**
   ```xml
   <!-- Persona directamente arriba del sistema → conexión vertical limpia -->
   <mxCell id="persona" ... x="400" y="100" .../>
   <mxCell id="sistema" ... x="400" y="300" .../>
   ```

2. **Usar `exitX/exitY` y `entryX/entryY` explícitos:**
   ```xml
   <mxCell edge="1" style="...;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" .../>
   ```
   Valores: `0`=izquierda/arriba, `0.5`=centro, `1`=derecha/abajo

3. **Forzar waypoints cuando sea necesario:**
   ```xml
   <mxCell edge="1" ...>
     <mxGeometry relative="1" as="geometry">
       <Array as="points">
         <mxPoint x="200" y="250"/>
         <mxPoint x="400" y="250"/>
       </Array>
     </mxGeometry>
   </mxCell>
   ```

4. **Organizar en columnas de flujo:**
   - Columna izquierda: actores y sistemas de identidad/seguridad
   - Columna central: sistema en foco
   - Columna derecha: sistemas de destino

5. **Después de generar, ajustar en draw.io:**
   - Arrastrar waypoints de las líneas para rodear obstáculos
   - El editor visual es más preciso que calcular coordenadas manualmente

### ✅ Jerarquía visual clara

| Principio | Aplicación |
|-----------|------------|
| **Flujo de lectura** | Izquierda → derecha o arriba → abajo (nunca mixto) |
| **Actores a la izquierda** | Personas siempre en la columna 0 |
| **Sistema principal centrado** | El sistema en foco ocupa el centro visual del diagrama |
| **Externos a la derecha/abajo** | Sistemas externos en la periferia, nunca entre actores y sistema principal |
| **Leyenda abajo-izquierda** | Siempre en la esquina inferior izquierda, fuera del área de nodos |

### ✅ Coherencia cromática

| Verificación | Criterio |
|--------------|----------|
| **Paleta única** | Solo colores de la tabla oficial (no inventar tonos) |
| **Un color = un tipo** | Azul oscuro solo para personas, azul medio solo para sistema en foco, etc. |
| **Relaciones uniformes** | Todas las líneas con `strokeColor=#828282`, mismo grosor |
| **Sin degradados** | `fillColor` sólido, no gradientes |

### ✅ Cálculo rápido de coordenadas

```
Fórmula de posicionamiento:
  x = (columna × 220) + 40
  y = (fila × 160) + 60

Ejemplo para grid 3×2:
  (0,0) → x=40,  y=60    (1,0) → x=260, y=60    (2,0) → x=480, y=60
  (0,1) → x=40,  y=220   (1,1) → x=260, y=220   (2,1) → x=480, y=220
```

### ✅ Verificación final

Antes de guardar el archivo `.drawio`:

- [ ] ¿Todos los nodos están alineados al grid?
- [ ] ¿El espaciado horizontal es idéntico entre todos los pares adyacentes?
- [ ] ¿El espaciado vertical es idéntico entre todas las filas?
- [ ] ¿No hay ningún cruce de líneas sobre nodos?
- [ ] ¿Las etiquetas de relaciones son legibles (no superpuestas)?
- [ ] ¿El diagrama se lee de izquierda a derecha o de arriba a abajo?
- [ ] ¿La leyenda está en la esquina inferior izquierda?
- [ ] ¿Todos los colores corresponden a la paleta oficial?

---

## Estilos XML copiables

Tabla de style strings listos para usar en `<mxCell style="...">`, **actualizados según ejemplos visuales de Tuya**:

| Elemento | Style string |
|----------|--------------|
| **Persona (silueta C4)** | `shape=mxgraph.c4.person2;whiteSpace=wrap;html=1;metaEdit=1;points=[[0.5,0,0],[1,0.5,0],[1,0.75,0],[0.75,1,0],[0.5,1,0],[0.25,1,0],[0,0.75,0],[0,0.5,0]];strokeColor=#6B6B6B;fillColor=#FFFFFF;fontColor=#000000;align=center;` |
| **Persona (caja alternativa)** | `rounded=1;whiteSpace=wrap;html=1;fillColor=#6B6B6B;strokeColor=#555555;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;arcSize=25;` |
| **Sistema en foco (C1)** | `rounded=1;whiteSpace=wrap;html=1;fillColor=#1E4D8C;strokeColor=#163A6B;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=10;arcSize=10;` |
| **Sistema externo** | `rounded=1;whiteSpace=wrap;html=1;fillColor=#6B6B6B;strokeColor=#555555;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;arcSize=25;` |
| **Contenedor (C2)** | `rounded=1;whiteSpace=wrap;html=1;fillColor=#438DD5;strokeColor=#2E6295;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;` |
| **Módulo (C3)** | `rounded=1;whiteSpace=wrap;html=1;fillColor=#63BEF2;strokeColor=#5D82A8;fontColor=#000000;align=center;verticalAlign=top;spacingTop=8;` |
| **Boundary (swimlane)** | `swimlane;startSize=30;fillColor=none;strokeColor=#444444;fontColor=#444444;fontStyle=1;dashed=1;html=1;rounded=0;` |
| **Nodo AKS/cluster** | `swimlane;startSize=24;fillColor=#FFF2CC;strokeColor=#D6B656;fontColor=#7F6000;fontStyle=1;html=1;rounded=0;` |
| **Nota** | `rounded=0;whiteSpace=wrap;html=1;fillColor=#FFF4C2;strokeColor=#D6B656;fontColor=#333333;align=left;verticalAlign=top;spacingLeft=10;spacingRight=10;spacingTop=8;` |
| **Relación (discontinua)** | `edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;strokeColor=#707070;dashed=1;` |
| **Leyenda** | `text;html=1;align=left;verticalAlign=middle;fontSize=12;` |

> **Nota:** Las relaciones en los ejemplos de Tuya son **siempre discontinuas** (`dashed=1`).

---

## Ejemplos XML por nivel C4

### C1 — Diagrama de Contexto

Extracto minimalista mostrando persona, sistema en foco, sistema externo y relación:

```xml
<mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1400" pageHeight="900" math="0" shadow="0" adaptiveColors="auto">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="title" value="Sistema X — C1 Contexto" style="text;html=1;align=center;verticalAlign=middle;fontSize=18;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="40" y="10" width="600" height="36" as="geometry"/>
    </mxCell>
    <mxCell id="p_user" value="&lt;b&gt;Usuario Final&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Persona]&lt;/i&gt;&lt;br&gt;&lt;br&gt;Consume servicios del sistema." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#08427B;strokeColor=#073B6F;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;" vertex="1" parent="1">
      <mxGeometry x="100" y="100" width="180" height="120" as="geometry"/>
    </mxCell>
    <mxCell id="sys_main" value="&lt;b&gt;Sistema Principal&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Software System]&lt;/i&gt;&lt;br&gt;&lt;br&gt;Resuelve la necesidad de negocio." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1168BD;strokeColor=#0B4884;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=10;" vertex="1" parent="1">
      <mxGeometry x="400" y="80" width="300" height="160" as="geometry"/>
    </mxCell>
    <mxCell id="sys_ext" value="&lt;b&gt;Sistema Externo&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Software System]&lt;/i&gt;&lt;br&gt;&lt;br&gt;Provee datos auxiliares." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#999999;strokeColor=#6B6B6B;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;" vertex="1" parent="1">
      <mxGeometry x="800" y="100" width="200" height="120" as="geometry"/>
    </mxCell>
    <mxCell id="e_user_main" edge="1" parent="1" source="p_user" target="sys_main" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;strokeColor=#828282;" value="Usa el sistema&lt;br&gt;[HTTPS]">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="e_main_ext" edge="1" parent="1" source="sys_main" target="sys_ext" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;strokeColor=#828282;" value="Consulta datos&lt;br&gt;[REST/JSON]">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="legend" value="&lt;b&gt;Leyenda&lt;/b&gt;&lt;br&gt;&lt;font color=&quot;#08427B&quot;&gt;■&lt;/font&gt; Persona  &lt;font color=&quot;#1168BD&quot;&gt;■&lt;/font&gt; Sistema en foco  &lt;font color=&quot;#999999&quot;&gt;■&lt;/font&gt; Sistema externo" style="text;html=1;align=left;verticalAlign=middle;fontSize=12;" vertex="1" parent="1">
      <mxGeometry x="100" y="280" width="400" height="40" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>
```

### C2 — Diagrama de Despliegue

Extracto mostrando boundary, contenedores, nodo anidado y sistema externo:

```xml
<mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="1000" math="0" shadow="0" adaptiveColors="auto">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="title" value="Sistema X — C2 Contenedores" style="text;html=1;align=center;verticalAlign=middle;fontSize=18;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="40" y="10" width="800" height="36" as="geometry"/>
    </mxCell>
    <mxCell id="b_cloud" value="Azure (Nube)" style="swimlane;startSize=30;fillColor=none;strokeColor=#444444;fontColor=#444444;fontStyle=1;dashed=1;html=1;rounded=0;" vertex="1" parent="1">
      <mxGeometry x="40" y="80" width="700" height="500" as="geometry"/>
    </mxCell>
    <mxCell id="c_api" value="&lt;b&gt;API Gateway&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Deployment unit: APIM]&lt;/i&gt;&lt;br&gt;&lt;br&gt;Expone endpoints públicos." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#438DD5;strokeColor=#2E6295;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;" vertex="1" parent="b_cloud">
      <mxGeometry x="40" y="60" width="260" height="120" as="geometry"/>
    </mxCell>
    <mxCell id="b_aks" value="AKS Cluster (99.9%)" style="swimlane;startSize=24;fillColor=#FFF2CC;strokeColor=#D6B656;fontColor=#7F6000;fontStyle=1;html=1;rounded=0;" vertex="1" parent="b_cloud">
      <mxGeometry x="40" y="220" width="620" height="240" as="geometry"/>
    </mxCell>
    <mxCell id="c_svc" value="&lt;b&gt;Servicio Negocio++&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Deployment unit: Microservicio]&lt;/i&gt;&lt;br&gt;&lt;br&gt;Implementa lógica de negocio." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#438DD5;strokeColor=#2E6295;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;" vertex="1" parent="b_aks">
      <mxGeometry x="30" y="50" width="260" height="140" as="geometry"/>
    </mxCell>
    <mxCell id="c_db" value="&lt;b&gt;MongoDB&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Deployment unit: NoSQL]&lt;/i&gt;&lt;br&gt;&lt;br&gt;Almacena documentos." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#438DD5;strokeColor=#2E6295;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;" vertex="1" parent="b_aks">
      <mxGeometry x="330" y="50" width="260" height="140" as="geometry"/>
    </mxCell>
    <mxCell id="sys_ext" value="&lt;b&gt;SonarCloud&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Software System]&lt;/i&gt;&lt;br&gt;&lt;br&gt;Calidad de código." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#999999;strokeColor=#6B6B6B;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;" vertex="1" parent="1">
      <mxGeometry x="820" y="300" width="200" height="120" as="geometry"/>
    </mxCell>
    <mxCell id="e_api_svc" edge="1" parent="1" source="c_api" target="c_svc" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;strokeColor=#828282;" value="Enruta&lt;br&gt;[HTTPS]">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="e_svc_db" edge="1" parent="1" source="c_svc" target="c_db" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;strokeColor=#828282;" value="Persiste&lt;br&gt;[MongoDB Wire]">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="e_svc_ext" edge="1" parent="1" source="c_svc" target="sys_ext" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;strokeColor=#828282;" value="Consulta métricas&lt;br&gt;[REST/JSON]">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>
```

### C3 — Diagrama de Módulos

Ejemplo minimalista de unidad contenedora con módulos internos:

```xml
<mxGraphModel dx="1000" dy="700" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1200" pageHeight="800" math="0" shadow="0" adaptiveColors="auto">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="title" value="Servicio Negocio — C3 Módulos" style="text;html=1;align=center;verticalAlign=middle;fontSize=18;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="40" y="10" width="500" height="36" as="geometry"/>
    </mxCell>
    <mxCell id="u_svc" value="&lt;b&gt;Servicio Negocio&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Deployment unit: Microservicio]&lt;/i&gt;" style="swimlane;startSize=50;fillColor=#2086C9;strokeColor=#1A6FA3;fontColor=#FFFFFF;fontStyle=1;html=1;rounded=0;" vertex="1" parent="1">
      <mxGeometry x="40" y="80" width="500" height="340" as="geometry"/>
    </mxCell>
    <mxCell id="m_api" value="&lt;b&gt;API Controller&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Module: REST Controller]&lt;/i&gt;&lt;br&gt;&lt;br&gt;Recibe y valida requests." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#63BEF2;strokeColor=#5D82A8;fontColor=#000000;align=center;verticalAlign=top;spacingTop=8;" vertex="1" parent="u_svc">
      <mxGeometry x="30" y="70" width="200" height="100" as="geometry"/>
    </mxCell>
    <mxCell id="m_domain" value="&lt;b&gt;Domain Service&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Module: Business Logic]&lt;/i&gt;&lt;br&gt;&lt;br&gt;Ejecuta reglas de negocio." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#63BEF2;strokeColor=#5D82A8;fontColor=#000000;align=center;verticalAlign=top;spacingTop=8;" vertex="1" parent="u_svc">
      <mxGeometry x="270" y="70" width="200" height="100" as="geometry"/>
    </mxCell>
    <mxCell id="m_repo" value="&lt;b&gt;Repository&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Module: Data Access]&lt;/i&gt;&lt;br&gt;&lt;br&gt;Accede a persistencia." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#63BEF2;strokeColor=#5D82A8;fontColor=#000000;align=center;verticalAlign=top;spacingTop=8;" vertex="1" parent="u_svc">
      <mxGeometry x="150" y="210" width="200" height="100" as="geometry"/>
    </mxCell>
    <mxCell id="e_api_domain" edge="1" parent="1" source="m_api" target="m_domain" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;strokeColor=#828282;" value="Usa">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="e_domain_repo" edge="1" parent="1" source="m_domain" target="m_repo" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;strokeColor=#828282;" value="Usa">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="sys_db" value="&lt;b&gt;MongoDB&lt;/b&gt;&lt;br&gt;&lt;i&gt;[Software System]&lt;/i&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#999999;strokeColor=#6B6B6B;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=8;" vertex="1" parent="1">
      <mxGeometry x="620" y="300" width="160" height="80" as="geometry"/>
    </mxCell>
    <mxCell id="e_repo_db" edge="1" parent="1" source="m_repo" target="sys_db" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=classic;strokeColor=#828282;" value="Persiste&lt;br&gt;[MongoDB Wire]">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>
```

---

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

---

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
| **Estándares C4** | Genéricos | **Tuya**: paleta de colores, nomenclatura, ejemplos |

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `draw.io.exe` not found | Desktop app not installed | Keep the `.drawio` file; ask the user to install draw.io Desktop |
| Empty/corrupt export | Invalid XML (comments, unescaped `<`/`&`) | Re-validate well-formedness; remove all `<!-- -->` |
| Diagram opens blank | Missing `id="0"` / `id="1"` root cells | Include the minimum mxGraphModel structure |
| Edges not rendering | Self-closing edge `<mxCell ... edge="1" />` | Every edge needs `<mxGeometry relative="1" as="geometry"/>` as a child |
| CLI hangs / locks file | draw.io GUI is open | Close the GUI window, retry export |
| File won't open | Path issues | Print the absolute path so the user can open it manually |

---

## CRITICAL: XML well-formedness

- **NEVER include any XML comments** (`<!-- -->`).
- Escape special characters in attribute values: `&amp;`, `&lt;`, `&gt;`, `&quot;`.
- Every `mxCell` `id` must be unique.
- Every edge cell must have a child `<mxGeometry relative="1" as="geometry"/>` — never self-closing.
