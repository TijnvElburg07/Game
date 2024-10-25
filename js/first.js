let canLeave = false;
let levelIncremented = false;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Resize the canvas to fill the screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Call the function initially to set the canvas size
resizeCanvas();

// Update the canvas size when the window is resized
window.addEventListener('resize', resizeCanvas);

// Load images
const backgroundImage = new Image();
backgroundImage.src = 'img/background.png';  

const platformImage = new Image();
platformImage.src = 'img/platform.png';

const playerImage = new Image();
playerImage.src = 'img/anton.png';

const quincyImage = new Image();
quincyImage.src = 'img/quincy.png';

const buttonImage = new Image();
buttonImage.src = 'img/button.png'; 

const keyImage = new Image();
keyImage.src = 'img/key.png'; // Path to your key image

// Load agent image
const agentImage = new Image();
agentImage.src = 'img/agent.png';  // Replace with your agent image path

const doorImage = new Image();
doorImage.src = 'img/door.png';

// Ensure all images load before starting the game
let imagesLoaded = 0;
const totalImages = 6; // Updated total images to include the agent

// Function to check if all images are loaded
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        gameLoop();
    }
}

// Check when each image is loaded
backgroundImage.onload = imageLoaded;
platformImage.onload = imageLoaded;
playerImage.onload = imageLoaded;
quincyImage.onload = imageLoaded;
agentImage.onload = imageLoaded; // Add agent image loading check
buttonImage.onload = imageLoaded;

// Player settings
const player1 = {
    x: 100,
    y: canvas.height - 100,
    width: 75,
    height: 90,
    speed: 3,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpPower: -12,
    isJumping: false,
    direction: 1 // 1 for right, -1 for left
};

const player2 = {
    x: 200,
    y: canvas.height - 100,
    width: 75,
    height: 90,
    speed: 3,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpPower: -12,
    isJumping: false,
    direction: 1 // 1 for right, -1 for left
};

// Agent settings (already has direction property)
const agent = {
    x: 500,
    y: canvas.height - 100,
    width: 100,
    height: 100,
    fieldOfView: {
        width: 250,
        height: 50
    },
    direction: 1,
    speed: 1  
};


// Platform settings
const platforms = [
    { xPercent: 0.7, yPercent: 0.85, widthPercent: 0.1, heightPercent: 0.03 },
    { xPercent: 0.04, yPercent: 0.40, widthPercent: 0.2, heightPercent: 0.05 },
    { xPercent: 0.22, yPercent: 0.40, widthPercent: 0.2, heightPercent: 0.05 },
    { xPercent: 0.40, yPercent: 0.40, widthPercent: 0.2, heightPercent: 0.05 },
    { xPercent: 0.85, yPercent: 0.75, widthPercent: 0.1, heightPercent: 0.03 },
    { xPercent: 0.7, yPercent: 0.6, widthPercent: 0.1, heightPercent: 0.03 },
    { xPercent: 0.20, yPercent: 0.38, widthPercent: 0.1, heightPercent: 0.03 },
    { xPercent: 0.0, yPercent: 0.12, widthPercent: 0.2, heightPercent: 0.08 },
    { xPercent: 0.04, yPercent: 0.40, widthPercent: 0.2, heightPercent: 0.05 },
    { xPercent: 0.04, yPercent: 0.40, widthPercent: 0.2, heightPercent: 0.05 },
];


const key = {
    x: 20,
    y: 20,
    width: 50,
    height: 50, 
    collected: false
};

const door = {
    x: canvas.width - 100, // Position from the right
    y: canvas.height - 100, // Position from the bottom
    width: 80,
    height: 100,
    opened: false // To track if the door is opened or not
};


// Key press status
let keys = {
    right1: false,
    left1: false,
    up1: false,
    right2: false,
    left2: false,
    up2: false
};

// Function to draw the background
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Function to draw the platforms
function drawPlatforms() {
    platforms.forEach(platform => {
        const x = platform.xPercent * canvas.width;
        const y = platform.yPercent * canvas.height;
        const width = platform.widthPercent * canvas.width;
        const height = platform.heightPercent * canvas.height;
        drawPlatform(x, y, width, height);
    });
}

function drawPlatform(x, y, width, height) {
    ctx.drawImage(platformImage, x, y, width, height);
}

function drawKey() {
    if (!key.collected) { // Only draw if the key is not collected
        ctx.drawImage(keyImage, key.x, key.y, key.width, key.height);
    }
}

function drawDoor() {
    if (!door.opened) {
        ctx.drawImage(doorImage, door.x, door.y, door.width, door.height);
    }
}


