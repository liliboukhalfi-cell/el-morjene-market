/* El Morjene Market — bouton "Installer l'appli"
 * Visible seulement sur smartphone/tablette, et seulement si l'appli n'est pas déjà installée.
 * Android/Chrome : ouvre la vraie fenêtre d'installation. iPhone : explique le geste "Sur l'écran d'accueil".
 */
(function () {
  'use strict';
  var deferred = null;
  var btn = null;

  function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }
  function alreadyInstalled() {
    return document.documentElement.getAttribute('data-app') === 'true';
  }
  function wantsButton() {
    var d = document.documentElement.getAttribute('data-device');
    return !alreadyInstalled() && d !== 'desktop' && (deferred || isIOS());
  }

  function build() {
    if (btn) return;
    btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = "Installer l'appli";
    btn.setAttribute('aria-label', "Installer l'appli El Morjene");
    btn.style.cssText =
      'position:fixed;left:50%;transform:translateX(-50%);bottom:calc(16px + env(safe-area-inset-bottom));z-index:9999;' +
      'padding:12px 22px;border:0;border-radius:999px;background:linear-gradient(135deg,#C4571A,#E07828);color:#FDF6EC;' +
      "font:800 14px 'Nunito',sans-serif;box-shadow:0 8px 24px rgba(196,87,26,.35);cursor:pointer;";
    btn.addEventListener('click', onClick);
    document.body.appendChild(btn);
  }

  function onClick() {
    if (deferred) {
      deferred.prompt();
      deferred.userChoice.finally(function () { deferred = null; refresh(); });
    } else if (isIOS()) {
      alert("Pour installer l'appli sur iPhone :\n1. Touche le bouton Partager (le carré avec la flèche)\n2. Choisis « Sur l'écran d'accueil »");
    }
  }

  function refresh() {
    if (wantsButton()) { build(); btn.style.display = ''; }
    else if (btn) btn.style.display = 'none';
  }

  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; refresh(); });
  window.addEventListener('appinstalled', function () { deferred = null; refresh(); });
  window.addEventListener('devicechange', refresh);
  document.addEventListener('DOMContentLoaded', refresh);
})();
