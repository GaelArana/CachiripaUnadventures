export class BossTruck {
    constructor(scene) {
        this.scene = scene;
        this.truck = null;
        this.health = 10; 
        this.speed = 200; // Velocidad inicial
        this.projectiles = null; // Grupo de proyectiles
        this.shootTimer = null; // Temporizador para disparar proyectiles
        this.isSlowCharging = false; // Bandera para saber si está en slow charge
        this.maxY = 272; // Y máximo para inhabilitar proyectiles
        this.isBlinking = false;
    }

    preload() {
        this.scene.load.image('truck', '../images/enemigos/camion.png');
        this.scene.load.image('projectile', '../images/items/botella.png');
    }

    create() {
        this.truck = this.scene.physics.add.sprite(1200, 200, 'truck');
        this.truck.setScale(0.35);

        this.truck.setSize(
            this.truck.width,
            this.truck.height * 0.5,
        );
        this.truck.setOffset(0, this.truck.height * 0.3);

        // Configurar colisiones con los límites del mundo
        this.truck.setCollideWorldBounds(true);
        this.truck.setVelocityX(this.speed);

        // Detectar cuando el camión toca los límites del mundo
        this.truck.body.onWorldBounds = true;
        this.truck.body.world.on('worldbounds', (body, up, down, left, right) => {
            if (body.gameObject === this.truck) {
                this.turnAround();
            }
        });

        // Crear grupo de proyectiles
        this.projectiles = this.scene.physics.add.group({
            maxSize: 10,
            allowGravity: true,
            collideWorldBounds: true
        });

        // Iniciar el temporizador para disparar proyectiles cada 1.5 segundos
        this.shootTimer = this.scene.time.addEvent({
            delay: 1500,
            callback: this.shootProjectile,
            callbackScope: this,
            loop: true
        });

        this.scene.physics.add.overlap(this.scene.player.Player, this.truck, this.handleVehicleCollision, null, this);
    }

    turnAround() {
        // Cambiar la dirección del camión y detenerlo
        this.speed = -this.speed;
        this.truck.setVelocityX(0); // Detener el camión
        this.truck.flipX = this.speed < 0; // Girar el sprite
    
        const animationType = Phaser.Math.Between(1, 2);

        if (animationType === 1) {
            this.performFastCharge();
        } else {
            this.performSlowCharge();
        }
    }

    performFastCharge() {
        this.truck.setY(200)
        this.truck.setSize(
            this.truck.width,
            this.truck.height * 0.5,
        );
        this.truck.setOffset(0, this.truck.height * 0.3);

        if(this.health > 7) {
            this.scene.time.delayedCall(3000, () => {
                this.truck.setVelocityX(this.speed > 0 ? 400 : -400);
            });
        } else {
            this.scene.time.delayedCall(2500, () => {
                this.truck.setVelocityX(this.speed > 0 ? 500 : -500);
            });
        }
        this.isSlowCharging = false;
    }

    performSlowCharge() {
        this.truck.setY(260)
        this.truck.setSize(
            this.truck.width,
            this.truck.height * 0.3,
        );
        this.truck.setOffset(0, this.truck.height * 0.4);
        // Iniciar la velocidad lenta

        if(this.health >= 8) {
            this.truck.setVelocityX(this.speed > 0 ? 300 : -300);
            this.shootTimer = this.scene.time.addEvent({
                delay: 1500,
                callback: this.shootProjectile,
                callbackScope: this,
                loop: true
            });
        } else {
            this.truck.setVelocityX(this.speed > 0 ? 200 : -200);
            this.shootTimer = this.scene.time.addEvent({
                delay: 900,
                callback: this.shootProjectile,
                callbackScope: this,
                loop: true
            });
        }

        // Activar el disparo mientras realiza el slow charge
        this.isSlowCharging = true;
    }

    shootProjectile() {
        const player = this.scene.player.Player;

        if (!this.isSlowCharging) {
            return;
        }

        let projectile = this.projectiles.getFirstDead(false);
        if (!projectile) {
            if (this.projectiles.getLength() < 6) {
                projectile = this.projectiles.create(this.truck.x, this.truck.y, 'projectile');
                projectile.setScale(0.2);
                projectile.setSize(32, 32);
                projectile.setOffset(32, 16);
                projectile.setCollideWorldBounds(true);
                projectile.setGravityY(0); // Sin gravedad para los proyectiles
            }
        }

        if (projectile) {
            projectile.setActive(true).setVisible(true);
            projectile.setPosition(this.truck.x, this.truck.y);
            projectile.setVelocityY(-400); // Disparar hacia arriba
            projectile.setVelocityX(Phaser.Math.Between(-50, 50)); // Rango de movimiento en X

            this.hitbox = this.scene.physics.add.overlap(player, projectile, () => {
                if (!player.invulnerable) {
                    this.scene.player.takeDamage(1, player.x < projectile ? 'left' : 'right');
                }
            }, null, this);

            this.scene.time.delayedCall(3000, () => {
                if (this.hitbox) {
                    this.scene.physics.world.removeCollider(this.hitbox); // Eliminar la colisión después de un tiempo
                    this.hitbox = null;
                }
            });
        }
    }

    handleVehicleCollision(player, truck) {
        if (!player.invulnerable) {
            this.scene.player.takeDamage(1, player.x < truck.x ? 'left' : 'right');
        }
    }

    update() {
        this.projectiles.children.iterate(projectile => {
            if (projectile.active) {
                    this.scene.time.delayedCall(2000, () => {
                    projectile.setActive(false).setVisible(false);
                }, [], this);
            }
        });
    }
    
    takeDamage(amount) {
        if (this.isBlinking) {
            return; // Evitar que reciba daño mientras está parpadeando
        }

        this.health -= amount;

        // Iniciar parpadeo al recibir daño
        this.blink();

        if (this.health <= 0) {
            this.truck.setVelocityX(0);
            this.truck.setVelocityY(0);
            this.truck.play('explosion-muerte', true);

            this.myScene.time.delayedCall(1500, () => {
                this.truck.destroy(); 
                let explosionScale = Math.min(enemy.displayWidth / 112, enemy.displayHeight / 112);
                let explosion = this.myScene.add.sprite(enemy.x, enemy.y, 'explosion').setScale(explosionScale);
                explosion.play('explosion-muerte');
                explosion.on('animationcomplete', () => {
                    explosion.destroy();
                });
            });
        }
    }

    blink() {
        this.isBlinking = true;

        // Crear un tween para hacer que el camión parpadee
        this.scene.tweens.add({
            targets: this.truck,
            alpha: 0,
            yoyo: true, // Para que vuelva a su valor original
            repeat: 5, // Cantidad de parpadeos
            duration: 100, // Duración de cada parpadeo
            onComplete: () => {
                this.truck.alpha = 1; // Asegurarse de que la visibilidad esté restaurada al final
                this.isBlinking = false;
            }
        });
    }
}