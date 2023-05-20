import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';
import { userJoin, userLeave, getRoomUsers } from './utils/users.js';
import { formatMessage } from './utils/messages.js'



const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Coding Kunle'

io.on('connection', (socket) => {
  // socket represents an actual user
  socket.on('joinRoom', ({ username, roomName }) => {
    const user = userJoin(socket.id, username, roomName);
    socket.join(user.room);

    // welcome message

    socket.emit('message', formatMessage(botName, "welcome to Chat Now!"));

    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  })
});

const port = 3000;

server.listen(port, () => {
  console.log('app is listening on port 3000');
});