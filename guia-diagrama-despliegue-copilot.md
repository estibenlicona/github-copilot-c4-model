# Guía para modelar el Diagrama de Despliegue de GitHub Copilot en tu empresa

Esta guía está dividida en dos partes:

1. **Cuestionario** — preguntas que debes responder, una por una, para tener clara la información antes de dibujar.
2. **Paso a paso** — instrucciones concretas para construir el diagrama en draw.io siguiendo el estándar Tuya (C4 Model, nivel 2 - Deployment).

> Notación de referencia: `diagrama-despliegue.md` y skill `.github/skills/drawio/SKILL.md`.

---

## Parte 1 — Cuestionario (respóndelo una pregunta a la vez)

Responde cada pregunta antes de pasar a la siguiente. Anota la respuesta al lado.

### A. Alcance y propósito

1. ¿Cuál es el **objetivo del diagrama**? (ej. comunicar la arquitectura de Copilot al COE, soportar una decisión de seguridad, sustentar el RFC de adopción)
2. ¿Quién es la **audiencia** principal? (Arquitectura, Seguridad, Infraestructura, Auditoría, Negocio)
3. ¿Qué **caso de uso de Copilot** vas a representar?
   - [ ] Solo Copilot en IDE (autocompletado + chat)
   - [ ] IDE + Copilot CLI
   - [ ] IDE + Agente (modo agente con MCPs)
   - [ ] Copilot en GitHub.com (PR review, Spaces)
   - [ ] Todos los anteriores (vista integral)

### B. Usuarios y endpoints corporativos (on-premise)

4. ¿Desde qué **dispositivos** se usa Copilot? (ej. laptop corporativa Windows, MacBook, VDI/Citrix)
5. ¿Qué **IDEs / clientes** están aprobados? (VS Code, Visual Studio, JetBrains, Neovim, CLI)
6. ¿El desarrollador usa **Copilot CLI** y/o **agente con MCPs locales**? ¿Cuáles MCPs locales? (filesystem, git, shell, etc.)
7. ¿Existe un **proxy corporativo / firewall** entre el equipo del desarrollador e internet? ¿Nombre del servicio? (ej. Zscaler, Forcepoint, proxy interno)
8. ¿Hay **inspección TLS** (MITM) en ese proxy? ¿Se publican certificados raíz internos a los equipos?

### C. GitHub Cloud (nube de GitHub)

9. ¿Qué **plan de Copilot** tienen? (Business / Enterprise)
10. Nombre de la **organización / enterprise** en GitHub.com (ej. `tuyacol`).
11. ¿Usan **GitHub.com** o **GitHub Enterprise Server (on-prem)**?
12. ¿Qué **servicios SaaS de Copilot** quieres mostrar? (Proxy Copilot, Servicio LLM, Consola admin, Audit Log API, Metrics API, Licenciamiento, Knowledge Base / Spaces)
13. ¿Quieres mostrar el **Content Exclusion / Policy** como unidad separada?

### D. Repositorios y CI/CD

14. ¿Dónde viven los **repositorios de código**? (Azure DevOps Repos, GitHub.com, Bitbucket, GitLab)
15. ¿Hay un **pipeline de CI/CD** que se deba mostrar? (Azure Pipelines, GitHub Actions, Jenkins)
16. ¿Usan **Copilot Coding Agent** (PRs creados por Copilot)? Si sí, ¿con qué runners?

### E. Plataforma MCP remota (si aplica)

17. ¿Tienen MCPs **remotos** (no solo locales)? Si sí, ¿en qué nube? (Azure, AWS, GCP, on-prem)
18. ¿Qué MCPs remotos? (SonarCloud, Jira, Confluence, ServiceNow, BD interna, etc.)
19. Plataforma de ejecución: ¿**AKS / EKS / GKE**, App Service, Container Apps, VM?
20. ¿Usan **API Management** delante? (Azure APIM, Kong, AWS API Gateway)
21. ¿Usan **Container Registry** propio? (ACR, ECR, Harbor)
22. ¿Hay **réplica geográfica / DR**? ¿Qué % de disponibilidad ofrecen?

### F. Identidad, secretos y seguridad

23. ¿Cuál es el **IdP corporativo**? (Entra ID / Azure AD, Okta, AD FS)
24. ¿Hay **SSO** hacia GitHub.com? ¿SCIM provisioning?
25. ¿Dónde se guardan los **secretos** que consumen los MCPs/servicios? (Azure Key Vault, HashiCorp Vault, AWS Secrets Manager) — **debe ir como Sistema externo** según el estándar Tuya.
26. ¿Hay **DLP / CASB** monitoreando el tráfico de Copilot? (ej. Defender for Cloud Apps, Netskope)

### G. Sistemas internos consumidos por Copilot/MCPs

