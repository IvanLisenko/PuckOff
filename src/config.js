import GameScene from './scenes/GameScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import SettingsScene from './scenes/SettingsScene.js';

export default {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#ffffff',
    physics: false,
    scene: [PreloadScene, MenuScene, GameScene, SettingsScene],
};
