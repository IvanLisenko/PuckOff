import Phaser from "phaser";
import { AudioSettings } from "../utils/AudioSettings";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    const { width, height } = this.cameras.main;

    // --- Музыка ---
    const existingMusic = this.sound.get("gameMusic");
    if (!existingMusic) {
      this.gameMusic = this.sound.add("gameMusic", {
        loop: true,
        volume: AudioSettings.musicVolume,
      });
      this.gameMusic.play();
    } else {
      this.gameMusic = existingMusic;
      if (!this.gameMusic.isPlaying) {
        this.gameMusic.play();
      }
    }

    // --- Задний фон ---
    this.add.image(0, 0, "game-background").setOrigin(0).setDisplaySize(width, height);
    this.add.image(width / 2, height / 2, "table").setScale(1.2);

    // Игровая зона
    const marginX = 175;
    const marginY = 105;
    this.playArea = {
      x: marginX,
      y: marginY,
      width: width - marginX * 2,
      height: height - marginY * 2
    };
     // Кнопка паузы
    this.add
      .text(width - 30, 30, "▐▐", {
        font: "24px Arial",
        fill: "#ffffff",
      })
      .setOrigin(1, 0)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("Нажал паузу");
        this.scene.launch("PauseScene");
        if (!this.scene.isPaused()) {
          this.scene.pause();
        }
      });

    // Физические параметры
    this.physicsParams = {
      puckRadius: 15,
      paddleRadius: 30,
      puckMass: 1,
      paddleMass: 5,
      maxPuckSpeed: 1500,
      friction: 0.99,
      restitution: 0.85,
      hitRandomness: 10,
      minHitSpeed: 200,      // Минимальная скорость удара ракеткой
      minBounceSpeed: 100    // Минимальная скорость шайбы для отскока
    };

    // --- Шайба ---
    this.puck = this.add.circle(
      width / 2, 
      height / 2, 
      this.physicsParams.puckRadius, 
      0x000000
    );
    this.puckVelocity = new Phaser.Math.Vector2(0, 0);
    this.puckPrevPos = new Phaser.Math.Vector2(this.puck.x, this.puck.y);

    // --- Ракетка ---
    this.paddle = this.add.circle(
      width / 2, 
      height - 100, 
      this.physicsParams.paddleRadius, 
      0x0000ff
    );
    this.paddlePrevPos = new Phaser.Math.Vector2(this.paddle.x, this.paddle.y);
    this.paddleVelocity = new Phaser.Math.Vector2(0, 0);

    // Ввод
    this.input.on("pointermove", (pointer) => {
      const r = this.physicsParams.paddleRadius;
      const bounds = this.playArea;
      const x = Phaser.Math.Clamp(pointer.x, bounds.x + r, bounds.x + bounds.width - r);
      const y = Phaser.Math.Clamp(pointer.y, bounds.y + r, bounds.y + bounds.height - r);
      this.paddle.setPosition(x, y);
    });
  }

  update(_, delta) {
    const dt = delta / 1000;
    const bounds = this.playArea;
    const p = this.physicsParams;

    // --- Обновление скорости ракетки ---
    this.paddleVelocity.set(
      (this.paddle.x - this.paddlePrevPos.x) / dt,
      (this.paddle.y - this.paddlePrevPos.y) / dt
    );
    this.paddlePrevPos.set(this.paddle.x, this.paddle.y);

    // --- Обновление позиции шайбы ---
    this.puck.x += this.puckVelocity.x * dt;
    this.puck.y += this.puckVelocity.y * dt;

    // --- Трение ---
    this.puckVelocity.scale(p.friction);

    // --- Ограничение скорости ---
    const currentSpeed = this.puckVelocity.length();
    if (currentSpeed > p.maxPuckSpeed) {
      this.puckVelocity.normalize().scale(p.maxPuckSpeed);
    }

    // --- Столкновение со стенками ---
    const r = p.puckRadius;
    let collisionOccurred = false;

    // Левая стенка
    if (this.puck.x - r < bounds.x) {
      this.puck.x = bounds.x + r;
      this.puckVelocity.x = -this.puckVelocity.x * p.restitution;
      collisionOccurred = true;
    } 
    // Правая стенка
    else if (this.puck.x + r > bounds.x + bounds.width) {
      this.puck.x = bounds.x + bounds.width - r;
      this.puckVelocity.x = -this.puckVelocity.x * p.restitution;
      collisionOccurred = true;
    }

    // Верхняя стенка
    if (this.puck.y - r < bounds.y) {
      this.puck.y = bounds.y + r;
      this.puckVelocity.y = -this.puckVelocity.y * p.restitution;
      collisionOccurred = true;
    } 
    // Нижняя стенка
    else if (this.puck.y + r > bounds.y + bounds.height) {
      this.puck.y = bounds.y + bounds.height - r;
      this.puckVelocity.y = -this.puckVelocity.y * p.restitution;
      collisionOccurred = true;
    }

    // --- Столкновение с ракеткой ---
    const dx = this.puck.x - this.paddle.x;
    const dy = this.puck.y - this.paddle.y;
    const distSq = dx * dx + dy * dy;
    const minDist = p.puckRadius + p.paddleRadius;
    const minDistSq = minDist * minDist;

    if (distSq < minDistSq) {
      const dist = Math.sqrt(distSq);
      const normalX = dx / dist;
      const normalY = dy / dist;

      // Коррекция позиции
      const overlap = minDist - dist;
      this.puck.x += normalX * overlap * 0.5;
      this.puck.y += normalY * overlap * 0.5;
      this.paddle.x -= normalX * overlap * 0.5;
      this.paddle.y -= normalY * overlap * 0.5;

      // Относительная скорость
      const relVelX = this.puckVelocity.x - this.paddleVelocity.x;
      const relVelY = this.puckVelocity.y - this.paddleVelocity.y;
      const velocityAlongNormal = relVelX * normalX + relVelY * normalY;

      // Проверка условий для отскока
      const paddleSpeed = this.paddleVelocity.length();
      const puckSpeed = this.puckVelocity.length();
      
      if (velocityAlongNormal < 0 && (paddleSpeed > p.minHitSpeed || puckSpeed > p.minBounceSpeed)) {
        // Импульс при ударе
        const j = -(1 + p.restitution) * velocityAlongNormal;
        const totalMass = p.puckMass + p.paddleMass;
        const impulseX = normalX * j * p.paddleMass / totalMass;
        const impulseY = normalY * j * p.paddleMass / totalMass;

        this.puckVelocity.x += impulseX;
        this.puckVelocity.y += impulseY;

        // Случайность
        this.puckVelocity.x += (Math.random() - 0.5) * p.hitRandomness;
        this.puckVelocity.y += (Math.random() - 0.5) * p.hitRandomness;

        collisionOccurred = true;
      } else if (velocityAlongNormal < 0) {
        // Мягкий контакт без удара
        this.puck.x += normalX * overlap * 0.7;
        this.puck.y += normalY * overlap * 0.7;
      }
    }

    // Дополнительное ограничение скорости
    if (collisionOccurred && this.puckVelocity.length() > p.maxPuckSpeed) {
      this.puckVelocity.normalize().scale(p.maxPuckSpeed);
    }
  }
}