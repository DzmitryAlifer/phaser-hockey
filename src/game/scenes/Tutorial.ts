import { Game, Geom, Scene } from 'phaser';

export class Tutorial extends Scene {
   

    preload() {
    }

    create() {
    }

}

const config = {
    scene: Tutorial,
    type: Phaser.AUTO,
    width: 300,
    height: 200,
    backgroundColor: '#aaa',
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: { x: 0, y: 0 },
        },
    },
};

export const startTutorial = (parent: string) => new Game({ ...config, parent });