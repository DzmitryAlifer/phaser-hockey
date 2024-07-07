import { Component, OnDestroy, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { Events } from 'phaser';
import { StartGame } from './main';

@Component({
    selector: 'phaser-game',
    template: '<div id="game-container"></div>',
    standalone: true,
})
export class PhaserGame implements OnInit, OnDestroy {
    scene: Phaser.Scene;
    game: Phaser.Game;
    eventBus = new Events.EventEmitter();

    sceneCallback: (scene: Phaser.Scene) => void;

    ngOnInit() {
        this.game = StartGame('game-container');
        this.eventBus.on('current-scene-ready', (scene: Phaser.Scene) => {
            this.scene = scene;
            if (this.sceneCallback) {
                this.sceneCallback(scene);
            }
        });
    }

    ngOnDestroy() {
        this.game.destroy(true);
    }
}
