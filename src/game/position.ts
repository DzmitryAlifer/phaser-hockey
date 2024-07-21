import { Geom } from 'phaser';
import { BLUE_LINE_X_OFFSET, GOALIE_HALF_CIRCLE_RADIUS, HALF_ZONE_OFFSET, NET_LINE_X_OFFSET, SIZE_Y } from './constants';
import { Position } from './types';

export const POSITION_OFFENSIVE = new Map<Position, Geom.Rectangle>([
    [Position.LD, new Geom.Rectangle(BLUE_LINE_X_OFFSET, 0, HALF_ZONE_OFFSET, -SIZE_Y / 2)],
    [Position.RD, new Geom.Rectangle(BLUE_LINE_X_OFFSET, 0, HALF_ZONE_OFFSET, SIZE_Y / 2)],
    [Position.LW, new Geom.Rectangle(NET_LINE_X_OFFSET, 0, HALF_ZONE_OFFSET, -SIZE_Y / 2)],
    [Position.RW, new Geom.Rectangle(NET_LINE_X_OFFSET, 0, HALF_ZONE_OFFSET, SIZE_Y / 2)],
    [Position.C, new Geom.Rectangle(NET_LINE_X_OFFSET - GOALIE_HALF_CIRCLE_RADIUS, -SIZE_Y / 6, HALF_ZONE_OFFSET, SIZE_Y / 6)],
]);