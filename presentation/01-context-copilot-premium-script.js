// =============================================================================
// Diagrama de contexto C1 — GitHub Copilot (Premium · estilo Tuya)
// Fuente de verdad: diagrams/01-context-copilot.drawio + diagram-context.md
// =============================================================================

cytoscape.use(cytoscapeElk);
cytoscape.use(cytoscapePopper);

// ---------------------------------------------------------------------------
// 1) NODOS
// ---------------------------------------------------------------------------
const nodes = [
  // ----- Personas (azul oscuro C4) -----
  {
    id: 'p-dev', type: 'person',
    name: 'Desarrollador de software',
    kind: 'Person',
    desc: 'Utiliza Copilot para escribir, refactorizar y revisar codigo. Interactua con la IA via IDE/CLI para resolver dudas tecnicas y generar pruebas.',
    resp: ['Generar y aceptar sugerencias de codigo', 'Pedir explicaciones y refactors', 'Generar pruebas unitarias', 'Operar Git contra Azure DevOps'],
  },
  {
    id: 'p-gov', type: 'person',
    name: 'Analista de Gobierno de IA',
    kind: 'Person',
    desc: 'Define politicas, lineamientos y estandares de gobernanza para uso de IA (responsabilidad, privacidad, seguridad). Selecciona y valida modelos.',
    resp: ['Definir politicas de uso de IA', 'Validar modelos y datasets', 'Vigilar metricas (adopcion, sesgo, costos)', 'Coordinar revisiones de impacto'],
  },
  {
    id: 'p-id', type: 'person',
    name: 'Analista Proteccion de Identidad',
    kind: 'Person',
    desc: 'Aplica y hace cumplir las politicas de gobernanza. Gestiona usuarios, licencias y auditorias operativas.',
    resp: ['Gestionar licencias y grupos', 'Configurar restricciones de modelos', 'Supervisar auditoria y telemetria', 'Generar reportes de cumplimiento'],
  },

  // ----- Sistema en foco -----
  {
    id: 'sys-copilot', type: 'system-focus',
    name: 'GitHub Copilot',
    kind: 'Software System',
    desc: 'Plataforma corporativa de asistencia de ingenieria basada en IA generativa, integrada al ecosistema Tuya bajo controles de seguridad, identidad, gobierno y cumplimiento.',
    resp: ['Generacion contextual de codigo', 'Refactor asistido', 'Generacion de pruebas unitarias', 'Chat tecnico contextual', 'Extensibilidad via MCPs'],
  },

  // ----- Sistemas externos -----
  {
    id: 'sys-entra', type: 'core',
    name: 'Microsoft Entra ID',
    kind: 'Core System',
    desc: 'IdP corporativo de Tuya. Autenticacion SSO (SAML/OIDC), aprovisionamiento SCIM, grupos de seguridad, MFA y control de dispositivos.',
    resp: ['Autenticar usuarios (SSO)', 'Aprovisionar via SCIM', 'Aplicar acceso condicional + MFA', 'Emitir tokens y logs de auditoria'],
  },
  {
    id: 'sys-llm', type: 'system',
    name: 'Modelos LLM',
    kind: 'Software System',
    desc: 'Proveedores de modelos (OpenAI GPT-4, Anthropic Claude, Google) que procesan prompts y generan completados. Sujetos a validacion de gobernanza.',
    resp: ['Procesar prompts', 'Generar completados / chat', 'Reportar metricas de costo y latencia'],
  },
  {
    id: 'sys-repos', type: 'system',
    name: 'Azure DevOps Repos',
    kind: 'Software System',
    desc: 'Repositorios corporativos. Fuente de codigo, historial, pull requests y metadata contextual que Copilot consume.',
    resp: ['Hospedar codigo corporativo', 'Exponer Git/HTTPS y APIs', 'Disparar webhooks'],
  },
  {
    id: 'sys-ide', type: 'system',
    name: 'IDEs / CLI',
    kind: 'Software System',
    desc: 'Entornos de desarrollo (VS Code, JetBrains, CLI) donde se muestran sugerencias en tiempo real. Comparten contexto con Copilot via extensiones.',
    resp: ['Renderizar sugerencias inline', 'Capturar contexto (archivo, cursor)', 'Ejecutar comandos del modo agente'],
  },
  {
    id: 'sys-mcp', type: 'system',
    name: 'Servidores MCP',
    kind: 'Software System',
    desc: 'Model Context Protocol servers (locales y corporativos) que entregan, filtran y enmascaran contexto adicional antes de enviarlo a los modelos.',
    resp: ['Exponer herramientas via JSON-RPC', 'Filtrar y enmascarar contexto', 'Estandarizar acceso a datos corporativos'],
  },
];

