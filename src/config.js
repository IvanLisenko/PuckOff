import GameScene from './scenes/GameScene.js';

export default {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1e1e1e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,
        },
    },
    scene: [GameScene],
};
