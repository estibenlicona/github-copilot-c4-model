// =============================================================================
// C2 Despliegue — D3 + dagre-d3
// =============================================================================

const PALETTE = {
  unit:           { fill: '#438DD5', stroke: '#2E6295', text: '#FFFFFF' },
  'unit-new':     { fill: '#2E7D32', stroke: '#1B5E20', text: '#FFFFFF' },
  'unit-modified':{ fill: '#E65100', stroke: '#BF360C', text: '#FFFFFF' },
  'node-passive': { fill: '#E8E8E8', stroke: '#999',    text: '#333' },
  system:         { fill: '#8C8496', stroke: '#6F6878', text: '#FFFFFF' },
  'system-future':{ fill: '#B59CC9', stroke: '#8E6FA6', text: '#FFFFFF' },
  core:           { fill: '#5E4E6E', stroke: '#3A2F47', text: '#FFFFFF' },
};

// Catálogo (mismo dataset)
const catalog = [
  // envs (clusters)
  { id: 'env-onprem', cluster: true, type: 'env', name: 'Tuya — Endpoints', kind: 'Environment: on premise' },
  { id: 'env-github', cluster: true, type: 'env', name: 'GitHub Cloud', kind: 'Environment: cloud' },
  { id: 'env-azure',  cluster: true, type: 'env', name: 'Azure — Plataforma MCPs', kind: 'Environment: cloud' },
  // node-actives (clusters, anidados)
  { id: 'node-ws',          parent: 'env-onprem', cluster: true, type: 'node-active', name: 'Equipo del desarrollador', kind: 'Workstation' },
  { id: 'node-github-saas', parent: 'env-github', cluster: true, type: 'node-active', name: 'GitHub.com / Copilot SaaS', kind: 'SaaS · 99.9%' },
  { id: 'node-apim',        parent: 'env-azure',  cluster: true, type: 'node-active', name: 'Azure APIM', kind: 'API Gateway' },
  { id: 'node-acr',         parent: 'env-azure',  cluster: true, type: 'node-active', name: 'Azure ACR', kind: 'Container Registry' },
  { id: 'node-aks',         parent: 'env-azure',  cluster: true, type: 'node-active', name: 'AKS desarrollo', kind: 'K8s Cluster' },
  { id: 'ns-mcp',           parent: 'node-aks',   cluster: true, type: 'node-active', name: 'Namespace MCP', kind: 'K8s Namespace' },

  // units
  { id: 'u-vscode',    parent: 'node-ws', type: 'unit', name: 'VS Code + Copilot', kind: 'IDE Extension' },
  { id: 'u-cli',       parent: 'node-ws', type: 'unit', name: 'Copilot CLI', kind: 'CLI' },
  { id: 'u-mcps-local',parent: 'node-ws', type: 'unit', name: 'MCPs locales', kind: 'Local MCP' },
  { id: 'u-shell',     parent: 'node-ws', type: 'unit', name: 'Shell', kind: 'Shell' },
  { id: 'u-git',       parent: 'node-ws', type: 'unit', name: 'Cliente Git', kind: 'Git' },
  { id: 'u-workspace', parent: 'node-ws', type: 'unit', name: 'Workspace local', kind: 'File System' },
  { id: 'u-browser',   parent: 'node-ws', type: 'unit', name: 'Navegador', kind: 'Browser' },

  { id: 'u-proxy',       parent: 'node-github-saas', type: 'unit', name: 'Proxy Copilot', kind: 'API' },
  { id: 'u-llm',         parent: 'node-github-saas', type: 'unit', name: 'Servicio LLM', kind: 'LLM' },
  { id: 'u-console',     parent: 'node-github-saas', type: 'unit', name: 'Consola admin', kind: 'Web App' },
  { id: 'u-audit-api',   parent: 'node-github-saas', type: 'unit', name: 'Audit Log API', kind: 'API' },
  { id: 'u-metrics-api', parent: 'node-github-saas', type: 'unit', name: 'Metrics API', kind: 'API' },
  { id: 'u-license',     parent: 'node-github-saas', type: 'unit', name: 'Licenciamiento', kind: 'API' },
  { id: 'u-azdo-repos',  parent: 'node-github-saas', type: 'unit', name: 'AzDO Repos', kind: 'Git Hosting' },
  { id: 'u-audit-store', parent: 'node-github-saas', type: 'unit', name: 'Audit Storage', kind: 'Log Store' },

  { id: 'u-api-sonar',   parent: 'node-apim', type: 'unit', name: 'API Sonar MCP', kind: 'APIM Route' },
  { id: 'u-image-sonar', parent: 'node-acr',  type: 'unit', name: 'Imagen MCP', kind: 'OCI Image' },
  { id: 'u-acr-replica', parent: 'node-acr',  type: 'node-passive', name: 'Replica geo', kind: 'Reg pasivo' },

  { id: 'u-ingress',    parent: 'ns-mcp', type: 'unit', name: 'Ingress', kind: 'K8s Service' },
  { id: 'u-mcp-server', parent: 'ns-mcp', type: 'unit', name: 'Sonar MCP Server', kind: 'MCP Server' },
  { id: 'u-token',      parent: 'ns-mcp', type: 'unit-modified', name: 'Token admin **', kind: 'Env Var' },
  { id: 'u-csi',        parent: 'ns-mcp', type: 'unit-new', name: 'CSI Secrets ++', kind: 'K8s CSI' },
  { id: 'u-logs',       parent: 'ns-mcp', type: 'unit', name: 'Logs MCP', kind: 'Container Logs' },
  { id: 'u-template',   parent: 'ns-mcp', type: 'unit-new', name: 'Template MCPs ++', kind: 'Helm' },

  { id: 'sys-netskope', type: 'system', name: 'Netskope SWG', kind: 'Software System' },
  { id: 'sys-entra',    type: 'core',   name: 'Microsoft Entra ID', kind: 'Core System' },
  { id: 'sys-sonar',    type: 'system', name: 'SonarCloud', kind: 'Software System' },
  { id: 'sys-kv',       type: 'system-future', name: 'Azure Key Vault ++', kind: 'SW · futuro' },
  { id: 'sys-siem',     type: 'system-future', name: 'SIEM corporativo', kind: 'SW · futuro' },
  { id: 'sys-bi',       type: 'system-future', name: 'BI / Adopcion', kind: 'SW · futuro' },
];

