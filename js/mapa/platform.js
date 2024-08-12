export class Plataformas{
    constructor(scene){
        this.myScene = scene
    }

    preload(){
        this.myScene.load.image('tilesCon', '../images/tilesets/Assets.png')
        this.myScene.load.image('tilesFondo1', '../images/tilesets/TX_Village_Props.png')
        this.myScene.load.image('tilesMage', '../images/tilesets/magecity.png')
        this.myScene.load.image('tilesMou', '../images/tilesets/mountain_landscape.png')
        this.myScene.load.image('tilesRow', '../images/tilesets/RowHouseTileSet.png')
        this.myScene.load.image('tilesSub1', '../images/tilesets/Tileset.png')
        this.myScene.load.image('tilesSub2', '../images/tilesets/Tileset2.png')
        this.myScene.load.image('tilesSue1', '../images/tilesets/TX_Tileset_Ground.png')

        this.myScene.load.tilemapTiledJSON('tilemapJSON', '../json/Level1.json')

        this.myScene.load.spritesheet('peso',
            '../images/items/peso.png',
            { frameWidth: 24, frameHeight: 25 }
        );

        this.myScene.load.spritesheet('3peso',
            '../images/items/3peso.png',
            { frameWidth: 24, frameHeight: 24 }
        );
    }

    create(){
        this.myScene.anims.create({
            key: 'spinPeso',
            frames: this.myScene.anims.generateFrameNumbers('peso', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.myScene.anims.create({
            key: 'spin3Peso',
            frames: this.myScene.anims.generateFrameNumbers('3peso', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.map = this.myScene.make.tilemap({key: 'tilemapJSON'})

        this.tileset1 = this.map.addTilesetImage('Constructos', 'tilesCon');
        this.tileset2 = this.map.addTilesetImage('fondo1', 'tilesFondo1');
        this.tileset3 = this.map.addTilesetImage('magecity', 'tilesMage');
        this.tileset4 = this.map.addTilesetImage('mou', 'tilesMou');
        this.tileset5 = this.map.addTilesetImage('row', 'tilesRow');
        this.tileset6 = this.map.addTilesetImage('subsuelo1', 'tilesSub1');
        this.tileset7 = this.map.addTilesetImage('subsuelo2', 'tilesSub2');
        this.tileset8 = this.map.addTilesetImage('suelo1', 'tilesSue1');


        this.layer1 = this.map.createLayer("Fondo", [this.tileset2, this.tileset5, this.tileset7], 0, 0)
        this.layer2 = this.map.createLayer("Decoracion", [this.tileset2, this.tileset5, this.tileset7, this.tileset8], 0, 0)
        this.layer3 = this.map.createLayer("Subsuelo", [this.tileset1, this.tileset6, this.tileset7, this.tileset8], 0, 0)
        this.layer4 = this.map.createLayer("Carretera", [this.tileset3, this.tileset4], 0, 0)
        this.layer5 = this.map.createLayer("Suelo", [this.tileset4, this.tileset8], 0, 0)
        this.layer6 = this.map.createLayer("Plataformas", [this.tileset2, this.tileset5], 0, 0)

        this.coinsObj = this.map.getObjectLayer("Monedas").objects
        
        //Creamos grupo de monedas
        this.coins = this.myScene.physics.add.group({
            allowGravity: false,
            immovable: true
        })

        this.coinsObj.forEach(element => {
            const coin = this.coins.create(element.x, element.y - element.height, 'peso');
            coin.setOrigin(0, 0)
            coin.play('spinPeso')
        });

        this.coinsObj3 = this.map.getObjectLayer("3peso").objects
        
        //Creamos grupo de monedas
        this.coins3 = this.myScene.physics.add.group({
            allowGravity: false,
            immovable: true
        })

        this.coinsObj3.forEach(element => {
            const coin3 = this.coins.create(element.x, element.y - element.height, '3peso');
            coin3.setOrigin(0, 0)
            coin3.play('spin3Peso')
        });

        this.layer6.setCollisionByProperty({ collision: true });
        this.layer5.setCollisionByProperty({ collision: true });
        this.layer4.setCollisionByProperty({ collision: true })
        this.layer3.setCollisionByProperty({ collision: true });
    }
}