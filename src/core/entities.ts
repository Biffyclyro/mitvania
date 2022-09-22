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

export interface Status {
	atk: number;
	int: number;
	con: number;
	agi: number;
}

export interface SpriteEntity extends Physics.Arcade.Sprite, Entity {
	life: number;
	mana: number;
	status: Status;
	attack: () => void;
	defeated: () => void;
}

export interface Player extends SpriteEntity {
	inventory: Item[];
	specialAttack: () => void;
}