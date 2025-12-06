// Canvas Animation - Chess Pattern Particle System
const canvas = document.getElementById('flow-canvas');
const ctx = canvas.getContext('2d');

let W, H, centerX, centerY, scale;

function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    centerX = W * 0.72;
    centerY = H * 0.5;
    scale = Math.min(W, H) * 0.28;
}
resizeCanvas();

// Chess pattern
function generateChessPattern() {
    const points = [];
    const gridSize = 8;
    const cellSize = 1.6 / gridSize;
    const startX = -0.8;
    const startY = -0.8;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const isWhite = (row + col) % 2 === 0;
            const brightness = isWhite ? 0.9 : 0.1;
            const cellCenterX = startX + col * cellSize + cellSize / 2;
            const cellCenterY = startY + row * cellSize + cellSize / 2;
            const count = isWhite ? 280 : 200;

            for (let i = 0; i < count; i++) {
                points.push({
                    x: cellCenterX + (Math.random() - 0.5) * cellSize * 0.88,
                    y: cellCenterY + (Math.random() - 0.5) * cellSize * 0.88,
                    b: brightness
                });
            }
        }
    }

    for (let i = 0; i < 180; i++) {
        const t = i / 180;
        const side = Math.floor(t * 4);
        const pos = (t * 4) % 1;
        let x, y;
        switch (side) {
            case 0: x = -0.82 + pos * 1.64; y = -0.82; break;
            case 1: x = 0.82; y = -0.82 + pos * 1.64; break;
            case 2: x = 0.82 - pos * 1.64; y = 0.82; break;
            case 3: x = -0.82; y = 0.82 - pos * 1.64; break;
        }
        points.push({ x, y, b: 0.5 });
    }
    return points;
}

const particleCount = 16000;
const targetPoints = generateChessPattern();
const particles = [];

for (let i = 0; i < particleCount; i++) {
    const noiseR = Math.sqrt(-2 * Math.log(Math.random())) * 0.55;
    const noiseTheta = Math.random() * Math.PI * 2;

    let target, brightness;
    if (i < targetPoints.length) {
        target = targetPoints[i];
        brightness = target.b;
    } else {
        const angle = Math.random() * Math.PI * 2;
        const r = 1.1 + Math.random() * 0.25;
        target = { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
        brightness = 0.12;
    }

    particles.push({
        nx: noiseR * Math.cos(noiseTheta),
        ny: noiseR * Math.sin(noiseTheta),
        tx: target.x,
        ty: target.y,
        b: brightness
    });
}

let t = 0;
let targetT = 0;

// Typewriter effect for terminal
const terminalMessages = [
    'rohit@iisc:~$ python inference.py',
    'torch.cuda.is_available() → True',
    'Loading checkpoint: best_model.pt',
    'Model loaded. 847M params',
    'Ready.'
];
let currentMsgIndex = 0;
let charIndex = 0;
let isTyping = true;
let typewriterTimeout = null;

function typeWriter() {
    const terminalText = document.getElementById('terminal-text');
    const terminalInit = document.getElementById('terminal-init');
    if (!terminalText || !terminalInit) return;

    const currentMsg = terminalMessages[currentMsgIndex];

    if (isTyping) {
        if (charIndex < currentMsg.length) {
            terminalText.textContent = currentMsg.substring(0, charIndex + 1);
            charIndex++;
            typewriterTimeout = setTimeout(typeWriter, 50 + Math.random() * 30);
        } else {
            // Pause at end of message
            isTyping = false;
            typewriterTimeout = setTimeout(typeWriter, 2000);
        }
    } else {
        // Move to next message
        currentMsgIndex = (currentMsgIndex + 1) % terminalMessages.length;
        charIndex = 0;
        isTyping = true;
        terminalText.textContent = '';
        typeWriter();
    }
}

// Start typewriter after a delay
setTimeout(typeWriter, 1000);

// Track cursor activity
let lastMouseMove = Date.now();

document.addEventListener('mousemove', (e) => {
    targetT = e.clientX / W;
    targetT = Math.max(0, Math.min(1, targetT));
    lastMouseMove = Date.now();
});

// Auto-denoising when idle: slow, one step per second (like real inference)
let pauseUntil = 0;  // Timestamp to pause until after completing

setInterval(() => {
    const idleTime = Date.now() - lastMouseMove;
    const now = Date.now();

    // Skip if in pause period (showing completed pattern)
    if (now < pauseUntil) return;

    if (idleTime > 3000) {  // 3 seconds of no cursor movement
        // One denoising step (slow, natural pace)
        targetT += 0.02;  // 2% per second = ~50 steps to complete

        // When fully denoised, pause for 5 seconds then reset
        if (targetT >= 1) {
            targetT = 1;  // Clamp to 1
            pauseUntil = now + 5000;  // Pause 5 seconds
            setTimeout(() => { targetT = 0; }, 5000);  // Reset after pause
        }
    }
}, 1000);  // One step per second - natural inference pace

function animate() {
    t += (targetT - t) * 0.04;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H);

    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;
    const opacity = Math.max(0, 1 - scrollY / heroHeight);

    if (opacity > 0) {
        ctx.globalAlpha = opacity;

        for (const p of particles) {
            const x = centerX + ((1 - t) * p.nx + t * p.tx) * scale;
            const y = centerY + ((1 - t) * p.ny + t * p.ty) * scale;
            const noiseBrightness = 0.28 + Math.random() * 0.18;
            const brightness = (1 - t) * noiseBrightness + t * p.b;
            const alpha = 0.35 + t * 0.55;
            const gray = Math.floor(brightness * 255);

            ctx.beginPath();
            ctx.arc(x, y, 0.55, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${gray},${gray},${gray},${alpha})`;
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    }

    // Update Flow Matching HUD
    const sigma = (1 - t).toFixed(2); // σ = 1-t (noise level as decimal)
    const steps = Math.floor(t * 50);
    document.getElementById('time-display').innerText = `t=${t.toFixed(2)}`;
    document.getElementById('step-count').innerText = `${steps}/50`;
    document.getElementById('noise-level').innerText = sigma;
    document.getElementById('progress-fill').style.width = `${t * 100}%`;

    // Terminal init - visible when in hero section
    const terminalInit = document.getElementById('terminal-init');
    if (terminalInit) {
        terminalInit.style.opacity = opacity;
    }

    // Fade out control panel when scrolling past hero
    const controlPanel = document.querySelector('.control-panel');
    if (controlPanel) {
        controlPanel.style.opacity = opacity;
        controlPanel.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
    }

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resizeCanvas);
animate();

// Smooth scroll for nav links
document.querySelectorAll('nav a, .hero-actions a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
    });
});
