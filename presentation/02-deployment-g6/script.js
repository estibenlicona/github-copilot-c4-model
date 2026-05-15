// =============================================================================
// C2 Despliegue — GitHub Copilot (G6 v5 / AntV)
// =============================================================================

const PALETTE = {
  env:           { fill: 'transparent', stroke: '#444', strokeStyle: [6, 4] },
  node:          { fill: '#FFFFFF',     stroke: '#6B6B6B' },
  unit:          { fill: '#438DD5',     stroke: '#2E6295', text: '#fff' },
  'unit-new':    { fill: '#2E7D32',     stroke: '#1B5E20', text: '#fff' },
  'unit-modified': { fill: '#E65100',   stroke: '#BF360C', text: '#fff' },
  'node-passive':{ fill: '#E8E8E8',     stroke: '#999',    text: '#333' },
  system:        { fill: '#8C8496',     stroke: '#6F6878', text: '#fff' },
  'system-future':{ fill: '#B59CC9',    stroke: '#8E6FA6', text: '#fff' },
  core:          { fill: '#5E4E6E',     stroke: '#3A2F47', text: '#fff' },
};

// ----- Combos (entornos + nodos contenedores) -----
const combos = [
  { id: 'env-onprem',  combo: undefined,   data: { label: 'Tuya — Endpoints corporativos', kind: 'Environment: on premise', type: 'env', desc: 'Estaciones de los desarrolladores. Todo el egress pasa por Netskope.' } },
  { id: 'env-github',  combo: undefined,   data: { label: 'GitHub Cloud — Enterprise tuyacol', kind: 'Environment: cloud', type: 'env', desc: 'SaaS de GitHub. Sin acceso a la infraestructura subyacente. SLA 99.9%.' } },
  { id: 'env-azure',   combo: undefined,   data: { label: 'Azure — Plataforma MCPs dev', kind: 'Environment: cloud', type: 'env', desc: 'Suscripcion de desarrollo de Tuya.' } },
  { id: 'node-ws',         combo: 'env-onprem', data: { label: 'Equipo del desarrollador', kind: 'Workstation Windows/macOS', type: 'node-active', desc: 'IDE, CLI, MCPs locales, shell, Git, workspace y navegador.' } },
  { id: 'node-github-saas',combo: 'env-github', data: { label: 'GitHub.com / Copilot SaaS', kind: 'SaaS Platform · 99.9%', type: 'node-active', desc: 'Opaco: proxy, modelos LLM, consola admin, audit/metrics, repos, licenciamiento.' } },
  { id: 'node-apim',       combo: 'env-azure',  data: { label: 'Azure API Management dev', kind: 'API Gateway', type: 'node-active', desc: 'Solo enruta hacia el MCP.' } },
  { id: 'node-acr',        combo: 'env-azure',  data: { label: 'Azure Container Registry dev', kind: 'Container Registry', type: 'node-active', desc: 'Mirror corporativo de imagenes de MCPs.' } },
  { id: 'node-aks',        combo: 'env-azure',  data: { label: 'AKS desarrollo', kind: 'Kubernetes Cluster', type: 'node-active', desc: 'Aloja el namespace de MCPs corporativos.' } },
  { id: 'ns-mcp',          combo: 'node-aks',   data: { label: 'Namespace MCP dev', kind: 'Kubernetes Namespace', type: 'node-active', desc: 'Aisla los workloads de MCPs corporativos.' } },
];

