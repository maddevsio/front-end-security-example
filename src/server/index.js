const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const app = express();

const mockData = [
  { id: 1, data: 'Sample Data 1' },
];

const SECRET_KEY = 'your_secret_key_here';

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.static('dist'));
app.use(cors({
  origin: 'http://localhost:8080', // Your front-end domain + domains you rely on
  optionsSuccessStatus: 200,
  credentials: true,
}));
app.use(cookieParser());
app.use(csurf({ cookie: true }));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // Define other CSP policies as needed
    },
  },
}));

// Cookies configuration for Secure, HttpOnly, SameSite
const cookieConfig = {
  httpOnly: true,
  secure: false, // TODO fix when HTTPS
  sameSite: 'strict',
};

// CSRF protection middleware
app.use((req, res, next) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken, cookieConfig);
  next();
});

// JWT Middleware
app.use(expressJwt.expressjwt({ secret: SECRET_KEY, algorithms: ['HS256'] }).unless({ path: ['/api/login', '/api/register'] }));

// Authentication and Authorization Middleware
const checkRole = role => (req, res, next) => {
  if (req.user.role === role) {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
};

// Authentication Route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Here, you would typically check the username and password against a database
  // For demonstration, assume the user exists and has a role
  const user = {
    username,
    role: 'admin' // Example role; in real applications, this should come from your users database
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
app.get('/api/data', checkRole('admin'), (req, res) => {
  res.json(mockData);
});

app.post('/api/data', checkRole('admin'), (req, res) => {
  const newData = { id: mockData.length + 1, data: req.body.data };
  mockData.push(newData);
  res.status(201).json(newData);
});

app.delete('/api/data/:id', checkRole('admin'), (req, res) => {
  const { id } = req.params;
  const index = mockData.findIndex(item => item.id === parseInt(id, 10));
  if (index >= 0) {
    mockData.splice(index, 1); // Remove the item from the array
    res.send({ message: 'Data deleted successfully' });
  } else {
    res.status(404).send({ message: 'Data not found' });
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${process.env.PORT || 8080}!`);
});
