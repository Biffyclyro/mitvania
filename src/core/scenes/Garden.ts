import "phaser";
import { backgroundManager, buildField } from "../engines.ts/asssetsManager";
import { Commands } from "../engines.ts/command";
import { garden } from "./levelsConfig";

export default class Garden extends Phaser.Scene {
	private commands!: Commands;

	constructor() {
		super('Garden');
	}

	preload(): void {
		this.load.image('background', 'backgrounds/Background_0.png');
		this.load.spritesheet('sceneTiles', 'tiles/Tiles.png', {frameWidth: 48, frameHeight: 52});
	}

	create(): void {
		backgroundManager(this);
		buildField(this, garden);
		this.add.image(24, 220, 'sceneTiles', 3);
		//const background = this.add.image(0, 0, 'background');
		//background.setScale(2);
		//background.setDisplayOrigin(0, 0);
		//background.setDisplaySize(windowSize.width, windowSize.height);
	}
}
