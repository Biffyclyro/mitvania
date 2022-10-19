import "phaser";
import {phaserConfig} from './core/config'
import { mainGameConfigManager } from "./core/global";

mainGameConfigManager.config = JSON.parse(localStorage.getItem('main-game-config')!)
console.log(mainGameConfigManager.config)
export const game = new Phaser.Game(phaserConfig);