import { BodyType } from "matter"
import { GameObjects, Physics, Scene, Tilemaps } from "phaser"
import { game } from "../../main"
import { windowSize } from "../config"
import { BodyOffset } from "../entities"

export interface AssetManager {
	(scene: Scene): void
}

export const buildPlayerAnims: AssetManager = (scene: Scene) => {
	scene.anims.create({
		key: 'player-idle',
		frameRate: 5,
		repeat: -1,
		frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 3 })
	})

	scene.anims.create({
		key: 'moving',
		frameRate: 10,
		frames: scene.anims.generateFrameNumbers('player', { start: 4, end: 9 })
	})

	scene.anims.create({
		key: 'jump',
		frameRate: 5,
		frames: scene.anims.generateFrameNumbers('player', { start: 10, end: 12 })
	})
}

export const backgroundManager = (scene: Scene): void => {
	const bg = scene.add.image(0, 0, 'background')
	bg.setDisplayOrigin(0, 0)
	bg.setDisplaySize(windowSize.width, windowSize.height)
	bg.setScrollFactor(0.25)
}

export const loadSceneAssets = (scene: Scene) => {
	scene.load.image('background', 'backgrounds/Background_0.png')
	scene.load.image('tiles', 'tiles/Tiles.png')
	scene.load.tilemapTiledJSON('map', 'tiles/teste.json')
}

export const loadPlayerAssets = (scene: Scene) => {
	scene.load.spritesheet('attack', 'sprites/attack.png', { frameWidth: 74, frameHeight: 74 })
	scene.load.spritesheet('player', 'sprites/dino-sprite.png', { frameWidth: 48, frameHeight: 48 })
}

export const makeLayerSolid = (scene: Scene, layer: Tilemaps.TilemapLayer) => {
	layer.setCollisionByExclusion([-1])
	scene.matter.world.convertTilemapLayer(layer)
}

export const buildScene = (scene: Scene): Tilemaps.TilemapLayer  => {
	const Bodies = scene.matter.bodies
	const map = scene.make.tilemap({ key: 'map' })
	const tileset = map.addTilesetImage('teste', 'tiles')
	let mainLayer!: Tilemaps.TilemapLayer;
	const objLayer = map.getObjectLayer('collisions')
	map.createFromObjects

	//object[0].body = meuDeus 
	
	//console.log(objLayer)

	objLayer.objects.forEach((obj: Phaser.Types.Tilemaps.TiledObject) => {
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

		const poly = scene.add.polygon(obj.x, obj.y, obj.polygon!) 

		const polyObject = scene.matter.add.gameObject(poly, {
			shape: {
				type: 'fromVerts',
				verts: obj.polygon!,
				flagInternal: false
			},
			isStatic: true,
			friction: 0
		}) as Phaser.GameObjects.Polygon


		const offset = poly.body as BodyOffset
		polyObject.setPosition(poly.x + offset.centerOffset.x, poly.y + offset.centerOffset.y)
																						
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

	})

	map.getTileLayerNames().forEach((tileLayerName: string) => {
		const layer = map.createLayer(tileLayerName, tileset, 0, 0)
		if (tileLayerName === 'main-layer') {
			mainLayer = layer
		}
	})
	return mainLayer
}