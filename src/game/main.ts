import { Game } from 'phaser';
import { Hockey } from './scenes/Hockey';

const config = {
    scene: Hockey,
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    backgroundColor: '#dddddd',
    physics: {
        default: 'arcade',
        arcade: { debug: true },
    },
};

export const StartGame = (parent: string) => new Game({ ...config, parent });
