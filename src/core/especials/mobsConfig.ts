export interface MobConfig {
	skill: string
	inventory: string[] 
	behaveInfos: BehaviorInfos,
	velocity: number
}

export interface BehaviorInfos {
	distance: number
	initPos?: number
	fly?: {
		initHight?: number
		distance:number
		speed: number
	}
}

export const mobsConfigMap = new Map<string, MobConfig>()

mobsConfigMap.set('test', {skill: '', 
													inventory: ['sword'],
													behaveInfos:{
														distance: 1000,
														fly:{
															distance: 300,
															speed: 3
														} 
													},
													velocity: 3 
})

mobsConfigMap.set('pato',{
													skill: '',
													inventory: ['sword'],
													behaveInfos: {
														distance: 150,
														fly: {
															distance: 150,
															speed: 3
														}
													},
													velocity: 3
			})