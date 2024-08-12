import { Player } from "../entidades/player.js";
import { Plataformas } from "../mapa/unipoliEntrada.js";
import { BossTruck } from "../entidades/bossTruck.js"; // Importa la clase BossTruck

export class LevelUnipoli extends Phaser.Scene {
    constructor() {
        super({ key: "levelUnipoli" });
        this.player = new Player(this);
        this.Plataformas = new Plataformas(this);
        this.BossTruck = new BossTruck(this, this.Plataformas.layer1); // Crea una instancia del jefe camión
    }

    preload() {
        this.load.image('background', '../images/ambiente/fondito.png');
        this.Plataformas.preload();
        this.player.preload();
        this.BossTruck.preload(); // Preload del jefe camión
    }

    create() {
        this.background = this.add.tileSprite(0, 0, 1280, 320, 'background');
        this.background.setOrigin(0, 0);
        this.backgroundScrollSpeed = 0.5;

        this.Plataformas.create();
        this.player.create();
        this.BossTruck.create(); // Crear el jefe camión

        this.physics.add.collider(this.player.Player, this.Plataformas.layer1);
        this.physics.add.collider(this.BossTruck.truck, this.Plataformas.layer2); // Asegura que el camión colisione con la capa

        this.physics.world.setBounds(0, 0, 1280, 320);
        

        // Configuración de la cámara
        this.cameras.main.setBounds(0, 0, 1280, 320);
        this.cameras.main.startFollow(this.player.Player);
        this.cameras.main.setLerp(0.1, 0.1);
        this.cameras.main.setZoom(2);

        // Input para el menú de pausa
        this.input.keyboard.on('keydown-P', () => {
            this.scene.pause();
            this.scene.launch('PauseScene');
        });

        this.physics.add.overlap(this.player.attackHitbox, this.BossTruck.truck, this.hitEnemy, null, this);
    }

    update(time, delta) {
        this.background.tilePositionX = this.cameras.main.scrollX * this.backgroundScrollSpeed;
        this.player.update();
        this.BossTruck.update(); // Actualizar el jefe camión
    }

    collectCoin(player, coin) {
        coin.disableBody(true, true);
    }

    handleEnemyAttack(player, enemy) {
        this.player.takeDamage(1, player.x < enemy.x ? 'right' : 'left');
    }

    hitEnemy(attackHitbox, BossTruck) {
        this.BossTruck.takeDamage(1);
    }
}

