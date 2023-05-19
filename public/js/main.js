const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')


// Get the current URL query string
const params = new URLSearchParams(window.location.search);

// Get the values of specific parameters
const username = params.get('username');
const room = params.get('room');

console.log(username, roomName)

const socket = io();

socket.emit('joinRoom', {
  username,
  room
})