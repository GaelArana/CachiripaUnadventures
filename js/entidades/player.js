import { GameData } from '../escenas/index.js'

export class Player {
    constructor(scene) {
        this.myScene = scene;
        this.health = GameData.health;  // Vida del jugador
        this.isAttacking = false;
        this.score = GameData.score;
        this.money = GameData.money;
        this.isInvincible = false;
    }

    preload() {
        // Cargar spritesheets
        this.myScene.load.spritesheet('movimientos', '../../images/jugador/CachiRun.png', { frameWidth: 69, frameHeight: 74 });
        this.myScene.load.spritesheet('ataque', '../../images/jugador/cachiAttack.png', { frameWidth: 82, frameHeight: 74 });
        this.myScene.load.spritesheet('panzaso', '../../images/jugador/cachiPansazo.png', { frameWidth: 82, frameHeight: 74 });
        this.myScene.load.spritesheet('headSprites', '../images/items/cachiripaVida.png', { frameWidth: 55, frameHeight: 63 });
    }

    create() {

        this.myScene.anims.create({
            key: 'headAnimation',
            frames: this.myScene.anims.generateFrameNumbers('headSprites', { start: 0, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.createHUD();

        // Player Ataques
        this.myScene.anims.create({
            key: 'cachi-danio',
            frames: [{ key: 'ataque', frame: 0 }],
            repeat: 0
        });

        this.myScene.anims.create({
            key: 'cachi-muerte',
            frames: [{ key: 'ataque', frame: 1 }],
            repeat: 0
        });

        this.myScene.anims.create({
            key: 'cachi-descanso',
            frames: [{ key: 'movimientos', frame: 0 },
                { key: 'movimientos', frame: 1 },
                { key: 'movimientos', frame: 2 },
                { key: 'movimientos', frame: 1 },
                { key: 'movimientos', frame: 0 }
            ],
            frameRate: 5,
            repeat: 0
        });

        this.myScene.anims.create({
            key: 'cachi-golpe',
            frames: [{ key: 'ataque', frame: 2 },
                { key: 'ataque', frame: 3 },
                { key: 'ataque', frame: 4 },
                { key: 'ataque', frame: 3 },
                { key: 'ataque', frame: 2 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.myScene.anims.create({
            key: 'cachi-cachetada',
            frames: [{ key: 'ataque', frame: 5 },
                { key: 'ataque', frame: 6 },
                { key: 'ataque', frame: 7 },
                { key: 'ataque', frame: 8 },
                { key: 'ataque', frame: 7 },
                { key: 'ataque', frame: 6 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.myScene.anims.create({
            key: 'cachi-patada',
            frames: [{ key: 'ataque', frame: 9 },
                { key: 'ataque', frame: 10 },
                { key: 'ataque', frame: 11 },
                { key: 'ataque', frame: 10 },
                { key: 'ataque', frame: 9 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.myScene.anims.create({
            key: 'cachi-patada',
            frames: [{ key: 'ataque', frame: 9 },
                { key: 'ataque', frame: 10 },
                { key: 'ataque', frame: 11 },
                { key: 'ataque', frame: 10 },
                { key: 'ataque', frame: 9 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.myScene.anims.create({
            key: 'cachi-morder',
            frames: [{ key: 'ataque', frame: 12 },
                { key: 'ataque', frame: 13},
                { key: 'ataque', frame: 14 },
                { key: 'ataque', frame: 13 },
                { key: 'ataque', frame: 12 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.myScene.anims.create({
            key: 'cachi-parreo',
            frames: [{ key: 'ataque', frame: 15 },
                { key: 'ataque', frame: 16},
                { key: 'ataque', frame: 17 },
                { key: 'ataque', frame: 18 },
                { key: 'ataque', frame: 17 },
                { key: 'ataque', frame: 16}
            ],
            frameRate: 10,
            repeat: -1
        });



        this.myScene.anims.create({
            key: 'cachi-correr',
            frames: this.myScene.anims.generateFrameNumbers('movimientos', { start: 6, end: 12 }),
            frameRate: 15,
            repeat: -1
        });

        this.myScene.anims.create({
            key: 'cachi-saltar',
            frames: this.myScene.anims.generateFrameNumbers('movimientos', { start: 13, end: 16 }),
            frameRate: 10,
            repeat: -1
        });
        

        

       
        this.Player = this.myScene.physics.add.sprite(50, 50, 'movimientos');
        
        this.Player.setScale(0.5);
        this.Player.body.setSize(this.Player.width * 0.4, this.Player.height * 0.6);
        this.Player.body.setOffset(this.Player.width * 0.3, this.Player.height * 0.4);
        this.Player.setBounce(0.2);
        this.Player.setCollideWorldBounds(true);

        // Controles
        this.keyW = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyS = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.cursors = this.myScene.input.keyboard.createCursorKeys();

        // Crear hitbox de ataque (invisible por defecto)
        
        this.attackHitbox = this.myScene.add.zone(this.Player.x, this.Player.y, 50, 50).setSize(40, 20);
        this.myScene.physics.world.enable(this.attackHitbox);
        this.attackHitbox.body.setAllowGravity(false);
        this.attackHitbox.body.setImmovable(true);
        this.attackHitbox.setVisible(false); // Ocultar hitbox

        // Hacer que el hitbox interactúe con los enemigos
        this.myScene.physics.add.overlap(this.attackHitbox, this.myScene.aranias, this.hitEnemy, null, this);
    }

    createHUD() {
        // Crear cabecitas animadas para la vida
        this.heads = [];
        for (let i = 0; i < GameData.health + 1; i++) { // Suponiendo que tienes 3 cabecitas
            const head = this.myScene.add.sprite(0, 0, 'headSprites');
            head.setScale(0.5); // Tamaño más pequeño
            head.setOrigin(0, 0);
            head.play('headAnimation'); // Reproducir animación
            this.heads.push(head);
        }

        // Texto de dinero
        this.moneyText = this.myScene.add.text(0, 0, `Money: ${this.money}`, {
            fontSize: '20px',
            fill: '#fff'
        });

        // Texto de puntuación
        this.scoreText = this.myScene.add.text(0, 0, `Score: ${this.score}`, {
            fontSize: '20px',
            fill: '#fff'
        });
    }

    updateHUD() {
        const player = this.myScene.player.Player;

        for (let i = 0; i < this.heads.length; i++) {
            this.heads[i].setX(player.x - 200 + (i * 20));
            this.heads[i].setY(player.y - 150);
            this.heads[i].setVisible(i < this.health);
        }

        // Actualizar texto de dinero y puntuación
        this.moneyText.setText(`Money: ${GameData.money}`);
        this.scoreText.setText(`Score: ${GameData.score}`);
        this.moneyText.setPosition(player.x - 200, player.y - 120);
        this.scoreText.setPosition(player.x + 150, player.y - 120);

        
    }

    update() {
        this.updateHUD()
        if (this.isInvincible) return;
        
        if (this.isAttacking) {
            this.attackHitbox.setPosition(
                this.Player.flipX ? this.Player.x - 20 : this.Player.x + 20,
                this.Player.y
            );
        }

        if(this.keyD.isDown){
            this.Player.setVelocityX(160)
            this.Player.flipX = false
            this.Player.play('cachi-correr', true);
        }else if(this.keyA.isDown){
            this.Player.setVelocityX(-160)
            this.Player.flipX = true;
            this.Player.play('cachi-correr', true);
        }else if(this.keyS.isDown){
            this.Player.play('cachi-parreo', true);
            this.activateHitbox();
        }  else if(this.keyW.isDown && this.Player.body.blocked.down){
            this.Player.setVelocityY(-210);
            this.Player.play('cachi-saltar', true);
        }
        else if (this.cursors.left.isDown) {
            this.Player.play('cachi-golpe', true);
            this.activateHitbox();
        } else if (this.cursors.right.isDown) {
            this.Player.play('cachi-cachetada', true);
            this.activateHitbox();
        } else if (this.cursors.up.isDown) {
            this.Player.play('cachi-patada', true);
            this.activateHitbox();
        } else if (this.cursors.down.isDown) {
            this.Player.play('cachi-morder', true);
            this.activateHitbox();
        } else {
            this.Player.setVelocityX(0);
            this.Player.play('cachi-descanso', true);
            this.deactivateHitbox();
        }



        // Actualizar posición de la hitbox de ataque
        if (this.isAttacking) {
            this.attackHitbox.setPosition(
                this.Player.flipX ? this.Player.x - 20 : this.Player.x + 20,
                this.Player.y
            );
        }
        
    }

    activateHitbox() {
        this.isAttacking = true;
        this.attackHitbox.setVisible(true);
        this.attackHitbox.body.enable = true;
    }

    deactivateHitbox() {
        this.isAttacking = false;
        this.attackHitbox.setVisible(false);
        this.attackHitbox.body.enable = false;
    }

    hitEnemy(attackHitbox, enemy) {
        enemy.takeDamage(1);  // Llamar al método para que la araña reciba daño
    }

    takeDamage(amount, direction) {
        if (this.isInvincible) return;

        this.health -= amount;
        GameData.health = this.health;
        if (this.health <= 0) {
            this.Player.play('cachi-muerte', true)
            this.Player.body.setOffset(this.Player.width * 0.3, this.Player.height * 0.1)
            this.Player.setVelocityY(-200);
            this.Player.setVelocityX(direction === 'left' ? 15 : -15);
            this.myScene.tweens.add({
                targets: this.Player,
                alpha: 0,
                duration: 100,
                ease: 'Linear',
                yoyo: true,
                repeat: 5,
                onComplete: () => {
                    this.isInvincible = true;
                    this.Player.setAlpha(1);
                }
            });
            this.myScene.time.delayedCall(4000, () => {
                this.myScene.scene.start('GameOverScene');
            })
            
        } else { 
            this.Player.play('cachi-danio', true);

            this.myScene.tweens.add({
                targets: this.Player,
                alpha: 0,
                duration: 100,
                ease: 'Linear',
                yoyo: true,
                repeat: 5,
                onComplete: () => {
                    this.isInvincible = false;
                    this.Player.setAlpha(1);
                }
            });
            this.Player.setVelocityY(direction === 'left' ? 200 : -200);
            this.Player.setVelocityX(direction === 'left' ? 200 : -200);
        }

        this.isInvincible = true;
    }

    increaseScore(amount) {
        this.score += amount;
        GameData.score = this.score;
    }

    increaseMoney(amount) {
        this.money += amount;
        GameData.money = this.money;
    }
}