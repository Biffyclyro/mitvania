import { BodyType } from "matter";
import { Scene, Types } from "phaser";
import { Direction, Player, SpriteEntity } from "../entities";
import { MobConfig, mobsConfigMap } from "../especials/mobsConfig";
import { playerManager } from "../global";
import { command } from "./command";

export class MobSpawner {
	private readonly moblist: SpriteEntity[] = []
	private readonly mobConfig: MobConfig
	private readonly mobKey: string
	private readonly qtd: number
	private readonly mobLvl: number
	private readonly respawn: boolean
	private readonly mobController = new MobBehaviorController()

	constructor(private readonly scene: Scene,
							private readonly obj: Types.Tilemaps.TiledObject) {

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
		const  x = rnd > 0.5 ? this.obj.x! + distRange : this.obj.x! + distRange * -1
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
		mob.behaveor!.initPos = x!
		return mob
	}

	moveMobs() {
		this.moblist.forEach(mob => {
			// if (sprite && mob.canMove) {
			// 	commands.get('move')!(mob)
			// 	if (mob.behaveor?.fly) {
			// 		autoFly(mob)
			// 	}
			// 	if (sprite.x >= mob.behaveor!.initPos! + mob.behaveor!.distance) {
			// 		mob.direction = Direction.Left
			// 	}
			// 	if (sprite.x <= mob.behaveor!.initPos! - mob.behaveor!.distance) {
			// 		mob.direction = Direction.Right
			// 	}
			// } else {
			// 	const index = this.moblist.indexOf(mob)
			// 	this.moblist.splice(index, 1)
			if (mob.getSprite() && mob.alive) {
				this.mobController.moveMob(mob)
			} else {
				const index = this.moblist.indexOf(mob)
				this.moblist.splice(index, 1)
				if (this.respawn) {
					setTimeout(() => this.moblist.push(this.spawnMob()), 5000)
				}
			}
		})
	}
	
	stopAllMobs() {
		this.moblist.forEach(m => m.canMove = false)
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
	const mobController = new MobBehaviorController()
	mob.velocity = mobConfigs.velocity
	mob.inventory = mobConfigs.inventory
	mob.behaveor = mobConfigs.behaveInfos

	if (mob.behaveor.seekPlayer) {
		mob.setSprite(scene, { x, y, width: 23, height: 64 }, mob.behaveor.distance / 3)
		mobController.seekPlayer(mob)
	} else {
		mob.setSprite(scene, { x, y, width: 23, height: 64 })
	}

	const sprite = mob.getSprite()

	if (mob.behaveor.fly) {
		sprite.setIgnoreGravity(true)
		mob.behaveor.fly.initHight = y
		mob.behaveor.fly.speed = Math.random() > 0.5 ? mob.behaveor.fly.speed : mob.behaveor.fly.speed * -1
	}

	mob.canMove = true
	rnd > 0.5 ? mob.direction = Direction.Right : mob.direction = Direction.Left
	//sprite.setCollisionGroup(-5)
	
	// sprite.setOnCollide(({ bodyA, bodyB }: Phaser.Types.Physics.Matter.MatterCollisionPair) => {
	// 	console.log('ue')
	// 	const hit = (player: Player) => { player.takeDamage(mob.lvl) }
	// 	if (bodyA.parent.label === 'player' || bodyB.parent.label === 'player') {
	// 		bodyA.parent.label === 'player' ? hit(bodyA.gameObject.getData('entity')) : hit(bodyB.gameObject.getData('entity'))
	// 		mobController.changeDirection(mob)
	// 	} 
	// 	if (bodyA.isStatic || bodyB.isStatic) {
	// 		mobController.changeDirection(mob)
	// 		if (mob.behaveor?.fly){
	// 			mob.behaveor.fly.speed *= -1
	// 		}
	// 	}
	// })

	//sprite.setOnCollide(mobController.mobCollisionHandler.bind(mobController))
	mob.getSprite().setCollisionGroup(-5)
	mob.mainBody.onCollideCallback =  mobController.playerInteraction.bind(mobController) 
	mob.sensors.left.onCollideCallback = mobController.mobCollisionHandler.bind(mobController)
	mob.sensors.right.onCollideCallback = mobController.mobCollisionHandler.bind(mobController)
	return mob
}

export class MobBehaviorController {
	private static readonly INSTANCE = new MobBehaviorController()

	constructor() {
		if (MobBehaviorController.INSTANCE) {
			return MobBehaviorController.INSTANCE
		}
	}

