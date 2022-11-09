interface MobConfig {
	skill: string
	inventory: string[] 
}

export const mobsConfigMap = new Map<string, MobConfig>()

mobsConfigMap.set('mush', {skill: '', inventory: []})