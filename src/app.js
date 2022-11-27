let turn;
let movesCounter = 0;
const scoreCounter = {
    x: 0,
    tie: 0,
    o: 0,
};

// the winStates are used as classnames for respective html elements.
const winStates = ["r1", "r2", "r3", "c1", "c2", "c3", "d1", "d2"];

// class to create X and O win states counters.
class CreateWinStatesCounters {
    constructor() {
        winStates.forEach((winState) => {
            this[winState] = 0;
        });
    }
}

const winStatesCounters = {
    x: new CreateWinStatesCounters(),
    o: new CreateWinStatesCounters(),
};

// ----------  SELECTORS ----------

// Pages and Modals
const startPage = document.querySelector("#start");
const gamePage = document.querySelector("#game");
const modalContainer = document.querySelector("#modal-container");
const resultModal = modalContainer.querySelector("#result-modal");
const restartModal = modalContainer.querySelector("#restart-modal");

// start page elements
const pickX = document.querySelector(".pick-x");
const pickO = document.querySelector(".pick-o");
const pickXImg = pickX.querySelector("img");
const pickOImg = pickO.querySelector("img");
const newGameVsCpu = startPage.querySelector(".new-game .vs-cpu");
const newGameVsPlayer = startPage.querySelector(".new-game .vs-player");

// game page elements
const turnIndicatorImg = document.querySelector(".turn-indicator img");
const restartBtn = document.querySelector(".restart");
const cells = document.querySelectorAll(".board .cell");
const xScoreBlock = document.querySelector(".scoreboard .x-score");
const oScoreBlock = document.querySelector(".scoreboard .o-score");
const tieScoreBlock = document.querySelector(".scoreboard .tie-score");
const xScore = xScoreBlock.querySelector(".score");
const oScore = oScoreBlock.querySelector(".score");
const tieScore = tieScoreBlock.querySelector(".score");

// restart, result modal elements
const cancelRestartBtn = restartModal.querySelector(".negative-action");
const confirmRestartBtn = restartModal.querySelector(".positive-action");
const resultHead = resultModal.querySelector("h2");
const nextRoundBtn = resultModal.querySelector(".positive-action");
const quitGameBtn = resultModal.querySelector(".negative-action");

// --------------- EVENTS -----------------

// start page
pickX.addEventListener("click", selectX);
pickO.addEventListener("click", selectO);
newGameVsCpu.addEventListener("click", startNewGame);
newGameVsPlayer.addEventListener("click", startNewGame);

// game page
restartBtn.addEventListener("click", () => {
    toggleModal("restart", true);
});
cells.forEach((cell) => {
    cell.addEventListener("click", cellOnClick);
    cell.addEventListener("mouseover", (e) => {
        cellHover(e.target, true);
    });
    cell.addEventListener("mouseout", (e) => {
        cellHover(e.target, false);
    });
    // cell.setAttribute("onmouseout", "cellHover(this)");
});

// restart, results modals
confirmRestartBtn.addEventListener("click", confirmRestart);
cancelRestartBtn.addEventListener("click", () => {
    toggleModal("restart", false);
});
quitGameBtn.addEventListener("click", quitGame);
nextRoundBtn.addEventListener("click", nextRound);

// ----------------- FUNCTIONS ---------------

// Functions to Pick X and O as 1p mark.

function selectX() {
    pickO.classList.remove("selected");
    pickOImg.setAttribute("src", "assets/icon-o-silver.svg");
    pickX.classList.add("selected");
    pickXImg.setAttribute("src", "assets/icon-x-dark.svg");
}

function selectO() {
    pickX.classList.remove("selected");
    pickXImg.setAttribute("src", "assets/icon-x-silver.svg");
    pickO.classList.add("selected");
    pickOImg.setAttribute("src", "assets/icon-o-dark.svg");
}

// start a new game with selected mark and opponent.
function startNewGame() {
    startPage.classList.add("hide");
    gamePage.classList.remove("hide");

    turn = "x";
    updateTurnIndicator();
    clearGameBoard();
    resetScoreCounters();
}

