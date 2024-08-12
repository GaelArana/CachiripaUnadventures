export class HUD {
    constructor(scene) {
        this.scene = scene;
        this.maxLives = 5; // Máximo de cabecitas
        this.lives = 3;
        this.money = 0;
        this.score = 0;
    }

    preload() {
        // Acceder a this.myScene.load para cargar el sprite
        this.myScene.load.spritesheet('head', '../images/items/cachiripaVida.png', { frameWidth: 55, frameHeight: 63 });
    }

    create() {
        this.scene.anims.create({
            key: 'headSpin',
            frames: this.scene.anims.generateFrameNumbers('head', { start: 0, end: 14 }), // Ajusta el rango de cuadros según sea necesario
            frameRate: 10, // Ajusta la velocidad de la animación
            repeat: -1 // Repite la animación indefinidamente
        });

        this.heads = [];

        // Crear cabecitas para la vida del jugador
        for (let i = 0; i < this.maxLives; i++) {
            let x = 50 + i * 40; // Espaciado horizontal de las cabecitas
            let y = 30; // Posición vertical de las cabecitas

            let head = this.scene.add.sprite(x, y, 'head').setOrigin(0, 0);
            head.setDepth(10); // Asegurarse de que esté en la parte superior del HUD
            head.play('headSpin'); // Reproducir animación
            this.hudContainer.add(head);
            this.heads.push(head);
        }

        // Texto de dinero
        this.moneyText = this.scene.add.text(10, 70, `Dinero: ${this.money}`, { fontSize: '20px', fill: '#fff' });
        this.hudContainer.add(this.moneyText);

        // Marcador de puntuación
        this.scoreText = this.scene.add.text(this.scene.cameras.main.width - 150, 70, `Score: ${this.score}`, { fontSize: '20px', fill: '#fff' });
        this.hudContainer.add(this.scoreText);

        this.updateHeads();
    }

    updateHeads() {
        for (let i = 0; i < this.heads.length; i++) {
            this.heads[i].setVisible(i < this.lives);
        }
    }

    update() {
        this.moneyText.setText(`Dinero: ${this.money}`);
        this.scoreText.setText(`Score: ${this.score}`);

        // Posicionar el contenedor del HUD en función de la cámara
        const cam = this.scene.cameras.main;
        const zoom = cam.zoom;

        // Ajustar la posición del HUD
        this.hudContainer.setPosition(
            cam.scrollX + cam.width / (2 * zoom) - cam.width / 2,
            cam.scrollY + cam.height / (2 * zoom) - cam.height / 2
        );

        // Ajustar la escala del HUD para que tenga en cuenta el zoom de la cámara
        this.hudContainer.setScale(1 / zoom);
    }

    handlePlayerDamage() {
        this.lives--;
        this.updateHeads(); // Actualizar cabecitas después de recibir daño
    }

    addMoney(amount) {
        this.money += amount;
    }

    addScore(amount) {
        this.score += amount;
    }
}