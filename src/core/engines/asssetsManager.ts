import { Scene, Tilemaps } from "phaser"
import { windowSize } from "../config";

export interface AssetManager {
	(scene: Scene): void;
}

export const buildPlayerAnims: AssetManager = (scene: Scene) => {
		scene.anims.create({
			key: 'player-idle',
			frameRate: 5,
			repeat: -1,
			frames: scene.anims.generateFrameNumbers('player', {start:40, end: 43})
		});	
		
		scene.anims.create({
			key: 'moving',
			frameRate: 10,
			frames: scene.anims.generateFrameNumbers('player', {start:8, end: 13})
		});
}


export const backgroundManager = (scene: Scene ): void => {
	const bg = scene.add.image(0, 0 , 'background');
	bg.setDisplayOrigin(0, 0);
	bg.setDisplaySize(windowSize.width, windowSize.height);
}

export const loadSceneAssets = (scene: Scene) => {
		scene.load.image('background', 'backgrounds/Background_0.png');
		scene.load.image('tiles', 'tiles/Tiles.png');
		scene.load.tilemapTiledJSON('map','tiles/teste.json');
}

export const loadPlayerAssets = (scene: Scene) => {
		scene.load.spritesheet('attack', 'sprites/attack.png', {frameWidth: 74, frameHeight: 74});
		scene.load.spritesheet('player', 'sprites/sprites-char.png', {frameWidth: 16, frameHeight: 16});
}

export const makeLayerSolid = (scene: Scene, layer: Tilemaps.TilemapLayer) => {
		layer.setCollisionByExclusion([-1]);	
		scene.matter.world.convertTilemapLayer(layer);
}

export const buildScene = (scene: Scene): Tilemaps.TilemapLayer  => {
		const map = scene.make.tilemap({key: 'map'});
		const tileset = map.addTilesetImage('teste', 'tiles');
		map.createLayer('Tile Layer 3', tileset, 0, 0);
		const second = map.createLayer('Tile Layer 2', tileset, 0, 0);
		const firstLayer= map.createLayer('first-layer', tileset, 0, 0);
		//map.createLayer('background', tileset)
		//const teste = map.createFromObjects('polygons', {name: "chao"});
		
		//firstLayer.setCollisionByProperty({collides: true});
		//return firstLayer;
		return firstLayer;
}