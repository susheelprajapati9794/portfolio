(() => {
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scrolling ---------- */
  let lenis;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, touchMultiplier: 1.2 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Preloader ---------- */
  const pre = document.querySelector('#preloader');
  const counter = document.querySelector('#counter');
  const bar = document.querySelector('.preloader-bar span');
  const obj = { v: 0 };

  gsap.to(obj, {
    v: 100,
    duration: 2,
    ease: 'power2.inOut',
    onUpdate: () => {
      if (counter) counter.textContent = String(Math.round(obj.v)).padStart(2, '0');
      if (bar) bar.style.width = obj.v + '%';
    },
    onComplete: () => {
      gsap.to(pre, { yPercent: -100, duration: 0.9, ease: 'power4.inOut', delay: 0.15 });
      heroIntro();
    }
  });

  function heroIntro() {
    gsap.from('.hero-title .line-1', { y: 60, opacity: 0, duration: 0.9, ease: 'power4.out', delay: 0.1 });
    gsap.from('.hero-title .line-2', { y: 60, opacity: 0, duration: 0.9, ease: 'power4.out', delay: 0.2 });
    gsap.from('.hero-title .line-3', { y: 60, opacity: 0, duration: 0.9, ease: 'power4.out', delay: 0.3 });
    gsap.from('.eyebrow', { y: 18, opacity: 0, duration: 0.7, delay: 0.15 });
    gsap.from('.hero-sub', { y: 24, opacity: 0, duration: 0.8, delay: 0.4 });
    gsap.from('.hero-actions', { y: 24, opacity: 0, duration: 0.8, delay: 0.5 });
    gsap.from('.hero-photo', { y: 50, opacity: 0, rotate: 4, duration: 1.1, ease: 'power3.out', delay: 0.55 });
  }

  /* ---------- Cursor glow follows mouse ---------- */
  const cursorGlow = document.querySelector('#cursorGlow');
  if (cursorGlow && matchMedia('(hover:hover)').matches) {
    let gx = innerWidth / 2, gy = innerHeight / 2, mgx = gx, mgy = gy;
    addEventListener('mousemove', e => { mgx = e.clientX; mgy = e.clientY; });
    gsap.ticker.add(() => {
      gx += (mgx - gx) * 0.12;
      gy += (mgy - gy) * 0.12;
      gsap.set(cursorGlow, { x: gx, y: gy });
    });
  }

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.querySelector('#menuBtn');
  const navLinks = document.querySelector('#navLinks');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Hero photo tilt ---------- */
  const tiltEl = document.querySelector('[data-tilt]');
  if (tiltEl && matchMedia('(hover:hover)').matches) {
    tiltEl.addEventListener('mousemove', e => {
      const r = tiltEl.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(tiltEl, { x: x * 18, y: y * 14, rotateY: x * 8, rotateX: -y * 8, duration: 0.6, ease: 'power2.out' });
    });
    tiltEl.addEventListener('mouseleave', () => {
      gsap.to(tiltEl, { x: 0, y: 0, rotateY: 0, rotateX: 0, duration: 0.9, ease: 'elastic.out(1,.5)' });
    });
  }

  /* ---------- Scroll reveals ---------- */
  gsap.utils.toArray('.section-head, .about-statement, .about-body, .work-card, .toolkit-card, .timeline-row, .connect-card, .contact-title, .contact-mail').forEach(el => {
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  /* ---------- Particle canvas (desktop only) ---------- */
  const canvas = document.querySelector('#space');
  if (canvas && matchMedia('(hover:hover)').matches) {
    const ctx = canvas.getContext('2d');
    let W, H, pts = [];

    function resize() {
      W = canvas.width = innerWidth * devicePixelRatio;
      H = canvas.height = innerHeight * devicePixelRatio;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      pts = Array.from({ length: Math.min(160, Math.floor(innerWidth / 8)) }, () => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: Math.random() * 1 + 0.2,
        s: Math.random() * 0.16 + 0.03,
        p: Math.random() * 6.28
      }));
    }

    resize();
    addEventListener('resize', resize);

    function draw() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const p of pts) {
        p.y -= p.s;
        if (p.y < 0) p.y = innerHeight;
        p.p += 0.01;
        ctx.fillStyle = `rgba(180,220,245,${0.15 + Math.sin(p.p) * 0.07})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------- Subtle photo breathing (desktop only) ---------- */
  const photoImg = document.querySelector('.photo-frame img');
  if (photoImg && matchMedia('(hover:hover)').matches) {
    gsap.to(photoImg, { scale: 1.03, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }
})();
