import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.cameras.main.setBackgroundColor("#42aaff");
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add
      .text(width / 2, height / 2 - height * 0.05, "Загрузка...", {
        font: "20px monospace",
        color: "#ffffff",
      })
      .setOrigin(0.5);
    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();

    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRoundedRect(width / 2 - 150, height / 2 - 10, 300, 20, 10);

    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRoundedRect(width / 2 - 148, height / 2 - 8, Math.max(296 * value, 16), 16, 8);
    });

    for (let i = 1; i < 20; i++) {
       this.load.audio(`theme${i}`, [`assets/audio/theme${i}.mp3`]);
    }
    this.load.image("logo", "assets/logo/logo.jpg");

    this.load.on('complete', () => {
       this.scene.start("GameScene");
    });
    // this.load.start();
  }

  create() {
    // this.scene.start("GameScene");
  }

  update() {
    // Логика игры
  }
}
