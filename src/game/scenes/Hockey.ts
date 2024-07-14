import { Game, GameObjects, Geom, Math, Physics, Scene, Types } from 'phaser';
import { BLOCK_AMOUNT, BLUE_LINE_X_OFFSET, CIRCLE_RADIUS, CORNER_D, CORNER_DRAW_R, DEGREE_90, DEGREE_180, DEGREE_270, DEGREE_360, FACE_OFF_SPOT_SIZE, GOALIE_HALF_CIRCLE_RADIUS, ICE_ALPHA, ICE_BLUE, ICE_RED, NET_LINE_X_OFFSET, NET_COLOR, NET_SIZE, PUCK_IMG_SIZE, PUCK_RADIUS, RADIAL_BLOCK_SHIFT, SIZE_X, SIZE_Y } from '../constants';

export class Hockey3 extends Scene {
    private goalLineLeft = new Geom.Line(-NET_LINE_X_OFFSET - 2, -NET_SIZE + 3, -NET_LINE_X_OFFSET - 2, NET_SIZE - 3);
    private goalLineRight = new Geom.Line(NET_LINE_X_OFFSET + 2, -NET_SIZE + 3, NET_LINE_X_OFFSET + 2, NET_SIZE - 3);
    private puck!: Types.Physics.Arcade.ImageWithDynamicBody;

    constructor() {
        super({ physics: { arcade: { debug: false }, matter: { debug: true } } });
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

        this.add.image(-SIZE_X / 2, -SIZE_Y / 2, 'rink').setOrigin(0, 0);

        const graphicsBlue = this.add.graphics({ fillStyle: { color: ICE_BLUE, alpha: ICE_ALPHA } }).lineStyle(4, ICE_BLUE, ICE_ALPHA);
        const graphicsRed = this.add.graphics({ fillStyle: { color: ICE_RED, alpha: ICE_ALPHA } }).lineStyle(4, ICE_RED, ICE_ALPHA);
        const graphicsBlack = this.add.graphics({ fillStyle: { color: ICE_RED, alpha: ICE_ALPHA } }).lineStyle(4, NET_COLOR);
        
        graphicsBlue
            .arc(0, 0, CIRCLE_RADIUS, 0, DEGREE_360).strokePath().fillCircle(0, 0, FACE_OFF_SPOT_SIZE)
            .lineBetween(-BLUE_LINE_X_OFFSET, -SIZE_Y / 2, -BLUE_LINE_X_OFFSET, SIZE_Y / 2)
            .lineBetween(BLUE_LINE_X_OFFSET, -SIZE_Y / 2, BLUE_LINE_X_OFFSET, SIZE_Y / 2);

        graphicsRed
            // outter shape
            .arc(CORNER_D - SIZE_X / 2 - 8, CORNER_D - SIZE_Y / 2 - 8, CORNER_DRAW_R, DEGREE_180, DEGREE_270)
            .arc(SIZE_X / 2 - CORNER_D + 8, CORNER_D - SIZE_Y / 2 - 8, CORNER_DRAW_R, DEGREE_270, DEGREE_360)
            .arc(SIZE_X / 2 - CORNER_D + 8, SIZE_Y / 2 - CORNER_D + 8, CORNER_DRAW_R, 0, DEGREE_90)
            .arc(CORNER_D - SIZE_X / 2 - 8, SIZE_Y / 2 - CORNER_D + 8, CORNER_DRAW_R, DEGREE_90, DEGREE_180)
            .arc(CORNER_D - SIZE_X / 2 - 8, CORNER_D - SIZE_Y / 2 - 8, CORNER_DRAW_R, DEGREE_180, DEGREE_180)
            .strokePath()
            // red lines
            .lineBetween(0, -SIZE_Y / 2, 0, -CIRCLE_RADIUS - 2)
            .lineBetween(0, -CIRCLE_RADIUS + 2, 0, -FACE_OFF_SPOT_SIZE)
            .lineBetween(0, CIRCLE_RADIUS - 2, 0, FACE_OFF_SPOT_SIZE)
            .lineBetween(0, CIRCLE_RADIUS + 2, 0, SIZE_Y / 2)
            .lineBetween(-NET_LINE_X_OFFSET, -SIZE_Y / 2 + 15, -NET_LINE_X_OFFSET, SIZE_Y / 2 - 15)
            .lineBetween(NET_LINE_X_OFFSET, -SIZE_Y / 2 + 15, NET_LINE_X_OFFSET, SIZE_Y / 2 - 15)
            // goalie half circles
            .beginPath().arc(-NET_LINE_X_OFFSET + 2, 0, GOALIE_HALF_CIRCLE_RADIUS, DEGREE_270, DEGREE_90).strokePath()
            .beginPath().arc(NET_LINE_X_OFFSET - 2, 0, GOALIE_HALF_CIRCLE_RADIUS, DEGREE_90, DEGREE_270).strokePath()
            // middle zone face-off spots
            .fillCircle(-BLUE_LINE_X_OFFSET + SIZE_X / 30, -SIZE_Y / 4, FACE_OFF_SPOT_SIZE)
            .fillCircle(BLUE_LINE_X_OFFSET - SIZE_X / 30, -SIZE_Y / 4, FACE_OFF_SPOT_SIZE)
            .fillCircle(-BLUE_LINE_X_OFFSET + SIZE_X / 30, SIZE_Y / 4, FACE_OFF_SPOT_SIZE)
            .fillCircle(BLUE_LINE_X_OFFSET - SIZE_X / 30, SIZE_Y / 4, FACE_OFF_SPOT_SIZE);

        graphicsBlack
            // left net
            .lineBetween(-NET_LINE_X_OFFSET - 2, -NET_SIZE, -NET_LINE_X_OFFSET - 16, -NET_SIZE + 4)
            .lineBetween(-NET_LINE_X_OFFSET - 2, NET_SIZE, -NET_LINE_X_OFFSET - 16, NET_SIZE - 4)
            .lineBetween(-NET_LINE_X_OFFSET - 16, -NET_SIZE + 3, -NET_LINE_X_OFFSET - 16, NET_SIZE - 3)
            // right net
            .lineBetween(NET_LINE_X_OFFSET + 2, -NET_SIZE, NET_LINE_X_OFFSET + 16, -NET_SIZE + 4)
            .lineBetween(NET_LINE_X_OFFSET + 2, NET_SIZE, NET_LINE_X_OFFSET + 16, NET_SIZE - 4)
            .lineBetween(NET_LINE_X_OFFSET + 16, -NET_SIZE + 3, NET_LINE_X_OFFSET + 16, NET_SIZE - 3)
            

        drawRedFaceOffCircle(graphicsRed, -SIZE_X / 3.2, -SIZE_Y / 4);
        drawRedFaceOffCircle(graphicsRed, -SIZE_X / 3.2, SIZE_Y / 4);
        drawRedFaceOffCircle(graphicsRed, SIZE_X / 3.2, -SIZE_Y / 4);
        drawRedFaceOffCircle(graphicsRed, SIZE_X / 3.2, SIZE_Y / 4);

        this.puck = this.physics.add.image(0, 0, 'puck')
            .setScale(PUCK_RADIUS / PUCK_IMG_SIZE * 2)
            .setCircle(PUCK_IMG_SIZE / 2)
            .setVelocity(-200, -80)
            .setBounce(0.8);

        this.physics.add.collider(this.puck, radialBorderGroup);
        this.physics.add.collider(this.puck, straightBorderGroup);
    }

