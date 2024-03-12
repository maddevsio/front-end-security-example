const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const { authSecretKey } = require('./configs');

// This checks might be at FE as well
// Usually, FE should prevent incorrect data from being sent and BE should cautiously double-check the data
const checkPassword = body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  .matches(/\d/)
  .withMessage('Password must contain a number')
  .matches(/[A-Z]/)
  .withMessage('Password must contain an uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain a lowercase letter')
  .matches(/[@$!%*?&]/)
  .withMessage('Password must contain a special character');

// Use express-validator to sanitize user's input at BE
const escapeHTML = body('data').not().isEmpty().trim()
  .escape();

const checkAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).send('Please authenticate');
    return;
  }

  try {
    const decoded = jwt.verify(token, authSecretKey);
    req.token = decoded;

    // Naive role check. Should be managed separately, more robustly
    if (decoded.role !== 'admin') res.status(403).send('Forbidden');

    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};

module.exports = { checkAuth, checkPassword, escapeHTML };
