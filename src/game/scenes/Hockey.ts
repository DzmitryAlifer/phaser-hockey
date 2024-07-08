import { Game, Geom, Scene } from 'phaser';
import { FIELD_CORNER_RADIUS, FIELD_SIZE_X, FIELD_SIZE_Y, PUCK_SIZE } from '../constants';

export class Hockey extends Scene {
    fieldContainer!: any;
    puckContainer!: any;
    lineContainer!: any;
    outerRect!: any;
    innerRect!: any;

    preload() {}

    create() {
        const field = this.add.graphics();
        field.fillStyle(0xdddddd, 1).fillRoundedRect(0, 0, FIELD_SIZE_X, FIELD_SIZE_Y, FIELD_CORNER_RADIUS);
        // this.fieldContainer = this.add.container(0, 0, field);
        // this.fieldContainer.setSize(FIELD_SIZE_X, FIELD_SIZE_Y);

        const puck = this.add.circle(0, 0, PUCK_SIZE / 2, 0x333333);
        this.puckContainer = this.add.container(FIELD_SIZE_X / 2, FIELD_SIZE_Y / 2, puck);
        this.puckContainer.setSize(PUCK_SIZE, PUCK_SIZE);
        this.physics.world.enable(this.puckContainer);
        
        this.puckContainer.body
            .setVelocity(400, 400)
            .setBounce(.5, .5)
            .setCollideWorldBounds(true)
            .setBoundsRectangle(new Geom.Rectangle(0, 0, FIELD_SIZE_X, FIELD_SIZE_Y));

        const line = this.add.line(-100, -100, 200, 200, 300, 300, 0xff0000);
        this.lineContainer = this.add.container(0, 0, line);
        this.physics.world.enable(this.puckContainer);
    }

}

const config = {
    scene: Hockey,
    type: Phaser.AUTO,
    width: FIELD_SIZE_X,
    height: FIELD_SIZE_Y,
    // backgroundColor: '#dddddd',
    physics: {
        default: 'arcade',
        arcade: { debug: true },
    },
};

export const startGame = (parent: string) => new Game({ ...config, parent });