import { Curves, Game, Geom, Math, Scene } from 'phaser';
import { SIZE_X, SIZE_Y, CORNER_D } from '../constants';

export class Hockey3 extends Scene {
    constructor() {
        super({
            key: 'Hockey3',
            physics: {
                arcade: { debug: true },
                matter: { debug: true },
            }
        });
    }

    create() {
        this.cameras.main.centerOn(0, 0);
        const puck = this.physics.add.image(-100, -80, '').setCircle(6).setVelocity(-200, -50).setBounce(0.99);
        const borders = this.physics.add.group({ defaultKey: 'ball', bounceX: 1, bounceY: 1 });

        const createdBalls = borders.createMultiple({ quantity: 60, key: borders.defaultKey, frame: 0 });
        Phaser.Actions.PlaceOnCircle(createdBalls, { x: -200, y: 0, radius: 150 } as Geom.Circle, Math.DegToRad(180), Math.DegToRad(270));

        for (const border of borders.getChildren()) {
            (border as any).setCircle(16);
            (border.body as any).setImmovable(true);

        }

        this.physics.add.collider(puck, borders);
    }
}

const config = {
    type: Phaser.AUTO,
    width: SIZE_X + 20,
    height: SIZE_Y + 20,
    scene: Hockey3,
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: { x: 0, y: 200 }
        }
    }
};

export const startHockey3 = (parent: string) => new Game({ ...config, parent });