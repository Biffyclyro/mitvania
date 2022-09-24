import {Scene, Physics } from "phaser";

export interface Entity {
	x: number;
	y: number;
}

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export interface Item extends Physics.Arcade.Image, Entity {
	name: string;
	properties: any;
}

export interface Block extends Entity{
	texture: string;
}

export interface LevelConfig {
	blocks: Block[];
}

export interface Stats {
	atk?: number;
	int?: number;
	con?: number;
	agi?: number;
}

export class SpriteEntity {
		lvl = 1;
		attack: (() => void ) | undefined;
		defeat: (() => void) | undefined;
		private sprite!: Physics.Arcade.Sprite;
		constructor(public life: number, 
								public mana:number, 
								public stats: Stats,
								private baseTexture: string,
								public direction: Direction = 3) {
		}

		setSprite(scene: Scene, x: number, y: number) {
			this.sprite =  new Physics.Arcade.Sprite(scene, x, y, this.baseTexture);
		}

		getSprite(): Physics.Arcade.Sprite {
			return this.sprite;
		}

		up() {
			this.lvl++;
		}
}

export class Player extends SpriteEntity {
	specialAttack: (() => void) | undefined;
	inventory: Item[] | undefined;
}