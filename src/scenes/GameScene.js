import Phaser from "phaser";
import Puck from "../objects/Puck";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    this.add.image(0, 0, "gamebg").setOrigin(0).setDisplaySize(width, height);
  }

  update() {
    // Логика игры
  }
}
