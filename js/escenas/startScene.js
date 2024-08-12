import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInAnonymously, updateProfile, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

export class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('backgroundImage', '../images/ambiente/menu.png');
        this.load.image('playButton', '../images/ambiente/boton_play.png'); // Carga la imagen del botón de play
        this.load.image('logoutButton', '../images/ambiente/logout.png'); // Carga la imagen del botón de logout
        
    }

    create() {
        let background = this.add.image(0, 0, 'backgroundImage').setOrigin(0, 0);
        background.displayWidth = this.sys.game.config.width;
        background.displayHeight = this.sys.game.config.height;

        // Texto principal con una fuente más llamativa
        let gameTitle = this.add.text(this.sys.game.config.width / 2, 150, 'Cachiripa Unadventures', {
            fontSize: '60px',
            fill: '#fff',
            fontFamily: 'Comic Sans MS, Comic Sans, cursive'
        }).setOrigin(0.5);

        // Botón de play
        let playButton = this.add.image(this.sys.game.config.width / 2, 300, 'playButton')
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.startGame());

        // Escalar el botón de play según sea necesario
        playButton.setScale(0.9);

        // Añadir efecto de cambio de escala al pasar el mouse sobre el botón
        playButton.on('pointerover', () => {
            playButton.setScale(1);
        });

        playButton.on('pointerout', () => {
            playButton.setScale(0.9);
        });

        // Añadir el texto debajo del botón de Play
        let textBelowPlayButton = this.add.text(this.sys.game.config.width / 2, 400, 'Bienvenido al juego!', {
            fontSize: '30px',
            fill: '#fff',
            fontFamily: 'Comic Sans MS, Comic Sans, cursive'
        }).setOrigin(0.5);

       // Botón de logout debajo del texto
       let logoutButton = this.add.image(this.sys.game.config.width / 2, 500, 'logoutButton')
       .setOrigin(0.5)
       .setInteractive()
       .on('pointerdown', () => this.logout());

   // Escalar el botón de logout según sea necesario
   logoutButton.setScale(0.5);

   // Añadir efecto de cambio de escala al pasar el mouse sobre el botón
   logoutButton.on('pointerover', () => {
       logoutButton.setScale(0.7);
   });

   logoutButton.on('pointerout', () => {
       logoutButton.setScale(0.9);
   });
}

startGame() {
   this.scene.start('level1');
}

logout() {
   const auth = getAuth(); // Asegúrate de haber importado getAuth de Firebase
   auth.signOut().then(() => {
       const iframe = document.querySelector('iframe');
           if (iframe) {
               iframe.style.display = 'block';
           }
   
           // Mostrar el canvas
           const canvas = document.querySelector('canvas');
           if (canvas) {
               canvas.style.display = 'none';
           }
    // Redirigir a la escena de login o cualquier otra que quieras
   }).catch((error) => {
       console.error('Error al cerrar sesión:', error);
   });
}
}
