const express = require('express');
const connector = require('./connector');
const server = express();
const port = 3000;
server.use(express.json());

server.post('/', (req, res) => {
  if (accessTokenIsValid(req)) {
    connector.handleHttpCallback(req, res)
  }
});

function accessTokenIsValid(req) {
  // Replace with proper validation of issued access token
  if (req.body.authentication.token) {
    return true;
  }
  res.status(401).send('Unauthorized')
  return false;
}

server.listen(port);
console.log(`Server listening on http://127.0.0.1:${port}`);
