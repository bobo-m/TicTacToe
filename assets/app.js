const choices= document.querySelector(".choices-toggle");
const vsPlayer = document.getElementById("vs-player");
const nextRound = document.querySelector('.next-round');
//replacing layout
const startGameSection = document.querySelector(".start-game");
const activeGameSection = document.querySelector(".game-active");
const resultDisplay = document.getElementById('round-results');
const restartGame = document.querySelector('.restart-game');
let currentPlayer='x';
//variables for game logic
const cellContainer = document.querySelector('.cell-container');
const cells = document.querySelectorAll(".cell");
let gameState =['','','','','','','','',''];
const winSequences=[
    [0,1,2]
   ,[3,4,5]
   ,[6,7,8]
   ,[0,3,6]
   ,[1,4,7]
   ,[1,5,8]
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
//  function getCurrentPlayer(event){
//      const choiceX= choices.querySelector(".choices-x");
//      const choiceO=choices.querySelector(".choices-o");
//      const choiceImgX=choiceX.querySelector('.choices');
//      const choiceImgO=choiceO.querySelector('.choices')
//      if(event.target===choiceX){
//          currentPlayer='x';
//          choiceX.style.backgroundColor=('rgba(168,191,201,255)');
//          choiceImgX.style.fill=('rgba(26,42,50,255)');
//          choiceO.style.backgroundColor=('rgba(26,42,50,255)');
//          choiceImgO.style.fill=('rgba(168,191,201,255)');
//      }else{
//          currentPlayer='o';
//          choiceO.style.backgroundColor=('rgba(168,191,201,255)');
//          choiceImgO.style.fill=('rgba(26,42,50,255)');
//          choiceX.style.backgroundColor=('rgba(26,42,50,255)');
//          choiceImgX.style.fill=('rgba(168,191,201,255)');
//      }   
//  }
function startGame(){
    startGameSection.classList.add("hidden");
    activeGameSection.classList.remove("hidden");
    gameActive=true;
}
function handleCellClick(event){
    event.target.removeEventListener('mouseleave',cellHoverLeave);
    event.target.removeEventListener('mouseenter',cellHoverEnter);
    const index = parseInt(event.target.getAttribute('cell-index'));
    if(gameState[index]!==''|| !gameActive){
        return;
    }
    if(currentPlayer==='x'){
        event.target.style.backgroundImage = ('url(assets/images/icon-x.svg)');
        gameState[index]='x';
    }else{
        event.target.style.backgroundImage = ('url(assets/images/icon-o.svg)');
        gameState[index]='o';
    }
    handleResultValidation();
    handlePlayerChange();
}
function handlePlayerChange(){
    currentPlayer==='x' ? currentPlayer='o' :currentPlayer='x' ;
}
function handleResultValidation(){
    let roundWon=false;
    let wonSequence=[];
    for(const sequence of winSequences){
        const a = gameState[sequence[0]];
        const b = gameState[sequence[1]];
        const c = gameState[sequence[2]];
        if(a ==''||b ==''||c ==''){
            continue;
        }
        if(a==b && b==c){
            roundWon=true;
            wonSequence=sequence;
            break;
        }
    }
    if(roundWon){
        for(let i=0;i<3;i++){
            if(currentPlayer==='x'){
                cells[wonSequence[i]].style.backgroundImage = ('url(assets/images/icon-x-bg.svg)');
                cells[wonSequence[i]].style.backgroundColor = ('rgba(49,195,189,255)');

            }else{
                cells[wonSequence[i]].style.backgroundImage = ('url(assets/images/icon-o-bg.svg)');
                cells[wonSequence[i]].style.backgroundColor = ('rgba(249,177,56,255)');
            }
        }
        handleResult(currentPlayer);
        gameActive=false;
        return;
    }
    let roundDraw= !gameState.includes("");
    if(roundDraw){
        gameActive=false;
        handleResult();
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
        winner.innerHTML='PLAYER 1 WINS!!';
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
        winner.innerHTML='PLAYER 2 WINS!!';
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
function handleNextRound(){
    resultDisplay.classList.add('hidden');
    for(const cell of cells){
        cell.style.backgroundImage=('none');
        cell.style.backgroundColor=('rgba(31,54,65,255)');
        cell.addEventListener('mouseenter',cellHoverEnter);
        cell.addEventListener('mouseleave',cellHoverLeave);
    }
    currentPlayer='x';
    gameState =['','','','','','','','',''];    
    gameActive=true;
}
function handleRestart(){
    gameState =['','','','','','','','','']; 
    gameActive=true;
    currentPlayer='x';
    for(const cell of cells){
        cell.style.backgroundImage=('none');
        cell.style.backgroundColor=('rgba(31,54,65,255)');
        cell.addEventListener('mouseenter',cellHoverEnter);
        cell.addEventListener('mouseleave',cellHoverLeave);
    }
    xScoreCount=0;
    tiesScoreCount=0;
    oScoreCount=0;
    xScore.innerHTML = 0;
    tiesScore.innerHTML = 0;
    oScore.innerHTML = 0;
}
//hover effect
function cellHoverEnter(event){
    if(currentPlayer==='x'){
        event.target.style.backgroundImage = ('url(assets/images/icon-x-outline.svg)');
    }else{
        event.target.style.backgroundImage = ('url(assets/images/icon-o-outline.svg)');
    }
}
function cellHoverLeave(event){
    event.target.style.backgroundImage = ('none');
}
for(const cell of cells){
    cell.addEventListener('mouseenter',cellHoverEnter);
    cell.addEventListener('mouseleave',cellHoverLeave);
}
restartGame.addEventListener('click',handleRestart);
nextRound.addEventListener('click',handleNextRound);
cellContainer.addEventListener('click',handleCellClick);
vsPlayer.addEventListener('click',startGame);
// choices.addEventListener('click',getCurrentPlayer);