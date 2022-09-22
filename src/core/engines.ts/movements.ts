import { SpriteEntity } from "../entities";
import { Command } from "./command";

export const moveUp: Command = (sprite: SpriteEntity) => {
	sprite.setAccelerationY(-5);
}

export const moveDown: Command = (sprite: SpriteEntity) => {
	sprite.setAccelerationY(5);
}

export const moveLeft: Command = (sprite: SpriteEntity) => {
	sprite.setAccelerationX(-5);
}

export const  moveRight: Command = (sprite: SpriteEntity) => {
	sprite.setAccelerationX(-5);
}

export const commands = new Map<string, Command>();
commands.set('left', moveLeft);
commands.set('right', moveRight);
commands.set('up', moveUp);
commands.set('down', moveDown);