const choices= document.querySelector(".choices-container");
const vsPlayer = document.getElementById("vs-player");
const vsCpu = document.getElementById("vs-cpu");
const nextRound = document.querySelector('.next-round');
//replacing layout
const startGameSection = document.querySelector(".start-game");
const activeGameSection = document.querySelector(".game-active");
const resultDisplay = document.getElementById('round-results');
const restartGame = document.querySelector('.restart-game');
let currentPlayer='x';
const player1 = document.querySelector('.choices-toggle');
//variables for game logic
const cellContainer = document.querySelector('.cell-container');
const cells = document.querySelectorAll(".cell");
let gameState =[0,1,2,3,4,5,6,7,8];
const winSequences=[
    [0,1,2]
   ,[3,4,5]
   ,[6,7,8]
   ,[0,3,6]
   ,[1,4,7]
   ,[2,5,8]
   ,[0,4,8]
   ,[2,4,6]
];
let gameActive=false;
let xScoreCount=0;
let tiesScoreCount=0;
let oScoreCount=0;
const xScore=document.getElementById('x-score');
const tiesScore=document.getElementById('ties-score');
const oScore=document.getElementById('o-score');
let p1;
let huPlayer='x';
let aiPlayer;
function generateRandomMove(){
    let randomIndex = Math.floor(Math.random()*8);
    return randomIndex;
}
function getPlayer1(event){
    const selected=event.target;
    p1=selected.id;
    let unselected;
    p1==='x'?unselected=document.getElementById('o'):unselected=document.getElementById('x');
    selected.classList.add('selected');
    selected.classList.remove('unselected');
    unselected.classList.add('unselected');
    unselected.classList.remove('selected');
    huPlayer=p1;
}
function startGame(mode){
    startGameSection.classList.add("hidden");
    activeGameSection.classList.remove("hidden");
    gameActive=true;
    displayScore();
    if(mode==='mplayer'){
        cellContainer.addEventListener('click',handleCellClick);
        huPlayer==='x';
    }else if(mode='splayer'){
        huPlayer==='x'? aiPlayer='o': aiPlayer='x';
        if(huPlayer==='o'){
            handleCpuFirstMove();
        }
        cellContainer.addEventListener('click',handleCpuGame);
    }
}
function handleCpuFirstMove(){
    let aiIndex=generateRandomMove();
    cells[aiIndex].removeEventListener('mouseleave',cellHoverLeave);
    cells[aiIndex].removeEventListener('mouseenter',cellHoverEnter);
    cells[aiIndex].style.backgroundImage = ('url(assets/images/icon-x.svg)');
    gameState[aiIndex]='x';
}
function handleCpuGame(event){
    event.target.removeEventListener('mouseleave',cellHoverLeave);
    event.target.removeEventListener('mouseenter',cellHoverEnter);
    const index = parseInt(event.target.getAttribute('cell-index'));
    if(typeof gameState[index]!=='number'|| !gameActive){
        return;
    }
    if(huPlayer==='x'){
        event.target.style.backgroundImage = ('url(assets/images/icon-x.svg)');
        gameState[index]='x';
        handleResultValidation(gameState,'mplayer',huPlayer);
        let bestMove=getCpuMove(gameState,aiPlayer);
        let aiIndex=bestMove.index;
        cells[aiIndex].style.backgroundImage = ('url(assets/images/icon-o.svg)');
        cells[aiIndex].removeEventListener('mouseleave',cellHoverLeave);
        cells[aiIndex].removeEventListener('mouseenter',cellHoverEnter);
        gameState[aiIndex]='o';
        handleResultValidation(gameState,'mplayer',aiPlayer);
    }else{
        event.target.style.backgroundImage = ('url(assets/images/icon-o.svg)');
        gameState[index]='o';
        handleResultValidation(gameState,'mplayer',huPlayer);
        let bestMove=getCpuMove(gameState,aiPlayer);
        let aiIndex=bestMove.index;
        cells[aiIndex].style.backgroundImage = ('url(assets/images/icon-x.svg)');
        cells[aiIndex].removeEventListener('mouseleave',cellHoverLeave);
        cells[aiIndex].removeEventListener('mouseenter',cellHoverEnter);
        gameState[aiIndex]='x';
        handleResultValidation(gameState,'mplayer',aiPlayer);
    }
    
}
function displayScore(){
    const playerX=document.querySelector(".player-x");
    const playerO=document.querySelector(".player-o");
    if(p1===undefined || p1==='x'){
        playerX.innerHTML=(`X (P1)`);
        playerO.innerHTML=(`O (P2)`);
    }else{
        playerX.innerHTML=(`X (P2)`);
        playerO.innerHTML=(`O (P1)`);
    }
}
//minimax algo
function getCpuMove(currentState,player){
    const availSpots=getEmptyIndexes(currentState);
    if(handleResultValidation(currentState,'splayer',huPlayer)){
        return{score:-10};
    }else if(handleResultValidation(currentState,'splayer',aiPlayer)){
        return{score:10};
    }else if(availSpots.length===0){
        return{score:0};
    }
    let moves = [];
    for(let i=0;i<availSpots.length;i++){
        let move={};
        move.index=availSpots[i];
        currentState[availSpots[i]]=player;
        if(player===aiPlayer){
            let result=getCpuMove(currentState,huPlayer);
            move.score=result.score;
        }else{
            let result=getCpuMove(currentState,aiPlayer);
            move.score=result.score;
        }
        currentState[availSpots[i]]=move.index;
        moves.push(move);
    }    
    let bestMove;
        if(player===huPlayer){
            let bestScore=1000;
            for(let i=0;i<moves.length;i++){
                if(moves[i].score<bestScore){
                    bestScore=moves[i].score;
                    bestMove=i;
                }
            }
        }else{
            {
                let bestScore=-1000;
                for(let i=0;i<moves.length;i++){
                    if(moves[i].score>bestScore){
                        bestScore=moves[i].score;
                        bestMove=i;
                    }
                }
            }
        }
    return moves[bestMove];
}
function getEmptyIndexes(currentState){
    return currentState.filter(index=>typeof(index)==('number'));
}
function handleCellClick(event){
    const cellIndex=event.target;
    const index = parseInt(event.target.getAttribute('cell-index'));
    if(typeof gameState[index]!=='number'|| !gameActive){
        return;
    }
    placeMark(cellIndex,currentPlayer)
    gameState[index]=currentPlayer;
    handleResultValidation(gameState);
    changeHoverClass(cellIndex,currentPlayer);
    handlePlayerChange();
}
function handlePlayerChange(){
    currentPlayer==='x' ? currentPlayer='o' :currentPlayer='x' ;
}
function handleResultValidation(currentState, mode='mplayer', player=currentPlayer){
    let roundWon=false;
    let wonSequence=[];
    for(const sequence of winSequences){
        const a = currentState[sequence[0]];
        const b = currentState[sequence[1]];
        const c = currentState[sequence[2]];
        if(typeof(a) =='number'||typeof(b) =='number'||typeof(c) =='number'){
            continue;
        }
        if(a==b && b==c && c==player){
            roundWon=true;
            if(mode==='splayer'){
                return true;
            }
            wonSequence=sequence;
            break;
        }
    }
    if(!roundWon && mode==='splayer'){
        return false;
    }
    if(roundWon){
        styleWinPattern(wonSequence);
        handleResult(player);
        gameActive=false;
        return;
    }
    let roundDraw= getEmptyIndexes(currentState);
    if(roundDraw.length==0){
        gameActive=false;
        handleResult();
    }
}
function styleWinPattern(sequence){
    for(let i=0;i<3;i++){
        cells[sequence[i]].classList.add(`win-sequence-${currentPlayer}`);
    }
}
function handleResult(result){
    const winner = document.querySelector('.winner');
    const winnerMessage = document.querySelector('.winner-message');
    resultDisplay.classList.remove('hidden');
    
    while(winnerMessage.hasChildNodes()){
        winnerMessage.removeChild(winnerMessage.firstElementChild);
    }
    if (result==='x'){
        winner.innerHTML=`PLAYER ${p1==='x'||p1===undefined?1:2} WINS!!`;
        const image=document.createElement('img');
        image.setAttribute('src','assets/images/icon-x.svg');
        winnerMessage.appendChild(image);
        const resultText = document.createElement('h3');
        resultText.innerHTML="takes the round";
        resultText.style.color=('rgba(49,195,189,255)');
        winnerMessage.appendChild(resultText);
        xScoreCount++;
        xScore.innerHTML=`${xScoreCount}`;
    }else if(result==='o'){
        winner.innerHTML=`PLAYER ${p1==='o'?1:2} WINS!!`;
        const image=document.createElement('img');
        image.setAttribute('src','assets/images/icon-o.svg');
        winnerMessage.appendChild(image);
        const resultText = document.createElement('h3');
        resultText.innerHTML="takes the round";
        resultText.style.color=('rgba(249,177,56,255)');
        winnerMessage.appendChild(resultText);
        oScoreCount++;
        oScore.innerHTML=`${oScoreCount}`;
    }else{
        const resultText = document.createElement('h3');
        resultText.innerHTML="round tied";
        resultText.style.color=('rgba(168,191,201,255)');
        winnerMessage.appendChild(resultText);
        tiesScoreCount++;
        tiesScore.innerHTML=`${tiesScoreCount}`;
    }
}

