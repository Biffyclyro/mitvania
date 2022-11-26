import { Scene, Input } from "phaser"
import { playerManager } from "../global"
import { commands } from "./command"


interface KeyboardKeys {
	up: Input.Keyboard.Key
	down: Input.Keyboard.Key
	left: Input.Keyboard.Key
	right: Input.Keyboard.Key
	normalSkill: Input.Keyboard.Key
	baseAttack: Input.Keyboard.Key
	menu: Input.Keyboard.Key
}

export interface Inputs {
	keyboard: KeyboardKeys 
}

export class InputManager {
	private static readonly INSTANCE = new InputManager()
	private inputs: Inputs

	constructor() {
		if (InputManager.INSTANCE) {
			return InputManager.INSTANCE
		}
	}

	buildInput(scene: Scene) {
		this.inputs = {
			keyboard: {
				up: scene.input.keyboard.addKey('Up'),
				down: scene.input.keyboard.addKey('Down'),
				left: scene.input.keyboard.addKey('Left'),
				right: scene.input.keyboard.addKey('Right'),
				normalSkill: scene.input.keyboard.addKey('z'),
				baseAttack: scene.input.keyboard.addKey('x'),
				menu: scene.input.keyboard.addKey('Esc')
			}
		}	
	}

	keyboarHandler() {
		const player = playerManager.player
		if (this.inputs.keyboard.left.isDown) {
			commands.get('ArrowLeft')!(player)
		} else if (this.inputs.keyboard.right.isDown) {
			commands.get('ArrowRight')!(player)
		} else {
			commands.get('stop')!(player)
		}
		if (this.inputs.keyboard.up.isDown) {
			commands.get('ArrowUp')!(player)
		}
		if (Phaser.Input.Keyboard.JustDown(this.inputs.keyboard.normalSkill)) {
			commands.get('normalSkill')!(player)
		}
		if (Phaser.Input.Keyboard.JustDown(this.inputs.keyboard.baseAttack)) {
			commands.get('baseAttack')!(player)
		}

		if (Phaser.Input.Keyboard.JustDown(this.inputs.keyboard.menu)) {
			commands.get('menu')!(player)
		}

		// if (Phaser.Input.Keyboard.JustDown(this.inputs.keyboard.up)) {
		// 	commands.get('ArrowUp')!(player)
		// }
	}

	inputHandler() {
		this.keyboarHandler()
	}
}