27. Lista los **sistemas internos** que Copilot/MCPs consultan (BD core, APIs internas, SonarCloud, Jira, etc.). Para cada uno:
    - Nombre exacto del Inventario de Aplicaciones
    - Tipo: `[Software System]` o `[Core System]`
    - Protocolo de consumo: HTTPS, JDBC, gRPC, etc.

### H. Observabilidad

28. ¿Dónde se envían los **logs de auditoría** de Copilot? (Splunk, Sentinel, Elastic, Log Analytics)
29. ¿Qué herramienta consume las **métricas de adopción**? (Power BI, Grafana, dashboard propio)

### I. Elementos del estándar Tuya

30. ¿Hay unidades **nuevas (`++`)** o **modificadas (`**`)** que debas marcar?
31. ¿Qué **entornos (datacenters)** debes representar? Para cada uno, indica si es `on premise` o `cloud` y su nombre.
32. ¿Qué **% de disponibilidad** tiene cada nodo? (se incluye en el nombre del nodo)

---

## Parte 2 — Paso a paso para construir el diagrama en draw.io

Sigue estos pasos en orden. Asume que ya respondiste el cuestionario.

### Paso 1 — Preparar el archivo

1. Abre VS Code en el repo `github-copilot-c4-model`.
2. Crea el archivo `diagrams/02-deployment-copilot-tuya.drawio`.
3. Ábrelo con la extensión **Draw.io Integration** (Hediet) o en draw.io desktop.
4. Configura página: **A3 horizontal**, grid activo, snap to grid.

### Paso 2 — Definir los Entornos (Environments)

Por cada entorno identificado en la pregunta **31**, crea un **swimlane** transparente:

- Estilo: `swimlane;startSize=40;fillColor=none;strokeColor=#444444;fontColor=#444444;fontStyle=1;dashed=1;html=1;rounded=0;align=center;`
- Label: `<Nombre del datacenter>\n[Environment: on premise|cloud]`
- Entornos típicos para Copilot en Tuya:
  - **Tuya — Endpoints corporativos** `[Environment: on premise]`
  - **GitHub Cloud — Enterprise <org>** `[Environment: cloud]`
  - **Azure — Plataforma MCPs** `[Environment: cloud]` *(si aplica)*
  - **Azure DevOps — tuyacol** `[Environment: cloud]` *(si aplica)*

Distribúyelos de izquierda a derecha siguiendo el flujo: usuario → GitHub → backends internos.

### Paso 3 — Crear los Nodos (Deployment Nodes)

Dentro de cada entorno, crea swimlanes anidados para cada nodo de infraestructura. Estilo nodo principal:

```
swimlane;startSize=30;fillColor=#FFFFFF;strokeColor=#6B6B6B;fontColor=#1F2933;fontStyle=1;html=1;rounded=0;align=center;
```

Label: `<b>Nombre del nodo (99.9%)</b><br>[Deployment node: tipo]`

Nodos típicos:

| Entorno | Nodos sugeridos |
|---------|-----------------|
| Endpoints corporativos | Workstation del desarrollador, VDI (opcional), Proxy corporativo |
| GitHub Cloud | GitHub.com / Copilot SaaS |
| Azure | AKS, APIM, ACR, Key Vault (como sistema externo, ver paso 5) |
| Azure DevOps | Repos, Pipelines |

### Paso 4 — Colocar las Unidades de despliegue

Dentro de cada nodo, dibuja rectángulos azules para cada unidad. Estilo Tuya:

```
rounded=1;whiteSpace=wrap;html=1;fillColor=#23A2D9;strokeColor=#1A7AA8;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=6;
```

> El estándar Tuya usa `#23A2D9`. Los archivos previos usan `#438DD5` (paleta C4 estándar). Decide cuál seguir y mantén consistencia.

Label: `<b>Nombre ++</b><br>[Deployment unit: tipo]<br><br>Descripción corta.`

Unidades típicas para Copilot:

- **Workstation:** VS Code + Copilot, Copilot CLI, MCPs locales, Shell, Cliente Git, Workspace local, Navegador.
- **GitHub SaaS:** Proxy Copilot, Servicio LLM, Consola admin, Audit Log API, Metrics API, Licenciamiento.
- **AKS:** Ingress, Pod MCP Server (uno por cada MCP remoto).
- **APIM:** Una ruta por cada MCP expuesto.
- **ACR:** Imagen MCP, Réplica geo (si aplica, en gris para indicar pasivo).
- **Azure DevOps:** Repos, Pipelines.

### Paso 5 — Agregar Sistemas externos

Para cada dependencia externa (pregunta **25** y **27**), crea un rectángulo gris:

```
rounded=1;whiteSpace=wrap;html=1;fillColor=#8C8496;strokeColor=#5F5965;fontColor=#FFFFFF;align=center;verticalAlign=top;spacingTop=6;
```

Label: `<b>Nombre exacto</b><br>[Software System]<br><br>Responsabilidad.`

Obligatorios:
- **Bóveda de secretos** (Key Vault / Vault) — regla del estándar Tuya.
- IdP corporativo (Entra ID).
- Sistemas internos consumidos.

