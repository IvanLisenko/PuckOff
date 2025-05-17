import Phaser from "phaser";
import { createButton } from "../utils/ButtonUtils";
export default class PauseScene extends Phaser.Scene {
  constructor() {
    super("PauseScene");
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.6);
    overlay.fillRect(0, 0, width, height);

    createButton(this, width / 2, height / 2 - 40, "Продолжить", () => {
      this.scene.get("GameScene").scene.resume();
      this.scene.stop();
    });

    createButton(this, width/2, height/2 + 40, "Выйти", () => {
        this.scene.start("MenuScene");
        this.scene.get("GameScene").gameMusic.stop();
        this.scene.stop("GameScene");
    });
  }
}
