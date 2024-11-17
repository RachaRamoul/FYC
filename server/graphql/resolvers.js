const { Pool } = require('pg');

const pool = new Pool({
  user: 'user',
  host: 'db',
  database: 'library',
  password: 'password',
  port: 5432,
});

const query = async (text, params) => {
  const { rows } = await pool.query(text, params);
  return rows;
};

const resolvers = {
  Query: {
    books: async () => {
      const result = await query(`
        SELECT books.id, books.title, authors.id AS author_id, authors.name AS author_name, 
               themes.id AS theme_id, themes.name AS theme_name
        FROM books
        JOIN authors ON books.author_id = authors.id
        JOIN themes ON books.theme_id = themes.id
      `);
      
      // S'assurer que les données retournées correspondent au schéma
      return result.map((row) => ({
        id: row.id,
        title: row.title,
        author: row.author_id ? { id: row.author_id, name: row.author_name } : null,
        theme: row.theme_id ? { id: row.theme_id, name: row.theme_name } : null,
      }));
    },
    authors: async () => await query(`SELECT * FROM authors`),
    themes: async () => await query(`SELECT * FROM themes`),
  },
  Mutation: {
    addBook: async (_, { title, authorName, themeName }) => {
      let author = await query(`SELECT * FROM authors WHERE name = $1`, [authorName]);
      if (author.length === 0) {
        author = await query(`INSERT INTO authors (name) VALUES ($1) RETURNING *`, [authorName]);
      } else {
        author = author[0];
      }

      let theme = await query(`SELECT * FROM themes WHERE name = $1`, [themeName]);
      if (theme.length === 0) {
        theme = await query(`INSERT INTO themes (name) VALUES ($1) RETURNING *`, [themeName]);
      } else {
        theme = theme[0];
      }

      const newBook = await query(
        `INSERT INTO books (title, author_id, theme_id) VALUES ($1, $2, $3) RETURNING *`,
        [title, author.id, theme.id]
      );
      return {
        id: newBook[0].id,
        title: newBook[0].title,
        author: { id: author.id, name: author.name },
        theme: { id: theme.id, name: theme.name },
      };
    },
  },
};

module.exports = resolvers;
