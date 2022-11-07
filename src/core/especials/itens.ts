import { Item } from "../entities";

export const gameItens = new Map<string, Item>() 

gameItens.set('sword', {type: 'weapon',
												description: 'item de teste',
												properties: {dmg: 10, atkInterval: 0.3},
												dropRate: 0.1	})

gameItens.set('knife', {type: 'weapon',
												description: 'item de teste',
												properties: {dmg: 5, atkInterval: 0.8},
												dropRate: 0.1	})