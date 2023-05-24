import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';
import { userJoin, userLeave, getRoomUsers, getCurrentUser } from './utils/users.js';
import { formatMessage } from './utils/messages.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import { userRoute } from './routes/userR.js';
import { messageRoute } from './routes/messageR.js';
import session from 'express-session'
import { RoomRoute } from './routes/roomR.js';
import cookieParser from 'cookie-parser';
import { currentUser } from '@kunleticket/common';
import cors from 'cors'


const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//config file setting
dotenv.config({ path: './config.env' });

// utilities for api
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(session({ secret: process.env.SSEC }));
app.use(cors())
app.use(cookieParser());

app.use(currentUser)

// routes
app.use('/api/v1/users', userRoute);
app.use('/api/v1/messages', messageRoute);
app.use('/api/v1/room', RoomRoute);

const botName = 'Coding Kunle';

// Connecting Database first

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
  });

  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  })

  socket.on('disconect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      })
    };

  })
});



const DB = process.env.DB

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('DB connection successful'))

const port = 3000;


server.listen(port, () => {
  console.log('app is listening on port 3000');
});