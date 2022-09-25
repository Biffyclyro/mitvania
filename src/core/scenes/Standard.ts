import "phaser";
import { Physics } from "phaser";
import { backgroundManager, buildField, buildScene, loadPlayerAssets, loadSceneAssets } from "../engines/asssetsManager";
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
		/*
		this.load.image('background', 'backgrounds/Background_0.png');
		this.load.image('tiles', 'tiles/Tiles.png');
		this.load.tilemapTiledJSON('map','tiles/fist-tile.json');
		this.load.spritesheet('sceneTiles', 'tiles/Tiles.png', {frameWidth: 48, frameHeight: 52});
		this.load.spritesheet('attack', 'sprites/attack.png', {frameWidth: 74, frameHeight: 74});
		this.load.spritesheet('player-idle', 'sprites/player-idle.png', {frameWidth: 64, frameHeight: 64});
		*/
		loadSceneAssets(this);
		loadPlayerAssets(this);
	}

	create(): void {
		//this.ground = this.physics.add.staticGroup(); 
		backgroundManager(this);

		const fristLayer = buildScene(this);
		player.setSprite(this, 96, 410);
		addEntity(this, player.getSprite());
		player.getSprite().setGravityY(300);
		this.physics.add.collider(player.getSprite(), fristLayer);
		//buildField(this, garden);
		//this.ground.create(24, 520, 'sceneTiles', 3);
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
		player.getSprite().setBodySize(24, 12)
		inputsHandler(this);
	}
}
