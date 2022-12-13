import { Physics, Scene } from "phaser";
import { extractEntity } from "../engines/entitiesHandler";
import { Item } from "../entities";


export const itemFactory = (scene: Scene, x: number, y: number, itemKey: string, volatile = false): Physics.Matter.Image => {
	const item = scene.matter.add.image(x, y, itemKey, 0, { label: 'special' })
	const itemConfig = gameItens.get(itemKey)
	item.setVisible(true)
	item.setCollisionGroup(-5)
	item.setOnCollide(({ bodyA, bodyB }: Phaser.Types.Physics.Matter.MatterCollisionPair) => {
		if (!bodyA.isSensor && !bodyB.isSensor) {
			const p = { bodyA: bodyA.parent, bodyB: bodyB.parent }
			const entity = extractEntity(p)
			if (entity && entity.getSprite().body.label === 'player') {
				item.destroy()
				switch(itemConfig?.type) {
					case 'weapon':
						entity.switchItem(itemKey)
						break

					case 'mana-potion': case 'life-potion':
						entity.drinkPotion(itemConfig)
						break
				}
			}
		}
	})
	if (volatile) {
		setTimeout(() => item.destroy(), 5000)
	}
	return item
}


export const gameItens = new Map<string, Item>() 

gameItens.set('mana-potion', {type: 'mana-potion',
															description: 'Mana Potion',
															properties:{power: 5},
															dropRate: 0.1})

gameItens.set('life-potion', {type: 'life-potion',
															description: 'Life Potion',
															properties:{power: 5},
															dropRate: 0.1})

gameItens.set('sword', {type: 'weapon',
												description: 'item de teste',
												properties: {dmg: 10, atkInterval: 0.3},
												dropRate: 0.1	})

gameItens.set('knife', {type: 'weapon',
												description: 'item de teste',
												properties: {dmg: 5, atkInterval: 0.8},
												dropRate: 0.1	})