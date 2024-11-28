const express = require('express');
const router = express.Router();
const client = require('../grpcClient');

// Route pour obtenir les données des livres
router.get('/', async (req, res) => {
  client.GetBooks({}, (error, response) => {
    if (error) {
      return res.status(500).json({ error: error.details });
    }
    res.json(Array.isArray(response.books) ? response.books : []);
  });
});


// Route pour ajouter un livre
router.post('/', (req, res) => {
  const { title, author, theme } = req.body;
  const book = { title, author, theme };
  client.AddBook(book, (error, response) => {
    if (error) {
      return res.status(500).json({ error: error.details });
    }
    res.status(201).json({ message: response.message });
  });
});

module.exports = router;
