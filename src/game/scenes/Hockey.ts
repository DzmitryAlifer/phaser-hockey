import { Game, GameObjects, Geom, Physics, Scene, Scenes, Types } from 'phaser';
import { BLOCK_AMOUNT, BLUE_LINE_X_OFFSET, CIRCLE_RADIUS, CORNER_D, CORNER_DRAW_R, DEGREE_90, DEGREE_180, DEGREE_270, DEGREE_360, FACE_OFF_SPOT_SIZE, GOALIE_HALF_CIRCLE_RADIUS, ICE_ALPHA, ICE_BLUE, ICE_RED, NET_LINE_X_OFFSET, NET_COLOR, NET_DEPTH, NET_HALF_WIDTH, NET_WIDTH, PUCK_DIAMETER, PUCK_IMG_SIZE, PUCK_RADIUS, RADIAL_BLOCK_SHIFT, SIZE_X, SIZE_Y, BORDER_BLOCK_RADIUS, PLAYER_SIZE, PLAYER_TITLE_STYLE } from '../constants';

enum CommonObjective {
    CatchPuck,
    Pass,
}

enum OffensiveObjective {
    Puck
}

enum DefensiveObjective {
    Puck
}

export let hockeyScene: Scenes.ScenePlugin;
let velocityX = 0;
let velocityY = 0;

export class Hockey extends Scene {
    private readonly goalLineLeft = new Geom.Line(-NET_LINE_X_OFFSET - 2, -NET_HALF_WIDTH + 3, -NET_LINE_X_OFFSET - 2, NET_HALF_WIDTH - 3);
    private readonly goalLineRight = new Geom.Line(NET_LINE_X_OFFSET + 2, -NET_HALF_WIDTH + 3, NET_LINE_X_OFFSET + 2, NET_HALF_WIDTH - 3);
    private puck!: Types.Physics.Arcade.ImageWithDynamicBody;
    private players!: Types.Physics.Arcade.SpriteWithDynamicBody[];
    private playerTitles!: GameObjects.Text[];

    constructor() {
        super({ physics: { arcade: { debug: false }, matter: { debug: true } } });
    }

    preload() {
        this.load.image('rink', 'assets/rink_texture.jpg');
        this.load.image('puck', 'assets/puck.png');
        this.load.image('net', 'assets/net2.png');
        this.load.image('player', 'assets/player-idle.png');
        hockeyScene = this.scene;
        this.load.atlas('hockey-player', 'assets/hockey-player-sprites.png', 'assets/hockey-player.json');
    }

