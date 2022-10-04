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
	left: MatterJS.BodyType
	right: MatterJS.BodyType
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
		canMove = false
		maxJumps = 1
		jumps = this.maxJumps 
		velocity = 6
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
		scene.matter.world.on('collisionactive', this.resetJump.bind(this))
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

	private verifyCollision(e: Physics.Matter.Events.CollisionActiveEvent |
		 												 Physics.Matter.Events.CollisionEndEvent) {

		const bottom = this.sensors.bottom
		const left = this.sensors.left
		const rigth = this.sensors.right
		e.pairs.forEach(p => {
			const bodyA = p.bodyA
			const bodyB = p.bodyB
			if (bottom === bodyA || bottom === bodyB) {
				if(e.name === 'collisionEnd') {
					this.jumps--
				}
				if(e.name === 'collisionActive') {
					this.resetJump()
				}
			}

			if (left === bodyA || left === bodyB) {
				this.sprite.x += this.sprite.width/10
			}

			if (rigth === bodyA || rigth === bodyB) {
				
				this.sprite.x -= this.sprite.width/10

			}
			//return this.sensors.bottom === bodyA || this.sensors.bottom === bodyB
		})
	}

	setSprite(scene: Scene, { x, y, width, height, scale }: Entity) {
		const Bodies = scene.matter.bodies 
		this.sensors = {
			bottom: Bodies.rectangle(width, height + (height/4), width, 1,{isSensor: true}),
			left: Bodies.rectangle(width - (width/2), width, 1, width,{isSensor: true}),
			right: Bodies.rectangle(width + (width/2), width, 1, width,{isSensor: true})
		}
		// ainda é necessário cuidar esses valores 

		const body = Bodies.rectangle(width, width, width, height, { chamfer: { radius: 10 }})
		const compoundBody = scene.matter.body.create({
			parts: [body, this.sensors.bottom, this.sensors.left, this.sensors.right],
		})
		this.sprite = scene.matter.add.sprite(x, y, this.baseTexture, 0)	
		this.sprite.setExistingBody(compoundBody)
		this.sprite.setScale(scale)
		this.sprite.setFixedRotation()
		this.sprite.setFriction(0)
		scene.matter.world.on('collisionactive', this.verifyCollision.bind(this))
		scene.matter.world.on('collisionend', this.verifyCollision.bind(this))
	}
}