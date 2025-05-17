import Phaser from "phaser";
import { AudioSettings } from "../utils/AudioSettings";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    // Музыка
    if (!this.sound.get("gameMusic")) {
      this.gameMusic = this.sound.add("gameMusic", {
        loop: true,
        volume: AudioSettings.musicVolume,
      });
      this.gameMusic.play();
    } else {
      this.gameMusic = this.sound.get("gameMusic");
    }

    const { width, height } = this.cameras.main;

    // Фон и игровые элементы
    this.add.image(0, 0, "game-background")
      .setOrigin(0)
      .setDisplaySize(width, height);

    this.add.image(width / 2, height / 2, "table").setScale(1.2);

    // Кнопка паузы
    const pauseBtn = this.add
      .text(width - 30, 30, "▐▐", {
        font: "24px Arial",
        fill: "#ffffff",
      })
      .setOrigin(1, 0)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("Нажал пазузу");
        this.scene.launch("PauseScene");
        if (!this.scene.isPaused()) {
          this.scene.pause();
        }
      });

    // Создаем шарик
    this.ball = this.add.circle(
      width / 2, 
      height / 2, 
      16, 
      0xff0000 // Красный цвет
    );
    
    // Физические параметры шарика
    this.ballVelocity = {
      x: Phaser.Math.Between(1000, 2000) * Phaser.Math.Between(0, 1) ? 1 : -1,
      y: Phaser.Math.Between(1000, 2000) * Phaser.Math.Between(0, 1) ? 1 : -1
    };
    
    // Границы мира
    this.worldBounds = {
      x: 0,
      y: 0,
      width: width,
      height: height
    };
  }

  update(time, delta) {
    // Нормализуем скорость относительно времени кадра
    const deltaFactor = delta / 0.1; // 16ms - стандартное время кадра
    
    // Перемещаем шарик
    this.ball.x += this.ballVelocity.x * deltaFactor;
    this.ball.y += this.ballVelocity.y * deltaFactor;
    
    // Проверка столкновений с границами
    const radius = 16;
    
    // Правая граница
    if (this.ball.x + radius > this.worldBounds.width) {
      this.ball.x = this.worldBounds.width - radius;
      this.ballVelocity.x *= -1; // Отражаем по X
    }
    
    // Левая граница
    if (this.ball.x - radius < this.worldBounds.x) {
      this.ball.x = radius;
      this.ballVelocity.x *= -1;
    }
    
    // Нижняя граница
    if (this.ball.y + radius > this.worldBounds.height) {
      this.ball.y = this.worldBounds.height - radius;
      this.ballVelocity.y *= -1; // Отражаем по Y
    }
    
    // Верхняя граница
    if (this.ball.y - radius < this.worldBounds.y) {
      this.ball.y = radius;
      this.ballVelocity.y *= -1;
    }
  }
}