export interface MobConfig {
	skill: string
	inventory: string[] 
	behaveInfos: BehaveInfos,
	velocity: number
}

export interface BehaveInfos {
	distance: number
	initPos?: number
}

export const mobsConfigMap = new Map<string, MobConfig>()

mobsConfigMap.set('pato', {skill: '', 
													inventory: ['sword'],
													behaveInfos:{
														distance: 1000
													},
													velocity: 3 
})

