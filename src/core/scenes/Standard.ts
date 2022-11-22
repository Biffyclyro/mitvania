import "phaser"
import SceneManager from "../engines/SceneManager"
import { InputManager } from "../engines/inputs"
import { playerManager, saveManager } from "../global"
import { Player } from "../entities"
import GameMenu from "../engines/GameMenu"


export default class Standard extends Phaser.Scene {
	private readonly inputManager = new InputManager()
	private readonly menu = new GameMenu()
	private readonly sceneManager: SceneManager 
	private readonly player: Player

	constructor() {
		super(saveManager.saveInfos.stage)
		this.player = playerManager.player
		this.sceneManager = new SceneManager(this)
		this.menu.scene = this
	}

	preload() {
		this.sceneManager.loadSceneAssets()
		this.sceneManager.loadPlayerAssets()
		this.menu.loadMenuAssets()
	}

	create() {
		this.inputManager.buildInput(this)
		this.sceneManager.buildPlayerAnims()
		this.sceneManager.buildScene()
		if (saveManager.saveInfos.playerStatus) {
			const {x, y} = saveManager.saveInfos.playerStatus.position
			this.player.setSprite(this, {x, y, width: 24, height: 32, scale: 1})
		} else {
			this.player.setSprite(this, {x: 96, y: 505, width: 24, height: 32, scale: 1})
		}

		this.player.weapon = 'knife'
		this.player.normalSkill = 'lightning-bolt'

		this.cameras.main.startFollow(this.player.getSprite(), true, 0.05, 0.05)
		//setTimeout(()=> test(player.takeDamage.bind(player)), 6000)
		//saveManager.saveGame({stage: JSON.stringify(mainGameConfigManager.config.stages)})
		//window.addEventListener('saved', (e) => console.log((e as CustomEvent).detail))
		//this.input.keyboard.on('keydown', console.log)
	}

	update() {
		this.inputManager.inputHandler()
	}
}