const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Simuler une base de données d'utilisateurs (vous devriez utiliser une base de données réelle)
let users = [];

// Fonction pour valider les données d'entrée
const validateInput = (username, password) => {
  if (!username || !password) {
    return { valid: false, message: 'Username and password are required' };
  }
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  return { valid: true };
};

const register = (req, res) => {
  const { username, password } = req.body;
  
  // Validation des données d'entrée
  const validation = validateInput(username, password);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  // Vérifier si l'utilisateur existe déjà
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  
  // Hacher le mot de passe
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Sauvegarder l'utilisateur
  const newUser = { username, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
};

const login = (req, res) => {
  const { username, password } = req.body;
  
  // Validation des données d'entrée
  const validation = validateInput(username, password);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  // Vérifier si l'utilisateur existe
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Vérifier le mot de passe
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  // Générer un token JWT
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(200).json({ message: 'Login successful', token });
};

module.exports = { register, login };
