require('dotenv').config(); // Charger les variables d'environnement

const { Pool } = require('pg');



// Configuration de la connexion
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,  // Pour utiliser SSL, accepte le certificat
  },
});

// Tester la connexion
pool.connect()
  .then(() => {
    console.log("Connexion réussie à la base de données PostgreSQL");
  })
  .catch((err) => {
    console.error("Erreur de connexion à la base de données", err.stack);
  });

const express = require('express');
const cors = require('cors');
// CORS configuration
const corsOptions = {
    origin: 'https://wafr-dev.vercel.app', // Allow this origin only
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add other methods as needed
    allowedHeaders: ['Content-Type', 'Authorization'], // Add any headers you want to allow
  };
  
const app = express();
// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Routes d'authentification
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// app.get('/', (req, res) => {
//   res.send('Bienvenue sur mon backend');
// });

app.get('/api/fournisseurs/:phone/details', async (req, res) => {
    const { phone } = req.params;
    try {
      const result = await pool.query(
        'SELECT id, name, phone, status, balance, transaction_history FROM fournisseurs WHERE phone = $1',
        [phone]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Fournisseur not found' });
      }
  
      const fournisseur = result.rows[0];
  
      res.json({
        id: fournisseur.id,
        name: fournisseur.name,
        phone: fournisseur.phone,
        status: fournisseur.status,
        balance: fournisseur.balance,
        transaction_history: fournisseur.transaction_history,
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving fournisseur details' });
    }
  });

// Endpoint 3: Block a fournisseur
app.put('/api/fournisseurs/:phone/block', async (req, res) => {
  const { phone } = req.params;
  try {
    const result = await pool.query(
      'UPDATE fournisseurs SET status = $1 WHERE phone = $2 RETURNING *',
      ['blocked', phone]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fournisseur not found' });
    }
    res.json({ message: 'Fournisseur blocked', fournisseur: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error blocking fournisseur' });
  }
});

// Endpoint 4: Unblock a fournisseur
app.put('/api/fournisseurs/:phone/unblock', async (req, res) => {
  const { phone } = req.params;
  try {
    const result = await pool.query(
      'UPDATE fournisseurs SET status = $1 WHERE phone = $2 RETURNING *',
      ['active', phone]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fournisseur not found' });
    }
    res.json({ message: 'Fournisseur unblocked', fournisseur: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error unblocking fournisseur' });
  }
});

// Route pour créer la table `fournisseurs`, insérer 20 fournisseurs et les retourner
app.post('/api/create-and-insert-fournisseurs', async (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS fournisseurs (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      phone VARCHAR(20) UNIQUE,
      balance DECIMAL,
      transaction_history TEXT[],
      status VARCHAR(20) DEFAULT 'active'
    );
  `;

  const insertFournisseursQuery = `
    INSERT INTO fournisseurs (name, phone, balance, transaction_history, status)
    VALUES
      ('Fournisseur 1', '+212600000001', 1000.50, '{"Purchase 1", "Purchase 2"}', 'active'),
      ('Fournisseur 2', '+212600000002', 2000.75, '{"Purchase 1", "Purchase 3"}', 'active'),
      ('Fournisseur 3', '+212600000003', 3000.00, '{"Purchase 1", "Purchase 2"}', 'active'),
      ('Fournisseur 4', '+212600000004', 4000.25, '{"Purchase 1", "Purchase 4"}', 'active'),
      ('Fournisseur 5', '+212600000005', 5000.50, '{"Purchase 1", "Purchase 2"}', 'active'),
      ('Fournisseur 6', '+212600000006', 6000.60, '{"Purchase 1", "Purchase 3"}', 'active'),
      ('Fournisseur 7', '+212600000007', 7000.10, '{"Purchase 1", "Purchase 2"}', 'active'),
      ('Fournisseur 8', '+212600000008', 8000.20, '{"Purchase 1", "Purchase 4"}', 'active'),
      ('Fournisseur 9', '+212600000009', 9000.30, '{"Purchase 1", "Purchase 2"}', 'active'),
      ('Fournisseur 10', '+212600000010', 10000.40, '{"Purchase 1", "Purchase 3"}', 'active'),
      ('Fournisseur 11', '+212600000011', 11000.50, '{"Purchase 1", "Purchase 2"}', 'active'),
      ('Fournisseur 12', '+212600000012', 12000.60, '{"Purchase 1", "Purchase 4"}', 'active'),
      ('Fournisseur 13', '+212600000013', 13000.70, '{"Purchase 1", "Purchase 2"}', 'active'),
      ('Fournisseur 14', '+212600000014', 14000.80, '{"Purchase 1", "Purchase 3"}', 'active'),
      ('Fournisseur 15', '+212600000015', 15000.90, '{"Purchase 1", "Purchase 4"}', 'active'),
      ('Fournisseur 16', '+212600000016', 16000.20, '{"Purchase 1", "Purchase 2"}', 'active'),
      ('Fournisseur 17', '+212600000017', 17000.30, '{"Purchase 1", "Purchase 3"}', 'active'),
      ('Fournisseur 18', '+212600000018', 18000.40, '{"Purchase 1", "Purchase 2"}', 'active'),
      ('Fournisseur 19', '+212600000019', 19000.50, '{"Purchase 1", "Purchase 4"}', 'active'),
      ('Fournisseur 20', '+212600000020', 20000.60, '{"Purchase 1", "Purchase 2"}', 'active')
    RETURNING *;
  `;

  try {
    // Créer la table fournisseurs si elle n'existe pas
    await pool.query(createTableQuery);

    // Insérer 20 fournisseurs et récupérer les données insérées
    const result = await pool.query(insertFournisseursQuery);

    // Retourner les fournisseurs insérés
    res.status(200).json({
      message: '20 fournisseurs created successfully.',
      fournisseurs: result.rows,
    });

  } catch (err) {
    console.error('Error creating table and inserting fournisseurs', err);
    res.status(500).json({ message: 'Error creating table and inserting fournisseurs' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
