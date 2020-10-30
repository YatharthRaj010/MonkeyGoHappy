//creating the variables for sprites and images
var monkey, monkey_running, monkeyCollide, ground, invisibleGround, groundImage, banana, bananaImage, obstacle, obstacleImage;
//creating the groups
var bananaGroup, obstacleGroup;
// creating the scores
var score = 0,bananaScore = 0;
//creating the variables for sounds
var gameOver, eat;
//creating the gameStates
var PLAY = 0;
var END = 1;
var gameState = PLAY;

function preload() {
  //pre-loading the annimation
  monkey_running = loadAnimation("sprite_0.png",  "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");
  //pre-loading the images
  monkeyCollide = loadAnimation("sprite_1.png");
  
  groundImage = loadAnimation("ground.png")
  
  bananaImage = loadImage("banana.png");
  
  obstacleImage = loadImage("obstacle.png");
  
  gameOver = loadSound("gameover.mp3");
  eat = loadSound("eating.mp3");
}

function setup() {
  createCanvas(400, 400);
  //creating the groups
  obstacleGroup = createGroup();
  bananaGroup = createGroup();
  //creating the sprite
  monkey = createSprite(80, 230, 10, 10);
  monkey.scale = 0.12;
  monkey.addAnimation("monkey", monkey_running);
  monkey.addAnimation("collide", monkeyCollide);
  //monkey.debug=true;
  monkey.setCollider("circle",0,0,240);

  ground = createSprite(300, 340, 600, 10);
  ground.scale = 1;

  ground.addAnimation("ground", groundImage);

  invisibleGround = createSprite(300, 278, 600, 7);
  invisibleGround.visible = false;
}

function draw() {
  background("lightblue");
  //displying the Bananas Collected and the Survival Time
  fill("black");
  text("Banana Collected : " + bananaScore, 60, 20);
  text("Survival Time: " + score,240,20);

  if (gameState === PLAY) {
    obstacles();
    bananas();
    //increasing the score(Survial Time)
    score = score + Math.round(getFrameRate() / 60);
    //icreasing tyhe speed 
    ground.velocityX = -(4 + score * 1.5 / 100);
    //making the monkey jump on pressing SPACE
    if (keyDown("space") && monkey.y >= 235) {
      monkey.velocityY = -13;
    }
    //adding the gravity
    monkey.velocityY = monkey.velocityY + 0.8
    //making the ground move infinately
    if (ground.x < 0) {
      ground.x = ground.width / 2;
      console.log(ground.x)
    }
    //icreasing the bananaScore(Banana Collected) and destroying the bananas if the monkey touches the bananaGroup
    if (monkey.isTouching(bananaGroup)) {
      bananaScore++;
      bananaGroup.destroyEach();
      eat.play();
    }
    //changing the gameState if the the monkey touches the obstacles
    if (monkey.isTouching(obstacleGroup)) {
      gameState = END;
      gameOver.play();
    }
  }
  
  
  if (gameState === END) {
    ground.velocityX = 0;

    monkey.y = 235;
    monkey.scale = 0.12;
    monkey.changeAnimation("collide", monkeyCollide);
    //seting the velocity 0
    obstacleGroup.setVelocityXEach(0);
    bananaGroup.setVelocityXEach(0);
    //setting the Lifetime
    obstacleGroup.setLifetimeEach(-1);
    bananaGroup.setLifetimeEach(-1);
    //displaying the texts
    fill("red")
    stroke("black")
    textSize(30);
    text("GAMEOVER", 80, 170);
    fill("black");
    textSize(13);
    text("Press 'R' to play again...", 100, 200);
    
    //reseting the gameState to play when "r" is pressed
    if (keyDown("r")) {
      bananaGroup.destroyEach();
      obstacleGroup.destroyEach();
      monkey.changeAnimation("monkey", monkey_running);
      score = 0;
      bananaScore = 0;
      gameState = PLAY;
    }
  }
  drawSprites();
  
  //colliding themonkey with the Invisble Ground
  monkey.collide(invisibleGround);
}

//writing the behaviour of the fruits
function bananas() {
  //spawning the banana after every 80 frames
  if (frameCount % 80 === 0) {
    //creating the sprite
    banana = createSprite(620, 120, 50, 50);
    //adding the animation
    banana.addAnimation("banana", bananaImage);
    //scaling the image
    banana.scale = 0.1;
    //increasing the X velocity to make the game more complex
    banana.velocityX = -(4 + score * 1.5 / 100);
    //setting the lifetime
    banana.lifetime = 220;
    //adding the banana to the bananaGroup
    bananaGroup.add(banana);
  }
}

//writing the behaviour of the obstacles 
function obstacles() {
  //spawning the obstacles after every 200 frames
  if (frameCount % 200 === 0) {
    //creating the sprite
    obstacle = createSprite(620, 253, 50, 50);
    //adding the animation
    obstacle.addAnimation("rock", obstacleImage);
    //setting the collider
    obstacle.setCollider("circle", 0, 0, 180);
    //scaling the image
    obstacle.scale = 0.13;
    //increasing the velocity to make the game more complex
    obstacle.velocityX = -(4 + score * 1.5 / 100);
    //setting the lifetime
    obstacle.lifetime = 220;
    //adding the obstacle to the obstacle
    obstacleGroup.add(obstacle);

  }
}