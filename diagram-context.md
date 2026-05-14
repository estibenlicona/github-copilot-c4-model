[[_TOC_]]

## Objetivo

Implementar Github Copilot como plataforma corporativa de asistencia de ingeniería de software basada en IA generativa, integrada al ecosistema empresarial de Tuya, habilitando capacidades de productividad para los equipos de desarrollo bajo un marco de seguridad, identidad, gobierno y cumplimiento corporativo.

## Capacidades Funcionales

### Asistencia al desarrollo
- Generación contextual de código
- Refactorización asistida
- Generación de pruebas unitarias
- Explicación y documentación técnica
- Soporte troubleshooting técnico

### Interacción conversacional
- Chat técnico contextual.
- Consultas sobre código, frameworks y arquitectura
- Asistencia contextual sobre repositorios autorizados.

### Extensibilidad
- Integración con herramientas corporativas mediante MCPs

## Diagrama de contexto
![Diagrama de Contexto Github Copilot.drawio.png](/.attachments/Diagrama%20de%20Contexto%20Github%20Copilot.drawio-e31d6af2-c24b-441a-847f-f7b7fb7358e9.png)

| Actores | Descripción |
|-------|-------------|
| Desarrollador De Software | 	Utiliza Copilot para escribir, refactorizar y revisar código; recibe sugerencias contextuales y ejemplos; interactúa con la IA para resolver dudas técnicas, generar pruebas unitarias y optimizar implementaciones. |
|Analista de Gobierno de IA|Define políticas, lineamientos y estándares de gobernanza para el uso de IA (responsabilidad, privacidad, seguridad y evaluación de riesgos); establece criterios para selección y validación de modelos y datasets; define y vigila métricas de uso y rendimiento de la herramienta (por ejemplo: adopción, precisión, sesgo, número de incidentes, y costes); y coordina revisiones de impacto, aprobaciones y actualizaciones de las políticas.|
| Analista Protección De Identidad | Aplica y hace cumplir las políticas y lineamientos definidos por el Analista de Gobierno de IA; gestiona usuarios y asignación de licencias; configura restricciones de modelos y parámetros de uso; y supervisa auditorías, telemetría operativa y reportes de cumplimiento. |

| Sistema | Descripción |
| --- | --- |
| Microsoft Entra ID | Autenticación y autorización corporativa (SSO/OAuth/OpenID Connect); aprovisionamiento y sincronización de usuarios (SCIM); define grupos de seguridad que habilitan permisos de navegación a URLs de Copilot, proxies IDE y otros endpoints necesarios; aplica políticas de acceso condicional, MFA y control de dispositivos; emite tokens y aporta logs para auditoría. |
| Azure Repository | Repositorio corporativo (Azure Repos): fuente de código, historial, pull requests y metadata contextual que Copilot usa para generar sugerencias; integra mediante APIs, webhooks y git remotes para recuperar y actualizar contenido. |
| Modelos LLM | Proveedores de modelos (p. ej. OpenAI GPT‑4, Anthropic Claude o modelos privados) que procesan prompts y generan completions; manejan selección de modelo, parámetros, streaming y métricas de coste/latencia; sujetos a validación y restricciones de gobernanza. |
| IDs | Entornos de desarrollo (p. ej. VS Code, Visual Studio) donde se muestran sugerencias en tiempo real; comparten contexto (archivo abierto, cursor, historial) con Copilot vía extensiones/proxy y permiten acciones como completar, refactorizar e iniciar pruebas. |
| MCPs | Model Context Protocols / adaptadores que entregan, filtran y enmascaran contexto adicional (artefactos de build, análisis estático, datos de seguridad) antes de enviarlo a los modelos, estandarizando y aplicando reglas de control. |
| Copilot CLI | Interfaz de línea de comandos para usar Copilot fuera del IDE: generación y aplicación de sugerencias desde shells y scripts; facilita operaciones por lotes y automatización; se autentica con tokens corporativos, respeta políticas de gobernanza y registra telemetría. |


## Requerimientos no-funcionales


