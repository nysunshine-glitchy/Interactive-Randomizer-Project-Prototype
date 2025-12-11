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
let speed = (2, 5);

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
  for (let i = 0; i < 10; i++) {
    let img = random(imgs);
    let x = random(width);
    let y = random(400, height - 100);
    let r = 40;
    let speed = random(1, 10);
    swimmers.push({ img, x, y, speed, r });
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
  text("Fish n' Chill", 40, 340);
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
  text("Fishies: " + catchCount, 420, 30);
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
    y = -0.2;
  }
  if (y < -90) {
    y = +0.2;
  }
  pop();
  console.log(mouseX, mouseY);

  //draw swimmers
  for (let s of swimmers) {
    // draw using radius
    image(s.img, s.x, s.y, s.r * 2, s.r * 2);

    s.x += random(2, 2);
    s.y += random(-1, 1);

    if (s.x > width) {
      s.x = -80;
      s.y = random(400, height - 100);
      s.img = random(imgs);
    }
  }
}

function mousePressed() {
  for (let i = swimmers.length - 1; i >= 0; i--) {
    let s = swimmers[i];
    let d = dist(mouseX, mouseY, s.x, s.y);
    if (d < s.r) {
      swimmers.splice(i, 1);
      catchCount++;
      //swimmers.length //need to figure out a way to add more as you catch and a timer, maybe redo indexes or maybe fish index = 0 true, then reset mechanic
      console.log("fish caught");
    }
  }
}

