import "phaser";
import { backgroundManager, buildPlayerAnims, buildScene, loadPlayerAssets, loadSceneAssets, makeLayerSolid } from "../engines/asssetsManager";
import { inputsHandler } from "../engines/command";
import { player } from "../global";

export default class Standard extends Phaser.Scene {
	constructor() {
		super('Garden');
	}

	preload(): void {
		loadSceneAssets(this);
		loadPlayerAssets(this);
	}

	create(): void {
		buildPlayerAnims(this);
		backgroundManager(this);
		const fristLayer = buildScene(this);
		player.setSprite(this, {x:96, y:410, width: 8, height:8, scale: 3});
		player.getSprite().setFriction(0);
		player.getSprite().setRotation(0);
		player.getSprite().setAngularVelocity(0)
		makeLayerSolid(this, fristLayer);
		//player.getSprite().anims.play('player-idle');
		inputsHandler(this);
	}
}