// ---------------------------------------------------------------------------
// 2) RELACIONES
// ---------------------------------------------------------------------------
const edgesData = [
  // Personas -> sistema
  ['p-dev',  'sys-copilot', 'Solicita asistencia de codigo', 'HTTPS'],
  ['p-gov',  'sys-copilot', 'Define politicas de uso',       'HTML/HTTPS'],
  ['p-id',   'sys-copilot', 'Administra licencias y audit',  'HTML/HTTPS'],
  ['p-dev',  'sys-repos',   'Versiona codigo',               'Git/HTTPS'],

  // Sistema en foco -> externos
  ['sys-copilot', 'sys-entra', 'Autentica / autoriza usuarios', 'SAML/OIDC'],
  ['sys-copilot', 'sys-llm',   'Solicita inferencia',           'API/HTTPS'],
  ['sys-copilot', 'sys-repos', 'Consulta contexto del codigo',  'REST/HTTPS'],
  ['sys-copilot', 'sys-ide',   'Provee sugerencias inline',     'JSON/HTTPS'],
  ['sys-copilot', 'sys-mcp',   'Invoca herramientas',           'JSON-RPC'],
];

// ---------------------------------------------------------------------------
// 3) ELEMENTS
// ---------------------------------------------------------------------------
const elements = [
  ...nodes.map(n => ({
    data: {
      id: n.id, type: n.type,
      name: n.name, kind: n.kind, desc: n.desc, resp: n.resp,
    },
  })),
  ...edgesData.map(([s, t, verb, proto], i) => ({
    data: {
      id: `e-${i}`,
      source: s,
      target: t,
      label: `${verb}\n[${proto}]`,
      verb, proto,
    },
  })),
];

// ---------------------------------------------------------------------------
// 4) STYLE
// ---------------------------------------------------------------------------
const style = [
  {
    selector: 'node[type="person"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#08427B',
      'border-color': '#073B6F',
      'border-width': 1.5,
      'width': 175,
      'height': 92,
      'label': '',
      'corner-radius': 18,
    },
  },
  {
    selector: 'node[type="system-focus"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#1168BD',
      'border-color': '#0B4884',
      'border-width': 1.5,
      'width': 240,
      'height': 120,
      'label': '',
      'corner-radius': 8,
    },
  },
  {
    selector: 'node[type="system"]',
    style: {
      'shape': 'round-rectangle',
      'background-color': '#8C8496',
      'border-color': '#6F6878',
      'border-width': 1.5,
      'width': 195,
      'height': 92,
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
      'height': 92,
      'label': '',
      'corner-radius': 18,
    },
  },
  {
    selector: 'edge',
    style: {
      'curve-style': 'bezier',
      'line-color': '#828282',
      'width': 1.3,
      'target-arrow-shape': 'triangle',
      'target-arrow-color': '#828282',
      'arrow-scale': 1,
      'label': 'data(label)',
      'font-size': 10,
      'color': '#3D4852',
      'text-background-color': '#FFFFFF',
      'text-background-opacity': 0.9,
      'text-background-padding': '2px',
      'text-rotation': 'autorotate',
      'text-wrap': 'wrap',
      'text-max-width': '140px',
      'font-family': '"Segoe UI", Arial, sans-serif',
    },
  },
  { selector: 'node.hover', style: { 'border-width': 3 } },
  { selector: 'edge.hover', style: { 'width': 2.5, 'line-color': '#0B2E4F', 'target-arrow-color': '#0B2E4F' } },
];

