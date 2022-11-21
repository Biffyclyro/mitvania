import { Player } from "./entities"

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
	playerStatus?: playerSaveStatus
}

export interface playerSaveStatus {
	lvl: number
	weapon: string
	specialSkill: string
	maxJumps: number
	inventory: string[]
	normalSkill: string,
	position: {x: number, y:number},
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

class PlayerManager {
	private _player: Player

	createPlayer(playerStatus?: playerSaveStatus) {
		if (playerStatus) {
			const { lvl, weapon, specialSkill, maxJumps, inventory, normalSkill} = playerStatus
			const player = new Player(lvl, 10, true, 'player')
			player.specialSkill = specialSkill
			player.weapon = weapon
			player.maxJumps = maxJumps
			player.inventory = inventory
			player.normalSkill = normalSkill
			this._player = player
		} else {
			this._player = new Player(1, 10, true, 'player')
		}
	}
	
	get player() {
		return this._player
	}
}


export const mainGameConfigManager = new MainGameConfigManager()
export const saveManager = new SaveManager()
export const playerManager =  new PlayerManager()

//lambda de teste menos útil do que parecia quando foi pensada
export const test = (fun: (...args: any) => any) => {
	fun()
}