// ========================================
// GENERATIVE CANVAS VISUAL
// ========================================
console.log('Script loaded!');

const canvas = document.getElementById('generativeCanvas');
console.log('Canvas element:', canvas);

if (!canvas) {
    console.error('ERROR: Canvas not found!');
} else {
    console.log('Canvas found! Dimensions:', canvas.offsetWidth, 'x', canvas.offsetHeight);
}

const ctx = canvas ? canvas.getContext('2d') : null;
console.log('Canvas context:', ctx);

let width, height;
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    if (!canvas) return;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    console.log('Canvas resized to:', width, 'x', height);
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(26, 26, 26, ${Math.random() * 0.5 + 0.1})`;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > width || this.x < 0) this.speedX *= -1;
        if (this.y > height || this.y < 0) this.speedY *= -1;
        
        // Mouse interaction
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                this.x -= dx / distance * 0.5;
                this.y -= dy / distance * 0.5;
            }
        }
    }
    
    draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    if (!canvas) {
        console.error('Cannot init: no canvas');
        return;
    }
    particles = [];
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }
    console.log('Initialized', particles.length, 'particles');
}

function connectParticles() {
    if (!ctx) return;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                const opacity = 1 - (distance / 120);
                ctx.strokeStyle = `rgba(255, 184, 0, ${opacity * 0.2})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animate);
}

// Mouse tracking
if (canvas) {
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
}

// Initialize
console.log('Starting initialization...');
resizeCanvas();
init();
animate();
console.log('Animation started!');

window.addEventListener('resize', () => {
    resizeCanvas();
    init();
});

// ========================================
// LIVE TIME & DATE UPDATE
// ========================================
function updateTime() {
    const now = new Date();
    
    // Time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeEl = document.getElementById('time');
    if (timeEl) timeEl.textContent = `${hours}:${minutes}:${seconds}`;
    
    // Date
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateEl = document.getElementById('date');
    if (dateEl) dateEl.textContent = `${day}.${month}.${year}`;
}

// Update every second
updateTime();
setInterval(updateTime, 1000);

// ========================================
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
