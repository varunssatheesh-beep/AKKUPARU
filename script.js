// ===== PARTICLES (Hero System) =====
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
    const label = document.querySelector('.countdown-label');
    if (label) label.textContent = '🎉 The celebrations have begun!';
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

// ===== SMOOTH NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== ENGAGEMENT GALLERY SLIDER =====
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
  const INTERVAL = 4500;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
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

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => { goTo(+dot.dataset.idx); startAuto(); });
  });

  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 45) dx < 0 ? next() : prev();
    startAuto();
  }, { passive: true });

  const wrapper = track.closest('.eng-slider-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAuto);
    wrapper.addEventListener('mouseleave', startAuto);
  }

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
  video.addEventListener('error', () => { placeholder.style.display = 'flex'; });
  if (video.readyState >= 1) hidePlaceholder();
})();

// ===== CUSTOM LUXURY CURSOR =====
(function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor) return;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  const morphTriggers = 'a, button, input[type="submit"], textarea, input[type="text"], .eng-arrow, .eng-dot, .event-map-btn, .directions-btn, .guestbook-close';
  document.querySelectorAll(morphTriggers).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('morph-lotus'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('morph-lotus'));
  });
})();

// ===== MARQUEE SCROLL SPEED ACCELERATION =====
(function initMarqueeVelocity() {
  const marqueeTop = document.getElementById('marqueeTop');
  const marqueeBottom = document.getElementById('marqueeBottom');
  if (!marqueeTop || !marqueeBottom) return;

  let lastScrollTop = 0;
  let velocityTimeout = null;

  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const diff = Math.abs(st - lastScrollTop);
    lastScrollTop = st <= 0 ? 0 : st;

    // Map velocity to speed factor
    const factor = Math.min(diff * 0.15, 10);
    const speedTop = Math.max(5, 25 - factor);
    const speedBottom = Math.max(5, 25 - factor);

    marqueeTop.style.animationDuration = `${speedTop}s`;
    marqueeBottom.style.animationDuration = `${speedBottom}s`;

    clearTimeout(velocityTimeout);
    velocityTimeout = setTimeout(() => {
      marqueeTop.style.animationDuration = '25s';
      marqueeBottom.style.animationDuration = '25s';
    }, 150);
  });
})();

// ===== TIMELINE PROGRESS & VIEWPORT HIGHLIGHTER =====
(function initTimelineTracker() {
  const progressLine = document.getElementById('timelineProgress');
  const timelineContainer = document.querySelector('.timeline-container');
  const cards = document.querySelectorAll('.timeline-card');

  if (!timelineContainer) return;

  window.addEventListener('scroll', () => {
    const rect = timelineContainer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const triggerY = viewportHeight / 2;
    
    let scrolledVal = triggerY - rect.top;
    let percent = (scrolledVal / rect.height) * 100;
    percent = Math.max(0, Math.min(100, percent));
    
    if (progressLine) progressLine.style.height = `${percent}%`;

    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.top + cardRect.height / 2;
      
      if (Math.abs(cardCenter - triggerY) < 140) {
        card.classList.add('timeline-highlight');
      } else {
        card.classList.remove('timeline-highlight');
      }
    });
  });
})();

// ===== 3D TILT EFFECT =====
(function init3DTilt() {
  const card = document.getElementById('qrCardTilt');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;
    
    const tiltX = (py - 0.5) * -12;
    const tiltY = (px - 0.5) * 12;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
})();

// ===== CLOUDFLARE DATABASE D1 & GUEST BOOK MODAL =====
(function initGuestBook() {
  const openBtn = document.getElementById('openGuestBook');
  const closeBtn = document.getElementById('closeGuestBook');
  const modal = document.getElementById('guestBookModal');
  const form = document.getElementById('wishesForm');
  const display = document.getElementById('wishesDisplay');

  if (!modal || !display) return;

  // Open Modal
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('open');
    });
  }

  // Close Modal
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  // Fetch blessings from API route
  async function loadBlessings() {
    try {
      const response = await fetch('/api/blessings');
      const data = await response.json();
      
      display.innerHTML = ''; // clear initial list
      
      if (data.blessings && data.blessings.length > 0) {
        data.blessings.forEach(renderWish);
      } else {
        display.innerHTML = `
          <div class="wish-card" style="text-align:center;">
            <p class="wish-msg">Be the first to leave a blessing! 🪷</p>
          </div>
        `;
      }
    } catch (err) {
      console.error("Failed to load blessings from database:", err);
      // Fallback local display
      display.innerHTML = `
        <div class="wish-card">
          <div class="wish-name">🌸 Adv. Satheesh Kumar S &amp; Mrs. Smitha S Nair</div>
          <div class="wish-relation">Parents of the Bride</div>
          <div class="wish-msg">"Wishing our dearest children Varsha and Akhil a beautiful journey ahead. May God shower you with endless happiness. 🪷"</div>
        </div>
      `;
    }
  }

  function renderWish({ name, relation, message }) {
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `
      <div class="wish-name">🌸 ${escapeHtml(name)}</div>
      <div class="wish-relation">${relation ? escapeHtml(relation) : 'Well Wisher'}</div>
      <div class="wish-msg">"${escapeHtml(message)}"</div>
    `;
    display.prepend(card);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  // Submit Blessing to Database
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const nameVal = document.getElementById('wisher-name').value.trim();
      const relationVal = document.getElementById('wisher-relation').value.trim();
      const msgVal = document.getElementById('wisher-message').value.trim();
      
      if (!nameVal || !msgVal) return;

      const submitBtn = document.getElementById('submitWish');
      if (submitBtn) submitBtn.textContent = '🕊️ Leaving Blessing...';

      try {
        const response = await fetch('/api/blessings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: nameVal,
            relation: relationVal,
            message: msgVal
          })
        });

        const resData = await response.json();
        
        if (response.ok && resData.success) {
          // Prepend new blessing
          renderWish(resData.blessing);
          
          // Trigger floating lotus petal burst animation
          triggerLotusBurst();

          // Reset and close
          form.reset();
          modal.classList.remove('open');
        } else {
          alert("Error: " + (resData.error || "Failed to submit blessing"));
        }
      } catch (err) {
        console.error("API error:", err);
        // Fallback local mock save if offline/not configured
        renderWish({ name: nameVal, relation: relationVal, message: msgVal });
        triggerLotusBurst();
        form.reset();
        modal.classList.remove('open');
      } finally {
        if (submitBtn) submitBtn.textContent = '🪷 Leave Blessings 🪷';
      }
    });
  }

  // Floating lotus burst particle effect
  function triggerLotusBurst() {
    const petals = ['🪷', '🌸', '✨', '💕', '🪷'];
    const burstCount = 35;
    
    for (let i = 0; i < burstCount; i++) {
      const petal = document.createElement('div');
      petal.className = 'lotus-petal-particle';
      petal.textContent = petals[Math.floor(Math.random() * petals.length)];
      
      // Random coordinates starting from top center
      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.top = '-50px';
      
      const duration = Math.random() * 3 + 2; // 2-5 seconds
      petal.style.animationDuration = duration + 's';
      petal.style.animationDelay = Math.random() * 0.5 + 's';
      
      // Random scale & rotation
      const scale = Math.random() * 0.8 + 0.6;
      petal.style.transform = `scale(${scale})`;
      
      document.body.appendChild(petal);
      
      // Remove element when done
      setTimeout(() => {
        petal.remove();
      }, (duration + 1) * 1000);
    }
  }

  // Load blessings on start
  loadBlessings();
})();

console.log('🪷 The Digital Temple Wedding Site Loaded successfully 🪷');