// ----- Nodos (unidades + sistemas externos) -----
const nodes = [
  { id: 'u-vscode',    combo: 'node-ws', data: { label: 'VS Code + Copilot', kind: 'IDE Extension', type: 'unit', desc: 'Chat, autocompletado, modo agente y modo plan.' } },
  { id: 'u-cli',       combo: 'node-ws', data: { label: 'GitHub Copilot CLI', kind: 'CLI', type: 'unit', desc: 'Cliente Copilot en terminal con modo agente.' } },
  { id: 'u-mcps-local',combo: 'node-ws', data: { label: 'MCPs locales', kind: 'Local MCP Server', type: 'unit', desc: 'Procesos hijos (stdio/JSON-RPC) configurados por el dev.' } },
  { id: 'u-shell',     combo: 'node-ws', data: { label: 'Shell / scripts', kind: 'Shell', type: 'unit', desc: 'Ejecuta comandos del modo agente.' } },
  { id: 'u-git',       combo: 'node-ws', data: { label: 'Cliente Git', kind: 'Git Client', type: 'unit', desc: 'Opera contra Azure DevOps Repos.' } },
  { id: 'u-workspace', combo: 'node-ws', data: { label: 'Workspace local', kind: 'File System', type: 'unit', desc: 'Codigo abierto; fuente de contexto enviado a Copilot.', gap: 'D1 — Sin Content Exclusions configuradas.' } },
  { id: 'u-browser',   combo: 'node-ws', data: { label: 'Navegador corporativo', kind: 'Browser', type: 'unit', desc: 'Acceso a la consola de administracion Copilot.' } },

  { id: 'u-proxy',       combo: 'node-github-saas', data: { label: 'Proxy de Copilot', kind: 'API', type: 'unit', desc: 'Recibe prompts, aplica controles y enruta a modelos.' } },
  { id: 'u-llm',         combo: 'node-github-saas', data: { label: 'Servicio LLM', kind: 'LLM Inference Service', type: 'unit', desc: 'Backend opaco de inferencia.' } },
  { id: 'u-console',     combo: 'node-github-saas', data: { label: 'Consola admin Copilot', kind: 'Web App', type: 'unit', desc: 'Licencias, politicas, Content Exclusions.', gap: 'D1 — Content Exclusions no configuradas.' } },
  { id: 'u-audit-api',   combo: 'node-github-saas', data: { label: 'Audit Log API', kind: 'API', type: 'unit', desc: 'Eventos de uso, admin y politicas.', gap: 'D3 — Audit logs no exportados a SIEM.' } },
  { id: 'u-metrics-api', combo: 'node-github-saas', data: { label: 'Metrics API', kind: 'API', type: 'unit', desc: 'Aceptacion, sugerencias, usuarios activos.', gap: 'D4 — Metrics API no consumida.' } },
  { id: 'u-license',     combo: 'node-github-saas', data: { label: 'Licenciamiento Copilot', kind: 'API', type: 'unit', desc: 'Valida sesion y entitlement contra Entra ID.' } },
  { id: 'u-azdo-repos',  combo: 'node-github-saas', data: { label: 'Azure DevOps Repos', kind: 'Git Hosting', type: 'unit', desc: 'Repositorios corporativos.' } },
  { id: 'u-audit-store', combo: 'node-github-saas', data: { label: 'Almacenamiento auditoria', kind: 'Log Store', type: 'unit', desc: 'Retencion de eventos del Audit Log.' } },

  { id: 'u-api-sonar',   combo: 'node-apim', data: { label: 'API SonarCloud MCP', kind: 'API Gateway Route', type: 'unit', desc: 'Endpoint en APIM que enruta hacia el cluster.' } },
  { id: 'u-image-sonar', combo: 'node-acr',  data: { label: 'Imagen SonarCloud MCP', kind: 'OCI Image', type: 'unit', desc: 'Mirror corporativo en ACR.' } },
  { id: 'u-acr-replica', combo: 'node-acr',  data: { label: 'Replica geo ACR', kind: 'Container Registry · pasivo', type: 'node-passive', desc: 'Failover de imagenes — recomendado.' } },

  { id: 'u-ingress',    combo: 'ns-mcp', data: { label: 'Ingress / Service', kind: 'Kubernetes Service', type: 'unit', desc: 'Publica el pod del MCP dentro del cluster.' } },
  { id: 'u-mcp-server', combo: 'ns-mcp', data: { label: 'SonarCloud MCP Server', kind: 'MCP Server', type: 'unit', desc: 'Pod que atiende JSON-RPC y consulta SonarCloud.' } },
  { id: 'u-token',      combo: 'ns-mcp', data: { label: 'Token admin SonarCloud **', kind: 'K8s Env Var', type: 'unit-modified', desc: 'Secreto actual en env var.', gap: 'F2 — Migrar a Azure Key Vault.' } },
  { id: 'u-csi',        combo: 'ns-mcp', data: { label: 'CSI Secrets Driver ++', kind: 'K8s CSI Driver', type: 'unit-new', desc: 'Recomendado para montar secretos desde Key Vault.' } },
  { id: 'u-logs',       combo: 'ns-mcp', data: { label: 'Logs del pod MCP', kind: 'Container Logs', type: 'unit', desc: 'stdout/stderr; insumo para SIEM.' } },
  { id: 'u-template',   combo: 'ns-mcp', data: { label: 'Plantilla futuros MCPs ++', kind: 'Helm Template', type: 'unit-new', desc: 'Base reutilizable para nuevos MCPs.', gap: 'F3 — Hoy el MCP existe solo en dev.' } },

  { id: 'sys-netskope', data: { label: 'Netskope SWG', kind: 'Software System', type: 'system', desc: 'Gateway corporativo de salida. Allowlist Copilot/MCP.', gap: 'E1 — TLS break-and-inspect por validar.' } },
  { id: 'sys-entra',    data: { label: 'Microsoft Entra ID', kind: 'Core System', type: 'core', desc: 'IdP corporativo. SAML SSO + grupo de licenciamiento.', gap: 'A4 — SSO configurado pero no enforced.' } },
  { id: 'sys-sonar',    data: { label: 'SonarCloud', kind: 'Software System', type: 'system', desc: 'SaaS de calidad consultado por el MCP.' } },
  { id: 'sys-kv',       data: { label: 'Azure Key Vault ++', kind: 'Software System', type: 'system-future', desc: 'Boveda recomendada para secretos del MCP.', gap: 'F2 — Reemplaza token admin en env var.' } },
  { id: 'sys-siem',     data: { label: 'SIEM corporativo', kind: 'Software System · futuro', type: 'system-future', desc: 'Destino recomendado para exportar Audit Log.', gap: 'D3 — Resuelve la falta de export.' } },
  { id: 'sys-bi',       data: { label: 'Plataforma BI / Adopcion', kind: 'Software System · futuro', type: 'system-future', desc: 'Consumidor recomendado de Metrics API.', gap: 'D4 — Resuelve la falta de consumo.' } },
];

