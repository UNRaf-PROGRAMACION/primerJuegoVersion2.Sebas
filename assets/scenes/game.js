import {
  SHAPES,
  POINTS_PERCENTAGE,
  POINTS_PERCENTAGE_VALUE_START,
} from "../../utils.js";
const { TRIANGLE, SQUARE, DIAMOND, BOMB } = SHAPES;
export default class Game extends Phaser.Scene {
  score;
  gameOver;
  constructor() {
    super("Game");
  }

  init() {
    this.gameOver = false;

    this.shapesRecolected = {
      [TRIANGLE]: { count: 0, score: 10 },
      [SQUARE]: { count: 0, score: 20 },
      [DIAMOND]: { count: 0, score: 30 },
      [BOMB]: { count: 0, score: -50 },
    };
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
      delay: 500,
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

    //add overlap between shapes and platforms
    this.physics.add.overlap(
      this.shapesGroup,      
      platforms,
      this.reduce,
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

    //add timer
    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });

    //add timer on screen
    this.timer = 60;
    this.timerText = this.add.text(750, 20, this.timer, {
      fontSize: "32px",
      fontStyle: "bold",
      fill: "#FFFFFF",
    });
  }

  update() {
    //win condition
    if (this.score >= 200) {
      this.scene.start("Win");
    }
    //lose condition
    if (this.gameOver) {
      this.scene.start("GameOver");
    }

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
    const randomShape = Phaser.Math.RND.pick([DIAMOND, SQUARE, TRIANGLE, BOMB]);

    //get random position x
    const randomX = Phaser.Math.RND.between(50, 750);

    //get shape to screen
    this.shapesGroup
      .create(randomX, 0, randomShape)
      .setCircle(32, 0, 0)
      .setBounce(0.8)
      .setData(POINTS_PERCENTAGE, POINTS_PERCENTAGE_VALUE_START);
  }

  collectShape(player, shape) {
    //remove shape from screen
    shape.disableBody(true, true);

    const shapeName = shape.texture.key;
    const percentage = shape.getData(POINTS_PERCENTAGE);
    const scoreNow = this.shapesRecolected[shapeName].score * percentage;

    this.score += scoreNow;
    this.scoreText.setText(`score: ${this.score.toString()}`);

    this.shapesRecolected[shapeName].count++;
  }

  onSecond() {
    this.timer--;
    this.timerText.setText(this.timer);
    if (this.timer <= 0) {
      this.gameOver = true;
    }
  }

  reduce(shape, platforms) {
    const newPercentage = shape.getData(POINTS_PERCENTAGE) - 0.25;
    console.log(shape.texture.key, newPercentage);
    shape.setData(POINTS_PERCENTAGE, newPercentage);
    if (newPercentage <= 0) {
      shape.disableBody(true, true);
      return;
    }

    const text = this.add.text(
      shape.body.position.x + 10,
      shape.body.position.y,
      "-25%",
      {
        fontSize: "22px",
        fontStyle: "bold",
        fill: "red",
      }
    );

    setTimeout(() => {
      text.destroy();
    }, 200);
  }
}
