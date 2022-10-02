import {Scene, Physics } from "phaser"

export interface Entity {
	x: number
	y: number
	width: number
	height: number
	scale: number
}

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left= 'left',
  Right = 'right'
}

interface Sensors{
	bottom: MatterJS.BodyType
}

export interface Item extends Physics.Matter.Image{
	name: string
	properties: any
}

export interface Stats {
	atk?: number
	int?: number
	con?: number
	agi?: number
}

export class SpriteEntity {
		lvl = 1
		moving = false
		attack: (() => void ) | undefined
		defeat: (() => void) | undefined
		sprite!: Physics.Matter.Sprite
		constructor(public life: number, 
								public mana:number, 
								public stats: Stats,
								public baseTexture: string,
								public direction: Direction = Direction.Right) {
		}

		setSprite(scene: Scene, {x , y, width, height, scale}: Entity) {
			this.sprite = scene.matter.add.sprite(x, y, this.baseTexture, 0)
			if (width && height) {
				this.sprite.setRectangle(width, height)
				this.sprite.setScale(scale)
				this.sprite.setFixedRotation()
			}
		}

		getSprite(): Physics.Matter.Sprite {
			return this.sprite
		}

		up() {
			this.lvl++
		}
}

export class Player extends SpriteEntity {
	sensors: Sensors
	specialAttack: (() => void) | undefined
	inventory: Item[] | undefined

	setSprite(scene: Scene, { x, y, width, height, scale }: Entity) {
		const Bodies = scene.matter.bodies 
		this.sensors = {
			bottom: Bodies.rectangle(12, 20, width, 1,{isSensor: true})
		}
		const body = Bodies.rectangle(12, 13, width, height)
		const compoundBody = scene.matter.body.create({
			parts: [body, this.sensors.bottom],
		})
		this.sprite = scene.matter.add.sprite(x, y, this.baseTexture, 0)	
		this.sprite.setExistingBody(compoundBody)
		this.sprite.setScale(scale)
		this.sprite.setFixedRotation()
	}
}
