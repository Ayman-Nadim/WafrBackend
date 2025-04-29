const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extraire le token du header "Authorization"

  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }

  // Vérifier le token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user; // Stocker les informations de l'utilisateur dans `req.user`
    next();
  });
};

module.exports = authenticateJWT;
