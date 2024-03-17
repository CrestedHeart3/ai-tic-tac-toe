document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const playAgainButton = document.querySelector('.play-again');

    let currentPlayer = 'X';
    let boardState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    function checkWinner(board) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return null;
    }

    function checkTie(board) {
        return !board.includes('') && checkWinner(board) === null;
    }

    function checkGameStatus() {
        const winner = checkWinner(boardState);
        if (winner) {
            showModal(`${winner} Wins!`);
            gameActive = false;
        } else if (checkTie(boardState)) {
            showModal('It\'s a tie!');
            gameActive = false;
        }
    }

    function handleClick(index) {
        if (!gameActive || boardState[index] !== '' || currentPlayer === 'O') {
            return;
        }

        boardState[index] = currentPlayer;
        renderBoard();
        checkGameStatus();

        if (gameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = `Player ${currentPlayer}'s turn`;

            if (currentPlayer === 'O') {
                makeAIMove();
                checkGameStatus();
            }
        }
    }

    function makeAIMove() {
        const emptyCells = boardState.reduce((acc, value, index) => {
            if (value === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        if (emptyCells.length > 0) {
            let bestScore = -Infinity;
            let aiMove = -1;

            for (const index of emptyCells) {
                const tempBoard = [...boardState];
                tempBoard[index] = 'O';
                const score = miniMax(tempBoard, 0, false);
                tempBoard[index] = '';

                if (score > bestScore) {
                    bestScore = score;
                    aiMove = index;
                    console.log('Move:' + JSON.stringify(bestScore))
                }
            }

            setTimeout(() => {
                boardState[aiMove] = 'O';
                renderBoard();
                currentPlayer = 'X';
                status.textContent = `Player ${currentPlayer}'s turn`;
            }, 500);
        }
    }

    function miniMax(board, depth, isMaximizing) {
        const scores = {
            X: -1,
            O: 1,
            tie: 0
        };

        const winner = checkWinner(board);
        if (winner !== null) {
            return scores[winner];
        }

        if (checkTie(board)) {
            return scores.tie;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    const score = miniMax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    const score = miniMax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function renderBoard() {
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = boardState[i];
    
            if (boardState[i] === 'X') {
                cell.style.color = 'red';
            } else if (boardState[i] === 'O') {
                cell.style.color = 'blue';
            }
    
            cell.addEventListener('click', () => handleClick(i));
            board.appendChild(cell);
        }
    }
    

    function showModal(message) {
        const modal = document.getElementById('myModal');
        const modalMessage = document.getElementById('modalMessage');
        const modalPlayAgain = document.getElementById('modalPlayAgain');
        const closeModalButton = document.querySelector('.close');

        modalMessage.textContent = message;
        modal.style.display = 'block';

        modalPlayAgain.addEventListener('click', function () {
            modal.style.display = 'none';
            resetGame();
        });

        closeModalButton.addEventListener('click', function () {
            modal.style.display = 'none';
            resetGame();
        });

        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                resetGame();
            }
        });
    }

    function resetGame() {
        boardState = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        renderBoard();
        status.textContent = `Player ${currentPlayer}'s turn`;
    }

    renderBoard();

    const winnerCheckInterval = setInterval(checkGameStatus, 500);
});
