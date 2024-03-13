const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let goldFoodX, goldFoodY;
let teleportFood1X, teleportFood1Y;
let teleportFood2X, teleportFood2Y;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let blocks = [];
let randNum;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

var startingX, startingY, movingX, movingY;
function touchStart(e){
    startingX = e.touches[0].clientX;
    startingY = e.touches[0].clientY;
}
function touchMove(e){
    movingX = e.touches[0].clientX;
    movingY = e.touches[0].clientY;
}
function touchEnd() {
    if(startingX+100 < movingX && velocityX != -1) {//r
        velocityX = 1;
        velocityY = 0;
    } else if(startingX-100 > movingX && velocityX != 1) {//l
        velocityX = -1;
        velocityY = 0;
    }
    else if(startingY+100 < movingY && velocityY != -1) {//d
        velocityX = 0;
        velocityY = 1;
    } else if(startingY-100 > movingY && velocityY != 1) {//u
        velocityX = 0;
        velocityY = -1;
    }
}

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
    label1: for (let i = 0; i < blocks.length; i++) {
        if (foodX === blocks[i][1] && foodY === blocks[i][0]) {
            FoodX = Math.floor(Math.random() * 30) + 1;
            FoodY = Math.floor(Math.random() * 30) + 1;
            continue label1;
        }   
    }
}
const updateGoldFoodPosition = () => {
    goldFoodX = Math.floor(Math.random() * 30) + 1;
    goldFoodY = Math.floor(Math.random() * 30) + 1;
    label2: for (let i = 0; i < blocks.length; i++) {
        if (goldFoodX === blocks[i][1] && goldFoodY === blocks[i][0]) {
            goldFoodX = Math.floor(Math.random() * 30) + 1;
            goldFoodY = Math.floor(Math.random() * 30) + 1;
            continue label2;
        }   
    }
}
const updateTeleportFood1Position = () => {
    teleportFood1X = Math.floor(Math.random() * 30) + 1;
    teleportFood1Y = Math.floor(Math.random() * 30) + 1;
    label3: for (let i = 0; i < blocks.length; i++) {
        if (teleportFood1X === blocks[i][1] && teleportFood1Y === blocks[i][0]) {
            teleportFood1X = Math.floor(Math.random() * 30) + 1;
            teleportFood1Y = Math.floor(Math.random() * 30) + 1;
            continue label3;
        }   
    }
}
const updateTeleportFood2Position = () => {
    teleportFood2X = Math.floor(Math.random() * 30) + 1;
    teleportFood2Y = Math.floor(Math.random() * 30) + 1;
    label4: for (let i = 0; i < blocks.length; i++) {
        if (teleportFood2X === blocks[i][1] && teleportFood2Y === blocks[i][0]) {
            teleportFood2X = Math.floor(Math.random() * 30) + 1;
            teleportFood2Y = Math.floor(Math.random() * 30) + 1;
            continue label4;
        }   
    }
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

const changeDirection = e => {
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    html += `<div class="gold" style="grid-area: ${goldFoodY} / ${goldFoodX}"></div>`;
    html += `<div class="teleport" style="grid-area: ${teleportFood1Y} / ${teleportFood1X}"></div>`;
    html += `<div class="teleport" style="grid-area: ${teleportFood2Y} / ${teleportFood2X}"></div>`;
    for (let i = 0; i < blocks.length; i++) {
        html += `<div class="block" style="grid-area: ${blocks[i][1]} / ${blocks[i][0]}"></div>`;
    }

    if(snakeX === goldFoodX && snakeY === goldFoodY) {
        updateGoldFoodPosition();
        snakeBody.push([goldFoodX, goldFoodY]); 
        score+=5;
        randNum = Math.floor(Math.random() * 4);
        if (randNum === 0) {
            blocks.push([Math.floor(Math.random() * 30) + 1, Math.floor(Math.random() * 30) + 1]);
        }
        else if (randNum === 1){
            blocks.push([Math.floor(Math.random() * 30) + 1, Math.floor(Math.random() * 30) + 1]);
            blocks.push([blocks[blocks.length - 1][0] + 1, blocks[blocks.length - 1][1]]);
        }
        else if (randNum === 2){
            blocks.push([Math.floor(Math.random() * 30) + 1, Math.floor(Math.random() * 30) + 1]);
            blocks.push([blocks[blocks.length - 1][0], blocks[blocks.length - 1][1] + 1]);
        }
        else {
            blocks.push([Math.floor(Math.random() * 30) + 1, Math.floor(Math.random() * 30) + 1]);
            blocks.push([blocks[blocks.length - 1][0] + 1, blocks[blocks.length - 1][1]]);
            blocks.push([blocks[blocks.length - 1][0], blocks[blocks.length - 1][1] + 1]);
        }
        scoreSave();
    }
    if(snakeX === foodX && snakeY === foodY) {
        if (Math.floor(Math.random() * 4) == 0) {
            blocks.shift();
        }
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); 
        score++; 
        scoreSave();
    }
    if(snakeX === teleportFood1X && snakeY === teleportFood1Y) {
        snakeX = teleportFood2X;
        snakeY = teleportFood2Y;
        updateTeleportFood1Position();
        updateTeleportFood2Position();
    }
    if(snakeX === teleportFood2X && snakeY === teleportFood2Y) {
        snakeX = teleportFood1X;
        snakeY = teleportFood1Y;
        updateTeleportFood1Position();
        updateTeleportFood2Position();
    }

    snakeX += velocityX;
    snakeY += velocityY;
    
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; 

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }
    for (let i = 0; i < blocks.length; i++) {
        if (snakeBody[0][1] === blocks[i][1] && snakeBody[0][0] === blocks[i][0]) {
            gameOver = true;
        }   
    }
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}
function scoreSave() {
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
}
updateGoldFoodPosition();
updateFoodPosition();
updateTeleportFood1Position();
updateTeleportFood2Position();
setIntervalId = setInterval(initGame, 140);
document.addEventListener("keyup", changeDirection);
