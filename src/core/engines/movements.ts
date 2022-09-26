import { Physics } from "phaser";
import { Command } from "./command";

const velocity = 8;

const moveUp: Command = (sprite: Physics.Matter.Sprite) => {
	sprite.setVelocityY(-10);
}

const moveDown: Command = (sprite: Physics.Matter.Sprite) => {
	sprite.setVelocityY(velocity);
}

const moveLeft: Command = (sprite: Physics.Matter.Sprite) => {
	sprite.setVelocityX(-velocity);
}

const  moveRight: Command = (sprite: Physics.Matter.Sprite) => {
	sprite.setVelocityX(velocity);
}

const stop: Command = (sprite: Physics.Matter.Sprite) => {
	sprite.setVelocity(0,0);
}

export const commands = new Map<string, Command>();
commands.set('left', moveLeft);
commands.set('right', moveRight);
commands.set('up', moveUp);
commands.set('down', moveDown);
commands.set('stop', stop);