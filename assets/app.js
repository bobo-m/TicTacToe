// Webpage Components
   // Clickable Buttons
const playerChoice = document.querySelector(".choices-toggle");
const cpuBtn = document.getElementById('vs-cpu');
const playerBtn = document.getElementById('vs-player');
const cellContainer = document.getElementById('cell-container')
const cells = document.querySelectorAll('.cell');
const nextRoundBtn = document.querySelector('.next-round');
const reloadBtn = document.querySelector('.restart-game');

   // Layout Components
const gameStart = document.querySelector('.start-game');
const gameActive = document.querySelector('.game-active');
const resultSection = document.getElementById('round-results');
const scoreBox ={
    x: document.getElementById('x-score'),
    ties: document.getElementById('ties-score'),
    o: document.getElementById('o-score')
}

// Game Variables
let player1;
let currPlayer = 'x';
let gameMode; // 0 -> cpu ; 1 -> multiplayer
let gameState = ['','','','','','','','',''];
const winSequences = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
const score ={x : 0, ties : 0, o : 0};

// Event Triggered Functions

function getPlayer1(event){
    cpuBtn.disabled = false;
    playerBtn.disabled = false; 
    const p1Container = event.target;
    player1 = p1Container.id;
    handleChoiceBoxHover(p1Container);
    styleScoreBox();
} 

function startCpuGame(){
    gameMode = 0;
    const aiPlayer = player1 == 'x' ? 'o' : 'x';
    cpuScoreBox(aiPlayer);
    handleGameStartLayout();
    if(aiPlayer == currPlayer){
        const cpuFirstMove = getCpuFirstMove();
        markCell(cpuFirstMove, aiPlayer);
        handlePlayerChange();       
    }
}

function startPlayerGame(){
    gameMode = 1;
    handleGameStartLayout();
}

function handleCellClick(event){
    const clickedCellIndex = event.target.getAttribute('cell-index');
    markCell(clickedCellIndex, currPlayer);
    handleResultValidation();
    handlePlayerChange();
    
    if(gameMode === 0){
        const cpuMove = getCpuMove(gameState, currPlayer);
        const cpuIndex = cpuMove.index;

        markCell(cpuIndex, currPlayer);
        handleResultValidation();
        handlePlayerChange();
    }
}

// Functions to Implement Game Logic

// Generates a random index for cpu to play the first move if cpu is the first player
function getCpuFirstMove(){
    const cpuFirstMove = Math.floor(Math.random() * 8);
    return cpuFirstMove;
}

// Changes the current player
function handlePlayerChange(){
    currPlayer = currPlayer == 'x' ? 'o' : 'x';
    styleCurrentTurn();
    // Changes the hover class whenever the current player is changed
    changeCellHover();
}

// Functions to check for tie and win condititons and and a handleResultValidation to trigger game end

function checkWin(state, player = currPlayer){
    for(const seq of winSequences){
        if(state[seq[0]] === state[seq[1]] && state[seq[1]] === state[seq[2]] && state[seq[0]] !== '' && state[seq[0]]===player){
            window.sequence = [seq[0], seq[1], seq[2]];
            return true;
        }
    }
    return false;
}

function checkTie(state){
    if(!state.includes('')){
        return true;
    }
    return false;
}

function handleResultValidation(){
    if(checkWin(gameState)){
        handleWin();
    }else if(checkTie(gameState)){
        handleTie();
    }
}

function handleWin(){
    handleWinStyling(sequence);
    displayResultSection();
    displayWinnerMessage();
    score[currPlayer]++; 
    parseScore();   
}

function handleTie(){
    displayResultSection();
    displayTieMessage();
    score.ties++;
    parseScore();
}

function handleNextRound(){
    gameState = ['','','','','','','','',''];
    hideResultSection();
    if(currPlayer === 'o'){
        handlePlayerChange();
    }
    gameMode === 0 ? startCpuGame() : startPlayerGame();
}

function handleReload(){
    gameState = ['','','','','','','','',''];
    if(currPlayer === 'o'){
        handlePlayerChange();
    }
    initScore();
    parseScore();    
    gameMode === 0 ? startCpuGame() : startPlayerGame();
}
// Helper Functions

// Marks the cell at the given index and reflects the changes in the game state
function markCell(index, player){
    gameState[index] = player;
    cells[index].classList.add('played');
    cells[index].classList.add(`${currPlayer}-mark`);
}

