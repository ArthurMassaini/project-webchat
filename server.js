// Faça seu código aqui
const express = require('express');

const app = express();
const http = require('http').createServer(app);
// const randomAvatar = require('random-avatar');
// const random = require('random-name')

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

const viewsRoute = require('./routes/viewsRoute');
const messagesRoute = require('./routes/messagesRoute');
const messagesModel = require('./models/messagesModel');

// const clients = {};

io.on('connection', (socket) => {
  console.log(`novo usuário conectado! ${socket.id}`);

  socket.on('message', ({ chatMessage, nickname }) => {
    const date = new Date()
      .toLocaleString({}, { hour12: true })
      .replace(/\//g, '-');
    const message = `${date} - ${nickname}: ${chatMessage}`;
    messagesModel.createMessage(chatMessage, nickname, date);

    io.emit('message', message);
  });

  //   socket.emit('confirmConnection', newUser);

  //   socket.broadcast.emit('newUserConnect', newUser);

  //   socket.on('sendMessageServer', (message) => {
  //     const from = clients[socket.id];
  //     io.emit('sendMessageToClients', { from, message });
  //   });

  //   socket.on('disconnect', () => {
  //     const clientDisconnected = clients[socket.id];
  //     delete clients[socket.id];
  //     console.log(`cliente ${clientDisconnected.name} saiu do chat`);

  //     io.emit('clientExit', clientDisconnected);
  //   });
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
