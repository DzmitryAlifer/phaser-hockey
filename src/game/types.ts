export enum CommonObjective {
    CatchPuck,
    MoveToPosition,
    MoveWithPuckToPosition,
    GivePass,
    TakePass,
}

export enum Position { G, LD, RD, LW, RW, C }

export interface PlayerConfig {
    x: number;
    y: number;
    title: string;
    position: Position;
    velocity: number;
    shooting: number;
    currentObjective?: CommonObjective;
    isLeftSide?: boolean;
}

export interface TeamConfig {
    color: number;
    playerConfigs: PlayerConfig[];
    isLeftSide?: boolean;
} 