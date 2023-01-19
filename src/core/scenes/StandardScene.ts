import { Player } from "../entities"
import GameMenu from "../engines/GameMenu"
import { InputManager } from "../engines/inputs"
import SceneBuilder from "../engines/SceneBuilder"
import { playerManager, saveManager } from "../global"


export default class StandardScene extends Phaser.Scene {
	private readonly inputManager = new InputManager()
	private readonly menu = new GameMenu()
	private readonly sceneBuilder: SceneBuilder 
	private readonly player: Player

	constructor() {
		super('StandardScene')
		this.player = playerManager.player
		this.sceneBuilder = new SceneBuilder(this)
		this.menu.scene = this
	}

	preload() {
		this.sceneBuilder.loadSceneAssets()
		this.sceneBuilder.loadPlayerAssets()
		this.menu.loadMenuAssets()
	}

	create() {
		this.inputManager.buildInput(this)
		this.sceneBuilder.buildPlayerAnims()
		this.sceneBuilder.buildScene()
		if (saveManager.saveInfos.playerStatus) {
			const {x, y} = saveManager.saveInfos.playerStatus.position
			this.player.setSprite(this, {x, y, width: 24, height: 32, scale: 1})
		} else {
			this.player.setSprite(this, {x: 96, y: 505, width: 24, height: 32, scale: 1})
		}

		this.player.normalSkill = 'lightning-bolt'

		this.cameras.main.startFollow(this.player.getSprite(), true, 0.05, 0.05)

		//setTimeout(()=> test(player.takeDamage.bind(player)), 6000)
		//saveManager.saveGame({stage: JSON.stringify(mainGameConfigManager.config.stages)})
		//window.addEventListener('saved', (e) => console.log((e as CustomEvent).detail))
		//this.input.keyboard.on('keydown', console.log)
	}

	update() {
		this.inputManager.inputHandler()
		this.sceneBuilder.moveEntities()
		this.player.playerCanPassThrough()
	}
}