// Function to draw players
function drawPlayer(player, image) {
    ctx.save(); // Save the current state

    if (player.direction === -1) {
        // Flip horizontally if facing left
        ctx.scale(-1, 1);
        ctx.drawImage(image, -player.x - player.width, player.y, player.width, player.height);
    } else {
        // Draw normally if facing right
        ctx.drawImage(image, player.x, player.y, player.width, player.height);
    }

    ctx.restore();
}

// Function to draw the agent
function drawAgent() {
    ctx.save(); // Save the current state

    // Set the position of the agent image based on direction
    let agentDrawX = agent.x;
    
    // If the agent is facing left, flip the context
    if (agent.direction === -1) {
        ctx.scale(-1, 1);
        agentDrawX = -agent.x - agent.width; // Adjust X for left-facing agent
    }

    // Draw the agent image at the calculated position
    ctx.drawImage(agentImage, agentDrawX, agent.y, agent.width, agent.height);
    
    ctx.restore(); // Restore the original state

    // Draw the field of vision as a cone
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Red color with some transparency
    ctx.beginPath();

    // The starting point of the cone (at the agent's front)
    let coneStartX = agent.x + 55; // Adjust based on direction
    let coneStartY = agent.y + 30; // Adjust height for starting point

    // Calculate the end points based on the direction the agent is facing
    let coneEndX = coneStartX + agent.fieldOfView.width * agent.direction;
    let coneEndYTop = coneStartY - agent.fieldOfView.height / 2;
    let coneEndYBottom = coneStartY + agent.fieldOfView.height / 2;

    // Draw the triangular cone shape
    ctx.moveTo(coneStartX, coneStartY); // Starting point at the agent
    ctx.lineTo(coneEndX, coneEndYTop); // Top point of the cone
    ctx.lineTo(coneEndX, coneEndYBottom); // Bottom point of the cone
    ctx.closePath();

    // Fill the cone shape
    ctx.fill();
}



// Function to draw the button
function drawButton() {
    ctx.drawImage(buttonImage, button.x, button.y, button.width, button.height);
    button.forEach(button => {
        const x = button.xPercent * canvas.width;
        const y = button.yPercent * canvas.height;
        const width = button.widthPercent * canvas.width;
        const height = button.heightPercent * canvas.height;
        drawButton(x, y, width, height);
    });
}

// Function to handle movement and gravity for a player
function updatePlayer(player, keysRight, keysLeft, keysUp) {
    // Move left and right
    if (keysRight) {
        player.dx = player.speed;
        player.direction = 1; // Facing right
    } else if (keysLeft) {
        player.dx = -player.speed;
        player.direction = -1; // Facing left
    } else {
        player.dx = 0;
    }

    // Jumping
    if (keysUp && !player.isJumping) {
        player.dy = player.jumpPower;
        player.isJumping = true;
    }

    // Apply gravity
    player.dy += player.gravity;

    // Update player position
    player.x += player.dx;
    player.y += player.dy;

    // Check for collision with platforms
    platforms.forEach(platform => {
        const platformX = platform.xPercent * canvas.width;
        const platformY = platform.yPercent * canvas.height;
        const platformWidth = platform.widthPercent * canvas.width;
        const platformHeight = platform.heightPercent * canvas.height;
        
        if (player.x < platformX + platformWidth &&
            player.x + player.width > platformX &&
            player.y + player.height > platformY &&
            player.y + player.height < platformY + platformHeight) {
            // Player is on top of the platform
            player.y = platformY - player.height;
            player.dy = 0;
            player.isJumping = false;
        }
    });

    // Prevent the player from falling through the ground
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.isJumping = false;
    }

    // Prevent player from going out of bounds horizontally
    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function checkKeyCollision(player) {
    if (
        player.x < key.x + key.width &&
        player.x + player.width > key.x &&
        player.y < key.y + key.height &&
        player.y + player.height > key.y
    ) {
        key.collected = true; // Mark the key as collected
        return true; // Return true to indicate the key was picked up
    }
    return false; // Return false if the key was not collected
}

function checkDoorCollision(player) {
    if (
        player.x < door.x + door.width &&
        player.x + player.width > door.x &&
        player.y < door.y + door.height &&
        player.y + player.height > door.y
    ) {
        return true; // The player has collided with the door
    }
    return false; // No collision
}


function resetGame() {
    // Reset player positions
    player1.x = 100;
    player1.y = canvas.height - 100; // Reset to the ground level
    player1.dx = 0;
    player1.dy = 0;
    player1.isJumping = false;

    player2.x = 200;
    player2.y = canvas.height - 100; // Reset to the ground level
    player2.dx = 0;
    player2.dy = 0;
    player2.isJumping = false;

    // Reset agent position if needed (optional)
    agent.x = 500;
    agent.y = canvas.height - 100; 
    agent.direction = 1; 

    // Reset agent's field of view position
    agent.fieldOfView.x = agent.x + agent.width;
    agent.fieldOfView.y = agent.y + (agent.height / 2) - (agent.fieldOfView.height / 2);

    // Reset any other game variables as necessary
}