	moveMob(mob: SpriteEntity) {
		const sprite = mob.getSprite()
		if (mob.canMove) {
			command['move'](mob)
			if (mob.behaveor?.fly) {
				this.autoFly(mob)
			}
			if (sprite.x >= mob.behaveor!.initPos! + mob.behaveor!.distance) {
				mob.direction = Direction.Left
			}
			if (sprite.x <= mob.behaveor!.initPos! - mob.behaveor!.distance) {
				mob.direction = Direction.Right
			}
		}
	}

	seekPlayer(mob: SpriteEntity)  {
		
		const sprite = mob.getSprite()
		// const scene = sprite.scene
	
		// const Bodies = scene.matter.bodies 

		// const areaSensor = Bodies.circle(0, 0, 100, { isSensor: true })

	 //areaSensor.onCollideCallback = seek

		// const body = Bodies.rectangle(0, 0, 23, 32,)

		//mob.mainBody.onCollideCallback = this.mobCollisionHandler.bind(this)
		//sprite.setOnCollide(this.mobCollisionHandler.bind(this))

		// const compoundBody = scene.matter.body.create({
		// 	parts: [body, areaSensor ],
		// 	label: 'sprite'
		// })
		// const {x,y} = sprite
		// sprite.setExistingBody(compoundBody)
		// sprite.setPosition(x,y)
		// sprite.setOrigin(0.5, 0.5)
		// sprite.setFixedRotation()

		//onst baseObj = scene.add.circle(sprite.x, sprite.y, 100)
		// const areaSensor = scene.matter.add.gameObject(baseObj,
		// 	{
		// 		circleRadius: 100,
		// 		isSensor: true,
		// 		label: 'special',
		// 		onCollideActiveCallback: seek
		// 	})


		//const joint = scene.matter.add.joint(mob.getSprite().body as BodyType, areaSensor.body as BodyType  )
		// scene.events.on('destroy-area-sensor', (se: SpriteEntity) => {
		// 	if (mob === se) {
		// 		scene.matter.world.removeConstraint(joint)
		// 		areaSensor.destroy()
		// 	}
		// })
		const seek = ({ bodyA, bodyB }: Types.Physics.Matter.MatterCollisionPair) => {
			if (bodyA.parent.label === 'player' || bodyB.parent.label === 'player') {
				const playerSprite = playerManager.player.getSprite()
				if (playerSprite && sprite &&  mob.alive) {
					if (playerSprite.x > sprite.x) {
						mob.direction = Direction.Right
					} else if (playerSprite.x < sprite.x) {

						mob.direction = Direction.Left
					}
				}
			}
		}
		mob.sensors.areaSensor!.onCollideActiveCallback = seek 
	}

	private getMobFromBody(bodyA: BodyType, bodyB: BodyType): SpriteEntity {
		return bodyA.parent.label === 'sprite' ? bodyA.gameObject.getData('entity') : bodyB.gameObject.getData('entity')
	}

	playerInteraction( {bodyA, bodyB }: Types.Physics.Matter.MatterCollisionPair) {
		const mob = this.getMobFromBody(bodyA, bodyB)
		const hit = (player: Player) => { player.takeDamage(mob.lvl) }
		if (bodyA.parent.label === 'player' || bodyB.parent.label === 'player') {
			bodyA.parent.label === 'player' ? hit(bodyA.gameObject.getData('entity')) : hit(bodyB.gameObject.getData('entity'))
		}
	}

	mobCollisionHandler({bodyA, bodyB}: Types.Physics.Matter.MatterCollisionPair) {
			//const { bodyA, bodyB } = pair
			//const mob = bodyA.parent.label === 'sprite' ? bodyA.gameObject.getData('entity') : bodyB.gameObject.getData('entity')
			const mob = this.getMobFromBody(bodyA, bodyB)
			//this.playerInteraction(pair)
			
			if ((bodyA.isStatic || bodyB.isStatic) ) {
				this.changeDirection(mob)
				if (mob.behaveor?.fly) {
					mob.behaveor.fly.speed *= -1
				}
			}
		}

	changeDirection(mob: SpriteEntity) {
		const velocityX = mob.getSprite().body.velocity.x
		if (mob.direction === Direction.Right && velocityX > 0) {
			mob.direction = Direction.Left
		}
		if (mob.direction === Direction.Left && velocityX < 0) {
			mob.direction = Direction.Right
		}
	}

	autoFly(se: SpriteEntity) {
		if (se.behaveor?.fly) {
			const sprite = se.getSprite()
			sprite.setVelocityY(se.behaveor.fly.speed)
			if (sprite.y <= se.behaveor.fly.initHight! - se.behaveor.fly.distance && sprite.body.velocity.y < 0) {
				se.behaveor.fly.speed *= -1
			}
			if (sprite.y >= se.behaveor.fly.initHight! + se.behaveor.fly.distance && sprite.body.velocity.y > 0) {
				se.behaveor.fly.speed *= -1
			}
		}
	}
}