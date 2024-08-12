export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // Puedes cargar un fondo si lo necesitas
        this.load.image('backgroundImage', '../images/ambiente/background_1.png');
    }

    create() {
        let background = this.add.image(0, 0, 'backgroundImage').setOrigin(0, 0);
        background.displayWidth = this.sys.game.config.width;
        background.displayHeight = this.sys.game.config.height;

        // Títulos y botones de nivel usando texto
        let title = this.add.text(this.sys.game.config.width / 2, 100, 'Selecciona un Nivel', {
            fontSize: '50px',
            fill: '#fff',
            fontFamily: 'Comic Sans MS, Comic Sans, cursive'
        }).setOrigin(0.5);

        // Botón para Level1
        let level1Button = this.add.text(this.sys.game.config.width / 2, 200, 'Nivel 1', {
            fontSize: '32px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 },
            borderRadius: 10
        }).setOrigin(0.5)
          .setInteractive()
          .on('pointerdown', () => this.startLevel('level1'))
          .on('pointerover', () => level1Button.setStyle({ fill: '#fff', backgroundColor: '#000' }))
          .on('pointerout', () => level1Button.setStyle({ fill: '#000', backgroundColor: '#fff' }));

        // Botón para LevelCarretera
        let levelCarreteraButton = this.add.text(this.sys.game.config.width / 2, 300, 'Nivel Carretera', {
            fontSize: '32px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 },
            borderRadius: 10
        }).setOrigin(0.5)
          .setInteractive()
          .on('pointerdown', () => this.startLevel('levelCarretera'))
          .on('pointerover', () => levelCarreteraButton.setStyle({ fill: '#fff', backgroundColor: '#000' }))
          .on('pointerout', () => levelCarreteraButton.setStyle({ fill: '#000', backgroundColor: '#fff' }));

        // Botón para LevelUnipoli
        let levelUnipoliButton = this.add.text(this.sys.game.config.width / 2, 400, 'Nivel Unipoli', {
            fontSize: '32px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 },
            borderRadius: 10
        }).setOrigin(0.5)
          .setInteractive()
          .on('pointerdown', () => this.startLevel('levelUnipoli'))
          .on('pointerover', () => levelUnipoliButton.setStyle({ fill: '#fff', backgroundColor: '#000' }))
          .on('pointerout', () => levelUnipoliButton.setStyle({ fill: '#000', backgroundColor: '#fff' }));
    }

    startLevel(levelKey) {
        this.scene.start(levelKey); // Cambia a la escena del nivel seleccionado
    }
}