    override update() {
        const puckPoint = new Geom.Point(this.puck.x, this.puck.y);
        if (Phaser.Geom.Intersects.PointToLine(puckPoint, this.goalLineLeft, 4)) {
           console.log('GOAL LEFT!');
        }

        if (Phaser.Geom.Intersects.PointToLine(puckPoint, this.goalLineRight, 4)) {
            console.log('GOAL RIGHT!');
        }

        console.log(this.puck.x, this.puck.y)
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

function drawRedFaceOffCircle(graphics: GameObjects.Graphics, x: number, y: number): void {
    graphics.beginPath()
        .arc(x, y, CIRCLE_RADIUS, 0, DEGREE_360)
        .strokePath()
        .fillCircle(x, y, FACE_OFF_SPOT_SIZE)
        .lineBetween(x - 10, y - CIRCLE_RADIUS, x - 10, y - CIRCLE_RADIUS - 12)
        .lineBetween(x + 10, y - CIRCLE_RADIUS, x + 10, y - CIRCLE_RADIUS - 12)
        .lineBetween(x - 10, y + CIRCLE_RADIUS, x - 10, y + CIRCLE_RADIUS + 12)
        .lineBetween(x + 10, y + CIRCLE_RADIUS, x + 10, y + CIRCLE_RADIUS + 12);
}

export const startHockey = (parent: string) => new Game({ ...config, parent });