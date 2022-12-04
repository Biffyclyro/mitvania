import { Scene } from "phaser";
import { Direction, Player, SpriteEntity } from "../entities";
import { MobConfig, mobsConfigMap } from "../especials/mobsConfig";
import { commands } from "./command";

export class MobSpawner {
	private readonly moblist: SpriteEntity[] = []
	private readonly mobConfig: MobConfig
	private readonly mobKey: string
	private readonly qtd: number
	private readonly mobLvl: number
	private readonly respawn: boolean

	constructor(private readonly scene: Scene,
							private readonly obj: Phaser.Types.Tilemaps.TiledObject) {
							
			this.mobKey = this.obj.properties[1].value
			this.mobConfig = mobsConfigMap.get(this.mobKey)!
			this.qtd = this.obj.properties[2].value
			this.mobLvl = this.obj.properties[0].value
			this.respawn = this.obj.properties[3].value

			for (let i = 0; i < this.qtd; i++) {
				this.moblist.push(this.spawnMob())
			}
		}


	private spawnMob(): SpriteEntity {
		 const rnd = Math.random()
		// const mob = new SpriteEntity(1, 25, false, this.mobKey)
		// mob.velocity = 3
		// mob.inventory = this.mobConfig.inventory
		 const distRange = rnd * this.mobConfig.behaveInfos.distance 
		 const x = rnd > 0.5 ? this.obj.x! + distRange :this.obj.x! + distRange * -1
		// mob.setSprite(this.scene, { x, y: this.obj.y!, width: 23, height: 32 })
		// mob.behaveor = {distance: 1000, initPos: mob.getSprite().x}
		// mob.canMove = true
		// rnd > 0.5 ? mob.direction = Direction.Right : mob.direction = Direction.Left
		// console.log(mob.direction)
		// const sprite = mob.getSprite()
		// sprite.setCollisionGroup(-5)
		// const changeDirection = () => {
		// 	const velocityX = mob.getSprite().body.velocity.x
		// 	if (mob.direction === Direction.Right && velocityX > 0) {
		// 		mob.direction = Direction.Left
		// 	}
		// 	if (mob.direction === Direction.Left && velocityX < 0) {
		// 		mob.direction = Direction.Right
		// 	}
		// }
		// sprite.setOnCollide(({ bodyA, bodyB }: Phaser.Types.Physics.Matter.MatterCollisionPair) => {
		// 	const hit = (player: Player) => { player.takeDamage(mob.lvl) }
		// 	if (bodyA.parent.label === 'player' || bodyB.parent.label === 'player') {
		// 		bodyA.parent.label === 'player' ? hit(bodyA.gameObject.getData('entity')) : hit(bodyB.gameObject.getData('entity'))
		// 		changeDirection()
		// 	} //else {
		// 	if (bodyA.isStatic || bodyB.isStatic ) {
		// 		changeDirection()	
		// 	}
		// 	//}
		// })
		const mob = mobFactory(this.scene, this.mobKey, this.mobLvl, x, this.obj.y!)
		mob.behaveor!.initPos = this.obj.x!
		return mob
	}

	moveMobs() {
		this.moblist.forEach(mob => {
			const sprite = mob.getSprite()
			if (sprite && mob.canMove) {
				commands.get('move')!(mob)
				if (mob.behaveor?.fly) {
					autoFly(mob)
				}
				if (sprite.x >= mob.behaveor!.initPos! + mob.behaveor!.distance) {
					mob.direction = Direction.Left
				}
				if (sprite.x <= mob.behaveor!.initPos! - mob.behaveor!.distance) {
					mob.direction = Direction.Right
				}
			} else {
				const index = this.moblist.indexOf(mob)
				this.moblist.splice(index, 1)
				if (this.respawn) {
					setTimeout(() => this.moblist.push(this.spawnMob()), 5000)
				}
			}
		})
	}
}

export const mobFactory = (scene: Scene, 
													 mobKey: string,
													 lvl: number,
													 x: number,
													 y: number): SpriteEntity => {

	const rnd = Math.random()
	const mobConfigs = mobsConfigMap.get(mobKey)!
	const mob = new SpriteEntity(lvl, 25, false, mobKey)
	mob.velocity = mobConfigs.velocity
	mob.inventory = mobConfigs.inventory
	mob.setSprite(scene, { x, y, width: 23, height: 32 })
	mob.behaveor = mobConfigs.behaveInfos
	const sprite = mob.getSprite()
	if (mob.behaveor.fly){
		sprite.setIgnoreGravity(true)
		mob.behaveor.fly.initHight = y
		mob.behaveor.fly.speed = Math.random() > 0.5 ? mob.behaveor.fly.speed : mob.behaveor.fly.speed *-1
	}
	mob.canMove = true
	rnd > 0.5 ? mob.direction = Direction.Right : mob.direction = Direction.Left
	sprite.setCollisionGroup(-5)
	const changeDirection = () => {
		const velocityX = mob.getSprite().body.velocity.x
		if (mob.direction === Direction.Right && velocityX > 0) {
			mob.direction = Direction.Left
		}
		if (mob.direction === Direction.Left && velocityX < 0) {
			mob.direction = Direction.Right
		}
	}
	sprite.setOnCollide(({ bodyA, bodyB }: Phaser.Types.Physics.Matter.MatterCollisionPair) => {
		const hit = (player: Player) => { player.takeDamage(mob.lvl) }
		if (bodyA.parent.label === 'player' || bodyB.parent.label === 'player') {
			bodyA.parent.label === 'player' ? hit(bodyA.gameObject.getData('entity')) : hit(bodyB.gameObject.getData('entity'))
			changeDirection()
		} 
		if (bodyA.isStatic || bodyB.isStatic) {
			changeDirection()
			if (mob.behaveor?.fly){
				mob.behaveor.fly.speed *= -1
			}
		}
	})
	return mob
}

export const autoFly = (se: SpriteEntity) => {
	if (se.behaveor?.fly) {
		const sprite = se.getSprite()
		const movement = se.behaveor!.fly!.speed
		sprite.setVelocityY(movement)
		if (sprite.y <= se.behaveor.fly.initHight! - se.behaveor.fly.distance && sprite.body.velocity.y < 0) {
			se.behaveor.fly.speed *= -1
		}
		if (sprite.y >= se.behaveor.fly.initHight! + se.behaveor.fly.distance && sprite.body.velocity.y > 0) {
			se.behaveor.fly.speed *= -1
		}
	}
}


