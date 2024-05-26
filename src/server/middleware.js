const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const { cookieConfig, corsConfig, cspConfig } = require('./configs');

const connectMiddleware = (app) => {
  // For parsing application/json
  app.use(express.json());
  app.use(express.static('dist'));

  // Setup CORS
  app.use(cors(corsConfig));

  // Initialize cookie-parser (needed for csrf token creation)
  app.use(cookieParser());

  // Setup CSP
  app.use(helmet(cspConfig));

  // Setup CSRF protection. Get CSRF token from cookies
  const csrfProtection = csurf({ cookie: true, value: req => req.cookies['XSRF-TOKEN'] });
  app.use((req, res, next) => {
    // Bypass CSRF protection on /api/login, since user doesn't have CSRF token on login page yet
    if (req.path === '/api/login') next();

    // Apply CSRF protection to all other routes
    else {
      csrfProtection(req, res, (err) => {
        if (err) next(err);
        else {
          const csrfToken = req.csrfToken();
          res.cookie('XSRF-TOKEN', csrfToken, cookieConfig);
          next();
        }
      });
    }
  });
};

module.exports = connectMiddleware;
