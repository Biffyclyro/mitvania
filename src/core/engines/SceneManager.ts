import { windowSize } from "../config"
import { GameObjects, Physics, Scene, Tilemaps } from "phaser"
import { BodyOffset, SpriteEntity } from "../entities"
import { mainGameConfigManager, saveManager } from "../global"
import { Body } from "matter"

export default class SceneManager{
	private numLayers = 1 
	private readonly mainConfig = mainGameConfigManager.config
	private readonly currentStage: string = saveManager.saveInfos.stage

	constructor(private readonly scene: Scene) {}

	buildPlayerAnims() {
		this.scene.anims.create({
			key: 'player-idle',
			frameRate: 5,
			repeat: -1,
			frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 3 })
		})

		this.scene.anims.create({
			key: 'player-moving',
			frameRate: 10,
			frames: this.scene.anims.generateFrameNumbers('player', { start: 4, end: 9 })
		})

		this.scene.anims.create({
			key: 'player-jump',
			frameRate: 5,
			frames: this.scene.anims.generateFrameNumbers('player', { start: 10, end: 12 })
		})
	}
	 
	buildAllMobsAnims(mob: string) {
		this.scene.anims.create({
			key: `${mob}-idle`,
			frameRate: 5,
			frames: this.scene.anims.generateFrameNames(mob, {start: 0, end:0})
		})
	}

	buildSaveLotus(obj: Phaser.Types.Tilemaps.TiledObject) {
		const lotus = this.scene.add.sprite(obj.x!, obj.y!, 'lotus').setOrigin(0.5, 0.5)
	}

	private setParallax(layer: GameObjects.Image | Tilemaps.TilemapLayer) {
		const parallaxFactor = 1 / this.numLayers
		layer.setScrollFactor(parallaxFactor, 1)
		this.numLayers--
	}

	private spawnMob(obj: Phaser.Types.Tilemaps.TiledObject) {
		const mob = new SpriteEntity(10, 10, {}, obj.properties[0].value)
		mob.setSprite(this.scene, { x: obj.x!, y: obj.y!, width: 23, height: 32 })
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
				this.scene.load.spritesheet(m, `sprites/${m}.png`,  {frameWidth: 48 ,frameHeight:32})
			})
		}
		this.scene.load.image('background', `backgrounds/${this.currentStage}.png`)
		this.scene.load.image('tiles', `tiles/${this.currentStage}/Tiles.png`)
		this.scene.load.image('lotus', 'sprites/lotus.png')
		this.scene.load.tilemapTiledJSON('map', `tiles/${this.currentStage}/teste2.json`)
	}

	loadPlayerAssets() {
		this.scene.load.spritesheet('attack', 'sprites/attack.png', { frameWidth: 74, frameHeight: 74 })
		this.scene.load.spritesheet('player', 'sprites/dino-sprite.png', { frameWidth: 48, frameHeight: 48 })
		//this.scene.load.spritesheet('mush', 'sprites/cogu.png', {frameWidth: 48 ,frameHeight:32})
	}

	makeLayerSolid(layer: Tilemaps.TilemapLayer) {
		layer.setCollisionByExclusion([-1])
		this.scene.matter.world.convertTilemapLayer(layer)
	}

	private shapeManager(shape: GameObjects.Polygon | 
															GameObjects.Rectangle | 
															GameObjects.Ellipse, 
															ellipse?: boolean,
															polygon?: Phaser.Types.Math.Vector2Like[]) {
															
		let shapeObject 

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

		shapeObject = shapeObject as Phaser.GameObjects.Polygon | Phaser.GameObjects.Ellipse | Phaser.GameObjects.Rectangle
		//const offset = shape.body as BodyOffset
		console.log(shape.displayOriginX, 'shape body')
		// displayOrigin é o mesmo que centerOffset?????????
		//shapeObject.setPosition(shape.x + offset.centerOffset.x, shape.y + offset.centerOffset.y)

		console.log(shapeObject)
		
		shapeObject.setPosition(shape.x + shape.displayOriginX, shape.y + shape.displayOriginY)
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
			// const plataforma = new GameObjects.Polygon(scene, obj.x!, obj.y!, obj.polygon!).setOrigin(0,0)
			// const img = scene.matter.add.imag(obj.x!, obj.y!, '', 0, {
			// 	vertices: obj.polygon!,
			// 	isStatic: true,
			// })

			//const abs =scene.matter.add.sprite(pols.x!, pols.y!, 'plataforma', 0)

			//  scene.matter.add.polygon(0, 0, pols.polygon!.length, 0, {
			// 	label: obj.name,
			// 	vertices: pols.polygon!,
			// 	isStatic: true
			// })
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

	buildScene() {
		//this.buildAllMobsAnims()
		const map = this.scene.make.tilemap({ key: 'map' })
		const tileset = map.addTilesetImage('garden', 'tiles')
		//let mainLayer!: Tilemaps.TilemapLayer;
		const collisionsLayer = map.getObjectLayer('collisions')
		const spriteLayer = map.getObjectLayer('sprite-objects')
		this.numLayers += map.layers.length
		this.backgroundManager()
		//this.scene.matter.add.image(79, 79, 'lotus')
		//  scene.matter.add.gameObject(poly)
		//const poly = scene.matter.add.image(pols.x!, pols.y!, 'orange')
		// 	poly.setBody({
		// 		sides: 4,
		//     type: 'polygon',
		// 		verts: pols.polygon!
		// })

		// abs.setPolygon(0,pols.polygon!.length, {
		// 	label: obj.name,
		//  	vertices: pols.polygon!,
		// 	isStatic: true
		//  	})
		// const blas = new GameObjects.Polygon(scene, obj.x!, obj.y!, obj.polygon!)
		// 	abs.setMask(blas.mask)


		map.getTileLayerNames().forEach((tileLayerName: string) => {
			const layer = map.createLayer(tileLayerName, tileset, 0, 0)
			if (tileLayerName !== 'main-layer' && tileLayerName !== 'second-layer') {
				this.setParallax(layer)
			}
		})
		this.collisionsManager(collisionsLayer)
		this.spriteLayerManager(spriteLayer)
	}
}