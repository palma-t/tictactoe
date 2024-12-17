const Gameboard = (function() {
    const board = Array(3).fill(null).map(() => Array(3).fill(null));

    const getBoard = () => board;

    const makeMove = (row, col, marker) => {
        if (board[row][col] === null) {
            board[row][col] = marker;
            return true;
        }
        return false;
    }

    const resetBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = null;
            }
        }
    };

    return { getBoard, makeMove, resetBoard };
})();


const GameController = (function() {

    const players = [
        {
            name: "Player 1",
            token: "X",
            rounds: 0,
        },
        {
            name: "Player 2",
            token: "O",
            rounds: 0,
        }
    ];

    const winningCombinations = [
        [[0, 0], [0, 1], [0, 2]], // Rows
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]], // Columns
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]], // Diagonals
        [[0, 2], [1, 1], [2, 0]],
    ];

    let activePlayerIndex = 0;

    const switchPlayer = () => {
        activePlayerIndex = activePlayerIndex === 0 ? 1 : 0;
    };

    const checkWin = (board) => {
        for( let combo of winningCombinations) {
            if(
                combo.every(
                    ([row, col]) => board[row][col] === players[activePlayerIndex].token
                )
            ) {
                return true
            }
        }
        return false;
    }

    const resetScore = (players) => {
        players[0].rounds = 0;
        players[1].rounds = 0;
    }

    const getPlayers = () => players;

    const resetGame = () => {
        Gameboard.resetBoard();
        activePlayerIndex = 0;
        GameController.resetScore(GameController.getPlayers());
        ScreenController.startGame();
    };

    const getActivePlayer = () => players[activePlayerIndex];

    return { switchPlayer, checkWin, resetScore, resetGame, getActivePlayer, getPlayers };
})();

const ScreenController = (function() {
    const playerTurnDiv = document.querySelector(".turn");
    const roundDiv = document.querySelector(".rounds");
    const boardDiv = document.querySelector(".board");
    const resetButton = document.querySelector(".reset");


    const renderBoard = (board) => {
        boardDiv.innerHTML = "";
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");
            cellButton.textContent = cell || "";
            cellButton.dataset.row = rowIndex;
            cellButton.dataset.col = colIndex;
            boardDiv.appendChild(cellButton);
            });
        });
    }

    const renderScore = (players) => {
        roundDiv.textContent = `${players[0].name}: ${players[0].rounds} 
        / ${players[1].name}: ${players[1].rounds}`
    }

    const updateTurnDisplay = (player) => {
        playerTurnDiv.textContent = `${player.name}'s turn (${player.token})`;
    };

    const setupEventListeners = (gameboard, gameController) => {
        boardDiv.addEventListener("click", (e) => {
            const row = e.target.dataset.row;
            const col = e.target.dataset.col;

            if(row === undefined || col === undefined) return;

            const activePlayer = gameController.getActivePlayer();

            if (gameboard.makeMove(row, col, activePlayer.token)){

                if (gameController.checkWin(gameboard.getBoard())) {
                    activePlayer.rounds++;
                    console.log(activePlayer.rounds);

                    if (activePlayer.rounds === 3) {
                        renderScore(gameController.getPlayers());
                        playerTurnDiv.textContent = `${activePlayer.name} wins!`;
                        boardDiv.innerHTML = "";
                        return;
                    }
                    
                    renderScore(gameController.getPlayers());
                    gameController.switchPlayer();
                    updateTurnDisplay(gameController.getActivePlayer());
                    Gameboard.resetBoard();
                    renderBoard(gameboard.getBoard());

                } else {

                    const isDraw = (board) => board.flat().every(cell => cell !== null);

                    if (isDraw(gameboard.getBoard())) {
                        playerTurnDiv.textContent = `It's a draw!`;
                        setTimeout(() => {
                            Gameboard.resetBoard();
                            renderBoard(gameboard.getBoard());
                            gameController.switchPlayer();
                            updateTurnDisplay(gameController.getActivePlayer());
                        }, 2000);
                        return;
                    }

                    renderBoard(gameboard.getBoard());
                    gameController.switchPlayer();
                    updateTurnDisplay(gameController.getActivePlayer());
                }

                renderScore(gameController.getPlayers());
            };
        });
    }

        const startGame = () => {
            const gameboard = Gameboard;
            const gameController = GameController;

            renderBoard(gameboard.getBoard());
            updateTurnDisplay(gameController.getActivePlayer());
            renderScore(GameController.getPlayers());
            resetButton.addEventListener("click", gameController.resetGame);
            setupEventListeners(gameboard, gameController);
        }

        return { startGame };
})();



ScreenController.startGame();

/* missing
dealing with rounds
*/