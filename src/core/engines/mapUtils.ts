import { Physics, Scene, Types } from "phaser"
import { Direction } from "../entities"
import { extractEntity } from "./entitiesHandler"

interface Movement {x: number, y: number, velocity: number}

export class Plataform {
	private readonly plataformSprite: Physics.Matter.Image
	private readonly plataformObj: Physics.Matter.Image
	private readonly movement: Movement 
	private readonly initPos: {x: number, y: number}
	private direction: Direction

	constructor(plataformSprite: Physics.Matter.Image, movement: Movement) {
		this.plataformSprite = plataformSprite
		this.plataformObj = plataformSprite
		this.plataformObj.setStatic(true)
		//this.plataformObj.setFriction(1, 0, Infinity)
		this.plataformObj.setOnCollideActive((pair: Types.Physics.Matter.MatterCollisionPair) => {
			const possibleEntity = extractEntity(pair)
			if (possibleEntity) {
				
				possibleEntity.isMoving = false
				this.moveEntity(possibleEntity.getSprite())
			}
		})
		this.plataformObj.setOnCollideEnd((pair: Types.Physics.Matter.MatterCollisionPair) => {
			const possibleEntity = extractEntity(pair)
			if (possibleEntity) {
				possibleEntity.isMoving = true 
			}
		})
		// this.plataformSprite.setIgnoreGravity(true)
		// this.plataformSprite.setFixedRotation()
		// this.plataformSprite.setMass(10000000)
		this.initPos = {x: plataformSprite.x, y: plataformSprite.y}

		if (movement) {
			this.movement = movement
			// if (this.movement.x > 0) {
			// 	Math.random() > 0.5 ? this.plataformSprite.x += movement.x : this.plataformSprite.x -= this.movement.x
			// } else if (this.movement.y > 0) {

			// 	Math.random() > 0.5 ? this.plataformSprite.y += this.movement.y : this.plataformSprite.y -= this.movement.y 
			// }

			if ( this.movement.x > 0 ) {
				Math.random() > 0.5 ? this.direction = Direction.Right : this.direction = Direction.Left
			} 
		}
	}

	moveHorizontally() {
		this.plataformObj.scene.tweens.addCounter({
			from: 0,
			to: -300,
			duration: 1500,
			ease: Phaser.Math.Easing.Sine.InOut,
			repeat: -1,
			yoyo: true,
			onUpdate: (tween, target) => {
				const x = this.initPos.x + target.value
				const dx = x - this.plataformObj.x
				this.plataformObj.x = x
				this.plataformObj.setVelocityX(dx)
			}
		})
	}

	autoMovement() {
		if( this.direction === Direction.Left) {
			this.plataformSprite.setVelocityX(-this.movement.velocity)
			if ( this.plataformSprite.x <= this.initPos.x - this.movement.x) {
				this.direction = Direction.Right
			}
		} else if (this.direction === Direction.Right) {
			this.plataformSprite.setVelocityX(this.movement.velocity)
			if (this.plataformSprite.x >= this.initPos.x + this.movement.x) {
				this.direction = Direction.Left
			}
		}
		// if (this.movement.x != 0) {
		// 	if (this.plataformSprite.x <= this.initPos.x - this.movement.x) {
		// 		this.plataformSprite.setVelocityX(this.movement.velocity)
		// 	} else if (this.plataformSprite.x >= this.initPos.x + this.movement.x) {
		// 		this.plataformSprite.setVelocityX(-this.movement.velocity)
		// 	}
		// } else {
		// 	this.plataformSprite.x = this.initPos.x
		// }

		if (this.movement.y != 0) {
			if (this.plataformSprite.y <= this.initPos.y - this.movement.y) {
				this.plataformSprite.setVelocityY(this.movement.velocity)
			} else if (this.plataformSprite.y >= this.initPos.y + this.movement.y) {
				this.plataformSprite.setVelocityY(-this.movement.velocity)
			}
		} else {
			this.plataformSprite.y = this.initPos.y
		}
	}

	moveEntity(sprite: Physics.Matter.Sprite) {
		sprite.setVelocity(this.plataformObj.body.velocity.x, this.plataformObj.body.velocity.y)
		//sprite.setPosition(this.plataformObj.x, this.plataformObj.y)
	}

	stop() {
		this.plataformSprite.setVelocity(0, 0)
	}

}