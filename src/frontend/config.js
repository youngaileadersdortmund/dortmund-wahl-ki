// config.js
window.klaroConfig = {
  version: 2, // bump version to force re-show
  acceptAll: true,
  services: [
    {
      name: 'google-tag-manager',
      required: true,
      purposes: ['marketing'],
    },
    {
      name: 'google-analytics',
      purposes: ['marketing'],
    }
  ]
}
