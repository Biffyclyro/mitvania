import { Physics, Types } from "phaser"
import { SpriteEntity } from "../entities"
import { extractEntity } from "../engines/entitiesHandler"

interface Skill {
	(se: SpriteEntity): void
}

export const setSide = (sprite: Physics.Matter.Sprite): number => {
	return sprite.flipX ? - sprite.width/2 - 1 : sprite.width/2 + 1
}

const areaSkill = (se: SpriteEntity, 
												texture: string, 
												velocity: number, 
												damage: number, 
												manaCost: number,
												conjurationTime: number,
												area: number) => {

	se.attacking = true	
	setTimeout(() => se.attacking = false, conjurationTime)

	const sprite = se.getSprite()
	if (se.mana - manaCost >= 0 ) {
		if (se.isPlayer) {
			se.mana -= manaCost
			se.getSprite().scene.events.emit('player-skill', manaCost)
		}
		const skill = sprite.scene.matter.add.sprite(sprite.x, sprite.y, texture, 0, {
			ignoreGravity: true,
			label: texture,
			isSensor: true
		})
		skill.setVisible(true)
		skill.setFixedRotation()
		skill.type = 'skill'

		skill.setOnCollide((pair: Types.Physics.Matter.MatterCollisionPair) => {
			const entity = extractEntity(pair)
			if (entity) {
				entity.takeDamage(damage * se.lvl)
			}

			if (!pair.bodyA.isSensor || !pair.bodyB.isSensor) {
				skill.destroy()
			}
		})
	}
}

const throwableSkill = (se: SpriteEntity, 
												texture: string, 
												velocity: number, 
												damage: number, 
												manaCost: number,
												conjurationTime: number ) => {

	se.attacking = true

	setTimeout(() => se.attacking = false, conjurationTime)

	const sprite = se.getSprite()
	if (se.mana - manaCost >= 0) {
		if (se.isPlayer) {
			se.mana -= manaCost
			//se.getSprite().scene.events.emit('player-skill', manaCost)
			sprite.scene.events.emit('player-skill', manaCost)
		}

		const skill = sprite.scene.matter.add.sprite(sprite.x + setSide(sprite), sprite.y, texture, 0, {
			frictionAir: 0,
			ignoreGravity: true,
			label: texture,
			isSensor: true
		})
		skill.setVisible(true)
		skill.setFixedRotation()
		skill.type = 'skill'
		skill.setOnCollide((pair: Types.Physics.Matter.MatterCollisionPair) => {
			const entity = extractEntity(pair)
			if (entity) {
				entity.takeDamage(damage * se.lvl)
			}

			//if (pair.bodyA.label !== 'special' && pair.bodyB.label !== 'special') {

			if (!pair.bodyA.isSensor || !pair.bodyB.isSensor) {
				skill.destroy()
			}
		})
		if (sprite.flipX) {
			skill.setFlipX(true)
			skill.setVelocityX(-velocity)
		} else {
			skill.setVelocityX(velocity)
		}
	}
}


export const skillsMap = new Map<string, Skill>()

skillsMap.set('fire-ball', (se: SpriteEntity) => throwableSkill(se, 'fire-ball', 8, 5, 3, 100))

skillsMap.set('lightning-bolt', (se: SpriteEntity) => throwableSkill(se, 'lightning-bolt', 10, 3, 1, 50))

skillsMap.set('test',  (se: SpriteEntity ) => console.log('atacou'))