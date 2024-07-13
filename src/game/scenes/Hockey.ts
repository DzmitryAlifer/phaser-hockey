import { Game, Geom, Math, Physics, Scene } from 'phaser';
import { BLOCK_AMOUNT, BORDER_BLOCK_RADIUS, CORNER_D, CORNER_DRAW_R, CORNER_R, PUCK_RADIUS, RADIAL_BLOCK_SHIFT, SIZE_X, SIZE_Y } from '../constants';

export class Hockey3 extends Scene {
    constructor() {
        super({
            key: 'Hockey3',
            physics: { arcade: { debug: false }, matter: { debug: true } },
        });
    }

    preload() {
        this.load.image('rink', 'assets/rink_texture.jpg');
        this.load.image('puck', 'assets/puck.png');
    }

    create() {
        this.cameras.main.centerOn(0, 0);
        this.matter.world.setBounds(-SIZE_X / 2, -SIZE_Y / 2);

        const straightBorderGroup = this.physics.add.group();
        const straightBorder1 = this.add.rectangle(0, -SIZE_Y / 2, SIZE_X, 1);
        const straightBorder2 = this.add.rectangle(0, SIZE_Y / 2, SIZE_X, 1);
        const straightBorder3 = this.add.rectangle(-SIZE_X / 2, 0, 1, SIZE_Y);
        const straightBorder4 = this.add.rectangle(SIZE_X / 2, 0, 1, SIZE_Y);
        straightBorderGroup.add(straightBorder1).add(straightBorder2).add(straightBorder3).add(straightBorder4);
        straightBorderGroup.getChildren().forEach(({ body }) => (body as any).setImmovable(true));

        const radialBorderGroup = this.physics.add.group({ defaultKey: 'radialBorder' });
        createRadialBorder(radialBorderGroup, RADIAL_BLOCK_SHIFT - SIZE_X / 2, RADIAL_BLOCK_SHIFT - SIZE_Y / 2, 180);
        createRadialBorder(radialBorderGroup, SIZE_X / 2 - RADIAL_BLOCK_SHIFT, RADIAL_BLOCK_SHIFT - SIZE_Y / 2, 270);
        createRadialBorder(radialBorderGroup, SIZE_X / 2 - RADIAL_BLOCK_SHIFT, SIZE_Y / 2 - RADIAL_BLOCK_SHIFT, 0);
        createRadialBorder(radialBorderGroup, RADIAL_BLOCK_SHIFT - SIZE_X / 2, SIZE_Y / 2 - RADIAL_BLOCK_SHIFT, 90);
        radialBorderGroup.getChildren().forEach(({ body }) => (body as any).setCircle(16).setImmovable(true));

        const image = this.add.image(-SIZE_X / 2, -SIZE_Y / 2, 'rink');
        image.setOrigin(0, 0);

        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0xffff00, 1);
        graphics.arc(CORNER_D - SIZE_X / 2 - 8, CORNER_D - SIZE_Y / 2 - 8, CORNER_DRAW_R, Math.DegToRad(180), Math.DegToRad(270));
        graphics.arc(SIZE_X / 2 - CORNER_D + 8, CORNER_D - SIZE_Y / 2 - 8, CORNER_DRAW_R, Math.DegToRad(270), Math.DegToRad(360));
        graphics.arc(SIZE_X / 2 - CORNER_D + 8, SIZE_Y / 2 - CORNER_D + 8, CORNER_DRAW_R, Math.DegToRad(0), Math.DegToRad(90));
        graphics.arc(CORNER_D - SIZE_X / 2 - 8, SIZE_Y / 2 - CORNER_D + 8, CORNER_DRAW_R, Math.DegToRad(90), Math.DegToRad(180));
        graphics.arc(CORNER_D - SIZE_X / 2 - 8, CORNER_D - SIZE_Y / 2 - 8, CORNER_DRAW_R, Math.DegToRad(180), Math.DegToRad(270));
        graphics.strokePath();

        const puckImg = this.physics.add.image(-100, -50, 'puck');
        const puck = puckImg.setCircle(PUCK_RADIUS).setVelocity(-200, -80).setBounce(1);

        this.physics.add.collider(puck, radialBorderGroup);
        this.physics.add.collider(puck, straightBorderGroup);
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

export const startHockey = (parent: string) => new Game({ ...config, parent });