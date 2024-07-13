import { Curves, Game, Geom, Math, Scene } from 'phaser';
import { SIZE_X, SIZE_Y, CORNER_D } from '../constants';

export class Hockey2 extends Scene {
    create() {
        this.cameras.main.centerOn(0, 0);
        this.matter.world.setBounds(-SIZE_X / 2, -SIZE_Y / 2);

        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0xffffff, 1);
        graphics.beginPath();
        graphics.arc(CORNER_D - SIZE_X / 2, CORNER_D - SIZE_Y / 2, CORNER_D, Math.DegToRad(180), Math.DegToRad(270));
        graphics.arc(SIZE_X / 2 - CORNER_D, CORNER_D - SIZE_Y / 2, CORNER_D, Math.DegToRad(270), 0);
        graphics.arc(SIZE_X / 2 - CORNER_D, SIZE_Y / 2 - CORNER_D, CORNER_D, 0, Math.DegToRad(90));
        graphics.arc(CORNER_D - SIZE_X / 2, SIZE_Y / 2 - CORNER_D, CORNER_D, Math.DegToRad(90), Math.DegToRad(180));
        graphics.arc(CORNER_D - SIZE_X / 2, CORNER_D - SIZE_Y / 2, CORNER_D, Math.DegToRad(180), Math.DegToRad(180));
        graphics.strokePath();
        graphics.generateTexture('arcTexture', SIZE_X, SIZE_Y);

    }
}

const config = {
    type: Phaser.AUTO,
    width: SIZE_X + 20,
    height: SIZE_Y + 20,
    scene: Hockey2,
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: { x: 0, y: 200 }
        }
    }
};

export const startHockey2 = (parent: string) => new Game({ ...config, parent });