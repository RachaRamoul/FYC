const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const bookRoutes = require('./routes/books');

const app = express();

async function startServer() {
  // Créez une instance ApolloServer
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start(); // Démarrez le serveur Apollo
  server.applyMiddleware({ app }); // Appliquez Apollo middleware sur l'app Express

  console.log(`GraphQL available at ${server.graphqlPath}`);
}

startServer(); // Appelez la fonction async pour configurer Apollo Server

// Configuration Express pour les fichiers statiques et JSON
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());

// Utilisation des routes REST (si nécessaire)
app.use('/api/books', bookRoutes);

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