    create() {
        this.cameras.main.centerOn(0, 0);
        createPlayerSkatingAnimation(this.anims);

        // PHYSICS - Immovable
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
        radialBorderGroup.getChildren().forEach(({ body }) => (body as any).setCircle(BORDER_BLOCK_RADIUS).setImmovable(true));

        const netGroup = this.physics.add.group({ defaultKey: 'nets' });
        const leftNet = this.add.rectangle(-NET_LINE_X_OFFSET - PUCK_DIAMETER - NET_DEPTH / 2, 0, NET_DEPTH - PUCK_DIAMETER, NET_WIDTH);
        const rightNet = this.add.rectangle(NET_LINE_X_OFFSET + PUCK_DIAMETER + NET_DEPTH / 2, 0, NET_DEPTH - PUCK_DIAMETER, NET_WIDTH);
        netGroup.add(leftNet).add(rightNet);
        netGroup.getChildren().forEach(({ body }) => (body as any).setImmovable(true));


        // DRAWING
        const rinkImage = this.add.image(-SIZE_X / 2, -SIZE_Y / 2, 'rink').setOrigin(0, 0);

        const graphicsBlue = this.add.graphics({ fillStyle: { color: ICE_BLUE, alpha: ICE_ALPHA } }).lineStyle(4, ICE_BLUE, ICE_ALPHA);
        const graphicsRed = this.add.graphics({ fillStyle: { color: ICE_RED, alpha: ICE_ALPHA } }).lineStyle(4, ICE_RED, ICE_ALPHA);
        const graphicsNets = this.add.graphics({ fillStyle: { color: ICE_RED, alpha: ICE_ALPHA } }).lineStyle(4, NET_COLOR);
        
        graphicsBlue
            .arc(0, 0, CIRCLE_RADIUS, 0, DEGREE_360).strokePath().fillCircle(0, 0, FACE_OFF_SPOT_SIZE)
            .lineBetween(-BLUE_LINE_X_OFFSET, -SIZE_Y / 2 + 3, -BLUE_LINE_X_OFFSET, SIZE_Y / 2 - 3)
            .lineBetween(BLUE_LINE_X_OFFSET, -SIZE_Y / 2 + 3, BLUE_LINE_X_OFFSET, SIZE_Y / 2 - 3);

        drawFieldArc(graphicsRed)
            // red lines
            .lineBetween(0, -SIZE_Y / 2 + 3, 0, -CIRCLE_RADIUS - 2)
            .lineBetween(0, -CIRCLE_RADIUS + 2, 0, -FACE_OFF_SPOT_SIZE)
            .lineBetween(0, CIRCLE_RADIUS - 2, 0, FACE_OFF_SPOT_SIZE)
            .lineBetween(0, CIRCLE_RADIUS + 2, 0, SIZE_Y / 2 - 3)
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

        graphicsNets
            // left net
            .lineBetween(-NET_LINE_X_OFFSET, -NET_HALF_WIDTH, -NET_LINE_X_OFFSET - NET_DEPTH, -NET_HALF_WIDTH + 3)
            .lineBetween(-NET_LINE_X_OFFSET, NET_HALF_WIDTH, -NET_LINE_X_OFFSET - NET_DEPTH, NET_HALF_WIDTH - 3)
            .lineBetween(-NET_LINE_X_OFFSET - NET_DEPTH, -NET_HALF_WIDTH + 3, -NET_LINE_X_OFFSET - NET_DEPTH, NET_HALF_WIDTH - 3)
            .lineBetween(-NET_LINE_X_OFFSET, -NET_HALF_WIDTH, -NET_LINE_X_OFFSET, NET_HALF_WIDTH)
            // right net
            .lineBetween(NET_LINE_X_OFFSET + 2, -NET_HALF_WIDTH, NET_LINE_X_OFFSET + NET_DEPTH, -NET_HALF_WIDTH + 3)
            .lineBetween(NET_LINE_X_OFFSET + 2, NET_HALF_WIDTH, NET_LINE_X_OFFSET + NET_DEPTH, NET_HALF_WIDTH - 3)
            .lineBetween(NET_LINE_X_OFFSET + NET_DEPTH, -NET_HALF_WIDTH + 3, NET_LINE_X_OFFSET + NET_DEPTH, NET_HALF_WIDTH - 3)
            .lineBetween(NET_LINE_X_OFFSET, NET_HALF_WIDTH, NET_LINE_X_OFFSET, -NET_HALF_WIDTH);

        drawRedFaceOffCircle(graphicsRed, -SIZE_X / 3.2, -SIZE_Y / 4);
        drawRedFaceOffCircle(graphicsRed, -SIZE_X / 3.2, SIZE_Y / 4);
        drawRedFaceOffCircle(graphicsRed, SIZE_X / 3.2, -SIZE_Y / 4);
        drawRedFaceOffCircle(graphicsRed, SIZE_X / 3.2, SIZE_Y / 4);

        const fieldMask = drawFieldArc(this.add.graphics()).fillPath().createGeometryMask();
        rinkImage.setMask(fieldMask);


        // PHISICS - Movable
        this.puck = this.physics.add.image(0, 0, 'puck')
            .setScale(PUCK_RADIUS / PUCK_IMG_SIZE * 2)
            .setCircle(PUCK_IMG_SIZE / 2)
            .setVelocity(velocityX, velocityY)
            .setBounce(0.8);
        
        const player1 = this.physics.add.sprite(-200, 0, '');
        player1
            .setScale(0.8)
            .setCircle(PLAYER_SIZE, player1.width / 2 - 11, player1.height / 2 - 12)
            .setVelocity(velocityX / 2, velocityY / 2)
            .setBounce(0.4)
            .setData({ title: '1 PlayerA', currentObjective: CommonObjective.CatchPuck })
            .play('skating');
        
        const player2 = this.physics.add.sprite(-100, -100, '');
        player2
            .setScale(0.8)
            .setCircle(PLAYER_SIZE, player2.width / 2 - 11, player2.height / 2 - 12)
            // .setVelocity(velocityX / 3, velocityY / 3)
            .setBounce(0.4)
            .setData({ title: '2 PlayerB', currentObjective: CommonObjective.Pass })
            .play('skating');

        this.players = [player1, player2];

        this.playerTitles = this.players.map(player => this.add.text(player.x, player.y, player.getData('title'), PLAYER_TITLE_STYLE).setOrigin(0.5, -2));

        this.physics.add.collider(this.puck, radialBorderGroup);
        this.physics.add.collider(this.puck, straightBorderGroup);
        this.physics.add.collider(this.puck, netGroup);
    }

