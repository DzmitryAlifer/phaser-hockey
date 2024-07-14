import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import Phaser from 'phaser';
import { Events } from 'phaser';
import { restartHockey, startHockey } from './scenes/Hockey';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'phaser-game',
    templateUrl: './phaser-game.component.html',
    imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatSliderModule],
    standalone: true,
})
export class PhaserGame implements OnInit, OnDestroy {
    scene: Phaser.Scene;
    eventBus = new Events.EventEmitter();
    velocityX = 0;
    velocityY = 0;
    hockey: Phaser.Game = startHockey('game-container', this.velocityX, this.velocityY);

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
        restartHockey(this.velocityX, this.velocityY);
    }

    ngOnDestroy() {
        this.hockey.destroy(true);
    }
}
