# Gaps de arquitectura — GitHub Copilot

Documento de seguimiento de los hallazgos detectados durante el levantamiento de la arquitectura de GitHub Copilot en la compañía (insumo de los diagramas C4 en `diagrams/`).

Cada fila indica el **estado actual** y si **requiere mejora**. Las recomendaciones son orientativas; la priorización corresponde al equipo de arquitectura/seguridad.

> Convención: ✅ no requiere acción · ⚠️ requiere mejora · ❓ por validar.

## Resumen

| Categoría | Total | ✅ | ⚠️ | ❓ |
|---|---:|---:|---:|---:|
| Identidad y plataforma GitHub | 4 | 3 | 1 | 0 |
| Backend / modelos | 1 | 1 | 0 | 0 |
| Funcionalidades en uso | 1 | 1 | 0 | 0 |
| Gobierno y datos | 4 | 0 | 3 | 1 |
| Red y seguridad de tráfico | 2 | 1 | 0 | 1 |
| AKS y despliegue del MCP | 3 | 1 | 2 | 0 |
| Otros MCPs y ecosistema | 1 | 1 | 0 | 0 |
| Cumplimiento / privacidad | 2 | 1 | 0 | 1 |

## Gaps detallados

### A. Identidad y plataforma GitHub

| ID | Hallazgo / estado actual | ¿Requiere mejora? | Recomendación |
|----|---------------------------|-------------------|---------------|
| A1 | GitHub Enterprise Cloud (Enterprise `tuyacol`) **solo para licencias de Copilot**. No hay repos en GitHub. | ✅ No | Mantener; documentar en runbook que el Enterprise no aloja código. |
| A2 | Autenticación de desarrolladores hacia Copilot vía GitHub.com con SSO contra Entra ID. | ✅ No | — |
| A3 | Repositorios de código en **Azure DevOps Repos** (no en GitHub). | ✅ No | Confirmar que Copilot Chat/CLI no requiere indexación adicional de repos GitHub. |
| A4 | **SSO con Entra ID configurado pero NO enforced** en el Enterprise `tuyacol`. | ⚠️ Sí | Activar *SSO enforcement* en el Enterprise; revocar PATs/sesiones que no hayan re-autenticado vía SAML. |

### B. Backend / modelos

| ID | Hallazgo / estado actual | ¿Requiere mejora? | Recomendación |
|----|---------------------------|-------------------|---------------|
| B1 | Plan **Copilot Business** contratado. Backend de modelos representado como caja opaca tras el Copilot Proxy. | ✅ No | Reevaluar Copilot Enterprise si se necesita indexación de repos, Knowledge Bases o Workspace. |

### C. Funcionalidades de Copilot

| ID | Hallazgo / estado actual | ¿Requiere mejora? | Recomendación |
|----|---------------------------|-------------------|---------------|
| C1 | En uso: **autocompletado, Chat, CLI, modo agente, modo plan**. | ✅ No | Definir guía de uso interno por funcionalidad (especialmente modo agente, que ejecuta scripts). |

### D. Gobierno y datos

| ID | Hallazgo / estado actual | ¿Requiere mejora? | Recomendación |
|----|---------------------------|-------------------|---------------|
| D1 | **Sin Content Exclusions** configuradas. | ⚠️ Sí | Inventariar repos/rutas con datos sensibles (secretos, datos regulados) y configurar exclusiones a nivel de organización/repo. |
| D2 | **Public Code Matching / Duplicate Detection**: política actual desconocida. | ❓ Por validar | Verificar la configuración del Enterprise (Block / Allow) y formalizarla en política escrita. |
| D3 | **Audit logs de Copilot** no se exportan a SIEM corporativo. | ⚠️ Sí | Habilitar streaming de audit log a Sentinel/Splunk vía Audit Log Streaming u API. |
| D4 | **Copilot Metrics API** no consumida; gobierno de IA en definición. | ⚠️ Sí | Construir dashboard de adopción/uso (Power BI o Grafana) basado en Metrics API; usar como insumo del programa de gobierno de IA. |

### E. Red y seguridad de tráfico

| ID | Hallazgo / estado actual | ¿Requiere mejora? | Recomendación |
|----|---------------------------|-------------------|---------------|
| E1 | **TLS break-and-inspect en Netskope** sobre tráfico de Copilot: estado desconocido. | ❓ Por validar | Confirmar con equipo de redes; si está activo, asegurar distribución de la CA de Netskope a estaciones (VS Code, CLI) y a pods en AKS. |
| E2 | **Azure API Management** delante del MCP corporativo: solo enrutamiento, sin autenticación ni políticas propias. | ✅ No (informativo) | Posible mejora futura: añadir validación de JWT/IP allowlist/throttling en APIM cuando se incorporen más MCPs. |

### F. AKS y despliegue del MCP

| ID | Hallazgo / estado actual | ¿Requiere mejora? | Recomendación |
|----|---------------------------|-------------------|---------------|
| F1 | Imagen oficial del SonarCloud MCP servida desde **ACR** (origen Docker Hub, mirror corporativo). | ✅ No | Mantener escaneo de vulnerabilidades de la imagen en ACR (Defender for Containers). |
| F2 | **Token administrador de SonarCloud** expuesto como **variable de entorno** en el deployment de Kubernetes. | ⚠️ Sí | Mover el secreto a **Azure Key Vault** y consumirlo vía **CSI Secrets Store driver** (o External Secrets Operator). Rotación automatizada. |
| F3 | El MCP corporativo solo está desplegado en **ambiente de desarrollo**. | ⚠️ Sí | Si se usa en flujos productivos, definir promoción a pre-prod/prod con HA, observabilidad y respaldo de configuración; si no, formalizar la decisión en ADR. |

### G. Otros MCPs y ecosistema

| ID | Hallazgo / estado actual | ¿Requiere mejora? | Recomendación |
|----|---------------------------|-------------------|---------------|
| G1 | Solo **SonarCloud MCP** corporativo activo; planificación inicial para draw.io MCP local y otros. | ✅ No (roadmap) | Definir plantilla de despliegue (Helm chart) reutilizable para futuros MCPs corporativos en AKS. |

### H. Cumplimiento / privacidad

| ID | Hallazgo / estado actual | ¿Requiere mejora? | Recomendación |
|----|---------------------------|-------------------|---------------|
| H1 | **DLP corporativo** (Microsoft Purview u otro) inspeccionando prompts/respuestas: estado desconocido. | ❓ Por validar | Confirmar con equipo de seguridad; si no existe, evaluar viabilidad de inspección a nivel Netskope o endpoint. |
| H2 | Sin requisito formal de **residencia de datos** (UE/US) sobre prompts de Copilot. | ✅ No (informativo) | Reevaluar si entran proyectos con regulación de residencia (p. ej. clientes UE bajo GDPR estricto). |

## Próximos pasos sugeridos (priorización rápida)

1. **A4** — Forzar SSO enforcement (impacto bajo, riesgo alto si no se hace).
2. **F2** — Mover token de SonarCloud a Key Vault (riesgo de exposición de credencial admin).
3. **D3** — Audit log streaming a SIEM (trazabilidad).
4. **D1** — Content Exclusions iniciales sobre repos sensibles.
5. **D4** — Empezar a consumir Copilot Metrics API.
6. Validar **D2**, **E1**, **H1** (ítems pendientes de información).
