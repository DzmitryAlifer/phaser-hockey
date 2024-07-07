import { Scene } from 'phaser';

export class Hockey extends Scene {
    container!: any;

    preload() {
        this.load.image('mushroom', 'https://labs.phaser.io/assets/sprites/mushroom2.png');
    }

    create() {
        const image = this.add.image(0, 0, 'mushroom');
        this.container = this.add.container(200, 200, [image]);
        this.container.setSize(64, 64);
        this.physics.world.enable(this.container);
        this.container.body.setVelocity(500, 500).setBounce(.5, .5).setCollideWorldBounds(true);
    }

    constructor () {
        super('Hockey');
    }
}