// ---------------------------------------------------------------------------
// 5) HTML labels
// ---------------------------------------------------------------------------
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function nodeLabel() {
  return (d) => `
    <div class="cy-label on-dark">
      <div class="name">${escapeHtml(d.name)}</div>
      <div class="type">[${escapeHtml(d.kind)}]</div>
    </div>`;
}

function nodeTooltipHtml(d) {
  const resp = (d.resp || []).map(r => `<li>${escapeHtml(r)}</li>`).join('');
  return `
    <div class="tt-title">${escapeHtml(d.name)}</div>
    <div class="tt-type">[${escapeHtml(d.kind)}]</div>
    <p class="tt-desc">${escapeHtml(d.desc || '')}</p>
    ${resp ? `<div class="tt-resp"><b>Responsabilidades</b><ul>${resp}</ul></div>` : ''}`;
}

function edgeTooltipHtml(d) {
  return `
    <div class="tt-title">${escapeHtml(d.verb)}</div>
    <div class="tt-type">[${escapeHtml(d.proto)}]</div>`;
}

// ---------------------------------------------------------------------------
// 6) INIT
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const cy = cytoscape({
    container: document.getElementById('cy'),
    elements,
    style,
    wheelSensitivity: 0.25,
    layout: {
      name: 'elk',
      nodeDimensionsIncludeLabels: true,
      elk: {
        algorithm: 'layered',
        'elk.direction': 'DOWN',
        'elk.edgeRouting': 'POLYLINE',
        'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
        'elk.spacing.nodeNode': 80,
        'elk.spacing.componentComponent': 100,
        'elk.spacing.edgeNode': 40,
        'elk.layered.spacing.nodeNodeBetweenLayers': 130,
        'elk.padding': '[top=40,left=40,bottom=40,right=40]',
      },
    },
  });

  cy.nodeHtmlLabel([{ query: 'node', tpl: nodeLabel() }]);

  function makeTippy(target, contentFn) {
    const ref = target.popperRef();
    const dummy = document.createElement('div');
    return tippy(dummy, {
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
      appendTo: () => document.body,
    });
  }

  const tipMap = new WeakMap();
  function showTip(target, fn) {
    let tip = tipMap.get(target);
    if (!tip) { tip = makeTippy(target, fn); tipMap.set(target, tip); }
    else tip.setProps({ getReferenceClientRect: target.popperRef().getBoundingClientRect });
    tip.show();
  }
  function hideTip(target) { const t = tipMap.get(target); if (t) t.hide(); }

  cy.on('mouseover', 'node', e => { e.target.addClass('hover'); showTip(e.target, nodeTooltipHtml); });
  cy.on('mouseout',  'node', e => { e.target.removeClass('hover'); hideTip(e.target); });
  cy.on('mouseover', 'edge', e => { e.target.addClass('hover'); showTip(e.target, edgeTooltipHtml); });
  cy.on('mouseout',  'edge', e => { e.target.removeClass('hover'); hideTip(e.target); });

  document.getElementById('btn-fit').addEventListener('click', () => cy.fit(undefined, 30));
  document.getElementById('btn-png').addEventListener('click', () => {
    const png = cy.png({ full: true, scale: 2, bg: '#FFFFFF' });
    const a = document.createElement('a');
    a.href = png; a.download = '01-context-copilot.png'; a.click();
  });

  cy.ready(() => cy.fit(undefined, 30));
  window.__cy = cy;
});
