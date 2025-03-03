const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size for iPhone compatibility
canvas.width = window.innerWidth > 400 ? 400 : window.innerWidth;
canvas.height = window.innerHeight > 600 ? 600 : window.innerHeight;

let player = {
    x: 50,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    isJumping: false
};

let obstacles = [];
let gameSpeed = 3;
let score = 0;
let gameOver = false;

function spawnObstacle() {
    let obstacle = {
        x: canvas.width,
        y: canvas.height - 40,
        width: 20,
        height: 40,
        speed: gameSpeed
    };
    obstacles.push(obstacle);
}

function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = 'green';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updatePlayer() {
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.isJumping = false;
    }
}

function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacle.speed;
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score += 1;
        }

        // Collision detection
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver = true;
        }
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    updateObstacles();
    drawPlayer();
    drawObstacles();
    drawScore();

    requestAnimationFrame(gameLoop);
}

// Jump on tap (for iPhone)
canvas.addEventListener('touchstart', () => {
    if (!player.isJumping && !gameOver) {
        player.dy = player.jumpPower;
        player.isJumping = true;
    }
});

// Spawn obstacles every 2 seconds
setInterval(spawnObstacle, 2000);

// Start the game
gameLoop();