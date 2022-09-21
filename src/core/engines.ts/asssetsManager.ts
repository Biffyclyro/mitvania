import { Scene } from "phaser"
import { windowSize } from "../config";
import { LevelConfig } from "../models";


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