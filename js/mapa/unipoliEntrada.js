export class Plataformas{
    constructor(scene){
        this.myScene = scene
    }

    preload(){
        this.myScene.load.image('tilesMage', '../images/tilesets/TX_Village_Props.png')
        this.myScene.load.image('tilesMou', '../images/tilesets/mountain_landscape.png')
        this.myScene.load.image('tilesRow', '../images/tilesets/RowHouseTileSet.png')
        this.myScene.load.image('tilesUte', '../images/tilesets/ufeff_tiles_v2.png')
        this.myScene.load.image('tilesVill', '../images/tilesets/TX_Village_Props.png')

        this.myScene.load.tilemapTiledJSON('map2JSON', '../json/nivel2.json')
    }

    create(){
        this.map = this.myScene.make.tilemap({key: 'map2JSON'})

        this.tileset1 = this.map.addTilesetImage('mage', 'tilesMage');
        this.tileset2 = this.map.addTilesetImage('mou', 'tilesMou');
        this.tileset3 = this.map.addTilesetImage('row', 'tilesRow');
        this.tileset4 = this.map.addTilesetImage('ute', 'tilesUte');
        this.tileset5 = this.map.addTilesetImage('vill', 'tilesVill');
        
        this.layer1 = this.map.createLayer("banqueta", [this.tileset2, this.tileset4, this.tileset5], 0, 0)
        this.layer2 = this.map.createLayer("carretera", [this.tileset2, this.tileset3, this.tileset4, this.tileset5], 0, 0)
        this.layer3 = this.map.createLayer("entrada", [this.tileset2, this.tileset3, this.tileset5], 0, 0)
        this.layer4 = this.map.createLayer("decoracion", [this.tileset2, this.tileset3, this.tileset5], 0, 0)
        

        console.log(this.layer1.setCollisionByProperty({ collision: true }))
        this.layer1.setCollisionByProperty({ collision: true });
        this.layer2.setCollisionByProperty({ collision: true });
    }
}