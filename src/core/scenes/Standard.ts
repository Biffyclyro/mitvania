import "phaser";
import { Physics } from "phaser";
import { backgroundManager, buildField } from "../engines/asssetsManager";
import { inputsHandler } from "../engines/command";
import { addEntity } from "../engines/entitiesHandler";
import { Player } from "../entities";
import { player } from "../global";
import { garden } from "./levelsConfig";

export default class Standard extends Phaser.Scene {
	private ground!: Physics.Arcade.StaticGroup; 
	constructor() {
		super('Garden');
	}

	preload(): void {
		this.load.image('background', 'backgrounds/Background_0.png');
		this.load.spritesheet('sceneTiles', 'tiles/Tiles.png', {frameWidth: 48, frameHeight: 52});
		this.load.spritesheet('attack', 'sprites/attack.png', {frameWidth: 74, frameHeight: 74});
		this.load.spritesheet('player-idle', 'sprites/player-idle.png', {frameWidth: 64, frameHeight: 64});
	}

	create(): void {
		this.ground = this.physics.add.staticGroup(); 
		backgroundManager(this);
		player.setSprite(this, 96, 510);
		addEntity(this, player.getSprite());
		player.getSprite().setGravity(300);
		this.physics.add.collider(player.getSprite(), this.ground)
		//buildField(this, garden);
		this.ground.create(24, 520, 'sceneTiles', 3);
		//bloco.setDisplaySize(96, 104);
		this.anims.create({
			key: 'attack',
			frameRate: 10,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('attack', {start: 0, end: 6})
		});

		this.anims.create({
			key: 'player-idle',
			frameRate: 10,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('player-idle', {start:0, end: 3})
		});
		player.getSprite().anims.play('player-idle');
		inputsHandler(this);
	}
}
