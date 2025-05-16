import Phaser from "phaser";
import { createButton } from "../utils/ButtonUtils";
import { AudioSettings } from "../utils/AudioSettings";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {}

  // MenuScene.js

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.image(0, 0, "menu").setOrigin(0).setDisplaySize(width, height);

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.2);
    overlay.fillRect(0, 0, width, height);

    // Проверка: если музыка уже есть — не создавать заново
    if (!this.sound.get("menuMusic")) {
      this.menuMusic = this.sound.add("menuMusic", {
        loop: true,
        volume: AudioSettings.musicVolume,
      });
      this.menuMusic.play();
    } else {
      this.menuMusic = this.sound.get("menuMusic");
    }

    // Кнопка "Начать игру"
    createButton(this, width / 2, height / 2 - 60, "Начать игру", () => {
      this.menuMusic.stop();
      this.scene.start("GameScene");
    });

    // Кнопка "Настройки"
    createButton(this, width / 2, height / 2 + 15, "Настройки", () => {
      this.scene.start("OptionScene");
    });
  }
}
