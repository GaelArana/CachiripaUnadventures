export class carretera{
    constructor(scene){
        this.myScene = scene
    }

    preload(){
        this.myScene.load.image('tilesMage', '../images/tilesets/magecity.png')
        this.myScene.load.image('tilesMou', '../images/tilesets/mountain_landscape.png')

        this.myScene.load.tilemapTiledJSON('tilemapJSON', '../json/Level1.json')


    }

    create(){
        this.map = this.myScene.make.tilemap({key: 'tilemapJSON'})

        this.tileset3 = this.map.addTilesetImage('magecity', 'tilesMage');
        this.tileset4 = this.map.addTilesetImage('mou', 'tilesMou');


        this.layer4 = this.map.createLayer("Carretera", [this.tileset3, this.tileset4], 0, 0)
    }
}