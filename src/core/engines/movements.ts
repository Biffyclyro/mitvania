import { Physics } from "phaser";
import { Command } from "./command";

const velocity = 8;

const moveUp: Command = (sprite: Physics.Matter.Sprite) => {
	sprite.setVelocity(0, -10);
	sprite.anims.play('moving')
}

const moveDown: Command = (sprite: Physics.Matter.Sprite) => {
	sprite.setVelocity(0, velocity);
	sprite.anims.play('moving', true)
}

const moveLeft: Command = (sprite: Physics.Matter.Sprite) => {
	sprite.setVelocity(-velocity, 0);
	sprite.anims.play('moving',true)
}

const  moveRight: Command = (sprite: Physics.Matter.Sprite) => {
	sprite.setVelocity(velocity, 0);
	sprite.anims.play('moving',true)
}

const stop: Command = (sprite: Physics.Matter.Sprite) => {
	sprite.setVelocity(0,0);
	sprite.anims.play('player-idle', true);
}

export const commands = new Map<string, Command>();
commands.set('left', moveLeft);
commands.set('right', moveRight);
commands.set('up', moveUp);
commands.set('down', moveDown);
commands.set('stop', stop);