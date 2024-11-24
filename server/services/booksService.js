const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');


const protoPath = path.join(__dirname, '../../grpc/library.proto');
const packageDefinition = protoLoader.loadSync(protoPath, { keepCase: true });
const libraryProto = grpc.loadPackageDefinition(packageDefinition).LibraryService;

const PORT = 50051;

const client = new libraryProto(`localhost:${PORT}`, grpc.credentials.createInsecure());


const getBooks = async () => {
  return new Promise((resolve, reject) => {
    client.GetBooks({}, (error, response) => {
      if (error) {
        reject(new Error(`Une erreur est survenue: ${error.details}`));
      } else {
        resolve(response.books);
      }
    });
  });
};

const addBook = async (title, author, theme) => {
  const book = { title, author, theme };
  return new Promise((resolve, reject) => {
    client.AddBook(book, (error, response) => {
      if (error) {
        reject(new Error(`Une erreur est survenue: ${error.details}`));
      } else {
        resolve(response.message);
      }
    });
  });
};

module.exports = { getBooks, addBook };
