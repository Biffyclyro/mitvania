import { windowSize } from "../config"
import { GameObjects, Physics, Scene, Tilemaps } from "phaser"
import { Item, Player, SpriteEntity } from "../entities"
import {  mainGameConfigManager, playerManager, saveManager } from "../global"
import { mobsConfigMap } from "../especials/mobsConfig"
import { extractEntity } from "../especials/skills"

export default class SceneManager{
	private numLayers = 1 
	private readonly mainConfig = mainGameConfigManager.config
	readonly currentStage: string = saveManager.saveInfos.stage
	private readonly player = playerManager.player
	private readonly entitiesList: SpriteEntity[] = []

	constructor(private readonly scene: Scene) {}

	buildPlayerAnims() {
		const texture = this.player.baseTexture
		this.scene.anims.create({
			key: 'player-idle',
			frameRate: 5,
			repeat: -1,
			frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 3 })
		})

		this.scene.anims.create({
			key: 'player-moving',
			frameRate: 10,
			frames: this.scene.anims.generateFrameNumbers(texture, { start: 4, end: 9 })
		})

		this.scene.anims.create({
			key: 'player-jump',
			frameRate: 5,
			frames: this.scene.anims.generateFrameNumbers(texture, { start: 10, end: 12 })
		})

		this.scene.anims.create({
			key: 'player-damage',
			frameRate: 10,
			repeat: 3,
			frames: this.scene.anims.generateFrameNumbers(texture, { start: 14, end: 16 })
		})
	}
	 
	buildAllMobsAnims(mob: string) {
		this.scene.anims.create({
			key: `${mob}-idle`,
			frameRate: 5,
			frames: this.scene.anims.generateFrameNames(mob, {start: 0, end:0})
		})
	}

	private buildSaveLotus(obj: Phaser.Types.Tilemaps.TiledObject) {
		const lotus = this.scene.matter.add.sprite(obj.x!, obj.y!, 'lotus', 0, { isStatic: true, isSensor: true })
		lotus.setVisible(true)
		lotus.setOnCollide(({bodyA, bodyB}: Phaser.Types.Physics.Matter.MatterCollisionPair) => {
			console.log(bodyA, bodyB)
			if (bodyA.parent.label === 'player' || bodyB.parent.label === 'player') {
				saveManager.saveGame({ stage: this.currentStage, playerStatus: this.player.getSaveStatus() })
			}
		})
	}

	private setParallax(layer: GameObjects.Image | Tilemaps.TilemapLayer) {
		const parallaxFactor = 1 / this.numLayers
		layer.setScrollFactor(parallaxFactor, 1)
		this.numLayers--
	}

	private spawnMob(obj: Phaser.Types.Tilemaps.TiledObject) {
		const mobKey = obj.properties[0].value
		const mobConfig = mobsConfigMap.get(mobKey)
		const mob = new SpriteEntity(1, 25, false, mobKey)
		mob.inventory = mobConfig!.inventory
		mob.setSprite(this.scene, { x: obj.x!, y: obj.y!, width: 23, height: 32 })
		mob.autoMovement = {distance: 100, velocity: 6, initPos: mob.getSprite().x}
		mob.canMove = true
		mob.getSprite().setOnCollide(({bodyA, bodyB}: Phaser.Types.Physics.Matter.MatterCollisionPair) => {
			const hit = (player: Player) => {player.takeDamage(mob.lvl)}
			if (bodyA.parent.label === 'player' || bodyB.parent.label === 'player') {
				bodyA.label === 'player' ? hit(bodyA.gameObject.getData('entity')) : hit(bodyB.gameObject.getData('entity'))
			}
		})
		//mob.getSprite().setOnCollide(() => mob.autoMovement!.velocity = mob.autoMovement!.velocity * -1)
		this.entitiesList.push(mob)
	}

	moveEntities() {
		this.entitiesList.forEach(se => {
			const sprite = se.getSprite()
			if (sprite && se.canMove) {
				sprite.setVelocityX(se.autoMovement!.velocity)
				if (sprite.x >= se.autoMovement!.initPos + se.autoMovement!.distance || sprite.x <= se.autoMovement!.initPos - se.autoMovement!.distance && se.canMove) {
					se.autoMovement!.velocity = se.autoMovement!.velocity * -1
				}
			} else {
				const index = this.entitiesList.indexOf(se)
				this.entitiesList.splice(index, 1)
			}
		}) 
	}

	private backgroundManager() {
		const bg = this.scene.add.image(0, 0, 'background')
		bg.setDisplayOrigin(0, 0)
		bg.setDisplaySize(windowSize.width + windowSize.width / 2, windowSize.height)
		//bg.setScrollFactor(0.5)
		this.setParallax(bg)
	}

	loadSceneAssets() {
		const mobs = this.mainConfig.stages[this.currentStage].mobs
		if (mobs) { 
			mobs.forEach(m => {
				const mobConfig = mobsConfigMap.get(m)!
				this.scene.load.spritesheet(m, `sprites/${m}.png`,  {frameWidth: 48 ,frameHeight:32})
				if (mobConfig.skill) {
					this.scene.load.spritesheet(mobConfig.skill, `sprites/skills/${mobConfig.skill}.png`)
				} 
				mobConfig.inventory.forEach(item => {
					this.scene.load.spritesheet(item, `sprites/itens/${item}.png`, {frameWidth: 24, frameHeight: 16})
				})
			})
		}
		this.scene.load.image('background', `backgrounds/${this.currentStage}.png`)
		this.scene.load.image('tiles', `tiles/${this.currentStage}/Tiles.png`)
		this.scene.load.image('lotus', 'sprites/lotus.png')
		this.scene.load.tilemapTiledJSON('map', `tiles/${this.currentStage}/teste2.json`)
	}

	loadPlayerAssets() {
		const specialSkill = this.player.specialSkill
		const weapon = this.player.weapon
		const normalSkill = this.player.normalSkill
		const texture = this.player.baseTexture

		this.scene.load.spritesheet(texture, `sprites/${texture}.png`, { frameWidth: 48, frameHeight: 48 })

		if (specialSkill) {
			this.scene.load.spritesheet(specialSkill, `sprites/skills/${specialSkill}.png`, { frameWidth: 16, frameHeight: 16 })
		}
		if (weapon) {
			this.scene.load.spritesheet(weapon, `sprites/itens/${weapon}.png`, { frameWidth: 24, frameHeight: 16 })
		}
		if (normalSkill) {
			this.scene.load.spritesheet(normalSkill, `sprites/skills/${normalSkill}.png`, { frameWidth: 16, frameHeight: 16 })
		}
		this.player.inventory.forEach(item => {
			this.scene.load.spritesheet(item, `itens/${item}.png`, { frameWidth: 16, frameHeight: 16 })
		})

		this.scene.load.spritesheet('knife', `sprites/itens/knife.png`, { frameWidth: 24, frameHeight: 16 })
		this.scene.load.spritesheet('fire-ball', `sprites/skills/fire-ball.png`, { frameWidth: 16, frameHeight: 16 })
		this.scene.load.spritesheet('lightning-bolt', `sprites/skills/lightning-bolt.png`, { frameWidth: 16, frameHeight: 16 })
	}

	makeLayerSolid(layer: Tilemaps.TilemapLayer) {
		layer.setCollisionByExclusion([-1])
		this.scene.matter.world.convertTilemapLayer(layer)
	}

	//metódo mais complexo até o momento
	private shapeManager(shape: GameObjects.Polygon | 
															GameObjects.Rectangle | 
															GameObjects.Ellipse, 
															ellipse?: boolean,
															polygon?: Phaser.Types.Math.Vector2Like[]) {
								
		let shapeObject: GameObjects.GameObject 
																
		if (polygon) {
			shapeObject = this.scene.matter.add.gameObject(shape, {
				shape: {
					type: 'fromVerts',
					verts: polygon!,
					//flagInternal: false
				},
				isStatic: true,
				friction: 0
			}) 
		} else if(ellipse) {
			let radius 
			if (shape.width > shape.height) {
				radius = shape.width
			} else {
				radius = shape.height
			}
			shapeObject = this.scene.matter.add.gameObject(shape, {circleRadius: radius / 2, isStatic: true} )
		} else {
			shapeObject = this.scene.matter.add.gameObject(shape, {isStatic: true})
		}
		//método sem typecast
		// displayOrigin é o mesmo que centerOffset?????????
		shapeObject.body.gameObject!.setPosition(shape.x + shape.displayOriginX, shape.y + shape.displayOriginY).setCollisionGroup(-2)
		//shapeObject = shapeObject as Phaser.GameObjects.Polygon | Phaser.GameObjects.Ellipse | Phaser.GameObjects.Rectangle
		//const offset = shape.body as BodyOffset
		//console.log(shape.displayOriginX, 'shape body')
		//shapeObject.setPosition(shape.x + offset.centerOffset.x, shape.y + offset.centerOffset.y)
		//shapeObject.setPosition(shape.x + shape.displayOriginX, shape.y + shape.displayOriginY)
	}

	private spriteLayerManager(spriteLayer: Tilemaps.ObjectLayer) {
		if (spriteLayer) {
			spriteLayer.objects.forEach((obj: Phaser.Types.Tilemaps.TiledObject) => {
				if (obj.point) {
					if (obj.properties && obj.properties[0].name === 'mob') {
						this.spawnMob(obj)
					} else if (obj.name === 'lotus') {
						this.buildSaveLotus(obj)
					}
				}
			})
		}
	}

	private collisionsManager(collisionsLayer: Tilemaps.ObjectLayer) {
		collisionsLayer.objects.forEach((obj: Phaser.Types.Tilemaps.TiledObject) => {
			if (obj.height === 0 && obj.width === 0) {
				if (obj.polygon) {
					this.shapeManager(this.scene.add.polygon(obj.x, obj.y, obj.polygon), obj.ellipse, obj.polygon!)
				}

			} else {
				if (obj.ellipse) {
					this.shapeManager(this.scene.add.ellipse(obj.x, obj.y, obj.width, obj.height, 0), obj.ellipse)
				} else {
					this.shapeManager(this.scene.add.rectangle(obj.x, obj.y, obj.width, obj.height))
				}
			}
		})
	}

	private buildStatusBar() {
		const barWidth = 200
		const lifeBar = this.scene.add.rectangle(windowSize.width/4, windowSize.height/5, barWidth , 5, 50000)
		const manaBar = this.scene.add.rectangle(windowSize.width/4, windowSize.height/5 + 10, barWidth, 5, 5000)
		lifeBar.setScrollFactor(0)
		manaBar.setScrollFactor(0)
		this.scene.events.on('player-damage', (damage: number) => {
			lifeBar.width -= damage * (barWidth / this.player.maxLife)
		})
		this.scene.events.on('player-skill', (cost: number) => {
			manaBar.width -= cost * (barWidth / this.player.maxMana)
		})

	}

	private setCamera() {
		this.scene.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2)
		this.scene.matter.world.setBounds(0, 0, 1920 * 2, 1080 * 2)
		this.scene.cameras.main.zoom = 1.5
	}

	//metódo provavelmente será o único público invocado dentro da cena
	buildScene() {
		this.setCamera()
		const screenWiew = this.scene.cameras.main.worldView
		const map = this.scene.make.tilemap({ key: 'map' })
		const tileset = map.addTilesetImage(this.currentStage, 'tiles')
		const collisionsLayer = map.getObjectLayer('collisions')
		const spriteLayer = map.getObjectLayer('sprite-objects')
		this.numLayers += map.layers.length
		this.backgroundManager()
		

		map.getTileLayerNames().forEach((tileLayerName: string) => {
			const layer = map.createLayer(tileLayerName, tileset)
			if (tileLayerName !== 'main-layer' && tileLayerName !== 'second-layer') {
				this.setParallax(layer)
			}
		})
		this.collisionsManager(collisionsLayer)
		this.spriteLayerManager(spriteLayer)
		this.buildStatusBar()
		
		const stageName = this.scene.add.text(screenWiew.centerX, screenWiew.centerY /2, this.currentStage )
		stageName.setOrigin(0.5)
		stageName.setScrollFactor(0, 0)
		setTimeout(() => {
			stageName.destroy()
			this.player.canMove = true
		}, 1000)
	}
}