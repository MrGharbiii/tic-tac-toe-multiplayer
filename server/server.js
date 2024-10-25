const http = require('http');
const WebSocket = require('ws');
const server = http.createServer();
const wss = new WebSocket.Server({ server });

let players = [];
let board = Array(9).fill(null);
let currentPlayer = 'X';

wss.on('connection', (ws) => {
  if (players.length >= 2) {
    ws.send(JSON.stringify({ type: 'error', message: 'Game is full!' }));
    ws.close();
    return;
  }

  players.push(ws);
  const playerSymbol = players.length === 1 ? 'X' : 'O';
  ws.send(JSON.stringify({ type: 'assignSymbol', symbol: playerSymbol }));

  ws.on('message', (data) => {
    const message = JSON.parse(data);

    if (message.type === 'move' && board[message.index] === null) {
      board[message.index] = message.symbol;
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

      broadcast({
        type: 'updateBoard',
        index: message.index,
        symbol: message.symbol,
        nextTurn: currentPlayer,
      });

      const result = checkWinner();
      if (result) {
        broadcast({ type: 'gameOver', result });
        resetGame();
      }
    }
  });

  ws.on('close', () => {
    players = players.filter((player) => player !== ws);
    resetGame();
  });
});

function broadcast(message) {
  players.forEach((player) => player.send(JSON.stringify(message)));
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return `${board[a]} wins!`;
    }
  }

  if (board.every((cell) => cell !== null)) {
    return 'Draw!';
  }
  return null;
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
}

server.listen(8080, () =>
  console.log('Server running on http://localhost:8080')
);
