import { Player } from "./entities"

export const player = new Player(10, 10, {}, 'player')

interface Stage {
	mobs?: string[]
	sonds?: string[]
	routes?: string[]
	music?: string
}

interface MainGameConfig {
	stages: {
		[stages: string]: Stage
	} 
	custom: {
		[stages: string]: Stage
	}
}

interface SaveInfos {
	stage: string 
}

class SaveManager{
	private _saveInfos: SaveInfos

	get saveInfos() {
		return this._saveInfos
	}

	set saveInfos(save: SaveInfos) {
		this._saveInfos = save
	}

	saveGame(saveInfos: SaveInfos) {
		const event = new CustomEvent<SaveInfos>('save', { detail: saveInfos })
		window.dispatchEvent(event)
	}
}

class MainGameConfigManager {
	private _config: MainGameConfig

	get config() {
		return this._config
	}

	set config(config: MainGameConfig) {
		this._config = config
	}
}


export const mainGameConfigManager = new MainGameConfigManager()
export const saveManager = new SaveManager()