const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();

const pool = new Pool({
  user: 'user',
  host: 'db',
  database: 'library',
  password: 'password',
  port: 5432,
});

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.json());

// Route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});
  

// Fonction pour exécuter une requête SQL
async function query(sql, params) {
  const { rows } = await pool.query(sql, params);
  return rows;
}

// Route pour obtenir les données des livres
app.get('/data', async (req, res) => {
  try {
    const books = await query(`
      SELECT books.title, authors.name AS author, themes.name AS theme
      FROM books
      JOIN authors ON books.author_id = authors.id
      JOIN themes ON books.theme_id = themes.id
    `);
    res.json(Array.isArray(books) ? books : []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour ajouter un livre
app.post('/add-book', async (req, res) => {
    const { title, author, theme } = req.body;
    try {
      // Vérifier ou insérer l'auteur et récupérer l'author_id
      let authorResult = await query(`SELECT id FROM authors WHERE name = $1`, [author]);
      if (authorResult.length === 0) {
        authorResult = await query(`INSERT INTO authors (name) VALUES ($1) RETURNING id`, [author]);
      }
      const authorId = authorResult[0].id;
  
      // Vérifier ou insérer le thème et récupérer le theme_id
      let themeResult = await query(`SELECT id FROM themes WHERE name = $1`, [theme]);
      if (themeResult.length === 0) {
        themeResult = await query(`INSERT INTO themes (name) VALUES ($1) RETURNING id`, [theme]);
      }
      const themeId = themeResult[0].id;
  
      // Insérer le livre avec les author_id et theme_id récupérés
      await query(
        `INSERT INTO books (title, author_id, theme_id) VALUES ($1, $2, $3)`,
        [title, authorId, themeId]
      );
      res.status(201).json({ message: 'Book added' });
    } catch (error) {
      console.error("Failed to add book:", error.message);
      res.status(500).json({ error: error.message });
    }
});
  

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
