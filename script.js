const statusDisplay = document.querySelector('.game--status');

// امتیازدهی به هر موقعیت برای ربات تا بهترین تصمیم رو بگیره
const scores = {
  X: -1, // اگر مخاطب برد
  O: 1, // اگر ربات برد
  tie: 0 // اگر مساوی شد
};

// مقداردهی اولیه
const initialState = {
  currentPlayer: "X",
  gameActive: true
}

// خونه‌های بازی
const gameState = new Array(9).fill('');

function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = initialState.currentPlayer;
  clickedCell.innerHTML = initialState.currentPlayer;
}

function handlePlayerChange() {
  initialState.currentPlayer = initialState.currentPlayer === 'X' ? 'O' : 'X';
  if (initialState.currentPlayer === 'O' && initialState.gameActive) {
    bestMove();
  }
}

function handleResultValidation() {
  if (checkWinner() === "X" || checkWinner() === "O") {
    statusDisplay.innerHTML = `Player ${initialState.currentPlayer} has won!`;
    initialState.gameActive = false;
    return;
  }

  let roundDraw = !gameState.includes('');
  if (roundDraw) {
    statusDisplay.innerHTML = "Game ended in a draw!";
    initialState.gameActive = false;
    return;
  }

  handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute('data-cell-index')
  );

  if (gameState[clickedCellIndex] !== '' || !initialState.gameActive) {
    return;
  }

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

function handleRestartGame() {
  initialState.gameActive = true;
  initialState.currentPlayer = 'X';
  gameState.fill('');
  document.querySelectorAll('.cell').forEach(cell => (cell.innerHTML = ''));
  statusDisplay.innerHTML = "What is your move?";
}

document
  .querySelectorAll('.cell')
  .forEach(cell => cell.addEventListener('click', handleCellClick));
document
  .querySelector('.game--restart')
  .addEventListener('click', handleRestartGame);

// یافتن و انتخاب بهترین حرکت برای دایره
function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    // خانه‌های خالی رو بگیر و تک تک چک کن تا اونی که بالاترین امتیاز رو میاره انتخاب کنی
    if (gameState[i] === '') {
      gameState[i] = 'O';
      let score = minimax(gameState, 0, false);
      gameState[i] = '';
      // انتخاب خانه‌ای که بالاترین امتیاز رو میاره
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

// الگوریتم بررسی تمامی احتمالات بازی
function minimax(board, depth, isMaximizing) { // cell 0, depth 0, isMaximizing false
  let winner = null;

  // امتیاز رو به طبقه بالاتر میفرسته
  if (winner = checkWinner()) {
    return scores[winner];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      // خانه موردنظر خالیه؟
      if (board[i] === '') {
        // اگه دایره توی اون جای خالی قرار بگیره جریان چطور پیش میره؟
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        // برنده شدن دایره برابر با امتیاز بیشتر برای دایره هست
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      // خانه مورد نظر خالیه؟
      if (board[i] === '') {
        // اگه ضربدر توی اون جای خالی قرار بگیره جریان چطور پیش میره؟
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        // برنده شدن ضربدر برابر با امتیاز کمتر برای دایره هست
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

  // بررسی مساوی شدن و بازگردانی بازیکن برنده
  if (winner === null && openSpots === 0) {
    return 'tie';
  } else {
    return winner;
  }
}