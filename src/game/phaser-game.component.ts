import { Component, OnDestroy, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { Events } from 'phaser';
import { startHockey } from './scenes/Hockey';
import { startTutorial } from './scenes/Tutorial';

@Component({
    selector: 'phaser-game',
    template: '<div id="game-container"></div>',
    standalone: true,
})
export class PhaserGame implements OnInit, OnDestroy {
    scene: Phaser.Scene;
    tutorial: Phaser.Game = startTutorial('game-container');
    // hockey: Phaser.Game = startHockey('game-container');
    eventBus = new Events.EventEmitter();

    sceneCallback: (scene: Phaser.Scene) => void;

    ngOnInit() {
        this.eventBus.on('current-scene-ready', (scene: Phaser.Scene) => {
            this.scene = scene;
            if (this.sceneCallback) {
                this.sceneCallback(scene);
            }
        });
    }

    ngOnDestroy() {
        this.tutorial.destroy(true);
        // this.hockey.destroy(true);
    }
}
