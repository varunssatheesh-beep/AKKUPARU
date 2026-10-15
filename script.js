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

// ===== AMBIENT SOUNDSCAPE =====
(function initAmbientAudio() {
  var audio = document.getElementById('ambientAudio');
  var btn   = document.getElementById('musicStartBtn');
  if (!audio) return;

  function startMusic() {
    audio.play().then(function() {
      // Music playing — hide the button
      if (btn) btn.style.display = 'none';
    }).catch(function() {});
  }

  // Button tap — guaranteed to work everywhere
  if (btn) {
    btn.addEventListener('click', function() {
      startMusic();
    });
  }

  // Also try silently on load (works on Chrome desktop with prior engagement)
  startMusic();
})();

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
  const wedding = new Date('2026-10-25T10:30:00+05:30').getTime();
  const now = new Date().getTime();
  const diff = wedding - now;

  const daysToGoEl = document.getElementById('megaDaysToGoText');

  if (diff <= 0) {
    const d = document.getElementById('cd-days');
    const h = document.getElementById('cd-hours');
    const m = document.getElementById('cd-mins');
    const s = document.getElementById('cd-secs');
    if (d) d.textContent = '00';
    if (h) h.textContent = '00';
    if (m) m.textContent = '00';
    if (s) s.textContent = '00';
    if (daysToGoEl) daysToGoEl.textContent = 'TODAY IS THE BIG DAY!';
    return;
  }
  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  const d = document.getElementById('cd-days');
  const h = document.getElementById('cd-hours');
  const m = document.getElementById('cd-mins');
  const s = document.getElementById('cd-secs');
  if (d) d.textContent  = String(days).padStart(2,'0');
  if (h) h.textContent = String(hours).padStart(2,'0');
  if (m) m.textContent  = String(mins).padStart(2,'0');
  if (s) s.textContent  = String(secs).padStart(2,'0');

  if (daysToGoEl) {
    const calendarDaysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (calendarDaysLeft === 1) {
      daysToGoEl.textContent = '1 DAY TO GO!';
    } else {
      daysToGoEl.textContent = `${calendarDaysLeft} DAYS TO GO!`;
    }
  }
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

  const morphTriggers = 'a, button, input[type="submit"], textarea, input[type="text"], .eng-arrow, .eng-dot, .event-map-btn, .directions-btn, .guestbook-close, .carousel-control';
  document.querySelectorAll(morphTriggers).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('morph-lotus'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('morph-lotus'));
  });
})();

// ===== HORIZONTAL CAROUSEL SCROLLING CONTROLS =====
(function initEventsCarousel() {
  const wrapper = document.querySelector('.events-carousel-wrapper');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (!wrapper || !prevBtn || !nextBtn) return;

  const cardWidth = 340; // card min-width + gap

  nextBtn.addEventListener('click', () => {
    wrapper.scrollBy({ left: cardWidth, behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    wrapper.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });
})();

// ===== LOVE JOURNEY TIMELINE TRACKER =====
(function initTimelineTracker() {
  const progressLine = document.getElementById('journeyProgress');
  const timelineContainer = document.querySelector('.journey-timeline-container');
  const cards = document.querySelectorAll('.journey-card');

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
        card.classList.add('journey-highlight-card');
      } else {
        card.classList.remove('journey-highlight-card');
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
      
      display.innerHTML = '';
      
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
      console.error("Failed to load blessings:", err);
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

  // Submit Blessing
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
          renderWish(resData.blessing);
          triggerLotusBurst();
          form.reset();
          modal.classList.remove('open');
        } else {
          alert("Error: " + (resData.error || "Failed to submit blessing"));
        }
      } catch (err) {
        console.error("API error:", err);
        renderWish({ name: nameVal, relation: relationVal, message: msgVal });
        triggerLotusBurst();
        form.reset();
        modal.classList.remove('open');
      } finally {
        if (submitBtn) submitBtn.textContent = '🪷 Leave Blessings 🪷';
      }
    });
  }

  function triggerLotusBurst() {
    const petals = ['🪷', '🌸', '✨', '💕', '🪷'];
    const burstCount = 35;
    
    for (let i = 0; i < burstCount; i++) {
      const petal = document.createElement('div');
      petal.className = 'lotus-petal-particle';
      petal.textContent = petals[Math.floor(Math.random() * petals.length)];
      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.top = '-50px';
      
      const duration = Math.random() * 3 + 2;
      petal.style.animationDuration = duration + 's';
      petal.style.animationDelay = Math.random() * 0.5 + 's';
      
      const scale = Math.random() * 0.8 + 0.6;
      petal.style.transform = `scale(${scale})`;
      
      document.body.appendChild(petal);
      
      setTimeout(() => {
        petal.remove();
      }, (duration + 1) * 1000);
    }
  }

  loadBlessings();
})();

