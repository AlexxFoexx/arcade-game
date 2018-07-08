var canvas = document.getElementById('game'),
    score = document.getElementById('score'),
  ctx = canvas.getContext('2d'),
  asteroidPosition = [],
  timer = 0,
  player = {
    x: 300,
    y: 300,
    counter: 0
  },
  fire = [],
  explosion = [];

// Спрайты 
var fonImg = new Image();
fonImg.src = './sprite/fon.png';

var asteroidImg = new Image();
asteroidImg.src = './sprite/astero.png';

var playerImg = new Image();
playerImg.src = './sprite/ship.png';

var fireImg = new Image();
fireImg.src = './sprite/fire.png';

var explosionImg = new Image();
explosionImg.src = "./sprite/explosion.png";

// управление кораблем и границ его движения
function init() {
  canvas.addEventListener("mousemove", function (event) {
    player.x = event.offsetX - 23;
    player.y = event.offsetY - 13;
    if (player.x >= 550){
      player.x = 550;
    }else if (player.x <= 0) {
      player.x = 0;
    }
    if (player.y >= 550) {
      player.y  = 550;
    }else if (player.y <= 0) {
      player.y = 0;
    }
  });
}

// Анимация 
var animFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 20);
    };
})();

explosionImg.onload = function() {
  init();
  game();
};
// Осной игровой цикл 
function game() {
  update();
  render();
  animFrame(game);
}
// Изменения в процессе 
function update() {
  timer++;

  if (timer % 10 == 0) {
    asteroidPosition.push({
      x: Math.random() * 600,
      y: -50,
      del: 0,
      dx: Math.random() * 2 - 1,
      dy: Math.random() * 2 + 2,
    });
  }
  // Создание огня каждые 30 кадров 
  if (timer % 30 == 0) {
    fire.push({x: player.x + 10,y: player.y,dx: 0,dy: -5.2});
    fire.push({ x: player.x + 10, y: player.y, dx: 0.5, dy: -5 });
    fire.push({ x: player.x + 10, y: player.y, dx: -0.5, dy: -5 });
  }

  // Удаление элемента огня если он ниже оси Y canvas на 30px
  for(var i in fire){
    fire[i].x = fire[i].x + fire[i].dx;
    fire[i].y = fire[i].y + fire[i].dy;

    if(fire[i].y < -30) fire.slice(i,1);
  }

  for (var i in asteroidPosition) {
    //Физика
    asteroidPosition[i].x = asteroidPosition[i].x + asteroidPosition[i].dx;
    asteroidPosition[i].y = asteroidPosition[i].y + asteroidPosition[i].dy;
    //Границы
    if (asteroidPosition[i].x >= 550 || asteroidPosition[i].x < 0) asteroidPosition[i].dx = -asteroidPosition[i].dx;
    if (asteroidPosition[i].y >= 600) asteroidPosition.slice(i, 1);
    // Столкновение 
    for(var j in fire){
      if (Math.abs(asteroidPosition[i].x+25-fire[j].x-15)<50 && Math.abs(asteroidPosition[i].y-fire[j].y)<25) {

        explosion.push({x:asteroidPosition[i].x-25,y:asteroidPosition[i].y-25,animx:0,animy:0});

        asteroidPosition[i].del = 1;
        fire.splice(j, 1); break;
      }
    }

    // Столкновение с игроком 
      if (Math.abs(asteroidPosition[i].x+25-player.x-15)<50 && Math.abs(asteroidPosition[i].y-player.y)<25) {
          gameOver();
      }
    
    if (asteroidPosition[i].del == 1 ) {
      asteroidPosition.splice(i, 1);
      player.counter = ++player.counter;
      score.innerHTML = player.counter;
      
    }
  }
  // Анимация взрыва
  for (i in explosion) {
    explosion[i].animx = explosion[i].animx + 0.5;
    if (explosion[i].animx > 7) { explosion[i].animy++; explosion[i].animx = 0 }
    if (explosion[i].animy > 7)
      explosion.splice(i, 1);
  }
}

// Отрисовка игры 
function render() {
  ctx.drawImage(fonImg, 0, 0, 600, 600);
  ctx.drawImage(playerImg, player.x, player.y, 50, 50);
  
  for (var i in fire) ctx.drawImage(fireImg, fire[i].x, fire[i].y, 30, 30);

  for (var i in asteroidPosition) ctx.drawImage(asteroidImg, asteroidPosition[i].x, asteroidPosition[i].y, 50, 50);

  for (i in explosion)
    ctx.drawImage(explosionImg, 128 * Math.floor(explosion[i].animx), 128 * Math.floor(explosion[i].animy), 128, 128, explosion[i].x, explosion[i].y, 100, 100);
}

// Окончание  игры
function gameOver() { 
  document.location.reload();
 }