import { SHAPES } from "../../utils.js";
const { TRIANGLE, SQUARE, DIAMOND, BOMB } = SHAPES;
export default class Preload extends Phaser.Scene {
    constructor() {
      super("Preload");
    }

    preload() {
        this.load.image("sky", "./assets/image/sky.png");
        this.load.image("platform", "./assets/image/platform.png");
        this.load.image("ninja", "./assets/image/ninja.png");
        this.load.image("win", "./assets/image/win.png");
        this.load.image(SQUARE, "./assets/image/square.png");
        this.load.image(DIAMOND, "./assets/image/diamond.png");
        this.load.image(TRIANGLE, "./assets/image/triangle.png");
        this.load.image(BOMB, "./assets/image/bomb.png");
        this.load.image("youLost", "./assets/image/youLost.jpg");
      }
    
    create(){
        this.scene.start("Game");
    }
}