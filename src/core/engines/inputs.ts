import { Scene, Input } from "phaser"
import { Direction } from "../entities"
import { playerManager } from "../global"
import { command } from "./command"


// interface KeyboardKeys {
// 	up: Input.Keyboard.Key
// 	down: Input.Keyboard.Key
// 	left: Input.Keyboard.Key
// 	right: Input.Keyboard.Key
// 	normalSkill: Input.Keyboard.Key
// 	baseAttack: Input.Keyboard.Key
// 	menu: Input.Keyboard.Key
// 	jump: Input.Keyboard.Key
// }

interface KeyboardKeys  {
	jump: Input.Keyboard.Key[]
	down: Input.Keyboard.Key[]
	left: Input.Keyboard.Key[]
	right: Input.Keyboard.Key[]
	normalSkill: Input.Keyboard.Key[]
	baseAttack: Input.Keyboard.Key[]
	menu: Input.Keyboard.Key[]
}

interface GamePad {
	jump: Input.Gamepad.Button
	down: Input.Gamepad.Axis 
	left: Input.Gamepad.Axis 
	right: Input.Gamepad.Axis 
	normalSkill: Input.Gamepad.Button
	baseAttack: Input.Gamepad.Button
	menu: Input.Gamepad.Button
}

export interface Inputs {
	keyboard: KeyboardKeys 
	gamePad?: GamePad
}

export class InputManager {
	private static readonly INSTANCE = new InputManager()
	private inputs: Inputs

	constructor() {
		if (InputManager.INSTANCE) {
			return InputManager.INSTANCE
		}
	}

	private addKey(keysName: string[], scene: Scene): Input.Keyboard.Key[] {
		const keys: Input.Keyboard.Key[] = []

		keysName.forEach(k => {
			keys.push(scene.input.keyboard.addKey(k))
		})
		return keys
	}

	buildInput(scene: Scene) {
		this.inputs = {
			// keyboard: {
			// 	up: scene.input.keyboard.addKey('Up'),
			// 	down: scene.input.keyboard.addKey('Down'),
			// 	left: scene.input.keyboard.addKey('Left'),
			// 	right: scene.input.keyboard.addKey('Right'), 
			// 	normalSkill: scene.input.keyboard.addKey('z'),
			// 	baseAttack: scene.input.keyboard.addKey('x'),
			// 	menu: scene.input.keyboard.addKey('Esc'),
			// 	jump: scene.input.keyboard.addKey('Space')
			// }

			keyboard: {
				down: this.addKey(['Down', 's', 'j'], scene),
				left: this.addKey(['Left', 'a', 'h'], scene),
				right: this.addKey(['Right', 'd', 'l'], scene),
				normalSkill: this.addKey(['z'], scene),
				baseAttack: this.addKey(['x'], scene),
				menu: this.addKey(['Esc'], scene),
				jump: this.addKey(['Space'], scene),
			}
		}
	}

	keyboardHandler() {
		const player = playerManager.player
		this.inputs.keyboard.jump.forEach(k => {
			if (Phaser.Input.Keyboard.JustDown(k)) {
				let downPressed = false
				this.inputs.keyboard.down.forEach(downK => {
					if (downK.isDown) {
						downPressed = true
					}
				})
				if (downPressed) {
					command['moveDown'](player)
				} else {
					command['jump'](player)
				}
			}
		})

		const directionMove = {
			left: false,
			right: false
		}

		this.inputs.keyboard.left.forEach(k => {
			if (k.isDown) {
				directionMove.left = true
			}
		})

		this.inputs.keyboard.right.forEach(k => {
			if (k.isDown) {
				directionMove.right = true
			}
		})

		if (directionMove.right) {
			player.direction = Direction.Right
			command['move'](player)
		} else if (directionMove.left) {
			player.direction = Direction.Left
			command['move'](player)
		}
		else {
			command['stop'](player)
		}

		this.inputs.keyboard.normalSkill.forEach(k => {
			if (Phaser.Input.Keyboard.JustDown(k)) {
				command['normalSkill'](player)
			}
		})

		this.inputs.keyboard.baseAttack.forEach(k => {
			if (Phaser.Input.Keyboard.JustDown(k)) {
				command['baseAttack'](player)
			}
		})

		this.inputs.keyboard.menu.forEach(k => {
			if (Phaser.Input.Keyboard.JustDown(k)) {
				command['menu']()
			}
		})
	}

	// keyboarHandler() {
	// 	const player = playerManager.player
	// 	if (this.inputs.keyboard.left.isDown) {
	// 		//commands.get('left')!(player)
	// 		player.direction = Direction.Left
	// 		command['move'](player)
	// 	} else if (this.inputs.keyboard.right.isDown) {
	// 		player.direction = Direction.Right
	// 		command['move'](player)
	// 		//commands.get('right')!(player)
	// 	} else {
	// 		command['stop'](player)
	// 	}
	// 	// if (this.inputs.keyboard.up.isDown) {
	// 	// 	command['jump'](player)
	// 	// }
	// 	if (Phaser.Input.Keyboard.JustDown(this.inputs.keyboard.up)) {
	// 		//player.getSprite().setCollisionGroup(-7)
	// 		command['jump'](player)
	// 	}
	// 	if (Phaser.Input.Keyboard.JustDown(this.inputs.keyboard.normalSkill)) {
	// 		command['normalSkill'](player)
	// 	}
	// 	if (Phaser.Input.Keyboard.JustDown(this.inputs.keyboard.baseAttack)) {
	// 		command['baseAttack'](player)
	// 	}

	// 	if (Phaser.Input.Keyboard.JustDown(this.inputs.keyboard.menu)) {
	// 		command['menu']()
	// 	}

	// 	if (Phaser.Input.Keyboard.JustDown(this.inputs.keyboard.jump)) {
	// 		if (this.inputs.keyboard.down.isDown) {
	// 			command['moveDown'](player)
	// 		} else {
	// 			command['jump'](player)
	// 		}
	// 	}
	// }

	inputHandler() {
		this.keyboardHandler()
	}
}