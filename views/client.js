const client = window.io();

// const createMessage = (from, message, avatar) => {
//   const messageElement = document.createElement('div');
//   messageElement.classList.add('msg');

//   const messageComponent = `
//     <div class="msg-img" style="background-image: url(http:${avatar})"></div>
//     <div class="msg-bubble">
//       <div class="msg-info">
//         <div class="msg-info-name">${from}</div>
//         <div class="msg-info-time">12:45</div>
//       </div>
//       <div class="msg-text">
//         ${message}
//       </div>
//     </div>
//   `;

//   messageElement.innerHTML = messageComponent;

//   return messageElement;
// };

// client.on('confirmConnection', (user) => {
//   const newMessageUser = createMessage(user.name, 'Bem vindo!', user.avatar);
//   document.querySelector('#listMessages').append(newMessageUser);
// });

// client.on('newUserConnect', (user) => {
//   const newMessageUser = createMessage(
//     user.name,
//     'Entrou no chat!',
//     user.avatar,
//   );
//   document.querySelector('#listMessages').append(newMessageUser);
// });

// client.on('clientExit', (obj) => {
//   console.log(obj);
//   const newMessageUser = createMessage(
//     'Chat Admin',
//     `${obj.name} saiu do chat!`,
//     '',
//   );
//   document.querySelector('#listMessages').append(newMessageUser);
// });

// document.querySelector('#formSendMessage').addEventListener('submit', (e) => {
//   e.preventDefault();

//   const textMessage = document.querySelector('#messageInput').value;

//   client.emit('sendMessageServer', textMessage);
// });

// client.on('sendMessageToClients', ({ from, message }) => {
//   console.log(from);

//   const newMessageUser = createMessage(from.name, message, from.avatar);
//   document.querySelector('#listMessages').append(newMessageUser);
// });

const chatMessage = 'oi voce ta bem?';
const nickname = 'Butao';

client.emit('message', { chatMessage, nickname });

client.on('message', (message) => {
  console.log(message);
});
