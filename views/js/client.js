const client = window.io();

const fetchMessages = async (messageParam, nicknameParam) => {
  console.log(messageParam, nicknameParam);
  const endpoint = 'http://localhost:3000/message';
  const request = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      message: messageParam,
      nickname: nicknameParam,
    }),
  };

  const response = await fetch(endpoint, request);
  const responseJson = await response.json();

  return responseJson;
};

const randomNickName = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.toLowerCase().split('');
  let nickname = '';
  for (let i = 0; i < 16; i += 1) {
    const RandomNumber = Math.floor(Math.random() * 26);

    nickname += alphabet[RandomNumber];
  }

  return nickname;
};

const allNicknames = JSON.parse(localStorage.getItem('nicknames')) || [];
let nickname = randomNickName();
localStorage.setItem('nicknames', JSON.stringify([...allNicknames, nickname]));

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

const createMessage = (message) => {
  const messageElement = document.createElement('p');
  const messageComponent = `<p data-testid="message">${message}</p>`;
  messageElement.innerHTML = messageComponent;

  return messageElement;
};

const createUser = (usersList) => {
  usersList.forEach((element) => {
    const userElement = document.createElement('li');
    userElement.setAttribute('data-testid', 'online-user');
    userElement.innerHTML = element;
    const listElement = document.querySelector('.ul-list');

    listElement.append(userElement);
  });
};
createUser(JSON.parse(localStorage.getItem('nicknames')));

document.querySelector('.send-button').addEventListener('click', () => {
  const chatMessage = document.querySelector('.input-message').value;

  // const nickname = localStorage.getItem('nickname');

  client.emit('message', { chatMessage, nickname });

  document.querySelector('.input-message').value = '';

  fetchMessages(chatMessage, nickname);
});

client.on('message', (message) => {
  const newMessageUser = createMessage(message);
  document.querySelector('.messages-list').append(newMessageUser);
});

document.querySelector('.nickname-button').addEventListener('click', () => {
  const newNickname = document.querySelector('.nickname-box').value;
  const allNamesStorage = JSON.parse(localStorage.getItem('nicknames'));

  const newArrayNames = allNamesStorage.map((element) => {
    if (element === nickname) {
      return newNickname;
    }
    return element;
  });

  localStorage.setItem('nicknames', JSON.stringify(newArrayNames));
  nickname = newNickname;

  document.querySelector('.nickname-box').value = '';
});