// ----- Aristas -----
const edgesData = [
  ['u-vscode','u-workspace','Lee contexto','FS local'],
  ['u-cli','u-workspace','Lee contexto','FS local'],
  ['u-vscode','u-mcps-local','Invoca herramientas','JSON-RPC/stdio'],
  ['u-cli','u-mcps-local','Invoca herramientas','JSON-RPC/stdio'],
  ['u-vscode','u-shell','Ejecuta comandos','Proceso local'],
  ['u-cli','u-shell','Ejecuta comandos','Proceso local'],
  ['u-git','u-azdo-repos','Push/pull codigo','Git/HTTPS'],
  ['u-vscode','sys-netskope','Envia prompts','JSON/HTTPS'],
  ['u-cli','sys-netskope','Envia prompts','JSON/HTTPS'],
  ['u-browser','u-console','Administra','HTML/HTTPS'],
  ['sys-netskope','u-proxy','Permite egress','JSON/HTTPS'],
  ['u-proxy','u-llm','Solicita inferencia','API/HTTPS'],
  ['u-proxy','u-license','Valida entitlement','JSON/HTTPS'],
  ['u-license','sys-entra','Verifica grupo/SSO','SAML/OIDC'],
  ['u-console','sys-entra','Autentica admin','SAML/SCIM'],
  ['u-audit-api','u-audit-store','Persiste eventos','interno'],
  ['u-audit-api','sys-siem','Debe exportar (D3)','JSON/HTTPS', true],
  ['u-metrics-api','sys-bi','Debe consumir (D4)','JSON/HTTPS', true],
  ['sys-netskope','u-api-sonar','Permite egress MCP','JSON/HTTPS + token'],
  ['u-api-sonar','u-ingress','Enruta','HTTPS'],
  ['u-ingress','u-mcp-server','Forward request','HTTP'],
  ['u-mcp-server','u-token','Lee token','Env Var'],
  ['u-mcp-server','sys-sonar','Consulta metricas','JSON/HTTPS'],
  ['u-mcp-server','u-logs','Emite logs','stdout/stderr'],
  ['node-aks','u-image-sonar','Descarga imagen','OCI/HTTPS'],
  ['u-image-sonar','u-acr-replica','Replica imagen','OCI/HTTPS', true],
  ['u-mcp-server','u-csi','Debe consumir (F2)','FS volume', true],
  ['u-csi','sys-kv','Monta secretos','JSON/HTTPS', true],
];

