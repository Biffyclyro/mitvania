import { GameObjects, Scene } from "phaser"

export default class GameMenu {
	private _scene: Scene 
	private menuObj: GameObjects.Image 
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
		this.menuObj = this._scene.add.image(0,0, 'menu-bg')
		this.open = true
	}

	private closeMenu() {
		this.menuObj.destroy()
		this.open = false
	}

	commandHandler() {
		this.open ? this.closeMenu() : this.openMenu()
	}
}
