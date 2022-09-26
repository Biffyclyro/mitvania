import { Scene, Physics } from "phaser";
import { player } from "../global";
import { commands } from "./movements";
 
export interface Command {
	(sprite: Physics.Matter.Sprite): void;
}

const keyboardCommands = {
	ArrowLeft: commands.get('left'),
	ArrowRight: commands.get('right'),
	ArrowUp: commands.get('up'),
	ArrowDown: commands.get('down'),
	Stop: commands.get('stop')
}

type keyboardObjectKey = keyof typeof keyboardCommands;

const execute = (command: Command | undefined) => {
	if (command) {command(player.getSprite());}
}

export const keyboardHandler = (scene: Scene) => {
	scene.input.keyboard.on('keydown', (e: KeyboardEvent) => {
		const key = e.code as keyboardObjectKey;
		const cmd = keyboardCommands[key];
		execute(cmd);
	});
	scene.input.keyboard.on('keyup', () => {
		keyboardCommands.Stop!(player.getSprite())
	});
}

export const inputsHandler = (scene: Scene) => {
	keyboardHandler(scene);
}