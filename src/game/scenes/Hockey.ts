import { Game, Geom, Scene } from 'phaser';
import { FIELD_CORNER_RADIUS, FIELD_SIZE_X, FIELD_SIZE_Y, PUCK_SIZE } from '../constants';

export class Hockey extends Scene {
    fieldContainer!: any;
    puckContainer!: any;
    lineContainer!: any;
    outerRect!: any;
    innerRect!: any;

    preload() {
        this.load.json('hockeyField', 'assets/hockeyField.json');
    }

    create() {
        this.cameras.main.centerOn(0, 0);
        this.matter.world.setBounds(-FIELD_SIZE_X / 2, -FIELD_SIZE_Y / 2);
        const hockeyBoxVerts = `0 0 0 ${FIELD_SIZE_Y} ${FIELD_SIZE_X} ${FIELD_SIZE_Y} ${FIELD_SIZE_X} 0`;
        // const hockeyBoxPolygon = this.add.polygon(0, 0, hockeyBoxVerts, 0x00ff00, 0.2);
        
        const hockeyField = this.cache.json.get('hockeyField');
        this.matter.add.fromJSON(0, 0, hockeyField.star);
        this.matter.add.gameObject(hockeyBoxPolygon, { shape: { type: 'fromVerts', verts: hockeyBoxVerts, flagInternal: false } });

    }

}

const config = {
    scene: Hockey,
    type: Phaser.AUTO,
    width: FIELD_SIZE_X,
    height: FIELD_SIZE_Y,
    backgroundColor: '#aaa',
    physics: {
        default: 'matter',
        matter: { debug: true },
    },
};

export const startGame = (parent: string) => new Game({ ...config, parent });