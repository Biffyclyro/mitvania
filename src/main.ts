import "phaser";
import {phaserConfig} from './core/config'
import { mainGameConfigManager } from "./core/global";

try {
	mainGameConfigManager.config = JSON.parse(localStorage.getItem('main-game-config')!)
	console.log(mainGameConfigManager.config)
	const game = new Phaser.Game(phaserConfig)
} catch(e) {
	console.log(e)
}