import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap,
  Handle, Position, useReactFlow,
} from '@xyflow/react';
import { toPng } from 'html-to-image';
import { nodes as catalog, edges as edgeData, PALETTE } from './data.js';

// ============================================================================
// Layout manual jerarquico
// Estructura:
//   env-onprem  (col 0)        env-github (col 1)        env-azure (col 2)
//     node-ws                    node-github-saas         node-apim
//                                                         node-acr
//                                                         node-aks
//                                                           ns-mcp
// ============================================================================

const COLS = {
  'env-onprem': { x: 80,   y: 80, w: 760, h: 1100 },
  'env-github': { x: 960,  y: 80, w: 760, h: 1100 },
  'env-azure':  { x: 1840, y: 80, w: 960, h: 1700 },
};
const NODES_POS = {
  'node-ws':          { x: 40, y: 100, w: 680, h: 960, parent: 'env-onprem' },
  'node-github-saas': { x: 40, y: 100, w: 680, h: 960, parent: 'env-github' },
  'node-apim':        { x: 40, y: 100, w: 880, h: 240, parent: 'env-azure' },
  'node-acr':         { x: 40, y: 400, w: 880, h: 320, parent: 'env-azure' },
  'node-aks':         { x: 40, y: 780, w: 880, h: 820, parent: 'env-azure' },
  'ns-mcp':           { x: 40, y: 100, w: 800, h: 700, parent: 'node-aks' },
};
const UNIT_W = 240, UNIT_H = 110;
const childrenOf = {
  'node-ws': ['u-vscode','u-cli','u-mcps-local','u-shell','u-git','u-workspace','u-browser'],
  'node-github-saas': ['u-proxy','u-llm','u-console','u-audit-api','u-metrics-api','u-license','u-azdo-repos','u-audit-store'],
  'node-apim': ['u-api-sonar'],
  'node-acr':  ['u-image-sonar','u-acr-replica'],
  'ns-mcp':    ['u-ingress','u-mcp-server','u-token','u-csi','u-logs','u-template'],
};
function gridChildren(parentId, parentW, parentH, cols = 2, startY = 110) {
  const ids = childrenOf[parentId] || [];
  const gapX = 50, gapY = 80;
  const cellW = Math.floor((parentW - gapX * (cols + 1)) / cols);
  const positions = {};
  ids.forEach((id, i) => {
    const r = Math.floor(i / cols), c = i % cols;
    positions[id] = {
      x: gapX + c * (cellW + gapX),
      y: startY + r * (UNIT_H + gapY),
      w: cellW,
      h: UNIT_H,
      parent: parentId,
    };
  });
  return positions;
}

const externals = {
  'sys-netskope': { x: 2900, y: 140,  w: 280, h: 130 },
  'sys-entra':    { x: 2900, y: 360,  w: 280, h: 130 },
  'sys-sonar':    { x: 2900, y: 580,  w: 280, h: 130 },
  'sys-kv':       { x: 2900, y: 800,  w: 280, h: 130 },
  'sys-siem':     { x: 2900, y: 1020, w: 280, h: 130 },
  'sys-bi':       { x: 2900, y: 1240, w: 280, h: 130 },
};

// ----- Nodos React Flow -----
const HANDLE_SIDES = [
  { id: 't', position: Position.Top },
  { id: 'r', position: Position.Right },
  { id: 'b', position: Position.Bottom },
  { id: 'l', position: Position.Left },
];

function MultiHandles() {
  return (
    <>
      {HANDLE_SIDES.map(s => (
        <Handle key={`src-${s.id}`} id={s.id} type="source" position={s.position} style={{ opacity: 0, width: 8, height: 8 }} />
      ))}
      {HANDLE_SIDES.map(s => (
        <Handle key={`tgt-${s.id}`} id={`${s.id}-t`} type="target" position={s.position} style={{ opacity: 0, width: 8, height: 8 }} />
      ))}
    </>
  );
}

