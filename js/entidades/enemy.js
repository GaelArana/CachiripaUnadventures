export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, scale, bodyConfig) {
        super(scene, x, y, texture);
        this.setScale(scale);
        this.health = 5;
        this.isInvincible = false;
        this.isDying = false; 
        this.myScene = scene;
        this.myScene.physics.world.enable(this);
        this.myScene.add.existing(this);
        this.setCollideWorldBounds(true);

        this.body.setGravityY(300);
        this.body.setSize(bodyConfig.width, bodyConfig.height);
        this.body.setOffset(bodyConfig.offsetX, bodyConfig.offsetY);
        this.isMovingRight = true;
        this.initAnimations();
    }

    initAnimations() {
        let textureKey = this.texture.key; 
        if (textureKey.startsWith('liebre')) {
            this.myScene.anims.create({
                key: 'hareMove',
                frames: this.myScene.anims.generateFrameNumbers(textureKey, { start: 12, end: 14 }),
                frameRate: 10,
                repeat: -1
            });
            this.myScene.anims.create({
                key: 'hareHurt',
                frames: [{ key: textureKey, frame: 53 }],
                frameRate: 10,
                repeat: 0
            });
            this.myScene.anims.create({
                key: 'hareDeath',
                frames: [{ key: textureKey, frame: 36 }],
                frameRate: 10,
                repeat: 0
            });
        } else if (textureKey === 'spider') {
            this.myScene.anims.create({
                key: 'spiderMove',
                frames: this.myScene.anims.generateFrameNumbers('spider', { start: 2, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
            this.myScene.anims.create({
                key: 'spiderHurt',
                frames: [{ key: 'spider', frame: 0 }],
                frameRate: 10,
                repeat: 0
            });
            this.myScene.anims.create({
                key: 'spiderDeath',
                frames: [{ key: 'spider', frame: 0 }],
                frameRate: 10,
                repeat: 0
            });
        }
    }

    update() {
        if (this.isInvincible || this.isDying) return;

        if (this.isMovingRight) {
            this.setVelocityX(50);

            this.anims.play(this.texture.key.startsWith('liebre') ? 'hareMove' : 'spiderMove', true);
            this.flipX = true;

            if (this.body.blocked.right) {
                this.isMovingRight = false;
                this.flipX = false;
            }
        } else {
            this.setVelocityX(-50);
            // Utilizar la animación adecuada basada en la textura
            this.anims.play(this.texture.key.startsWith('liebre') ? 'hareMove' : 'spiderMove', true);
            this.flipX = false;

            if (this.body.blocked.left) {
                this.isMovingRight = true;
                this.flipX = true;
            }
        }
    }

    takeDamage(amount, direction) {
        if (this.isInvincible || this.isDying) return;

        this.health -= amount;
        if (this.health <= 0) {
            this.isDying = true; 
            this.setVelocity(0); 
            this.body.checkCollision.none = true; 
            this.body.setAllowGravity(false); 
            this.setImmovable(true); 


            this.anims.play(this.texture.key.startsWith('liebre') ? 'hareDeath' : 'spiderDeath', true);
            this.myScene.time.delayedCall(500, () => { 
                this.setVisible(false); 
                

                let explosionScale = Math.min(this.displayWidth / 112, this.displayHeight / 112);
                let explosion = this.myScene.add.sprite(this.x, this.y, 'explosion').setScale(explosionScale);

                explosion.play('explosionAnim');
                explosion.on('animationcomplete', () => {
                    explosion.destroy();
                    this.destroy();
                });
            });
            return;
        }

        this.isInvincible = true;
        this.anims.play(this.texture.key.startsWith('liebre') ? 'hareHurt' : 'spiderHurt', true);

        // Lanzar hacia atrás
        this.setVelocityY(direction === 'left' ? 200 : -200);
        this.setVelocityX(direction === 'left' ? 200 : -200);

        // Parpadear el sprite
        this.myScene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 100,
            ease: 'Linear',
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                this.isInvincible = false;
                this.setAlpha(1);
            }
        });
    }
}