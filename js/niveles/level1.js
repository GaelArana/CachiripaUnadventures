import { GameData } from "../escenas/index.js";
import { Player } from "../entidades/player.js";
import { Plataformas } from "../mapa/platform.js";
import { VehicleManager } from "../entidades/vehículos.js";
import { arania } from "../entidades/arania.js";
import { carretera } from "../mapa/carreteras.js";

export class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: "level1" });
        
        this.player = new Player(this);
        this.Plataformas = new Plataformas(this);
        this.vehicleManager = new VehicleManager(this);
        this.Enemigos = new arania(this);
        this.carretera = new carretera(this);
    }

    preload() {
        this.load.image('background', '../images/ambiente/fondito.png');
        this.Plataformas.preload();
        this.player.preload();
        this.vehicleManager.preload();
        this.Enemigos.preload();
        this.carretera.preload();
        this.load.image('transitionZone', '../images/enemigos/liebre-normal.png'); // Imagen para el objeto invisible
    }

    create() {
        GameData.health = 5;  // Valor inicial de la vida
        GameData.score = 0;   // Puntuación inicial
        GameData.money = 0;   // Dinero inicial

        this.background = this.add.tileSprite(0, 0, 5120, 480, 'background');
        this.background.setOrigin(0, 0);
        this.backgroundScrollSpeed = 0.5;

        this.Plataformas.create();
        this.player.create();
        this.Enemigos.create(this.player.Player);
        this.carretera.create();
        this.vehicleManager.create(); 

        // Colisiones y superposiciones
        this.physics.add.collider(this.player.Player, this.Plataformas.layer6);
        this.physics.add.collider(this.player.Player, this.Plataformas.layer5);
        this.physics.add.collider(this.player.Player, this.Plataformas.layer3);
        this.physics.add.overlap(this.player.Player, this.Plataformas.coins, this.collectCoin, null, this);

        this.physics.add.collider(this.Enemigos.enemies, this.Plataformas.layer6);
        this.physics.add.collider(this.Enemigos.enemies, this.Plataformas.layer5);
        this.physics.add.collider(this.Enemigos.enemies, this.Plataformas.layer3);

        // Manejar el ataque del jugador a los enemigos
        this.physics.add.overlap(this.player.attackHitbox, this.Enemigos.enemies, this.hitEnemy, null, this);

        // Manejar el ataque del enemigo al jugador
        this.physics.add.overlap(this.player.Player, this.Enemigos.enemies, this.handleEnemyAttack, null, this);

        // Crear zona de transición invisible
        this.transitionZone = this.physics.add.sprite(5120, 320, 'transitionZone').setScale(0.3);
        this.transitionZone.setVisible(false); // Hacer el objeto invisible
        this.transitionZone.body.setAllowGravity(false); // No aplicar gravedad
        this.transitionZone.body.setImmovable(true); // Que sea inmovible

        // Detectar si el jugador está dentro de la zona de transición
        this.physics.add.overlap(this.player.Player, this.transitionZone, this.checkTransition, null, this);

        this.physics.world.setBounds(0, 0, 5120, 480);

        // Configuración de la cámara
        this.cameras.main.setBounds(0, 0, 5120, 480);
        this.cameras.main.startFollow(this.player.Player);
        this.cameras.main.setLerp(0.1, 0.1);

        // Input para el menú de pausa
        this.input.keyboard.on('keydown-P', () => {
            this.scene.pause();
            this.scene.launch('PauseScene');
        });
    }

    update(time, delta) {
        this.background.tilePositionX = this.cameras.main.scrollX * this.backgroundScrollSpeed;
        this.player.update();
        this.vehicleManager.update(); 
        this.Enemigos.update(this.player.Player); // Actualizar la lógica de la araña

        if (this.player.Player) {
            const playerY = this.player.Player.y;

            if (playerY > 374) {
                this.cameras.main.setZoom(3);
                this.carretera.layer4.setVisible(false);
                this.vehicleManager.vehiclesTop.setVisible(false);
                this.vehicleManager.vehiclesBottom.setVisible(false);
                this.Plataformas.layer4.setVisible(false);
                this.Plataformas.coins3.setVisible(false);
            } else {
                this.cameras.main.setZoom(2);
                this.vehicleManager.vehiclesTop.setVisible(true);
                this.vehicleManager.vehiclesBottom.setVisible(true);
                this.carretera.layer4.setVisible(true);
                this.Plataformas.layer4.setVisible(true);
                this.Plataformas.coins3.setVisible(true);
            }
        }
    }

    collectCoin(player, coin) {
        coin.disableBody(true, true);
        this.player.increaseMoney(1);
        this.player.increaseScore(100);
    }

    hitEnemy(attackHitbox, enemy) {
        this.Enemigos.takeDamage(enemy, 1, attackHitbox.x < enemy.x ? 'left' : 'right'); // Ahora se pasa el enemigo a la función de daño
    }

    handleEnemyAttack(player, enemy) {
        this.player.takeDamage(1, player.x < enemy.x ? 'left' : 'right');
    }

    checkTransition(player, transitionZone) {
        if (this.player.money >= 6) {
            this.scene.stop('level1');
            this.scene.launch('levelCarretera');
        } else {
            // Mostrar un mensaje indicando que necesita más monedas
            const warningText = this.add.text(
                this.player.x,
                this.player.y - 50,
                '¡Necesitas al menos 6 monedas!',
                { fontSize: '20px', fill: '#ff0000' }
            );
            warningText.setOrigin(0.5, 0.5);
            warningText.setScrollFactor(0);

            // Hacer que el texto desaparezca después de 3 segundos
            this.time.delayedCall(3000, () => {
                warningText.destroy();
            });
        }
    }
}