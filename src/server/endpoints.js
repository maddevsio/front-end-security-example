const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');
const { checkAuth, checkPassword, escapeHTML } = require('./validators');

const mockData = [{ id: 1, data: 'Cat' }];
// TODO
const SECRET_KEY = 'your_secret_key_should_be_in_env';

const connectEndpoints = (app) => {
  app.post('/api/login', checkPassword, (req, res) => {
    const errors = validationResult(req);
    // If there are validation errors, return 400
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    const { username, password } = req.body;
    // Here, you would typically check the username and password against a database
    // For demonstration, assume the user exists and has a role
    const user = {
      username,
      role: 'admin' // Just a demo. In real applications, this should come from your users database
    };

    // Validate username and password
    // This is where you would validate the user's credentials against your database
    if (username && password) { // Simplified validation
      const token = jwt.sign({ sub: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(400).send('Username or password is wrong');
    }
  });

  // CRUD Operations with Authorization
  app.get('/api/data', checkAuth, (req, res) => {
    res.json(mockData);
  });

  app.post('/api/data', [checkAuth, escapeHTML], (req, res) => {
    const errors = validationResult(req);
    // If there are validation errors, return 400
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    // Proceed with your logic if validation passed
    const newData = { id: mockData.length + 1, data: req.body.data };
    mockData.push(newData);
    res.status(201).json(newData);
  });

  app.delete('/api/data/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const index = mockData.findIndex(item => item.id === parseInt(id, 10));
    if (index >= 0) {
      mockData.splice(index, 1); // Remove the item from the array
      res.send({ message: 'Data deleted successfully' });
    } else {
      res.status(404).send({ message: 'Data not found' });
    }
  });
};

module.exports = connectEndpoints;
