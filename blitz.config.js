const { sessionMiddleware, simpleRolesIsAuthorized } = require("@blitzjs/server")

const envFromKeys = (keys) => {
  const result = {};

  keys.forEach((key, i, a) => {
    result[key] = process.env[key];
  });

  return result;
}

module.exports = {
  middleware: [
    sessionMiddleware({
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  env: {
    ...envFromKeys([
      'REACT_APP_BASE_URL',
      'CLIENT_ID'
    ])
  },
  /* Uncomment this to customize the webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  */
}