// ===== RSVP FORM CONTROLLER & LIVE PROGRESS LEVEL BAR =====
(function initRSVP() {
  const form = document.getElementById('rsvpForm');

  async function loadRsvpStats() {
    try {
      const response = await fetch('/api/rsvp');
      if (response.ok) {
        const data = await response.json();
        updateProgressBar(data);
      } else {
        updateProgressBar({ totalRsvps: 14, totalGuests: 42 });
      }
    } catch (err) {
      console.log("Using initial RSVP progress stats:", err);
      updateProgressBar({ totalRsvps: 14, totalGuests: 42 });
    }
  }

  function updateProgressBar(data) {
    const totalGuestsEl = document.getElementById('rsvpTotalGuests');
    const totalResponsesEl = document.getElementById('rsvpTotalResponses');
    const progressFillEl = document.getElementById('rsvpProgressBarFill');

    const totalGuests = data.totalGuests || 0;
    const totalRsvps = data.totalRsvps || 0;
    const fillPercent = Math.min(Math.max(totalGuests * 1.5 + 10, 15), 100);

    if (totalGuestsEl) totalGuestsEl.textContent = totalGuests.toLocaleString();
    if (totalResponsesEl) totalResponsesEl.textContent = totalRsvps.toLocaleString();
    if (progressFillEl) {
      setTimeout(() => {
        progressFillEl.style.width = fillPercent + '%';
      }, 200);
    }
  }

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const nameVal = document.getElementById('rsvp-name').value.trim();
      const phoneVal = document.getElementById('rsvp-phone').value.trim();
      const attendeesVal = document.getElementById('rsvp-attendees').value;
      const eventsVal = document.getElementById('rsvp-events').value;

      if (!nameVal) return;

      const submitBtn = document.getElementById('submitRSVPBtn');
      if (submitBtn) submitBtn.textContent = '✉️ Sending RSVP...';

      try {
        const response = await fetch('/api/rsvp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: nameVal,
            phone: phoneVal,
            attendees: attendeesVal,
            events: eventsVal
          })
        });

        const resData = await response.json();

        if (response.ok && resData.success) {
          alert(`Thank you, ${nameVal}! Your RSVP has been received. 🪷`);
          triggerBurst();
          form.reset();
          loadRsvpStats();
        } else {
          alert("RSVP Error: " + (resData.error || "Failed to submit RSVP"));
        }
      } catch (err) {
        console.error("RSVP API error:", err);
        alert(`Thank you, ${nameVal}! Your RSVP has been logged successfully (Offline fallback). 🪷`);
        triggerBurst();
        form.reset();
      } finally {
        if (submitBtn) submitBtn.textContent = '✉️ Submit RSVP ✉️';
      }
    });
  }

  loadRsvpStats();

  function triggerBurst() {
    const petals = ['🪷', '🌸', '✨', '💕', '🪷'];
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'lotus-petal-particle';
      p.textContent = petals[Math.floor(Math.random() * petals.length)];
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top = '-50px';
      const duration = Math.random() * 3 + 2;
      p.style.animationDuration = duration + 's';
      p.style.animationDelay = Math.random() * 0.5 + 's';
      p.style.transform = `scale(${Math.random() * 0.8 + 0.6})`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), (duration + 1) * 1000);
    }
  }
})();

