// config.js
window.klaroConfig = {
  version: 1, // bump version to force re-show
  acceptAll: true,
  services: [
    {
      name: 'googleAnalytics',
      purposes: ['analytics'],
      cookies: [
        /^_ga/,
        '_gid',
        '_gat',
      ],
      required: false,
      default: false,
      onlyOnce: true,
      onAccept: function() {
        // Inject Google Analytics only after consent
        if (!window.gtagScriptLoaded) {
          var s = document.createElement('script');
          s.async = true;
          s.src = 'https://www.googletagmanager.com/gtag/js?id=G-1G346W5BET';
          document.head.appendChild(s);
          window.gtagScriptLoaded = true;
        }
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-1G346W5BET');
      },
      onDecline: function() {
        // Optionally, remove GA cookies here if needed
      }
    }
  ]
}
