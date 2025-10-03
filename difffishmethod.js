//key elements: random(imgs)
//arrays and variables to spawn fish
let imgs = []; //empty array to store pics of fishes
let numImages = 8; //amount of fish pics
var swimmers = [];

//backgrounds
let startbg;
let gamebg;
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
  gamebg = loadImage("backgrounds/backgroounnd.gif");
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

  //player duck parameters

  noSmooth(); // crisp duck pixel art
  cols = floor(sheet.width / FW);
  rows = floor(sheet.height / FH);

  // create a few random swimmers
  for (var i = 0; i < 12; i++) {
    //fill array with fish gif objects
    swimmers.push(new Fish());
  }
}

function draw() {
  background(gamebg);
  image(grass, -10, -200, 850);

  //displaying the line and hook
  noFill();
  strokeWeight(6);
  stroke(0);
  arc(x, mouseY + 105, 30, 60, 0, HALF_PI); //hook
  stroke(255, 255, 0);
  line(x, mouseY - 200, x, mouseY + 125); //fishing line

  //displays number of fish that have been caught
  textFont(myfont);
  strokeWeight(1);
  textSize(32);
  noStroke();
  fill(0);
  text("Fish:" + catchCount, 420, 30);

  //duck shritesheet parameters
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

  //duck movement and animations
  image(sheet, x, y, FW * SCALE, FH * SCALE, sx, sy, FW, FH);

  //move and change animation
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
  //don't go off screen
  //don't go past top or into water
  if (y > 75) {
    y = -1;
  }
  if (y < -90) {
    y = +1;
  }
  console.log(mouseX, mouseY);

  // update + draw each swimmer
  for (var i = 0; i < 12; i++) {
    swimmers[i].move();
    swimmers[i].display();

    if (
      mouseX > swimmers[i].x &&
      mouseX < swimmers[i].x + 110 &&
      mouseY + 125 > swimmers[i].y &&
      mouseY + 125 < swimmers[i].y + 46
    ) {
      //if the bottom of the fishing line and the fish overlap
      swimmers[i].x = -300; //makes the fish 'disappear'
      catchCount++;
    }
  }
}

class Fish {
  constructor() {
    //this.img = ;
    this.x = random(width);
    this.y = random(450, height);
    this.xSpeed = random(1, 2);
    this.ySpeed = random(-1, 1);
  }
  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    if (this.y < 140 || this.y > 420) {
      //if fish is above water or too far below the canvas, set new ySpeed
      this.ySpeed = random(-1, 1);
    }
  }
  display() {
    image(random(imgs), this.x, this.y, 110, 46);
  }
}

//optional: press mouse to get a new random image
function mousePressed() {}

// press 1..2 to pick a row; A/D to change speed (optional)
function keyPressed() {}
