import { AudioSettings } from "./AudioSettings";
export class SoundManager {
  static sounds = [];

  static add(scene, key, config = {}) {
    const sound = scene.sound.add(key, {
      ...config,
      volume: SoundManager.getVolumeForKey(key),
    });

    SoundManager.sounds.push({ key, sound });
    return sound;
  }

  static getVolumeForKey(key) {
    if (key === "menuMusic" || key.includes("music")) {
      return AudioSettings.musicVolume;
    } else {
      return AudioSettings.sfxVolume;
    }
  }

  static updateVolumes() {
    for (const { key, sound } of SoundManager.sounds) {
      sound.setVolume(SoundManager.getVolumeForKey(key));
    }
  }
}