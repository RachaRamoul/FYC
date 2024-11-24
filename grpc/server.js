const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const { addBook, getBooks } = require('./db/booksQuery');

const protoPath = path.join(__dirname, 'library.proto');
const packageDefinition = protoLoader.loadSync(protoPath, { keepCase: true });
const libraryProto = grpc.loadPackageDefinition(packageDefinition).LibraryService;

const PORT = '50051';

const addBookHandler = async (call, callback) => {
    const { title, author, theme } = call.request;
    try{
        await addBook(title, author, theme);
        callback(null, { message: "Le livre a été ajouté avec succès !"});
    }catch(error){
        callback({
            code: grpc.status.INTERNAL,
            details: "Une erreur s'est produite lors de l'ajout du livre."
          });
    }
};
  
const getBooksHandler = async (call, callback) => {
    try {
        const books = await getBooks();
        callback(null, { books });
      } catch (error) {
        callback({
          code: grpc.status.INTERNAL,
          details: "Une erreur s'est produite lors de la récupération des livres."
        });
      }
};
  

const server = new grpc.Server();

server.addService(libraryProto.service, {
    AddBook: addBookHandler,
    GetBooks: getBooksHandler,
});
server.bindAsync(`localhost:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
console.log(`Le serveur gRPC est en cours d'exécution sur le port ${PORT}`);
});