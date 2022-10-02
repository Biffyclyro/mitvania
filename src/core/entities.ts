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
		maxJumps = 1
		jumps = this.maxJumps 
		velocity = 8
		attack: (() => void ) | undefined
		defeat: (() => void) | undefined
		sprite!: Physics.Matter.Sprite
		constructor(public life: number, 
								public mana:number, 
								public stats: Stats,
								public baseTexture: string,
								public direction: Direction = Direction.Right) {
		}

	setSprite(scene: Scene, { x, y, width, height, scale }: Entity) {
		this.sprite = scene.matter.add.sprite(x, y, this.baseTexture, 0)
		if (width && height) {
			this.sprite.setRectangle(width, height)
			this.sprite.setScale(scale)
			this.sprite.setFixedRotation()
		}
		scene.matter.world.on('collisionactive', (e:Physics.Matter.Events.CollisionActiveEvent) => this.resetJump)
	}

	getSprite(): Physics.Matter.Sprite {
		return this.sprite
	}

	idle() {
		this.sprite.setVelocityX(0)
		this.sprite.anims.play('player-idle', true)
	}

	up() {
		this.lvl++
	}

	jump() {
		if (this.jumps > 0) {
			this.jumps--
			this.sprite.setVelocityY(-10)
			this.sprite.anims.play('moving')
		}
	}

	resetJump() {
		this.jumps = this.maxJumps	
	}
	
	move(direction: Direction) {
		const movements = {
			Left: () => {
				this.sprite.setFlipX(true)
				this.sprite.setVelocityX(-this.velocity)
				this.sprite.anims.play('moving', true)
			},
			Right: () => {
				this.sprite.resetFlip()
				this.sprite.setVelocityX(this.velocity)
				this.sprite.anims.play('moving', true)
			}
		}
		switch (direction) {
			case Direction.Left:
				movements.Left()
				break
			case Direction.Right:
				movements.Right()
				break
		}
	}

	
}

export class Player extends SpriteEntity {
	sensors: Sensors
	specialAttack: (() => void) | undefined
	inventory: Item[] = [] 

	setSprite(scene: Scene, { x, y, width, height, scale }: Entity) {
		const Bodies = scene.matter.bodies 
		this.sensors = {
			bottom: Bodies.rectangle(12, 21, width, 1,{isSensor: true})
		}
		// investigar esses valores

		const body = Bodies.rectangle(12, 13, width, height)
		const compoundBody = scene.matter.body.create({
			parts: [body, this.sensors.bottom],
		})
		this.sprite = scene.matter.add.sprite(x, y, this.baseTexture, 0)	
		this.sprite.setExistingBody(compoundBody)
		this.sprite.setScale(scale)
		this.sprite.setFixedRotation()
		scene.matter.world.on('collisionactive', (e:Physics.Matter.Events.CollisionActiveEvent) => {
			e.pairs.forEach(p => {
				const bodyA = p.bodyA;
				const bodyB = p.bodyB;
				if (this.sensors.bottom === bodyA || bodyB) {
					this.resetJump()
					console.log(e)
				}
			})
		})
	}
}
