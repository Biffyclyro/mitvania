import { Physics } from "phaser"
import { SpriteEntity } from "../entities"

interface Skill {
	(se: SpriteEntity): void
}

export const setSide = (sprite: Physics.Matter.Sprite): number => {
	return sprite.flipX ? - sprite.width/2 - 1 : sprite.width/2 + 1
}

//retornando a entidade quando uma colisão envolve um sprite
export const extractEntity = ({ bodyA, bodyB }: Phaser.Types.Physics.Matter.MatterCollisionPair) => {
	if (bodyA.label === 'sprite' || bodyA.label === 'player' ) {
		return bodyA.gameObject.getData('entity')
	}
	if (bodyB.label === 'sprite' || bodyB.label === 'player') {
		return bodyB.gameObject.getData('entity')
	}
	return undefined
}

const throwableSkill = (se: SpriteEntity, texture: string, velocity: number, damage: number) => {
	const sprite = se.getSprite()
	const fireBall = sprite.scene.matter.add.sprite(sprite.x + setSide(sprite), sprite.y, texture, 0, { frictionAir: 0, 
																																																			ignoreGravity: true, 
																																																			label: texture })
	fireBall.setFixedRotation()
	fireBall.type = 'skill'
	fireBall.setOnCollide((pair: Phaser.Types.Physics.Matter.MatterCollisionPair) => {
		const entity = extractEntity(pair)
		if (entity)	{
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

export const skillsMap = new Map<string, Skill>()

skillsMap.set('fire-ball', (se: SpriteEntity) => throwableSkill(se, 'fire-ball', 8, 5) )

skillsMap.set('lightning-bolt', (se: SpriteEntity) => throwableSkill(se, 'lightning-bolt', 10, 3)	)