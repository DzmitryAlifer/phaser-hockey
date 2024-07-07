import { Game, Scene } from 'phaser';
import { FIELD_CORNER_RADIUS, FIELD_SIZE_X, FIELD_SIZE_Y, PUCK_SIZE } from '../constants';

export class Hockey extends Scene {
    fieldContainer!: any;
    puckContainer!: any;

    preload() {}

    create() {
        const field = this.add.graphics();
        field.fillStyle(0xdddddd, 1).fillRoundedRect(0, 0, FIELD_SIZE_X, FIELD_SIZE_Y, FIELD_CORNER_RADIUS);
        this.fieldContainer = this.add.container(0, 0, field);
        this.fieldContainer.setSize(FIELD_SIZE_X + 200, FIELD_SIZE_Y + 200);

        const puck = this.add.circle(0, 0, PUCK_SIZE / 2, 0x333333);
        this.puckContainer = this.add.container(FIELD_SIZE_X / 2, FIELD_SIZE_Y / 2, puck);
        this.puckContainer.setSize(PUCK_SIZE, PUCK_SIZE);

        this.physics.world.enable([this.fieldContainer, this.puckContainer]);
        this.puckContainer.body.setVelocity(500, 500).setBounce(.5, .5).setCollideWorldBounds(true);

        this.physics.add.existing(field, true);
        this.physics.add.existing(puck);
        this.physics.add.collider(field, puck);
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