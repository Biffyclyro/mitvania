import { Direction, Player, SpriteEntity } from "../entities";
import { MobConfig, mobsConfigMap } from "../especials/mobsConfig";
import { commands } from "./command";

export default class MobSpawner {
	private readonly moblist: SpriteEntity[] = []
	private readonly mobConfig: MobConfig
	private readonly mobKey: string
	private readonly qtd: number
	
	constructor(private readonly scene: Phaser.Scene,
							private readonly obj: Phaser.Types.Tilemaps.TiledObject) {
							
			this.mobKey = this.obj.properties[0].value
			this.mobConfig = mobsConfigMap.get(this.mobKey)!
			this.qtd = this.obj.properties[1].value

			for (let i = 0; i < this.qtd; i++) {
				this.moblist.push(this.spawnMob())
			}
		}


	private spawnMob(): SpriteEntity {
		const mob = new SpriteEntity(1, 25, false, this.mobKey)
		mob.velocity = 3
		mob.inventory = this.mobConfig.inventory
		mob.setSprite(this.scene, { x: this.obj.x!, y: this.obj.y!, width: 23, height: 32 })
		mob.autoMovement = {distance: 1000, initPos: mob.getSprite().x}
		mob.canMove = true
		mob.getSprite().setOnCollide(({bodyA, bodyB}: Phaser.Types.Physics.Matter.MatterCollisionPair) => {
			const hit = (player: Player) => {player.takeDamage(mob.lvl)}
			if (bodyA.parent.label === 'player' || bodyB.parent.label === 'player') {
				bodyA.parent.label === 'player' ? hit(bodyA.gameObject.getData('entity')) : hit(bodyB.gameObject.getData('entity'))
			} else {
				if (bodyA.isStatic || bodyB.isStatic) {
					const velocityX = mob.getSprite().body.velocity.x
					if (mob.direction === Direction.Right && velocityX > 0) {
						mob.direction = Direction.Left
					}
					if (mob.direction === Direction.Left && velocityX < 0) {
						mob.direction = Direction.Right
					}
				}
			}
		})
		return mob
	}

	moveMobs() {
		this.moblist.forEach(mob => {
			const sprite = mob.getSprite()
			if (sprite && mob.canMove) {
				commands.get('move')!(mob)
				if (sprite.x >= mob.autoMovement!.initPos + mob.autoMovement!.distance) {
					mob.direction = Direction.Left
				}
				if (sprite.x <= mob.autoMovement!.initPos - mob.autoMovement!.distance) {
					mob.direction = Direction.Right
				}
			} else {
				const index = this.moblist.indexOf(mob)
				this.moblist.splice(index, 1)
				setTimeout(() => this.spawnMob(), 5000)
			}
		})
	}
}
