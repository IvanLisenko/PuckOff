import Phaser from "phaser";
import { AudioSettings } from "../utils/AudioSettings";
import { SoundManager } from "../utils/SoundManager";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
     let existingMusic = this.sound.get("gameMusic");
  if (!existingMusic) {
    this.gameMusic = SoundManager.add(this, "gameMusic", { loop: true });
    this.gameMusic.play();
  } else {
    this.gameMusic = existingMusic;
    if (!this.gameMusic.isPlaying) {
      this.gameMusic.play();
    }
    this.gameMusic.setVolume(AudioSettings.musicVolume * 0.7);
  }
    this.maxScore = 5;
    this.isGameOver = false;

    // Создаем текст для результата, если его ещё нет
    this.resultText = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, "", {
        fontSize: "48px",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setVisible(false);
    const { width, height } = this.cameras.main;
    const p = (this.physicsParams = {
      puckRadius: 22,
      paddleRadius: 30,
      puckMass: 1,
      paddleMass: 5,
      maxPuckSpeed: 2500,
      friction: 0.99,
      restitution: 0.85,
      hitRandomness: 10,
      minHitSpeed: 300,
      minBounceSpeed: 100,
    });
  
    // --- Задний фон ---
    this.add
      .image(0, 0, "game-background")
      .setOrigin(0)
      .setDisplaySize(width, height);
    this.add.image(width / 2, height / 2, "table").setScale(1.2);

    // Игровая зона
    const marginX = 175;
    const marginY = 105;
    this.playArea = {
      x: marginX,
      y: marginY,
      width: width - marginX * 2,
      height: height - marginY * 2,
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
        this.scene.launch("PauseScene");
        if (!this.scene.isPaused()) {
          this.scene.pause();
        }
      });

    // --- Шайба с текстурой ---
    this.puck = this.add
      .image(width / 2, height / 2, "puck")
      .setDisplaySize(p.puckRadius * 2.9, p.puckRadius * 2)
      .setOrigin(0.5);

    this.puckVelocity = new Phaser.Math.Vector2(0, 0);
    this.puckPrevPos = new Phaser.Math.Vector2(this.puck.x, this.puck.y);

    // --- Создание текстуры для ракеток ---
    const radius = p.paddleRadius;
    const borderThickness = 3;
    const diameterWithBorder = radius * 2 + borderThickness * 2;

    const paddleGraphics = this.add.graphics();
    paddleGraphics.lineStyle(borderThickness, 0x8e292d, 1);
    paddleGraphics.fillStyle(0xb62a2b, 1);
    paddleGraphics.fillCircle(
      diameterWithBorder / 2,
      diameterWithBorder / 2,
      radius
    );
    paddleGraphics.strokeCircle(
      diameterWithBorder / 2,
      diameterWithBorder / 2,
      radius
    );
    paddleGraphics.generateTexture(
      "paddleCircle",
      diameterWithBorder,
      diameterWithBorder
    );
    paddleGraphics.destroy();

    // --- Левая ракетка ---
    this.leftPaddle = this.add
      .image(width / 2 - 320, height / 2, "paddleCircle")
      .setOrigin(0.5);

    const paddleGraphics2 = this.add.graphics();
    paddleGraphics2.lineStyle(borderThickness, 0x1a314f, 1); // Новый цвет рамки
    paddleGraphics2.fillStyle(0x174882, 1); // Новый цвет заливки
    paddleGraphics2.fillCircle(
      diameterWithBorder / 2,
      diameterWithBorder / 2,
      radius
    );
    paddleGraphics2.strokeCircle(
      diameterWithBorder / 2,
      diameterWithBorder / 2,
      radius
    );
    paddleGraphics2.generateTexture(
      "paddleCircleRight",
      diameterWithBorder,
      diameterWithBorder
    );
    paddleGraphics2.destroy();

    // --- Правая ракетка ---
    this.rightPaddle = this.add
      .image(
        width / 2 + 320,
        height / 2,
        "paddleCircleRight" // изменили здесь
      )
      .setOrigin(0.5);

    this.leftPaddlePrevPos = new Phaser.Math.Vector2(
      this.leftPaddle.x,
      this.leftPaddle.y
    );
    this.rightPaddlePrevPos = new Phaser.Math.Vector2(
      this.rightPaddle.x,
      this.rightPaddle.y
    );
    this.leftPaddleVelocity = new Phaser.Math.Vector2(0, 0);
    this.rightPaddleVelocity = new Phaser.Math.Vector2(0, 0);

    // --- Счетчики скорости ---
    this.speedTextStyle = {
      font: "18px Arial",
      fill: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 },
    };

    // Ввод для левой ракетки (управление мышью)
    this.isDraggingLeftPaddle = false;
    this.leftPaddle.setInteractive();

    this.input.on("pointerdown", (pointer) => {
      const paddleBounds = this.leftPaddle.getBounds();
      if (paddleBounds.contains(pointer.x, pointer.y)) {
        this.isDraggingLeftPaddle = true;
      }
    });

    this.input.on("pointerup", () => {
      this.isDraggingLeftPaddle = false;
    });

    this.input.on("pointermove", (pointer) => {
      if (this.isDraggingLeftPaddle) {
        const r = p.paddleRadius;
        const bounds = this.playArea;
        const x = Phaser.Math.Clamp(
          pointer.x,
          bounds.x + r,
          bounds.x + bounds.width / 2 - r - 10 // Ограничение до центра поля
        );
        const y = Phaser.Math.Clamp(
          pointer.y,
          bounds.y + r,
          bounds.y + bounds.height - r
        );
        this.leftPaddle.setPosition(x, y);
      }
    });
    this.resultText = this.add
      .text(this.cameras.main.width / 2, this.cameras.main.height / 2, "", {
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setVisible(false);
    // Ввод для правой ракетки (управление клавишами WASD)
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.leftScore = 0;
    this.rightScore = 0;

    this.scoreText = this.add
      .text(
        this.cameras.main.width / 2,
        30,
        `${this.leftScore} : ${this.rightScore}`,
        {
          fontSize: "48px",
          fontFamily: "Arial",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5, 0);
    // Центрировать по ширине

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Чёрный цвет: 0x000000
    const color = 0x000000;

    // Первый прямоугольник (в центре)
    this.leftRect = this.add.rectangle(centerX - 465, centerY, 4, 100, color);

    // Второй прямоугольник (чуть правее, просто для примера)
    this.rightRect = this.add.rectangle(centerX + 465, centerY, 4, 100, color);
  }
  updateScore(side) {
    if (this.isGameOver) return;
    
    if (side === "left") {
      const sound = SoundManager.add(this, "goal", {
        volume: AudioSettings.sfxVolume, // или просто убери volume — он выставится автоматически
      });
      sound.play();
      this.leftScore++;
    } else {
        const sound = SoundManager.add(this, "goal2", {
        volume: AudioSettings.sfxVolume, // или просто убери volume — он выставится автоматически
      });
      sound.play();
      this.rightScore++;
    }

    this.scoreText.setText(`${this.leftScore} : ${this.rightScore}`);

    if (this.leftScore >= this.maxScore || this.rightScore >= this.maxScore) {
      this.endGame();
    } else {
      this.resetPuck();
    }
  }
  resetPuck() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Центр игрового поля для шайбы
    this.puck.setPosition(centerX, centerY);
    this.puckVelocity.set(0, 0);

    // Возвращаем ракетки в стартовые позиции
    this.leftPaddle.setPosition(centerX - 320, centerY);
    this.leftPaddlePrevPos.set(this.leftPaddle.x, this.leftPaddle.y);
    this.leftPaddleVelocity.set(0, 0);

    this.rightPaddle.setPosition(centerX + 320, centerY);
    this.rightPaddlePrevPos.set(this.rightPaddle.x, this.rightPaddle.y);
    this.rightPaddleVelocity.set(0, 0);

    this.isGoal = true;
    this.cameras.main.flash(300, 255, 255, 255);
    // Запускаем шайбу через 2 секунды с небольшой скоростью в случайном направлении
    this.time.delayedCall(1, () => {
      this.isGoal = false;
      const speedX = 5 * (Math.random() > 0.5 ? 1 : -1);
      const speedY = 5 * (Math.random() > 0.5 ? 1 : -1);
      this.puckVelocity.set(speedX, speedY);
    });
    this.leftPaddleStartX = width / 2 - 320;
    this.leftPaddleStartY = height / 2;

    this.rightPaddleStartX = width / 2 + 320;
    this.rightPaddleStartY = height / 2;
  }
  checkGameOver() {
    if (this.scoreLeft >= this.maxScore) {
      this.endGame("Левая команда выиграла!", 0x0000ff); // синий цвет
    } else if (this.scoreRight >= this.maxScore) {
      this.endGame("Правая команда выиграла!", 0xff0000); // красный цвет
    }
  }
  endGame() {
    this.isGameOver = true;

    let winnerText;
    let winnerColor;
    const sound = SoundManager.add(this, "win", {
        volume: AudioSettings.sfxVolume, // или просто убери volume — он выставится автоматически
      });
      sound.play();
    if (this.leftScore > this.rightScore) {
      winnerText = "Красный игрок выиграл!";
      winnerColor = "#ff0000"; // красный
    } else if (this.rightScore > this.leftScore) {
      winnerText = "Синий игрок выиграл!";
      winnerColor = "#0000ff"; // синий
    } else {
      winnerText = "Ничья!";
      winnerColor = "#ffffff"; // белый
    }

    this.resultText.setText(winnerText);
    this.resultText.setStyle({
      fontSize: "48px",
      fontFamily: "Arial",
      fontStyle: "bold",
      color: winnerColor,
      stroke: "#000000", // обводка
      strokeThickness: 3,
    });
    this.resultText.setVisible(true);

    // Ждём 5 секунд, потом сбрасываем игру
    this.time.delayedCall(5000, () => {
      this.resultText.setVisible(false);
      this.leftScore = 0;
      this.rightScore = 0;
      this.scoreText.setText("0 : 0");
      this.resetPuck();
      this.isGameOver = false;
    });
  }

  resetGame() {
    this.isGameOver = false;
    this.scoreLeft = 0;
    this.scoreRight = 0;
    this.updateScore();

    // Сброс шайбы и ракеток в начальные позиции
    this.resetPuck();
    this.leftPaddle.setPosition(this.leftPaddleStartX, this.leftPaddleStartY);
    this.rightPaddle.setPosition(
      this.rightPaddleStartX,
      this.rightPaddleStartY
    );

    // Обнуляем предыдущие позиции для корректного вычисления скорости
    this.leftPaddlePrevPos.set(this.leftPaddleStartX, this.leftPaddleStartY);
    this.rightPaddlePrevPos.set(this.rightPaddleStartX, this.rightPaddleStartY);

    // Обнуляем скорости ракеток и шайбы
    this.leftPaddleVelocity.set(0, 0);
    this.rightPaddleVelocity.set(0, 0);
    this.puckVelocity.set(0, 0);
  }

  update(time, delta) {
    if (this.isGameOver) return; // Если игра закончена — не обновляем логику

    const dt = delta / 1000;
    const bounds = this.playArea;
    const p = this.physicsParams;

    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.puck.getBounds(),
        this.leftRect.getBounds()
      )
    ) {
      this.updateScore("right");
      this.checkGameOver();
      if (!this.isGameOver) this.resetPuck();
    }

    // Гол в правый прямоугольник (счёт левому игроку)
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.puck.getBounds(),
        this.rightRect.getBounds()
      )
    ) {
      this.updateScore("left");
      this.checkGameOver();
      if (!this.isGameOver) this.resetPuck();
    }

    // Обновление скорости левой ракетки
    this.leftPaddleVelocity.set(
      (this.leftPaddle.x - this.leftPaddlePrevPos.x) / dt,
      (this.leftPaddle.y - this.leftPaddlePrevPos.y) / dt
    );
    this.leftPaddlePrevPos.set(this.leftPaddle.x, this.leftPaddle.y);

    // Управление правой ракеткой
    const paddleSpeed = 500;
    if (this.cursors.up.isDown) {
      this.rightPaddle.y -= paddleSpeed * dt;
    }
    if (this.cursors.down.isDown) {
      this.rightPaddle.y += paddleSpeed * dt;
    }
    if (this.cursors.left.isDown) {
      this.rightPaddle.x -= paddleSpeed * dt;
    }
    if (this.cursors.right.isDown) {
      this.rightPaddle.x += paddleSpeed * dt;
    }

    // Ограничение движения правой ракетки
    const r = p.paddleRadius;
    this.rightPaddle.x = Phaser.Math.Clamp(
      this.rightPaddle.x,
      bounds.x + bounds.width / 2 + 40,
      bounds.x + bounds.width - r
    );
    this.rightPaddle.y = Phaser.Math.Clamp(
      this.rightPaddle.y,
      bounds.y + r,
      bounds.y + bounds.height - r
    );

    // Обновление скорости правой ракетки
    this.rightPaddleVelocity.set(
      (this.rightPaddle.x - this.rightPaddlePrevPos.x) / dt,
      (this.rightPaddle.y - this.rightPaddlePrevPos.y) / dt
    );
    this.rightPaddlePrevPos.set(this.rightPaddle.x, this.rightPaddle.y);

    // Обновление позиции шайбы
    this.puck.x += this.puckVelocity.x * dt;
    this.puck.y += this.puckVelocity.y * dt;

    // Трение
    this.puckVelocity.scale(p.friction);

    // Ограничение скорости шайбы
    if (this.puckVelocity.length() > p.maxPuckSpeed) {
      this.puckVelocity.normalize().scale(p.maxPuckSpeed);
    }

    // Столкновения шайбы со стенками
    const puckR = p.puckRadius;
    let collisionOccurred = false;

    if (this.puck.x - puckR < bounds.x) {
      this.puck.x = bounds.x + puckR;
      this.puckVelocity.x *= -p.restitution;
      collisionOccurred = true;
      const sound = SoundManager.add(this, "wallBounce", {
        volume: AudioSettings.sfxVolume * 0.1, // или просто убери volume — он выставится автоматически
      });
      sound.play();
    } else if (this.puck.x + puckR > bounds.x + bounds.width) {
      this.puck.x = bounds.x + bounds.width - puckR;
      this.puckVelocity.x *= -p.restitution;
      collisionOccurred = true;
      const sound = SoundManager.add(this, "wallBounce", {
        volume: AudioSettings.sfxVolume * 0.1, // или просто убери volume — он выставится автоматически
      });
      sound.play();
    }

    if (this.puck.y - puckR < bounds.y) {
      this.puck.y = bounds.y + puckR;
      this.puckVelocity.y *= -p.restitution;
      collisionOccurred = true;
      const sound = SoundManager.add(this, "wallBounce", {
        volume: AudioSettings.sfxVolume * 0.1, // или просто убери volume — он выставится автоматически
      });
      sound.play();
    } else if (this.puck.y + puckR > bounds.y + bounds.height) {
      this.puck.y = bounds.y + bounds.height - puckR;
      this.puckVelocity.y *= -p.restitution;
      collisionOccurred = true;
      const sound = SoundManager.add(this, "wallBounce", {
        volume: AudioSettings.sfxVolume * 0.1, // или просто убери volume — он выставится автоматически
      });
      sound.play();
    }

    // Столкновения шайбы с ракетками
    [this.leftPaddle, this.rightPaddle].forEach((paddle) => {
      const dx = this.puck.x - paddle.x;
      const dy = this.puck.y - paddle.y;
      const distSq = dx * dx + dy * dy;
      const minDist = p.puckRadius + p.paddleRadius;

      if (distSq < minDist * minDist) {
        const dist = Math.sqrt(distSq);
        const normalX = dx / dist;
        const normalY = dy / dist;
        const overlap = minDist - dist;

        this.puck.x += normalX * overlap * 0.5;
        this.puck.y += normalY * overlap * 0.5;
        paddle.x -= normalX * overlap * 0.5;
        paddle.y -= normalY * overlap * 0.5;

        const paddleVelocity =
          paddle === this.leftPaddle
            ? this.leftPaddleVelocity
            : this.rightPaddleVelocity;
        const relVelX = this.puckVelocity.x - paddleVelocity.x;
        const relVelY = this.puckVelocity.y - paddleVelocity.y;
        const velocityAlongNormal = relVelX * normalX + relVelY * normalY;

        const paddleSpeed = paddleVelocity.length();
        const puckSpeed = this.puckVelocity.length();

        if (
          velocityAlongNormal < 0 &&
          (paddleSpeed > p.minHitSpeed || puckSpeed > p.minBounceSpeed)
        ) {
          const j = -(0.6 + p.restitution) * velocityAlongNormal;
          const impulseX =
            (normalX * j * p.paddleMass) / (p.puckMass + p.paddleMass);
          const impulseY =
            (normalY * j * p.paddleMass) / (p.puckMass + p.paddleMass);

          this.puckVelocity.x += impulseX;
          this.puckVelocity.y += impulseY;

          this.puckVelocity.x += (Math.random() - 0.5) * p.hitRandomness;
          this.puckVelocity.y += (Math.random() - 0.5) * p.hitRandomness;

          collisionOccurred = true;
          const sound = SoundManager.add(this, "hit", {
            volume: AudioSettings.sfxVolume * 0.1,
          });
          sound.play();
        } else if (velocityAlongNormal < 0) {
          this.puck.x += normalX * overlap * 0.7;
          this.puck.y += normalY * overlap * 0.7;
        }
      }
    });

    // Ограничение скорости шайбы после столкновения
    if (collisionOccurred && this.puckVelocity.length() > p.maxPuckSpeed) {
      this.puckVelocity.normalize().scale(p.maxPuckSpeed);
    }
  }
}
