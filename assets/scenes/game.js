import { SHAPES } from "../../utils.js";
const {TRIANGLE, SQUARE, DIAMOND} = SHAPES
export default class Game extends Phaser.Scene {
  time;
  score;
  constructor() {
    super("game");
  }

  init() {
    this.shapesRecolected = {
      [TRIANGLE]: { count: 0, score: 10},
      [SQUARE]: { count: 0, score: 20},
      [DIAMOND]: { count: 0, score: 30},
    };
  }

  preload() {
    this.load.image("sky", "./assets/image/sky.png");
    this.load.image("platform", "./assets/image/platform.png");
    this.load.image("ninja", "./assets/image/ninja.png");
    this.load.image(SQUARE, "./assets/image/square.png");
    this.load.image(DIAMOND, "./assets/image/diamond.png");
    this.load.image(TRIANGLE, "./assets/image/triangle.png");
  }

  create() {
    //add background
    this.add.image(400, 300, "sky").setScale(0.555);

    //add static platforms
    let platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, "platform").setScale(2).refreshBody();
    platforms.create(150, 400, "platform").setScale(0.4).refreshBody();
    platforms.create(700, 200, "platform").setScale(0.4).refreshBody();
    platforms.create(425, 320, "platform").setScale(0.2).refreshBody();

    //add shapes
    this.shapesGroup = this.physics.add.group();
    // this.shapesGroup.create(100, 0, "square");
    // this.shapesGroup.create(200, 0, "diamond");
    // this.shapesGroup.create(300, 0, "triangle");
    //create event to add shapes
    this.time.addEvent({
      delay: 1500,
      callback: this.addShape,
      callbackScope: this,
      loop: true,
    });

    //add player
    this.player = this.physics.add.sprite(100, 450, "ninja");
    this.player.setCollideWorldBounds(true);

    //create cursor
    this.cursors = this.input.keyboard.createCursorKeys();

    //add collider between player and platforms
    //add collider between player and shapes
    
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.player, this.shapesGroup);
    this.physics.add.collider(platforms, this.shapesGroup);

    //add overlap between player and shapes
    this.physics.add.overlap(
      this.player,
      this.shapesGroup,
      this.collectShape,
      null,
      this
    );

    //add score on screen
    this.score = 0;
    this.scoreText = this.add.text(20, 20, "Score:" + this.score, {
      fontSize: "32px",
      fontStyle: "bold",
      fill: "#FFFFFF",
      
    });

    

  }

  update() {
    //Move player
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-250);
    } else {
      if (this.cursors.right.isDown) {
        this.player.setVelocityX(250);
      } else {
        this.player.setVelocityX(0);
      }

      //player jump
      if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-330);
      }
    }
  }

  addShape() {
    //get random shape
    const randomShape = Phaser.Math.RND.pick([DIAMOND, SQUARE, TRIANGLE]);

    //get random position x
    const randomX = Phaser.Math.RND.between(0, 800);

    //get shape to screen
    this.shapesGroup.create(randomX, 0, randomShape);
  }

  collectShape(player, shape) {
    //remove shape from screen
    shape.disableBody(true, true);
    
    const shapeName = shape.texture.key;
    this.shapesRecolected[shapeName].count++;

    this.score += this.shapesRecolected[shapeName].score;
    this.scoreText.setText(`score: ${this.score.toString()}`);

  }

  //add timer
  // function(){

  //   let = me = this;

  //   me.startTime = new Date();
  //   me.totalTime = 120;
  //   me.timeElapsed = 0;

  //   me.createTimer();

  //   me.gameTimer = game.time.events.loop(100, function(){
  //     me.updateTimer();
  //   });
  // }

  // //Timer display
  // function1(){

  //   let me = this;

  //   me.timeLabel = me.game.add.text(me.game.world.centerX, 100, "00:00", {font: "100px Arial", fill: "#FFFFFF"});
  //   me.timeLabel.anchor.setTo(0.5, 0);
  //   me.timeLabel.align = "center";
  // };

  // //Update timer
  // function2(){

  //   const me = this;

  //   let currentTime = new Date();
  //   let timeDifference = me.startTime.getTime() - currentTime.getTime();

  //   //Time elapsed in seconds
  //   me.timeElapsed = Math.abs(timeDifference / 1000);

  //   //Time remaining in seconds
  //   let timeRemaining = me.totalTime - me.timeElapsed;

  //   //Convert seconds into minutes and seconds
  //   let minutes = Math.floor(timeRemaining / 60);
  //   let seconds = Math.floor(timeRemaining) - (60 * minutes);

  //   //Display minutes, add a 0 to the start if less than 10
  //   let result = (minutes < 10) ? "0" + minutes : minutes;

  //   //Display seconds, add a 0 to the start if less than 10
  //   result += (seconds < 10) ? ":0" + seconds : ":" + seconds;

  //   me.timeLabel.text = result;

  // }
}
