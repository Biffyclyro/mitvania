import { Scene, Tilemaps } from "phaser"
import { windowSize } from "../config";
import { LevelConfig } from "../entities";


export const backgroundManager = (scene: Scene ): void => {
	const bg = scene.add.image(0, 0 , 'background');
	bg.setDisplayOrigin(0, 0);
	bg.setDisplaySize(windowSize.width, windowSize.height);
}

export const buildField = (scene: Scene, levelConfig: LevelConfig) => {
	levelConfig.blocks.forEach(block => {
			scene.add.image(block.x, block.y ,block.texture);
	});
}

export const loadSceneAssets = (scene: Scene) => {
		scene.load.image('background', 'backgrounds/Background_0.png');
		scene.load.image('tiles', 'tiles/Tiles.png');
		scene.load.tilemapTiledJSON('map','tiles/fist-tile.json');
}

export const loadPlayerAssets = (scene: Scene) => {
		scene.load.spritesheet('attack', 'sprites/attack.png', {frameWidth: 74, frameHeight: 74});
		scene.load.spritesheet('player-idle', 'sprites/player-idle.png', {frameWidth: 64, frameHeight: 64});
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
		const teste = map.
		//firstLayer.setCollisionByProperty({collides: true});
		//return firstLayer;
		return teste;
}