import { Geom, Physics, Types } from 'phaser';
import { LEFT_NET_POINTS, PLAYER_SIZE, RIGHT_NET_POINTS } from './constants';
import { CommonObjective, Position } from './types';
import { POSITION_OFFENSIVE } from './position';

function isWorthShooting(
    player: Types.Physics.Arcade.SpriteWithDynamicBody,
    players: Types.Physics.Arcade.SpriteWithDynamicBody[]
): boolean {
    return scoringChance(player, players) > 0.5;
}

function scoringChance(
    player: Types.Physics.Arcade.SpriteWithDynamicBody,
    players: Types.Physics.Arcade.SpriteWithDynamicBody[]
): number {
    const shooting = player.getData('shooting');
    const isLeftSide = player.getData('isLeftSide');
    const netPoints = isLeftSide ? RIGHT_NET_POINTS : LEFT_NET_POINTS;
    const distance = Phaser.Math.Distance.Between(player.x, player.y, netPoints.x, netPoints.y);
    const shootingAngle = Phaser.Math.Angle.Between(player.x, player.y, netPoints.x, netPoints.y);
    const shootingAngleRatio = Math.max(1 - shootingAngle / 100, 0.1);

    const oppositeTeam = players.filter(player => player.getData('isLeftSide') !== isLeftSide);
    const sightLineNetCenter = new Geom.Line(player.x, player.y, netPoints.x, netPoints.y);
    const sightLineNetLeftPost = new Geom.Line(player.x, player.y, netPoints.x, netPoints.yl);
    const sightLineNetRightPost = new Geom.Line(player.x, player.y, netPoints.x, netPoints.yr);
    const cannotSeeNetCenter = isNetPartBlocked(sightLineNetCenter, oppositeTeam);
    const cannotSeeNetLeftPost = isNetPartBlocked(sightLineNetLeftPost, oppositeTeam);
    const cannotSeeNetRightPost = isNetPartBlocked(sightLineNetRightPost, oppositeTeam);
    const netVisibility = 1 - 0.3 * (+cannotSeeNetCenter + +cannotSeeNetLeftPost + +cannotSeeNetRightPost);

    return shooting * shootingAngleRatio * netVisibility / distance;
}

function isNetPartBlocked(sightLine: Geom.Line, oppositeTeam: Types.Physics.Arcade.SpriteWithDynamicBody[]): boolean {
    return oppositeTeam.some(oppositePlayer => {
        const { center, radius } = oppositePlayer.body as Physics.Arcade.Body;
        const oppositePlayerCircle = new Geom.Circle(center.x, center.y, radius);
        
        return Geom.Intersects.GetLineToCircle(sightLine, oppositePlayerCircle);
    })
}

function isWorthPassing(player: Types.Physics.Arcade.SpriteWithDynamicBody, players: Types.Physics.Arcade.SpriteWithDynamicBody[]): boolean {
    const partner = getPlayerInBestPosition(players);
    if (!partner) return false;
    const isCurrentPlayerInBestShootingPosition = partner.getData('title') === player.getData('title');

    return !isCurrentPlayerInBestShootingPosition && scoringChance(player, players) * 1.2 < scoringChance(partner, players);
}

function getPlayerInBestPosition(players: Types.Physics.Arcade.SpriteWithDynamicBody[]): Types.Physics.Arcade.SpriteWithDynamicBody | undefined {
    return players.reduce((acc, player) => scoringChance(player, players) > scoringChance(acc, players) ? player : acc, players.at(0)!);
}

function isWorthMovingWithPuck(player: Types.Physics.Arcade.SpriteWithDynamicBody, players: Types.Physics.Arcade.SpriteWithDynamicBody[]): boolean {
    return !isOnPosition(player) && !isOpponentInFront(player, players);
}

function isOnPosition(player: Types.Physics.Arcade.SpriteWithDynamicBody): boolean {
    const position = player.getData('position') as Position;
    const positionRect = POSITION_OFFENSIVE.get(position);

    return Geom.Rectangle.Contains(positionRect!, player.x, player.y);
}

function isOpponentInFront(player: Types.Physics.Arcade.SpriteWithDynamicBody, players: Types.Physics.Arcade.SpriteWithDynamicBody[]): boolean {
    const isLeftSide = player.getData('isLeftSide');
    const oppositeTeam = players.filter(player => player.getData('isLeftSide') !== isLeftSide)
    
    const closestOpponent = oppositeTeam.find(opponent => {
        const distance = Phaser.Math.Distance.Between(player.x, player.y, opponent.x, opponent.y);
        return distance < 4 * PLAYER_SIZE;
    });

    if (closestOpponent) {
        player.setData({ closestOpponentX: closestOpponent.x, closestOpponentY: closestOpponent.y });
    }

    return !!closestOpponent;
}