| Atributo | Requerimiento |
|----------|---------------|
| **Disponibilidad** | 99.9% según SLA de GitHub Business (≤ 43 min/mes de indisponibilidad) |
| **Tiempo de respuesta** | Autocompletado: &lt; 500ms promedio; Chat: &lt; 3s promedio |
| **Concurrencia** | Hasta 500 desarrolladores simultáneos en fase inicial |
| **Autenticación** | Obligatoria vía Microsoft Entra ID (SSO) |
| **Autorización** | Control de licencias por grupo de Azure AD |
| **Cifrado en tránsito** | TLS 1.3 para todas las comunicaciones |
| **Cifrado en reposo** | No aplica — Copilot no almacena código del usuario |
| **Auditoría** | Logs de uso disponibles en GitHub Business Audit Log |
| **Privacidad** | Código no se usa para entrenar modelos (GitHub Copilot Enterprise) |
| **DRP** | No aplica — servicio SaaS gestionado por GitHub |
| **Circular 005** | No aplica — no procesa datos financieros sensibles |

---

## Definiciones para repositorios

| Repositorio | Volumetría | Política de depuración | Mecanismo de depuración |
|-------------|------------|------------------------|-------------------------|
| Audit Log (GitHub) | ~50 MB/mes (estimado 500 usuarios) | Retención 90 días (plan Enterprise) | Automático por GitHub |
| Telemetría IDE | ~10 MB/mes por usuario | No se almacena localmente | Streaming a GitHub Analytics |
| Configuración MCP | < 1 MB (archivos JSON) | Manual — versionado en repositorio | Git (no requiere depuración) |
| Caché local IDE | ~100 MB por usuario | Limpieza al cerrar sesión | Automático por extensión |

---

## Diagrama de despliegue

El siguiente diagrama C4 de nivel 2 muestra los contenedores que componen la solución.

![Diagrama de Contenedores - GitHub Copilot](/.attachments/02-container-copilot.png =800x)

> **Tip:** Para ver el diagrama editable, accede al archivo `.drawio` en el repositorio de documentación.

**Contenedores:**
| Contenedor | Tecnología | Descripción |
|------------|------------|-------------|
| **Extensión VS Code** | TypeScript | Plugin que integra Copilot en VS Code |
| **Extensión JetBrains** | Kotlin | Plugin para IDEs JetBrains (IntelliJ, Rider) |
| **Copilot CLI** | Go | Herramienta de línea de comandos |
| **GitHub Copilot Backend** | Cloud (GitHub) | Servicio central que procesa prompts |
| **MCP Servers** | Node.js/Python | Servidores locales para extensibilidad |
| **Language Server** | TypeScript | LSP para análisis de código |

---

## Diagrama de secuencia

El siguiente diagrama muestra el flujo de completado de código (Code Completion).

![Diagrama de Secuencia - Code Completion](/.attachments/03-sequence-code-completion.png =800x)

<details>
<summary>:point_right: Ver flujo en formato Mermaid</summary>

::: mermaid
sequenceDiagram
    participant Dev as Desarrollador
    participant IDE as Extensión IDE
    participant LS as Language Server
    participant Backend as GitHub Copilot
    participant LLM as Modelo LLM
    
    Dev->>IDE: Escribe código
    IDE->>LS: Captura contexto
    LS->>IDE: Contexto procesado
    IDE->>Backend: Envía prompt (HTTPS)
    Backend->>LLM: Solicita completado
    LLM-->>Backend: Sugerencias
    Backend-->>IDE: Respuesta
    IDE-->>Dev: Muestra sugerencias inline
    Dev->>IDE: Acepta/Rechaza
:::

</details>

**Flujo principal:**

1. El desarrollador escribe código en el IDE.
2. La extensión Copilot captura el contexto (código circundante, archivos abiertos).
3. Se envía un prompt al backend de GitHub Copilot vía HTTPS.
4. El backend enruta al modelo LLM apropiado (GPT-4/Claude).
5. El modelo genera sugerencias de completado.
6. Las sugerencias se devuelven a la extensión.
7. La extensión muestra las sugerencias inline al desarrollador.
8. El desarrollador acepta, rechaza o modifica la sugerencia.

---

## Especificaciones

> **Nota:** Las unidades de despliegue corresponden a los componentes instalables y configurables de la solución.

