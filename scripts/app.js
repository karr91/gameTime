// bouncing the ball on the canvas
// grabbing canvas element from the dom
const canvas = document.getElementById("gameCanvas");

//setting the context of canvas to 2d
const ctx = canvas.getContext("2d");

//establishing a starting position for the ball in the canvas
var x = canvas.width / 2;
var y = canvas.height / 2 + 100;

//establishing how far the ball moves between intervals
var dx = 2;
var dy = -2;

//setting a radius for the ball. this can be altered at higher difficulties 
var ballRadius = 15;

// defining the paddle size and starting position
var paddleHeight = 20;
var paddleWidth = 200;
var paddlePosition = (canvas.width - paddleWidth) / 2;

//establishing directions for the paddle
var paddleRight = false;
var paddleLeft = false;

// added event listeners to control the paddle with arrow keys
document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);

//adding a function to control the key up and key down events.
function keyDown(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        paddleRight = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        paddleLeft = true;
    }
};
function keyUp(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        paddleRight = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        paddleLeft = false;
    }
}

// function to control the movement of the paddle
function paddleMove() {
    if(paddleRight) {
        paddlePosition += 7;
        if(paddlePosition + paddleWidth > canvas.width) {
            paddlePosition = canvas.width - paddleWidth;
        }
    }
    else if(paddleLeft) {
        paddlePosition -= 7;
        if(paddlePosition < 0) {
            paddlePosition = 0;
        }
    }
};

// draws the ball on the canvas every frame
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

// drawing the paddle on the canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddlePosition, canvas.height-paddleHeight - 60, paddleWidth, paddleHeight);
    ctx.fillStyle = 'gray';
    ctx.fill();
    ctx.closePath();
}

function ballBounce() {
// if statements to bounce the ball off the wall without the ball going into the wall 
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }
// allowing the ball to bounce off the paddle
    if ( x + ballRadius > paddlePosition && x + ballRadius < paddlePosition + paddleWidth && y + ballRadius > canvas.height - paddleHeight -60 && y + ballRadius < canvas.height - 60) {
        dy = -dy;
    }
// moving the ball as if it bounced off the wall 
    x += dx;
    y += dy;
}

//refreshes the canvas and moves the ball around the canvas redrawing it as it goes.
function ball() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ballBounce();
    drawBall();
    drawPaddle();
    paddleMove();
}

//draws the ball and other elements. interval can be changed to make ball faster or slower
setInterval(ball, 10);