function shoot(
    physics: Physics.Arcade.ArcadePhysics,
    player: Types.Physics.Arcade.SpriteWithDynamicBody,
    puck: Types.Physics.Arcade.ImageWithDynamicBody
): void {
    const { x, y } = player.getData('isLeftSide') ? RIGHT_NET_POINTS : LEFT_NET_POINTS;
    const shooting = player.getData('shooting');
    physics.moveTo(puck, x, y, shooting * 5);
    puck.setData({ owner: null });
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
    playerWithPuck.setData({ currentObjective: CommonObjective.MoveToPosition });
}

export function runAttack(
    physics: Physics.Arcade.ArcadePhysics,
    player: Types.Physics.Arcade.SpriteWithDynamicBody,
    players: Types.Physics.Arcade.SpriteWithDynamicBody[],
    puck: Types.Physics.Arcade.ImageWithDynamicBody
): void {
    if (puck.getData('owner') !== player.getData('title') || player.getData('currentObjective') === CommonObjective.Proceed) return;

    if (isWorthShooting(player, players)) {
        shoot(physics, player, puck);
    } else if (isWorthPassing(player, players)) {
        const targetPlayer = findPassCandidate(player, players)!;
        pass(physics, puck, player, targetPlayer);
        player.setData('currentObjective', CommonObjective.MoveToPosition);
    } else if (isOnPosition(player)) {
        shoot(physics, player, puck);
    } else if (isOpponentInFront(player, players)) {
        if (player.getData('dribbling') > 50) {
            player.setData({ currentObjective: CommonObjective.GoAroundOpponent });
        } else {
            shoot(physics, player, puck);
        }
    } else {
        player.setData('currentObjective', CommonObjective.MoveWithPuckToPosition);
    }
}

function getPlayerToPuckDistance(
    player: Types.Physics.Arcade.SpriteWithDynamicBody,
    puck: Types.Physics.Arcade.ImageWithDynamicBody
): number {
    return Phaser.Math.Distance.Between(player.x, player.y, puck.x, puck.y);
}

export function findPlayerClosestToPuck(
    players: Types.Physics.Arcade.SpriteWithDynamicBody[],
    puck: Types.Physics.Arcade.ImageWithDynamicBody
): Types.Physics.Arcade.SpriteWithDynamicBody {
    return players.reduce((closestPlayer, player) =>
        getPlayerToPuckDistance(player, puck) < getPlayerToPuckDistance(closestPlayer, puck) ? player : closestPlayer,
        players.at(0)!
    );
}

export function setPlayerStickPosition(player: Types.Physics.Arcade.SpriteWithDynamicBody): void {
    const stickAngle = Phaser.Math.DegToRad(player.angle + 62);
    const stickPosX = player.x + PLAYER_SIZE * 2.5 * Math.cos(stickAngle);
    const stickPosY = player.y + PLAYER_SIZE * 2.5 * Math.sin(stickAngle);
    player.setData({ stick: { x: stickPosX, y: stickPosY } });
}

export function catchPuck(
    physics: Physics.Arcade.ArcadePhysics,
    players: Types.Physics.Arcade.SpriteWithDynamicBody[],
    puck: Types.Physics.Arcade.ImageWithDynamicBody
): Types.Physics.Arcade.SpriteWithDynamicBody | null {
    const player = findPlayerClosestToPuck(players, puck);
    const isPuckTooFar = Phaser.Math.Distance.Between(player.x, player.y, puck.x, puck.y) > 35;
    const puckOwner = puck.getData('owner');
    const stickAngle = Phaser.Math.DegToRad(player.angle + 62);
    const stickPosX = player.x + PLAYER_SIZE * 2.5 * Math.cos(stickAngle);
    const stickPosY = player.y + PLAYER_SIZE * 2.5 * Math.sin(stickAngle);
    player.setData({ stick: { x: stickPosX, y: stickPosY } });

    if (isPuckTooFar && !puckOwner) {
        rotatePlayerToObject(player, puck);
        const velocity = player.getData('velocity');
        physics.moveTo(player, puck.x, puck.y, velocity);
        return null;
    } else if (!puckOwner) {
        puck.setVelocity(0)
            .setPosition(stickPosX, stickPosY)
            .setData({ owner: player.getData('title') });
        return player;
    }

    return null;
}

export function rotatePlayerToPoint(player: Types.Physics.Arcade.SpriteWithDynamicBody, x: number, y: number): void {
    player.setRotation(Math.atan2(y - player.y, x - player.x));
}

export function rotatePlayerToObject(player: Types.Physics.Arcade.SpriteWithDynamicBody, { x, y }: { x: number; y: number }): void {
    rotatePlayerToPoint(player, x, y);
}

