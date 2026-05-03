function getNodeCenter(node, container) {
  const nodeRect = node.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return {
    x: nodeRect.left - containerRect.left + nodeRect.width / 2,
    y: nodeRect.top - containerRect.top + nodeRect.height / 2
  };
}

function createEdgeElement(edgeContainer, pathString, targetPoint, options = {}) {
  const edge = document.createElement('div');
  edge.className = 'edge';
  if (options.id) edge.id = options.id;
  edge.style.width = '100%';
  edge.style.height = '100%';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${edgeContainer.clientWidth} ${edgeContainer.clientHeight}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.style.width = '100%';
  svg.style.height = '100%';

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathString);
  svg.appendChild(path);
  edge.appendChild(svg);

  const dot = document.createElement('div');
  dot.className = 'edge-dot';
  if (options.dotId) dot.id = options.dotId;
  dot.style.offsetPath = `path("${pathString}")`;
  if (options.dotDelay) dot.style.animationDelay = options.dotDelay;
  edge.appendChild(dot);

  if (options.arrow !== false && targetPoint) {
    const arrow = document.createElement('div');
    arrow.className = 'arrowhead';
    const dx = targetPoint.x - (options.sourcePoint?.x ?? 0);
    const dy = targetPoint.y - (options.sourcePoint?.y ?? 0);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    arrow.style.left = `${targetPoint.x}px`;
    arrow.style.top = `${targetPoint.y}px`;
    arrow.style.transform = `translate(-50%, -50%) rotate(${angle - 90}deg)`;
    edge.appendChild(arrow);
  }

  edgeContainer.appendChild(edge);
  return edge;
}

function createCurvedEdge(edgeContainer, def) {
  const source = document.getElementById(def.source);
  const target = document.getElementById(def.target);
  if (!source || !target) return;

  const sourcePoint = getNodeCenter(source, edgeContainer);
  const targetPoint = getNodeCenter(target, edgeContainer);
  const dx = targetPoint.x - sourcePoint.x;
  const dy = targetPoint.y - sourcePoint.y;
  const curvature = def.curvature ?? 0.4;

  const cp1 = {
    x: sourcePoint.x + dx * curvature,
    y: sourcePoint.y + (dy * (def.verticalBias ?? 0.1))
  };
  const cp2 = {
    x: targetPoint.x - dx * curvature,
    y: targetPoint.y - (dy * (def.verticalBias ?? 0.1))
  };

  const pathString = `M ${sourcePoint.x} ${sourcePoint.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${targetPoint.x} ${targetPoint.y}`;

  return createEdgeElement(edgeContainer, pathString, targetPoint, {
    id: def.id,
    dotId: def.dotId,
    dotDelay: def.dotDelay,
    arrow: def.arrow !== false,
    sourcePoint,
  });
}

function createLoopEdge(edgeContainer, node, options = {}) {
  const nodeCenter = getNodeCenter(node, edgeContainer);
  const radius = options.radius ?? 30;
  const loop = document.createElement('div');
  loop.className = 'edge';
  loop.id = options.id ?? 'loop-0';
  loop.style.width = `${radius * 2}px`;
  loop.style.height = `${radius * 2}px`;
  loop.style.left = `${nodeCenter.x - radius}px`;
  loop.style.top = `${nodeCenter.y - radius}px`;

  const dot = document.createElement('div');
  dot.className = 'edge-dot loop';
  if (options.dotId) dot.id = options.dotId;
  dot.style.offsetPath = `path("M ${radius} 0 C ${radius * 1.6} 0, ${radius * 2} ${radius * 0.4}, ${radius * 2} ${radius} C ${radius * 2} ${radius * 1.6}, ${radius * 1.6} ${radius * 2}, ${radius} ${radius * 2} C ${radius * 0.4} ${radius * 2}, 0 ${radius * 1.6}, 0 ${radius} C 0 ${radius * 0.4}, ${radius * 0.4} 0, ${radius} 0")`;
  if (options.dotDelay) dot.style.animationDelay = options.dotDelay;
  loop.appendChild(dot);

  edgeContainer.appendChild(loop);
  return loop;
}

function buildGraphEdges() {
  const edgeContainer = document.querySelector('.edge-container');
  if (!edgeContainer) return;

  const edgeDefinitions = [
    { id: 'edge-6-3', source: 'node-6', target: 'node-3', dotId: 'dot-6-3', dotDelay: '0s', curvature: 0.35, verticalBias: 0.08 },
    { id: 'edge-1-4', source: 'node-1', target: 'node-4', dotId: 'dot-1-4', dotDelay: '1.5s', curvature: 0.35, verticalBias: 0.08 },
    { id: 'edge-5-2', source: 'node-5', target: 'node-2', dotId: 'dot-5-2', dotDelay: '3s', curvature: 0.35, verticalBias: -0.05 },
    { id: 'edge-5-4', source: 'node-5', target: 'node-4', dotId: 'dot-5-4', dotDelay: '4.5s', curvature: 0.4, verticalBias: 0.35 },
    { id: 'edge-2-3', source: 'node-2', target: 'node-3', dotId: 'dot-2-3', dotDelay: '6s', curvature: 0.4, verticalBias: 0.35 }
  ];

  edgeDefinitions.forEach(def => createCurvedEdge(edgeContainer, def));
  createLoopEdge(edgeContainer, document.getElementById('node-0'), {
    id: 'loop-0',
    dotId: 'dot-loop-0',
    dotDelay: '0.5s',
    radius: 25
  });
}

document.addEventListener('DOMContentLoaded', buildGraphEdges);
