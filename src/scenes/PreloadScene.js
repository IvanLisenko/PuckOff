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
      this.add
        .image(0, 0, "background")
        .setOrigin(0)
        .setDisplaySize(width, height);

      // Показываем текст "Загрузка..."
      this.add
        .text(width / 2, height / 2 - height * 0.05, "Загрузка...", {
          fontSize: "30px",
          fontStyle: "bold",
          fontFamily: "Arial",
          color: "#ffffff",
        })
        .setOrigin(0.5);
      // Прогресс-бар
      const progressBox = this.add.graphics();
      const progressBar = this.add.graphics();

      progressBox.fillStyle(0x0e0528, 0.8);
      progressBox.fillRoundedRect(
        width / 2 - 150,
        height / 2 - 10,
        300,
        20,
        10
      );

      this.load.on("progress", (value) => {
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRoundedRect(
          width / 2 - 148,
          height / 2 - 8,
          Math.max(296 * value, 16),
          16,
          8
        );
      });
    });

   
    this.load.image("menu", "assets/backgrounds/menu.jpg");
    this.load.audio("menuMusic", "assets/audio/menu_music.mp3");
    this.load.image("sound-on", "assets/logo/sound_on.png");
    this.load.image("sound-off", "assets/logo/sound_off.png");
    this.load.image("gamebg", "assets/backgrounds/game.png");
    this.load.audio("button-pointed", "assets/audio/button_pointed.mp3");
    this.load.audio("button-clicked", "assets/audio/button_clicked.mp3");
    this.load.image("game-background", "assets/backgrounds/game_background.jpg")
    this.load.image("table", "assets/logo/game_table.png")
    this.load.image("option-background", "assets/backgrounds/option_background.png")

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
