import { BodyType } from "matter"
import { Scene, Physics } from "phaser"
import { gameItens } from "./especials/itens"
import { extractEntity, skillsMap, setSide } from "./especials/skills"

//provavelmente não será útil 
export interface Entity {
	x: number
	y: number
	width: number
	height: number
	scale?: number
}

//remover assim que se confirmar a inutilidade disso
export interface BodyOffset {
	centerOffset: {x: number, y: number}
}

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right'
}

interface Sensors{
	bottom: MatterJS.BodyType
	left: MatterJS.BodyType
	right: MatterJS.BodyType
}

export interface Item {
	type: string
	description: string
	properties: {dmg?: number, defLvl?: number, atkLvl?: number, atkInterval: number}
	dropRate: number
}

export interface Weapon extends Item {
	properties: {dmg: number, atkInterval: number}	
}

//ainda avaliando se isso realmente vai ser usado
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
	normalSkill: string = ''
	inventory: string[] = []
	attacking = false
	defeat: (() => void) | undefined
	protected sprite: Physics.Matter.Sprite
	constructor(public life: number,
		public mana: number,
		public def: number,
		public stats: Stats,
		public baseTexture: string,
		public direction: Direction = Direction.Right) {
	}

	setSprite(scene: Scene, { x, y, width, height, scale }: Entity) {
		this.sprite = scene.matter.add.sprite(x, y, this.baseTexture, 69)
		if (width && height) {
			this.sprite.setRectangle(width, height, {label: 'sprite'})
			scale ? this.sprite.setScale(scale) : scale
			this.sprite.setFixedRotation()
		}
		scene.matter.world.on('collisionactive', this.resetJump.bind(this))
		this.sprite.setData('entity', this)
	}

	useNormalSkill() {
		const skill = skillsMap.get(this.normalSkill)
		if (skill) {
			skill(this)
		}
	}

	getSprite(): Physics.Matter.Sprite {
		return this.sprite
	}

	private playAnims(anim: string) {
		if (!this.sprite.anims.isPlaying) {
			this.sprite.anims.play(anim, true)
		} else if (this.sprite.anims.currentAnim.key !== `${this.baseTexture}-damage`) {
			this.sprite.anims.play(anim, true)
		}
	}

	idle() {
		this.sprite.setVelocityX(0)
		this.playAnims(`${this.baseTexture}-idle`)
	}

	lvlUp() {
		this.lvl++
	}

	jump() {
		if (this.jumps > 0) {
			this.jumps--
			this.sprite.setVelocityY(-10)
		}
		this.playAnims(`${this.baseTexture}-jump`)
	}

	resetJump() {
		this.jumps = this.maxJumps
		this.jumping = false
	}

	move(direction: Direction) {
		// durante o ataque não flipa o sprite
		const movements = {
			Left: () => {
				if (!this.attacking) {this.sprite.setFlipX(true)}
				this.sprite.setVelocityX(-this.velocity)
				if (this.jumping) {
					this.playAnims(`${this.baseTexture}-jump`)
				} else {
					this.playAnims(`${this.baseTexture}-moving`)
				}
			},
			Right: () => {
				if (!this.attacking) {this.sprite.resetFlip()}
				
				this.sprite.setVelocityX(this.velocity)
				if (this.jumping) {
					this.playAnims(`${this.baseTexture}-jump`)
				} else {
					this.playAnims(`${this.baseTexture}-moving`)
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

	public takeDamage(damage: number) {
		this.playAnims(`${this.baseTexture}-damage`)
		this.life -= damage / this.lvl
		if (this.life < 1) {
			this.sprite.destroy()
		}
	}
}

export class Player extends SpriteEntity {
	sensors: Sensors
	specialSkill: string = ''
	weapon: string 
	
	attack() {
		if (this.weapon, !this.attacking) {
			this.attacking = true
			const scene = this.sprite.scene
			const wp = gameItens.get(this.weapon)
			const x = this.sprite.x + setSide(this.sprite)
			const weaponSprite = this.sprite.scene.matter.add.sprite(x, this.sprite.y, this.weapon, 0, {ignoreGravity: true})
			const pointsJoint = {pointA: this.sprite.getCenter(), pointB: weaponSprite.getCenter()} 
			if (this.sprite.flipX) {weaponSprite.setFlipX(true)}
			weaponSprite.setFixedRotation()
			weaponSprite.setCollisionGroup(-1)
			weaponSprite.setCollisionGroup(-2)
			const joint = scene.matter.add.joint(weaponSprite.body as BodyType, this.sprite.body as BodyType, 0, 0, pointsJoint)
			weaponSprite.setOnCollide((pair: Phaser.Types.Physics.Matter.MatterCollisionPair) => {
				const entity = extractEntity(pair)
				if (entity) {
					entity.takeDamage(wp!.properties.dmg)
				}
			})	
			setTimeout(() => {
				weaponSprite.destroy()
				scene.matter.world.removeConstraint(joint)
				this.attacking = false
			}, wp!.properties.atkInterval * 500)
		}
	}

	setSprite(scene: Scene, { x, y, width, height, scale }: Entity) {
		const Bodies = scene.matter.bodies 
		this.sensors = {
			bottom: Bodies.rectangle(width, height + (height/4), width/2, 1, {isSensor: true}),
			left: Bodies.rectangle(width - (width/2), width, 1, width, {isSensor: true}),
			right: Bodies.rectangle(width + (width/2), width, 1, width, {isSensor: true})
		}
		this.sensors.bottom.onCollideActiveCallback = this.resetJump.bind(this)
		this.sensors.bottom.onCollideEndCallback = () => {
			this.jumps--
			this.jumping = true
		}

		// ainda é necessário cuidar esses valores 
		const body = Bodies.rectangle(width, width, width, height, { chamfer: { radius: 10 }})
		const compoundBody = scene.matter.body.create({
			parts: [body, this.sensors.bottom, this.sensors.left, this.sensors.right],
		})
		this.sprite = scene.matter.add.sprite(x, y, this.baseTexture, 0, {label: 'sprite'})	
		this.sprite.setExistingBody(compoundBody)
		scale ? this.sprite.setScale(scale) : scale 
		this.sprite.setFixedRotation()
		this.sprite.setFriction(0)
		this.sprite.setData('entity', this)
		//scene.matter.world.on('collisionactive', this.verifyCollision.bind(this))
		//scene.matter.world.on('collisionend', this.verifyCollision.bind(this))
	}
}