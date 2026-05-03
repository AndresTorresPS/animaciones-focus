class ParticleGraph {
    constructor(canvasId, particleCount = 90) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext("2d");
        this.particles = [];
        this.PARTICLE_COUNT = particleCount;
        this.MAX_DIST = 150;
        this.MAX_DIST_SQ = this.MAX_DIST * this.MAX_DIST;
        
        this.mouse = { x: null, y: null };
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }

    resize = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener("resize", this.resize);
        window.addEventListener("mousemove", (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        this.resize();
    }

    init() {
        this.particles = Array.from(
            { length: this.PARTICLE_COUNT },
            () => new Particle(this.canvas, this.MAX_DIST_SQ, this.mouse)
        );
    }

    connect() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distSq = dx * dx + dy * dy;

                if (distSq < this.MAX_DIST_SQ) {
                    const opacity = 1 - distSq / this.MAX_DIST_SQ;
                    this.ctx.strokeStyle = `rgba(100,255,218,${opacity * 0.4})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            p.update();
            p.draw(this.ctx);
        });

        this.connect();
        requestAnimationFrame(this.animate);
    }
}

class Particle {
    constructor(canvas, maxDistSq, mouse) {
        this.canvas = canvas;
        this.maxDistSq = maxDistSq;
        this.mouse = mouse;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Rebote
        if (this.x <= 0 || this.x >= this.canvas.width) this.vx *= -1;
        if (this.y <= 0 || this.y >= this.canvas.height) this.vy *= -1;

        // Interacción con mouse
        if (this.mouse.x !== null) {
            const dx = this.x - this.mouse.x;
            const dy = this.y - this.mouse.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < this.maxDistSq) {
                const force = (this.maxDistSq - distSq) / this.maxDistSq;
                this.x += dx * force * 0.02;
                this.y += dy * force * 0.02;
            }
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(100,255,218,0.9)";
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

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
    const radius = options.radius ?? 25;
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
