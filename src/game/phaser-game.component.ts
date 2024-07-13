import { Component, OnDestroy, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { Events } from 'phaser';
import { startHockey1 } from './scenes/Hockey1';
import { startHockey2 } from './scenes/Hockey2';
import { startHockey3 } from './scenes/Hockey3';

@Component({
    selector: 'phaser-game',
    template: '<div id="game-container"></div>',
    standalone: true,
})
export class PhaserGame implements OnInit, OnDestroy {
    scene: Phaser.Scene;
    hockey: Phaser.Game = startHockey3('game-container');
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
        this.hockey.destroy(true);
    }
}
