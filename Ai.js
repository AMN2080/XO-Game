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

  // horizontal
  for (let i = 0; i < 9; i += 3) {
    if (gameState[i] === gameState[i + 1] && gameState[i + 1] === gameState[i + 2] && gameState[i] !== '') {
      winner = gameState[i];
    }
  }

  // Vertical
  for (let i = 0; i < 3; i++) {
    if (gameState[i] === gameState[i + 3] && gameState[i + 3] === gameState[i + 6] && gameState[i] !== '') {
      winner = gameState[i];
    }
  }

  // Diagonal
  if (gameState[0] === gameState[4] && gameState[4] === gameState[8] && gameState[0] !== '') {
    winner = gameState[0];
  }
  if (gameState[2] === gameState[4] && gameState[4] === gameState[6] && gameState[2] !== '') {
    winner = gameState[2];
  }

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

function handlePlayerChange() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.innerHTML = currentPlayerTurn();
  if (currentPlayer === 'O') {
    bestMove();
  }
}