const edgesData = [
  ['u-vscode','u-workspace','Lee contexto','FS local'],
  ['u-cli','u-workspace','Lee contexto','FS local'],
  ['u-vscode','u-mcps-local','Invoca','JSON-RPC'],
  ['u-cli','u-mcps-local','Invoca','JSON-RPC'],
  ['u-vscode','u-shell','Ejecuta','Proceso'],
  ['u-cli','u-shell','Ejecuta','Proceso'],
  ['u-git','u-azdo-repos','Push/pull','Git/HTTPS'],
  ['u-vscode','sys-netskope','Envia prompts','JSON/HTTPS'],
  ['u-cli','sys-netskope','Envia prompts','JSON/HTTPS'],
  ['u-browser','u-console','Administra','HTML/HTTPS'],
  ['sys-netskope','u-proxy','Egress','JSON/HTTPS'],
  ['u-proxy','u-llm','Inferencia','API/HTTPS'],
  ['u-proxy','u-license','Entitlement','JSON/HTTPS'],
  ['u-license','sys-entra','SSO','SAML/OIDC'],
  ['u-console','sys-entra','Auth admin','SAML/SCIM'],
  ['u-audit-api','u-audit-store','Persiste','interno'],
  ['u-audit-api','sys-siem','Debe exportar','JSON/HTTPS', true],
  ['u-metrics-api','sys-bi','Debe consumir','JSON/HTTPS', true],
  ['sys-netskope','u-api-sonar','Egress MCP','JSON/HTTPS'],
  ['u-api-sonar','u-ingress','Enruta','HTTPS'],
  ['u-ingress','u-mcp-server','Forward','HTTP'],
  ['u-mcp-server','u-token','Lee token','Env Var'],
  ['u-mcp-server','sys-sonar','Consulta','JSON/HTTPS'],
  ['u-mcp-server','u-logs','Logs','stdout'],
  ['u-image-sonar','u-acr-replica','Replica','OCI', true],
  ['u-mcp-server','u-csi','Debe consumir','FS volume', true],
  ['u-csi','sys-kv','Monta secretos','JSON/HTTPS', true],
];

