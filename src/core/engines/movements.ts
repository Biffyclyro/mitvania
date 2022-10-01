import { Physics } from "phaser"
import { Command } from "./command"

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
	sprite.setFlipX(true)
	sprite.setVelocityX(-velocity)
	sprite.anims.play('moving',true)
}

const  moveRight = (sprite: Physics.Matter.Sprite) => {
	sprite.resetFlip()
	sprite.setVelocityX(velocity)
	sprite.anims.play('moving',true)
}

const stop = (sprite: Physics.Matter.Sprite) => {
	sprite.setVelocityX(0)
	sprite.anims.play('player-idle', true)
}

export const commands = new Map<string, Command>();
commands.set('left', moveLeft)
commands.set('right', moveRight)
commands.set('up', moveUp)
commands.set('down', moveDown)
commands.set('stop', stop)