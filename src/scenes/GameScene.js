import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        // Загрузка ассетов
    }

    create() {
        // Создание объектов
        this.add.text(200, 250, 'Puck off, motherpucker!', { fontSize: '32px', color: '#fff' });
    }

    update() {
        // Логика игры
    }
}
