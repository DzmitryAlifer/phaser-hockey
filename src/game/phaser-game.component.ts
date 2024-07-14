import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import Phaser from 'phaser';
import { Events } from 'phaser';
import { Hockey, hockeyScene, startHockey } from './scenes/Hockey';

@Component({
    selector: 'phaser-game',
    template: `
        <button mat-raised-button (click)="restart()">Restart</button>
        <div id="game-container"></div>
    `,
    imports: [MatButtonModule],
    standalone: true,
})
export class PhaserGame implements OnInit, OnDestroy {
    scene: Phaser.Scene;
    hockey: Phaser.Game = startHockey('game-container');
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

    restart(): void {
        hockeyScene?.restart();
    }

    ngOnDestroy() {
        this.hockey.destroy(true);
    }
}
