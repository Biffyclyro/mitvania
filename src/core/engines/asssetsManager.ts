import { GameObjects, Physics, Scene, Tilemaps } from "phaser"
import { windowSize } from "../config"
import { BodyOffset, Entity, SpriteEntity } from "../entities"

export default class AssetManager {
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
			key: 'moving',
			frameRate: 10,
			frames: this.scene.anims.generateFrameNumbers('player', { start: 4, end: 9 })
		})

		this.scene.anims.create({
			key: 'jump',
			frameRate: 5,
			frames: this.scene.anims.generateFrameNumbers('player', { start: 10, end: 12 })
		})
	}

	setParallax(layer: GameObjects.Image | Tilemaps.TilemapLayer) {
		//layer.setScrollFactor()
	}

	backgroundManager() {
		const bg = this.scene.add.image(0, 0, 'background')
		bg.setDisplayOrigin(0, 0)
		bg.setDisplaySize(windowSize.width + windowSize.width / 2, windowSize.height)
		bg.setScrollFactor(0.25)
	}

	loadSceneAssets() {
		this.scene.load.image('background', 'backgrounds/Background_0.png')
		this.scene.load.image('tiles', 'tiles/Tiles.png')
		this.scene.load.tilemapTiledJSON('map', 'tiles/teste.json')
	}

	loadPlayerAssets() {
		this.scene.load.spritesheet('attack', 'sprites/attack.png', { frameWidth: 74, frameHeight: 74 })
		this.scene.load.spritesheet('player', 'sprites/dino-sprite.png', { frameWidth: 48, frameHeight: 48 })
		this.scene.load.spritesheet('mob', 'sprites/cogu.png', {frameWidth: 48 ,frameHeight:48})
	}

	makeLayerSolid(layer: Tilemaps.TilemapLayer) {
		layer.setCollisionByExclusion([-1])
		this.scene.matter.world.convertTilemapLayer(layer)
	}

	private shapeManager(shape: GameObjects.Polygon | 
															GameObjects.Rectangle | 
															GameObjects.Ellipse, 
															polygon?: Phaser.Types.Math.Vector2Like[]) {
		if (polygon) {
			const polyObject = this.scene.matter.add.gameObject(shape, {
				shape: {
					type: 'fromVerts',
					verts: polygon!,
					//flagInternal: false
				},
				isStatic: true,
				friction: 0
			}) as Phaser.GameObjects.Polygon

			const offset = shape.body as BodyOffset
			polyObject.setPosition(shape.x + offset.centerOffset.x, shape.y + offset.centerOffset.y)
		}
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
					console.log(obj)
			if (obj.height === 0 && obj.width === 0) {
				if (obj.point) {
					console.log(obj)
					const mob = new SpriteEntity(10, 10, {}, 'mob')
					mob.setSprite(this.scene ,{x:obj.x!, y: obj.y!, width: 23, height:32} )
				}

				if (obj.polygon) {
					this.shapeManager(this.scene.add.polygon(obj.x, obj.y, obj.polygon), obj.polygon!)
				}

			} else {
				if (obj.ellipse) {
					this.shapeManager(this.scene.add.ellipse(obj.x, obj.y, obj.width, obj.height))
				} else {
					this.shapeManager(this.scene.add.rectangle(obj.x, obj.y, obj.width, obj.height))
				}
			}

			//const poly = this.scene.add.polygon(obj.x, obj.y, obj.polygon!)
			//const poly = chooseShape(obj)

			
		})
	}

	buildScene() {
		const map = this.scene.make.tilemap({ key: 'map' })
		const tileset = map.addTilesetImage('teste', 'tiles')
		//let mainLayer!: Tilemaps.TilemapLayer;
		const objLayer = map.getObjectLayer('collisions')


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
				//	mainLayer = layer
			}
		})

		this.objectManager(objLayer)
		//return mainLayer
	}
}