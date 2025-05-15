import { AudioSettings } from "./AudioSettings";
import { SoundManager } from "./SoundManager"; // добавь импорт

export function createButton(scene, x, y, text, callback) {
  const button = scene.add
    .text(x, y, text, {
      fontSize: "40px",
      fontStyle: "bold",
      fontFamily: "Arial",
      fill: "#fff",
      padding: {
        left: 20,
        right: 20,
        top: 10,
        bottom: 10,
      },
    })
    .setOrigin(0.5)
    .setInteractive()
    .on("pointerover", () => {
      button.setStyle({ fill: "#CCCEDD" });

      const sound = SoundManager.add(scene, "button-pointed", {
        volume: AudioSettings.sfxVolume * 0.1, // или просто убери volume — он выставится автоматически
      });
      sound.play();
    })
    .on("pointerout", () => {
      button.setStyle({ fill: "#fff" });
    })
    .on("pointerdown", () => {
      const sound = SoundManager.add(scene, "button-clicked");
      sound.play();
      scene.time.delayedCall(150, callback);
    });

  const width = button.width;
  const height = button.height;
  const radius = 15;

  const bg = scene.add.graphics();
  bg.fillStyle(0x000000, 0.5);
  bg.fillRoundedRect(x - width / 2, y - height / 2, width, height, radius);

  bg.lineStyle(1.8, 0xffffff, 1);
  bg.strokeRoundedRect(x - width / 2, y - height / 2, width, height, radius);

  bg.setDepth(0);
  button.setDepth(1);

  return [bg, button];
}
