import Phaser from "phaser";
import Puck from "../objects/Puck";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.image(0, 0, "game-background").setOrigin(0).setDisplaySize(width, height);

    const table = this.add.image(width/2, height/2, 'table');
    table.setScale(1.2);
  }
}