const edges = edgesData.map(([source, target, verb, proto, future], i) => ({
  id: `e-${i}`,
  source, target,
  data: { label: `${verb}\n[${proto}]`, verb, proto, future: !!future },
}));

// ----- Render -----
const graph = new G6.Graph({
  container: 'container',
  autoFit: 'view',
  background: '#f4f6fa',
  data: {
    nodes: nodes.map(n => ({ id: n.id, combo: n.combo, data: n.data })),
    edges,
    combos,
  },
  node: {
    style: (n) => {
      const t = n.data.type;
      const p = PALETTE[t] || PALETTE.unit;
      return {
        labelText: `${n.data.label}\n[${n.data.kind}]`,
        labelFontSize: 11,
        labelFontWeight: 600,
        labelFill: p.text || '#1F2933',
        labelPlacement: 'center',
        labelWordWrap: true,
        labelMaxWidth: 160,
        labelMaxLines: 3,
        fill: p.fill,
        stroke: p.stroke,
        lineWidth: 1.5,
        radius: 8,
        size: [180, 64],
      };
    },
  },
  edge: {
    type: 'polyline',
    style: (e) => ({
      stroke: e.data.future ? '#FF8A65' : '#828282',
      lineWidth: 1.5,
      lineDash: e.data.future ? [6, 4] : false,
      endArrow: true,
      endArrowType: 'triangle',
      endArrowSize: 8,
      labelText: e.data.label,
      labelFontSize: 10,
      labelFill: '#555',
      labelBackground: true,
      labelBackgroundFill: '#fff',
      labelBackgroundOpacity: 0.9,
      labelPadding: [2, 4],
      router: { type: 'orth', padding: 12 },
    }),
  },
  combo: {
    type: 'rect',
    style: (c) => {
      const t = c.data.type;
      const p = PALETTE[t] || PALETTE.node;
      return {
        labelText: `${c.data.label}\n[${c.data.kind}]`,
        labelFontSize: 12,
        labelFontWeight: 700,
        labelFill: '#1F2933',
        labelPlacement: 'top',
        labelOffsetY: -4,
        labelBackground: true,
        labelBackgroundFill: '#fff',
        labelBackgroundOpacity: 0.95,
        labelPadding: [3, 6],
        fill: p.fill,
        fillOpacity: t === 'env' ? 0 : 0.4,
        stroke: p.stroke,
        lineWidth: t === 'env' ? 2 : 1.5,
        lineDash: p.strokeStyle || false,
        radius: 8,
        padding: [28, 16, 16, 16],
      };
    },
  },
  layout: {
    type: 'antv-dagre',
    rankdir: 'TB',
    ranksep: 60,
    nodesep: 30,
  },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
  plugins: [
    {
      type: 'tooltip',
      trigger: 'hover',
      enterable: true,
      getContent: (evt, items) => {
        if (!items || !items.length) return '';
        const item = items[0];
        const d = item.data || item;
        const gap = d.gap ? `<div class="tt-gap">⚠ ${d.gap}</div>` : '';
        return `<div><strong>${d.label || d.verb || ''}</strong>
          <div class="tt-kind">${d.kind || d.proto || ''}</div>
          <div class="tt-desc">${d.desc || ''}</div>${gap}</div>`;
      },
    },
  ],
});

graph.render();

document.getElementById('btn-fit').addEventListener('click', () => graph.fitView());
document.getElementById('btn-png').addEventListener('click', async () => {
  const dataUrl = await graph.toDataURL({ mode: 'overall', type: 'image/png' });
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = '02-deployment-g6.png';
  a.click();
});
