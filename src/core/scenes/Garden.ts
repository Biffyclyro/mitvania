import "phaser";
import { backgroundManager, buildField } from "../engines.ts/asssetsManager";
import { commandHandler } from "../engines.ts/command";
import { Player } from "../entities";
import { garden } from "./levelsConfig";

export default class Garden extends Phaser.Scene {
	private player!: Player;
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
		this.player = new Player(this, 1, 1, 34, 519, 'attack',{}, [], () => console.log('balb '), () => console.log('aaaaall'), () => console.log('saadada'));
		this.physics.add.group(this.player)
		this.physics.
		this.anims.create({
			key: 'attack',
			frameRate: 10,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('attack', {start: 0, end: 6})
		});

		this.input.keyboard.on('keydown', (e: KeyboardEvent) => commandHandler(e, this.player)); 
	}
}
