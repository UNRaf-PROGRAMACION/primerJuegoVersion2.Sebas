import { SHAPES } from "../../utils.js";
const {TRIANGLE, SQUARE, DIAMOND} = SHAPES
export default class Game extends Phaser.Scene {
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

}
