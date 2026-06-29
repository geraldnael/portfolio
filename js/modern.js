/* =============================================
   PORTFOLIO v4 JS — Gerald Nathanael
   Interactive: Magnetic · Tilt · Spotlight
   Modal · Counters · Marquee · Easter Egg
============================================= */

/* ── EmailJS ── */
emailjs.init({ publicKey: 'YOUR_PUBLIC_KEY' });

/* ════════════════════════════════════════
   1. PRELOADER
════════════════════════════════════════ */
(function() {
  const bar = document.getElementById('preBar');
  const pct = document.getElementById('prePct');
  const el  = document.getElementById('preloader');
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 18 + 4;
    if (p >= 100) {
      p = 100; clearInterval(iv);
      bar.style.width = '100%'; pct.textContent = '100%';
      setTimeout(() => {
        el.classList.add('gone');
        startCounters(); // start counters after preloader
      }, 420);
    } else {
      bar.style.width = p + '%';
      pct.textContent = Math.floor(p) + '%';
    }
  }, 80);
})();

/* ════════════════════════════════════════
   2. ANIMATED COUNTERS
════════════════════════════════════════ */
function startCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    let cur = 0;
    const step = target / 40;
    const iv = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur);
      if (cur >= target) clearInterval(iv);
    }, 35);
  });
}

/* ════════════════════════════════════════
   3. PARTICLES CANVAS
════════════════════════════════════════ */
(function() {
  const c = document.getElementById('particles');
  const ctx = c.getContext('2d');
  let W, H, pts;
  const resize = () => { W = c.width = innerWidth; H = c.height = innerHeight; };
  const make = () => pts = Array.from({length:70}, () => ({
    x:Math.random()*W, y:Math.random()*H,
    vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35,
    r:Math.random()*1.4+.3,
  }));
  const dark = () => document.documentElement.dataset.theme !== 'light';
  const draw = () => {
    ctx.clearRect(0,0,W,H);
    const pc = dark() ? 'rgba(255,255,255,' : 'rgba(0,0,0,';
    for (const p of pts) {
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0;
      if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=pc+'.4)'; ctx.fill();
    }
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++) {
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<110){
        ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle=`rgba(59,130,246,${(1-d/110)*.15})`; ctx.lineWidth=.6; ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  };
  resize(); make(); draw();
  addEventListener('resize',()=>{resize();make();});
})();

/* ════════════════════════════════════════
   4. SPOTLIGHT
════════════════════════════════════════ */
(function() {
  const sp = document.getElementById('spotlight');
  document.addEventListener('mousemove', e => {
    sp.style.left = e.clientX + 'px';
    sp.style.top  = e.clientY + 'px';
  });
})();

/* ════════════════════════════════════════
   5. MAGNETIC CURSOR + CUSTOM CURSOR
════════════════════════════════════════ */
(function() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const lbl  = document.getElementById('cursorLabel');
  if (!dot) return;

  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => {
    mx=e.clientX; my=e.clientY;
    dot.style.left=mx+'px'; dot.style.top=my+'px';
  });
  (function loop(){
    rx+=(mx-rx)*.13; ry+=(my-ry)*.13;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(loop);
  })();

  // Magnetic effect
  document.querySelectorAll('.mag-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      const dx = (e.clientX - cx) * .25, dy = (e.clientY - cy) * .25;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // Project cards — special cursor label
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      document.body.classList.add('hov-proj');
      lbl.textContent = 'Open';
    });
    card.addEventListener('mouseleave', () => {
      document.body.classList.remove('hov-proj');
    });
  });

  // General hover
  document.querySelectorAll('a,button,.sk-card,.cert-card,.exp-card,.c-info-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
  });
})();

/* ════════════════════════════════════════
   6. SCROLL PROGRESS BAR
════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const bar = document.getElementById('scrollProgress');
  const pct = window.scrollY / (document.body.scrollHeight - innerHeight) * 100;
  bar.style.width = pct + '%';
}, {passive:true});

/* ════════════════════════════════════════
   7. NAVBAR — scroll + active link + indicator
════════════════════════════════════════ */
const navbar   = document.getElementById('navbar');
const indicator= document.getElementById('navIndicator');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nl');

