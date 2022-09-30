import "phaser";
import { backgroundManager, buildPlayerAnims, buildScene, loadPlayerAssets, loadSceneAssets, makeLayerSolid } from "../engines/asssetsManager";
import { inputsHandler } from "../engines/command";
import { move } from "../engines/movements";
import { SpriteEntity } from "../entities";
import { player } from "../global";

export default class Standard extends Phaser.Scene {
	private readonly sceneSpriteEntities: SpriteEntity[] = [];
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
		this.sceneSpriteEntities.push(player)	;
		makeLayerSolid(this, fristLayer);
		inputsHandler(this);
	}

	update() {
		this.sceneSpriteEntities.forEach(move);
	}
}
