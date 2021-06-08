// Faça seu código aqui
const express = require('express');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

const viewsRoute = require('./routes/viewsRoute');
const messagesRoute = require('./routes/messagesRoute');
const messagesModel = require('./models/messagesModel');

let clients = [];

const firstConnetions = (socket) => {
  socket.on('newConnection', (nickname) => {
    const newUser = { nickname, id: socket.id };

    socket.broadcast.emit('newUser', newUser);
    clients = [...clients, newUser];
    // socket.emit('newUser', { userNickname: nickname });
  });

  socket.on('newNickname', (nickname) => {
    socket.broadcast.emit('newNickname', { nickname, id: socket.id });
    const index = clients.findIndex((client) => client.id === socket.id);
    clients[index].nickname = nickname;
  });

  socket.on('disconnect', () => {
    const index = clients.findIndex((user) => user.id === socket.id);
    clients.splice(index, 1);
    socket.broadcast.emit('disconnected', socket.id);

    console.log('usuario desconectado');
  });
};

io.on('connection', (socket) => {
  console.log(`novo usuário conectado! ${socket.id}`);

  firstConnetions(socket);

  socket.emit('users', clients);

  socket.on('message', ({ chatMessage, nickname }) => {
    const date = new Date()
      .toLocaleString({}, { hour12: true })
      .replace(/\//g, '-');
    const message = `${date} - ${nickname}: ${chatMessage}`;
    messagesModel.createMessage(chatMessage, nickname, date);

    io.emit('message', message);
  });
});

app.use(express.json());
app.use(express.static(`${__dirname}/views/`));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(viewsRoute);
app.use(messagesRoute);

const PORT = 3000;

http.listen(PORT, () => console.log('App listening on PORT %s', PORT));
