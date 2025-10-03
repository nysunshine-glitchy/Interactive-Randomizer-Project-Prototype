//menu, change screens
let screen = 0;

//key elements: random(imgs)
//arrays and variables to spawn fish
let imgs = []; //empty array to store pics of fishes
let numImages = 9; //amount of fish pics
let swimmers = [];

//backgrounds
let startbg;
let gamebg;
let endbg;
let grass;

//player sprite variables
let spriteSheet; //https://caz-creates-games.itch.io/ducky-2

const FW = 32,
  FH = 32;
const SCALE = 5;
const DEFAULT_FPS = 10;

let sheet, cols, rows;
let currentRow = 0;
let x = 0;
let y = 0;
let vx = 2;
let speed = 5;

//gameplay elements
let score;
var catchCount = 0;
let myfont;
let hook;

// Per-row frame ranges: row: [startCol, endCol]
const ROW_RANGES = {
  0: [0, 1], // idle uses columns 0 and 1
  1: [0, 5], // walk uses columns 0..5
  //not using other 2 rows here
};
const ROW_FPS = {
  0: 5,
  1: 10,
  // how fast they animate
};

//load image files
function preload() {
  startbg = loadImage("backgrounds/duckstartscreen.gif");
  gamebg = loadImage("backgrounds/backgroounnd.gif");
  endbg = loadImage("backgrounds/ennd.gif");
  grass = loadImage("backgrounds/grass.PNG");
  myfont = loadFont("SuperFrog-Yqy1q.ttf");

  sheet = loadImage("assets/ducky_2_spritesheet.png");

  //to display fish images
  for (let i = 0; i < numImages; i++) {
    imgs[i] = loadImage("image" + i + ".gif");
  }
}

function setup() {
  createCanvas(800, 800);

  //caught = false;

  //player duck parameters

  noSmooth(); // crisp duck pixel art
  cols = floor(sheet.width / FW);
  rows = floor(sheet.height / FH);

  // create a few random swimmers
  for (let i = 0; i < 5; i++) {
    let img = random(imgs);
    let x = random(width);
    let y = random(400, height - 100); // so they don't spawn below the screen or above 400
    let r = 20;
    let speed = random(1, 10); //spawnn with a random speed
    swimmers.push({ img, x, y, speed });
  }
}

function draw() {
  //load different screens
  if (screen == 0) {
    menu();
  } else if (screen == 1) {
    game();
  } else if (screen == 2) {
    gameOver();
  } else {
    reset();
  }
}

function menu() {
  background(startbg);

  textFont(myfont);
  textSize(50);
  fill(255);
  stroke(61, 184, 59);
  strokeWeight(5);
  text("Quack n Fish", 40, 340);
  textSize(20);
  text("press Space to play", 100, 400);

  if (keyIsDown(32)) {
    screen = 1;
  }
}

function game() {
  background(gamebg);
  image(grass, -10, -200, 850);

  //displaying the line and hook
  push();
  noFill();
  strokeWeight(6);
  stroke(128, 128, 128);
  arc(x, mouseY + 40, 60, 60, 0, HALF_PI); //hook
  stroke(255);
  line(x, mouseY - 200, x, mouseY + 70); //fishing line
  pop();

  //displays number of fish that have been caught
  push();
  fill(255);
  textFont(myfont);
  strokeWeight(1);
  textSize(32);
  text("Fish:" + catchCount, 420, 30);
  pop();

  //duck shritesheet parameters for using correct rows and columns
  const hasRange = Object.prototype.hasOwnProperty.call(ROW_RANGES, currentRow);
  const range = hasRange ? ROW_RANGES[currentRow] : [0, cols - 1];
  const startCol = range[0];
  const endCol = range[1];

  const hasFps = Object.prototype.hasOwnProperty.call(ROW_FPS, currentRow);
  const fps = hasFps ? ROW_FPS[currentRow] : DEFAULT_FPS;

  const count = Math.max(1, endCol - startCol + 1);
  const t = millis() / 1000;
  const step = fps <= 0 ? 0 : Math.floor(t * fps) % count; // freeze if fps <= 0
  const col = startCol + step;

  const sx = col * FW;
  const sy = currentRow * FH;

  //spawn duck
  push();
  image(sheet, x, y, FW * SCALE, FH * SCALE, sx, sy, FW, FH);

  //move and change duck animation
  if (keyIsDown(65)) {
    x = x - speed;
    currentRow = 1;
  } else if (keyIsDown(68)) {
    x = x + speed;
    currentRow = 1;
  } else if (keyIsDown(87)) {
    y = y - speed;
    currentRow = 1;
  } else if (keyIsDown(83)) {
    y = y + speed;
    currentRow = 1;
  } else {
    currentRow = 0;
  }
  //move across x axis and wrap
  if (x > width) x = -FW * SCALE;
  if (x < -FW * SCALE) x = width;

  //don't go past top or into water
  if (y > 75) {
    y = -1;
  }
  if (y < -90) {
    y = +1;
  }
  pop();
  console.log(mouseX, mouseY);

  // update + draw each swimmer
  for (let s of swimmers) {
    image(s.img, s.x, s.y, 100, 100, s.r * 2);
    //image(s.img, s.x, s.y, s.r *r);
    s.x += random(2, 2); // swim across x axis
    s.y += random(-1, 1); //
    // reset when off screen
    if (s.x > width) {
      s.x = -80; // wrap around
      s.y = random(400, height - 100);
      s.img = random(imgs); // choose new random image
    }
    if (
      //mouseX >= s.x - 100 &&
      //mouseX <= s.x + 100 &&
      //mouseY >= s.y + 100 &&
      //mouseY <= s.y - 100 &&
      mouseIsPressed == true
    ) {
      s.splice(imgs, 1); 
      console.log("fish caught");
      //ref says use array.splice instead. would have tried s.splice otherwise
    }
  }
}

//optional: press mouse to get a new random image
function mousePressed() {
  // loop backwards so splicing works safely
  for (let i = swimmers.length - 1; i >= 0; i--) {
    let s = swimmers[i];
    let d = dist(mouseX, mouseY, s.x, s.y);
    if (d < s.r) {
      // remove this item from the array
      swimmers.splice(i, 1);
    }
  }
}

// press 1..2 to pick a row; A/D to change speed (optional)
function keyPressed() {}