function LeafNode({ data }) {
  const p = PALETTE[data.type] || PALETTE.unit;
  return (
    <>
      <MultiHandles />
      <div
        className={`tuya-node${data.gap ? ' has-gap' : ''}`}
        style={{
          background: p.fill,
          border: `1.5px solid ${p.stroke}`,
          color: p.text,
        }}
        title={data.desc + (data.gap ? ` · Gap: ${data.gap}` : '')}
      >
        <div className="name">{data.name}</div>
        <div className="kind">[{data.kind}]</div>
      </div>
    </>
  );
}

function GroupNode({ data }) {
  const p = PALETTE[data.type] || PALETTE['node-active'];
  const isEnv = data.type === 'env';
  return (
    <>
      <MultiHandles />
      <div
        className="tuya-group"
        style={{
          background: isEnv ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.85)',
          border: `${isEnv ? 2 : 1.5}px ${isEnv ? 'dashed' : 'solid'} ${p.stroke}`,
        }}
      >
        <div className="label" style={{ color: p.text === '#FFFFFF' ? '#1F2933' : p.text }}>
          {data.name}
        </div>
        <div className="kind">[{data.kind}]</div>
      </div>
    </>
  );
}

const nodeTypes = { leaf: LeafNode, group: GroupNode };

// ----- Build flat node array -----
function buildNodes() {
  const byId = Object.fromEntries(catalog.map(n => [n.id, n]));
  const out = [];

  // 1) envs (top-level groups)
  Object.entries(COLS).forEach(([id, pos]) => {
    const cat = byId[id];
    if (!cat) return;
    out.push({
      id, type: 'group',
      position: { x: pos.x, y: pos.y },
      width: pos.w, height: pos.h,
      style: { width: pos.w, height: pos.h },
      data: cat,
      draggable: false, selectable: false, zIndex: -20,
    });
  });

  // 2) nodes (level 2)
  Object.entries(NODES_POS).forEach(([id, pos]) => {
    const cat = byId[id];
    if (!cat) return;
    out.push({
      id, type: 'group',
      position: { x: pos.x, y: pos.y },
      parentId: pos.parent, extent: 'parent',
      width: pos.w, height: pos.h,
      style: { width: pos.w, height: pos.h },
      data: cat,
      draggable: false, selectable: false, zIndex: -10,
    });
  });

  // 3) units (children of node-active)
  const parentDims = {
    'node-ws':          NODES_POS['node-ws'],
    'node-github-saas': NODES_POS['node-github-saas'],
    'node-apim':        NODES_POS['node-apim'],
    'node-acr':         NODES_POS['node-acr'],
    'ns-mcp':           NODES_POS['ns-mcp'],
  };
  Object.entries(parentDims).forEach(([pid, dim]) => {
    const cols = (childrenOf[pid] || []).length > 4 ? 2 : (childrenOf[pid] || []).length >= 2 ? 2 : 1;
    const positions = gridChildren(pid, dim.w, dim.h, cols, 110);
    Object.entries(positions).forEach(([id, pos]) => {
      const cat = byId[id];
      if (!cat) return;
      out.push({
        id, type: 'leaf',
        position: { x: pos.x, y: pos.y },
        parentId: pid, extent: 'parent',
        width: pos.w, height: pos.h,
        style: { width: pos.w, height: pos.h },
        data: cat,
        draggable: false, selectable: false, zIndex: 1,
      });
    });
  });

  // 4) externals (top-level leaves)
  Object.entries(externals).forEach(([id, pos]) => {
    const cat = byId[id];
    if (!cat) return;
    out.push({
      id, type: 'leaf',
      position: { x: pos.x, y: pos.y },
      width: pos.w, height: pos.h,
      style: { width: pos.w, height: pos.h },
      data: cat,
      draggable: false, selectable: false, zIndex: 1,
    });
  });

  return out;
}

