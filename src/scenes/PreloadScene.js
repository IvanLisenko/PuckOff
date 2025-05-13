import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Сначала загружаем фон
    
    this.load.image("background", "assets/backgrounds/preload.jpg");

    // Когда фон загружен
    this.load.once("filecomplete-image-background", () => {
      // Устанавливаем фон
      this.add.image(0, 0, "background").setOrigin(0).setDisplaySize(width, height);

      // Показываем текст "Загрузка..."
      this.add
        .text(width / 2, height / 2 - height * 0.05, "Загрузка...", {
          font: "25px monospace",
          color: "#ffffff",
          stroke: "#ffffff",
          strokeThickness: 0.3,
        })
        .setOrigin(0.5);
      // Прогресс-бар
      const progressBox = this.add.graphics();
      const progressBar = this.add.graphics();

      progressBox.fillStyle(0x0E0528, 0.8);
      progressBox.fillRoundedRect(width / 2 - 150, height / 2 - 10, 300, 20, 10);

      this.load.on("progress", (value) => {
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRoundedRect(width / 2 - 148, height / 2 - 8, Math.max(296 * value, 16), 16, 8);
      });
    });

    // Загружаем ресурсы, которые идут после фона
    for (let i = 1; i < 20; i++) {
      this.load.audio(`theme${i}`, [`assets/audio/theme${i}.mp3`]);
    }
    this.load.image("logo", "assets/logo/logo.jpg");
    this.load.image("menu", "assets/backgrounds/menu.jpg")

    this.load.on("complete", () => {
      this.scene.start("MenuScene");
    });
  }

  create() {
    // Переход в GameScene уже в on complete
  }

  update() {
    // Пока не используется
  }
}
