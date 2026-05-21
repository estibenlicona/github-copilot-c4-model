# Inventario de Componentes — GitHub Copilot (C4 Container)

Documento orientado al equipo de **Seguridad**. Clasifica cada contenedor del diagrama C4 según el nivel de control que la compañía tiene sobre él.

## Leyenda de niveles de control

| Nivel | Significado | Color en diagrama |
|---|---|---|
| 🟦 **Control total** | Software instalado/operado por la compañía en infraestructura corporativa. Seguridad puede inspeccionar, parchear, restringir y monitorizar. | Azul C4 (`#1168BD`) |
| 🟪 **Control administrativo** | SaaS de terceros bajo tenant/contrato corporativo. La infraestructura es del proveedor; la compañía administra políticas, identidades y auditoría. | Azul claro C4 (`#438DD5`) |
| ⬜ **Externo / sin control** | Servicio de terceros sin gobierno administrativo directo. La compañía consume el servicio pero no controla datos, modelos ni infraestructura. | Gris C4 (`#999999`) |

---

## Tabla de componentes

| Nombre | Descripción | Nivel Control |
|---|---|---|
| **IDE** (VS Code, Visual Studio) | Entorno de desarrollo instalado en el endpoint corporativo. Punto principal de interacción del desarrollador con GitHub Copilot (autocompletado, chat, agentes). | 🟦 Control total |
| **GitHub Copilot CLI** | Interfaz de línea de comandos para interactuar con GitHub Copilot desde la terminal (requiere PowerShell 7+). Se instala como agente local en el endpoint. | 🟦 Control total |
| **Git Client** | Cliente de control de versiones para gestionar repositorios locales y habilitar flujos Git asistidos por Copilot. Software local en el endpoint. | 🟦 Control total |
| **Local MCP Servers** | Servidores locales que exponen capacidades y contexto adicional a Copilot mediante el protocolo MCP (Model Context Protocol). Procesos que corren en la workstation del desarrollador. | 🟦 Control total |
| **Netskope Client** | Agente de seguridad corporativo instalado en el endpoint. Intercepta y reenvía el tráfico saliente hacia Netskope SSE para inspección y aplicación de políticas. | 🟦 Control total |
| **Entra ID** | Proveedor corporativo de identidad (Microsoft Entra). Gestiona autenticación, federación SSO y políticas de acceso condicional sobre el tenant corporativo. | 🟪 Control administrativo |
| **Azure OpenAI** | Servicio Azure (suscripción corporativa) que provee capacidades de IA generativa para escenarios administrativos de Copilot (Copilot Chat, Copilot Admin). | 🟪 Control administrativo |
| **Azure Repos** | Servicio de Azure DevOps (organización corporativa) para almacenamiento, gestión y colaboración sobre repositorios de código fuente. | 🟪 Control administrativo |
| **Netskope SSE** | Plataforma corporativa de Security Service Edge (instancia bajo contrato). Inspecciona tráfico, aplica políticas DLP/CASB y habilita acceso seguro a servicios externos. | 🟪 Control administrativo |
| **GitHub Copilot Services** | Plataforma SaaS operada por GitHub (Microsoft) que habilita las capacidades de asistencia IA al desarrollo (completions, chat, agentes). | ⬜ Externo / sin control |
| **GitHub Web Portal** | Aplicación web pública de GitHub.com utilizada para administración de licencias, políticas y acceso a capacidades de GitHub Copilot. | ⬜ Externo / sin control |
| **GitHub Models** | Gateway administrado por GitHub para enrutamiento y acceso a modelos fundacionales utilizados por las capacidades de Copilot. | ⬜ Externo / sin control |
| **OpenAI** | Proveedor externo de modelos fundacionales (GPT) consumido por GitHub Copilot a través de GitHub Models. | ⬜ Externo / sin control |
| **Anthropic** | Proveedor externo de modelos fundacionales avanzados (Claude) consumido por GitHub Copilot a través de GitHub Models. | ⬜ Externo / sin control |

---

## Resumen por nivel de control

| Nivel | Cantidad | Componentes |
|---|---|---|
| 🟦 Control total | 5 | IDE, GitHub Copilot CLI, Git Client, Local MCP Servers, Netskope Client |
| 🟪 Control administrativo | 4 | Entra ID, Azure OpenAI, Azure Repos, Netskope SSE |
| ⬜ Externo / sin control | 5 | GitHub Copilot Services, GitHub Web Portal, GitHub Models, OpenAI, Anthropic |
| **Total** | **14** | |
