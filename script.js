const statusDisplay = document.querySelector('.game--status');

const scores = {
  X: -1,
  O: 1,
  tie: 0
};

let currentPlayer = 'X';
let gameActive = true;

// ['', '', '', '', '', '', '', '', ''];
const gameState = new Array(9).fill('');

// فراخوانی این توابع => نمایش پیغام‌ها
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;
const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.innerHTML = currentPlayerTurn();
  if (currentPlayer === 'O') {
    bestMove();
  }
}

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i <= winningConditions.length - 1; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === '' || b === '' || c === '') {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusDisplay.innerHTML = winningMessage();
    gameActive = false;
    return;
  }

  let roundDraw = !gameState.includes('');
  if (roundDraw) {
    statusDisplay.innerHTML = drawMessage();
    gameActive = false;
    return;
  }

  handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute('data-cell-index')
  );

  if (gameState[clickedCellIndex] !== '' || !gameActive) {
    return;
  }

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

function handleRestartGame() {
  gameActive = true;
  currentPlayer = 'X';
  gameState.fill('');
  statusDisplay.innerHTML = currentPlayerTurn();
  document.querySelectorAll('.cell').forEach(cell => (cell.innerHTML = ''));
}

document
  .querySelectorAll('.cell')
  .forEach(cell => cell.addEventListener('click', handleCellClick));
document
  .querySelector('.game--restart')
  .addEventListener('click', handleRestartGame);

// AI Code
function bestMove() {
  // AI to make its turn
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    // Is the spot available?
    if (gameState[i] === '') {
      gameState[i] = 'O';
      let score = minimax(gameState, 0, false);
      gameState[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  gameState[move] = 'O';
  document.querySelector(`[data-cell-index="${move}"]`).innerHTML = 'O';
  handleResultValidation();
}

function minimax(board, depth, isMaximizing) {
  let winner = null;
  if (winner = checkWinner()) {
    return scores[winner];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      // Is the spot available?
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      // Is the spot available?
      if (board[i] === '') {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner() {
  let winner = null;

  // بررسی افقی برد
  for (let i = 0; i < 9; i += 3) {
    if (gameState[i] === gameState[i + 1] && gameState[i + 1] === gameState[i + 2] && gameState[i] !== '') {
      winner = gameState[i];
    }
  }

  // بررسی عمودی برد
  for (let i = 0; i < 3; i++) {
    if (gameState[i] === gameState[i + 3] && gameState[i + 3] === gameState[i + 6] && gameState[i] !== '') {
      winner = gameState[i];
    }
  }

  // بررسی قطری برد
  if (gameState[0] === gameState[4] && gameState[4] === gameState[8] && gameState[0] !== '') {
    winner = gameState[0];
  }
  if (gameState[2] === gameState[4] && gameState[4] === gameState[6] && gameState[2] !== '') {
    winner = gameState[2];
  }

  // شمارش خانه‌های خالی
  let openSpots = 0;
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === '') {
      openSpots++;
    }
  }


  if (winner === null && openSpots === 0) {
    return 'tie';
  } else {
    return winner;
  }
}