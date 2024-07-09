import { Game, Geom, Scene } from 'phaser';
import { FIELD_CORNER_RADIUS, SIZE_X, SIZE_Y, PUCK_SIZE } from '../constants';

export class Hockey extends Scene {
    fieldContainer!: any;
    puckContainer!: any;
    lineContainer!: any;
    outerRect!: any;
    innerRect!: any;

    create() {
        this.cameras.main.centerOn(0, 0);
        this.matter.world.setBounds(-SIZE_X / 2, -SIZE_Y / 2);

        const hockeyBoxOuterVerts = `${SIZE_X / 2} 0 ${SIZE_X} 0 ${SIZE_X} ${SIZE_Y} 0 ${SIZE_Y} 0 0 ${SIZE_X / 2 - 1} 0`;
        const hockeyBoxInnerVerts = `${SIZE_X / 2 - 1} 10 10 10 10 ${SIZE_Y - 10} ${SIZE_X - 10} ${SIZE_Y - 10} ${SIZE_X - 10} 10 ${SIZE_X / 2} 10`;
        const hockeyBoxVerts = `${hockeyBoxOuterVerts} ${hockeyBoxInnerVerts}`;
        const hockeyBoxPolygon = this.add.polygon(0, 0, hockeyBoxVerts, 0x00ff00, 0.2);
        this.matter.add.gameObject(hockeyBoxPolygon, { shape: { type: 'fromVerts', verts: hockeyBoxVerts, flagInternal: false } });

    }

}

const config = {
    scene: Hockey,
    type: Phaser.AUTO,
    width: SIZE_X,
    height: SIZE_Y,
    backgroundColor: '#aaa',
    physics: {
        default: 'matter',
        matter: { debug: true },
    },
};

export const startGame = (parent: string) => new Game({ ...config, parent });