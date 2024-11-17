const express = require('express');
const path = require('path');
const app = express();

const bookRoutes = require('./routes/books');

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());

// Utilisation des routes
app.use('/api/books', bookRoutes);

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
