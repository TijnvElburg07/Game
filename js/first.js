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
 
// Load the background image
const backgroundImage = new Image();
backgroundImage.src = 'img/background.png';  // Replace with your background image path
 
// Load the platform image
const platformImage = new Image();
platformImage.src = 'img/platform.png'; // Replace with the actual path to your platform image
 
// Load the player image
const playerImage = new Image();
playerImage.src = 'img/anton.png'; // Replace with your player image path
 
// Ensure all images load before starting the game
let imagesLoaded = 0;
const totalImages = 3; // Number of images to load
 
// Function to check if all images are loaded
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        // Start the game loop once all images are loaded
        gameLoop();
    }
}
 
// Check when each image is loaded
backgroundImage.onload = imageLoaded;
platformImage.onload = imageLoaded;
playerImage.onload = imageLoaded;
 
// Player settings
const player = {
    x: 100,
    y: canvas.height - 100,
    width: 50,          // Set this to match the width of your character image
    height: 80,         // Set this to match the height of your character image
    speed: 5,
    dx: 0,              // Change in X (for horizontal movement)
    dy: 0,              // Change in Y (for jumping)
    gravity: 0.5,
    jumpPower: -12,
    isJumping: false
};
 
// Key press status
let keys = {
    right: false,
    left: false,
    up: false
};
 
// Function to draw the background, scaling it to fit the entire canvas
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}
 
// Function to draw the platform
function drawPlatform(x, y, width, height) {
    ctx.drawImage(platformImage, x, y, width, height); // Draw the platform image at specified position
}
 
// Function to draw the player (with the image)
function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}
 
// Function to handle movement and gravity
function updatePlayer() {
    // Move left and right
    if (keys.right) {
        player.dx = player.speed;
    } else if (keys.left) {
        player.dx = -player.speed;
    } else {
        player.dx = 0;
    }
 
    // Jumping
    if (keys.up && !player.isJumping) {
        player.dy = player.jumpPower;
        player.isJumping = true;
    }
 
    // Apply gravity
    player.dy += player.gravity;
 
    // Update player position
    player.x += player.dx;
    player.y += player.dy;
 
   
 
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
    drawPlatform(25, 500, 200, 50);  // Platform 1
    drawPlatform(300, 300, 200, 50); // Platform 2
    drawPlatform(550, 200, 200, 50); // Platform 3
 
    // Draw player on top
    drawPlayer();
    updatePlayer();
 
    requestAnimationFrame(gameLoop);
}
 
// Event listeners for key presses
document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight") {
        keys.right = true;
    }
    if (event.code === "ArrowLeft") {
        keys.left = true;
    }
    if (event.code === "ArrowUp") {
        keys.up = true;
    }
});
 
document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowRight") {
        keys.right = false;
    }
    if (event.code === "ArrowLeft") {
        keys.left = false;
    }
    if (event.code === "ArrowUp") {
        keys.up = false;
    }
});
 