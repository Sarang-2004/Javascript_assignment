const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('No token provided');
  }
  
  const tokenValue = token.split(' ')[1] || token;

  jwt.verify(tokenValue, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Failed to authenticate token');
    }
    req.user = decoded;
    next();
  });
}

module.exports = authenticate; 