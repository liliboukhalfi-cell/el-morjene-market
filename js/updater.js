/* El Morjene — recherche de mises à jour de l'appli (comme Mihon).
   Interroge les "Releases" publiques de GitHub : numéro de version, nouveautés et lien de l'APK.
   Rien n'est installé tout seul : la personne télécharge puis confirme l'installation. */
(function () {
  'use strict';
  var REPO = 'liliboukhalfi-cell/el-morjene-market';
  var ALLOWED = 'https://github.com/' + REPO + '/releases/download/';

  function parse(v) {
    var m = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(String(v || '').trim());
    return m ? [+m[1], +m[2], +m[3]] : null;
  }
  function isNewer(a, b) {
    for (var i = 0; i < 3; i++) { if (a[i] !== b[i]) return a[i] > b[i]; }
    return false;
  }

  window.EMUpdater = {
    current: function () { return window.APP_VERSION || ''; },
    check: function () {
      return fetch('https://api.github.com/repos/' + REPO + '/releases/latest', {
        headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store'
      }).then(function (r) {
        if (!r.ok) throw new Error('http ' + r.status);
        return r.json();
      }).then(function (rel) {
        var assets = rel.assets || [];
        var apk = assets.filter(function (a) { return /\.apk$/i.test(a.name); })[0];
        var url = apk && typeof apk.browser_download_url === 'string' && apk.browser_download_url.indexOf(ALLOWED) === 0
          ? apk.browser_download_url : null;
        var latest = parse(rel.tag_name), cur = parse(window.APP_VERSION);
        return {
          version: String(rel.tag_name || '').replace(/^v/, ''),
          notes: String(rel.body || ''),
          url: url,
          hasUpdate: !!(latest && cur && url && isNewer(latest, cur))
        };
      });
    }
  };
})();
