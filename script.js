// ===== PARTICLES =====
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.width = p.style.height = (Math.random() * 4 + 2) + 'px';
    p.style.animationDuration = (Math.random() * 10 + 8) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.opacity = Math.random() * 0.7;
    container.appendChild(p);
  }
})();

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
  const wedding = new Date('2026-10-25T10:30:00+05:30').getTime();
  const now = new Date().getTime();
  const diff = wedding - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent = '00';
    document.getElementById('cd-secs').textContent = '00';
    document.querySelector('.countdown-label').textContent = '🎉 The celebrations have begun!';
    return;
  }
  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent  = String(days).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2,'0');
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.textContent = '☰';
    });
  });
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== SCROLL DOWN ARROW =====
const scrollDown = document.getElementById('scrollDown');
if (scrollDown) {
  scrollDown.addEventListener('click', () => {
    document.getElementById('love-story')?.scrollIntoView({ behavior: 'smooth' });
  });
}

// ===== WISHES FORM =====
const wishesForm = document.getElementById('wishesForm');
const wishesDisplay = document.getElementById('wishesDisplay');

// Default wishes
const defaultWishes = [
  { name: 'Family & Friends', relation: 'With Love', msg: 'Wishing Dr. Varsha and Akhil a lifetime of love, laughter, and togetherness. May your bond grow stronger with every passing day. 🪷' }
];

defaultWishes.forEach(w => renderWish(w));

function renderWish({ name, relation, msg }) {
  const card = document.createElement('div');
  card.className = 'wish-card';
  card.innerHTML = `
    <div class="wish-name">🌸 ${name}</div>
    <div class="wish-relation">${relation || ''}</div>
    <div class="wish-msg">"${msg}"</div>
  `;
  wishesDisplay.prepend(card);
}

if (wishesForm) {
  wishesForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name     = document.getElementById('wisher-name').value.trim();
    const relation = document.getElementById('wisher-relation').value.trim();
    const msg      = document.getElementById('wisher-message').value.trim();
    if (!name || !msg) return;

    renderWish({ name, relation, msg });
    wishesForm.reset();

    const btn = document.getElementById('submitWish');
    btn.textContent = '✅ Blessings Sent!';
    btn.style.background = 'linear-gradient(135deg, #2e7d32, #388e3c)';
    setTimeout(() => {
      btn.textContent = '🪷 Send Blessings 🪷';
      btn.style.background = '';
    }, 2500);
  });
}

// ===== SMOOTH NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

console.log('🪷 Varsha & Akhil Wedding Website Loaded 🪷');

