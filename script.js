const cells = document.querySelectorAll('[data-cell]');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restart');
const difficultyButtons = document.getElementById('difficulty-buttons');
let difficulty = 'medium'; // Default difficulty

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameOver = false;

function checkWinner() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes('') ? null : 'T';
}

function handleClick(event) {
    if (gameOver) return;

    const cell = event.target;
    const index = Array.from(cells).indexOf(cell);

    if (board[index] || cell.classList.contains('x') || cell.classList.contains('o')) return;

    board[index] = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.textContent = currentPlayer;

    const winner = checkWinner();

    if (winner) {
        statusElement.textContent = winner === 'T' ? "It's a tie!" : `${winner} wins!`;
        gameOver = true;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (currentPlayer === 'O') {
        setTimeout(() => {
            if (difficulty === 'easy') easyAiMove();
            if (difficulty === 'medium') mediumAiMove();
            if (difficulty === 'hard') hardAiMove();
        }, 500);
    }
}

function easyAiMove() {
    let availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    let move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeMove(move);
}

function mediumAiMove() {
    let bestMove = findBestMove(false);
    makeMove(bestMove);
}

function hardAiMove() {
    let bestMove = findBestMove(true);
    makeMove(bestMove);
}

function findBestMove(isHard) {
    let bestScore = isHard ? -Infinity : 0;
    let bestMove = null;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            const score = minimax(board, 0, false, isHard);
            board[i] = '';
            if ((isHard && score > bestScore) || (!isHard && score >= bestScore)) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing, isHard) {
    const winner = checkWinner();
    if (winner === 'X') return -10;
    if (winner === 'O') return 10;
    if (winner === 'T') return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                const score = minimax(board, depth + 1, false, isHard);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                const score = minimax(board, depth + 1, true, isHard);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function makeMove(move) {
    if (move !== null) {
        board[move] = 'O';
        cells[move].classList.add('o');
        cells[move].textContent = 'O';

        const winner = checkWinner();
        if (winner) {
            statusElement.textContent = winner === 'T' ? "It's a tie!" : `${winner} wins!`;
            gameOver = true;
            return;
        }

        currentPlayer = 'X';
    }
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
    cells.forEach(cell => {
        cell.classList.remove('x', 'o');
        cell.textContent = '';
    });
    statusElement.textContent = '';
}

function selectDifficulty(event) {
    difficulty = event.target.id;
    restartGame();
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartButton.addEventListener('click', restartGame);
difficultyButtons.addEventListener('click', selectDifficulty);
