import GameScene from './scenes/GameScene.js';
import PreloadScene from './scenes/PreloadScene.js';

export default {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    physics: false,
    scene: [PreloadScene, GameScene],
};
