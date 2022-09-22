import "phaser" ;
 
interface Command {
	(): void;
}

const commands = new Map<string, Command>();

commands.set('ArrowLeft', () => console.log('teste'));
commands.set('ArrowRight', () => console.log('teste'));
commands.set('ArrowUp', () => console.log('teste'));
commands.set('ArrowDown', () => console.log('teste'));

export const commandHandler = (keyDownEvent: KeyboardEvent) => {
	const key = keyDownEvent.code;
	if (commands.has(key)) {
		commands.get(key)!();
	}
}