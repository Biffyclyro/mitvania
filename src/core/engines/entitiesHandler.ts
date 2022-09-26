import {GameObjects} from  "phaser";

export const addEntity = <T extends GameObjects
																		.GameObject>(scene: Phaser.Scene, e: T): T => {
	scene.add.existing(e);
	scene.matter.world.add(e);
	return e;
}