function resetCells(){
    resultDisplay.classList.add('hidden');
    for(const cell of cells){
        cell.className = ('cell');
    }
    cellContainer.className=('cell-container x-hover');
}
function handleNextRound(){
    resetCells();
    currentPlayer='x';
    gameState =[0,1,2,3,4,5,6,7,8];    
    gameActive=true;
    if(aiPlayer==='x'){
        handleCpuFirstMove();
    }
}
function handleRestart(){
    gameState =[0,1,2,3,4,5,6,7,8]; 
    gameActive=true;
    currentPlayer='x';
    resetCells();
    xScoreCount=0;
    tiesScoreCount=0;
    oScoreCount=0;
    xScore.innerHTML = 0;
    tiesScore.innerHTML = 0;
    oScore.innerHTML = 0;
    if(aiPlayer==='x'){
        handleCpuFirstMove();
    }
}
//hover effect
function changeHoverClass(cellIndex,player){
    cellContainer.classList.remove(`${player}-hover`);
    cellContainer.classList.add(`${player==='x'?'o':'x'}-hover`);
    cellIndex.classList.add('played');
}
function placeMark(cellIndex,player){
    cellIndex.classList.add(`${player}-mark`);
}
restartGame.addEventListener('click',handleRestart);
nextRound.addEventListener('click',handleNextRound);
vsPlayer.addEventListener('click',()=>{
    startGame('mplayer');
});
vsCpu.addEventListener('click',()=>{
    startGame('splayer');
});
player1.addEventListener('click',getPlayer1);
// choices.addEventListener('click',getCurrentPlayer);