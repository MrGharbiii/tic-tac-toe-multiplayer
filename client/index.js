const socket = new WebSocket('ws://localhost:8080'); // Connect to WebSocket server
let playerSymbol = null;
let myTurn = false;

// WebSocket event listeners
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);

  switch (message.type) {
    case 'assignSymbol':
      playerSymbol = message.symbol;
      myTurn = playerSymbol === 'X'; // X starts first
      alert(`You are player ${playerSymbol}`);
      break;

    case 'updateBoard':
      document.querySelector(`[data-id="${message.index}"]`).innerText =
        message.symbol;
      myTurn = message.nextTurn === playerSymbol;
      break;

    case 'gameOver':
      alert(message.result);
      resetBoard();
      break;
  }
};

// Handle cell clicks
for (const cell of document.querySelectorAll('.cell')) {
  cell.addEventListener('click', () => {
    if (!myTurn || cell.innerText !== '') return; // Ignore if not player’s turn or cell already taken

    const index = cell.getAttribute('data-id');
    cell.innerText = playerSymbol; // Optimistic update
    myTurn = false;

    // Send the move to the server
    socket.send(JSON.stringify({ type: 'move', index, symbol: playerSymbol }));
  });
}

// Reset the board
function resetBoard() {
  for (const cell of document.querySelectorAll('.cell')) {
    cell.innerText = '';
  }
}
