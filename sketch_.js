let state = "title";
let timer = 120; //two minute to catch fish

//assets
let titlebg;
let gamebg;
let water;
let ground;
let duck;
let line;
let myfont;
//catching mech
let fishcaught = false;
let angle = 0; //cast line
//gameplay elements
let score;
var catchCount = 0;
//music;
let isPlaying = false;
let titlebgm;
let gamebgm;
let fishsound; //a bubble when they freshly spawn maybe
let fishcaughtsfx;

function preload() {
startbg = loadImage("backgrounds/duckstartscreen.gif");
  gamebg = loadImage("backgrounds/backgroounnd.gif");
  endbg = loadImage("backgrounds/ennd.gif");
  grass = loadImage("backgrounds/grass.PNG");
  myfont = loadFont("SuperFrog-Yqy1q.ttf");

  sheet = loadImage("assets/ducky_2_spritesheet.png");








}