// ===== WATER FOUNTAIN ANIMATION =====
(function initFountain() {
  const canvas = document.getElementById('fountainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, CX;
  const particles = [];
  const ripples = [];
  let frame = 0;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    CX = W / 2;
  }
  resize();
  window.addEventListener('resize', resize);

  // --- Fountain geometry ---
  const PILLAR_W = 22;
  function tiers() {
    return {
      topY:  H * 0.08,   // top bowl Y
      midY:  H * 0.38,   // mid bowl Y
      poolY: H * 0.72,   // pool surface Y
      poolRX: W * 0.34,
      poolRY: H * 0.07,
      midRX:  W * 0.16,
      midRY:  H * 0.04,
      topRX:  W * 0.08,
      topRY:  H * 0.025
    };
  }

  // --- Particle spawn ---
  function spawnJet(x, y, vx, vy, hue, size) {
    particles.push({ x, y, vx, vy, life: 1, size, hue });
  }

  function spawnParticles() {
    const t = tiers();
    // Main top jet — shoots up from top bowl
    for (let i = 0; i < 2; i++) {
      spawnJet(CX + (Math.random() - 0.5) * 10,
               t.topY + t.topRY,
               (Math.random() - 0.5) * 0.8,
               -(Math.random() * 5 + 4.5),
               195, Math.random() * 2.5 + 1.5);
    }
    // Arc jets from top bowl
    [-1, 1].forEach(dir => {
      if (Math.random() < 0.55) {
        spawnJet(CX + dir * t.topRX * 0.7,
                 t.topY + t.topRY,
                 dir * (Math.random() * 2.2 + 1.2),
                 -(Math.random() * 3.5 + 2),
                 200, Math.random() * 2 + 1);
      }
    });
    // Mid bowl arc jets (cascading outward)
    [-1, 1].forEach(dir => {
      if (Math.random() < 0.5) {
        spawnJet(CX + dir * t.midRX * 0.8,
                 t.midY + t.midRY,
                 dir * (Math.random() * 3.5 + 2.0),
                 -(Math.random() * 2.5 + 1),
                 205, Math.random() * 2 + 1);
      }
    });
    // Curtain drip from mid bowl edges
    for (let i = 0; i < 2; i++) {
      const x = CX + (Math.random() * 2 - 1) * t.midRX;
      spawnJet(x, t.midY + t.midRY * 0.5,
               (Math.random() - 0.5) * 0.6,
               Math.random() * 1.5 + 1.5,
               210, Math.random() * 1.5 + 0.8);
    }
  }

  function updateParticles() {
    const t = tiers();
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.17; p.vx *= 0.995;
      p.life -= 0.013;
      // Hit mid bowl — splash & settle
      if (p.vy > 0 && p.y >= t.midY - t.midRY && p.y < t.midY + t.midRY + 4
          && Math.abs(p.x - CX) < t.midRX && p.vy > 1) {
        createSplash(p.x, t.midY, 3);
        ripples.push({ x: p.x, y: t.midY, r: 2, maxR: t.midRX * 0.6, life: 1 });
        p.life = 0;
      }
      // Hit pool
      if (p.y >= t.poolY && p.vy > 0) {
        createSplash(p.x, t.poolY, 4);
        ripples.push({ x: p.x, y: t.poolY, r: 2, maxR: t.poolRX * 0.7, life: 1 });
        p.life = 0;
      }
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function createSplash(x, y, count) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI;
      const s = Math.random() * 2.5 + 0.5;
      particles.push({
        x, y,
        vx: Math.cos(a) * s * (Math.random() > 0.5 ? 1 : -1),
        vy: -(Math.random() * 2.5 + 0.5),
        life: Math.random() * 0.4 + 0.15,
        size: Math.random() * 1.5 + 0.5,
        hue: 200
      });
    }
  }

  // --- Draw fountain structure ---
  function drawStructure() {
    const t = tiers();
    ctx.save();

    // Pool (base)
    const poolGrad = ctx.createRadialGradient(CX, t.poolY, 0, CX, t.poolY, t.poolRX);
    poolGrad.addColorStop(0,   'rgba(80,180,255,0.28)');
    poolGrad.addColorStop(0.6, 'rgba(30,100,180,0.15)');
    poolGrad.addColorStop(1,   'rgba(10,40,100,0.05)');
    ctx.fillStyle = poolGrad;
    ctx.beginPath();
    ctx.ellipse(CX, t.poolY, t.poolRX, t.poolRY, 0, 0, Math.PI * 2);
    ctx.fill();
    // Pool rim glow
    ctx.strokeStyle = 'rgba(201,168,76,0.55)';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(201,168,76,0.4)';
    ctx.beginPath();
    ctx.ellipse(CX, t.poolY, t.poolRX, t.poolRY, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Pillar from pool to mid
    const pilGrad = ctx.createLinearGradient(CX - PILLAR_W, 0, CX + PILLAR_W, 0);
    pilGrad.addColorStop(0,   'rgba(80,10,20,0.9)');
    pilGrad.addColorStop(0.4, 'rgba(201,168,76,0.55)');
    pilGrad.addColorStop(1,   'rgba(80,10,20,0.9)');
    ctx.fillStyle = pilGrad;
    ctx.fillRect(CX - PILLAR_W / 2, t.midY + t.midRY, PILLAR_W, t.poolY - t.midY - t.midRY);

    // Mid bowl
    const midGrad = ctx.createRadialGradient(CX, t.midY, 0, CX, t.midY, t.midRX);
    midGrad.addColorStop(0,   'rgba(60,160,240,0.25)');
    midGrad.addColorStop(1,   'rgba(20,70,160,0.08)');
    ctx.fillStyle = midGrad;
    ctx.beginPath();
    ctx.ellipse(CX, t.midY, t.midRX, t.midRY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(201,168,76,0.6)';
    ctx.lineWidth = 2; ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(201,168,76,0.35)';
    ctx.stroke(); ctx.shadowBlur = 0;

    // Pillar from mid to top
    ctx.fillStyle = pilGrad;
    ctx.fillRect(CX - PILLAR_W / 2 * 0.7, t.topY + t.topRY, PILLAR_W * 0.7, t.midY - t.topY - t.topRY);

    // Top bowl
    const topGrad = ctx.createRadialGradient(CX, t.topY, 0, CX, t.topY, t.topRX);
    topGrad.addColorStop(0, 'rgba(160,220,255,0.35)');
    topGrad.addColorStop(1, 'rgba(40,120,220,0.1)');
    ctx.fillStyle = topGrad;
    ctx.beginPath();
    ctx.ellipse(CX, t.topY, t.topRX, t.topRY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(230,201,122,0.85)';
    ctx.lineWidth = 2.5; ctx.shadowBlur = 16; ctx.shadowColor = 'rgba(201,168,76,0.6)';
    ctx.stroke(); ctx.shadowBlur = 0;

    // Decorative lotus on top
    ctx.font = `${Math.min(W * 0.05, 36)}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🪷', CX, t.topY - t.topRY - 20);

    ctx.restore();
  }

  // --- Draw water ripples ---
  function drawRipples() {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      ctx.save();
      ctx.strokeStyle = `rgba(160,220,255,${r.life * 0.45})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, r.r * 3, r.r * 0.8, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      r.r += r.maxR / 40;
      r.life -= 0.035;
      if (r.life <= 0) ripples.splice(i, 1);
    }
  }

  // --- Draw water particles ---
  function drawParticles() {
    particles.forEach(p => {
      const a = Math.max(0, p.life);
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${p.hue},100%,72%,${a * 0.8})`;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.2);
      g.addColorStop(0, `hsla(${p.hue},100%,92%,${a})`);
      g.addColorStop(0.5, `hsla(${p.hue},85%,70%,${a * 0.75})`);
      g.addColorStop(1, `hsla(${p.hue},70%,50%,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // --- Animated pool shimmer ---
  function drawPoolShimmer() {
    const t = tiers();
    const shimCount = 6;
    for (let i = 0; i < shimCount; i++) {
      const phase = (frame * 0.03 + i * (Math.PI * 2 / shimCount));
      const sx = CX + Math.cos(phase) * t.poolRX * 0.6;
      const sy = t.poolY + Math.sin(phase) * t.poolRY * 0.6;
      ctx.save();
      ctx.globalAlpha = 0.3 + Math.sin(frame * 0.04 + i) * 0.15;
      ctx.fillStyle = 'rgba(180,230,255,0.5)';
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // --- Main loop ---
  function loop() {
    ctx.clearRect(0, 0, W, H);
    frame++;
    if (frame % 2 === 0) spawnParticles();
    updateParticles();
    drawStructure();
    drawRipples();
    drawParticles();
    drawPoolShimmer();
    requestAnimationFrame(loop);
  }
  loop();
})();

// ===== VIDEO PLACEHOLDER CHECK =====
(function checkVideo() {
  const video = document.getElementById('engagementVideo');
  const placeholder = document.getElementById('videoPlaceholder');
  if (!video || !placeholder) return;
  video.addEventListener('error', () => { placeholder.style.display = 'flex'; });
  video.addEventListener('loadeddata', () => { placeholder.style.display = 'none'; });
  if (video.readyState === 0) placeholder.style.display = 'flex';
})();

