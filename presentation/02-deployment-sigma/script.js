// =============================================================================
// C2 Despliegue — Sigma.js v2 + Graphology
// Demo educativa: Sigma esta optimizada para grafos densos, no arquitectura C4.
// =============================================================================

const PALETTE = {
  unit:           '#438DD5',
  'unit-new':     '#2E7D32',
  'unit-modified':'#E65100',
  'node-passive': '#E8E8E8',
  system:         '#8C8496',
  'system-future':'#B59CC9',
  core:           '#5E4E6E',
};

// Catalogo (mismo dataset, sin clusters reales)
const catalog = [
  { id: 'env-onprem', type: 'env',  size: 22, name: 'Tuya Endpoints', kind: 'Environment' },
  { id: 'env-github', type: 'env',  size: 22, name: 'GitHub Cloud', kind: 'Environment' },
  { id: 'env-azure',  type: 'env',  size: 22, name: 'Azure dev', kind: 'Environment' },
  { id: 'node-ws',          type: 'node', size: 16, name: 'Workstation', kind: 'Node' },
  { id: 'node-github-saas', type: 'node', size: 16, name: 'Copilot SaaS', kind: 'Node' },
  { id: 'node-apim',        type: 'node', size: 14, name: 'APIM', kind: 'Node' },
  { id: 'node-acr',         type: 'node', size: 14, name: 'ACR', kind: 'Node' },
  { id: 'node-aks',         type: 'node', size: 16, name: 'AKS', kind: 'Node' },
  { id: 'ns-mcp',           type: 'node', size: 14, name: 'NS MCP', kind: 'Namespace' },

  { id: 'u-vscode',    type: 'unit', size: 10, name: 'VS Code', kind: 'IDE' },
  { id: 'u-cli',       type: 'unit', size: 10, name: 'Copilot CLI', kind: 'CLI' },
  { id: 'u-mcps-local',type: 'unit', size: 10, name: 'MCPs locales', kind: 'MCP' },
  { id: 'u-shell',     type: 'unit', size: 10, name: 'Shell', kind: 'Shell' },
  { id: 'u-git',       type: 'unit', size: 10, name: 'Git', kind: 'Git' },
  { id: 'u-workspace', type: 'unit', size: 10, name: 'Workspace', kind: 'FS' },
  { id: 'u-browser',   type: 'unit', size: 10, name: 'Navegador', kind: 'Browser' },

  { id: 'u-proxy',       type: 'unit', size: 11, name: 'Proxy Copilot', kind: 'API' },
  { id: 'u-llm',         type: 'unit', size: 11, name: 'LLM', kind: 'LLM' },
  { id: 'u-console',     type: 'unit', size: 10, name: 'Consola admin', kind: 'Web' },
  { id: 'u-audit-api',   type: 'unit', size: 10, name: 'Audit API', kind: 'API' },
  { id: 'u-metrics-api', type: 'unit', size: 10, name: 'Metrics API', kind: 'API' },
  { id: 'u-license',     type: 'unit', size: 10, name: 'Licencias', kind: 'API' },
  { id: 'u-azdo-repos',  type: 'unit', size: 10, name: 'AzDO Repos', kind: 'Git' },
  { id: 'u-audit-store', type: 'unit', size: 10, name: 'Audit Store', kind: 'Store' },

  { id: 'u-api-sonar',   type: 'unit', size: 10, name: 'API Sonar', kind: 'APIM' },
  { id: 'u-image-sonar', type: 'unit', size: 10, name: 'Imagen MCP', kind: 'OCI' },
  { id: 'u-acr-replica', type: 'node-passive', size: 10, name: 'ACR replica', kind: 'Reg' },

  { id: 'u-ingress',    type: 'unit', size: 10, name: 'Ingress', kind: 'Svc' },
  { id: 'u-mcp-server', type: 'unit', size: 12, name: 'MCP Server', kind: 'MCP' },
  { id: 'u-token',      type: 'unit-modified', size: 10, name: 'Token **', kind: 'EnvVar' },
  { id: 'u-csi',        type: 'unit-new', size: 10, name: 'CSI ++', kind: 'CSI' },
  { id: 'u-logs',       type: 'unit', size: 10, name: 'Logs', kind: 'Logs' },
  { id: 'u-template',   type: 'unit-new', size: 10, name: 'Template ++', kind: 'Helm' },

  { id: 'sys-netskope', type: 'system', size: 14, name: 'Netskope', kind: 'SWG' },
  { id: 'sys-entra',    type: 'core',   size: 14, name: 'Entra ID', kind: 'IdP' },
  { id: 'sys-sonar',    type: 'system', size: 12, name: 'SonarCloud', kind: 'SaaS' },
  { id: 'sys-kv',       type: 'system-future', size: 12, name: 'Key Vault ++', kind: 'Vault' },
  { id: 'sys-siem',     type: 'system-future', size: 12, name: 'SIEM', kind: 'SIEM' },
  { id: 'sys-bi',       type: 'system-future', size: 12, name: 'BI', kind: 'BI' },
];

