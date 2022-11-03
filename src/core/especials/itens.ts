import { Item } from "../entities";

export const gameItens = new Map<string, Item>() 

gameItens.set('teste', {description: 'item de teste',
												properties: {dmg: 10},
												dropRate: 0.1	})