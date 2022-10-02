import "phaser"
import { Physics } from "phaser"
import { backgroundManager, buildPlayerAnims, buildScene, loadPlayerAssets, loadSceneAssets, makeLayerSolid } from "../engines/asssetsManager"
import { InputManager } from "../engines/command"
import { SpriteEntity } from "../entities"
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
		this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2)
		this.matter.world.setBounds(0, 0, 1920 * 2, 1080 * 2)
		this.inputManager.buildInput(this)
		backgroundManager(this)
		buildPlayerAnims(this)
		const mainLayer = buildScene(this)
		makeLayerSolid(this, mainLayer)
		player.setSprite(this, {x:96, y:410, width: 16, height:16, scale: 3})
		this.cameras.main.startFollow(player.getSprite(), true, 0.05, 0.05)
	}

	update() {
		this.inputManager.inputHandler()
	}
}
