const container = document.getElementById('game-container2');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
container.appendChild(canvas);

// Resize to full screen
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Game Variables
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 50;
let dx = 8;
let dy = -8;

let paddleHeight = 12;
let paddleWidth = 120;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

// Brick Settings
const brickRowCount = 5;
const brickColumnCount = 10;
const brickPadding = 10;
const brickOffsetTop = 100; // Leave room for header
const brickOffsetLeft = 30;
const brickWidth = (canvas.width - (brickOffsetLeft * 2)) / brickColumnCount - brickPadding;
const brickHeight = 30;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Controls
document.addEventListener("keydown", (e) => {
    if(e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    if(e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", (e) => {
    if(e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    if(e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00f2ff";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    const gradient = ctx.createLinearGradient(paddleX, 0, paddleX + paddleWidth, 0);
    gradient.addColorStop(0, "#00f2ff");
    gradient.addColorStop(1, "#7000ff");
    
    ctx.rect(paddleX, canvas.height - 40, paddleWidth, paddleHeight);
    ctx.fillStyle = gradient;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00f2ff";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                // Glassy brick effect
                ctx.fillStyle = `rgba(0, 242, 255, ${1 - r * 0.15})`; 
                ctx.strokeStyle = "rgba(255,255,255,0.5)";
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                }
            }
        }
    }
}

// Add this near your other event listeners (like KeyDown)
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    // Calculate the mouse position relative to the canvas
    const relativeX = e.clientX - canvas.offsetLeft;
    
    // If the mouse is within the canvas boundaries
    if (relativeX > 0 && relativeX < canvas.width) {
        // Center the paddle on the mouse cursor
        paddleX = relativeX - paddleWidth / 2;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    // Wall bounce
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
    if (y + dy < ballRadius) dy = -dy;
    else if (y + dy > canvas.height - ballRadius - 30) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            document.location.reload(); // Game Over
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
    else if (leftPressed && paddleX > 0) paddleX -= 7;

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();