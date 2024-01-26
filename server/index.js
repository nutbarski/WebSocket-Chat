//websocket server init
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

const clients = new Set(); //store all websocket clients here

server.on('connection', (socket) => {
  clients.add(socket);

  //enable username collection
  let checkForName = true;

  socket.on('message', (message) => {
    //check if this is the clients first alert
    if (checkForName) {
      checkForName = false;
      const username = String(message).trim();

      if (!username) {
        socket.send('No cool username found, please enter one:');
        checkForName = true; //reset alert
        return;
      }

      if ([...clients].some((client) => client !== socket && client.username === username)) {
        socket.send('Username taken, choose another:');
        checkForName = true; //reset alert
        return;
      }

      socket.username = username;
      socket.send(`Welcome, ${username}!`);
      broadcast(`${username} has joined the chat.`);
      return;
    }

    //combine message and names here
    const wrappedMessage = `${socket.username}: ${String(message).trim()}`;
    broadcast(wrappedMessage);

    //log activity to console
    console.log(wrappedMessage);
  });

  //username desposal
  socket.on('close', () => {
    if (socket.username) {
      broadcast(`${socket.username} has left the chat.`);
    }
    clients.delete(socket);
  });
});

//broadcast messages to all connected clients
function broadcast(message) {
  clients.forEach((client) => {
    client.send(message);
  });
}
