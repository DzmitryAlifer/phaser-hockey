import { Geom, Physics, Types } from 'phaser';
import { LEFT_NET_POINT, RIGHT_NET_POINT } from './constants';
import { CommonObjective, Position } from './types';
import { POSITION_OFFENSIVE } from './position';

function isWorthShooting(player: Types.Physics.Arcade.SpriteWithDynamicBody): boolean {
    return scoringChance(player) > 0.1;
}

function scoringChance(player: Types.Physics.Arcade.SpriteWithDynamicBody): number {
    const shooting = player.getData('shooting');
    const netPoint = player.getData('isLeftSide') ? RIGHT_NET_POINT : LEFT_NET_POINT;
    const distance = Phaser.Math.Distance.Between(player.x, player.y, netPoint.x, netPoint.y);

    return shooting / distance;
}

function isWorthPassing(player: Types.Physics.Arcade.SpriteWithDynamicBody, players: Types.Physics.Arcade.SpriteWithDynamicBody[]): boolean {
    const partner = getPlayerInBestPosition(players);
    return !!partner && partner.getData('title') !== player.getData('title');
}

function getPlayerInBestPosition(players: Types.Physics.Arcade.SpriteWithDynamicBody[]): Types.Physics.Arcade.SpriteWithDynamicBody | undefined {
    return players.reduce((acc, player) => scoringChance(player) > scoringChance(acc) ? player : acc, players.at(0)!);
}

function isWorthMovingWithPuck(player: Types.Physics.Arcade.SpriteWithDynamicBody): boolean {
    return !isOnPosition(player);
}

function isOnPosition(player: Types.Physics.Arcade.SpriteWithDynamicBody): boolean {
    const position = player.getData('position') as Position;
    const positionRect = POSITION_OFFENSIVE.get(position);

    return Geom.Rectangle.Contains(positionRect!, player.x, player.y);
}

function shoot(
    physics: Physics.Arcade.ArcadePhysics,
    player: Types.Physics.Arcade.SpriteWithDynamicBody,
    puck: Types.Physics.Arcade.ImageWithDynamicBody
): void {
    puck.setData({ owner: null });
    const { x, y } = player.getData('isLeftSide') ? RIGHT_NET_POINT : LEFT_NET_POINT;
    const shooting = player.getData('shooting');
    physics.moveTo(puck, x, y, shooting * 5);
    player.setData({ currentObjective: null });
}

export function findPassCandidate(
    playerWithPuck: Types.Physics.Arcade.SpriteWithDynamicBody,
    players: Types.Physics.Arcade.SpriteWithDynamicBody[]
): Types.Physics.Arcade.SpriteWithDynamicBody | undefined {
    const teamPlayers = players.filter(player => player !== playerWithPuck && player.getData('isLeftSide') === playerWithPuck.getData('isLeftSide'));
    const randomIndex = Math.floor(Math.random() * teamPlayers.length);

    return teamPlayers.at(randomIndex);
}

export function pass(
    physics: Physics.Arcade.ArcadePhysics,
    puck: Types.Physics.Arcade.ImageWithDynamicBody,
    playerWithPuck: Types.Physics.Arcade.SpriteWithDynamicBody,
    targetPlayer: Types.Physics.Arcade.SpriteWithDynamicBody
): void {
    if (playerWithPuck.getData('title') === targetPlayer.getData('title')) return;
    const { x, y } = targetPlayer.getData('stick');
    targetPlayer.setData({ currentObjective: CommonObjective.TakePass });
    puck.setData({ owner: null });
    physics.moveTo(puck, x, y, 500);
    playerWithPuck.setData({ currentObjective: null });
}

function moveWithPuck(
    physics: Physics.Arcade.ArcadePhysics,
    player: Types.Physics.Arcade.SpriteWithDynamicBody,
    puck: Types.Physics.Arcade.ImageWithDynamicBody
): void {
   
}

export function runAttack(
    physics: Physics.Arcade.ArcadePhysics,
    player: Types.Physics.Arcade.SpriteWithDynamicBody,
    players: Types.Physics.Arcade.SpriteWithDynamicBody[],
    puck: Types.Physics.Arcade.ImageWithDynamicBody
): void {
    if (isWorthShooting(player)) {
        shoot(physics, player, puck);
    } else if (isWorthPassing(player, players)) {
        const targetPlayer = findPassCandidate(player, players)!;
        pass(physics, puck, player, targetPlayer);
    } else if (isWorthMovingWithPuck(player)) {
        moveWithPuck(physics, player, puck);
    } else {
        shoot(physics, player, puck);
    }
}

