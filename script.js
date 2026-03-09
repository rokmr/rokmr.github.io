// ============================================
// Canvas Animation - Lorenz Attractor Particle System
// ============================================
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

// Lorenz Butterfly pattern
function generateButterfly() {
    const points = [];

    const sigma = 10, rho = 28, beta = 8 / 3;
    const dt = 0.004;
    let x = 0.1, y = 0, z = 0;

    // Settle to attractor
    for (let i = 0; i < 2500; i++) {
        const dx = sigma * (y - x);
        const dy = x * (rho - z) - y;
        const dz = x * y - beta * z;
        x += dx * dt; y += dy * dt; z += dz * dt;
    }

    const lorenzScale = 0.035;
    const butterflyOffsetY = 0;

    // Sample butterfly trajectory (denser - 30000 points)
    for (let i = 0; i < 30000; i++) {
        const dx = sigma * (y - x);
        const dy = x * (rho - z) - y;
        const dz = x * y - beta * z;
        x += dx * dt; y += dy * dt; z += dz * dt;

        const nx = x * lorenzScale;
        const ny = butterflyOffsetY - (z - 25) * lorenzScale;

        if (nx >= -0.85 && nx <= 0.85 && ny >= -0.85 && ny <= 0.85) {
            points.push({ x: nx, y: ny, b: 0.8 });
        }
    }

    return points;
}

const particleCount = 16000;
const targetPoints = generateButterfly();

// Flat typed arrays — cache-friendly, no GC, no object overhead
// Layout: [nx, ny, tx, ty, b] per particle → 5 floats each
const P = new Float32Array(particleCount * 5);
for (let i = 0; i < particleCount; i++) {
    const noiseR = Math.sqrt(-2 * Math.log(Math.random())) * 0.55;
    const noiseTheta = Math.random() * Math.PI * 2;
    const off = i * 5;

    P[off]     = noiseR * Math.cos(noiseTheta); // nx
    P[off + 1] = noiseR * Math.sin(noiseTheta); // ny

    if (i < targetPoints.length) {
        const tp = targetPoints[i];
        P[off + 2] = tp.x;  // tx
        P[off + 3] = tp.y;  // ty
        P[off + 4] = tp.b;  // brightness
    } else {
        const angle = Math.random() * Math.PI * 2;
        const r = 1.1 + Math.random() * 0.25;
        P[off + 2] = Math.cos(angle) * r;
        P[off + 3] = Math.sin(angle) * r;
        P[off + 4] = 0.12;
    }
}

// Sort particles by target brightness so similar colors are adjacent.
// This means fillStyle only changes ~32 times per frame instead of thousands.
{
    const idx = new Uint16Array(particleCount);
    for (let i = 0; i < particleCount; i++) idx[i] = i;
    idx.sort((a, b) => P[a * 5 + 4] - P[b * 5 + 4]);
    const tmp = new Float32Array(particleCount * 5);
    for (let i = 0; i < particleCount; i++) {
        const src = idx[i] * 5, dst = i * 5;
        tmp[dst] = P[src]; tmp[dst+1] = P[src+1]; tmp[dst+2] = P[src+2];
        tmp[dst+3] = P[src+3]; tmp[dst+4] = P[src+4];
    }
    P.set(tmp);
}

// Keep object array reference for vector field binning (read-only, init only)
const particles = [];
for (let i = 0; i < particleCount; i++) {
    const off = i * 5;
    particles.push({ nx: P[off], ny: P[off+1], tx: P[off+2], ty: P[off+3], b: P[off+4] });
}

// Precompute grid-based vector field (flow matching style)
const vfGridN = 18;  // 18x18 = 324 arrows
const vfRange = 0.95; // normalized coordinate range
const vfCellSize = (vfRange * 2) / vfGridN;
const vectorField = [];

// Bin particles into grid cells, average their velocity (target - noise)
const vfBins = new Array(vfGridN * vfGridN).fill(null).map(() => ({ vx: 0, vy: 0, n: 0 }));

for (const p of particles) {
    // Bin by midpoint of trajectory
    const mx = (p.nx + p.tx) / 2;
    const my = (p.ny + p.ty) / 2;
    const gi = Math.floor((mx + vfRange) / (vfRange * 2) * vfGridN);
    const gj = Math.floor((my + vfRange) / (vfRange * 2) * vfGridN);
    if (gi >= 0 && gi < vfGridN && gj >= 0 && gj < vfGridN) {
        const bin = vfBins[gj * vfGridN + gi];
        bin.vx += p.tx - p.nx;
        bin.vy += p.ty - p.ny;
        bin.n++;
    }
}

