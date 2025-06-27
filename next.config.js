const runtimeCaching = require("next-pwa/cache");

/**
 * PWA configuration object.
 * @type {Object}
 * @property {string} dest - The destination directory for the service worker.
 * @property {boolean} disable - Disable PWA in development mode.
 * @property {boolean} register - Register the service worker.
 * @property {boolean} skipWaiting - Enable skip waiting for the service worker.
 * @property {Array<string>} buildExcludes - Files to exclude from the build.
 */
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  buildExcludes: ["app-build-manifest.json"],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\/_next\/image\/.*$/,
      handler: "CacheFirst",
      options: {
        cacheName: "next-image-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 1, // one day
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\/_next\/static\/.*$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 1, // one day
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\/public\/imgs\/.*$/,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 1, //  one day
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\/public\/games\/.*$/,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 1, //  one day
        },
      },
    },
    {
      urlPattern: /\/api\/.*$/i,
      handler: "NetworkOnly",
      options: {
        cacheName: "apis",
        expiration: {
          maxEntries: 0,
          maxAgeSeconds: 0,
        },
      },
    },
    {
      urlPattern: /\/_next\/data\/.*\/room\/ranking\.json$/,
      handler: "NetworkOnly",
      options: {
        cacheName: "next-data",
        expiration: {
          maxEntries: 0,
          maxAgeSeconds: 0,
        },
      },
    },
    ...runtimeCaching,
  ],
});

/**
 * Next.js configuration object.
 * @type {Object}
 * @property {function} webpack - Customize the Webpack configuration.
 * @property {Object} images - Configuration for handling images.
 * @property {Array<Object>} images.remotePatterns - Allowed remote patterns for images.
 * @property {function} headers - Async function to define custom headers.
 */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.minimize = true;
      config.optimization.splitChunks = {
        chunks: "all",
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "sandbox.api.starkbank.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "api.starkbank.com",
        pathname: "**",
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
