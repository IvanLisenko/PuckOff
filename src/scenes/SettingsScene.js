import Phaser from "phaser";
import { createButton } from "../utils/ButtonUtils";
import { AudioSettings } from "../utils/AudioSettings";
import { SoundManager } from "../utils/SoundManager";

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super("SettingsScene");
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add
      .image(0, 0, "option-background")
      .setOrigin(0)
      .setDisplaySize(width, height);

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.2);
    overlay.fillRect(0, 0, width, height);

    const rectX = width / 2 - 600 / 2;
    const rectY = height / 2 - 450 / 2;

    const rect = this.add.graphics();

    // Чёрная заливка с прозрачностью 0.5
    rect.fillStyle(0x000000, 0.5);
    rect.fillRoundedRect(rectX, rectY, 600, 450, 20);

    // Белая обводка толщиной 2
    rect.lineStyle(2, 0xffffff, 1);
    rect.strokeRoundedRect(rectX, rectY, 600, 450, 20);

    this.createSlider(
      width / 2 - 200,
      height / 2 - 100,
      AudioSettings.musicVolume,
      (value) => {
        // сюда добавь логику изменения громкости
        AudioSettings.musicVolume = value;
        // Если музыка уже играет — можно сразу обновить громкость:
        const currentMusic = this.sound.get("menuMusic");
        if (currentMusic) currentMusic.setVolume(value);
      }
    );

this.createSlider(
  width / 2 - 200,
  height / 2 + 30,
  AudioSettings.sfxVolume,
  (value) => {
    AudioSettings.sfxVolume = value;
    SoundManager.updateVolumes(); // обновим все звуки
  }
);

    createButton(this, width / 2, height / 2 + 130, "Выход", () => {
      this.scene.start("MenuScene");
    });

    this.add
      .text(width / 2, height / 2 - 140, "Громкость музыки", {
        fontSize: "40px",
        fontStyle: "bold",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 - 10, "Громкость звуков", {
        fontSize: "40px",
        fontStyle: "bold",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }
  createSlider(x, y, initialValue, onChange) {
    const trackWidth = 400;
    const trackHeight = 8;

    // Трек
    const track = this.add.graphics();
    track.fillStyle(0xaaaaaa, 1);
    track.fillRoundedRect(x, y, trackWidth, trackHeight, 3);

    // Прозрачная зона для клика по треку
    const trackZone = this.add
      .zone(x, y, trackWidth, trackHeight)
      .setOrigin(0, 0)
      .setInteractive();

    // Ползунок
    const knob = this.add.circle(
      x + initialValue * trackWidth,
      y + trackHeight / 2,
      15,
      0xffffff
    );
    knob.setInteractive({ draggable: true });

    // Перетаскивание ползунка
    knob.on("drag", (pointer, dragX) => {
      dragX = Phaser.Math.Clamp(dragX, x, x + trackWidth);
      knob.x = dragX;

      const value = (dragX - x) / trackWidth;
      onChange(value);
    });

    // Клик по линии
    trackZone.on("pointerdown", (pointer) => {
      const localX = pointer.x;
      const clampedX = Phaser.Math.Clamp(localX, x, x + trackWidth);
      knob.x = clampedX;

      const value = (clampedX - x) / trackWidth;
      onChange(value);
    });

    return { track, trackZone, knob };
  }
}
