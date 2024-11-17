const express = require('express');
const router = express.Router();
const { getBooks, addBook } = require('../services/booksService');

// Route pour obtenir les données des livres
router.get('/', async (req, res) => {
  try {
    const books = await getBooks();
    res.json(Array.isArray(books) ? books : []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour ajouter un livre
router.post('/', async (req, res) => {
  const { title, author, theme } = req.body;
  try {
    await addBook(title, author, theme);
    res.status(201).json({ message: 'Book added' });
  } catch (error) {
    console.error("Failed to add book:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