function cellHover(cell, hoverStatus) {
    let srcValue;

    hoverStatus
        ? (srcValue = `assets/icon-${turn}-outline.svg`)
        : (srcValue = "");

    if (!cell.classList.contains("clicked-cell")) {
        turn === "x"
            ? cell.firstElementChild.setAttribute("src", srcValue)
            : cell.firstElementChild.setAttribute("src", srcValue);
    }
}

// a series of actions to take place in sequential order, when a cell on game-board is clicked.
function cellOnClick(e) {
    const clickedCell = e.target;
    let endGame = 0;

    if (!clickedCell.classList.contains("clicked-cell")) {
        clickedCell.classList.add("clicked-cell");
        movesCounter++; // update moves counter

        // Marks the cells with X,O.
        clickedCell.firstElementChild.setAttribute(
            "src",
            `assets/icon-${turn}.svg`
        );

        clickedCell.classList.forEach((classItem) => {
            if (classItem !== "cell" && classItem !== "clicked-cell") {
                winStatesCounters[turn][classItem] += 1; // update winStates counters

                // check for win
                if (
                    movesCounter > 4 &&
                    winStatesCounters[turn][classItem] === 3
                ) {
                    scoreCounter[turn]++;
                    endGame = 1;
                    resultHead.innerText = `${turn} WON`;
                }
            }
        });

        if (movesCounter === 9 && !endGame) {
            scoreCounter.tie++;
            endGame = 1;
            resultHead.innerText = "Tie match";
        }
        if (endGame) {
            updateScoreBoard();
            toggleModal("results", true);
        }

        turn === "x" ? (turn = "o") : (turn = "x"); // switches turn value
        updateTurnIndicator();
    }
}

// Updates the turn indicator image
function updateTurnIndicator() {
    turn === "x"
        ? turnIndicatorImg.setAttribute("src", "assets/icon-x.svg")
        : turnIndicatorImg.setAttribute("src", "assets/icon-o.svg");
}

// updates scoreboard
function updateScoreBoard() {
    xScore.innerText = scoreCounter.x;
    oScore.innerText = scoreCounter.o;
    tieScore.innerText = scoreCounter.tie;
}

// Clean board for a new round/game
function clearGameBoard() {
    // removes visual changes of a clicked cell
    cells.forEach((cell) => {
        cell.classList.remove("clicked-cell");
        cell.firstElementChild.setAttribute("src", "");
    });

    movesCounter = 0; // reset moves counter

    // resets winning states counters
    winStates.forEach((winState) => {
        winStatesCounters.x[winState] = 0;
        winStatesCounters.o[winState] = 0;
    });
}

// ---------------- Counters ------------------------

// resets score counters
function resetScoreCounters() {
    scoreCounter.x = 0;
    scoreCounter.o = 0;
    scoreCounter.tie = 0;
    updateScoreBoard();
}

// ------------ Modals related functions ---------------

// toggle modals visibility
function toggleModal(modalName, visibile) {
    console.log(modalName);
    if (visibile) {
        modalContainer.classList.remove("hide");
        if (modalName === "results") resultModal.classList.remove("hide");
        if (modalName === "restart") restartModal.classList.remove("hide");
    } else {
        modalContainer.classList.add("hide");
        if (modalName === "results") resultModal.classList.add("hide");
        if (modalName === "restart") restartModal.classList.add("hide");
    }
}

// Quit entire game and return to start page
function quitGame() {
    toggleModal("results", false);
    startPage.classList.remove("hide");
    gamePage.classList.add("hide");
}

// Restart game with previously choosen opponent and mark.
function confirmRestart() {
    clearGameBoard();
    resetScoreCounters();
    modalContainer.classList.add("hide");
    restartModal.classList.add("hide");
}

// just another round, scores still counting.
function nextRound() {
    toggleModal("results", false);
    clearGameBoard();
}
