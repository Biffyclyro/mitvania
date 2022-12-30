export interface MobConfig {
	skill: string
	inventory: string[] 
	behaveInfos: BehaviorInfos,
	velocity: number
}

export interface BehaviorInfos {
	distance: number
	initPos?: number
	seekPlayer: boolean
	seeking?: boolean
	fly?: {
		initHight?: number
		distance:number
		speed: number
	}
}

export const mobsConfigMap = new Map<string, MobConfig>()

mobsConfigMap.set('teste', {skill: '', 
													inventory: ['sword'],
													behaveInfos:{
														distance: 1000,
														seekPlayer: true,
fly: {
															distance: 150,
															speed: 3
														}
													},
													velocity: 3 
})

mobsConfigMap.set('pato',{
													skill: '',
													inventory: ['sword'],
													behaveInfos: {
														distance: 1000,
														seekPlayer:false,
														// fly: {
														// 	distance: 150,
														// 	speed: 3
														// }
													},
													velocity: 3
			})