/*!
 * El Mordjen — détection de l'appareil (smartphone / tablette / PC)
 * et du mode "appli installée" (PWA ou APK).
 *
 * Utilisation : <script src="device-detect.js"></script> dans le <head>, AVANT ton CSS si possible.
 * Résultat :
 *   - <html data-device="mobile|tablet|desktop" data-app="true|false">
 *   - classes : is-mobile / is-tablet / is-desktop, is-app, is-portrait / is-landscape
 *   - window.ElMordjen.device, window.ElMordjen.isApp
 *   - évènement "devicechange" quand ça change (rotation, redimensionnement, etc.)
 *
 * IMPORTANT : ce script sert UNIQUEMENT à adapter l'affichage.
 * Il ne doit jamais servir à la sécurité (le user-agent est facile à falsifier).
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var nav = navigator;

  function isIpadOS() {
    // Depuis iPadOS 13, l'iPad se présente comme un Mac : on le repère grâce à l'écran tactile.
    return nav.platform === 'MacIntel' && nav.maxTouchPoints > 1;
  }

  function detectDevice() {
    var ua = nav.userAgent || '';
    var uaDataMobile =
      nav.userAgentData && typeof nav.userAgentData.mobile === 'boolean'
        ? nav.userAgentData.mobile
        : null;

    var coarse = window.matchMedia('(pointer: coarse)').matches;
    var noHover = window.matchMedia('(hover: none)').matches;
    var shortSide = Math.min(screen.width, screen.height);

    // 1) Tablettes (à tester AVANT mobile : l'UA d'un iPad contient aussi "Mobile")
    var tabletUA = /iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua));
    if (tabletUA || isIpadOS()) return 'tablet';

    // 2) Smartphones
    var phoneUA = /iPhone|iPod|Android.*Mobile|Windows Phone|IEMobile|Opera Mini|Mobile/i.test(ua);
    if (uaDataMobile === true || phoneUA) return 'mobile';

    // 3) Filet de sécurité : téléphone en "mode ordinateur" (UA falsifié par le navigateur)
    if (nav.maxTouchPoints > 0 && coarse && noHover && shortSide < 820) return 'mobile';

    return 'desktop';
  }

  function detectApp() {
    var standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      nav.standalone === true; // Safari iOS ("Sur l'écran d'accueil")
    var capacitor = !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
    var twa = typeof document.referrer === 'string' && document.referrer.indexOf('android-app://') === 0;
    return standalone || capacitor || twa;
  }

  var state = { device: null, isApp: null, orientation: null };

  function apply() {
    var device = detectDevice();
    var isApp = detectApp();
    var orientation = window.innerHeight >= window.innerWidth ? 'portrait' : 'landscape';

    if (device === state.device && isApp === state.isApp && orientation === state.orientation) return;

    var changed = state.device !== null; // false au tout premier appel
    state.device = device;
    state.isApp = isApp;
    state.orientation = orientation;

    root.setAttribute('data-device', device);
    root.setAttribute('data-app', isApp ? 'true' : 'false');
    root.setAttribute('data-orientation', orientation);

    var cl = root.classList;
    cl.remove('is-mobile', 'is-tablet', 'is-desktop', 'is-app', 'is-portrait', 'is-landscape');
    cl.add('is-' + device, 'is-' + orientation);
    if (isApp) cl.add('is-app');

    window.ElMordjen = window.ElMordjen || {};
    window.ElMordjen.device = device;
    window.ElMordjen.isApp = isApp;
    window.ElMordjen.orientation = orientation;

    if (changed) {
      try {
        window.dispatchEvent(new CustomEvent('devicechange', { detail: { device: device, isApp: isApp, orientation: orientation } }));
      } catch (e) { /* vieux navigateurs : on ignore */ }
    }
  }

  // Premier passage immédiat (évite le "flash" d'une mauvaise mise en page)
  apply();

  // Mises à jour : redimensionnement, rotation, changement de mode d'affichage
  var timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(apply, 120);
  }
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('orientationchange', schedule, { passive: true });

  var mq = window.matchMedia('(display-mode: standalone)');
  if (mq.addEventListener) mq.addEventListener('change', apply);
  else if (mq.addListener) mq.addListener(apply);
})();
