import { Physics } from "phaser"
import { SpriteEntity } from "../entities"
import { Command } from "./command"

interface Movement {
	(sprite: Physics.Matter.Sprite): void
}

const velocity = 8

const moveUp = (sprite: Physics.Matter.Sprite) => {
	sprite.setVelocityY(-10)
	sprite.anims.play('moving')
}

const moveDown = (sprite: Physics.Matter.Sprite) => {
	sprite.setVelocity(0, velocity)
	sprite.anims.play('moving', true)
}

const moveLeft = (sprite: Physics.Matter.Sprite) => {
	sprite.setVelocityX(-velocity)
	sprite.anims.play('moving',true)
}

const  moveRight = (sprite: Physics.Matter.Sprite) => {
	sprite.setVelocityX(velocity)
	sprite.anims.play('moving',true)
}

const stop = (sprite: Physics.Matter.Sprite) => {
	sprite.setVelocity(0,0)
	sprite.anims.play('player-idle', true)
}

export const move = (spriteEntity: SpriteEntity) => {
	if (spriteEntity.moving) {
		commands.get(spriteEntity.direction)!(spriteEntity.getSprite())
	} else {
		stop(spriteEntity.getSprite())
	}
}

export const commands = new Map<string, Movement>();
commands.set('left', moveLeft)
commands.set('right', moveRight)
commands.set('up', moveUp)
commands.set('down', moveDown)
commands.set('stop', stop)