function moveIndicator(link) {
  if (!indicator || !link) return;
  const navRect  = navbar.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  indicator.style.left  = (linkRect.left - navRect.left) + 'px';
  indicator.style.width = linkRect.width + 'px';
}

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', scrollY > 60);
  let cur = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop - 130) cur = s.id; });
  navLinks.forEach(a => {
    const active = a.getAttribute('href') === '#' + cur;
    a.classList.toggle('active', active);
    if (active) moveIndicator(a);
  });
}, {passive:true});

// Initial indicator position
setTimeout(() => {
  const firstActive = document.querySelector('.nl.active');
  moveIndicator(firstActive);
}, 100);

/* ════════════════════════════════════════
   8. MOBILE DRAWER
════════════════════════════════════════ */
const drawer = document.getElementById('drawer');
document.getElementById('burger').addEventListener('click', () => drawer.classList.add('open'));
document.getElementById('drawerClose').addEventListener('click', () => drawer.classList.remove('open'));
document.querySelectorAll('.dl').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));

/* ════════════════════════════════════════
   9. THEME TOGGLE
════════════════════════════════════════ */
const themeBtn  = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const root      = document.documentElement;
function applyTheme(t) {
  root.dataset.theme = t;
  themeIcon.className = t==='dark' ? 'fas fa-moon' : 'fas fa-sun';
  localStorage.setItem('theme', t);
}
applyTheme(localStorage.getItem('theme') || 'dark');
themeBtn.addEventListener('click', () => applyTheme(root.dataset.theme==='dark'?'light':'dark'));

/* ════════════════════════════════════════
   10. TYPED TEXT
════════════════════════════════════════ */
(function() {
  const roles = ['Web Developer','Machine Learning Engineer','Front End Engineer','Problem Solver'];
  const el = document.querySelector('.typed-el');
  if (!el) return;
  let ri=0,ci=0,del=false;
  function tick(){
    const cur=roles[ri];
    el.textContent = del ? cur.slice(0,ci--) : cur.slice(0,ci++);
    let w = del ? 55 : 95;
    if (!del && ci>cur.length)      { del=true; w=1700; }
    else if (del && ci<0)           { del=false; ci=0; ri=(ri+1)%roles.length; w=350; }
    setTimeout(tick,w);
  }
  setTimeout(tick,1400);
})();

/* ════════════════════════════════════════
   11. REVEAL ON SCROLL
════════════════════════════════════════ */
(function() {
  // Stagger grid children
  document.querySelectorAll('.skills-grid,.proj-grid,.cert-grid').forEach(grid => {
    [...grid.children].forEach((c,i) => c.style.transitionDelay=(i*65)+'ms');
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('vis'); obs.unobserve(e.target); } });
  },{threshold:.1,rootMargin:'0px 0px -50px 0px'});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ════════════════════════════════════════
   12. 3D TILT CARDS
