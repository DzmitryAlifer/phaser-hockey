import { Curves, Game, Geom, Math, Physics, Scene } from 'phaser';
import { BLOCK_AMOUNT, RADIAL_BLOCK_SHIFT, SIZE_X, SIZE_Y, CORNER_D } from '../constants';

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
        this.matter.world.setBounds(-SIZE_X / 2, -SIZE_Y / 2);

        const puck = this.physics.add.image(-100, -40, '').setCircle(6).setVelocity(-200, -50).setBounce(0.99);
        
        const radialBorder = this.physics.add.group({ defaultKey: 'radialBorder' });
        createRadialBorder(radialBorder, RADIAL_BLOCK_SHIFT - SIZE_X / 2, RADIAL_BLOCK_SHIFT - SIZE_Y / 2, 180);
        createRadialBorder(radialBorder, SIZE_X / 2 - RADIAL_BLOCK_SHIFT, RADIAL_BLOCK_SHIFT - SIZE_Y / 2, 270);
        createRadialBorder(radialBorder, SIZE_X / 2 - RADIAL_BLOCK_SHIFT, SIZE_Y / 2 - RADIAL_BLOCK_SHIFT, 0);
        createRadialBorder(radialBorder, RADIAL_BLOCK_SHIFT - SIZE_X / 2, SIZE_Y / 2 - RADIAL_BLOCK_SHIFT, 90);
        
        const radialBorderBlocks = radialBorder.getChildren();
        
        for (let i = 0; i < radialBorderBlocks.length; i++) {
            const borderBlock = radialBorderBlocks.at(i) as any;
            borderBlock.angle = i * 90 / BLOCK_AMOUNT;
            (borderBlock.body as any).setImmovable(true);
        }

        this.physics.add.collider(puck, radialBorder);
    }

}

const config = {
    type: Phaser.AUTO,
    width: SIZE_X + 100,
    height: SIZE_Y + 100,
    scene: Hockey3,
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: { x: 0, y: 200 }
        }
    }
};

function createRadialBorder(group: Physics.Arcade.Group, x: number, y: number, startAngle: number): void {
    const borderBlock = group.createMultiple({ quantity: BLOCK_AMOUNT, key: group.defaultKey, frame: 0 });
    Phaser.Actions.PlaceOnCircle(borderBlock, { x, y, radius: CORNER_D } as Geom.Circle, Math.DegToRad(startAngle), Math.DegToRad(startAngle + 90));
}

export const startHockey3 = (parent: string) => new Game({ ...config, parent });