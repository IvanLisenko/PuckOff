import Phaser from "phaser";
import { createButton } from "../utils/ButtonUtils";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {}

  create() {
     const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Фон
    this.add.image(0, 0, "menu").setOrigin(0).setDisplaySize(width, height);

    // Полупрозрачная заливка
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.2);
    overlay.fillRect(0, 0, width, height);

    // Музыка (играет сразу)
    this.menuMusic = this.sound.add("menuMusic", {
      loop: true,
      volume: 0.9,
    });
    this.menuMusic.play();

    // Кнопка "Начать игру"
    createButton(this, width / 2, height / 2 - 60, "Начать игру", () => {
      this.menuMusic.stop();
      this.scene.start("GameScene");
    });

    // Кнопка "Настройки"
    createButton(this, width / 2, height / 2 + 15, "Настройки", () => {
      this.menuMusic.stop();
    });

    // === КНОПКА ЗВУКА ===
    this.isSoundOn = true;

    this.soundButton = this.add.image(50, 500, 'sound-on')
      .setScale(1.5)
      .setInteractive();

    this.children.bringToTop(this.soundButton);

    this.soundButton.on('pointerdown', () => {
      this.isSoundOn = !this.isSoundOn;

      if (this.isSoundOn) {
        this.menuMusic.setVolume(0.9); // Возвращаем звук
        this.soundButton.setTexture('sound-on');
      } else {
        this.menuMusic.setVolume(0); // Отключаем звук (музыка всё ещё играет!)
        this.soundButton.setTexture('sound-off');
      }
    });
  }
}
