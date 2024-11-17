const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: Author!
    theme: Theme!
  }

  type Author {
    id: ID!
    name: String!
  }

  type Theme {
    id: ID!
    name: String!
  }

  type Query {
    books: [Book]
    authors: [Author]
    themes: [Theme]
  }

  type Mutation {
    addBook(title: String!, authorName: String!, themeName: String!): Book
  }
`;

module.exports = typeDefs;