const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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

// Load agent image
const agentImage = new Image();
agentImage.src = 'img/agent.png';  // Replace with your agent image path

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
    speed: 5,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpPower: -12,
    isJumping: false
};

const player2 = {
    x: 200,
    y: canvas.height - 100,
    width: 75,
    height: 90,
    speed: 5,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpPower: -12,
    isJumping: false
};

// Agent settings
const agent = {
    x: 500, // Set the initial x position of the agent
    y: canvas.height - 100, // Set the initial y position of the agent
    width: 100,                // Width of the agent's visible area
    height: 100,               // Height of the agent's visible area
    fieldOfView: {             // Field of vision settings
        width: 250,            // Width of the field of vision
        height: 50             // Height of the field of vision
    },
    direction: 1,              // 1 for right, -1 for left
    speed: 4                    // Agent's speed
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
    { xPercent: 0.04, yPercent: 0.40, widthPercent: 0.2, heightPercent: 0.05 }
    
];





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

// Function to draw players
function drawPlayer(player, image) {
    ctx.drawImage(image, player.x, player.y, player.width, player.height);
}

// Function to draw the agent
function drawAgent() {
    ctx.drawImage(agentImage, agent.x, agent.y, agent.width, agent.height);
    
    // Draw the field of vision (for visualization)
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Red color for visibility
    ctx.fillRect(agent.fieldOfView.x, agent.fieldOfView.y, agent.fieldOfView.width, agent.fieldOfView.height);
}

// Function to draw the button
function drawButton() {
    ctx.drawImage(buttonImage, button.x, button.y, button.width, button.height);
}

// Function to handle movement and gravity for a player
function updatePlayer(player, keysRight, keysLeft, keysUp) {
    // Move left and right
    if (keysRight) {
        player.dx = player.speed;
    } else if (keysLeft) {
        player.dx = -player.speed;
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

// Function to check collision with the agent's visible area
function checkAgentCollision(player) {
    if (player.x < agent.fieldOfView.x + agent.fieldOfView.width &&
        player.x + player.width > agent.fieldOfView.x &&
        player.y < agent.fieldOfView.y + agent.fieldOfView.height &&
        player.y + player.height > agent.fieldOfView.y) {
        return true; // Player is affected by the agent
    }
    return false; // No collision
}

// Function to clear the canvas for each frame
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Main game loop
function gameLoop() {
    clearCanvas();
    

    // Draw background first
    drawBackground();

    // Draw platforms next
    drawPlatforms();

    // Draw the agent
    drawAgent();

    

    // Update players and draw them on top
    updatePlayer(player1, keys.right1, keys.left1, keys.up1);
    updatePlayer(player2, keys.right2, keys.left2, keys.up2);
    drawPlayer(player1, playerImage);
    drawPlayer(player2, quincyImage);

    // Check collision with agent's field of vision
    if (checkAgentCollision(player1)) {
        window.location.href = "gameover.html";
        resetGame(); // Call reset function after alert
    }
    if (checkAgentCollision(player2)) {
        window.location.href = "gameover.html";
        resetGame(); // Call reset function after alert
    }

    // Update agent position to make it move back and forth
    agent.x += agent.speed * agent.direction;

    // Reverse direction if hitting canvas bounds
    if (agent.x < 0 || agent.x + agent.width > canvas.width) {
        agent.direction *= -1; // Reverse direction
    }

    // Update the agent's field of view position to be in front of the agent
    agent.fieldOfView.x = agent.x + agent.width; // Position FOV in front of the agent
    agent.fieldOfView.y = agent.y + (agent.height / 2) - (agent.fieldOfView.height / 2); // Center it vertically

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
