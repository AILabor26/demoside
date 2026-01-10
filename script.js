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
        console.error('Cannot init