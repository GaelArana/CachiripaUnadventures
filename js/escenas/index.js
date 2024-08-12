import { main } from "../login/main.js";
import { StartScene } from "./startScene.js";
import { Level1 } from "../niveles/level1.js";
import { LevelCarretera } from "../niveles/level1.2.js";
import { LevelUnipoli } from "../niveles/level1.3.js";
import { GameOverScene } from "./gameOverScene.js";
import { PauseScene } from "./pauseScene.js";

export const GameData = {
    health: 5,
    score: 0,
    money: 0
};

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [main, StartScene, Level1, LevelCarretera, LevelUnipoli, GameOverScene, PauseScene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
}

let game = new Phaser.Game(config);