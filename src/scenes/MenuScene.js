import Phaser from "phaser";
import { createButton } from '../utils/ButtonUtils';

export default class MenuScene extends Phaser.Scene{
    constructor(){
        super("MenuScene");
    }

    preload () {
        
    }
    
    create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.image(0, 0, "menu").setOrigin(0).setDisplaySize(width, height);

   
}
}