for (let j = 0; j < vfGridN; j++) {
    for (let i = 0; i < vfGridN; i++) {
        const bin = vfBins[j * vfGridN + i];
        const cx = -vfRange + (i + 0.5) * vfCellSize;  // normalized center
        const cy = -vfRange + (j + 0.5) * vfCellSize;
        if (bin.n > 0) {
            vectorField.push({ cx, cy, vx: bin.vx / bin.n, vy: bin.vy / bin.n });
        }
    }
}

let t = 0.8;
let targetT = 0.8;

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

// Auto-denoising: smooth continuous movement in animate loop
let pauseUntil = 0;
let lastFrameTime = performance.now();
let autoPlay = true;  // start immediately on load

// Cache DOM references once (script runs at bottom of body, elements exist)
const hudTime = document.getElementById('time-display');
const hudStep = document.getElementById('step-count');
const hudNoise = document.getElementById('noise-level');
const hudProgress = document.getElementById('progress-fill');
const hudTerminal = document.getElementById('terminal-init');
const hudPanel = document.querySelector('.control-panel');

function animate() {
    const now = performance.now();
    const dt = (now - lastFrameTime) / 1000;  // delta in seconds
    lastFrameTime = now;

    // Smooth auto-denoise
    const idleTime = Date.now() - lastMouseMove;
    if ((autoPlay || idleTime > 3000) && Date.now() >= pauseUntil) {
        targetT += dt * 0.04;  // 4% per second — 0.8→1.0 takes ~5 seconds

        if (targetT >= 1) {
            targetT = 1;
            autoPlay = false;
            pauseUntil = Date.now() + 5000;
            setTimeout(() => { targetT = 0.8; }, 5000);  // loop back
        }
    }

    t += (targetT - t) * 0.06;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H);

    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;
    const opacity = Math.max(0, 1 - scrollY / heroHeight);

    if (opacity > 0) {
        ctx.globalAlpha = opacity;

        // Draw subtle grid behind particles (batched into 2 stroke calls)
        const gridExtent = scale * 0.95;
        const gridLines = 8;
        const gridStep = (gridExtent * 2) / gridLines;
        const gridAlpha = 0.04 + t * 0.025;

        const gridPath = new Path2D();
        for (let i = 0; i <= gridLines; i++) {
            const gx = centerX - gridExtent + i * gridStep;
            gridPath.moveTo(gx, centerY - gridExtent);
            gridPath.lineTo(gx, centerY + gridExtent);
            const gy = centerY - gridExtent + i * gridStep;
            gridPath.moveTo(centerX - gridExtent, gy);
            gridPath.lineTo(centerX + gridExtent, gy);
        }
        ctx.strokeStyle = `rgba(255,255,255,${gridAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke(gridPath);

        // Axes (slightly brighter)
        const axesPath = new Path2D();
        axesPath.moveTo(centerX - gridExtent, centerY);
        axesPath.lineTo(centerX + gridExtent, centerY);
        axesPath.moveTo(centerX, centerY - gridExtent);
        axesPath.lineTo(centerX, centerY + gridExtent);
        ctx.strokeStyle = `rgba(255,255,255,${gridAlpha * 1.8})`;
        ctx.lineWidth = 0.6;
        ctx.stroke(axesPath);

        // Draw particles — fillRect is 10-20x faster than arc() at sub-pixel sizes.
        // Original used arc(r=0.55) which is a circle of area ~0.95 sq px with
        // soft anti-aliased edges. A 0.8×0.8 square (0.64 sq px) with slightly
        // lower alpha matches that visual weight.
        const oneMinusT = 1 - t;
        const alphaBase = 0.28 + t * 0.45;   // was 0.35+t*0.55 — softer to match original
        const tGreenR = 1 - t * 0.15;
        const tGreenB = 1 - t * 0.2;
        const pSize = 0.8;                    // was 1.1 — smaller to match circle visual weight
        const pHalf = pSize * 0.5;

        // Precompute 32 bucket color strings (avoids per-particle string alloc)
        const NBUCKETS = 32;
        const bucketColors = new Array(NBUCKETS);
        for (let bi = 0; bi < NBUCKETS; bi++) {
            const gray = (bi / (NBUCKETS - 1)) * 255;
            const r = (gray * tGreenR) | 0;
            const g = gray | 0;
            const b = (gray * tGreenB) | 0;
            bucketColors[bi] = `rgba(${r},${g},${b},${alphaBase.toFixed(2)})`;
        }

        let prevBucket = -1;
        for (let i = 0; i < particleCount; i++) {
            const off = i * 5;
            const x = centerX + (oneMinusT * P[off] + t * P[off + 2]) * scale;
            const y = centerY + (oneMinusT * P[off + 1] + t * P[off + 3]) * scale;
            const brightness = oneMinusT * (0.28 + Math.random() * 0.18) + t * P[off + 4];
            const bi = (brightness * NBUCKETS) | 0;  // fast floor via bitwise OR
            const clamped = bi < 0 ? 0 : bi >= NBUCKETS ? NBUCKETS - 1 : bi;
            if (clamped !== prevBucket) {
                ctx.fillStyle = bucketColors[clamped];
                prevBucket = clamped;
            }
            ctx.fillRect(x - pHalf, y - pHalf, pSize, pSize);
        }

        // Draw grid-based vector field (flow matching style)
        const arrowAlpha = Math.max(0, (1 - t) * 0.45);
        if (arrowAlpha > 0.01) {
            const maxArrowLen = scale * vfCellSize * 0.8;  // arrow fits within cell
            const headLen = 3;

            ctx.strokeStyle = `rgba(74, 222, 128, ${arrowAlpha})`;
            ctx.fillStyle = `rgba(74, 222, 128, ${arrowAlpha})`;
            ctx.lineWidth = 0.8;

            const linePath = new Path2D();
            const headPath = new Path2D();

            for (const v of vectorField) {
                // Arrow origin moves with flow: interpolate between noise-center and target-center
                const ox = centerX + v.cx * scale;
                const oy = centerY + v.cy * scale;

                // Velocity direction
                const vx = v.vx * scale;
                const vy = v.vy * scale;
                const mag = Math.sqrt(vx * vx + vy * vy);
                if (mag < 0.5) continue;

                // Arrow length proportional to magnitude, capped
                const len = Math.min(mag * 0.18, maxArrowLen);
                const nx = vx / mag;
                const ny = vy / mag;

                const ex = ox + nx * len;
                const ey = oy + ny * len;

                linePath.moveTo(ox, oy);
                linePath.lineTo(ex, ey);

                headPath.moveTo(ex, ey);
                headPath.lineTo(ex - nx * headLen - ny * headLen * 0.4, ey - ny * headLen + nx * headLen * 0.4);
                headPath.lineTo(ex - nx * headLen + ny * headLen * 0.4, ey - ny * headLen - nx * headLen * 0.4);
                headPath.closePath();
            }

            ctx.stroke(linePath);
            ctx.fill(headPath);
        }

        ctx.globalAlpha = 1;
    }

    // Update Flow Matching HUD (cached DOM refs outside loop)
    hudTime.textContent = `t = ${t.toFixed(2)} `;
    hudStep.textContent = `${Math.round(t * 49) + 1}/50`;
    hudNoise.textContent = (1 - t).toFixed(2);
    hudProgress.style.width = `${t * 100}%`;

    if (hudTerminal) hudTerminal.style.opacity = opacity;
    if (hudPanel) {
        hudPanel.style.opacity = opacity;
        hudPanel.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
    }

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resizeCanvas);
animate();

// Smooth scroll for nav links (desktop + mobile)
document.querySelectorAll('nav a, .mobile-nav a[href^="#"], .hero-actions a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            // Close mobile menu if open
            closeMobileMenu();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================
// Mobile Hamburger Menu
// ============================================
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.mobile-nav');
const mobileOverlay = document.querySelector('.mobile-nav-overlay');

function openMobileMenu() {
    mobileMenuBtn.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.classList.add('menu-open');
}

function closeMobileMenu() {
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileMenuBtn.classList.contains('active');
        isOpen ? closeMobileMenu() : openMobileMenu();
    });
}

if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
        closeMobileMenu();
    }
});

// ============================================
// Section Reveal on Scroll (IntersectionObserver)
// ============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    document.querySelectorAll('main section').forEach(el => {
        el.classList.add('section-reveal');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.section-reveal').forEach(el => {
        revealObserver.observe(el);
    });
}

// ============================================
// Footer Year (replaces document.write)
// ============================================
const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = new Date().getFullYear();

// ============================================
// Back to Top Button
// ============================================
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// Auto-fetch Citation Count (Semantic Scholar API)
// ============================================
fetch('https://api.semanticscholar.org/graph/v1/paper/arXiv:2407.08041?fields=citationCount')
    .then(r => r.json())
    .then(data => {
        const count = data.citationCount;
        const link = document.getElementById('tacle-cite-link');
        if (link) {
            const fallback = parseInt(link.dataset.fallback, 10) || 0;
            if (count > fallback) {
                link.textContent = `Cited by ${count}`;
            }
        }
    })
    .catch(() => {});  // silent fail — keeps fallback count
