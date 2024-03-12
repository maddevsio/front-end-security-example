const cookieConfig = {
  httpOnly: true, // Cookie is accessible only through HTTP requests, not JS
  secure: true, // Cookie should only be sent over HTTPS
  sameSite: 'strict', // Cookie should only be sent in first-party context and not sent along with cross-site requests
};

const corsConfig = {
  origin: 'http://localhost:8080', // Your front-end domain + domains you rely on
  optionsSuccessStatus: 200,
  credentials: true,
};

const cspConfig = {
  // CSP policies might be adjusted to the app's needs
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['self'], // Default source for everything not specified
      // Optional:
      scriptSrc: ['self', 'example.com'],
      styleSrc: ['self', 'example.com'],
      imgSrc: ['self', 'example.com'],
      fontSrc: ['self', 'example.com'],
      mediaSrc: ['self'], // Audio and video
      connectSrc: ['self'], // Sources for network connections
      objectSrc: ['none'], // Sources for objects (such as Flash and Java applets)
    },
  },
};

const authSecretKey = process.env.AUTH_SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;

const authTokenLifetime = '1m';
const refreshTokenLifetime = '24h';

module.exports = {
  cookieConfig, corsConfig, cspConfig, authSecretKey, refreshSecretKey, authTokenLifetime, refreshTokenLifetime,
};
