const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');

const connectMiddleware = (app) => {
  // For parsing application/json
  app.use(express.json());
  app.use(express.static('dist'));

  // Setup CORS
  app.use(cors({
    origin: 'http://localhost:8080', // Your front-end domain + domains you rely on
    optionsSuccessStatus: 200,
    credentials: true,
  }));

  // Initialize cookie-parser (needed for csurf token creation)
  app.use(cookieParser());

  // Setup CSP
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
      // TODO Define other CSP policies as needed
      },
    },
  }));

  // Cookies config for Secure, HttpOnly, SameSite
  const cookieConfig = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  };

  // Setup CSRF protection. Get CSRF token from cookies
  const csrfProtection = csurf({ cookie: true, value: req => req.cookies['XSRF-TOKEN'] });
  app.use((req, res, next) => {
  // Bypass CSRF protection on /api/login
    if (req.path === '/api/login') next();

    // Apply CSRF protection to all other routes
    else {
      csrfProtection(req, res, (err) => {
        if (err) next(err);
        else {
        // Only set the CSRF token cookie if CSRF protection did not send a response
          const csrfToken = req.csrfToken();
          res.cookie('XSRF-TOKEN', csrfToken, cookieConfig);
          next();
        }
      });
    }
  });
};

module.exports = connectMiddleware;
