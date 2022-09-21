interface Command {
	(): void; 
}

export interface Commands {
	Rigth: Command;
	Left: Command;
	Up: Command;
	Down: Command;
}

export class KeyboardCommand implements Commands {
	Rigth: Command = () => console.log('teste');
	Left: Command = () => console.log('teste');
	Up: Command = () => console.log('teste');
	Down: Command = () => console.log('teste');
}

