const cells = document.querySelectorAll('[data-cell]');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restart');

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
    cell.textContent = currentPlayer; // Add this line to set the text content
    
    const winner = checkWinner();
    
    if (winner) {
        if (winner === 'T') {
            statusElement.textContent = "It's a tie!";
        } else {
            statusElement.textContent = `${winner} wins!`;
        }
        gameOver = true;
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    if (currentPlayer === 'O') {
        setTimeout(aiMove, 500);
    }
}

function minimax(board, depth, isMaximizing) {
    const winner = checkWinner();
    if (winner === 'X') return -10;
    if (winner === 'O') return 10;
    if (winner === 'T') return 0;
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                const score = minimax(board, depth + 1, false);
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
                const score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function aiMove() {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            const score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== null) {
        board[bestMove] = 'O';
        cells[bestMove].classList.add('o');
        cells[bestMove].textContent = 'O'; // Add this line to set the text content
        
        const winner = checkWinner();
        
        if (winner) {
            if (winner === 'T') {
                statusElement.textContent = "It's a tie!";
            } else {
                statusElement.textContent = `${winner} wins!`;
            }
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
        cell.textContent = ''; // Clear text content
    });
    statusElement.textContent = '';
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartButton.addEventListener('click', restartGame);
