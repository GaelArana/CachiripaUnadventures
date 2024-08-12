export class VehicleManager {
    constructor(scene) {
        this.scene = scene;
        this.vehicleSpeed = -300;
        this.projectileCollider = null;
        this.projectileSpeedY = -500; // Velocidad hacia arriba de los proyectiles
        this.projectileFrequency = 2000; // Frecuencia de disparo en milisegundos
        this.maxProjectiles = 3; 
        this.vehicleConfigs = [
            {
                key: 'car1',
                scale: 0.6,
                hitbox: { width: 0.8, height: 0.1, offsetX: 0.1, offsetY: 0.6 }
            },
            {
                key: 'car2',
                scale: 0.6,
                hitbox: { width: 0.75, height: 0.1, offsetX: 0.125, offsetY: 0.5 }
            },
            {
                key: 'car3',
                scale: 0.5,
                hitbox: { width: 0.7, height: 0.1, offsetX: 0.15, offsetY: 0.7 }
            },
            {
                key: 'car4',
                scale: 0.5,
                hitbox: { width: 0.7, height: 0.1, offsetX: 0.1, offsetY: 0.6 }
            },
            {
                key: 'car5',
                scale: 0.5,
                hitbox: { width: 0.7, height: 0.1, offsetX: 0.125, offsetY: 0.5 }
            },
            {
                key: 'car6',
                scale: 0.5,
                hitbox: { width: 0.7, height: 0.1, offsetX: 0.14, offsetY: 0.5 }
            }
        ];
    }

    preload() {
        this.scene.load.image('car1', '../images/enemigos/vehículosL/spr_casualcar_0.png');
        this.scene.load.image('car2', '../images/enemigos/vehículosL/spr_classiccar_0.png');
        this.scene.load.image('car3', '../images/enemigos/vehículosL/spr_van_0.png');
        this.scene.load.image('car4', '../images/enemigos/vehículosL/spr_sportscar_0.png');
        this.scene.load.image('car5', '../images/enemigos/vehículosL/spr_bubblecar_0.png');
        this.scene.load.image('car6', '../images/enemigos/vehículosL/spr_silvercar_0.png');

        this.scene.load.image('projectile', '../images/items/botella.png');
    }

    create() {
        this.vehiclesTop = this.scene.physics.add.group();
        this.vehiclesBottom = this.scene.physics.add.group();
        this.createVehicle(this.vehiclesTop, 1200, 100);
        this.createVehicle(this.vehiclesBottom, 2100, 440);
        this.createVehicle(this.vehiclesBottom, 1000, 440);
    
        // Crear grupo de proyectiles con un máximo de 3
        this.projectiles = this.scene.physics.add.group({
            maxSize: this.maxProjectiles,
            allowGravity: true,
            collideWorldBounds: true
        });
    
        // Iniciar el evento de disparo de proyectiles
        this.scene.time.addEvent({
            delay: this.projectileFrequency,
            callback: this.shootProjectile,
            callbackScope: this,
            loop: true
        });
    }

    createVehicle(group, x, yPosition) {
        const config = Phaser.Utils.Array.GetRandom(this.vehicleConfigs);

        const vehicle = this.scene.physics.add.sprite(this.scene.cameras.main.width + x, yPosition, config.key);
        vehicle.setScale(config.scale);
        vehicle.setVelocityX(this.vehicleSpeed);
        vehicle.setCollideWorldBounds(false);
        vehicle.setImmovable(true);
        vehicle.body.setAllowGravity(false);

        // Ajustar el hitbox en función de los porcentajes
        vehicle.body.setSize(
            vehicle.width * config.hitbox.width,
            vehicle.height * config.hitbox.height
        );
        vehicle.body.setOffset(
            vehicle.width * config.hitbox.offsetX,
            vehicle.height * config.hitbox.offsetY
        );

        group.add(vehicle);
        this.scene.physics.add.collider(vehicle, this.scene.Plataformas.layer4);
    }

    update() {
        const player = this.scene.player.Player;
    
        // Mover vehículos y reiniciar posición
        this.vehiclesTop.children.iterate(vehicle => {
            if (vehicle.x < player.x - 1500) {
                this.resetVehicle(vehicle, player, 300);
            } else {
                vehicle.setVelocityX(this.vehicleSpeed);
            }
        });
    
        this.vehiclesBottom.children.iterate(vehicle => {
            if (vehicle.x < player.x - 1500) {
                this.resetVehicle(vehicle, player, 420);
            } else {
                vehicle.setVelocityX(this.vehicleSpeed);
            }
        });

        this.projectiles.children.iterate(projectile => {
            if (projectile.active) {
                    this.scene.time.delayedCall(2000, () => {
                    projectile.setActive(false).setVisible(false);
                    this.scene.physics.world.removeCollider(this.projectileCollider);
                }, [], this);
            }
        }); 
    }

    resetVehicle(vehicle, player, yPosition) {
        // Cambiar el sprite del vehículo a uno nuevo
        const newConfig = Phaser.Utils.Array.GetRandom(this.vehicleConfigs);
        vehicle.setTexture(newConfig.key);
        vehicle.setScale(newConfig.scale);
        vehicle.body.setSize(
            vehicle.width * newConfig.hitbox.width,
            vehicle.height * newConfig.hitbox.height
        );
        vehicle.body.setOffset(
            vehicle.width * newConfig.hitbox.offsetX,
            vehicle.height * newConfig.hitbox.offsetY
        );

        // Mover el vehículo a una nueva posición con offset después de un retraso aleatorio
        vehicle.x = player.x + 700; // Posición inicial en X
        vehicle.y = yPosition; // Posición vertical
        vehicle.setVelocityX(this.vehicleSpeed);
    }

    /*---Fisica de los proyectiles. 
    Esto permite aplicarles y quitar fisicas. Es de gran importancia.*/

    shootProjectile() {
        const player = this.scene.player.Player;

        this.vehiclesTop.children.iterate(vehicle => {
            if (Phaser.Math.Distance.Between(player.x, player.y, vehicle.x, vehicle.y) < 400) {
                let projectile = this.projectiles.getFirstDead(false);
                if (!projectile) {
                    if (this.projectiles.getLength() < this.maxProjectiles) {
                        projectile = this.projectiles.create(vehicle.x, vehicle.y, 'projectile');
                        projectile.setScale(0.2)
                        projectile.setSize(32, 32);
                        projectile.setOffset(32, 16);
                    }
                }
                if (projectile) {
                    projectile.setActive(true).setVisible(true);
                    projectile.setPosition(vehicle.x, vehicle.y);
                    projectile.setVelocityY(-300);
                    projectile.setVelocityX(Phaser.Math.Between(-50, 50));

                    if (this.hitbox) {
                        this.scene.physics.world.removeCollider(this.hitbox); // Eliminar collider anterior si existe
                    }

                    this.hitbox = this.scene.physics.add.overlap(player, projectile, () => {
                        if (!player.invulnerable) {
                            this.scene.handleEnemyAttack(player, projectile);
                        }
                    }, null, this);

                    this.scene.time.delayedCall(1500, () => {
                        if (this.hitbox) {
                            this.scene.physics.world.removeCollider(this.hitbox); // Eliminar la colisión después de un tiempo
                            this.hitbox = null;
                            this.projectileCollider = this.scene.physics.add.collider(projectile, this.scene.Plataformas.layer5);
                        }
                    });
                }
            }
        });
    }
}