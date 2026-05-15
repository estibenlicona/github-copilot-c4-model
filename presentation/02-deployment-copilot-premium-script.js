// =============================================================================
// Diagrama de despliegue C2 — GitHub Copilot (Premium · estilo Tuya)
// Fuente de verdad: diagrams/02-deployment-copilot-v2.drawio
//                   docs/02-deployment-copilot-v2.md
// =============================================================================

cytoscape.use(cytoscapeElk);
cytoscape.use(cytoscapePopper);

// ---------------------------------------------------------------------------
// 1) CATALOGO DE NODOS (con descripcion y gap para tooltips)
// ---------------------------------------------------------------------------
const nodes = [
  // ----- Entornos (compound nivel 1) -----
  { id: 'env-onprem',  type: 'env', name: 'Tuya — Endpoints corporativos', kind: 'Environment: on premise',
    desc: 'Estaciones de los desarrolladores. Todo el egress pasa obligatoriamente por Netskope.' },
  { id: 'env-github',  type: 'env', name: 'GitHub Cloud — Enterprise tuyacol', kind: 'Environment: cloud',
    desc: 'SaaS de GitHub. Sin acceso a la infraestructura subyacente. SLA 99.9%.' },
  { id: 'env-azure',   type: 'env', name: 'Azure — Plataforma MCPs dev', kind: 'Environment: cloud',
    desc: 'Suscripcion de desarrollo de Tuya donde corre la plataforma de MCPs corporativos.' },

  // ----- Nodos de despliegue (compound nivel 2) -----
  { id: 'node-ws',          parent: 'env-onprem', type: 'node-active', name: 'Equipo del desarrollador', kind: 'Workstation Windows/macOS',
    desc: 'Aloja IDE, CLI, MCPs locales, shell, Git, workspace y navegador.' },
  { id: 'node-github-saas', parent: 'env-github', type: 'node-active', name: 'GitHub.com / Copilot SaaS', kind: 'SaaS Platform · 99.9%',
    desc: 'Opaco: aloja proxy, modelos LLM, consola admin, audit/metrics, repos y licenciamiento.' },
  { id: 'node-apim',        parent: 'env-azure',  type: 'node-active', name: 'Azure API Management dev', kind: 'API Gateway',
    desc: 'Solo enruta hacia el MCP; sin auth/politicas propias.' },
  { id: 'node-acr',         parent: 'env-azure',  type: 'node-active', name: 'Azure Container Registry dev', kind: 'Container Registry',
    desc: 'Mirror corporativo de imagenes de MCPs.' },
  { id: 'node-aks',         parent: 'env-azure',  type: 'node-active', name: 'AKS desarrollo', kind: 'Kubernetes Cluster',
    desc: 'Aloja el namespace de MCPs corporativos.' },
  { id: 'ns-mcp',           parent: 'node-aks',   type: 'node-active', name: 'Namespace MCP dev', kind: 'Kubernetes Namespace',
    desc: 'Aisla los workloads de MCPs corporativos.' },

  // ----- Unidades — Workstation -----
  { id: 'u-vscode',    parent: 'node-ws', type: 'unit', name: 'VS Code + Extension Copilot', kind: 'IDE Extension',
    desc: 'Chat, autocompletado, modo agente y modo plan. Envia prompts al proxy y orquesta MCPs locales.' },
  { id: 'u-cli',       parent: 'node-ws', type: 'unit', name: 'GitHub Copilot CLI', kind: 'CLI',
    desc: 'Cliente Copilot en terminal con modo agente. Mismo backend que la extension.' },
  { id: 'u-mcps-local',parent: 'node-ws', type: 'unit', name: 'MCPs locales', kind: 'Local MCP Server',
    desc: 'Procesos hijos (stdio/JSON-RPC) configurados por el dev — file system, busqueda, contexto, etc.' },
  { id: 'u-shell',     parent: 'node-ws', type: 'unit', name: 'Shell / scripts', kind: 'Shell',
    desc: 'Ejecuta comandos que el modo agente decide invocar.' },
  { id: 'u-git',       parent: 'node-ws', type: 'unit', name: 'Cliente Git', kind: 'Git Client',
    desc: 'Opera contra Azure DevOps Repos.' },
  { id: 'u-workspace', parent: 'node-ws', type: 'unit', name: 'Workspace local', kind: 'File System',
    desc: 'Codigo abierto; fuente de contexto enviado a Copilot. Critico para evaluar exposicion de codigo sensible.',
    gap: 'D1 — Sin Content Exclusions configuradas.' },
  { id: 'u-browser',   parent: 'node-ws', type: 'unit', name: 'Navegador corporativo', kind: 'Browser',
    desc: 'Acceso a la consola de administracion Copilot.' },

  // ----- Unidades — GitHub Cloud -----
  { id: 'u-proxy',       parent: 'node-github-saas', type: 'unit', name: 'Proxy de GitHub Copilot', kind: 'API',
    desc: 'Recibe prompts, aplica controles (Content Exclusions, telemetry, filtros) y enruta a modelos.' },
  { id: 'u-llm',         parent: 'node-github-saas', type: 'unit', name: 'Servicio de modelos LLM', kind: 'LLM Inference Service',
    desc: 'Backend opaco que ejecuta la inferencia.' },
  { id: 'u-console',     parent: 'node-github-saas', type: 'unit', name: 'Consola admin Copilot', kind: 'Web App',
    desc: 'Licencias, politicas, Content Exclusions.',
    gap: 'D1 — Content Exclusions no configuradas.' },
  { id: 'u-audit-api',   parent: 'node-github-saas', type: 'unit', name: 'Audit Log API', kind: 'API',
    desc: 'Eventos de uso, admin y politicas.',
    gap: 'D3 — Audit logs no exportados a SIEM.' },
  { id: 'u-metrics-api', parent: 'node-github-saas', type: 'unit', name: 'Metrics API', kind: 'API',
    desc: 'Aceptacion, sugerencias, usuarios activos.',
    gap: 'D4 — Metrics API no consumida.' },
  { id: 'u-license',     parent: 'node-github-saas', type: 'unit', name: 'Servicio de licenciamiento Copilot', kind: 'API',
    desc: 'Valida sesion y entitlement contra el grupo en Entra ID.' },
  { id: 'u-azdo-repos',  parent: 'node-github-saas', type: 'unit', name: 'Azure DevOps Repos', kind: 'Git Hosting',
    desc: 'Repositorios corporativos accedidos por el cliente Git.' },
  { id: 'u-audit-store', parent: 'node-github-saas', type: 'unit', name: 'Almacenamiento de auditoria', kind: 'Log Store',
    desc: 'Retencion de eventos del Audit Log.' },

  // ----- Unidades — Azure dev -----
  { id: 'u-api-sonar', parent: 'node-apim', type: 'unit', name: 'API SonarCloud MCP', kind: 'API Gateway Route',
    desc: 'Endpoint en APIM que enruta hacia el cluster. Sin auth/politicas propias hoy.' },

  { id: 'u-image-sonar', parent: 'node-acr', type: 'unit', name: 'Imagen SonarCloud MCP', kind: 'OCI Image',
    desc: 'Mirror corporativo en ACR de la imagen oficial del MCP.' },
  { id: 'u-acr-replica', parent: 'node-acr', type: 'node-passive', name: 'Replica geo ACR', kind: 'Container Registry · pasivo',
    desc: 'Failover de imagenes — recomendado para resiliencia.' },

  { id: 'u-ingress',    parent: 'ns-mcp', type: 'unit', name: 'Ingress / Service', kind: 'Kubernetes Service',
    desc: 'Publica el pod del MCP dentro del cluster.' },
  { id: 'u-mcp-server', parent: 'ns-mcp', type: 'unit', name: 'SonarCloud MCP Server', kind: 'MCP Server',
    desc: 'Pod que atiende JSON-RPC y consulta SonarCloud.' },
  { id: 'u-token',      parent: 'ns-mcp', type: 'unit-modified', name: 'Token admin SonarCloud **', kind: 'Kubernetes Env Var',
    desc: 'Secreto actual en env var del deployment.',
    gap: 'F2 — Migrar a Azure Key Vault via CSI Secrets Driver.' },
  { id: 'u-csi',        parent: 'ns-mcp', type: 'unit-new', name: 'CSI Secrets Driver ++', kind: 'K8s CSI Driver',
    desc: 'Recomendado para montar secretos desde Azure Key Vault — reemplaza el env var.' },
  { id: 'u-logs',       parent: 'ns-mcp', type: 'unit', name: 'Logs del pod MCP', kind: 'Container Logs',
    desc: 'stdout/stderr; insumo para integrar con SIEM.' },
  { id: 'u-template',   parent: 'ns-mcp', type: 'unit-new', name: 'Plantilla futuros MCPs ++', kind: 'Helm Template',
    desc: 'Base reutilizable para nuevos MCPs corporativos.',
    gap: 'F3 — Hoy el MCP corporativo existe solo en dev.' },

  // ----- Sistemas externos / core (fuera de entornos) -----
  { id: 'sys-netskope', type: 'system', name: 'Netskope SWG', kind: 'Software System',
    desc: 'Gateway corporativo de salida. Allowlist de URLs Copilot/MCP.',
    gap: 'E1 — TLS break-and-inspect por validar.' },
  { id: 'sys-entra', type: 'core', name: 'Microsoft Entra ID', kind: 'Core System',
    desc: 'IdP corporativo. SAML SSO + grupo de licenciamiento.',
    gap: 'A4 — SSO configurado pero no enforced.' },
  { id: 'sys-sonar', type: 'system', name: 'SonarCloud', kind: 'Software System',
    desc: 'SaaS de calidad consultado por el MCP corporativo.' },
  { id: 'sys-kv', type: 'system-future', name: 'Azure Key Vault ++', kind: 'Software System',
    desc: 'Boveda recomendada para los secretos runtime del MCP.',
    gap: 'F2 — Reemplaza el token admin en env var.' },
  { id: 'sys-siem', type: 'system-future', name: 'SIEM corporativo', kind: 'Software System · futuro',
    desc: 'Destino recomendado para exportar el Audit Log.',
    gap: 'D3 — Resuelve la falta de export a SIEM.' },
  { id: 'sys-bi', type: 'system-future', name: 'Plataforma BI / Adopcion', kind: 'Software System · futuro',
    desc: 'Consumidor recomendado de Metrics API.',
    gap: 'D4 — Resuelve la falta de consumo de metricas.' },
];

