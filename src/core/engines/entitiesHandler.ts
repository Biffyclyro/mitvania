import {GameObjects} from  "phaser";
// provavelmente nunca será útil
export const addEntity = <T extends GameObjects
																		.GameObject>(scene: Phaser.Scene, e: T): T => {
	scene.add.existing(e);
	scene.matter.world.add(e);
	return e;
}
/*
shape: { type: 'fromVerts', 
																										 verts: pols.polygon!, 
																										 flagInternal: false},
																										 */