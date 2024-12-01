const query = require('./query');

// Obtenir la liste des livres
async function getBooks() {
  return await query(`
    SELECT books.title, authors.name AS author, themes.name AS theme
    FROM books
    JOIN authors ON books.author_id = authors.id
    JOIN themes ON books.theme_id = themes.id
  `);
}

// Ajouter un livre
async function addBook(title, author, theme) {
  // Vérifier ou insérer l'auteur
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
}

module.exports = { getBooks, addBook };