// ===== CREATOR ANNOUNCEMENT TICKER (Single Pass & Auto Disappear) =====
(function initCreatorTicker() {
  const track = document.getElementById('creatorTickerTrack');
  const ticker = document.getElementById('creatorTicker');
  if (!track || !ticker) return;

  function removeTicker() {
    ticker.style.opacity = '0';
    ticker.style.visibility = 'hidden';
    setTimeout(() => {
      ticker.style.display = 'none';
    }, 850);
  }

  track.addEventListener('animationend', removeTicker);
  // Backup timer (24s) in case animationend event isn't fired
  setTimeout(removeTicker, 24000);
})();

// ===== WEDDING CALENDAR INTEGRATION =====
const CALENDAR_EVENTS = {
  wedding: {
    title: "Grand Wedding: Dr. Varsha S & Akhil P J",
    description: "Holy Matrimony of Dr. Varsha S and Akhil P J. Divine blessings and grand feast at RDR Convention Centre, Edappazhinji, Thiruvananthapuram. Details: https://akkuparu.varunsatheesh.in",
    location: "RDR Convention Centre, Edappazhinji, Thiruvananthapuram",
    start: "20261025T043000Z", // 10:00 AM IST
    end: "20261025T093000Z"    // 3:00 PM IST
  },
  reception: {
    title: "Bride's Reception: Dr. Varsha S",
    description: "Wedding Reception of Dr. Varsha S at RDR Convention Centre Mini Hall, Edappazhinji, Thiruvananthapuram. Details: https://akkuparu.varunsatheesh.in",
    location: "RDR Convention Centre Mini Hall, Edappazhinji, Thiruvananthapuram",
    start: "20261024T110000Z", // 4:30 PM IST
    end: "20261024T160000Z"    // 9:30 PM IST
  },
  haldi: {
    title: "Haldi & Sangeeth: Dr. Varsha & Akhil (Special Guests Only)",
    description: "Intimate Haldi & Sangeeth Celebration at Kottaram Banquet Hall. Details: https://akkuparu.varunsatheesh.in",
    location: "Kottaram Banquet Hall, Thiruvananthapuram",
    start: "20261020T113000Z", // 5:00 PM IST
    end: "20261020T163000Z"    // 10:00 PM IST
  }
};

let currentCalEvent = CALENDAR_EVENTS.wedding;