function displayWinnerMessage(){
    const winnerPara = resultSection.querySelector('.winner');
    const winnerImg = resultSection.querySelector('img');
    const winnerHeading = resultSection.querySelector('h3');
    if(gameMode === 1){
        if(player1 === currPlayer){
            winnerPara.textContent = 'Player 1 Won!';
        }else{
            winnerPara.textContent = 'Player 2 Won!';
        }
    }else{
        if(player1 === currPlayer){
            winnerPara.textContent = 'You Won!';
        }else{
            winnerPara.textContent = 'Oh No, You Lost...';
        }
    }
    winnerImg.style.display = ('block');
    winnerImg.setAttribute('src',`assets/images/icon-${currPlayer}.svg`);
    winnerHeading.textContent = 'takes the round';
}

function displayTieMessage(){
    const winnerPara = resultSection.querySelector('.winner');
    const winnerHeading = resultSection.querySelector('h3');
    const winnerImg = resultSection.querySelector('img');
    winnerImg.setAttribute('src','');
    winnerImg.style.display = ('none');
    winnerHeading.textContent = 'Round Tied';
    winnerPara.textContent = '';
}

function initScore(){
    score.x = 0;
    score.ties = 0;
    score.o = 0;
}

function parseScore(){
    scoreBox.x.textContent = score.x;
    scoreBox.ties.textContent = score.ties;
    scoreBox.o.textContent = score.o;
}

function getCpuMove(state, player){
    const availSpots = getEmptyIndexes(state);
    let huPlayer = player1;
    let aiPlayer = huPlayer === 'x' ? 'o' : 'x';
    if(checkWin(state, aiPlayer)){
        return {score : 10};
    } 
    else if(checkWin(state, huPlayer)){
        return {score : -10};
    }
    else if(availSpots.length===0){
        return {score : 0};
    } 

    let moves = [];
    for(let i = 0; i < availSpots.length; i++){
        let move = {};
        move.index = availSpots[i];
        state[availSpots[i]] = player;
    
        if(player === aiPlayer){
            let result = getCpuMove(state, huPlayer);
            move.score = result.score;
        }else{
            let result = getCpuMove(state, aiPlayer);
            move.score = result.score;
        }
        state[availSpots[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if(player === huPlayer){
        let bestScore = 1000;
        for(let i = 0; i < moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }else{
        let bestScore = -1000;
        for(let i = 0; i < moves.length; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function getEmptyIndexes(state){
    const emptyIndexes=[];
    for(let i = 0; i < state.length; i++){
        if(state[i]=='')
        emptyIndexes.push(i);
    }
    return emptyIndexes;
}

// Styling Functions

function styleScoreBox(){
    const scoreBoxX = document.querySelector('.player-x');
    const scoreBoxO = document.querySelector('.player-o');

    if(player1 == 'x'){
        scoreBoxX.textContent += '(P1)';
        scoreBoxO.textContent += '(P2)';
    }else{
        scoreBoxX.textContent += '(P2)';
        scoreBoxO.textContent += '(P1)';
    }
}

function cpuScoreBox(aiPlayer){
    const scoreBoxAi = document.querySelector(`.player-${aiPlayer}`);
    scoreBoxAi.textContent = `${aiPlayer} (CPU)`;
}

// Gives radio button styling to the player choice toggle
function handleChoiceBoxHover(p1Container){
    p1Container.classList.remove("unselected");
    p1Container.classList.add("selected");
    const unselected = document.getElementById(p1Container.id == "x" ? "o" : "x");
    unselected.classList.remove("selected");
    unselected.classList.add("unselected");
}

function styleCurrentTurn(){
    const currentTurn = document.querySelector(`.current-turn--img`);
    currentTurn.setAttribute('src', `./assets/images/icon-${currPlayer}.svg`);
}

// Hides the start game section and displays the gameboard
function handleGameStartLayout(){
    gameStart.classList.add('hidden');
    gameActive.classList.remove('hidden');
    cellContainer.className = 'x-hover';

    for(const cell of cells){
        cell.className = 'cell';
    }
}

// Changes the hover class so cell hover shows different symbols depending on the current player
function changeCellHover(){
    cellContainer.classList.remove(`${currPlayer == 'x' ? 'o' : 'x'}-hover`);
    cellContainer.classList.add(`${currPlayer}-hover`);
}

// Styles the winning sequence whenever there is a win
function handleWinStyling(){
    for(const seq of sequence){
        cells[seq].classList.add(`win-sequence-${currPlayer}`);
    }
}

function displayResultSection(){
    resultSection.classList.remove('hidden');
}

function hideResultSection(){
    resultSection.classList.add('hidden');
}

// Event Listeners

playerChoice.addEventListener('click', getPlayer1);
cpuBtn.addEventListener('click', startCpuGame);
playerBtn.addEventListener('click', startPlayerGame);
cellContainer.addEventListener('click', handleCellClick);
nextRoundBtn.addEventListener('click', handleNextRound);
reloadBtn.addEventListener('click', handleReload);


