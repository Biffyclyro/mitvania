import { Scene, Physics } from "phaser"
import { Direction } from "../entities"
import { player } from "../global"
import { commands } from "./movements"
 
export interface Command {
	(): void
}

let inputs = 0

const setMovement = (direction: Direction, moving=false) => {
	if (moving) {
		inputs++
		player.moving = moving
		player.direction = direction
	} else {
		inputs--
		player.direction = direction
		if (inputs === 0) {
			player.moving = false
		}
	}
}

const keyboardCommands = {
	ArrowLeft: () => setMovement(Direction.Left, true),
	ArrowRight: () => setMovement(Direction.Right, true),
	ArrowUp: () => setMovement(Direction.Up, true),
	ArrowDown: () => setMovement(Direction.Down, true),
	Stop: () => setMovement(player.direction) 
}

type keyboardObjectKey = keyof typeof keyboardCommands;

const execute = (command: Command | undefined ) => {
	if (command) {command()}
}

export const keyboardHandler = (scene: Scene) => {
	scene.input.keyboard.on('keydown', (e: KeyboardEvent) => {
		const key = e.code as keyboardObjectKey
		const cmd = keyboardCommands[key]
		execute(cmd)
	})
	
	scene.input.keyboard.on('keyup', () => {
		keyboardCommands.Stop()
	})
}

export const inputsHandler = (scene: Scene) => {
	keyboardHandler(scene)
}