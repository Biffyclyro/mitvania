import "phaser"
import SceneManager from "../engines/SceneManager"
import { InputManager } from "../engines/command"
import { playerManager, saveManager } from "../global"
import { Player } from "../entities"

export default class Standard extends Phaser.Scene {
	private inputManager = new InputManager()
	private readonly sceneManager: SceneManager 
	private readonly player: Player

	constructor() {
		super(saveManager.saveInfos.stage)
		this.player = playerManager.player
		this.sceneManager = new SceneManager(this)
	}

	preload() {
		this.sceneManager.loadSceneAssets()
		this.sceneManager.loadPlayerAssets()
	}

	create() {
		this.inputManager.buildInput(this)
		this.setCamera()
		this.sceneManager.buildPlayerAnims()
		this.sceneManager.buildScene()
		if (saveManager.saveInfos.playerStatus) {
			const {x, y} = saveManager.saveInfos.playerStatus.position
			this.player.setSprite(this, {x, y, width: 24, height: 32, scale: 1})
		} else {
			this.player.setSprite(this, {x: 96, y: 410, width: 24, height: 32, scale: 1})
		}

		this.player.weapon = 'knife'
		this.player.normalSkill = 'fire-ball'

		//this.player.getSprite().setCollisionGroup(-1)
		this.cameras.main.startFollow(this.player.getSprite(), true, 0.05, 0.05)
		//setTimeout(()=> test(player.takeDamage.bind(player)), 6000)
		//saveManager.saveGame({stage: JSON.stringify(mainGameConfigManager.config.stages)})
		//window.addEventListener('saved', (e) => console.log((e as CustomEvent).detail))
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
