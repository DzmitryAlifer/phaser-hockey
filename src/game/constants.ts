import { Math } from 'phaser';

export const PUCK_RADIUS = 4;
export const PUCK_IMG_SIZE = 32;
export const SIZE_Y = 400;
export const SIZE_X = SIZE_Y * 2;
export const CORNER_R = SIZE_X / 14.5;
export const CORNER_D = CORNER_R * 2;
export const CORNER_DRAW_R = SIZE_Y / 3.81;
export const CIRCLE_RADIUS = SIZE_X / 13;
export const BORDER_BLOCK_RADIUS = 16;
export const RADIAL_BLOCK_SHIFT = CORNER_D - BORDER_BLOCK_RADIUS;
export const NET_LINE_X_OFFSET = SIZE_X / 2 - SIZE_X / 15;
export const GOALIE_HALF_CIRCLE_RADIUS = CIRCLE_RADIUS / 2;
export const NET_SIZE = GOALIE_HALF_CIRCLE_RADIUS * 0.8;
export const BLUE_LINE_X_OFFSET = SIZE_X / 8;
export const FACE_OFF_SPOT_SIZE = 5;
export const BLOCK_AMOUNT = 64;

export const DEGREE_90 = Math.DegToRad(90);
export const DEGREE_180 = Math.DegToRad(180);
export const DEGREE_270 = Math.DegToRad(270);
export const DEGREE_360 = Math.DegToRad(360);

export const NET_COLOR = 0x333333;
export const ICE_RED = 0xdd0000;
export const ICE_BLUE = 0x0000dd;
export const ICE_ALPHA = 0.25;