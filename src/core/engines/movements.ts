import { Physics } from "phaser";
import { Direction, SpriteEntity } from "../entities";
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

export const move = (spriteEntity: SpriteEntity) => {
	if (spriteEntity.moving) {
		console.log('is moving')
		commands.get(spriteEntity.direction)!(spriteEntity.getSprite());
	}
}

export const commands = new Map<string, Command>();
commands.set('Left', moveLeft);
commands.set('Right', moveRight);
commands.set('Up', moveUp);
commands.set('Down', moveDown);
commands.set('Stop', stop);