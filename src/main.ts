import "phaser";
import {phaserConfig} from './core/config'
import { saveManager, mainGameConfigManager } from "./core/global";

try {
	mainGameConfigManager.config = JSON.parse(localStorage.getItem('main-game-config')!)
	saveManager.saveInfos = JSON.parse(localStorage.getItem('game-save')!)
	console.log(saveManager.saveInfos)
	const game = new Phaser.Game(phaserConfig)
} catch(e) {
	console.log(e)
}