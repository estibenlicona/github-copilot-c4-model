// Diagrama de despliegue C2 — GitHub Copilot
// Fuente: diagrams/02-deployment-copilot-v2.drawio
// Renderizado con Cytoscape.js + ELK (routing ortogonal automatico)

cytoscape.use(cytoscapeElk);

const elements = [
  // ============================================================
  // ENTORNOS (compound parents nivel 1)
  // ============================================================
  { data: { id: 'env-onprem', label: 'Tuya — Endpoints corporativos\n[Environment: on premise]', type: 'env' } },
  { data: { id: 'env-github', label: 'GitHub Cloud — Enterprise tuyacol\n[Environment: cloud]', type: 'env' } },
  { data: { id: 'env-azure', label: 'Azure — Plataforma MCPs dev\n[Environment: cloud]', type: 'env' } },

  // ============================================================
  // NODOS DE DESPLIEGUE (compound parents nivel 2)
  // ============================================================
  { data: { id: 'node-ws', label: 'Equipo del desarrollador\n[Workstation Windows/macOS]', parent: 'env-onprem', type: 'node-active' } },
  { data: { id: 'node-github-saas', label: 'GitHub.com / Copilot SaaS (99.9%)\n[SaaS Platform]', parent: 'env-github', type: 'node-active' } },
  { data: { id: 'node-apim', label: 'Azure API Management dev\n[API Gateway]', parent: 'env-azure', type: 'node-active' } },
  { data: { id: 'node-acr', label: 'Azure Container Registry dev\n[Container Registry]', parent: 'env-azure', type: 'node-active' } },
  { data: { id: 'node-aks', label: 'AKS desarrollo\n[Kubernetes Cluster]', parent: 'env-azure', type: 'node-active' } },
  { data: { id: 'ns-mcp', label: 'Namespace MCP dev\n[Kubernetes Namespace]', parent: 'node-aks', type: 'node-active' } },

  // ============================================================
  // UNIDADES — Workstation
  // ============================================================
  { data: { id: 'u-vscode', label: 'VS Code + Extension Copilot\n[IDE Extension]', parent: 'node-ws', type: 'unit' } },
  { data: { id: 'u-cli', label: 'GitHub Copilot CLI\n[CLI]', parent: 'node-ws', type: 'unit' } },
  { data: { id: 'u-mcps-local', label: 'MCPs locales\n[Local MCP Server]', parent: 'node-ws', type: 'unit' } },
  { data: { id: 'u-shell', label: 'Shell / scripts\n[Shell]', parent: 'node-ws', type: 'unit' } },
  { data: { id: 'u-git', label: 'Cliente Git\n[Git Client]', parent: 'node-ws', type: 'unit' } },
  { data: { id: 'u-workspace', label: 'Workspace local\n[File System]', parent: 'node-ws', type: 'unit' } },
  { data: { id: 'u-browser', label: 'Navegador corporativo\n[Browser]', parent: 'node-ws', type: 'unit' } },

  // ============================================================
  // UNIDADES — GitHub Cloud
  // ============================================================
  { data: { id: 'u-proxy', label: 'Proxy de GitHub Copilot\n[API]', parent: 'node-github-saas', type: 'unit' } },
  { data: { id: 'u-llm', label: 'Servicio de modelos LLM\n[LLM Inference Service]', parent: 'node-github-saas', type: 'unit' } },
  { data: { id: 'u-console', label: 'Consola admin Copilot\n[Web App]', parent: 'node-github-saas', type: 'unit' } },
  { data: { id: 'u-audit-api', label: 'Audit Log API\n[API]', parent: 'node-github-saas', type: 'unit' } },
  { data: { id: 'u-metrics-api', label: 'Metrics API\n[API]', parent: 'node-github-saas', type: 'unit' } },
  { data: { id: 'u-license', label: 'Servicio de licenciamiento Copilot\n[API]', parent: 'node-github-saas', type: 'unit' } },
  { data: { id: 'u-azdo-repos', label: 'Azure DevOps Repos\n[Git Hosting]', parent: 'node-github-saas', type: 'unit' } },
  { data: { id: 'u-audit-store', label: 'Almacenamiento de auditoria\n[Log Store]', parent: 'node-github-saas', type: 'unit' } },

  // ============================================================
  // UNIDADES — Azure dev (APIM / ACR / AKS-namespace)
  // ============================================================
  { data: { id: 'u-api-sonar', label: 'API SonarCloud MCP\n[API Gateway Route]', parent: 'node-apim', type: 'unit' } },

  { data: { id: 'u-image-sonar', label: 'Imagen SonarCloud MCP\n[OCI Image]', parent: 'node-acr', type: 'unit' } },
  { data: { id: 'u-acr-replica', label: 'Replica geo ACR\n[Container Registry · pasivo]', parent: 'node-acr', type: 'node-passive' } },

  { data: { id: 'u-ingress', label: 'Ingress / Service\n[Kubernetes Service]', parent: 'ns-mcp', type: 'unit' } },
  { data: { id: 'u-mcp-server', label: 'SonarCloud MCP Server\n[MCP Server]', parent: 'ns-mcp', type: 'unit' } },
  { data: { id: 'u-token', label: 'Token admin SonarCloud **\n[K8s Env Var]', parent: 'ns-mcp', type: 'unit-modified' } },
  { data: { id: 'u-csi', label: 'CSI Secrets Driver ++\n[K8s CSI Driver]', parent: 'ns-mcp', type: 'unit-new' } },
  { data: { id: 'u-logs', label: 'Logs del pod MCP\n[Container Logs]', parent: 'ns-mcp', type: 'unit' } },
  { data: { id: 'u-template', label: 'Plantilla futuros MCPs ++\n[Helm Template]', parent: 'ns-mcp', type: 'unit-new' } },

  // ============================================================
  // SISTEMAS EXTERNOS / CORE (fuera de entornos)
  // ============================================================
  { data: { id: 'sys-netskope', label: 'Netskope SWG\n[Software System]\n(gap E1: TLS B&I por validar)', type: 'system' } },
  { data: { id: 'sys-entra', label: 'Microsoft Entra ID\n[Core System]\n(gap A4: SSO no enforced)', type: 'core' } },
  { data: { id: 'sys-sonar', label: 'SonarCloud\n[Software System]', type: 'system' } },
  { data: { id: 'sys-kv', label: 'Azure Key Vault ++\n[Software System · recomendado]', type: 'system-future' } },
  { data: { id: 'sys-siem', label: 'SIEM corporativo\n[Software System · futuro]', type: 'system-future' } },
  { data: { id: 'sys-bi', label: 'Plataforma BI / Adopcion\n[Software System · futuro]', type: 'system-future' } },

  // ============================================================
  // RELACIONES — 7.1 Endpoint -> Copilot
  // ============================================================
  { data: { source: 'u-vscode', target: 'u-workspace', label: 'Lee contexto\n[FS local]', type: 'rel' } },
  { data: { source: 'u-cli', target: 'u-workspace', label: 'Lee contexto\n[FS local]', type: 'rel' } },
  { data: { source: 'u-vscode', target: 'u-mcps-local', label: 'Invoca herramientas\n[JSON-RPC/stdio]', type: 'rel' } },
  { data: { source: 'u-cli', target: 'u-mcps-local', label: 'Invoca herramientas\n[JSON-RPC/stdio]', type: 'rel' } },
  { data: { source: 'u-vscode', target: 'u-shell', label: 'Ejecuta comandos\n[Proceso local]', type: 'rel' } },
  { data: { source: 'u-cli', target: 'u-shell', label: 'Ejecuta comandos\n[Proceso local]', type: 'rel' } },
  { data: { source: 'u-git', target: 'u-azdo-repos', label: 'Push/pull\n[Git/HTTPS]', type: 'rel' } },
  { data: { source: 'u-vscode', target: 'sys-netskope', label: 'Envia prompts/chat\n[JSON/HTTPS]', type: 'rel' } },
  { data: { source: 'u-cli', target: 'sys-netskope', label: 'Envia prompts/chat\n[JSON/HTTPS]', type: 'rel' } },
  { data: { source: 'u-browser', target: 'u-console', label: 'Administra Enterprise\n[HTML/HTTPS]', type: 'rel' } },

  // ============================================================
  // RELACIONES — 7.2 Borde corporativo y backend Copilot
  // ============================================================
  { data: { source: 'sys-netskope', target: 'u-proxy', label: 'Egress Copilot\n[JSON/HTTPS]', type: 'rel' } },
  { data: { source: 'u-proxy', target: 'u-llm', label: 'Solicita inferencia\n[API/HTTPS]', type: 'rel' } },
  { data: { source: 'u-proxy', target: 'u-license', label: 'Valida entitlement\n[JSON/HTTPS]', type: 'rel' } },
  { data: { source: 'u-license', target: 'sys-entra', label: 'Verifica grupo/SSO\n[SAML/OIDC]', type: 'rel' } },
  { data: { source: 'u-console', target: 'sys-entra', label: 'Autentica admin\n[SAML/SCIM]', type: 'rel' } },
  { data: { source: 'u-audit-api', target: 'u-audit-store', label: 'Persiste eventos\n[interno]', type: 'rel' } },
  { data: { source: 'u-audit-api', target: 'sys-siem', label: 'Exportar (D3)\n[JSON/HTTPS]', type: 'rel-future' } },
  { data: { source: 'u-metrics-api', target: 'sys-bi', label: 'Consumir (D4)\n[JSON/HTTPS]', type: 'rel-future' } },

  // ============================================================
  // RELACIONES — 7.3 MCP corporativo
  // ============================================================
  { data: { source: 'sys-netskope', target: 'u-api-sonar', label: 'Egress MCP\n[JSON/HTTPS + token]', type: 'rel' } },
  { data: { source: 'u-api-sonar', target: 'u-ingress', label: 'Enruta\n[HTTPS]', type: 'rel' } },
  { data: { source: 'u-ingress', target: 'u-mcp-server', label: 'Forward\n[HTTP]', type: 'rel' } },
  { data: { source: 'u-mcp-server', target: 'u-token', label: 'Lee token admin\n[Env Var]', type: 'rel' } },
  { data: { source: 'u-mcp-server', target: 'sys-sonar', label: 'Consulta metricas/issues\n[JSON/HTTPS]', type: 'rel' } },
  { data: { source: 'u-mcp-server', target: 'u-logs', label: 'Emite logs\n[stdout/stderr]', type: 'rel' } },
  { data: { source: 'node-aks', target: 'u-image-sonar', label: 'Descarga imagen\n[OCI/HTTPS]', type: 'rel' } },
  { data: { source: 'u-image-sonar', target: 'u-acr-replica', label: 'Replica\n[OCI/HTTPS]', type: 'rel-future' } },
  { data: { source: 'u-mcp-server', target: 'u-csi', label: 'Debe consumir\n[FS volume]', type: 'rel-future' } },
  { data: { source: 'u-csi', target: 'sys-kv', label: 'Monta secretos\n[JSON/HTTPS]', type: 'rel-future' } },
];

