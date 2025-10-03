//key elements: random(imgs)
//arrays and variables to spawn fish
let imgs = []; //empty array to store pics of fishes
let numImages = 13; //amount of fish pics
let swimmers = [];
//alt way to spawn them
//let currentImg1;
//let currentImg2;
//let currentImg3;

//backgrounds
let startbg;
let gamebg;
let grass;

//player variables
let player;
let spriteSheet;
let frame = 0;

//load image files
function preload() {
  gamebg = loadImage("backgrounds/backgroounnd.gif");
  grass = loadImage("backgrounds/grass.PNG");
  spriteSheet = loadImage("assets/ducky_2_spritesheet.png");

  //to display images
  for (let i = 0; i < numImages; i++) {
    imgs[i] = loadImage("image" + i + ".gif");
  }
}

function setup() {
  createCanvas(800, 800);

  //works to spawn, keep
  // currentImg1 = random(imgs);
  //  currentImg2 = random(imgs);
  // currentImg3 = random(imgs);

  // create a few random swimmers
  for (let i = 0; i < 5; i++) {
    let img = random(imgs);
    let x = random(width);
    let y = random(400, height - 100); // so they don't spawn below the screen or above 400
    let speed = random(1, 4); //spawnn with a random speed
    swimmers.push({ img, x, y, speed });
  }
}

function draw() {
  background(gamebg);
  image(grass, -10, -200, 850);

  // calculate which frame to show for duck sprite
  let sx = frame * 32; // shift across the sprite sheet
  let sy = 0;          // first row
  let sWidth = 32;
  let sHeight = 32;

  // draw that piece at (100,100), scaling up to 64x64
  image(spriteSheet, 200, 100, 128, 128, sx, sy, sWidth, sHeight);

  // advance frame every 10 frames
  if (frameCount % 10 === 0) {
    frame = (frame + 1) % 2; // loop through 2 frames
  }

  //Loop through array and display all images
  // for (let i = 0; i < imgs.length; i++) {
  //  image(imgs[i], 50 + i*100, 100, 80, 80);
  // }
  //display one fish
  // image(currentImg1, 100, 350, 120, 120);
  //image(currentImg2, 300, 500, 120, 120);
  // image(currentImg3, 500, 600, 120, 120);

  // update + draw each swimmer
  for (let s of swimmers) {
    image(s.img, s.x, s.y, 120, 120);
    s.x += s.speed; // swim across x axis

    // reset when off screen
    if (s.x > width) {
      s.x = -80; // wrap around
      s.y = random(400, height - 100);
      s.img = random(imgs); // choose new random image
    }
  }
}

//optional: press mouse to get a new random image
function mousePressed() {
  // currentImg1 = random(imgs);
  // currentImg2 = random(imgs);
  //currentImg3 = random(imgs);



}
