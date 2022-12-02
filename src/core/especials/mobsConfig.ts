export interface MobConfig {
	skill: string
	inventory: string[] 
	behaveInfos: BehaviorInfos,
	velocity: number
}

export interface BehaviorInfos {
	distance: number
	initPos?: number
	fly?: number
}

export const mobsConfigMap = new Map<string, MobConfig>()

mobsConfigMap.set('pato', {skill: '', 
													inventory: ['sword'],
													behaveInfos:{
														distance: 1000,
														fly: 500
													},
													velocity: 3 
})