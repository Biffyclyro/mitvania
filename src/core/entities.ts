import {Scene, Physics } from "phaser";

export interface Entity {
	x: number;
	y: number;
	width?: number;
	height?: number;
}

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export interface Item extends Physics.Matter.Image{
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
		private sprite!: Physics.Matter.Sprite;
		constructor(public life: number, 
								public mana:number, 
								public stats: Stats,
								private baseTexture: string,
								public direction: Direction = 3) {
		}

		setSprite(scene: Scene, {x , y, width, height }: Entity) {
			//this.sprite = new Physics.Matter.Sprite(scene.matter.world, x, y, this.baseTexture);
			this.sprite = scene.matter.add.sprite(x, y, this.baseTexture);
			if (width && height) {
				this.sprite.setRectangle(width, height);
			}
		}

		getSprite(): Physics.Matter.Sprite {
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