// ---------------------------------------------------------------------------
// 2) RELACIONES (con verbo, protocolo y gap opcional)
// ---------------------------------------------------------------------------
const edgesData = [
  // 7.1 Endpoint -> Copilot
  ['u-vscode',     'u-workspace',  'Lee contexto',         'FS local',          'rel'],
  ['u-cli',        'u-workspace',  'Lee contexto',         'FS local',          'rel'],
  ['u-vscode',     'u-mcps-local', 'Invoca herramientas',  'JSON-RPC/stdio',    'rel'],
  ['u-cli',        'u-mcps-local', 'Invoca herramientas',  'JSON-RPC/stdio',    'rel'],
  ['u-vscode',     'u-shell',      'Ejecuta comandos',     'Proceso local',     'rel'],
  ['u-cli',        'u-shell',      'Ejecuta comandos',     'Proceso local',     'rel'],
  ['u-git',        'u-azdo-repos', 'Push/pull codigo',     'Git/HTTPS',         'rel'],
  ['u-vscode',     'sys-netskope', 'Envia prompts/chat',   'JSON/HTTPS',        'rel'],
  ['u-cli',        'sys-netskope', 'Envia prompts/chat',   'JSON/HTTPS',        'rel'],
  ['u-browser',    'u-console',    'Administra Enterprise','HTML/HTTPS',        'rel'],

  // 7.2 Borde y backend Copilot
  ['sys-netskope', 'u-proxy',      'Permite egress Copilot','JSON/HTTPS',       'rel'],
  ['u-proxy',      'u-llm',        'Solicita inferencia',  'API/HTTPS',         'rel'],
  ['u-proxy',      'u-license',    'Valida entitlement',   'JSON/HTTPS',        'rel'],
  ['u-license',    'sys-entra',    'Verifica grupo/SSO',   'SAML/OIDC',         'rel'],
  ['u-console',    'sys-entra',    'Autentica admin',      'SAML/SCIM',         'rel'],
  ['u-audit-api',  'u-audit-store','Persiste eventos',     'interno',           'rel'],
  ['u-audit-api',  'sys-siem',     'Debe exportar (D3)',   'JSON/HTTPS',        'rel-future'],
  ['u-metrics-api','sys-bi',       'Debe consumir (D4)',   'JSON/HTTPS',        'rel-future'],

  // 7.3 MCP corporativo
  ['sys-netskope', 'u-api-sonar',  'Permite egress MCP',   'JSON/HTTPS + token','rel'],
  ['u-api-sonar',  'u-ingress',    'Enruta solicitud',     'HTTPS',             'rel'],
  ['u-ingress',    'u-mcp-server', 'Forward request',      'HTTP',              'rel'],
  ['u-mcp-server', 'u-token',      'Lee token admin',      'Env Var',           'rel'],
  ['u-mcp-server', 'sys-sonar',    'Consulta metricas',    'JSON/HTTPS',        'rel'],
  ['u-mcp-server', 'u-logs',       'Emite logs',           'stdout/stderr',     'rel'],
  ['node-aks',     'u-image-sonar','Descarga imagen',      'OCI/HTTPS',         'rel'],
  ['u-image-sonar','u-acr-replica','Replica imagen',       'OCI/HTTPS',         'rel-future'],
  ['u-mcp-server', 'u-csi',        'Debe consumir (F2)',   'FS volume',         'rel-future'],
  ['u-csi',        'sys-kv',       'Monta secretos',       'JSON/HTTPS',        'rel-future'],
];

