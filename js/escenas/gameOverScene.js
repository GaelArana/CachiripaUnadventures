import { GameData } from "../escenas/index.js";

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameOverScene'
        });
    }

    create() {
        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 1)');
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Game Over', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5);

        let restartButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, 'Restart', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.stop('level1');
            this.scene.stop('levelCarretera');
            this.scene.stop('levelUnipoli');
            this.scene.stop('GameOverScene');
            this.scene.start('level1')
        });

        let menuButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 150, 'Main Menu', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            this.scene.stop('GameOverScene');
            this.scene.start('StartScene');
        });
    }
}