import { BodyType } from "matter"
import { Scene, Physics } from "phaser"
import { gameItens } from "./especials/itens"
import { extractEntity, skillsMap, setSide } from "./especials/skills"
import { playerManager, playerSaveStatus } from "./global"

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
	properties: {dmg?: number, defLvl?: number, atkLvl?: number, atkInterval?: number, power?: number}
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
	canMove = false
	jumping = false
	maxJumps = 1
	jumps = this.maxJumps
	velocity = 6
	normalSkill: string = ''
	inventory: string[] = []
	attacking = false
	maxMana: number 
	life: number
	maxLife: number 
	mana: number 
	xp: number
	autoMovement: {distance: number, velocity: number, initPos: number} | undefined
	protected sprite: Physics.Matter.Sprite
	constructor(
		public lvl: number,
		public def: number,
		public isPlayer: boolean,
		public baseTexture: string,
		public direction: Direction = Direction.Right) {
		this.maxMana = this.lvl * 10
		this.mana = this.maxMana
		this.maxLife = this.lvl * 10
		this.life = this.maxLife
		this.isPlayer ? this.xp = 0 : this.xp = this.lvl * 10
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
		if (skill && this.canMove) {
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

	jump() {
		if (this.jumps > 0 && this.canMove) {
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
		if (this.canMove) {
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

	public takeDamage(hit: number) {
		const x = this.sprite.x 
		const y = this.sprite.y 
		this.playAnims(`${this.baseTexture}-damage`)
		const damage = hit / this.lvl
		this.life -= damage 
		if (this.isPlayer) {this.sprite.scene.events.emit('player-damage', damage)}
		//need to choose a text style 
		const text = this.sprite.scene.add.text(x, y - this.sprite.height, String(damage))
		const interval = setInterval(() => text.setPosition(text.x, text.y - 3), 100)	
		setTimeout(() => {
			clearInterval(interval)
			text.destroy()	
		}, 1000);
		if (this.life < 1) {
			this.defeat()	
			//this.canMove = false
		}
	}

	protected dropItem(itemKey: string) {
		const fliped = this.sprite.flipX
		const x = fliped ? this.sprite.x - this.sprite.width * 1.5 : this.sprite.x + this.sprite.width * 1.5
		
		const item = this.sprite.scene.matter.add.image(x, this.sprite.y, itemKey, 0, {label: 'item'} )
		item.setVelocityX(fliped ? -5 : 5)
		item.setFixedRotation()
		item.setAngle(135)
		setTimeout(() => item.destroy(), 5000)
		item.setOnCollide(({bodyA, bodyB}: Phaser.Types.Physics.Matter.MatterCollisionPair) => {
			if (!bodyA.isSensor && !bodyB.isSensor) {
				const p = { bodyA: bodyA.parent, bodyB: bodyB.parent }
				const entity = extractEntity(p)
				if (entity && entity.getSprite().body.label === 'player') {
					item.destroy()
					entity.switchItem(itemKey)
				}
			}
		})
	}

	private defeat() {
		if (!this.isPlayer) {
			this.dropItem(this.inventory[0])
			this.sprite.destroy()
			playerManager.player.collectXp(this.xp)
		} else {
			this.sprite.scene.scene.stop()
		}
	}
}

export class Player extends SpriteEntity {
	sensors: Sensors
	specialSkill: string = ''
	weapon: string 
	
	collectXp(xp: number) {
		const total = this.xp + xp
		if (total >= this.lvl * 100) {
			this.xp = total - this.lvl * 100 
			this.lvlUp()
		} else {
			this.xp += xp
		}
	}

	lvlUp() {
		const scene = this.sprite.scene
		this.lvl++
		this.maxMana = this.lvl * 10
		this.mana = this.maxMana
		this.maxLife = this.lvl * 10
		this.life = this.maxLife
		scene.matter.pause()
		const lvlUpText = scene.add.text(this.sprite.x, this.sprite.y - this.sprite.height, 'LVL UP') 
		lvlUpText.setOrigin(0.5)
		setTimeout(() => {
			lvlUpText.destroy()
			scene.matter.resume()
		}, 3000)
	}
	
	attack() {
		if (this.weapon && !this.attacking && this.canMove) {
			this.attacking = true
			const scene = this.sprite.scene
			const wp = gameItens.get(this.weapon)
			const x = this.sprite.x + setSide(this.sprite)
			const weaponSprite = this.sprite.scene.matter.add.sprite(x, this.sprite.y, this.weapon, 0, {ignoreGravity: true})
			const pointsJoint = {pointA: this.sprite.getCenter(), pointB: weaponSprite.getCenter()} 
			if (this.sprite.flipX) {weaponSprite.setFlipX(true)}
			weaponSprite.setFixedRotation()
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
			}, wp!.properties.atkInterval! * 500)
		}
	}
	//muito cuidado com esse método e os valores dele
	setSprite(scene: Scene, { x, y, width, height, scale }: Entity) {
		const Bodies = scene.matter.bodies 
		this.sensors = {
			bottom: Bodies.rectangle(0, 0 + (height/2), width/2.5, 1, {isSensor: true}),
			left: Bodies.rectangle(0 - (width/2), 0, 1, width, {isSensor: true}),
			right: Bodies.rectangle(0 + (width/2), 0, 1, width, {isSensor: true})
		}
		this.sensors.bottom.onCollideActiveCallback = this.resetJump.bind(this)
		this.sensors.bottom.onCollideEndCallback = () => {
			this.jumps--
			this.jumping = true
		}
		// this.sensors.bottom.collisionFilter.group = -3
		// this.sensors.left.collisionFilter.group = -3
		// this.sensors.right.collisionFilter.group = -3

		// ainda é necessário cuidar esses valores 
		const body = Bodies.rectangle(0, 0, width, height, {chamfer: { radius: 10 }})
		const compoundBody = scene.matter.body.create({
			parts: [body, this.sensors.bottom, this.sensors.left, this.sensors.right],
			label: 'player'
		})
		this.sprite = scene.matter.add.sprite(0, 0, this.baseTexture, 0)
		this.sprite.setExistingBody(compoundBody)
		this.sprite.setPosition(x,y)
		this.sprite.setOrigin(0.5, 0.5)
		scale ? this.sprite.setScale(scale) : scale 
		this.sprite.setFixedRotation()
		this.sprite.setFriction(0)
		this.sprite.setData('entity', this)
		//scene.matter.world.on('collisionactive', this.verifyCollision.bind(this))
		//scene.matter.world.on('collisionend', this.verifyCollision.bind(this))
	}

	switchItem(newItem: string, isSkill=false) {
		if (isSkill) {
			this.dropItem(this.normalSkill)
			this.normalSkill = newItem
		} else {
			this.dropItem(this.weapon)
			this.weapon = newItem
		}
	}

	getSaveStatus(): playerSaveStatus {
		return {
			lvl: this.lvl, 
			weapon: this.weapon,
			specialSkill: this.specialSkill,
			maxJumps: this.maxJumps, 
			inventory: this.inventory,
			normalSkill: this.normalSkill,
			position: {x: this.getSprite().x, y: this.getSprite().y}
		}
	}
}