const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')


// Get the current URL query string
const params = new URLSearchParams(window.location.search);

// Get the values of specific parameters
const username = params.get('username');
const room = params.get('room');


const socket = io();

socket.emit('joinRoom', {
  username,
  roomName: room
});

socket.on('message', (message) => {
  outputMessage(message)
});

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room)
  outputUsers(users)
});



function outputRoomName(room) {
  roomName.innerText = room
};

function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username
    userList.append(li)
  });
}

function outputMessage(message) {
  const div = document.createElement('div')
  div.classList.add('message')
  const p = document.createElement('p')
  p.classList.add('meta')
  p.innerHTML = `${message.username}  <span>${message.time}</span>`;
  div.appendChild(p)
  const para = document.createElement('p')
  para.classList.add('text')
  para.innerText = message.text
  div.append(para)
  document.querySelector('.chat-messages').appendChild(div)
};

document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave room')

  if (leaveRoom) {
    socket.emit('disconect', {
      username,
      roomName: room
    })
    window.location = "../index.html";

  } else {

  }
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get msg text
  let msg = e.target.elements.msg.value;

  msg.trim();

  if (!msg) {
    return false;
  };

  // Emit message to server
  socket.emit('chatMessage', msg);

  // clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})