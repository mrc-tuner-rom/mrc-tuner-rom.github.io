/* Honour ?lang=tr|en|zh in the address bar: the manual's default language is
   Turkish, so /docs/ is Turkish and /docs/en/, /docs/zh/ are the translations.
   A request like /docs/?lang=en jumps straight to the English page that is
   currently open. */
(function () {
  var SUPPORTED = ['tr', 'en', 'zh'];

  function currentLocale() {
    var path = window.location.pathname;
    var m = path.match(/\/(en|zh)\//);
    if (m) return m[1];
    return 'tr';
  }

  function requested() {
    var q = new URLSearchParams(window.location.search).get('lang');
    return SUPPORTED.indexOf(q) !== -1 ? q : null;
  }

  function localePrefix(locale) {
    return locale === 'tr' ? '' : '/' + locale;
  }

  function absolutePath() {
    // Path inside the manual, e.g. /MRC-Tuner-Rom/docs/en/05-harita-duzenleme/
    var path = window.location.pathname;
    var docsAt = path.indexOf('/docs');
    if (docsAt === -1) return '/';
    var rest = path.slice(docsAt + '/docs'.length);
    return rest.replace(/^\/(en|zh)/, '') || '/';
  }

  var want = requested();
  var have = currentLocale();
  if (want && want !== have) {
    var target = localePrefix(want) + absolutePath();
    window.location.replace(target + window.location.search + window.location.hash);
  }

  // Keep the query parameter in sync when the Material language switcher is used.
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-md-component="alternate"] a').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var href = a.getAttribute('href');
        if (!href) return;
        ev.preventDefault();
        var target = new URL(href, window.location.origin);
        var m = target.pathname.match(/\/(en|zh)\//);
        target.searchParams.set('lang', m ? m[1] : 'tr');
        window.location.href = target.toString();
      });
    });
  });
})();
