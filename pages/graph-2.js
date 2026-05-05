// ============================================
// DIVISIBILITY GRAPH FOR 9 WITH GSAP
// Skills utilizados: gsap-core, gsap-timeline
// ============================================

/**
 * Obtiene el centro de un nodo en relación al contenedor
 */
function getNodeCenter(node, container) {
  const nodeRect = node.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return {
    x: nodeRect.left - containerRect.left + nodeRect.width / 2,
    y: nodeRect.top - containerRect.top + nodeRect.height / 2
  };
}

/**
 * Crea un elemento SVG para visualizar una arista
 * @param {HTMLElement} edgeContainer - Contenedor de aristas
 * @param {string} pathString - String del path SVG
 * @param {Object} targetPoint - Punto final
 * @param {Object} options - Opciones de animación
 */
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

  // Punto animado que recorre la arista
  const dot = document.createElement('div');
  dot.className = 'edge-dot';
  if (options.dotId) dot.id = options.dotId;
  dot.style.offsetPath = `path("${pathString}")`;
  if (options.dotDelay) dot.style.animationDelay = options.dotDelay;
  edge.appendChild(dot);

  // Flecha direccional
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

/**
 * Crea una arista curva entre dos nodos
 * @param {HTMLElement} edgeContainer - Contenedor de aristas
 * @param {Object} def - Definición de la arista
 */
