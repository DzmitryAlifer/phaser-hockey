import { Types } from 'phaser';
import { LEFT_NET_POINT, RIGHT_NET_POINT } from './constants';

function isWorthShooting(player: Types.Physics.Arcade.SpriteWithDynamicBody): boolean {
    return scoringChance(player) > 0.1;
}

function scoringChance(player: Types.Physics.Arcade.SpriteWithDynamicBody): number {
    const shooting = player.getData('shooting');
    const netPoint = player.getData('isLeftSide') ? RIGHT_NET_POINT : LEFT_NET_POINT;
    const distance = Phaser.Math.Distance.Between(player.x, player.y, netPoint.x, netPoint.y);

    return shooting / distance
}

function isWorthPassing(player: Types.Physics.Arcade.SpriteWithDynamicBody, players: Types.Physics.Arcade.SpriteWithDynamicBody[]): boolean {
    const partner = getPlayerInBestPosition(player, players);
    return !!partner && partner.getData('title') !== player.getData('title');
}

function getPlayerInBestPosition(
    player: Types.Physics.Arcade.SpriteWithDynamicBody,
    players: Types.Physics.Arcade.SpriteWithDynamicBody[]
): Types.Physics.Arcade.SpriteWithDynamicBody | undefined {
    return players.reduce((acc, player) => scoringChance(player) > scoringChance(acc) ? player : acc, players.at(0)!);
}

function isWorthMovingWithPuck(player: Types.Physics.Arcade.SpriteWithDynamicBody): boolean {
    return !isOnPosition(player);
}

function isOnPosition(player: Types.Physics.Arcade.SpriteWithDynamicBody): boolean {
    return false;
}
