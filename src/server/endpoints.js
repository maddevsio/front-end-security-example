const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { checkAuth, checkPassword, escapeHTML } = require('./validators');
const {
  cookieConfig, authSecretKey, refreshSecretKey, authTokenLifetime, refreshTokenLifetime
} = require('./configs');

// Imitation of a database data. Normally you would store it in a table, use hashing for passwords
const usersMock = [{ username: 'administrator', password: 'Admin!123', role: 'admin' }];
const petsDataMock = [{ id: 1, data: 'Cat' }];

const generateJWT = (sub, role) => {
  // Generate new authentication token
  const authToken = jwt.sign({ sub, role }, authSecretKey, { expiresIn: authTokenLifetime });

  // Generate new refresh token
  const refreshToken = jwt.sign({ sub, role }, refreshSecretKey, { expiresIn: refreshTokenLifetime });
  return { authToken, refreshToken };
};

const connectEndpoints = (app) => {
  app.post('/api/login', checkPassword, (req, res) => {
    const errors = validationResult(req);
    // If there are validation errors, return 400
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    const { username, password } = req.body;

    // Validate username and password
    // This is where you would validate the user's credentials against your database

    // Simplified validation
    const fetchedUser = usersMock.find(user => username === user.username && password === user.password);

    if (fetchedUser) {
      const { authToken, refreshToken } = generateJWT(fetchedUser.username, fetchedUser.role);
      res.cookie('REFRESH-TOKEN', refreshToken, cookieConfig);
      res.json({ authToken });
    } else {
      res.status(400).send('Username or password is wrong');
    }
  });

  app.post('/api/refresh', (req, res) => {
    const refreshToken = req.cookies['REFRESH-TOKEN'];

    // Check if refresh token exists
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not provided' });
    }

    try {
      const decodedToken = jwt.verify(refreshToken, refreshSecretKey);

      if (!decodedToken) {
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
      }

      const { authToken, refreshToken: newRefreshToken } = generateJWT(decodedToken.sub, decodedToken.role);

      res.cookie('REFRESH-TOKEN', newRefreshToken, cookieConfig);
      res.json({ authToken });
    } catch (err) {
      res.status(401).send('Invalid token');
    }
  });

  // CRUD Operations with Authorization
  app.get('/api/data', checkAuth, (req, res) => {
    res.json(petsDataMock);
  });

  app.post('/api/data', [checkAuth, escapeHTML], (req, res) => {
    const errors = validationResult(req);
    // If there are validation errors, return 400
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    // Proceed with your logic if validation passed
    const newData = { id: petsDataMock.length + 1, data: req.body.data };
    petsDataMock.push(newData);
    res.status(201).json(newData);
  });

  app.delete('/api/data/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const index = petsDataMock.findIndex(item => item.id === parseInt(id, 10));
    if (index >= 0) {
      petsDataMock.splice(index, 1); // Remove the item from the array
      res.send({ message: 'Data deleted successfully' });
    } else {
      res.status(404).send({ message: 'Data not found' });
    }
  });
};

module.exports = connectEndpoints;
