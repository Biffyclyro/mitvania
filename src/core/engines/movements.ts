import { Direction, SpriteEntity } from "../entities"

export interface Command {
	(sprite: SpriteEntity): void
}


const jump = (sprite: SpriteEntity) => {
	sprite.jump()
}

const moveDown = (sprite: SpriteEntity) => {
	console.log('down')
}

const moveLeft = (sprite: SpriteEntity) => {
	sprite.move(Direction.Left)
}

const  moveRight = (sprite: SpriteEntity) => {
	sprite.move(Direction.Right)
}

const stop = (sprite: SpriteEntity) => {
	sprite.idle()
}

export const commands = new Map<string, Command>();
commands.set('ArrowLeft', moveLeft)
commands.set('ArrowRight', moveRight)
commands.set('ArrowUp', jump)
commands.set('ArrowDown', moveDown)
commands.set('stop', stop)