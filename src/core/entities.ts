import {Scene, Physics } from "phaser"

export interface Entity {
	x: number
	y: number
	width: number
	height: number
	scale?: number
	// point?: boolean
	// ellipse?: boolean
	// polygon?: Phaser.Types.Math.Vector2Like[] 
}

export interface BodyOffset {
	centerOffset: {x: number, y: number}
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
		jumping = false
		maxJumps = 1
		jumps = this.maxJumps 
		velocity = 6
		attack: (() => void ) | undefined
		defeat: (() => void ) | undefined
		protected sprite: Physics.Matter.Sprite
		constructor(public life: number, 
								public mana:number, 
								public stats: Stats,
								public baseTexture: string,
								public direction: Direction = Direction.Right) {
		}

	setSprite(scene: Scene, { x, y, width, height, scale }: Entity) {
		this.sprite = scene.matter.add.sprite(x, y, this.baseTexture, 69)
		if (width && height ) {
			this.sprite.setRectangle(width, height)
			scale ? this.sprite.setScale(scale) : scale
			this.sprite.setFixedRotation()
		}
		scene.matter.world.on('collisionactive', this.resetJump.bind(this))
	}

	getSprite(): Physics.Matter.Sprite {
		return this.sprite
	}

	idle() {
		this.sprite.setVelocityX(0)
		this.sprite.anims.play(`${this.baseTexture}-idle`, true)
	}

	up() {
		this.lvl++
	}

	jump() {
		if (this.jumps > 0) {
			this.jumps--
			this.sprite.setVelocityY(-10)
		}
		this.sprite.anims.play(`${this.baseTexture}-jump`, true)
	}

	resetJump() {
		this.jumps = this.maxJumps	
		this.jumping = false
	}
	
	move(direction: Direction) {
		const movements = {
			Left: () => {
				this.sprite.setFlipX(true)
				this.sprite.setVelocityX(-this.velocity)
				if (this.jumping) {
					this.sprite.anims.play(`${this.baseTexture}-jump`, true)
				} else {
					this.sprite.anims.play(`${this.baseTexture}-moving`, true)
				}
			},
			Right: () => {
				this.sprite.resetFlip()
				this.sprite.setVelocityX(this.velocity)
				if (this.jumping) {
					this.sprite.anims.play(`${this.baseTexture}-jump`, true)
				} else {
					this.sprite.anims.play(`${this.baseTexture}-moving`, true)
				}
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


	public takeDamage() {
	}
}

export class Player extends SpriteEntity {
	sensors: Sensors
	specialAttack: (() => void) | undefined
	inventory: Item[] = [] 

	setSprite(scene: Scene, { x, y, width, height, scale }: Entity) {
		const Bodies = scene.matter.bodies 
		this.sensors = {
			bottom: Bodies.rectangle(width, height + (height/4), width/3, 1,{isSensor: true}),
			left: Bodies.rectangle(width - (width/2), width, 1, width,{isSensor: true}),
			right: Bodies.rectangle(width + (width/2), width, 1, width,{isSensor: true})
		}
		this.sensors.bottom.onCollideActiveCallback = this.resetJump.bind(this)
		this.sensors.bottom.onCollideEndCallback = () => {
			this.jumps--
			this.jumping = true
		}

		this.sensors.bottom.isSensor = true
		this.sensors.left.isSensor = true
		this.sensors.right.isSensor = true
		// ainda é necessário cuidar esses valores 

		const body = Bodies.rectangle(width, width, width, height, { chamfer: { radius: 10 }})
		const compoundBody = scene.matter.body.create({
			parts: [body, this.sensors.bottom, this.sensors.left, this.sensors.right],
		})
		this.sprite = scene.matter.add.sprite(x, y, this.baseTexture, 0)	
		this.sprite.setExistingBody(compoundBody)
		scale ? this.sprite.setScale(scale) : scale 
		//this.sprite.setScale(scale)
		this.sprite.setFixedRotation()
		this.sprite.setFriction(0)
		//scene.matter.world.on('collisionactive', this.verifyCollision.bind(this))
		//scene.matter.world.on('collisionend', this.verifyCollision.bind(this))
	}
}