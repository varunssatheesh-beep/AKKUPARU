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

// ===== ENGAGEMENT GALLERY SLIDER (Horizontal Slide) =====
(function initEngagementSlider() {
  const track   = document.getElementById('engSlider');
  const dotsWrap = document.getElementById('engDots');
  const prevBtn  = document.getElementById('engPrev');
  const nextBtn  = document.getElementById('engNext');
  const counter  = document.getElementById('engCounter');
  if (!track) return;

  const slides   = track.querySelectorAll('.eng-slide');
  const dots     = dotsWrap ? dotsWrap.querySelectorAll('.eng-dot') : [];
  const total    = slides.length;
  let current    = 0;
  let autoTimer  = null;
  const INTERVAL = 4000;

  function goTo(idx) {
    // clamp with wrap
    current = (idx + total) % total;
    // Slide the track
    track.style.transform = `translateX(-${current * 100}%)`;
    // Update dots
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    // Update counter
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, INTERVAL);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  // Arrows
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  // Dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => { goTo(+dot.dataset.idx); startAuto(); });
  });

  // Touch / swipe
  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 45) dx < 0 ? next() : prev();
    startAuto();
  }, { passive: true });

  // Pause on hover (desktop)
  const wrapper = track.closest('.eng-slider-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAuto);
    wrapper.addEventListener('mouseleave', startAuto);
  }

  // Init
  goTo(0);
  startAuto();
})();




// ===== VIDEO PLACEHOLDER CHECK =====
(function checkVideo() {
  const video = document.getElementById('engagementVideo');
  const placeholder = document.getElementById('videoPlaceholder');
  if (!video || !placeholder) return;
  
  function hidePlaceholder() {
    placeholder.style.display = 'none';
  }
  
  video.addEventListener('canplay', hidePlaceholder);
  video.addEventListener('loadeddata', hidePlaceholder);
  video.addEventListener('play', hidePlaceholder);
  
  video.addEventListener('error', () => {
    placeholder.style.display = 'flex';
  });
  
  // If already loaded
  if (video.readyState >= 1) {
    hidePlaceholder();
  }
})();

