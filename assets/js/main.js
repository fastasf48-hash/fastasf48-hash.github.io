/* =========================================================
   Rahul Sharma — Portfolio interactions
   ========================================================= */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine    = window.matchMedia('(pointer: fine)').matches;

  /* ---------------- theme ---------------- */
  (function theme() {
    const root = document.documentElement;
    const saved = localStorage.getItem('rs-theme');
    if (saved) root.setAttribute('data-theme', saved);

    $('#themeToggle').addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('rs-theme', next);
    });
  })();

  /* ---------------- nav: sticky, burger, scrollspy, progress ---------------- */
  (function nav() {
    const navEl    = $('#nav');
    const links    = $('#navLinks');
    const burger   = $('#burger');
    const progress = $('#scrollProgress');
    const toTop    = $('#toTop');
    const anchors  = $$('[data-nav]');
    const sections = anchors
      .map(a => $(a.getAttribute('href')))
      .filter(Boolean);

    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });

    links.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });

    let ticking = false;
    function onScroll() {
      const y = window.scrollY;
      navEl.classList.toggle('stuck', y > 20);
      toTop.classList.toggle('show', y > 700);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

      // scrollspy
      const probe = y + window.innerHeight * 0.32;
      let current = null;
      sections.forEach(sec => { if (sec.offsetTop <= probe) current = sec.id; });
      anchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    toTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
  })();

  /* ---------------- reveal on scroll ---------------- */
  (function reveal() {
    const items = $$('.reveal, .meters');
    if (!('IntersectionObserver' in window) || reduced) {
      items.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = el.parentElement ? Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal')) : [];
        const idx = Math.min(siblings.indexOf(el), 8);
        el.style.transitionDelay = (idx > 0 ? idx * 70 : 0) + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    items.forEach(el => io.observe(el));
  })();

  /* ---------------- animated counters ---------------- */
  (function counters() {
    const nums = $$('.stat__num');
    if (!nums.length) return;

    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (reduced) { el.textContent = target + suffix; return; }
      const dur = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    nums.forEach(n => io.observe(n));
  })();

  /* ---------------- hero: typed roles ---------------- */
  (function typed() {
    const el = $('#typed');
    if (!el) return;
    const words = [
      'Playwright frameworks that don’t flake.',
      'API suites with real schema validation.',
      'CI/CD pipelines that answer in minutes.',
      'Page objects a whole team can extend.',
      'test coverage across UI, API and DB.'
    ];
    if (reduced) { el.textContent = words[0]; return; }

    let w = 0, c = 0, deleting = false;
    (function tick() {
      const word = words[w];
      c += deleting ? -1 : 1;
      el.textContent = word.slice(0, c);

      let delay = deleting ? 26 : 52;
      if (!deleting && c === word.length) { delay = 1900; deleting = true; }
      else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 320; }
      setTimeout(tick, delay);
    })();
  })();

  /* ---------------- hero: terminal ---------------- */
  (function terminal() {
    const body = $('#terminalBody');
    const btn  = $('#terminalReplay');
    if (!body) return;

    const script = [
      { t: '<span class="d">$</span> <span class="w">pytest -m smoke --env qa -n auto</span>', d: 60 },
      { t: '<span class="d">=========== test session starts ============</span>', d: 40 },
      { t: 'platform win32 — python 3.11.9 — pytest 8.2.0', d: 30 },
      { t: 'plugins: playwright, html, xdist, rerunfailures, allure', d: 30 },
      { t: '<span class="b">gw0 [12] · gw1 [12] · gw2 [12] · gw3 [12]</span>', d: 40 },
      { t: '', d: 20 },
      { t: 'tests/ui/test_checkout_flow.py <span class="g">.</span>            <span class="d">[ 20%]</span>', d: 240 },
      { t: 'tests/ui/test_about_navigation.py <span class="g">.</span>          <span class="d">[ 40%]</span>', d: 200 },
      { t: 'tests/ui/test_login_data_driven.py <span class="g">...</span>       <span class="d">[ 55%]</span>', d: 220 },
      { t: 'tests/api/test_booking_lifecycle.py <span class="g">......</span>   <span class="d">[ 75%]</span>', d: 240 },
      { t: 'tests/api/test_authentication.py <span class="g">....</span>        <span class="d">[ 90%]</span>', d: 200 },
      { t: 'tests/db/test_db_validation.py <span class="g">...</span>           <span class="d">[100%]</span>', d: 200 },
      { t: '', d: 30 },
      { t: '<span class="g">========== 24 passed in 11.42s ===========</span>', d: 60 },
      { t: '<span class="d">report:</span> <span class="b">reports/html-report/report.html</span>', d: 40 },
      { t: '<span class="d">allure:</span> <span class="b">reports/allure-results</span>', d: 40 },
      { t: '<span class="d">$</span> <span class="caret-static">▋</span>', d: 0 }
    ];

    let timers = [];
    function play() {
      timers.forEach(clearTimeout);
      timers = [];
      body.innerHTML = '';
      if (reduced) { body.innerHTML = script.map(s => s.t).join('\n'); return; }
      let acc = 260;
      script.forEach((line) => {
        acc += line.d;
        timers.push(setTimeout(() => {
          body.insertAdjacentHTML('beforeend', line.t + '\n');
          body.scrollTop = body.scrollHeight;
        }, acc));
      });
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { play(); io.disconnect(); } });
    }, { threshold: 0.3 });
    io.observe($('#terminal'));

    btn.addEventListener('click', play);
  })();

  /* ---------------- hero canvas: drifting nodes ---------------- */
  (function canvas() {
    const cv = $('#heroCanvas');
    if (!cv || reduced) return;
    const ctx = cv.getContext('2d');
    let w, h, dots = [], raf;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    function size() {
      const r = cv.getBoundingClientRect();
      w = r.width; h = r.height;
      cv.width = w * DPR; cv.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(Math.round((w * h) / 22000), 70);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.6
      }));
    }

    function accent() {
      return document.documentElement.getAttribute('data-theme') === 'light'
        ? '7,154,104' : '52,227,164';
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      const rgb = accent();

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},.55)`;
        ctx.fill();

        for (let j = i + 1; j < dots.length; j++) {
          const o = dots[j];
          const dist = Math.hypot(d.x - o.x, d.y - o.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(o.x, o.y);
            ctx.strokeStyle = `rgba(${rgb},${0.16 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }

    size();
    frame();
    window.addEventListener('resize', () => { cancelAnimationFrame(raf); size(); frame(); });

    // pause when hero leaves the viewport
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { cancelAnimationFrame(raf); frame(); }
      else cancelAnimationFrame(raf);
    }, { threshold: 0 });
    io.observe(cv);
  })();

  /* ---------------- cursor glow + card spotlight ---------------- */
  (function cursor() {
    if (!fine || reduced) return;
    const glow = $('#cursorGlow');
    let tx = 0, ty = 0, cx = 0, cy = 0, active = false;

    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!active) { active = true; glow.style.opacity = '1'; }
    }, { passive: true });

    (function loop() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();

    $$('.skill-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  })();

  /* ---------------- subtle tilt ---------------- */
  (function tilt() {
    if (!fine || reduced) return;
    $$('.tilt').forEach(el => {
      let raf = null;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform =
            `perspective(900px) rotateX(${(-py * 3.2).toFixed(2)}deg) rotateY(${(px * 3.2).toFixed(2)}deg) translateY(-4px)`;
        });
      });
      el.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        el.style.transform = '';
      });
    });
  })();

  /* ---------------- magnetic buttons ---------------- */
  (function magnetic() {
    if (!fine || reduced) return;
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.16}px, ${y * 0.24}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  })();

  /* ---------------- architecture explorer ---------------- */
  (function explorer() {
    const nodes = $$('.node');
    const panel = $('#explorerPanel');
    if (!nodes.length || !panel) return;

    nodes.forEach(node => {
      node.addEventListener('click', () => {
        nodes.forEach(n => n.classList.remove('is-active'));
        node.classList.add('is-active');

        panel.innerHTML =
          `<div class="epanel__head"><span class="epanel__ico">${node.dataset.icon || '📁'}</span>` +
          `<h4 class="epanel__title">${node.dataset.title}</h4></div>` +
          `<p class="epanel__desc">${node.dataset.desc}</p>` +
          `<div class="epanel__meta">${node.dataset.meta || ''}</div>`;

        panel.classList.remove('epanel-fade');
        void panel.offsetWidth;
        panel.classList.add('epanel-fade');
      });
    });
  })();

  /* ---------------- code tabs ---------------- */
  (function codeTabs() {
    const tabs = $$('.ctab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('is-active'));
        $$('.cpane').forEach(p => p.classList.remove('is-active'));
        tab.classList.add('is-active');
        const pane = document.getElementById(tab.dataset.code);
        if (pane) pane.classList.add('is-active');
      });
    });
  })();

  /* ---------------- copy to clipboard ---------------- */
  (function copy() {
    const toast = $('#toast');
    let hide;

    function show(msg) {
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(hide);
      hide = setTimeout(() => toast.classList.remove('show'), 2200);
    }

    $$('.copy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const value = btn.dataset.copy;
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(value).then(() => show('Copied: ' + value));
        } else {
          const ta = document.createElement('textarea');
          ta.value = value;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); show('Copied: ' + value); }
          catch (_) { show('Press Ctrl+C to copy'); }
          document.body.removeChild(ta);
        }
      });
    });
  })();

  /* ---------------- console easter egg ---------------- */
  console.log(
    '%c✓ All suites green.%c\n\nRahul Sharma — Automation Engineer\n' +
    'Playwright · Python · Pytest · Selenium · CI/CD\n\n' +
    'github.com/fastasf48-hash\nfastasf48@gmail.com\n\n' +
    'Poking around the console? You\'re exactly the kind of person I want to work with.',
    'color:#34e3a4;font-size:15px;font-weight:700',
    'color:#9fb0c4;font-size:12px;line-height:1.6'
  );
})();