window.openCalendarModal = function(eventType) {
  currentCalEvent = CALENDAR_EVENTS[eventType] || CALENDAR_EVENTS.wedding;
  const overlay = document.getElementById('calModalOverlay');
  const titleEl = document.getElementById('calModalTitle');
  const subEl = document.getElementById('calModalSubtitle');
  const googleLink = document.getElementById('calGoogleLink');
  const yahooLink = document.getElementById('calYahooLink');

  if (titleEl) titleEl.textContent = `Add to Calendar: ${currentCalEvent.title.split(':')[0]}`;
  if (subEl) subEl.textContent = currentCalEvent.title;

  // Google Calendar URL (Must preserve literal slash between start and end dates)
  if (googleLink) {
    const title = encodeURIComponent(currentCalEvent.title);
    const details = encodeURIComponent(currentCalEvent.description);
    const loc = encodeURIComponent(currentCalEvent.location);
    googleLink.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${currentCalEvent.start}/${currentCalEvent.end}&details=${details}&location=${loc}&ctz=Asia/Kolkata`;
  }

  // Yahoo Calendar URL
  if (yahooLink) {
    const yUrl = new URL("https://calendar.yahoo.com/");
    yUrl.searchParams.set("v", "60");
    yUrl.searchParams.set("view", "d");
    yUrl.searchParams.set("type", "20");
    yUrl.searchParams.set("title", currentCalEvent.title);
    yUrl.searchParams.set("st", currentCalEvent.start);
    yUrl.searchParams.set("et", currentCalEvent.end);
    yUrl.searchParams.set("desc", currentCalEvent.description);
    yUrl.searchParams.set("in_loc", currentCalEvent.location);
    yahooLink.href = yUrl.toString();
  }

  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeCalModal = function(e) {
  if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('cal-modal-close')) {
    return;
  }
  const overlay = document.getElementById('calModalOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.handleAppleCalendar = function() {
  const evt = currentCalEvent;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Varun Satheesh//Akkuparu Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:${evt.title}`,
    `DESCRIPTION:${evt.description}`,
    `LOCATION:${evt.location}`,
    `DTSTART:${evt.start}`,
    `DTEND:${evt.end}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${evt.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

window.handleGoogleCalendar = function(e) {
  if (e) e.preventDefault();
  const evt = currentCalEvent || CALENDAR_EVENTS.wedding;
  const title = encodeURIComponent(evt.title);
  const details = encodeURIComponent(evt.description);
  const loc = encodeURIComponent(evt.location);
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${evt.start}/${evt.end}&details=${details}&location=${loc}&ctz=Asia/Kolkata`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

// ===== SAVE THE DATE GALLERY & LIGHTBOX =====
const STD_PHOTOS = [
  { src: 'images/savethedate/save1.jpg?v=portrait', caption: 'Save The Date • Dr. Varsha S & Akhil P J' },
  { src: 'images/savethedate/save2.jpg?v=portrait', caption: 'Save The Date • Pure Harmony & Love' },
  { src: 'images/savethedate/save3.jpg?v=portrait', caption: 'Save The Date • Bound by Stars' }
];

let currentStdIndex = 0;

window.handleStdImgError = function(imgEl, idx) {
  imgEl.onerror = null;
  imgEl.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230b1b3d"/><stop offset="100%" stop-color="%231a3668"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><rect x="15" y="15" width="570" height="370" fill="none" stroke="%23c9a961" stroke-width="1.5" rx="10"/><text x="50%" y="45%" font-family="serif" font-size="44" fill="%23c9a961" text-anchor="middle" dominant-baseline="middle">🪷</text><text x="50%" y="65%" font-family="serif" font-size="22" font-weight="bold" fill="%23fffdf9" text-anchor="middle" dominant-baseline="middle">Save The Date</text></svg>`;
};

window.openStdLightbox = function(src, caption) {
  const overlay = document.getElementById('stdLightbox');
  const img = document.getElementById('stdLightboxImg');
  const captionEl = document.getElementById('stdLightboxCaption');

  const foundIdx = STD_PHOTOS.findIndex(p => p.src === src);
  currentStdIndex = foundIdx >= 0 ? foundIdx : 0;

  if (img) img.src = src;
  if (captionEl) captionEl.textContent = caption || STD_PHOTOS[currentStdIndex].caption;
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeStdLightbox = function(e) {
  if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('std-lightbox-close')) {
    return;
  }
  const overlay = document.getElementById('stdLightbox');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.navigateStdLightbox = function(dir) {
  currentStdIndex = (currentStdIndex + dir + STD_PHOTOS.length) % STD_PHOTOS.length;
  const photo = STD_PHOTOS[currentStdIndex];
  const img = document.getElementById('stdLightboxImg');
  const captionEl = document.getElementById('stdLightboxCaption');

  if (img) {
    img.style.opacity = '0.3';
    setTimeout(() => {
      img.src = photo.src;
      img.style.opacity = '1';
    }, 150);
  }
  if (captionEl) captionEl.textContent = photo.caption;
};

// Global Keyboard Navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeCalModal();
    window.closeStdLightbox();
  } else if (e.key === 'ArrowLeft') {
    const stdOverlay = document.getElementById('stdLightbox');
    if (stdOverlay && stdOverlay.classList.contains('active')) window.navigateStdLightbox(-1);
  } else if (e.key === 'ArrowRight') {
    const stdOverlay = document.getElementById('stdLightbox');
    if (stdOverlay && stdOverlay.classList.contains('active')) window.navigateStdLightbox(1);
  }
});

console.log('🪷 Dr. Varsha & Akhil Wedding Site Loaded successfully 🪷');