function createCurvedEdge(edgeContainer, def) {
  const source = document.getElementById(def.source);
  const target = document.getElementById(def.target);
  if (!source || !target) return;

  const sourcePoint = getNodeCenter(source, edgeContainer);
  const targetPoint = getNodeCenter(target, edgeContainer);
  const dx = targetPoint.x - sourcePoint.x;
  const dy = targetPoint.y - sourcePoint.y;
  const curvature = def.curvature ?? 0.3;

  // Puntos de control para la curva de Bézier
  const cp1 = {
    x: sourcePoint.x + dx * curvature,
    y: sourcePoint.y + (dy * (def.verticalBias ?? 0.15))
  };
  const cp2 = {
    x: targetPoint.x - dx * curvature,
    y: targetPoint.y - (dy * (def.verticalBias ?? 0.15))
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

/**
 * Construye todas las aristas del grafo con animaciones GSAP
 * Utiliza gsap-core y gsap-timeline para la secuenciación
 */
function buildGraphEdges() {
  const edgeContainer = document.querySelector('.edge-container');
  if (!edgeContainer) return;

  // Definición de aristas: relaciones de divisibilidad
  // 1 divide a 3 y a 9
  // 3 divide a 9
  const edgeDefinitions = [
    {
      id: 'edge-1-3',
      source: 'node-1',
      target: 'node-3',
      dotId: 'dot-1-3',
      dotDelay: '0s',
      curvature: 0.2,
      verticalBias: 0.1
    },
    {
      id: 'edge-1-9',
      source: 'node-1',
      target: 'node-9',
      dotId: 'dot-1-9',
      dotDelay: '0.5s',
      curvature: 0.25,
      verticalBias: -0.1
    },
    {
      id: 'edge-3-9',
      source: 'node-3',
      target: 'node-9',
      dotId: 'dot-3-9',
      dotDelay: '1s',
      curvature: 0.25,
      verticalBias: -0.1
    }
  ];

  // Crear las aristas
  edgeDefinitions.forEach(def => createCurvedEdge(edgeContainer, def));
}

/**
 * Anima la entrada de los nodos usando GSAP
 * Utiliza gsap-core: animación staggered
 */
function animateNodesEntry() {
  const nodes = document.querySelectorAll('.node');
  
  gsap.from(nodes, {
    duration: 0.8,
    opacity: 0,
    scale: 0.4,
    rotation: -45,
    ease: 'back.out(1.5)',
    stagger: {
      each: 0.2,
      from: 'random'
    }
  });
}

/**
 * Anima los labels de relación
 * Utiliza gsap-core: fade in
 */
function animateRelationLabels() {
  const labels = document.querySelectorAll('.relation-label');
  
  gsap.to(labels, {
    duration: 0.6,
    opacity: 0.85,
    ease: 'power2.out',
    stagger: 0.15,
    delay: 0.8
  });
}

/**
 * Crea efectos interactivos en los nodos
 * Utiliza gsap-core: efectos hover dinámicos
 */
function setupNodeInteractions() {
  const nodes = document.querySelectorAll('.node');
  
  nodes.forEach((node, index) => {
    node.addEventListener('mouseenter', function() {
      // Pulse animation
      gsap.to(this, {
        duration: 0.3,
        scale: 1.2,
        ease: 'power2.out'
      });

      // Glow effect
      gsap.to(this, {
        boxShadow: `0 0 30px ${index < 2 ? 'rgba(76, 175, 80, 0.8)' : 'rgba(255, 111, 0, 0.8)'}`,
        duration: 0.3
      });

      // Mostrar relaciones
      highlightRelationsForNode(this);
    });

    node.addEventListener('mouseleave', function() {
      gsap.to(this, {
        duration: 0.3,
        scale: 1,
        ease: 'power2.out'
      });

      gsap.to(this, {
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        duration: 0.3
      });

      // Restaurar relaciones
      resetRelationsHighlight();
    });
  });
}

/**
 * Resalta las relaciones de divisibilidad para un nodo específico
 */
function highlightRelationsForNode(node) {
  const value = node.getAttribute('data-value');
  const edgeContainer = document.querySelector('.edge-container');
  
  // Animar aristas relacionadas
  if (value === '1') {
    // 1 divide a 3 y a 9
    gsap.to('#edge-1-3 svg path', { stroke: '#ff6f00', strokeWidth: 5, duration: 0.3 });
    gsap.to('#edge-1-9 svg path', { stroke: '#ff6f00', strokeWidth: 5, duration: 0.3 });
  } else if (value === '3') {
    // 3 es divisible por 1, divide a 9
    gsap.to('#edge-1-3 svg path', { stroke: '#ff6f00', strokeWidth: 5, duration: 0.3 });
    gsap.to('#edge-3-9 svg path', { stroke: '#ff6f00', strokeWidth: 5, duration: 0.3 });
  } else if (value === '9') {
    // 9 es divisible por 1 y 3
    gsap.to('#edge-1-9 svg path', { stroke: '#ff6f00', strokeWidth: 5, duration: 0.3 });
    gsap.to('#edge-3-9 svg path', { stroke: '#ff6f00', strokeWidth: 5, duration: 0.3 });
  }
}

/**
 * Restaura el estado normal de todas las relaciones
 */
function resetRelationsHighlight() {
  gsap.to('.edge svg path', {
    stroke: '#9c27b0',
    strokeWidth: 3,
    duration: 0.3
  });
}

/**
 * Crea una línea de referencia (reflexividad)
 */
function createReflexivityLoop() {
  const node9 = document.getElementById('node-9');
  const edgeContainer = document.querySelector('.edge-container');
  
  const nodeCenter = getNodeCenter(node9, edgeContainer);
  const radius = 70;
  
  // Loop que rodea al nodo 9
  const loop = document.createElement('div');
  loop.className = 'edge';
  loop.id = 'loop-9';
  loop.style.width = `${radius * 2}px`;
  loop.style.height = `${radius * 2}px`;
  loop.style.left = `${nodeCenter.x - radius}px`;
  loop.style.top = `${nodeCenter.y - radius}px`;
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${radius * 2} ${radius * 2}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.style.width = '100%';
  svg.style.height = '100%';
  
  // Círculo para la reflexividad
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', radius);
  circle.setAttribute('cy', radius);
  circle.setAttribute('r', radius);
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke', '#9c27b0');
  circle.setAttribute('stroke-width', 2);
  circle.setAttribute('stroke-dasharray', `${2 * Math.PI * radius}`);
  circle.setAttribute('stroke-dashoffset', `${2 * Math.PI * radius}`);
  
  svg.appendChild(circle);
  loop.appendChild(svg);
  edgeContainer.appendChild(loop);
  
  // Animar el círculo
  gsap.to(circle, {
    strokeDashoffset: 0,
    duration: 2,
    delay: 1.5,
    ease: 'power2.out'
  });
}

/**
 * Crea una timeline maestra para coordinar todas las animaciones
 * Utiliza gsap-timeline para secuenciación
 */
function buildAnimationTimeline() {
  const masterTimeline = gsap.timeline();
  
  // Fase 1: Entrada de nodos
  masterTimeline.add(() => animateNodesEntry(), 0);
  
  // Fase 2: Construcción del grafo
  masterTimeline.add(() => buildGraphEdges(), 0.2);
  
  // Fase 3: Animación de aristas (fade in)
  masterTimeline.to('.edge', {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.out'
  }, 0.5);
  
  // Fase 4: Labels de relaciones
  masterTimeline.add(() => animateRelationLabels(), 0.7);
  
  // Fase 5: Loop de reflexividad
  masterTimeline.add(() => createReflexivityLoop(), 0.5);
  
  return masterTimeline;
}

/**
 * Inicialización principal
 */
document.addEventListener('DOMContentLoaded', function() {
  // Construir timeline maestra
  const timeline = buildAnimationTimeline();
  
  // Configurar interacciones
  setupNodeInteractions();
  
  // Info tooltip
  console.log('Grafo de divisibilidad del 9 cargado');
  console.log('Divisores: 1, 3, 9');
  console.log('Relaciones: 1|3, 1|9, 3|9');
});
