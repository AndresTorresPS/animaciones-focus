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