// ----- Construir grafo dagre -----
const g = new dagreD3.graphlib.Graph({ compound: true, multigraph: false })
  .setGraph({ rankdir: 'TB', ranksep: 45, nodesep: 25, marginx: 20, marginy: 20 })
  .setDefaultEdgeLabel(() => ({}));

catalog.forEach(n => {
  if (n.cluster) {
    g.setNode(n.id, {
      label: `${n.name}\n[${n.kind}]`,
      clusterLabelPos: 'top',
      class: n.type,
      style: n.type === 'env'
        ? 'fill: transparent; stroke: #444; stroke-width: 2px; stroke-dasharray: 6 4;'
        : 'fill: #ffffff; stroke: #6B6B6B; stroke-width: 1.5px;',
    });
  } else {
    const p = PALETTE[n.type] || PALETTE.unit;
    const labelHtml = `<div style="text-align:center;padding:4px;color:${p.text}">
      <div style="font-weight:700;font-size:11px">${n.name}</div>
      <div style="font-size:10px;opacity:0.85">[${n.kind}]</div></div>`;
    g.setNode(n.id, {
      labelType: 'html',
      label: labelHtml,
      padding: 0,
      style: `fill: ${p.fill}; stroke: ${p.stroke}; stroke-width: 1.5px;`,
      rx: 6, ry: 6,
    });
  }
  if (n.parent) g.setParent(n.id, n.parent);
});

edgesData.forEach(([s, t, verb, proto, future]) => {
  g.setEdge(s, t, {
    label: `${verb}\n[${proto}]`,
    labelStyle: 'font-size: 10px; fill: #444',
    style: future
      ? 'stroke: #FF8A65; stroke-width: 1.5px; stroke-dasharray: 6 4; fill: none;'
      : 'stroke: #828282; stroke-width: 1.5px; fill: none;',
    arrowheadStyle: `fill: ${future ? '#FF8A65' : '#828282'}; stroke: none;`,
    curve: d3.curveBasis,
  });
});

// ----- Render -----
const svg = d3.select('#svg');
const root = svg.select('#root');
const render = new dagreD3.render();
render(root, g);

// ----- Zoom & pan -----
const zoom = d3.zoom().on('zoom', (ev) => root.attr('transform', ev.transform));
svg.call(zoom);

function fit() {
  const bbox = root.node().getBBox();
  const svgEl = svg.node();
  const w = svgEl.clientWidth, h = svgEl.clientHeight;
  const scale = Math.min(w / (bbox.width + 60), h / (bbox.height + 60));
  const tx = (w - bbox.width * scale) / 2 - bbox.x * scale;
  const ty = (h - bbox.height * scale) / 2 - bbox.y * scale;
  svg.transition().duration(300)
    .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
}
window.addEventListener('resize', fit);
setTimeout(fit, 100);

document.getElementById('btn-fit').addEventListener('click', fit);
document.getElementById('btn-png').addEventListener('click', () => {
  const svgEl = svg.node();
  const serializer = new XMLSerializer();
  const src = serializer.serializeToString(svgEl);
  const blob = new Blob([src], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = svgEl.clientWidth * 2;
    canvas.height = svgEl.clientHeight * 2;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f4f6fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(2, 2);
    ctx.drawImage(img, 0, 0);
    const a = document.createElement('a');
    a.download = '02-deployment-d3-dagre.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    URL.revokeObjectURL(url);
  };
  img.src = url;
});
