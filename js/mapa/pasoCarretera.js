export class Plataformas{
    constructor(scene){
        this.myScene = scene
    }

    preload(){
        this.myScene.load.image('tilesMage', '../images/tilesets/magecity.png')
        this.myScene.load.image('tilesMou', '../images/tilesets/mountain_landscape.png')
        this.myScene.load.image('tilesVill', '../images/tilesets/TX_Village_Props.png')

        this.myScene.load.tilemapTiledJSON('mapJSON', '../json/carreteraSubnivel.json')
    }

    create(){
        this.mapa = this.myScene.make.tilemap({key: 'mapJSON'})

        this.tileset1 = this.mapa.addTilesetImage('mage', 'tilesMage');
        this.tileset2 = this.mapa.addTilesetImage('mou', 'tilesMou');
        this.tileset3 = this.mapa.addTilesetImage('TX_Village_Props', 'tilesVill');
        
        this.layer1 = this.mapa.createLayer("fondo", [this.tileset1, this.tileset2, this.tileset3], 0, 0)
        this.layer2 = this.mapa.createLayer("suelo", [this.tileset1, this.tileset2], 0, 0)
        this.layer3 = this.mapa.createLayer("plataformas", [this.tileset1, this.tileset2], 0, 0)

        console.log(this.tileset2)
        this.layer2.setCollisionByProperty({ collision: true });
    }
}