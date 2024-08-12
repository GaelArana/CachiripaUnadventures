import { Player } from "../entidades/player.js";
import { Plataformas } from "../mapa/pasoCarretera.js";
import { VerticalVehicleManager } from '../entidades/vehiculosVertical.js';

export class LevelCarretera extends Phaser.Scene {
    constructor() {
        super({ key: "levelCarretera" });
        this.player = new Player(this);
        this.Plataformas = new Plataformas(this); // Nombres de variables en minúscula por convención
        this.verticalVehicleManager = new VerticalVehicleManager(this); // Nombre corregido
    }

    preload() {
        this.load.image('background', '../images/ambiente/fondito.png');
        this.Plataformas.preload();
        this.player.preload();
        this.verticalVehicleManager.preload(); // Nombre corregido
        this.load.image('transitionZone', '../images/enemigos/liebre-normal.png');
    }

    create() {
        this.background = this.add.tileSprite(0, 0, 960, 320, 'background');
        this.background.setOrigin(0, 0);
        this.backgroundScrollSpeed = 0.5;

        this.Plataformas.create();
        this.player.create();
        this.verticalVehicleManager.create(); // Nombre corregido

        this.physics.add.collider(this.player.Player, this.Plataformas.layer2);
        this.physics.world.setBounds(0, 0, 960, 320);

        this.transitionZone = this.physics.add.sprite(950, 250, 'transitionZone').setScale(0.3);
        this.transitionZone.setVisible(false); // Hacer el objeto invisible
        this.transitionZone.body.setAllowGravity(false); // No aplicar gravedad
        this.transitionZone.body.setImmovable(true); 

        this.physics.add.overlap(this.player.Player, this.transitionZone, this.checkTransition, null, this);

        // Configuración de la cámara
        this.cameras.main.setBounds(0, 0, 960, 320);
        this.cameras.main.startFollow(this.player.Player);
        this.cameras.main.setLerp(0.1, 0.1);
        this.cameras.main.setZoom(2);

        // Input para el menú de pausa
        this.input.keyboard.on('keydown-P', () => {
            this.scene.pause();
            this.scene.launch('PauseScene');
        });
    }

    handleEnemyAttack(player, enemy) {
        this.player.takeDamage(1, player.x < enemy.x ? 'left' : 'right');
    }

    update(time, delta) {
        this.background.tilePositionX = this.cameras.main.scrollX * this.backgroundScrollSpeed;
        this.player.update();
        this.verticalVehicleManager.update(); // Nombre corregido
    }

    collectCoin(player, coin) {
        coin.disableBody(true, true);
    }

    checkTransition(player, transitionZone) {
        this.scene.stop('levelCarretera');
        this.scene.launch('levelUnipoli');
    }
}