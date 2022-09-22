import "phaser" ;
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
	const key = keyDownEvent.code as keyboardObjectKey;
	const cmd = keyboardCommands[key];
	execute(cmd, player);
}