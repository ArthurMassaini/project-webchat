const client = window.io();

const randomNickName = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.toLowerCase().split('');
  let nickname = '';
  for (let i = 0; i < 16; i += 1) {
    const randomIndex = Math.floor(Math.random() * 26);

    nickname += alphabet[randomIndex];
  }

  return nickname;
};

const dataTestId = 'data-testid';

const nameLi = document.querySelector('.user');
let nickname = randomNickName();
nameLi.innerHTML = nickname;

const createUser = (newUser) => {
  const listElement = document.querySelector('.ul-list');
  const userElement = document.createElement('li');
  userElement.setAttribute(dataTestId, 'online-user');
  userElement.innerHTML = newUser.nickname;
  userElement.id = newUser.id;
  listElement.appendChild(userElement);
};

client.emit('newConnection', nickname);

client.on('newUser', (newUser) => {
  createUser(newUser);
});

client.on('newNickname', (user) => {
  const userElement = document.querySelector(`#${user.id}`);
  userElement.innerText = user.nickname;
});

client.on('disconnected', (id) => {
  const userElement = document.querySelector(`#${id}`);
  userElement.remove();
});

document.querySelector('.nickname-button').addEventListener('click', () => {
  nickname = document.querySelector('.nickname-box').value;
  nameLi.innerHTML = nickname;

  client.emit('newNickname', nickname);

  document.querySelector('.nickname-box').value = '';
});

client.on('users', (clients) => {
  clients.forEach((element) => {
    const listElement = document.querySelector('.ul-list');
    const userElement = document.createElement('li');
    userElement.innerText = element.nickname;
    userElement.setAttribute(dataTestId, 'online-user');
    userElement.id = element.id;
    listElement.appendChild(userElement);
  });
});

const createMessage = (message) => {
  const messageElement = document.createElement('p');
  messageElement.setAttribute(dataTestId, 'message');
  messageElement.innerHTML = message;

  return messageElement;
};

document.querySelector('.send-button').addEventListener('click', async () => {
  const chatMessage = document.querySelector('.input-message').value;

  client.emit('message', { chatMessage, nickname });

  document.querySelector('.input-message').value = '';
});

client.on('message', (message) => {
  const newMessageUser = createMessage(message);
  document.querySelector('.messages-list').append(newMessageUser);
});
