const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());  // Allow all origins
app.use(express.json());  // Parse incoming JSON payloads

// Routes
app.get('/', (req, res) => {
  res.send("HELLO");  // Respond with "HELLO" when the root route is accessed
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
