export enum CommonObjective {
    CatchPuck,
    MoveToPosition,
    MoveWithPuckToPosition,
    GivePass,
    TakePass,
    Checking,
    Dribble,
    GoAroundOpponent,
    Proceed,
}

export enum Position { G, LD, RD, LW, RW, C }

export interface PlayerConfig {
    x: number;
    y: number;
    title: string;
    position: Position;
    velocity: number;
    shooting: number;
    dribbling: number;
    shotBlocking: number;
    currentObjective?: CommonObjective;
    isLeftSide?: boolean;
}

export interface TeamConfig {
    color: number;
    playerConfigs: PlayerConfig[];
    isLeftSide?: boolean;
}

export interface NetPoints {
    y: number; // middle of net y-value
    yl: number; // left border y-value
    yr: number; // right border y-value
    x: number; // x-value is the same for y, yl and yr 
}