const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PORT = 50051;

const protoPath = path.join(__dirname, '../grpc/library.proto');
const packageDefinition = protoLoader.loadSync(protoPath, { keepCase: true });
const libraryProto = grpc.loadPackageDefinition(packageDefinition).LibraryService;
const client = new libraryProto(`localhost:${PORT}`, grpc.credentials.createInsecure());


module.exports = client;