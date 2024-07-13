import { Game, Geom, Scene } from 'phaser';
import { CORNER_R, SIZE_X, SIZE_Y, PUCK_SIZE } from '../constants';

export class Hockey1 extends Scene {
    fieldContainer!: any;
    puckContainer!: any;
    lineContainer!: any;
    outerRect!: any;
    innerRect!: any;

    preload() {
        this.load.image('ball', 'https://labs.phaser.io/assets/sprites/pangball.png');
    }

    create() {
        this.cameras.main.centerOn(0, 0);
        this.matter.world.setBounds(-SIZE_X / 2, -SIZE_Y / 2);

        const boxOuterVerts = `${SIZE_X / 2} 0 ${SIZE_X} 0 ${SIZE_X} ${SIZE_Y} 0 ${SIZE_Y} 0 0 ${SIZE_X / 2 - 1} 0`;
        const boxInnerVerts = `${SIZE_X / 2 - 1} 10 ${CORNER_R + 10} 10 10 ${CORNER_R + 10} 10 ${SIZE_Y - 10} ${SIZE_X - 10} ${SIZE_Y - 10} ${SIZE_X - 10} 10 ${SIZE_X / 2} 10`;
        const boxVerts = `${boxOuterVerts} ${boxInnerVerts}`;
        const boxPolygon = this.add.polygon(0, 0, boxVerts, 0x00ff00, 0.2);
        this.matter.add.gameObject(boxPolygon, { shape: { type: 'fromVerts', verts: boxVerts, flagInternal: false } });

        const puck = this.add.circle(0, 0, 10, 0x333333);
        const puckBody = this.matter.add.circle(0, 0, 10, { restitution: 1, friction: 0, frictionStatic: 0, frictionAir: 0.01 });
      
        this.matter.add.gameObject(puck, puckBody);
        this.matter.add.mouseSpring();
    }

}

const config = {
    scene: Hockey1,
    type: Phaser.AUTO,
    width: SIZE_X,
    height: SIZE_Y,
    backgroundColor: '#aaa',
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: { x: 0, y: 0 },
        },
    },
};

export const startHockey1 = (parent: string) => new Game({ ...config, parent });