// ---------------------------------------------------------------------------
// 3) ELEMENTS para Cytoscape
// ---------------------------------------------------------------------------
const elements = [
  ...nodes.map(n => ({
    data: {
      id: n.id,
      parent: n.parent,
      type: n.type,
      name: n.name,
      kind: n.kind,
      desc: n.desc,
      gap: n.gap || '',
    }
  })),
  ...edgesData.map(([s, t, verb, proto, type], i) => ({
    data: {
      id: `e-${i}`,
      source: s,
      target: t,
      label: `${verb}\n[${proto}]`,
      verb: verb,
      proto: proto,
      type: type,
    }
  })),
];

// ---------------------------------------------------------------------------
// 4) STYLESHEET — estilo C4 Tuya
// ---------------------------------------------------------------------------
const style = [
  // ===== Entornos (boundary discontinuo, fondo transparente) =====
  {
    selector: 'node[type="env"]',
    style: {
      'shape': 'round-rectangle',
      'background-opacity': 0,
      'border-color': '#444444',
      'border-width': 2,
      'border-style': 'dashed',
      'label': (ele) => `${ele.data('name')}\n[${ele.data('kind')}]`,
      'text-wrap': 'wrap',
      'text-halign': 'center',
      'text-valign': 'top',
      'text-margin-y': -8,
      'font-family': '"Segoe UI", Arial, sans-serif',
      'font-size': 12,
      'font-weight': 'bold',
      'color': '#1F2933',
      'text-background-color': '#FFFFFF',
      'text-background-opacity': 0.95,
      'text-background-padding': '4px',
      'text-background-shape': 'roundrectangle',
      'padding-top': '38px',
      'padding-bottom': '20px',
      'padding-left': '22px',
      'padding-right': '22px',
      'compound-sizing-wrt-labels': 'include',
      'corner-radius': 6,
    },
  },
  // ===== Nodos de despliegue activos =====
  {
    selector: 'node[type="node-active"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#FFFFFF',
      'background-opacity': 0.5,
      'border-color': '#6B6B6B',
      'border-width': 1.5,
      'label': (ele) => `${ele.data('name')}\n[${ele.data('kind')}]`,
      'text-wrap': 'wrap',
      'text-halign': 'center',
      'text-valign': 'top',
      'text-margin-y': -6,
      'font-family': '"Segoe UI", Arial, sans-serif',
      'font-size': 11,
      'font-weight': 'bold',
      'color': '#3A3A3A',
      'text-background-color': '#FFFFFF',
      'text-background-opacity': 1,
      'text-background-padding': '3px',
      'text-background-shape': 'roundrectangle',
      'padding-top': '34px',
      'padding-bottom': '18px',
      'padding-left': '18px',
      'padding-right': '18px',
      'corner-radius': 5,
    },
  },
  // ===== Unidades (HTML label via cytoscape-node-html-label) =====
  {
    selector: 'node[type="unit"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#23A2D9',
      'border-color': '#0B7FAB',
      'border-width': 1.5,
      'width': 175,
      'height': 64,
      'label': '',
      'corner-radius': 6,
    },
  },
  {
    selector: 'node[type="unit-new"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#23A2D9',
      'border-color': '#0B7FAB',
      'border-width': 2,
      'border-style': 'dashed',
      'width': 175,
      'height': 64,
      'label': '',
      'corner-radius': 6,
    },
  },
  {
    selector: 'node[type="unit-modified"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#F4B940',
      'border-color': '#B07C12',
      'border-width': 1.5,
      'width': 175,
      'height': 64,
      'label': '',
      'corner-radius': 6,
    },
  },
  {
    selector: 'node[type="node-passive"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#F5F5F5',
      'border-color': '#CCCCCC',
      'border-width': 1.5,
      'width': 175,
      'height': 64,
      'label': '',
      'corner-radius': 6,
    },
  },
  // ===== Sistemas externos: esquinas MUY redondeadas (arcSize=25 equivalente) =====
  {
    selector: 'node[type="system"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#8C8496',
      'border-color': '#6F6878',
      'border-width': 1.5,
      'width': 195,
      'height': 78,
      'label': '',
      'corner-radius': 18,
    },
  },
  {
    selector: 'node[type="core"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#5E4E6E',
      'border-color': '#3A2F47',
      'border-width': 1.5,
      'width': 195,
      'height': 78,
      'label': '',
      'corner-radius': 18,
    },
  },
  {
    selector: 'node[type="system-future"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#BDB7C3',
      'border-color': '#6F6878',
      'border-width': 2,
      'border-style': 'dashed',
      'width': 195,
      'height': 78,
      'label': '',
      'corner-radius': 18,
    },
  },

  // ===== Edges =====
  {
    selector: 'edge',
    style: {
      'curve-style': 'taxi',
      'taxi-direction': 'auto',
      'taxi-turn': 25,
      'taxi-turn-min-distance': 12,
      'line-color': '#828282',
      'width': 1.3,
      'target-arrow-shape': 'triangle',
      'target-arrow-color': '#828282',
      'arrow-scale': 0.9,
      'label': 'data(label)',
      'font-size': 9,
      'color': '#3D4852',
      'text-background-color': '#FFFFFF',
      'text-background-opacity': 0.9,
      'text-background-padding': '2px',
      'text-rotation': 'autorotate',
      'text-wrap': 'wrap',
      'text-max-width': '130px',
      'font-family': '"Segoe UI", Arial, sans-serif',
    },
  },
  {
    selector: 'edge[type="rel-future"]',
    style: {
      'line-style': 'dashed',
      'line-color': '#A8A8A8',
      'target-arrow-color': '#A8A8A8',
      'color': '#6F6878',
    },
  },

  // ===== Hover highlight =====
  {
    selector: 'node.hover',
    style: { 'border-width': 3 },
  },
  {
    selector: 'edge.hover',
    style: { 'width': 2.5, 'line-color': '#0B2E4F', 'target-arrow-color': '#0B2E4F' },
  },
];

