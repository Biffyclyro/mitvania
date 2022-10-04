import "phaser"
import { backgroundManager, buildPlayerAnims, buildScene, loadPlayerAssets, loadSceneAssets, makeLayerSolid } from "../engines/asssetsManager"
import { InputManager } from "../engines/command"
import { player } from "../global"

export default class Standard extends Phaser.Scene {
	private inputManager = new InputManager()

	constructor() {
		super('Garden')
	}

	preload(): void {
		loadSceneAssets(this)
		loadPlayerAssets(this)
	}

	create(): void {
		this.inputManager.buildInput(this)
		this.setCamera()
		backgroundManager(this)
		buildPlayerAnims(this)
		const mainLayer = buildScene(this)
		makeLayerSolid(this, mainLayer)
		player.setSprite(this, {x:96, y:410, width: 24, height:32, scale: 1})
		this.cameras.main.startFollow(player.getSprite(), true, 0.05, 0.05)
	}

	update() {
		this.inputManager.inputHandler()
	}

	private setCamera() {
		this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2)
		this.matter.world.setBounds(0, 0, 1920 * 2, 1080 * 2)
		this.cameras.main.zoom = 1.5
	}
}
