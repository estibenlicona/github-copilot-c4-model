# Contexto de la sesión — levantamiento C4 GitHub Copilot

Snapshot estructurado de la sesión de trabajo en la que se levantó la arquitectura de GitHub Copilot (Niveles C1 y C2) y se documentaron los gaps. **No es transcripción literal**; es la fuente de verdad para retomar el trabajo en una sesión posterior.

## Resumen ejecutivo

Se documentó la arquitectura empresarial de GitHub Copilot de la compañía siguiendo el **C4 Model**. Se entregaron los diagramas C1 (Contexto) y C2 (Contenedores) en formato `.drawio` nativo, con etiquetas en español. Se identificaron y documentaron **once gaps** (8 que requieren mejora, 3 por validar) y se definió un **prompt file oficial de GitHub Copilot** (`.github/prompts/c4-copilot-arquitectura.prompt.md`) reutilizable para regenerar los diagramas en futuras sesiones.

## Cronología de decisiones

1. **Repositorio inicial vacío**. Se decidió empezar por `.github/copilot-instructions.md` con las convenciones C4 del repo.
2. **Tooling acordado**: draw.io con MCP. La skill general inicial fue reemplazada por una skill especializada de despliegue C4/Tuya, alojada en `.github/skills/drawio-deployment/SKILL.md` y referenciada desde `copilot-instructions.md`.
3. **Modo plan inicial**: se enumeraron 8 áreas de gaps potenciales (A–H) basadas en arquitecturas típicas de Copilot empresarial.
4. **Cuestionario A–H** respondido por el usuario en bloques. Resultado: contexto consolidado más una lista clara de gaps.
5. **C1 (Contexto)** generado: `diagrams/01-context-copilot.drawio`. 3 personas, 1 sistema en foco, 6 sistemas externos, 11 relaciones, 2 notas, leyenda. Se rechazó exportar SVG; preferencia por `.drawio` nativo.
6. **C2 (Contenedores)** generado: `diagrams/02-containers-copilot.drawio`. 3 boundaries (Estación dev / Copilot SaaS / Plataforma corporativa de MCPs Azure) + boundary anidado para AKS, ~20 contenedores y relaciones rotuladas.
7. **Documentación de soporte** (este turno): `docs/architecture-gaps.md`, `.github/prompts/c4-copilot-arquitectura.prompt.md` (formato oficial GitHub Copilot), y este `docs/session-context.md`.

## Respuestas del usuario al cuestionario A–H

### A. Identidad y plataforma GitHub
- **A1**: GitHub Enterprise Cloud, Enterprise `tuyacol`, **solo para licencias de Copilot**. No hay repos en GitHub.
- **A2**: Autenticación de devs vía SSO (Entra ID → GitHub.com).
- **A3**: Los repositorios viven en **Azure DevOps Repos**, no en GitHub.
- **A4**: SSO **NO enforced** en el Enterprise.

### B. Backend / modelos
- **B1**: Plan **Copilot Business**.
- **B2**: Representar el backend de modelos LLM como **caja opaca externa**.

### C. Funcionalidades en uso
- Autocompletado, Copilot Chat, Copilot CLI, **modo agente** y modo plan.

### D. Gobierno y datos
- **D1**: No hay Content Exclusions.
- **D2**: Public-code matching: política desconocida.
- **D3**: No se exportan audit logs a SIEM.
- **D4**: No se consume Copilot Metrics API; gobierno de IA en definición.

### E. Red y seguridad de tráfico
- **E1**: TLS break-and-inspect en Netskope: estado desconocido.
- **APIM**: solo enrutamiento, sin auth ni políticas propias.

### F. AKS y despliegue del MCP
- **F1**: Imagen oficial del SonarCloud MCP desde **ACR** (origen Docker Hub).
- **F2**: Token administrador de SonarCloud almacenado como **env var en el deployment**.
- **F3**: El MCP corporativo solo en ambiente **dev**.

### G. Otros MCPs y ecosistema
- **G1**: Solo SonarCloud MCP corporativo. draw.io MCP local en planificación; otros futuros.

### H. Cumplimiento / privacidad
- **H1**: DLP corporativo sobre prompts: desconocido.
- **H2**: Sin requisito formal de residencia de datos.

