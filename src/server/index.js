const express = require('express');
const connectEndpoints = require('./endpoints');
const connectMiddleware = require('./middleware');

const app = express();

connectMiddleware(app);
connectEndpoints(app);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${process.env.PORT || 8080}!`);
});
