import { Scene } from "phaser";
import { Player, SpriteEntity } from "../entities";
import { commands } from "./movements";
 
export interface Command {
	(sprite: SpriteEntity): void;
}

const keyboardCommands = {
	ArrowLeft: commands.get('left'),
	ArrowRight: commands.get('right'),
	ArrowUp: commands.get('up'),
	ArrowDown: commands.get('down')
}

type keyboardObjectKey = keyof typeof keyboardCommands;

const execute = (command: Command | undefined, player: Player) => {
	if (command) {command(player);}
}


export const commandHandler = (keyDownEvent: KeyboardEvent, player: Player) => {
	console.log(keyDownEvent)
	const key = keyDownEvent.code as keyboardObjectKey;
	const cmd = keyboardCommands[key];
	execute(cmd, player);
}

export const inputsHandler = (scene: Scene) => {
		scene.input.keyboard.on('keydown', (e: KeyboardEvent) => commandHandler(e, scene.player)); 
		scene.input.keyboard.on('keyup', () => console.log('teste'))
}