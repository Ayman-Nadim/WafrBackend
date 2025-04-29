const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

exports.getAllUsers = (req, res) => {
  pool.query('SELECT * FROM users')
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => {
      console.error("Erreur lors de la requête", err.stack);
      res.status(500).send("Erreur interne du serveur");
    });
};
