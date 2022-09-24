import { Scene, Physics } from "phaser";
import { player } from "../global";
import { commands } from "./movements";
 
export interface Command {
	(sprite: Physics.Arcade.Sprite): void;
}

const keyboardCommands = {
	ArrowLeft: commands.get('left'),
	ArrowRight: commands.get('right'),
	ArrowUp: commands.get('up'),
	ArrowDown: commands.get('down')
}

type keyboardObjectKey = keyof typeof keyboardCommands;

const execute = (command: Command | undefined) => {
	if (command) {command(player.getSprite());}
}


export const commandHandler = (keyDownEvent: KeyboardEvent) => {
	console.log(keyDownEvent)
	const key = keyDownEvent.code as keyboardObjectKey;
	const cmd = keyboardCommands[key];
	execute(cmd);
}

export const inputsHandler = (scene: Scene) => {
		scene.input.keyboard.on('keydown', (e: KeyboardEvent) => commandHandler(e)); 
		scene.input.keyboard.on('keyup', () => console.log('teste'))
}