## Entregables producidos

| Ruta | Tipo | Descripción |
|---|---|---|
| `.github/copilot-instructions.md` | Markdown | Convenciones del repo y referencia a la skill de despliegue draw.io. |
| `.github/skills/drawio-deployment/SKILL.md` | Markdown (skill) | Skill especializada para diagramas de despliegue C4/Tuya con draw.io XML. |
| `diagrams/01-context-copilot.drawio` | draw.io | C4 Nivel 1 — Contexto. Etiquetas en español. |
| `diagrams/02-containers-copilot.drawio` | draw.io | C4 Nivel 2 — Contenedores. 3 boundaries + AKS anidado. |
| `docs/architecture-gaps.md` | Markdown | Tabla de gaps con columna "¿Requiere mejora?" y recomendaciones. |
| `.github/prompts/c4-copilot-arquitectura.prompt.md` | Prompt file (Copilot) | Prompt reutilizable, frontmatter `mode: agent`, variables `${input:nivel}` / `${input:foco}`. |
| `docs/session-context.md` | Markdown | Este documento. |

## Decisiones técnicas clave

- **Idioma**: español para todas las etiquetas y documentación.
- **Formato de diagramas**: solo `.drawio` nativo. Se rechazó la generación automática de SVG/PNG.
- **Estilos C4 iniciales** (paleta usada en los primeros C1/C2; para nuevos despliegues usar `.github/skills/drawio-deployment/SKILL.md`):
  - Persona `#08427B` / `#073B6F`.
  - Sistema en foco `#1168BD` / `#0B4884`.
  - Container inicial `#438DD5` / `#2E6295`.
  - Externo inicial `#999999` / `#6B6B6B`.
  - Despliegue v3: unidad `#23A2D9`, sistema/core externo `#8C8496`, relacion `#828282`, nodo pasivo `#F5F5F5`.
- **Boundaries**: swimlane `dashed=1; fillColor=none; fontStyle=1; startSize=30` (24 si anidado).
- **XML**: `mxCell` de tipo `edge` con hijo explícito `<mxGeometry relative="1" as="geometry"/>`; `html=1` con entidades escapadas; sin comentarios XML.
- **Tooling Windows**: `Invoke-Item` para abrir el `.drawio` en draw.io desktop.
- **Backend de modelos LLM**: representado como caja opaca; no se modela su interior.
- **APIM**: aparece en C2 sin políticas; en C1 quedó implícito dentro de la "Plataforma corporativa de MCPs".
- **Repos en Azure DevOps**: aparecen como sistema externo en C1/C2.

## Estado de los gaps (referencia rápida)

Ver detalle completo en `docs/architecture-gaps.md`.

- **Requieren mejora (⚠️)**: A4, D1, D3, D4, F2, F3.
- **Por validar (❓)**: D2, E1, H1.
- **No requieren acción (✅)**: A1, A2, A3, B1, C1, E2, F1, G1, H2.

## Próximos pasos sugeridos

1. **Revisión visual** del diagrama C2 con stakeholders y ajustes finales.
2. **C3 (Componentes)** opcional, foco recomendado: el **pod del SonarCloud MCP** en AKS (auth, cliente Sonar API, gestión del token admin, configuración).
3. Atacar los gaps prioritarios: **A4** (SSO enforcement), **F2** (token a Key Vault), **D3** (audit log streaming a SIEM).
4. Validar los gaps marcados ❓ con los equipos responsables (redes, seguridad).
5. Iterar el prompt file `.github/prompts/c4-copilot-arquitectura.prompt.md` cuando se incorporen nuevos componentes (más MCPs, pre-prod/prod, SIEM).

## Cómo retomar el trabajo en una nueva sesión

1. Abrir el repo `github-copilot-c4-model` en VS Code o Copilot CLI.
2. Invocar el prompt file: `/c4-copilot-arquitectura` y seleccionar el nivel deseado (`C1`, `C2`, `C3`, `C4`).
3. El agente leerá automáticamente los archivos de contexto (`copilot-instructions.md`, `SKILL.md`, `architecture-gaps.md`, `session-context.md`) y producirá/actualizará el diagrama correspondiente.
