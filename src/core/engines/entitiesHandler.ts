import {GameObjects} from  "phaser";
import { Player } from "../entities";

export const addEntity = <T extends GameObjects
																		.GameObject>(scene: Phaser.Scene, e: T): T => {
	scene.add.existing(e);
	scene.physics.add.existing(e);
	return e;
}
