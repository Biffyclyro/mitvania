import { BodyType } from "matter";
// provavelmente nunca será útil
// const addEntity = <T extends GameObjects
// 																		.GameObject>(scene: Phaser.Scene, e: T): T => {
// 	scene.add.existing(e);
// 	scene.matter.world.add(e);
// 	return e;
// }
/*
shape: { type: 'fromVerts', 
																										 verts: pols.polygon!, 
																										 flagInternal: false},
																										 */


//retornando a entidade quando uma colisão envolve um sprite, tipagem trocada de pair para objeto com 2 BodyType
export const extractEntity = ({ bodyA, bodyB }: { bodyA: BodyType, bodyB: BodyType }) => {
	if (bodyA.label === 'sprite' || bodyA.label === 'player' || bodyA.parent.label === 'sprite' && !bodyA.isSensor) {
		return bodyA.gameObject.getData('entity')
	}
	if (bodyB.label === 'sprite' || bodyB.label === 'player' || bodyB.parent.label === 'sprite' && !bodyA.isSensor) {
		return bodyB.gameObject.getData('entity')
	}
	return 
}