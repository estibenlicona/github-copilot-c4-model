# Guía para modelar el Diagrama de Despliegue de GitHub Copilot en draw.io

> **Principio rector:** KISS (Keep It Simple). Si el diagrama no se lee en menos de 60 segundos, sobra detalle.

Esta guía recopila las **preguntas que debes responder antes de dibujar**, las **respuestas recomendadas** (basadas en convenciones C4 y en `nodos-minimos-despliegue-copilot.md`), y el **paso a paso** que debes seguir en draw.io.

---

## Parte 1 — Preguntas que debes responder

Responde una por una. Si dudas, usa la respuesta recomendada.

### 1. ¿Cuál es el alcance del diagrama?

**Pregunta:** ¿Vas a modelar solo GitHub Copilot en IDE, o también Copilot CLI, Copilot Chat, Copilot Coding Agent, MCPs remotos, etc.?

**Recomendado:** Empieza con **Copilot en IDE + Copilot Chat**. Si en tu empresa ya usan Coding Agent o MCPs remotos, añádelos en una **segunda versión** del diagrama. No mezcles todo en uno solo.

---

### 2. ¿Cuántos entornos (deployment environments)?

**Pregunta:** ¿Cuántas "nubes" o "datacenters" lógicos vas a representar?

**Recomendado:** **2 entornos** (mínimo) o **3** (si aplica):

1. **Tuya — Endpoints corporativos** `[Environment: on premise]`
2. **GitHub Cloud — Enterprise tuyacol** `[Environment: cloud]`
3. *(Opcional)* **Azure — Plataforma MCPs** `[Environment: cloud]` — solo si tienen MCPs remotos.

---

### 3. ¿"On-premise" es el nombre correcto para el entorno de los desarrolladores?

**Pregunta:** ¿Llamo "on-premise" al entorno donde están las laptops de los desarrolladores?

**Respuesta corta:** **Depende, pero generalmente NO es el más preciso.**

| Término | Cuándo usarlo |
|---|---|
| **On-premise** | Infraestructura corporativa instalada en datacenter propio de la empresa (servidores, appliances, proxies, AD). |
| **Corporate endpoints** / **Endpoints corporativos** | Conjunto de dispositivos administrados por la empresa (laptops, workstations) + red corporativa. **Esta suele ser la etiqueta correcta para Copilot.** |
| **Developer workstation** | Un único nodo: la laptop del desarrollador. Va **dentro** del entorno "Endpoints corporativos". |

**Recomendado para Tuya:**
- **Entorno (boundary):** `Tuya — Endpoints corporativos [Environment: on premise]`
  - El sufijo `on premise` está bien como **tipo de entorno** (indica que no es cloud), pero el **nombre** del entorno debe ser descriptivo: "Endpoints corporativos".
- **Nodos dentro:** `Workstation del desarrollador [Deployment node: Laptop Windows/Mac]`, y opcionalmente `Proxy corporativo`.

> Regla: el **nombre** describe *qué es*; el **tipo entre corchetes** describe *dónde vive*.

---

### 4. ¿Cuántos nodos en total?

**Pregunta:** ¿Cuántas cajas debería tener el diagrama?

**Recomendado (KISS):**

| Elemento | Cantidad |
|---|---|
| Entornos | 2–3 |
| Nodos de despliegue | 5–7 |
| Unidades de despliegue (dentro de los nodos) | 8–12 |
| Sistemas externos | 2–4 |
| **Total cajas visibles** | **≤ 20** |

Si pasas de 20, divide en dos diagramas.

---

### 5. ¿Qué nodos mínimos debe contener?

**Recomendado — 5 a 7 nodos:**

**Entorno 1 — Endpoints corporativos (on premise)**
1. Workstation del desarrollador `[Deployment node: Laptop Windows/Mac]`
2. *(Opcional)* Proxy corporativo `[Deployment node: Network appliance]`

**Entorno 2 — GitHub Cloud**

3. GitHub.com / Copilot SaaS `[Deployment node: SaaS multi-tenant]`
4. Copilot Proxy / Model Gateway `[Deployment node: SaaS]`

**Entorno 3 — Azure (solo si aplica)**

5. *(Opcional)* App Service / Container App de MCPs `[Deployment node: PaaS]`

**Sistemas externos referenciados (no son nodos, son cajas grises):**
- Microsoft Entra ID (SSO)
- Azure OpenAI (modelos)
- Anthropic / otros proveedores de modelos

---

### 6. ¿Qué unidades de despliegue van dentro de cada nodo?

**Recomendado:**

- **Dentro de Workstation:** `IDE (VS Code/JetBrains/Visual Studio)`, `Copilot Extension`, `Copilot CLI` *(opcional)*.
- **Dentro de GitHub.com:** `Copilot Service`, `Repos Enterprise tuyacol`.
- **Dentro de Copilot Proxy:** `Content Filter`, `Routing/Telemetry`.
- **Dentro de Azure (si aplica):** `MCP Server (Container)`.

---

### 7. ¿Qué relaciones (flechas) dibujar?

**Recomendado — solo las críticas:**

1. IDE + Copilot Extension → Copilot Proxy `[HTTPS/443]`
2. Copilot Proxy → Copilot Service `[HTTPS]`
3. Copilot Proxy → Azure OpenAI / Anthropic `[HTTPS]` *(sistema externo)*
4. Workstation → Microsoft Entra ID `[OIDC/HTTPS]` *(autenticación)*
5. *(Si hay proxy corp.)* IDE → Proxy corporativo → Copilot Proxy `[HTTPS, TLS inspection]`
6. *(Si hay MCPs)* IDE → MCP Server `[HTTPS/SSE o stdio]`