const edgesData = [
  ['u-vscode','u-workspace'], ['u-cli','u-workspace'],
  ['u-vscode','u-mcps-local'], ['u-cli','u-mcps-local'],
  ['u-vscode','u-shell'], ['u-cli','u-shell'],
  ['u-git','u-azdo-repos'],
  ['u-vscode','sys-netskope'], ['u-cli','sys-netskope'],
  ['u-browser','u-console'],
  ['sys-netskope','u-proxy'], ['u-proxy','u-llm'], ['u-proxy','u-license'],
  ['u-license','sys-entra'], ['u-console','sys-entra'],
  ['u-audit-api','u-audit-store'],
  ['u-audit-api','sys-siem', true], ['u-metrics-api','sys-bi', true],
  ['sys-netskope','u-api-sonar'], ['u-api-sonar','u-ingress'],
  ['u-ingress','u-mcp-server'], ['u-mcp-server','u-token'],
  ['u-mcp-server','sys-sonar'], ['u-mcp-server','u-logs'],
  ['u-image-sonar','u-acr-replica', true], ['u-mcp-server','u-csi', true], ['u-csi','sys-kv', true],
  // Pertenencia visual (anclajes a entornos/nodos)
  ['node-ws','env-onprem','membership'], ['node-github-saas','env-github','membership'],
  ['node-apim','env-azure','membership'], ['node-acr','env-azure','membership'],
  ['node-aks','env-azure','membership'], ['ns-mcp','node-aks','membership'],
];

// ----- Graph -----
const Graph = graphology.Graph;
const graph = new Graph();
catalog.forEach(n => {
  const color = n.type === 'env' ? '#444444'
            : n.type === 'node' ? '#6B6B6B'
            : PALETTE[n.type] || '#999';
  graph.addNode(n.id, {
    label: n.name,
    size: n.size,
    color,
    type: n.type === 'env' || n.type === 'node' ? 'circle' : 'circle',
    nodeKind: n.type,
    descr: `[${n.kind}]`,
  });
});

edgesData.forEach(([s, t, kind]) => {
  if (!graph.hasNode(s) || !graph.hasNode(t)) return;
  graph.addEdgeWithKey(`${s}->${t}`, s, t, {
    size: kind === 'membership' ? 0.6 : (kind === true ? 1.2 : 1.5),
    color: kind === 'membership' ? '#cccccc' : (kind === true ? '#FF8A65' : '#828282'),
    type: kind === 'membership' ? 'line' : 'arrow',
  });
});

// ----- Layout: circular inicial + ForceAtlas2 -----
graphologyLibrary.layout.circular.assign(graph);
const settings = graphologyLibrary.layoutForceAtlas2.inferSettings(graph);
graphologyLibrary.layoutForceAtlas2.assign(graph, { iterations: 400, settings });

// ----- Sigma -----
const container = document.getElementById('sigma-container');
const renderer = new Sigma(graph, container, {
  renderEdgeLabels: false,
  labelRenderedSizeThreshold: 5,
  defaultEdgeType: 'arrow',
  labelSize: 12,
  labelWeight: '600',
});

// Hover tooltip basico
renderer.on('enterNode', ({ node }) => {
  const attrs = graph.getNodeAttributes(node);
  container.title = `${attrs.label} ${attrs.descr || ''}`;
});

document.getElementById('btn-fit').addEventListener('click', () => {
  renderer.getCamera().animatedReset();
});
document.getElementById('btn-png').addEventListener('click', () => {
  const layers = container.querySelectorAll('canvas');
  const w = container.offsetWidth, h = container.offsetHeight;
  const out = document.createElement('canvas');
  out.width = w * 2; out.height = h * 2;
  const ctx = out.getContext('2d');
  ctx.fillStyle = '#f4f6fa';
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.scale(2, 2);
  layers.forEach(c => ctx.drawImage(c, 0, 0, w, h));
  const a = document.createElement('a');
  a.download = '02-deployment-sigma.png';
  a.href = out.toDataURL('image/png');
  a.click();
});
