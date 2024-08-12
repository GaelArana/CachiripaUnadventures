export class VerticalVehicleManager {
    constructor(scene) {
        this.scene = scene;
        this.vehicleSpeedUp = -300; // Velocidad de los vehículos que suben
        this.vehicleSpeedDown = 300; // Velocidad de los vehículos que bajan

        // Configuraciones para vehículos que suben
        this.vehicleConfigsDown = [
            { key: 'vehicle1F', scale: 0.2, hitbox: { width: 1, height: 0.2, offsetX: 0.1, offsetY: 0.5 } },
            { key: 'vehicle2F', scale: 0.2, hitbox: { width: 1, height: 0.2, offsetX: 0.1, offsetY: 0.5 } },
            { key: 'vehicle3F', scale: 0.1, hitbox: { width: 1, height: 0.2, offsetX: 0.1, offsetY: 0.5 } }
        ];

        // Configuraciones para vehículos que bajan
        this.vehicleConfigsUp = [
            { key: 'vehicle1B', scale: 0.2, hitbox: { width: 1, height: 0.2, offsetX: 0.1, offsetY: 0.5 }},
            { key: 'vehicle2B', scale: 0.2, hitbox: { width: 1, height: 0.2, offsetX: 0.1, offsetY: 0.5 }},
            { key: 'vehicle3B', scale: 0.05, hitbox: { width: 1, height: 0.2, offsetX: 0.1, offsetY: 0.5 }}
        ];
        this.maxProjectiles = 2;
    }

    preload() {
        this.scene.load.image('vehicle1B', '../images/enemigos/vehículosF/hrvd.png');
        this.scene.load.image('vehicle2B', '../images/enemigos/vehículosF/fia.png');
        this.scene.load.image('vehicle3B', '../images/enemigos/vehículosF/corv.png');
        this.scene.load.image('vehicle1F', '../images/enemigos/frontCar.png');
        this.scene.load.image('vehicle2F', '../images/enemigos/vehículosF/bentleye.png');
        this.scene.load.image('vehicle3F', '../images/enemigos/vehículosF/for.png');
        this.scene.load.image('projectile', '../images/items/botella.png');
    }

    create() {
        this.vehiclesUp = this.scene.physics.add.group();
        this.vehiclesDown = this.scene.physics.add.group();

        // Crear vehículos que suben y bajan
        this.createVehicle(this.vehiclesUp, 600, this.scene.cameras.main.height - 100, this.vehicleSpeedUp, this.vehicleConfigsUp);
        this.createVehicle(this.vehiclesUp, 700, this.scene.cameras.main.height + 100, this.vehicleSpeedUp, this.vehicleConfigsUp);
        this.createVehicle(this.vehiclesUp, 800, this.scene.cameras.main.height + 200, this.vehicleSpeedUp, this.vehicleConfigsUp);
        this.createVehicle(this.vehiclesDown, 350, 170, this.vehicleSpeedDown, this.vehicleConfigsDown);
        this.createVehicle(this.vehiclesDown, 250, 130, this.vehicleSpeedDown, this.vehicleConfigsDown);
        this.createVehicle(this.vehiclesDown, 150, 200, this.vehicleSpeedDown, this.vehicleConfigsDown);

        // Crear grupo de proyectiles con un máximo de 3
        this.projectiles = this.scene.physics.add.group({
            maxSize: this.maxProjectiles,
            collideWorldBounds: true
        });

        this.scene.physics.add.overlap(this.scene.player.Player, this.vehiclesUp, this.handleVehicleCollision, null, this);
        this.scene.physics.add.overlap(this.scene.player.Player, this.vehiclesDown, this.handleVehicleCollision, null, this);


        // Iniciar el evento de disparo de proyectiles
        this.scene.time.addEvent({
            delay: 1000,
            callback: this.shootProjectile,
            callbackScope: this,
            loop: true
        });
    }

    createVehicle(group, x, y, speed, configs) {
        const config = Phaser.Utils.Array.GetRandom(configs);

        const vehicle = this.scene.physics.add.sprite(x, y, config.key);
        vehicle.setScale(config.scale);
        vehicle.setVelocityY(speed);
        vehicle.setCollideWorldBounds(false);
        vehicle.setImmovable(true);
        vehicle.body.setAllowGravity(true);

        vehicle.body.setSize(
            vehicle.width * config.hitbox.width,
            vehicle.height * config.hitbox.height
        );
        vehicle.body.setOffset(
            vehicle.width * config.hitbox.offsetX,
            vehicle.height * config.hitbox.offsetY
        );

        vehicle.initialY = y;
        vehicle.initialX = x;

        group.add(vehicle);
    }

    update() {
        this.vehiclesUp.children.iterate(vehicle => {
            if (vehicle.y <= 130) {
                this.resetVehicle(vehicle, vehicle.initialX, vehicle.initialY, this.vehicleSpeedUp, this.vehicleConfigsUp);
            } else {
                vehicle.setVelocityY(this.vehicleSpeedUp);
            }
        });
    
        this.vehiclesDown.children.iterate(vehicle => {
            if (vehicle.y >= 1300) {
                this.resetVehicle(vehicle, vehicle.initialX, 130, this.vehicleSpeedDown, this.vehicleConfigsDown);
            } else {
                vehicle.setVelocityY(this.vehicleSpeedDown);
            }
        });
    
        this.projectiles.children.iterate(projectile => {
            if (projectile.active) {
                this.scene.time.delayedCall(4000, () => {
                    projectile.setActive(false).setVisible(false);
                    this.scene.physics.world.removeCollider(this.projectileCollider);
                }, [], this);
            }
        });
    }

    resetVehicle(vehicle, x, y, speed, configs) {
        const newConfig = Phaser.Utils.Array.GetRandom(configs);
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
        vehicle.setPosition(x, y);
        this.scene.time.delayedCall(1500, () => {
            vehicle.setVelocityY(0);
        });
        vehicle.setVelocityY(speed);
    }

    handleVehicleCollision(player, vehicle) {
        const damageZoneY = 240;
        const damageRange = 50;
    
        // Verificar si el vehículo está dentro del rango de daño
        if (vehicle.y >= damageZoneY - damageRange && vehicle.y <= damageZoneY + damageRange) {
            if (!player.invulnerable) {
                this.scene.player.takeDamage(2, 'right');
            }
        }
    }

    shootProjectile() {
        const player = this.scene.player.Player;

        this.vehiclesUp.children.iterate(vehicle => {
            if (vehicle.y <= player.y + 50) {
                let projectile = this.projectiles.getFirstDead(false);
                if (!projectile) {
                    if (this.projectiles.getLength() < this.maxProjectiles) {
                        projectile = this.projectiles.create(vehicle.x, vehicle.y, 'projectile');
                        projectile.setScale(0.2);
                        projectile.setSize(32, 32);
                        projectile.setOffset(32, 16);
                    }
                }
                if (projectile) {
                    projectile.setActive(true).setVisible(true);
                    projectile.setPosition(vehicle.x, vehicle.y);
                    projectile.setVelocityY(-200); // Disparar hacia arriba
                    projectile.setVelocityX(Phaser.Math.Between(-50, 50)); // Rango de movimiento en X

                    this.hitbox = this.scene.physics.add.overlap(player, projectile, () => {
                        if (!player.invulnerable) {
                            this.scene.handleEnemyAttack(player, projectile);
                        }
                    }, null, this);

                    this.scene.time.delayedCall(3000, () => {
                        if (this.hitbox) {
                            this.scene.physics.world.removeCollider(this.hitbox); // Eliminar la colisión después de un tiempo
                            this.hitbox = null;
                            this.projectileCollider = this.scene.physics.add.collider(projectile, this.scene.Plataformas.layer2);
                        }
                    });
                }
            }
        });

        this.vehiclesDown.children.iterate(vehicle => {
            if (vehicle.y >= player.y && vehicle.y <= this.scene.cameras.main.height) {
                let projectile = this.projectiles.getFirstDead(false);
                if (!projectile) {
                    if (this.projectiles.getLength() < this.maxProjectiles) {
                        projectile = this.projectiles.create(vehicle.x, vehicle.y, 'projectile');
                        projectile.setScale(0.2);
                    }
                }
                if (projectile) {
                    projectile.setActive(true).setVisible(true);
                    projectile.setPosition(vehicle.x, vehicle.y);
                    projectile.setVelocityY(-200); // Disparar hacia arriba
                    projectile.setVelocityX(Phaser.Math.Between(-50, 50)); // Rango de movimiento en 

                    this.hitbox = this.scene.physics.add.overlap(player, projectile, () => {
                        if (!player.invulnerable) {
                            this.scene.handleEnemyAttack(player, projectile);
                        }
                    }, null, this);

                    this.scene.time.delayedCall(3000, () => {
                        if (this.hitbox) {
                            this.scene.physics.world.removeCollider(this.hitbox); // Eliminar la colisión después de un tiempo
                            this.hitbox = null;
                            this.projectileCollider = this.scene.physics.add.collider(projectile, this.scene.Plataformas.layer2);
                        }
                    });
                }
            }
        });
        
    }
}