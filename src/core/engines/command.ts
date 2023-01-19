import GameMenu from "./GameMenu"
import { Direction, Player, SpriteEntity } from "../entities"

const menu = new GameMenu()

export const command = {
	'jump': (sprite: SpriteEntity) => {
		sprite.jump()
	},
	
	'moveUp': (sprite: SpriteEntity) => {
		sprite.move(Direction.Up)
	},

	'moveDown': (sprite: SpriteEntity) => {
		sprite.getSprite().setCollisionGroup(-7)
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
	
	'menu': menu.commandHandler.bind(menu)
}