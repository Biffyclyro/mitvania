import { Scene, Physics, Game, Input, Types } from "phaser"
import { player } from "../global"
import { commands } from "./movements"
 
export interface Command {
	(sprite: Physics.Matter.Sprite): void
}

interface KeyboardKeys {
	up:Input.Keyboard.Key
	down:Input.Keyboard.Key
	left:Input.Keyboard.Key
	right:Input.Keyboard.Key
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
				right: scene.input.keyboard.addKey('Right')
			}
		}	
	}

	inputHandler() {

		if (this.inputs.keyboard.left.isDown) {
			commands.get('left')!(player.getSprite())
		} if (this.inputs.keyboard.right.isDown) {
			commands.get('right')!(player.getSprite())
		} if (this.inputs.keyboard.up.isDown) {
			commands.get('up')!(player.getSprite())
		}

	}
}