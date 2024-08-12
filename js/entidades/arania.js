export class arania {
    constructor(scene) {
        this.myScene = scene;
        this.health = 5;
        this.invulnerable = false;
    }

    preload() {
        this.myScene.load.spritesheet('spider', '../../images/enemigos/SpiderCone.png', { frameWidth: 128, frameHeight: 128 });
        this.myScene.load.spritesheet('explosion', '../../images/enemigos/explosion.png', { frameWidth: 112, frameHeight: 112 });
        this.myScene.load.tilemapTiledJSON('enemyJSON', '../../json/Level1.json'); 
    }

    create(pPlayer) {
        // Animaciones de la araña
        this.myScene.anims.create({
            key: 'arania-caminar',
            frames: this.myScene.anims.generateFrameNumbers('spider', { start: 10, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
        this.myScene.anims.create({
            key: 'arania-danio',
            frames: [{ key: 'spider', frame: 0 }],
            frameRate: 10,
            repeat: 0
        });
        this.myScene.anims.create({
            key: 'arania-descanso',
            frames: [
                { key: 'spider', frame: 1 },
                { key: 'spider', frame: 2 },
                { key: 'spider', frame: 3 },
                { key: 'spider', frame: 3 },
                { key: 'spider', frame: 3 },
                { key: 'spider', frame: 2 },
                { key: 'spider', frame: 1 },
            ],
            frameRate: 6,
            repeat: -1
        });

        this.myScene.anims.create({
            key: 'arania-ataque',
            frames: this.myScene.anims.generateFrameNumbers('spider', { start: 5, end: 9 }),
            frameRate: 5,
            repeat: -1
        });

        this.map = this.myScene.make.tilemap({ key: 'enemyJSON' });
        this.enemiesObj = this.map.getObjectLayer('Arania').objects;
        this.enemies = this.myScene.physics.add.group();

        this.enemiesObj.forEach(element => {
            this.enemy = this.enemies.create(element.x, element.y - element.height, 'spider').play('arania-caminar', true);
            this.enemy.setScale(0.3);
            this.enemy.body.setSize(45, 48.5);
            this.enemy.body.setOffset(44, 70);
            this.enemy.setCollideWorldBounds(true);
            this.enemy.health = this.health;
            this.enemy.invulnerable = false;
        });

        this.myScene.anims.create({
            key: 'explosion-muerte',
            frames: this.myScene.anims.generateFrameNumbers('explosion', { start: 0, end: 77 }),
            frameRate: 20,
            repeat: 0
        });

        this.myScene.physics.add.collider(pPlayer, this.enemies, this.hitEnemy, null, this);
    }

    update(pPlayer) {
        this.data(pPlayer, this.enemies);
    }

    data(player, enemies) {        
        enemies.children.iterate(child => {
            let distance = player.x - child.x;
            if (child.invulnerable) return;

            if (Phaser.Math.Distance.BetweenPoints(player, child) < 180) {
                if (distance > 20) {
                    child.setVelocityX(50);
                    child.flipX = true;
                    if (child.anims.currentAnim.key !== 'arania-caminar') {
                        child.play('arania-caminar', true);
                    }
                } else if (distance < -20) {
                    child.setVelocityX(-50);
                    child.flipX = false;
                    if (child.anims.currentAnim.key !== 'arania-caminar') {
                        child.play('arania-caminar', true);
                    }
                } else {
                    if (child.anims.currentAnim.key !== 'arania-ataque') {
                        child.play('arania-ataque', true);
                        child.setVelocityX(0);
                        this.attackPlayer(child, player); // Ataque al jugador
                    }
                }
            } else {
                child.setVelocityX(0);
                if (child.anims.currentAnim.key !== 'arania-descanso') {
                    child.play('arania-descanso', true);
                }
            }
        });
    }

    attackPlayer(enemy, player) {
        if (!enemy.attackHitbox) {
            enemy.attackHitbox = this.myScene.add.rectangle(enemy.x, enemy.y, 30, 30, 0xff0000, 0);
            this.myScene.physics.add.existing(enemy.attackHitbox);
            enemy.attackHitbox.body.setAllowGravity(false);
        }

        enemy.attackHitbox.x = enemy.x + (enemy.flipX ? 20 : -20);
        enemy.attackHitbox.y = enemy.y;

        this.hitbox = this.myScene.physics.add.overlap(player, enemy.attackHitbox, () => {
            if (!player.invulnerable) { // Verificar si el jugador no está invulnerable
                this.myScene.handleEnemyAttack(player, enemy.attackHitbox);
            }
        }, null, this);

        this.myScene.time.delayedCall(500, () => {
            this.myScene.physics.world.removeCollider(this.hitbox);
        })
    }

    hitEnemy(player, enemy) {
        if (!enemy.invulnerable) {
            if (player.body.velocity.y > 0 && enemy.body.touching.up) {
                this.takeDamage(enemy, 40, player);
                player.setVelocityY(-200);
            } else {
                this.myScene.handleEnemyAttack(player, enemy);
            }
        }
    }

    takeDamage(enemy, damage, direction) {
        if (enemy.invulnerable) return;

        enemy.health -= damage;
        enemy.invulnerable = true;
        enemy.anims.stop(); // Detener cualquier animación en curso
        enemy.play('arania-danio', true); // Reproducir animación de daño

        enemy.setVelocityY(-100);
        enemy.setVelocityX(direction === 'left' ? 100 : -100);

        this.myScene.tweens.add({
            targets: enemy,
            alpha: 0,
            duration: 100,
            ease: 'Linear',
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                enemy.setAlpha(1);
            }
        });

        this.myScene.time.delayedCall(1000, () => {
            enemy.invulnerable = false;
        });

        if (enemy.health <= 0) {
            enemy.setVelocityX(0);
            enemy.setVelocityY(0);
            enemy.play('explosion-muerte', true);

            this.myScene.time.delayedCall(500, () => {
                enemy.destroy();
                let explosionScale = Math.min(enemy.displayWidth / 112, enemy.displayHeight / 112);
                let explosion = this.myScene.add.sprite(enemy.x, enemy.y, 'explosion').setScale(explosionScale);
                explosion.play('explosion-muerte');
                explosion.on('animationcomplete', () => {
                    explosion.destroy();
                });
            });
        }
    }
}