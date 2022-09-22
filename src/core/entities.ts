import { Physics } from "phaser";

export interface Entity {
	x: number;
	y: number;
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

export class SpriteEntity extends Physics.Arcade.Sprite implements Entity {
		attack: () => void;
		defeat: () => void;
		constructor(scene: Phaser.Scene,
								life: number, 
								mana:number, 
								x:number, 
								y: number, 
								texture: string,
								attack: () => void,
								defeat: () => void,
								stats: Stats) {
			super(scene, x, y, texture );
			this.attack = attack;
			this.defeat = defeat;
		}
}

export class Player extends SpriteEntity {
	constructor(scene: Phaser.Scene,
								life: number, 
								mana:number, 
								x:number, 
								y: number, 
								texture: string,
								stats: Stats,
								inventory: Item[],
								specialAttack: () => void,
								attack: () => void,
								defeat: () => void) {
		super(scene, life, mana, x, y, texture, attack, defeat, stats);
	}
}