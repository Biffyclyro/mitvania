import { GameObjects, Scene, Tilemaps } from "phaser"
import { windowSize } from "../config"
import { BodyOffset, SpriteEntity } from "../entities"

export default class SceneManager{
	private numLayers = 1 

	constructor(private readonly scene: Scene) { }

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
	 
	buildAllMobsAnims() {
	}

	private setParallax(layer: GameObjects.Image | Tilemaps.TilemapLayer) {
		const parallaxFactor = 1 / this.numLayers
		layer.setScrollFactor(parallaxFactor)
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
		this.scene.load.image('background', 'backgrounds/Background_0.png')
		this.scene.load.image('tiles', 'tiles/Tiles.png')
		this.scene.load.tilemapTiledJSON('map', 'tiles/teste.json')
	}

	loadPlayerAssets() {
		this.scene.load.spritesheet('attack', 'sprites/attack.png', { frameWidth: 74, frameHeight: 74 })
		this.scene.load.spritesheet('player', 'sprites/dino-sprite.png', { frameWidth: 48, frameHeight: 48 })
		this.scene.load.spritesheet('mush', 'sprites/cogu.png', {frameWidth: 48 ,frameHeight:32})
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
			shapeObject = this.scene.matter.add.gameObject(shape, {circleRadius: radius / 2} )
		} else {
			shapeObject = this.scene.matter.add.gameObject(shape)
		}

		shapeObject = shapeObject as Phaser.GameObjects.Polygon
		const offset = shape.body as BodyOffset
		shapeObject.setPosition(shape.x + offset.centerOffset.x, shape.y + offset.centerOffset.y)
	}

	private objectManager(objLayer: Tilemaps.ObjectLayer) {
		objLayer.objects.forEach((obj: Phaser.Types.Tilemaps.TiledObject ) => {
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
				if (obj.point) {
					if (obj.properties && obj.properties[0].name === 'mob') {
						this.spawnMob(obj)
					}
				}

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
			//const poly = this.scene.add.polygon(obj.x, obj.y, obj.polygon!)
			//const poly = chooseShape(obj)
			
		})
	}

	buildScene() {
		this.buildAllMobsAnims()
		const map = this.scene.make.tilemap({ key: 'map' })
		const tileset = map.addTilesetImage('garden', 'tiles')
		//let mainLayer!: Tilemaps.TilemapLayer;
		const objLayer = map.getObjectLayer('collisions')
		this.numLayers += map.layers.length
		this.backgroundManager()
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
			if (tileLayerName !== 'main-layer') {
				this.setParallax(layer)
			}
		})
		this.objectManager(objLayer)
	}
}