function computeAbsolutePositions() {
  const abs = {};
  Object.entries(COLS).forEach(([id, p]) => {
    abs[id] = { x: p.x, y: p.y, w: p.w, h: p.h };
  });
  Object.entries(NODES_POS).forEach(([id, p]) => {
    const pa = abs[p.parent];
    abs[id] = { x: pa.x + p.x, y: pa.y + p.y, w: p.w, h: p.h };
  });
  const parentDims = {
    'node-ws': NODES_POS['node-ws'],
    'node-github-saas': NODES_POS['node-github-saas'],
    'node-apim': NODES_POS['node-apim'],
    'node-acr': NODES_POS['node-acr'],
    'ns-mcp': NODES_POS['ns-mcp'],
  };
  Object.entries(parentDims).forEach(([pid, dim]) => {
    const cols = (childrenOf[pid] || []).length > 4 ? 2 : (childrenOf[pid] || []).length >= 2 ? 2 : 1;
    const positions = gridChildren(pid, dim.w, dim.h, cols, 110);
    const pa = abs[pid];
    Object.entries(positions).forEach(([id, pos]) => {
      abs[id] = { x: pa.x + pos.x, y: pa.y + pos.y, w: pos.w, h: pos.h };
    });
  });
  Object.entries(externals).forEach(([id, p]) => {
    abs[id] = { x: p.x, y: p.y, w: p.w, h: p.h };
  });
  return abs;
}

const ABS = computeAbsolutePositions();

function pickHandles(srcId, tgtId) {
  const s = ABS[srcId], t = ABS[tgtId];
  if (!s || !t) return { sourceHandle: 'r', targetHandle: 'l-t' };
  const sc = { x: s.x + s.w / 2, y: s.y + s.h / 2 };
  const tc = { x: t.x + t.w / 2, y: t.y + t.h / 2 };
  const dx = tc.x - sc.x;
  const dy = tc.y - sc.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0
      ? { sourceHandle: 'r', targetHandle: 'l-t' }
      : { sourceHandle: 'l', targetHandle: 'r-t' };
  }
  return dy >= 0
    ? { sourceHandle: 'b', targetHandle: 't-t' }
    : { sourceHandle: 't', targetHandle: 'b-t' };
}

function buildEdges() {
  return edgeData.map(([s, t, verb, proto, future], i) => {
    const { sourceHandle, targetHandle } = pickHandles(s, t);
    return {
      id: `e-${i}`,
      source: s,
      target: t,
      sourceHandle,
      targetHandle,
      type: 'smoothstep',
      pathOptions: { offset: 40, borderRadius: 10 },
      animated: !!future,
      zIndex: 1000,
      label: `${verb} [${proto}]`,
      labelStyle: { fontSize: 11, fill: '#1F2933', fontWeight: 600 },
      labelBgStyle: { fill: '#FFFFFF', fillOpacity: 1, stroke: '#CFD4DB', strokeWidth: 0.8 },
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 6,
      style: {
        stroke: future ? '#FF8A65' : '#5C6470',
        strokeWidth: 1.6,
        strokeDasharray: future ? '6 4' : undefined,
      },
      markerEnd: { type: 'arrowclosed', color: future ? '#FF8A65' : '#5C6470' },
    };
  });
}

export default function App() {
  const rfNodes = useMemo(buildNodes, []);
  const rfEdges = useMemo(buildEdges, []);
  const { fitView } = useReactFlow();
  const flowRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => { try { fitView({ padding: 0.1 }); } catch (e) {} }, 100);
    return () => clearTimeout(t);
  }, [fitView]);

  const onExport = useCallback(() => {
    if (!flowRef.current) return;
    const vp = flowRef.current.querySelector('.react-flow__viewport');
    if (!vp) return;
    toPng(vp, {
      backgroundColor: '#f4f6fa',
      width: flowRef.current.offsetWidth,
      height: flowRef.current.offsetHeight,
    }).then((dataUrl) => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = '02-deployment-reactflow.png';
      a.click();
    });
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>GitHub Copilot — Despliegue (C2)</h1>
          <p className="subtitle">Variante <strong>React Flow v12 (@xyflow)</strong> · layout manual jerárquico</p>
        </div>
        <div className="actions">
          <button onClick={() => fitView({ padding: 0.1 })}>Ajustar vista</button>
          <button onClick={onExport}>Exportar PNG</button>
        </div>
      </header>
      <div className="flow-wrap" ref={flowRef}>
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.15}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} color="#dde2ea" />
          <Controls />
          <MiniMap pannable zoomable />
        </ReactFlow>
      </div>
    </div>
  );
}