// Function to check collision with the agent's visible area// Function to check if a point is inside a triangle
function isPointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
    const areaOrig = Math.abs((ax * (by - cy) + bx * (cy - ay) + cx * (ay - by)) / 2.0);
    const area1 = Math.abs((px * (by - cy) + bx * (cy - py) + cx * (py - by)) / 2.0);
    const area2 = Math.abs((ax * (py - cy) + px * (cy - ay) + cx * (ay - py)) / 2.0);
    const area3 = Math.abs((ax * (by - py) + bx * (py - ay) + px * (ay - by)) / 2.0);
    return (area1 + area2 + area3 === areaOrig);
}

// Function to check if a player is within the agent's triangular field of vision
function checkAgentCollision(player) {
    // The starting point of the cone (at the agent's front)
    let coneStartX = agent.x + agent.width / 2;
    let coneStartY = agent.y + agent.height / 2;

    // Calculate the end points based on the direction the agent is facing
    let coneEndX = coneStartX + agent.fieldOfView.width * agent.direction;
    let coneEndYTop = coneStartY - agent.fieldOfView.height / 2;
    let coneEndYBottom = coneStartY + agent.fieldOfView.height / 2;

    // Check if the player's position is within the triangle
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    // Use the isPointInTriangle function to check if the player's center point is inside the triangle
    return isPointInTriangle(
        playerCenterX, playerCenterY,    // Player's position
        coneStartX, coneStartY,          // Cone start (agent's front)
        coneEndX, coneEndYTop,           // Top of the cone
        coneEndX, coneEndYBottom         // Bottom of the cone
    );
}


// Function to clear the canvas for each frame
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Main game loop
// Main game loop
function gameLoop() {
    clearCanvas();

    drawBackground();
    drawPlatforms();
    drawAgent();
    drawKey(); // Draw the key
    drawDoor(); // Draw the door

    updatePlayer(player1, keys.right1, keys.left1, keys.up1);
    updatePlayer(player2, keys.right2, keys.left2, keys.up2);
    drawPlayer(player1, playerImage);
    drawPlayer(player2, quincyImage);

    // Check collision with the key
    if (checkKeyCollision(player1) || checkKeyCollision(player2)) {
        canLeave = true; // Set canLeave to true if either player collects the key
    }

    // Check collision with the door
    if (canLeave) {
        if (checkDoorCollision(player1) || checkDoorCollision(player2)) {
            if (!levelIncremented) { // Increment the level only if it hasn't been incremented
                let currentLevel = parseInt(getCookie("level")) === 1; // Get current level
                setCookie("level", 2, 7); // Increment the level
                levelIncremented = true; // Set the flag to true after incrementing
            }
            window.location.href = "levels.html"; // Redirect to the levels page
        }
    }

    // Reset the level increment flag and canLeave if neither player is at the door
    if (!checkDoorCollision(player1) && !checkDoorCollision(player2)) {
        levelIncremented = false;
    }

    // Check collision with agent's field of vision
    if (checkAgentCollision(player1) || checkAgentCollision(player2)) {
        window.location.href = "gameover.html";
        resetGame();
    }

    // Update agent position
    agent.x += agent.speed * agent.direction;

    // Check for agent boundaries
    if (agent.x < 0 || agent.x + agent.width > canvas.width) {
        agent.direction *= -1;
    }

    // Update agent's field of vision position
    agent.fieldOfView.x = agent.x + agent.width;
    agent.fieldOfView.y = agent.y + (agent.height / 2) - (agent.fieldOfView.height / 2);

    requestAnimationFrame(gameLoop);
}




// Event listeners for key presses
document.addEventListener("keydown", (event) => {

    if (event.code === "KeyD") {
        keys.right1 = true;
    }
    if (event.code === "KeyA") {
        keys.left1 = true;
    }
    if (event.code === "KeyW") {
        keys.up1 = true;
    }
    if (event.code === "ArrowRight") {
        keys.right2 = true;
    }
    if (event.code === "ArrowLeft") {
        keys.left2 = true;
    }
    if (event.code === "ArrowUp") {
        keys.up2 = true;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "KeyD") {
        keys.right1 = false;
    }
    if (event.code === "KeyA") {
        keys.left1 = false;
    }
    if (event.code === "KeyW") {
        keys.up1 = false;
    }
    if (event.code === "ArrowRight") {
        keys.right2 = false;
    }
    if (event.code === "ArrowLeft") {
        keys.left2 = false;
    }
    if (event.code === "ArrowUp") {
        keys.up2 = false;
    }
});