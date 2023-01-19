import { playerManager } from "../global"
import { GameObjects, Scene } from "phaser"

export default class GameMenu {
	private _scene: Scene 
	private menuObj: GameObjects.Image 
	private menuTexts: GameObjects.Text[] = []
	private static readonly INSTANCE = new GameMenu()
	private open = false

	constructor() {
		if (GameMenu.INSTANCE) {return GameMenu.INSTANCE}
	}

	get scene() {
		return this._scene
	}
	
	set scene(scene: Scene) {
		this._scene = scene
	}

	loadMenuAssets() {
		this.scene.load.image('menu-bg', 'backgrounds/menu-bg.png')
	}

	private openMenu() {
		this._scene.matter.pause()
		this._scene.cameras.main.stopFollow()
		const screenWiew = this._scene.cameras.main.worldView
		this.menuObj = this._scene.add.image(screenWiew.centerX, screenWiew.centerY, 'menu-bg')
		this.menuObj.setDisplaySize(screenWiew.width * 2, screenWiew.height * 2)
		this.menuTexts.push(this._scene.add.text(screenWiew.centerX, screenWiew.centerY, 'Paused'))
		this.menuTexts.forEach(t => t.setOrigin(0.5))
		playerManager.player.canMove = false
		this.open = true
	}

	private closeMenu() {
		this.menuObj.destroy()
		this.menuTexts.forEach(t => t.destroy())
		this._scene.matter.resume()
		this._scene.cameras.main.startFollow(playerManager.player.getSprite())
		playerManager.player.canMove = true 
		this.open = false
	}

	commandHandler() {
		this.open ? this.closeMenu() : this.openMenu()
	}
}
