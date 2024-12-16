function Gameboard() {
    const board = Array(3).fill(null).map(() => Array(3).fill(null));

    const getBoard = () => board;

    const makeMove = (row, col, marker) => {
        if (board[row][col] === null) {
            board[row][col] = marker;
            return true;
        }
        return false;
    }

    const reset = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = null;
            }
        }
    };

    return { getBoard, makeMove, reset };
};


const GameController = (function() {

    const players = [
        {
            name: "Player 1",
            token: "X",
        },
        {
            name: "Player 2",
            token: "O",
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

    const getActivePlayer = () => players[activePlayerIndex];

    return { switchPlayer, checkWin, getActivePlayer };
})();

const ScreenController = (function() {
   // const game = GameController();

    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const renderBoard = (board) => {
        //pas un problème d'utiliser innnerHTML ?
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

    const updateTurnDisplay = (player) => {
        playerTurnDiv.textContent = `${player.name}'s turn (${player.token})`;
    };

    const setupEventListeners = (gameboard, gameController) => {
        boardDiv.addEventListener("click", (e) => {
            const row = e.target.dataset.row;
            const col = e.target.dataset.col;

            if(row === undefined || col === undefined) return; //not a cell

            const activePlayer = gameController.getActivePlayer();

            if (gameboard.makeMove(row, col, activePlayer.token)){
                renderBoard(gameboard.getBoard());

                if (gameController.checkWin(gameboard.getBoard())) {
                    playerTurnDiv.textContent = `${activePlayer.name} wins!`;
                    boardDiv.innerHTML = "";
                    return;
                }
                
                gameController.switchPlayer();
                updateTurnDisplay(gameController.getActivePlayer());
            };
        });
    }

        const startGame = () => {
            const gameboard = Gameboard();
            const gameController = GameController;

            renderBoard(gameboard.getBoard());
            updateTurnDisplay(gameController.getActivePlayer());
            setupEventListeners(gameboard, gameController);
        }

        return { startGame };
})();

ScreenController.startGame();




/* missing
dealing with rounds
reset button
changing the design!
*/