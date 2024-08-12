export class Plataformas{
    constructor(scene){
        this.myScene = scene
    }

    preload(){
        this.myScene.load.image('tilesFondo', '../images/tilesets/TX_Village_Props.png')
        this.myScene.load.image('tilesHouse', '../images/tilesets/RowHouseTileSet.png')
        this.myScene.load.image('tilesOut', '../images/tilesets/Outdoors_Tileset.png')
        this.myScene.load.image('tilesUfe', '../images/tilesets/ufeff_tiles_v2.png')
        this.myScene.load.image('tilesZrp', '../images/tilesets/ZRPGtrees.png')

        this.myScene.load.tilemapTiledJSON('tilemapJSON', '../json/nivel1.json')

        this.myScene.load.spritesheet('coin',
            '../images/items/peso.png',
            { frameWidth: 24, frameHeight: 25 }
        );
    }

    create(){
        this.myScene.anims.create({
            key: 'spin',
            frames: this.myScene.anims.generateFrameNumbers('coin', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.map = this.myScene.make.tilemap({key: 'tilemapJSON'})

        this.tileset1 = this.map.addTilesetImage('fondo1', 'tilesFondo');
        this.tileset2 = this.map.addTilesetImage('hou', 'tilesHouse');
        this.tileset4 = this.map.addTilesetImage('out', 'tilesOut');
        this.tileset5 = this.map.addTilesetImage('ufe', 'tilesUfe');
        this.tileset6 = this.map.addTilesetImage('zrp', 'tilesZrp');
        
        this.layer1 = this.map.createLayer("casas", [this.tileset1, this.tileset2], 0, 0)
        this.layer3 = this.map.createLayer("suelo", this.tileset5, 0, 0)
        this.layer2 = this.map.createLayer("plataformas", this.tileset2, 0, 0)

        this.coinsObj = this.map.getObjectLayer("Monedas").objects
        
        //Creamos grupo de monedas
        this.coins = this.myScene.physics.add.group({
            allowGravity: false,
            immovable: true
        })

        this.coinsObj.forEach(element => {
            const coin = this.coins.create(element.x, element.y - element.height, 'coin');
            coin.setOrigin(0, 0)
            coin.play('spin')
        });

        this.layer2.setCollisionByProperty({ collision: true });
        this.layer3.setCollisionByProperty({ collision: true });
    }
}