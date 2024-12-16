function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i] = [];
        }
      }

    board[0][0] = 1;
    board[0][1] = 2;
    board[0][2] = 3;
    board[1][0] = 4;
    board[1][1] = 5;
    board[1][2] = 6;
    board[2][0] = 7;
    board[2][1] = 8;
    board[2][2] = 9;

    const getBoard = () => board;

    const printBoard = () => {
        console.log(board);
      };

    return { getBoard, printBoard };
}


const GameController = (function(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: "X",
            playerCombinations: []
        },
        {
            name: playerTwoName,
            token: "O",
            playerCombinations: []
        }
    ];

    const winningCombinations = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7],
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    };

    const fillArray = (array) => {
        for (let cell of array){
            cell.addEventListener("click", () => {
                //check if cell is free
                if(cell != "X" && cell != "O"){
                    getActivePlayer.playerCombinations.push(cell);
                    cell = getActivePlayer.token;
                } else {
                    console.log("Choose an empty cell, you cheater!")
                };
            });
        }
    }

    const checkForWin = (whichPlayer) => {
        for (let i = 0; i < winningCombinations.length; i++) {
            for (var j = 0; j < winningCombinations[i].length; j++) {
                //console.log(winConditions[i][j]);
                //console.log(whichPlayer);
                if (whichPlayer.includes(winningCombinations[i][0]) 
                    && whichPlayer.includes(winningCombinations[i][1]) 
                    && whichPlayer.includes(winConditions[i][2]) 
                    && whichPlayer.length >= 3) {
                    return true;
                } else if (!whichPlayer.includes(winningCombinations[i][0]) 
                    && whichPlayer.includes(winningCombinations[i][1]) 
                    && whichPlayer.includes(winningCombinations[i][2]) 
                    && whichPlayer.length >= 3) {
                    break;
                } else {
                    false;
                }
            }
        }
    }

    const playRound = () => {

        //The player's array takes the number of the cell
        // the cell takes the token of the player 
        fillArray(board);

        //check for winner
        if(checkForWin(activePlayer)){
            return `${getActivePlayer().name} wins!`
        }
        else{
            //switch player turn
            switchPlayerTurn();
            printNewRound()
        };
    };

    printNewRound();

    return { playRound, getActivePlayer };

})();