| Unidad de despliegue | Restricciones | Tecnologías | Codificación |
|---------------------|---------------|-------------|--------------|
| **Extensión VS Code** | Requiere VS Code 1.80+ | TypeScript, VS Code Extension API | `EXT-COPILOT-VSCODE` |
| **Extensión JetBrains** | Requiere IntelliJ 2023.1+ | Kotlin, IntelliJ Platform SDK | `EXT-COPILOT-JB` |
| **Copilot CLI** | Windows 10+, macOS 12+, Linux | Go, GitHub CLI | `CLI-COPILOT` |
| **MCP Server draw.io** | Node.js 18+ | TypeScript, MCP SDK | `MCP-DRAWIO` |
| **MCP Server GitHub** | Node.js 18+ | TypeScript, MCP SDK, Octokit | `MCP-GITHUB` |
| **Configuración SSO** | Azure AD Premium P1 | SAML 2.0 / OIDC | `CFG-SSO-COPILOT` |

---

## Diagrama de módulos (opcional)

Para el MCP Server de draw.io (`MCP-DRAWIO`), se documenta la estructura de módulos:

::: mermaid
graph TD
    A[MCP Server draw.io] --> B[xml-generator]
    A --> C[mermaid-converter]
    A --> D[export-handler]
    A --> E[style-resolver]
    
    B --> F[Genera XML mxGraphModel]
    C --> G[Convierte Mermaid a XML]
    D --> H[Exporta PNG/SVG/PDF]
    E --> I[Aplica estilos C4 Tuya]
:::

| Módulo | Responsabilidad |
|--------|-----------------|
| `xml-generator` | Genera XML nativo de draw.io (mxGraphModel) |
| `mermaid-converter` | Convierte Mermaid a XML de draw.io |
| `export-handler` | Invoca CLI de draw.io para exportar PNG/SVG/PDF |
| `style-resolver` | Aplica estilos C4 y paleta Tuya |

---

## Exposición de servicios

| URL | Exposición | Descripción |
|-----|------------|-------------|
| https://github.com/features/copilot | Internet | Portal de producto |
| https://copilot.github.com/ | Internet | Endpoint principal de Copilot |
| https://api.github.com/copilot/* | Internet | API de completado y chat |
| https://github.com/settings/copilot | Internet | Configuración de usuario |
| https://github.com/enterprises/tuyacol | Internet | Configuración organizacional |
| ws://localhost:{port}/ | Local | MCP Servers (stdio/SSE) |

---

## Deuda técnica

> **Advertencia:** Los siguientes ítems están pendientes de implementación y deben completarse antes de considerar la arquitectura como producción.

- [ ] **MVP-001**:Implementar MCP Server para integración con Azure DevOps Boards.
- [ ] **MVP-002**: Crear diagrama de contenedores C2 en draw.io (pendiente validación visual).
- [ ] **MVP-003**: Crear diagrama de secuencia para flujo de Chat (además de Code Completion).
- [ ] **MVP-004**: Documentar configuración de políticas de Content Exclusion.
- [ ] **MVP-005**: Definir métricas de adopción y dashboard de telemetría.

---

## Anexos

> **Tip:** Consulta estos recursos para información adicional sobre GitHub Copilot.

**Documentación oficial:**
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [GitHub Copilot Enterprise Features](https://docs.github.com/en/enterprise-cloud@latest/copilot)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)

**Documentación interna:**
- [Estándar "Arquitectura de Soluciones v4" - Overview](https://flujodetrabajot.visualstudio.com/Tuya%20-%20Tecnologia/_wiki/wikis/Tuya---Tecnologia.wiki/10968/Est%C3%A1ndar-Arquitectura-de-Soluciones-v4-)
- [Diagrama de contexto v2 - Overview](https://flujodetrabajot.visualstudio.com/Tuya%20-%20Tecnologia/_wiki/wikis/Tuya---Tecnologia.wiki/10959/Diagrama-de-contexto-v2)
- [Mandamientos - Overview](https://flujodetrabajot.visualstudio.com/Tuya%20-%20Tecnologia/_wiki/wikis/Tuya---Tecnologia.wiki/10972/Mandamientos)

---

## Control

| Quien | Cuando | Actividad |
|-------|--------|-----------|
| @Copilot-CLI | Mayo 11 de 2025 | Documentación inicial (draft) |
| @Arquitecto-Software | Pendiente | Revisión y aprobación |
| @Líder-Técnico | Pendiente | Validación de especificaciones |

> **REGLA:** Toda arquitectura cuenta con plazo de 6 meses para implementarse. Plazo inicia a partir de la fecha de documentación.

> **REGLA:** Esta arquitectura se considera MVP y debe ser declarada como deuda técnica hasta completar los diagramas C2 y secuencia.