════════════════════════════════════════ */
document.querySelectorAll('.tilt-card').forEach(card => {
  const shine = card.querySelector('.tilt-shine');
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - .5;  // -0.5 to 0.5
    const y = (e.clientY - r.top)  / r.height - .5;
    card.style.transform = `perspective(600px) rotateY(${x*12}deg) rotateX(${-y*12}deg) scale(1.02)`;
    if (shine) shine.style.background = `radial-gradient(circle at ${(x+.5)*100}% ${(y+.5)*100}%,rgba(255,255,255,.12),transparent 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    if (shine) shine.style.background = '';
  });
});

/* ════════════════════════════════════════
   13. PROJECT MODAL
════════════════════════════════════════ */
const modal      = document.getElementById('projModal');
const modalImg   = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc  = document.getElementById('modalDesc');
const modalChips = document.getElementById('modalChips');
const modalLink  = document.getElementById('modalLink');
const modalClose = document.getElementById('modalClose');

function openModal(card) {
  modalImg.src        = card.dataset.img   || '';
  modalTitle.textContent = card.dataset.title || '';
  modalDesc.textContent  = card.dataset.desc  || '';
  modalLink.href      = card.dataset.link  || '#';
  modalChips.innerHTML = (card.dataset.chips||'').split(',').map(c =>
    `<span>${c.trim()}</span>`).join('');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-modal]').forEach(card =>
  card.addEventListener('click', () => openModal(card)));
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if(e.target===modal) closeModal(); });
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

/* ════════════════════════════════════════
   14. SMOOTH SCROLL
════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({behavior:'smooth'}); }
  });
});

/* ════════════════════════════════════════
   15. HERO PARALLAX
════════════════════════════════════════ */
const heroBody = document.querySelector('.hero-body');
window.addEventListener('scroll', () => {
  if (!heroBody) return;
  const y = scrollY;
  heroBody.style.transform = `translateY(${y*.18}px)`;
  heroBody.style.opacity   = 1 - y/650;
},{passive:true});

/* ════════════════════════════════════════
   16. EASTER EGG — press G then N within 1s
════════════════════════════════════════ */
(function() {
  const toast = document.getElementById('easterToast');
  let lastG = 0;
  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'g') lastG = Date.now();
    if (e.key.toLowerCase() === 'n' && Date.now()-lastG < 1000) {
      toast.classList.add('show');
      // Surprise: launch confetti burst
      launchConfetti();
      setTimeout(() => toast.classList.remove('show'), 3500);
      lastG = 0;
    }
  });

  function launchConfetti() {
    const colors = ['#3b82f6','#8b5cf6','#22c55e','#f59e0b','#ec4899'];
    for (let i=0; i<60; i++) {
      const d = document.createElement('div');
      d.style.cssText = `
        position:fixed;width:8px;height:8px;border-radius:2px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        left:${Math.random()*100}vw;top:-10px;
        pointer-events:none;z-index:9999;
        animation:confettiFall ${1.5+Math.random()*2}s ease-in forwards;
        animation-delay:${Math.random()*.5}s;
      `;
      document.body.appendChild(d);
      d.addEventListener('animationend', () => d.remove());
    }
  }
})();

/* Confetti keyframe via style tag */
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
@keyframes confettiFall {
  0%   { transform:translateY(0) rotate(0); opacity:1; }
  100% { transform:translateY(100vh) rotate(720deg); opacity:0; }
}`;
document.head.appendChild(confettiStyle);

/* ════════════════════════════════════════
   17. CONTACT FORM (EmailJS)
════════════════════════════════════════ */
document.getElementById('sendBtn').addEventListener('click', () => {
  const name    = document.getElementById('c-name').value.trim();
  const email   = document.getElementById('c-email').value.trim();
  const message = document.getElementById('c-msg').value.trim();
  const errName = document.getElementById('err-name');
  const errEmail= document.getElementById('err-email');
  const errMsg  = document.getElementById('err-msg');
  const status  = document.getElementById('formStatus');
  const btn     = document.getElementById('sendBtn');
  const btnTxt  = document.getElementById('sendBtnText');
  const btnIco  = document.getElementById('sendBtnIcon');

  [errName,errEmail,errMsg].forEach(e=>e.textContent='');
  status.textContent=''; status.className='form-status';

  let ok = true;
  if(name.length<2)         {errName.textContent='Name must be at least 2 characters';ok=false;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){errEmail.textContent='Please enter a valid email';ok=false;}
  if(message.length<10)     {errMsg.textContent='Message must be at least 10 characters';ok=false;}
  if(!ok) return;

  btn.disabled=true; btnTxt.textContent='Sending...'; btnIco.className='fas fa-spinner fa-spin';

  emailjs.send('YOUR_SERVICE_ID','YOUR_TEMPLATE_ID',{
    from_name:name, from_email:email, message,
    to_email:'geraldnael@gmail.com', reply_to:email,
  })
  .then(()=>{
    status.textContent='✓ Message sent! I\'ll get back to you soon.';
    status.className='form-status ok';
    document.getElementById('c-name').value='';
    document.getElementById('c-email').value='';
    document.getElementById('c-msg').value='';
  })
  .catch(err=>{
    console.error(err);
    status.textContent='✗ Failed to send. Please email me directly.';
    status.className='form-status er';
  })
  .finally(()=>{
    btn.disabled=false; btnTxt.textContent='Send Message'; btnIco.className='fas fa-chevron-right';
  });
});

/* ════════════════════════════════════════
   18. PROJECT FILTER TABS + SHOW MORE
════════════════════════════════════════ */
(function initProjects() {
  const VISIBLE_INIT = 4; // show 4 cards initially
  const tabs      = document.querySelectorAll('.proj-tab');
  const allCards  = [...document.querySelectorAll('.proj-card[data-category]')];
  const moreBtn   = document.getElementById('projMoreBtn');
  const moreLabel = document.getElementById('projMoreLabel');
  const moreIcon  = document.getElementById('projMoreIcon');
  const moreWrap  = document.querySelector('.proj-more-wrap');

  let currentFilter = 'all';
  let expanded = false;

  function getVisible() {
    return allCards.filter(c =>
      currentFilter === 'all' || c.dataset.category === currentFilter
    );
  }

  function applyFilter() {
    const visible = getVisible();
    allCards.forEach(c => {
      const matchFilter = currentFilter === 'all' || c.dataset.category === currentFilter;
      if (!matchFilter) {
        c.classList.add('hidden-filter');
        c.classList.remove('hidden-more', 'appearing');
      } else {
        c.classList.remove('hidden-filter');
      }
    });

    // Reset expand state when tab changes
    expanded = false;
    moreBtn.classList.remove('expanded');
    moreLabel.textContent = 'Show More';
    moreIcon.className = 'fas fa-chevron-down';

    applyMore(visible);
  }

  function applyMore(visible) {
    visible.forEach((c, i) => {
      if (!expanded && i >= VISIBLE_INIT) {
        c.classList.add('hidden-more');
      } else {
        c.classList.remove('hidden-more');
        if (expanded) {
          setTimeout(() => c.classList.add('appearing'), i * 40);
          setTimeout(() => c.classList.remove('appearing'), i * 40 + 400);
        }
      }
    });
    // Show/hide the button
    moreWrap.classList.toggle('no-more', visible.length <= VISIBLE_INIT);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      applyFilter();
    });
  });

  moreBtn.addEventListener('click', () => {
    expanded = !expanded;
    moreBtn.classList.toggle('expanded', expanded);
    moreLabel.textContent = expanded ? 'Show Less' : 'Show More';
    moreIcon.className = expanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
    applyMore(getVisible());

    // Smooth scroll to newly revealed cards if showing more
    if (!expanded) {
      document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Init
  applyFilter();
})();

/* ════════════════════════════════════════
   19. CERTIFICATION SLIDER + CATEGORY TABS
════════════════════════════════════════ */
(function initCertSlider() {
  const sliderEl   = document.getElementById('certSlider');
  const dotsWrap   = document.getElementById('certDots');
  const countEl    = document.getElementById('certCount');
  const prevBtn    = document.getElementById('certPrev');
  const nextBtn    = document.getElementById('certNext');
  const certTabs   = document.querySelectorAll('.cert-tab');
  const allSlides  = [...document.querySelectorAll('.cert-slide')];

  // Wrap slides in an inner flex container
  const inner = document.createElement('div');
  inner.className = 'cert-slider-inner';
  allSlides.forEach(s => inner.appendChild(s));
  sliderEl.appendChild(inner);

  let activeCategory = 'expertise';
  let currentIndex   = 0;
  let perPage        = getPerPage();

  function getPerPage() {
    return window.innerWidth <= 560 ? 1 : window.innerWidth <= 900 ? 2 : 3;
  }

  function getFilteredSlides() {
    return allSlides.filter(s => s.dataset.certCat === activeCategory);
  }

  function buildDots(slides) {
    dotsWrap.innerHTML = '';
    const pages = Math.ceil(slides.length / perPage);
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'cert-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Page ${i + 1}`);
      dot.addEventListener('click', () => goTo(i * perPage, slides));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots(slides) {
    const dots = dotsWrap.querySelectorAll('.cert-dot');
    const page = Math.floor(currentIndex / perPage);
    dots.forEach((d, i) => d.classList.toggle('active', i === page));
  }

  function updateCount(slides) {
    const page = Math.floor(currentIndex / perPage) + 1;
    const pages = Math.ceil(slides.length / perPage);
    countEl.textContent = `${page} / ${pages}`;
  }

  function updateArrows(slides) {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex + perPage >= slides.length;
  }

  function goTo(idx, slides) {
    currentIndex = Math.max(0, Math.min(idx, slides.length - perPage));
    // Position: each slide is (100% + gap) / perPage wide relative to inner
    const slideWidth = inner.offsetWidth / perPage;
    const gap = 20; // matches 1.25rem gap (approx)
    const offset = currentIndex * (slideWidth + gap - gap / perPage);
    // Simpler: translate by index * (100%/perPage of slider)
    const pct = (currentIndex / slides.length) * 100;
    inner.style.transform = `translateX(-${pct}%)`;
    updateDots(slides); updateCount(slides); updateArrows(slides);
  }

  function showCategory(cat) {
    activeCategory = cat;
    currentIndex = 0;
    const slides = getFilteredSlides();

    // Show/hide slides with animation
    allSlides.forEach(s => {
      const match = s.dataset.certCat === cat;
      s.style.display = match ? '' : 'none';
      if (match) {
        s.style.flex = `0 0 calc(${100 / perPage}% - ${(perPage - 1) * 20 / perPage}px)`;
      }
    });

    inner.style.transform = 'translateX(0)';
    buildDots(slides);
    updateCount(slides);
    updateArrows(slides);

    // Re-init tilt on newly visible cards
    slides.forEach(s => {
      const card = s.querySelector('.tilt-card');
      if (card && !card._tiltInit) {
        card._tiltInit = true;
        const shine = card.querySelector('.tilt-shine');
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width  - .5;
          const y = (e.clientY - r.top)  / r.height - .5;
          card.style.transform = `perspective(600px) rotateY(${x*10}deg) rotateX(${-y*10}deg) scale(1.02)`;
          if (shine) shine.style.background = `radial-gradient(circle at ${(x+.5)*100}% ${(y+.5)*100}%,rgba(255,255,255,.12),transparent 60%)`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
          if (shine) shine.style.background = '';
        });
      }
    });
  }

  prevBtn.addEventListener('click', () => {
    const slides = getFilteredSlides();
    goTo(currentIndex - perPage, slides);
  });

  nextBtn.addEventListener('click', () => {
    const slides = getFilteredSlides();
    goTo(currentIndex + perPage, slides);
  });

  // Tab switching
  certTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      certTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      showCategory(tab.dataset.cert);
    });
  });

  // Touch/swipe support
  let touchStartX = 0;
  inner.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, {passive:true});
  inner.addEventListener('touchend', e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    const slides = getFilteredSlides();
    if (Math.abs(dx) > 50) {
      dx > 0 ? goTo(currentIndex + perPage, slides) : goTo(currentIndex - perPage, slides);
    }
  }, {passive:true});

  // Keyboard navigation when hovering slider
  sliderEl.addEventListener('keydown', e => {
    const slides = getFilteredSlides();
    if (e.key === 'ArrowRight') goTo(currentIndex + perPage, slides);
    if (e.key === 'ArrowLeft')  goTo(currentIndex - perPage, slides);
  });

  // Resize
  window.addEventListener('resize', () => {
    perPage = getPerPage();
    const slides = getFilteredSlides();
    slides.forEach(s => {
      s.style.flex = `0 0 calc(${100 / perPage}% - ${(perPage - 1) * 20 / perPage}px)`;
    });
    currentIndex = 0;
    inner.style.transform = 'translateX(0)';
    buildDots(slides); updateCount(slides); updateArrows(slides);
  }, {passive:true});

  // Init with first category
  showCategory('expertise');
})();
