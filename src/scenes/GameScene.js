import Phaser from 'phaser';
import Puck from '../objects/Puck';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.cameras.main.setBackgroundColor('#42aaff');
        // Загрузка ассетов
    }

    create() {
        // Создание объектов
        this.add.text(200, 250, 'Puck off, motherpucker!', { fontSize: '32px', color: '#1e1e1e' });
        const puck = new Puck(this, this.cameras.main.width / 2, 300, "logo").setDisplaySize(100, 100);
    }

    update() {
        // Логика игры
    }
}
