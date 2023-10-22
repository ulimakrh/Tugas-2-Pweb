import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 550;

const background = new Image();
background.src = "images/space.png";

const playerBulletController = new BulletController(canvas, 10, "red", true);
const enemyBulletController = new BulletController(canvas, 4, "white", false);
const enemyController = new EnemyController(
  canvas,
  enemyBulletController,
  playerBulletController
);
const player = new Player(canvas, 3, playerBulletController);

let isGameOver = false;
let didWin = false;

let playerScore = 0;
let highscore = localStorage.getItem("highscore") || 0;

function game() {
  checkGameOver();
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  displayGameOver();
  if (!isGameOver) {
    enemyController.draw(ctx);
    player.draw(ctx);
    playerBulletController.draw(ctx);
    enemyBulletController.draw(ctx);
  }
}

function displayGameOver() {
  if (isGameOver) {
    let text = didWin ? "You Win!" : "Game Over!";
    let textOffset = didWin ? 3.5 : 5;

    ctx.fillStyle = "white";
    ctx.font = "70px Arial";
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (canvas.width - textWidth) / 2, canvas.height / 2);

    ctx.font = "20px Arial";
    const scoreText = "Your Score: " + playerScore;
    const scoreTextWidth = ctx.measureText(scoreText).width;
    ctx.fillText(scoreText, (canvas.width - scoreTextWidth) / 2, canvas.height / 2 + 40);

    const highscoreText = "Highscore: " + highscore;
    const highscoreTextWidth = ctx.measureText(highscoreText).width;
    ctx.fillText(highscoreText, (canvas.width - highscoreTextWidth) / 2, canvas.height / 2 + 70);
  }
}


function checkGameOver() {
  if (isGameOver) {
    return;
  }

  if (enemyBulletController.collideWith(player)) {
    isGameOver = true;
  }

  if (enemyController.collideWith(player)) {
    isGameOver = true;
  }

  if (enemyController.enemyRows.length === 0) {
    didWin = true;
    isGameOver = true;

    playerScore += 10; 
    if (playerScore > highscore) {
      highscore = playerScore;
      localStorage.setItem("highscore", highscore);
    }
  }
}

setInterval(game, 1000 / 60);
