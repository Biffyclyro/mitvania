import { SpriteEntity } from "../entities";
import { Command } from "./command";

const velocity = 180;

const moveUp: Command = (sprite: SpriteEntity) => {
	sprite.setAccelerationY(-velocity);
}

const moveDown: Command = (sprite: SpriteEntity) => {
	sprite.setAccelerationY(velocity);
}

const moveLeft: Command = (sprite: SpriteEntity) => {
	sprite.setAccelerationX(-velocity);
}

const  moveRight: Command = (sprite: SpriteEntity) => {
	sprite.setAccelerationX(velocity);
}

const stop: Command = (sprite: SpriteEntity) => {
	sprite.setVelocity(0,0);
}

export const commands = new Map<string, Command>();
commands.set('left', moveLeft);
commands.set('right', moveRight);
commands.set('up', moveUp);
commands.set('down', moveDown);
commands.set('stop', stop);