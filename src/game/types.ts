export enum CommonObjective {
    CatchPuck,
    GivePass,
    TakePass,
}

export interface PlayerConfig {
    x: number;
    y: number;
    title: string;
    velocity: number;
    currentObjective?: CommonObjective;
    isLeftSide?: boolean;
}

export interface TeamConfig {
    color: number;
    playerConfigs: PlayerConfig[];
    isLeftSide?: boolean;
} 