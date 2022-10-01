import "phaser"
import { backgroundManager, buildPlayerAnims, buildScene, loadPlayerAssets, loadSceneAssets, makeLayerSolid } from "../engines/asssetsManager"
import { InputManager } from "../engines/command"
import { SpriteEntity } from "../entities"
import { player } from "../global"

export default class Standard extends Phaser.Scene {
	private readonly sceneSpriteEntities: SpriteEntity[] = []
	private inputManager = new InputManager()

	constructor() {
		super('Garden')
	}

	preload(): void {
		loadSceneAssets(this)
		loadPlayerAssets(this)
	}

	create(): void {
		buildPlayerAnims(this)
		backgroundManager(this)
		const fristLayer = buildScene(this)
		player.setSprite(this, {x:96, y:410, width: 16, height:16, scale: 3})
		this.sceneSpriteEntities.push(player)	
		makeLayerSolid(this, fristLayer)
		this.inputManager.buildInput(this)
		//inputsHandler(this)
	}

	update() {
		this.inputManager.inputHandler()
	}
}
