import { Scene, Physics } from "phaser";
import { Direction } from "../entities";
import { player } from "../global";
import { commands } from "./movements";
 
export interface Command {
	(sprite: Physics.Matter.Sprite): void;
}

const setMovement = (direction: Direction, moving=false) => {
		player.moving = moving;
		player.direction = direction;
	}

const keyboardCommands = {
	ArrowLeft: setMovement(Direction.Left, true),
	ArrowRight: setMovement(Direction.Right, true),
	ArrowUp: setMovement(Direction.Up, true),
	ArrowDown: setMovement(Direction.Down, true),
	Stop: setMovement(player.direction) 
}

type keyboardObjectKey = keyof typeof keyboardCommands;

const execute = (command: Command | undefined | void) => {
	if (command) {command(player.getSprite());}
}

export const keyboardHandler = (scene: Scene) => {
	scene.input.keyboard.on('keydown', (e: KeyboardEvent) => {
		const key = e.code as keyboardObjectKey;
		const cmd = keyboardCommands[key];
		execute(cmd);
	});
	scene.input.keyboard.on('keyup', () => {
		keyboardCommands.Stop
	});
}

export const inputsHandler = (scene: Scene) => {
	keyboardHandler(scene);
}