const style = [
  // ===== Compound: entornos =====
  {
    selector: 'node[type="env"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#FAFAFA',
      'background-opacity': 0.4,
      'border-color': '#444444',
      'border-width': 2,
      'border-style': 'dashed',
      'label': 'data(label)',
      'text-valign': 'top',
      'text-halign': 'center',
      'text-margin-y': 6,
      'font-size': 13,
      'font-weight': 'bold',
      'color': '#333333',
      'text-wrap': 'wrap',
      'text-max-width': '320px',
      'padding': '30px',
      'compound-sizing-wrt-labels': 'include',
    },
  },
  // ===== Compound: nodos activos =====
  {
    selector: 'node[type="node-active"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#FFFFFF',
      'background-opacity': 0.6,
      'border-color': '#6B6B6B',
      'border-width': 1.5,
      'label': 'data(label)',
      'text-valign': 'top',
      'text-halign': 'center',
      'text-margin-y': 4,
      'font-size': 11,
      'font-weight': 'bold',
      'color': '#444444',
      'text-wrap': 'wrap',
      'text-max-width': '240px',
      'padding': '20px',
    },
  },
  // ===== Unidad de despliegue =====
  {
    selector: 'node[type="unit"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#23A2D9',
      'border-color': '#0B7FAB',
      'border-width': 1.5,
      'label': 'data(label)',
      'color': '#FFFFFF',
      'font-size': 10,
      'text-wrap': 'wrap',
      'text-max-width': '140px',
      'text-valign': 'center',
      'text-halign': 'center',
      'width': 160,
      'height': 70,
      'padding': '6px',
    },
  },
  // ===== Unidad nueva (++) =====
  {
    selector: 'node[type="unit-new"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#23A2D9',
      'border-color': '#0B7FAB',
      'border-width': 2,
      'border-style': 'dashed',
      'label': 'data(label)',
      'color': '#FFFFFF',
      'font-size': 10,
      'text-wrap': 'wrap',
      'text-max-width': '140px',
      'text-valign': 'center',
      'text-halign': 'center',
      'width': 160,
      'height': 70,
    },
  },
  // ===== Unidad modificada (**) =====
  {
    selector: 'node[type="unit-modified"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#F4B940',
      'border-color': '#B07C12',
      'border-width': 1.5,
      'label': 'data(label)',
      'color': '#1F2933',
      'font-size': 10,
      'text-wrap': 'wrap',
      'text-max-width': '140px',
      'text-valign': 'center',
      'text-halign': 'center',
      'width': 160,
      'height': 70,
    },
  },
  // ===== Nodo / sistema pasivo =====
  {
    selector: 'node[type="node-passive"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#F5F5F5',
      'border-color': '#CCCCCC',
      'border-width': 1.5,
      'label': 'data(label)',
      'color': '#5A6573',
      'font-size': 10,
      'text-wrap': 'wrap',
      'text-max-width': '140px',
      'text-valign': 'center',
      'text-halign': 'center',
      'width': 160,
      'height': 70,
    },
  },
  // ===== Sistema externo =====
  {
    selector: 'node[type="system"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#8C8496',
      'border-color': '#6F6878',
      'border-width': 1.5,
      'label': 'data(label)',
      'color': '#FFFFFF',
      'font-size': 10,
      'text-wrap': 'wrap',
      'text-max-width': '160px',
      'text-valign': 'center',
      'text-halign': 'center',
      'width': 180,
      'height': 80,
    },
  },
  // ===== Core system =====
  {
    selector: 'node[type="core"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#5E4E6E',
      'border-color': '#3A2F47',
      'border-width': 1.5,
      'label': 'data(label)',
      'color': '#FFFFFF',
      'font-size': 10,
      'text-wrap': 'wrap',
      'text-max-width': '160px',
      'text-valign': 'center',
      'text-halign': 'center',
      'width': 180,
      'height': 80,
    },
  },
  // ===== Sistema futuro =====
  {
    selector: 'node[type="system-future"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#BDB7C3',
      'border-color': '#6F6878',
      'border-width': 2,
      'border-style': 'dashed',
      'label': 'data(label)',
      'color': '#1F2933',
      'font-size': 10,
      'text-wrap': 'wrap',
      'text-max-width': '160px',
      'text-valign': 'center',
      'text-halign': 'center',
      'width': 180,
      'height': 80,
    },
  },

  // ===== Relaciones =====
  {
    selector: 'edge',
    style: {
      'curve-style': 'taxi',
      'taxi-direction': 'auto',
      'taxi-turn': 20,
      'taxi-turn-min-distance': 10,
      'line-color': '#828282',
      'width': 1.5,
      'target-arrow-shape': 'triangle',
      'target-arrow-color': '#828282',
      'arrow-scale': 1,
      'label': 'data(label)',
      'font-size': 8,
      'color': '#3D4852',
      'text-background-color': '#FFFFFF',
      'text-background-opacity': 0.85,
      'text-background-padding': '2px',
      'text-rotation': 'autorotate',
      'text-wrap': 'wrap',
      'text-max-width': '120px',
    },
  },
  {
    selector: 'edge[type="rel-future"]',
    style: {
      'line-style': 'dashed',
      'line-color': '#A0A0A0',
      'target-arrow-color': '#A0A0A0',
      'color': '#6F6878',
    },
  },
];

document.addEventListener('DOMContentLoaded', () => {
  const cy = cytoscape({
    container: document.getElementById('cy'),
    elements: elements,
    style: style,
    wheelSensitivity: 0.25,
    layout: {
      name: 'elk',
      nodeDimensionsIncludeLabels: true,
      elk: {
        algorithm: 'layered',
        'elk.direction': 'RIGHT',
        'elk.edgeRouting': 'ORTHOGONAL',
        'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
        'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
        'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
        'elk.spacing.nodeNode': 40,
        'elk.spacing.edgeNode': 25,
        'elk.spacing.edgeEdge': 15,
        'elk.layered.spacing.nodeNodeBetweenLayers': 90,
        'elk.layered.spacing.edgeNodeBetweenLayers': 30,
        'elk.padding': '[top=40,left=40,bottom=40,right=40]',
        'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
      },
    },
  });

  cy.ready(() => {
    cy.fit(undefined, 20);
  });

  window.__cy = cy;
});
