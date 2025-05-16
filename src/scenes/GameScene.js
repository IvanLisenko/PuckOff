import Phaser from "phaser";
import { AudioSettings } from "../utils/AudioSettings";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
     // Проверка: если музыка уже есть — не создавать заново
        if (!this.sound.get("gameMusic")) {
          this.gameMusic = this.sound.add("gameMusic", {
            loop: true,
            volume: AudioSettings.musicVolume,
          });
          this.gameMusic.play();
        } else {
          this.gameMusic = this.sound.get("gameMusic");
        }
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Фон
    this.add
      .image(0, 0, "game-background")
      .setOrigin(0)
      .setDisplaySize(width, height);

    // Стол (центральное изображение)
    const table = this.add.image(width / 2, height / 2, "table");
    table.setScale(1.2);

    // ⚙️ Игровая зона (вручную подогнано под твой фон — можешь поправить значения)
    const sideMargin = 175; // по 100px с каждой стороны
    const topBottomMargin = 105;

    const playWidth = width - sideMargin * 2;
    const playHeight = height - topBottomMargin * 2;

    this.playArea = {
      x: sideMargin, // слева
      y: topBottomMargin, // сверху
      width: playWidth,
      height: playHeight,
      radius: 65,
    };

    // 🔍 Нарисуем границы поля (для отладки — потом можно удалить)
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xff0000, 1);
    graphics.strokeRoundedRect(
      this.playArea.x,
      this.playArea.y,
      this.playArea.width,
      this.playArea.height,
      this.playArea.radius
    );
  }
}