No dibujes más de **6–8 flechas**.

---

### 8. ¿Orientación y estilo del diagrama?

**Recomendado:**
- **Orientación:** horizontal (left-to-right): Endpoints → GitHub Cloud → Azure.
- **Boundaries de entorno:** `swimlane` con `startSize=30`, fondo pastel transparente.
- **Colores Tuya** (ver `.github/skills/drawio/SKILL.md`): Persona `#08427B`, Sistema `#1168BD`, Contenedor `#438DD5`, Módulo `#63BEF2`, Externo `#999999`.
- **Edges:** `edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeColor=#828282;`.

---

### 9. ¿Nomenclatura?

**Recomendado (estándar Tuya):**
- Nombre en **negrita**: `<b>Workstation del desarrollador</b>`
- Tipo entre corchetes: `[Deployment node: Laptop Windows/Mac]`
- Descripción de 1 línea con `<br>`.
- Relaciones: verbo + protocolo: `Solicita sugerencias<br>[JSON/HTTPS:443]`.
- Sufijo `++` si el elemento es **nuevo** (a crear); `**` si es **modificado**.

---

### 10. ¿Dónde guardar el archivo?

**Recomendado:** `diagrams/04-deployment-copilot.drawio` y exportar `diagrams/04-deployment-copilot.drawio.svg`.

---

## Parte 2 — Paso a paso en draw.io

Sigue este orden. **No saltes pasos.**

### Paso 1 — Prepara el lienzo
1. Abre draw.io (web o desktop).
2. Crea un archivo nuevo en blanco → guárdalo como `diagrams/04-deployment-copilot.drawio`.
3. Configura **Page Setup**: A3 horizontal, grid 10 px.

### Paso 2 — Dibuja los entornos (boundaries)
Crea **2 o 3 swimlanes horizontales** lado a lado:

1. `Tuya — Endpoints corporativos [Environment: on premise]` (izquierda).
2. `GitHub Cloud — Enterprise tuyacol [Environment: cloud]` (centro).
3. *(Opcional)* `Azure — Plataforma MCPs [Environment: cloud]` (derecha).

Usa el estilo de boundary del skill `drawio` (fondo pastel transparente, borde punteado, `startSize=30`).

### Paso 3 — Coloca los deployment nodes dentro de cada entorno

Dentro de **Endpoints corporativos**:
- `Workstation del desarrollador [Deployment node: Laptop Windows/Mac]`
- *(Opcional)* `Proxy corporativo [Deployment node: Network appliance]`

Dentro de **GitHub Cloud**:
- `GitHub.com / Copilot SaaS [Deployment node: SaaS multi-tenant]`
- `Copilot Proxy / Model Gateway [Deployment node: SaaS]`

Dentro de **Azure** (si aplica):
- `App Service / Container Apps MCP [Deployment node: PaaS]`

### Paso 4 — Coloca las deployment units (contenedores) dentro de los nodos

- Workstation → IDE, Copilot Extension, *(opcional)* Copilot CLI.
- GitHub.com → Copilot Service, Repos Enterprise.
- Copilot Proxy → Content Filter, Routing/Telemetry.
- Azure → MCP Server.

Usa el color **Contenedor `#438DD5`** del skill.

### Paso 5 — Añade sistemas externos
Fuera de los entornos (esquina derecha o inferior), en gris `#999999`:
- `Microsoft Entra ID [External: SSO]`
- `Azure OpenAI [External: Model provider]`
- `Anthropic [External: Model provider]`

### Paso 6 — Dibuja las relaciones (máx 6–8 flechas)
Orden sugerido:
1. IDE → Copilot Proxy `[HTTPS/443]`
2. Copilot Proxy → Copilot Service `[HTTPS]`
3. Copilot Proxy → Azure OpenAI `[HTTPS]`
4. IDE → Microsoft Entra ID `[OIDC]`
5. *(si aplica)* IDE → Proxy corporativo → Copilot Proxy
6. *(si aplica)* IDE → MCP Server

Estilo: `edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#828282`.

### Paso 7 — Verifica nomenclatura
- Todos los nombres en `<b>...</b>`.
- Todos llevan `[Tipo]`.
- Todas las flechas llevan verbo + protocolo entre corchetes.

### Paso 8 — Valida con la regla KISS
- Cuenta cajas: deben ser ≤ 20.
- Cuenta flechas: deben ser ≤ 8.
- Lee el diagrama en voz alta en 60 segundos. Si no se entiende, simplifica.

### Paso 9 — Exporta
- File → Export As → SVG → `diagrams/04-deployment-copilot.drawio.svg`.
- Commit ambos archivos (`.drawio` y `.drawio.svg`) al repo.

### Paso 10 — Revisión
- Compártelo con un compañero que **no haya participado** en el modelado.
- Si entiende el flujo en menos de 1 minuto, el diagrama está listo.

---

## Resumen de decisiones tomadas

| Tema | Decisión |
|---|---|
| Alcance v1 | Copilot IDE + Chat |
| Entornos | 2–3 (Endpoints corporativos, GitHub Cloud, [Azure opcional]) |
| Nombre del entorno local | **Endpoints corporativos** (no "on-premise" a secas; "on premise" va como `[Environment: ...]`) |
| Nodos totales | 5–7 |
| Cajas totales | ≤ 20 |
| Flechas | ≤ 8 |
| Orientación | Horizontal |
| Archivo destino | `diagrams/04-deployment-copilot.drawio` |
