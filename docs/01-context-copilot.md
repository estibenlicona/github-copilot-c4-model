# Diagrama de contexto C1 — GitHub Copilot

> **Nivel C4:** 1 — Contexto  
> **Fuente editable:** `diagrams/01-context-copilot.drawio`  
> **Variante premium (HTML interactivo):** `presentation/01-context-copilot-premium.html`

[[_TOC_]]

---

## 1. Alcance

Este diagrama representa el **sistema en foco — GitHub Copilot** dentro del ecosistema corporativo de Tuya y los actores y sistemas externos que interactúan con él. Es la vista de **mayor abstracción** del modelo C4: no muestra contenedores, módulos ni código.

Objetivo: comunicar de forma ejecutiva **quién usa Copilot** y **con qué sistemas se integra**.

---

## 2. Actores (Personas)

| Actor | Tipo | Responsabilidades |
|-------|------|-------------------|
| **Desarrollador de software** | `[Person]` | Genera y acepta sugerencias de código, pide explicaciones y refactors, genera pruebas unitarias, opera Git contra Azure DevOps Repos. |
| **Analista de Gobierno de IA** | `[Person]` | Define políticas y lineamientos de uso de IA (responsabilidad, privacidad, seguridad). Valida modelos y datasets. Vigila métricas (adopción, sesgo, costos). Coordina revisiones de impacto. |
| **Analista Protección de Identidad** | `[Person]` | Aplica las políticas de gobernanza. Gestiona usuarios, grupos y licencias. Configura restricciones de modelos. Supervisa auditoría, telemetría y reportes de cumplimiento. |

---

## 3. Sistema en foco

| Sistema | Tipo | Descripción |
|---------|------|-------------|
| **GitHub Copilot** | `[Software System]` | Plataforma corporativa de asistencia de ingeniería basada en IA generativa, integrada al ecosistema Tuya bajo controles de seguridad, identidad, gobierno y cumplimiento. Provee generación contextual de código, refactor asistido, generación de pruebas, chat técnico y extensibilidad vía MCPs. |

---

## 4. Sistemas externos

| Sistema | Tipo | Rol en el contexto |
|---------|------|---------------------|
| **Microsoft Entra ID** | `[Core System]` | IdP corporativo. Autentica usuarios vía SSO (SAML/OIDC), aprovisiona via SCIM, aplica acceso condicional + MFA, emite tokens y logs de auditoría. |
| **Modelos LLM** | `[Software System]` | Proveedores (OpenAI GPT-4, Anthropic Claude, Google) que procesan prompts y generan completados. Sujetos a validación y restricciones de gobernanza. |
| **Azure DevOps Repos** | `[Software System]` | Repositorios corporativos: fuente de código, historial, pull requests y metadata contextual que Copilot consume vía APIs y Git remotes. |
| **IDEs / CLI** | `[Software System]` | Entornos de desarrollo (VS Code, JetBrains, Copilot CLI) donde se muestran sugerencias en tiempo real y se comparte contexto con Copilot. |
| **Servidores MCP** | `[Software System]` | Model Context Protocol servers (locales y corporativos) que entregan, filtran y enmascaran contexto adicional antes de enviarlo a los modelos. |

---

## 5. Relaciones

### 5.1 Personas → Sistema en foco

| Origen | Verbo | Destino | Protocolo |
|--------|-------|---------|-----------|
| Desarrollador | Solicita asistencia de código | GitHub Copilot | HTTPS |
| Analista de Gobierno de IA | Define políticas de uso | GitHub Copilot | HTML/HTTPS (consola) |
| Analista Protección de Identidad | Administra licencias y auditoría | GitHub Copilot | HTML/HTTPS (consola) |
| Desarrollador | Versiona código | Azure DevOps Repos | Git/HTTPS |

### 5.2 Sistema en foco → Sistemas externos

| Origen | Verbo | Destino | Protocolo |
|--------|-------|---------|-----------|
| GitHub Copilot | Autentica / autoriza usuarios | Microsoft Entra ID | SAML/OIDC |
| GitHub Copilot | Solicita inferencia | Modelos LLM | API/HTTPS |
| GitHub Copilot | Consulta contexto del código | Azure DevOps Repos | REST/HTTPS |
| GitHub Copilot | Provee sugerencias inline | IDEs / CLI | JSON/HTTPS |
| GitHub Copilot | Invoca herramientas | Servidores MCP | JSON-RPC |

---

## 6. Atributos no funcionales relevantes

| Atributo | Valor |
|----------|-------|
| Disponibilidad | 99.9% (SLA GitHub Business) |
| Autenticación | Obligatoria vía Microsoft Entra ID (SSO) |
| Autorización | Licencias controladas por grupo en Entra ID |
| Cifrado en tránsito | TLS 1.3 |
| Cifrado en reposo | No aplica (Copilot no almacena código del usuario) |
| Auditoría | GitHub Business Audit Log + futura exportación a SIEM |
| Privacidad | Código no se usa para entrenar modelos (Copilot Enterprise) |

---

## 7. Cómo navegar la variante premium

El archivo `presentation/01-context-copilot-premium.html` renderiza este diagrama con **Cytoscape.js + ELK** y aplica la **paleta y nomenclatura C4 Tuya**:

- **Color de fondo de cada nodo** = tipo de elemento (azul oscuro persona, azul medio sistema en foco, gris sistema externo, púrpura core).
- **Hover sobre un nodo** → tooltip con nombre, tipo, descripción y lista de responsabilidades.
- **Hover sobre una relación** → tooltip con verbo y protocolo.
- **Botón "Ajustar vista"** → recentra el grafo.
- **Botón "Exportar PNG"** → descarga la imagen escalada 2×.

Abrir directamente con doble clic o `Invoke-Item presentation\01-context-copilot-premium.html`.

---

## 8. Relación con otros niveles

| Nivel | Documento |
|-------|-----------|
| **C1 — Contexto** | _Este documento_ |
| **C2 — Despliegue** | [`docs/02-deployment-copilot-v2.md`](./02-deployment-copilot-v2.md) — detalla los contenedores y nodos de despliegue dentro de "GitHub Copilot" y "Azure / Tuya". |
| **C3 — Módulos** | _Pendiente_ — se documentará por unidad de despliegue cuando aplique. |

---

## 9. Control de cambios

| Autor | Fecha | Cambio |
|-------|-------|--------|
| Arquitectura · Copilot CLI | 2026-05 | Versión inicial (premium Cytoscape + MD) |
