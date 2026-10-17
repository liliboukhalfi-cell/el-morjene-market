/* El Morjene — finitions version mobile (écran de lancement, retours au toucher, confirmations). */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var host = document.getElementById('app');
  if (!host) return;

  function buzz(p) { if (!reduce && navigator.vibrate) { try { navigator.vibrate(p); } catch (e) {} } }

  /* 1) Écran de lancement : appli installée (une fois par ouverture) ou ?splash pour tester */
  var forced = /[?&]splash/.test(location.search);
  var show = forced || root.getAttribute('data-app') === 'true';
  try {
    if (show && !forced) { if (sessionStorage.getItem('mp-splash')) show = false; else sessionStorage.setItem('mp-splash', '1'); }
  } catch (e) {}
  if (show) {
    var s = document.createElement('div');
    s.id = 'mp-splash';
    s.innerHTML = '<div class="mp-splash-in"><img class="mp-logo mp-loaded" src="icons/logo-mark.svg" alt=""><div class="mp-word">El Morjene<b>.</b></div><div class="mp-sub">Pâte à tartiner artisanale</div><div class="mp-bar"><i></i></div></div>';
    document.body.appendChild(s);
    var t0 = Date.now();
    var close = function () {
      setTimeout(function () { s.classList.add('out'); setTimeout(function () { s.remove(); }, 500); },
        Math.max(0, (reduce ? 400 : 1500) - (Date.now() - t0)));
    };
    if (document.readyState === 'complete') close(); else window.addEventListener('load', close);
  }

  /* 2) Appui sur un bouton : vibration légère + onde de couleur */
  document.addEventListener('pointerdown', function (e) {
    var t = e.target.closest && e.target.closest('button, .cart-btn, .add-cart-btn, .filter-btn, [onclick]');
    if (!t) return;
    buzz(8);
    if (reduce || !t.matches('button, .cart-btn, .add-cart-btn, .filter-btn')) return;
    var r = t.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, w = document.createElement('span');
    w.className = 'mp-ripple';
    w.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
    if (getComputedStyle(t).position === 'static') t.style.position = 'relative';
    t.style.overflow = 'hidden';
    t.appendChild(w);
    setTimeout(function () { w.remove(); }, 600);
  }, { passive: true });

  /* 3) Message de confirmation */
  var toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'mp-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1600);
  }

  window.mpToast = toast;

  /* 4) Confettis (commande confirmée) */
  function confetti() {
    if (reduce) return;
    var c = document.createElement('canvas'); c.id = 'mp-confetti';
    c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c);
    var g = c.getContext('2d'), cols = ['#C4571A', '#E07828', '#F2A65A', '#3A7A48', '#2C1A0E'];
    var ps = []; for (var i = 0; i < 60; i++) ps.push({ x: c.width / 2, y: c.height * .4, vx: (Math.random() - .5) * 9, vy: -Math.random() * 10 - 3, s: 5 + Math.random() * 5, c: cols[i % 5], r: Math.random() * 6 });
    var f = 0;
    (function tick() {
      g.clearRect(0, 0, c.width, c.height);
      ps.forEach(function (p) { p.vy += .35; p.x += p.vx; p.y += p.vy; p.r += .2; g.fillStyle = p.c; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); });
      if (++f < 110) requestAnimationFrame(tick); else c.remove();
    })();
  }

  /* 5) L'appli redessine tout à chaque action : on regarde ce qui a changé */
  var lastCount = null, lastPage = null, lastOrder = false, queued = false;
  function sync() {
    var a = (typeof app !== 'undefined') ? app : null, st = a && a.state;
    var b = host.querySelector('.cart-badge');
    if (b) {
      var n = parseInt(b.textContent, 10) || 0;
      if (lastCount !== null && n > lastCount) { b.classList.add('mp-bump'); toast('Ajouté au panier'); buzz([12, 40, 12]); }
      lastCount = n;
    }
    if (st) {
      if (lastPage !== null && st.page !== lastPage) { host.classList.remove('mp-page'); void host.offsetWidth; host.classList.add('mp-page'); }
      lastPage = st.page;
      if (st.orderConfirmed && !lastOrder) confetti();
      lastOrder = !!st.orderConfirmed;
    }
    host.querySelectorAll('img:not(.mp-loaded)').forEach(function (img) {
      if (img.complete) img.classList.add('mp-loaded');
      else img.addEventListener('load', function () { img.classList.add('mp-loaded'); }, { once: true });
    });
  }
  new MutationObserver(function () {
    if (queued) return; queued = true;
    requestAnimationFrame(function () { queued = false; sync(); });
  }).observe(host, { childList: true, subtree: true });
})();
