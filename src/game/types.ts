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
}

export interface TeamConfig {
    color: number;
    playerConfigs: PlayerConfig[];
    isLeftSide?: boolean;
} 