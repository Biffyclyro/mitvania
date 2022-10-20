import { Player } from "./entities";

export const player = new Player(10, 10, {}, 'player');

interface MainGameConfig {
	lvls: string[]
	mobs?: string[]
	bosses?: string[]
	musics?: string[]
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

interface SaveInfos {
	lvl: string 
}

export const saveGame = (saveInfos: SaveInfos) => {
	const event = new CustomEvent<SaveInfos>('save', { detail: saveInfos })
	window.dispatchEvent(event)
}


export const mainGameConfigManager = new MainGameConfigManager()