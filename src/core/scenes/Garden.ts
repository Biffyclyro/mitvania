import "phaser";
import { backgroundManager, buildField } from "../engines.ts/asssetsManager";
import { commandHandler } from "../engines.ts/command";
import { garden } from "./levelsConfig";

export default class Garden extends Phaser.Scene {
	constructor() {
		super('Garden');
	}

	preload(): void {
		this.load.image('background', 'backgrounds/Background_0.png');
		this.load.spritesheet('sceneTiles', 'tiles/Tiles.png', {frameWidth: 48, frameHeight: 52});
		this.load.spritesheet('attack', 'sprites/attack.png', {frameWidth: 74, frameHeight: 74});
	}

	create(): void {
		backgroundManager(this);
		//buildField(this, garden);
		const bloco = this.add.image(24, 520, 'sceneTiles', 3);
		bloco.setDisplaySize(96, 104);
		const boneco = this.add.sprite(34, 519, 'attack');
		boneco.setScale(2);
		this.anims.create({
			key: 'attack',
			frameRate: 10,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('attack', {start: 0, end: 6})
		});

		boneco.anims.play('attack', true);
	}

	update() {
		this.input.keyboard.on('keydown', commandHandler); 
	}
}
