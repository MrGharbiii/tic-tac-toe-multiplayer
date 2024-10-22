const WebSocket = require('ws'); // Install ws package with `npm install ws`

const server = new WebSocket.Server({ port: 8080 });

function parse_pos(message) {}

server.on('connection', (socket) => {
  console.log('New client connected!');

  // Send a message to the client
  socket.send('Welcome to the WebSocket server!');

  // Receive messages from the client
  socket.on('message', (message) => {
    console.log(`${message}`);
    const msgStr = message.toString();
    console.log(msgStr);

    socket.send(msgStr);
  });

  // Handle client disconnection
  socket.on('close', () => {
    console.log('Client disconnected.');
  });
});
