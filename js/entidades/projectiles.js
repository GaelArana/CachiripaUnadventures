class Projectile {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, 'bottle');
        this.sprite.setScale(0.2);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setAllowGravity(true);

        // Desactivar colisión inicial con el suelo
        this.sprite.body.checkCollision.up = false;
        this.sprite.body.checkCollision.down = false;
        this.sprite.body.checkCollision.left = false;
        this.sprite.body.checkCollision.right = false;
    }

    launch(x, y) {
        this.sprite.setPosition(x, y);
        this.sprite.setVelocityX(Phaser.Math.Between(-100, 100));
        this.sprite.setVelocityY(-300); // Velocidad vertical inicial hacia arriba
    }

    update() {
        // Activar colisión con el suelo cuando la botella empieza a caer
        if (this.sprite.body.velocity.y > 0) {
            this.sprite.body.checkCollision.down = true;
        }
    }
}