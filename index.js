import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  // socket represents an actual user
  socket.on('joinRoom', ({ username, room }) => {
    console.log(username, room);
  })
});

const port = 3000;

server.listen(port, () => {
  console.log('app is listening on port 3000');
});
