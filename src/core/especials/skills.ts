import { BodyType } from "matter"
import { Physics } from "phaser"
import { Player, SpriteEntity } from "../entities"

interface Skill {
	(se: SpriteEntity): void
}

export const setSide = (sprite: Physics.Matter.Sprite): number => {
	return sprite.flipX ? - sprite.width/2 - 1 : sprite.width/2 + 1
}

//retornando a entidade quando uma colisão envolve um sprite, tipagem trocada de pair para objeto com 2 BodyType
export const extractEntity = ({ bodyA, bodyB }: { bodyA: BodyType, bodyB: BodyType }) => {
	if (bodyA.label === 'sprite' || bodyA.label === 'player') {
		return bodyA.gameObject.getData('entity')
	}
	if (bodyB.label === 'sprite' || bodyB.label === 'player') {
		return bodyB.gameObject.getData('entity')
	}
	return 
}

const throwableSkill = (se: SpriteEntity, texture: string, velocity: number, damage: number, manaCost: number) => {
	const sprite = se.getSprite()
	if (se.mana - manaCost >= 0) {
		if (se.isPlayer) {
			se.mana -= manaCost
			se.getSprite().scene.events.emit('player-skill', manaCost)
		}

		const fireBall = sprite.scene.matter.add.sprite(sprite.x + setSide(sprite), sprite.y, texture, 0, {
			frictionAir: 0,
			ignoreGravity: true,
			label: texture
		})

		fireBall.setFixedRotation()
		fireBall.type = 'skill'
		fireBall.setOnCollide((pair: Phaser.Types.Physics.Matter.MatterCollisionPair) => {
			const entity = extractEntity(pair)
			if (entity) {
				entity.takeDamage(damage * se.lvl)
			}
			fireBall.destroy()
		})
		if (sprite.flipX) {
			fireBall.setFlipX(true)
			fireBall.setVelocityX(-velocity)
		} else {
			fireBall.setVelocityX(velocity)
		}
	}
}

export const skillsMap = new Map<string, Skill>()

skillsMap.set('fire-ball', (se: SpriteEntity) => throwableSkill(se, 'fire-ball', 8, 5, 3) )

skillsMap.set('lightning-bolt', (se: SpriteEntity) => throwableSkill(se, 'lightning-bolt', 10, 3, 1)	)