### Paso 6 — Dibujar las Relaciones

Estilo de edge:

```
edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeColor=#828282;endArrow=classic;
```

Label de cada relación: `<b>Verbo</b><br>[protocolo]` — ejemplos:

- `Envía prompts<br>[HTTPS/JSON]`
- `Inferencia<br>[HTTPS/JSON]`
- `Lee secretos<br>[HTTPS/REST]`
- `Push/Pull<br>[HTTPS/Git]`
- `Audita eventos<br>[HTTPS/JSON]`
- `Autentica<br>[OIDC/SAML]`

Reglas:
- La flecha apunta **al destino de la dependencia** (quien provee).
- Si una relación cruza varios entornos, déjala en `parent="1"` (root) para que el router orthogonal la trace limpia.

### Paso 7 — Marcar elementos nuevos o modificados

- Si la unidad es **nueva**: agrega `++` al final del nombre en negrita.
- Si la unidad se **modifica**: agrega `**` al final.

### Paso 8 — Agregar título y leyenda

1. Título superior: `GitHub Copilot — Diagrama de Despliegue C2 — <Tu empresa>`.
2. Leyenda inferior con: color azul (unidad de despliegue), gris (sistema externo), swimlane con borde discontinuo (entorno), swimlane blanco (nodo), línea gris (relación).

### Paso 9 — Validar contra el estándar

Checklist antes de exportar:

- [ ] Todo nodo tiene `[Deployment node: ...]` y `(% disponibilidad)`.
- [ ] Toda unidad tiene `[Deployment unit: ...]` y descripción.
- [ ] Todo sistema externo tiene `[Software System]` o `[Core System]`.
- [ ] La bóveda de secretos aparece como sistema externo.
- [ ] Toda relación tiene verbo + `[protocolo]`.
- [ ] No hay textos genéricos como "API" sin tipo específico.
- [ ] Los fronts stand-alone (si aplica) aparecen dos veces: en el nodo que aloja el instalador y en el dispositivo.
- [ ] Nombres coinciden con el **Inventario de Aplicaciones**.

### Paso 10 — Exportar y publicar

1. `File → Export As → PNG` con escala 2x → guarda como `diagrams/02-deployment-copilot-tuya.png`.
2. `File → Export As → SVG` (editable) → guarda como `diagrams/02-deployment-copilot-tuya.svg`.
3. Commitea los tres archivos (`.drawio`, `.png`, `.svg`).
4. Sube el PNG a la Wiki de Azure DevOps en la página correspondiente del diagrama de despliegue.

### Paso 11 — Revisión

1. Comparte el PNG con un par de Arquitectura y un par de Seguridad.
2. Itera sobre comentarios.
3. Una vez aprobado, marca la versión: agrega `v1.0` en el título.

---

## Anexo — Plantilla XML mínima para empezar

Copia esto como punto de partida en `diagrams/02-deployment-copilot-tuya.drawio`:

```xml
<mxfile>
  <diagram name="Despliegue Copilot Tuya" id="dep-tuya">
    <mxGraphModel dx="2000" dy="1200" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1684" pageHeight="1191" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="title" value="GitHub Copilot — Despliegue C2 — Tuya" style="text;html=1;align=center;fontSize=20;fontStyle=1;fontColor=#1F2933;" vertex="1" parent="1">
          <mxGeometry x="40" y="20" width="1600" height="32" as="geometry"/>
        </mxCell>
        <mxCell id="env-onprem" value="Tuya — Endpoints corporativos&#10;[Environment: on premise]" style="swimlane;startSize=40;fillColor=none;strokeColor=#444444;fontColor=#444444;fontStyle=1;dashed=1;html=1;rounded=0;align=center;" vertex="1" parent="1">
          <mxGeometry x="40" y="70" width="420" height="700" as="geometry"/>
        </mxCell>
        <mxCell id="env-github" value="GitHub Cloud — Enterprise tuyacol&#10;[Environment: cloud]" style="swimlane;startSize=40;fillColor=none;strokeColor=#444444;fontColor=#444444;fontStyle=1;dashed=1;html=1;rounded=0;align=center;" vertex="1" parent="1">
          <mxGeometry x="490" y="70" width="560" height="700" as="geometry"/>
        </mxCell>
        <mxCell id="env-azure" value="Azure — Plataforma MCPs&#10;[Environment: cloud]" style="swimlane;startSize=40;fillColor=none;strokeColor=#444444;fontColor=#444444;fontStyle=1;dashed=1;html=1;rounded=0;align=center;" vertex="1" parent="1">
          <mxGeometry x="1080" y="70" width="560" height="700" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

Sobre esa plantilla, agrega los nodos (paso 3), las unidades (paso 4), los sistemas externos (paso 5) y las relaciones (paso 6).

---

**Fin de la guía.** Cuando tengas las respuestas del cuestionario, puedes pedirle a Copilot que genere el XML completo a partir de ellas.
