const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

const mockData = [
  { id: 1, data: 'Sample Data 1' },
];

const SECRET_KEY = 'your_secret_key_should_be_in_env';

// ** Middleware **
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

// Cookies configuration for Secure, HttpOnly, SameSite
const cookieConfig = {
  httpOnly: true,
  secure: false, // TODO fix when HTTPS
  sameSite: 'strict',
};

// Setup CSRF protection
const csrfProtection = csurf({ cookie: true });
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

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) res.status(401).send('Please authenticate');

  const decoded = jwt.verify(token, SECRET_KEY);
  req.token = decoded;

  // Naive role check. Should be managed separately, more robustly
  if (decoded.role !== 'admin') res.status(403).send('Forbidden');

  next();
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
app.get('/api/data', auth, (req, res) => {
  res.json(mockData);
});

app.post('/api/data', auth, (req, res) => {
  const newData = { id: mockData.length + 1, data: req.body.data };
  mockData.push(newData);
  res.status(201).json(newData);
});

app.delete('/api/data/:id', auth, (req, res) => {
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
