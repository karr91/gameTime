// bouncing the ball on the canvas

const $lives = $('#lives');
const $score = $('#score')
// grabbing canvas element from the dom
const canvas = document.getElementById("gameCanvas");

//setting the context of canvas to 2d
const ctx = canvas.getContext("2d");

//start button set up 
const $start = $('#start');

//establishing a starting position for the ball in the canvas
var x = canvas.width / 2;
var y = canvas.height / 2 + 100;

//establishing how far the ball moves between intervals
var dx = 3;
var dy = -3;

//setting a radius for the ball. this can be altered at higher difficulties 
var ballRadius = 15;

// defining the paddle size and starting position
var paddleHeight = 20;
var paddleWidth = 200;
var paddlePosition = (canvas.width - paddleWidth) / 2;

//establishing directions for the paddle
var paddleRight = false;
var paddleLeft = false;

//creating the bricks
var brickRow = 6;
var brickColumn = 18;
var brickWidth = 60;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 15;
var bricks = [];
for (var c = 0; c < brickColumn; c++) {
    bricks[c] = [];
    for(var r = 0; r < brickRow; r++) {
        bricks[c][r] = {x: 0, y: 0, broken: false};
    }
};

//variables to keep track of during game
var lives = 3;
var score = 0;


// establishing a variable for changing the time and increasing difficulty of levels
var timer = 10;
var level = 0;

var gameTime;

//drawing the bricks
function drawBricks() {
    for (var c = 0; c < brickColumn; c++) {
        for(var r = 0; r < brickRow; r++) {
            if(bricks[c][r].broken == false) {
                var bx = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var by = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = bx;
                bricks[c][r].y = by;
                ctx.beginPath();
                ctx.rect(bx, by, brickWidth, brickHeight);
                ctx.fillStyle = 'black';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

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
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height - ballRadius) {
        lives--
        x = canvas.width / 2;
        y = canvas.height / 2 + 100;
        dy = -dy;
    }
// allowing the ball to bounce off the paddle
if ( x > paddlePosition - ballRadius && x < paddlePosition + paddleWidth - ballRadius && y > canvas.height - paddleHeight -60 - ballRadius && y + dy < (canvas.height - paddleHeight - 60) + paddleHeight - ballRadius){
        dy = -dy;
    }
// moving the ball as if it bounced off the wall 
    x += dx;
    y += dy;
}

function brickCollision() {
    for(var c = 0; c < brickColumn; c++) {
        for(var r = 0; r < brickRow; r++) {
            var b = bricks[c][r];
            if(b.broken == false) {
                if(x - ballRadius > b.x && x - ballRadius < b.x + brickWidth && y > b.y - ballRadius && y - ballRadius < b.y + brickHeight) {
                    dy = -dy;
                    b.broken = true;
                    score++;
                } 
            }
        }
    }
}

//function to subrtract lives when the ball hits the bottom of the canvas.
function lifeLoss() {
    if(lives <= 3 && lives > 0) {
        $lives.html(`Lives: ${lives}`);
    } else if(lives === 0) {
        $lives.html(`Lives: ${lives}`)
        alert(`You ran out lives. Youre final score was ${score}`);
        clearInterval(gameTime);
        location.reload();
    }
}

//function to increase the score on the page
function scoreTrac() {
    if(score > 0 && score < 108) {
        $score.html(`Score: ${score}`);
    } else if (score == 108) {
        alert(`You have reached the max score of ${score}. Congrats!`);
        clearInterval(gameTime);
        location.reload();
    }
}



//refreshes the canvas and moves the ball around the canvas redrawing it as it goes.
function ball() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    ballBounce();
    drawPaddle();
    drawBricks();
    paddleMove();
    brickCollision();
    scoreTrac();
    lifeLoss();
}


// using the start button to start the game




//draws the ball and other elements. interval can be changed to make ball faster or slower
$start.on('click', function () {
    $start.hide();
    gameTime = setInterval(ball, timer);
});