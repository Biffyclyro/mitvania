import "phaser";

export const addEntity = <T extends Phaser
																	 .GameObjects
																	 .GameObject>(scene: Phaser.Scene, e: T): T => {
	scene.add.existing(e);
	scene.physics.add.existing(e);
	return e;
}