import { Direction, Player, SpriteEntity } from "../entities"
import { playerManager } from "../global"
import GameMenu from "./GameMenu"

const menu = new GameMenu()

//type  Command = ((sprite: SpriteEntity) => void) | ((sprite: Player) => void )

export const command = {
	'jump': (sprite: SpriteEntity) => {
		sprite.jump()
	},
	'moveUp': (sprite: SpriteEntity) => {
		sprite.move(Direction.Up)
	},

	'moveDown': (sprite: SpriteEntity) => {
		sprite.move(Direction.Down)
	},

	'moveLeft': (sprite: SpriteEntity) => {
		sprite.move(Direction.Left)
	},

	'moveRight': (sprite: SpriteEntity) => {
		sprite.move(Direction.Right)
	},

	'move': (sprite: SpriteEntity) => {
		sprite.move(sprite.direction)
	},

	'stop': (sprite: SpriteEntity) => {
		sprite.idle()
	},

	'normalSkill': (sprite: SpriteEntity) => {
		sprite.useNormalSkill()
	},

	'baseAttack': (sprite: Player) => {
		sprite.attack()
	},
	
	'menu': () => {
		menu.commandHandler()
	}
}
	

export interface Command  {
	//comportamento diferente do previsto
	(sprite: SpriteEntity): void 
}

const jump = (sprite: SpriteEntity) => {
	sprite.jump()
}

const moveUp = (sprite: SpriteEntity) => {
	sprite.move(Direction.Up)
}

const moveDown = (sprite: SpriteEntity) => {
	sprite.move(Direction.Down)
}

const moveLeft = (sprite: SpriteEntity) => {
	sprite.move(Direction.Left)
}

const  moveRight = (sprite: SpriteEntity) => {
	sprite.move(Direction.Right)
}

const move = (sprite: SpriteEntity) => {
	sprite.move(sprite.direction)
}

const stop = (sprite: SpriteEntity) => {
	sprite.idle()
}

const normalSkill = (sprite: SpriteEntity) => {
	sprite.useNormalSkill()
}

const baseAttack = () => {
	playerManager.player.attack()
}


export const commands = new Map<string, Command>();
commands.set('left', moveLeft)
commands.set('right', moveRight)
commands.set('ArrowUp', jump)
commands.set('ArrowDown', moveDown)
commands.set('stop', stop)
commands.set('normalSkill', normalSkill)
commands.set('baseAttack', baseAttack)
commands.set('move', move)
commands.set('menu', () => menu.commandHandler())