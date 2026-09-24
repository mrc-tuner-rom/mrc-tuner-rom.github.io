/* Honour ?lang=tr|en|zh in the address bar.

   The manual's default language is Turkish, so /docs/ is Turkish and
   /docs/en/, /docs/zh/ are the translations. A request such as
   /docs/?lang=en jumps straight to the English version of the page you are
   on, and the Material language switcher keeps the parameter in sync. */
(function () {
  var SUPPORTED = ['tr', 'en', 'zh'];

  function currentLocale() {
    var m = window.location.pathname.match(/\/(en|zh)\//);
    return m ? m[1] : 'tr';
  }

  function requested() {
    var q = new URLSearchParams(window.location.search).get('lang');
    return SUPPORTED.indexOf(q) !== -1 ? q : null;
  }

  function prefix(locale) {
    return locale === 'tr' ? '' : '/' + locale;
  }

  function pathInsideManual() {
    var path = window.location.pathname;
    var at = path.indexOf('/docs');
    if (at === -1) return '/';
    var rest = path.slice(at + '/docs'.length).replace(/^\/(en|zh)/, '');
    return rest || '/';
  }

  var want = requested();
  var have = currentLocale();
  if (want && want !== have) {
    window.location.replace('/docs' + prefix(want) + pathInsideManual()
      + window.location.search + window.location.hash);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var links = document.querySelectorAll('[data-md-component="alternate"] a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (ev) {
        var href = this.getAttribute('href');
        if (!href) return;
        ev.preventDefault();
        var target = new URL(href, window.location.origin);
        var m = target.pathname.match(/\/(en|zh)\//);
        target.searchParams.set('lang', m ? m[1] : 'tr');
        window.location.href = target.toString();
      });
    }
  });
})();