// ---------------------------------------------------------------------------
// 5) HTML LABEL TEMPLATES por tipo
// ---------------------------------------------------------------------------
function htmlLabel(theme) {
  return (data) => `
    <div class="cy-label ${theme}">
      <div class="name">${escapeHtml(data.name || '')}</div>
      <div class="type">[${escapeHtml(data.kind || '')}]</div>
    </div>`;
}

function htmlLabelBoundary(theme, padding) {
  return (data) => `
    <div class="cy-label ${theme}" style="position:absolute;top:6px;left:14px;width:auto;height:auto;justify-content:flex-start;align-items:flex-start;text-align:left;padding:0;">
      <div class="name">${escapeHtml(data.name || '')}</div>
      <div class="type">[${escapeHtml(data.kind || '')}]</div>
    </div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// ---------------------------------------------------------------------------
// 6) TOOLTIP — contenido tippy
// ---------------------------------------------------------------------------
function nodeTooltipHtml(data) {
  const gap = data.gap
    ? `<div class="tt-gap"><b>Gap:</b> ${escapeHtml(data.gap)}</div>` : '';
  return `
    <div class="tt-title">${escapeHtml(data.name)}</div>
    <div class="tt-type">[${escapeHtml(data.kind)}]</div>
    <p class="tt-desc">${escapeHtml(data.desc || '')}</p>
    ${gap}`;
}

function edgeTooltipHtml(data) {
  const gap = data.type === 'rel-future'
    ? `<div class="tt-gap"><b>Relacion recomendada / futura</b></div>` : '';
  return `
    <div class="tt-title">${escapeHtml(data.verb)}</div>
    <div class="tt-type">[${escapeHtml(data.proto)}]</div>
    ${gap}`;
}

// ---------------------------------------------------------------------------
// 7) INICIALIZACION
// ---------------------------------------------------------------------------
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
        'elk.spacing.nodeNode': 45,
        'elk.spacing.componentComponent': 60,
        'elk.spacing.edgeNode': 30,
        'elk.spacing.edgeEdge': 18,
        'elk.layered.spacing.nodeNodeBetweenLayers': 100,
        'elk.layered.spacing.edgeNodeBetweenLayers': 35,
        'elk.padding': '[top=50,left=40,bottom=40,right=40]',
        'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
      },
    },
  });

  // --- HTML labels ---
  cy.nodeHtmlLabel([
    { query: 'node[type="unit"]',           tpl: htmlLabel('on-dark') },
    { query: 'node[type="unit-new"]',       tpl: htmlLabel('on-dark') },
    { query: 'node[type="unit-modified"]',  tpl: htmlLabel('on-light') },
    { query: 'node[type="node-passive"]',   tpl: htmlLabel('on-soft') },
    { query: 'node[type="system"]',         tpl: htmlLabel('on-dark') },
    { query: 'node[type="core"]',           tpl: htmlLabel('on-dark') },
    { query: 'node[type="system-future"]',  tpl: htmlLabel('on-light') },
  ]);

  // --- Tooltips tippy.js ---
  function makeTippy(target, contentFn) {
    const ref = target.popperRef();
    const dummy = document.createElement('div');
    const tip = tippy(dummy, {
      getReferenceClientRect: ref.getBoundingClientRect,
      trigger: 'manual',
      content: () => {
        const wrap = document.createElement('div');
        wrap.innerHTML = contentFn(target.data());
        return wrap;
      },
      arrow: true,
      placement: 'top',
      theme: 'tuya',
      allowHTML: true,
      interactive: false,
      hideOnClick: true,
      appendTo: () => document.body,
    });
    return tip;
  }

  const tipMap = new WeakMap();
  function showTip(target, contentFn) {
    let tip = tipMap.get(target);
    if (!tip) {
      tip = makeTippy(target, contentFn);
      tipMap.set(target, tip);
    } else {
      tip.setProps({ getReferenceClientRect: target.popperRef().getBoundingClientRect });
    }
    tip.show();
  }
  function hideTip(target) {
    const tip = tipMap.get(target);
    if (tip) tip.hide();
  }

  cy.on('mouseover', 'node', (evt) => {
    const n = evt.target;
    n.addClass('hover');
    showTip(n, nodeTooltipHtml);
  });
  cy.on('mouseout', 'node', (evt) => {
    const n = evt.target;
    n.removeClass('hover');
    hideTip(n);
  });

  cy.on('mouseover', 'edge', (evt) => {
    const e = evt.target;
    e.addClass('hover');
    showTip(e, edgeTooltipHtml);
  });
  cy.on('mouseout', 'edge', (evt) => {
    const e = evt.target;
    e.removeClass('hover');
    hideTip(e);
  });

  // --- Botones ---
  document.getElementById('btn-fit').addEventListener('click', () => cy.fit(undefined, 30));
  document.getElementById('btn-png').addEventListener('click', () => {
    const png = cy.png({ full: true, scale: 2, bg: '#FFFFFF' });
    const a = document.createElement('a');
    a.href = png;
    a.download = '02-deployment-copilot.png';
    a.click();
  });

  cy.ready(() => cy.fit(undefined, 30));
  window.__cy = cy;
});
