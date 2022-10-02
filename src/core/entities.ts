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
	bottom: Physics.Matter.Sprite
	left?: Physics.Matter.Sprite
	right?: Physics.Matter.Sprite
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
		//super.setSprite(scene, {x:x, y:y, width:width, height: height, scale: scale})
		this.sensors = {
			bottom: scene.matter.add.sprite(x, y + height, 'bottom-sensor')
		}
		this.sensors.bottom.setRectangle(width, 0)

		const Bodies = scene.matter.bodies 
		const body = Bodies.rectangle(x, y, width, height)
		const teste = Bodies.rectangle(x, y + width/2, width, 1)
		teste.isSensor = true

	

		const compoundBody = scene.matter.body.create({
			parts: [body, teste],
		})
		this.sprite = scene.matter.add.sprite(0, 0, this.baseTexture, 0)	
		this.sprite.setExistingBody(compoundBody)
		this.sprite.setScale(scale)
		this.sprite.setFixedRotation()

	}
}
