import { Math, Types } from 'phaser';
import { CommonObjective, TeamConfig } from './types';

export const PUCK_RADIUS = 4;
export const PUCK_DIAMETER = PUCK_RADIUS * 2;
export const PUCK_IMG_SIZE = 32;
export const SIZE_Y = 400;
export const SIZE_X = SIZE_Y * 2;
export const CORNER_R = SIZE_X / 14.5;
export const CORNER_D = CORNER_R * 2;
export const CORNER_DRAW_R = SIZE_Y / 3.95;
export const CIRCLE_RADIUS = SIZE_X / 13;
export const BORDER_BLOCK_RADIUS = 16;
export const RADIAL_BLOCK_SHIFT = CORNER_D - BORDER_BLOCK_RADIUS;
export const NET_LINE_X_OFFSET = SIZE_X / 2 - SIZE_X / 15;
export const GOALIE_HALF_CIRCLE_RADIUS = CIRCLE_RADIUS / 2;
export const NET_WIDTH = GOALIE_HALF_CIRCLE_RADIUS * 1.4;
export const NET_HALF_WIDTH = NET_WIDTH / 2;
export const LEFT_NET_POINT = { x: -NET_LINE_X_OFFSET, y: 0 };
export const RIGHT_NET_POINT = { x: NET_LINE_X_OFFSET, y: 0 };
export const NET_DEPTH = NET_HALF_WIDTH * 0.6;
export const BLUE_LINE_X_OFFSET = SIZE_X / 8;
export const FACE_OFF_SPOT_SIZE = 5;
export const BLOCK_AMOUNT = 12;

export const PLAYER_SIZE = 13;
export const PLAYER_TITLE_STYLE: Types.GameObjects.Text.TextStyle = {
    fontSize: 12,
    fontFamily: 'Arial',
    fontStyle: 'bold',
    color: '#000000'
};

export const DEGREE_90 = Math.DegToRad(90);
export const DEGREE_180 = Math.DegToRad(180);
export const DEGREE_270 = Math.DegToRad(270);
export const DEGREE_360 = Math.DegToRad(360);

export const NET_COLOR = 0x660000;
export const ICE_RED = 0x660000;
export const ICE_BLUE = 0x0000dd;
export const ICE_ALPHA = 0.25;

export const TEAMS: TeamConfig[] = [{
    color: 0x4488dd,
    isLeftSide: true,
    playerConfigs: [{
        title: 'TeamA - 1',
        x: -200,
        y: 0,
        velocity: 50,
        currentObjective: CommonObjective.CatchPuck,
        isLeftSide: true,
    }, {
        title: 'TeamA - 2',
        x: 300,
        y: 0,
        velocity: 10,
        currentObjective: CommonObjective.CatchPuck,
        isLeftSide: true,
    }, {
        title: 'TeamA - 3',
        x: 100,
        y: 150,
        velocity: 10,
        currentObjective: CommonObjective.CatchPuck,
        isLeftSide: true,
    }],
}, {
    color: 0xff6666,
    playerConfigs: [/*{
        title: 'TeamB - 1',
        x: 0,
        y: -200,
        velocity: 30,
        currentObjective: CommonObjective.CatchPuck,
    }*/],
}];