    override update() {
        this.players.forEach((player, i) => {
            this.playerTitles.at(i)!.setPosition(player.x, player.y);

            const currentObjective = player.getData('currentObjective');

            if (currentObjective === CommonObjective.CatchPuck) {
                if (Phaser.Math.Distance.Between(player.x, player.y, this.puck.x, this.puck.y) > 25) {
                    player.setRotation(Math.atan2(this.puck.y - player.y, this.puck.x - player.x));
                    this.physics.moveTo(player, this.puck.x, this.puck.y, 50);
                } else {
                    player.setVelocity(0);
                    this.puck.setVelocity(0);
                    player.setData({ hasPuck: true });
                }
            }
        });
        

        const isScoreToLeftNet = Geom.Intersects.PointToLine(new Geom.Point(this.puck.x + PUCK_RADIUS / 2, this.puck.y), this.goalLineLeft, PUCK_RADIUS);
        const isScoreToRightNet = Geom.Intersects.PointToLine(new Geom.Point(this.puck.x - PUCK_RADIUS / 2, this.puck.y), this.goalLineRight, PUCK_RADIUS);

        if (isScoreToLeftNet) {
            console.log('GOAL LEFT!');
        }

        if (isScoreToRightNet) {
            console.log('GOAL RIGHT!');
        }

        if (isScoreToLeftNet || isScoreToRightNet) {
            this.puck.setVelocity(0, 0);
        }
    }

    restart(): void {
        this.scene.restart();
    }
}

const config = {
    type: Phaser.AUTO,
    width: SIZE_X + 100,
    height: SIZE_Y + 100,
    scene: Hockey,
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: { x: 0, y: 200 }
        }
    }
};

function createRadialBorder(group: Physics.Arcade.Group, x: number, y: number, startAngle: number): void {
    const borderBlock = group.createMultiple({ quantity: BLOCK_AMOUNT, key: group.defaultKey, frame: 0, visible: false });
    Phaser.Actions.PlaceOnCircle(borderBlock, { x, y, radius: CORNER_D } as Geom.Circle, Phaser.Math.DegToRad(startAngle), Phaser.Math.DegToRad(startAngle + 90));
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

function drawFieldArc(graphics: GameObjects.Graphics): GameObjects.Graphics {
    return graphics
        .arc(CORNER_D - SIZE_X / 2 - 8, CORNER_D - SIZE_Y / 2 - 8, CORNER_DRAW_R, DEGREE_180, DEGREE_270)
        .arc(SIZE_X / 2 - CORNER_D + 8, CORNER_D - SIZE_Y / 2 - 8, CORNER_DRAW_R, DEGREE_270, DEGREE_360)
        .arc(SIZE_X / 2 - CORNER_D + 8, SIZE_Y / 2 - CORNER_D + 8, CORNER_DRAW_R, 0, DEGREE_90)
        .arc(CORNER_D - SIZE_X / 2 - 8, SIZE_Y / 2 - CORNER_D + 8, CORNER_DRAW_R, DEGREE_90, DEGREE_180)
        .arc(CORNER_D - SIZE_X / 2 - 8, CORNER_D - SIZE_Y / 2 - 8, CORNER_DRAW_R, DEGREE_180, DEGREE_180)
        .strokePath();
}

function createPlayerSkatingAnimation(anims: Phaser.Animations.AnimationManager): void {
    const frames = anims.generateFrameNames('hockey-player', { prefix: 'skating/frame', start: 0, end: 8, zeroPad: 2 });
    anims.create({ key: 'skating', frames, frameRate: 3, repeat: -1 });
}

export const startHockey = (parent: string, velX: number, velY: number) => {
    return new Game({ ...config, parent });
};

export const restartHockey = (velX: number, velY: number) => {
    velocityX = velX;
    velocityY = velY;
    hockeyScene.restart();
};