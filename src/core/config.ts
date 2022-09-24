import "phaser";
import Standard from "./scenes/Standard";

export const windowSize = {
	width: window.innerWidth,
	height: window.innerHeight
}

export const config = {
	width: windowSize.width,
	height: windowSize.height,
	scene: [Standard],
	loader: {
		path: "../assets/"
	},
	physics: {
		default: 'arcade'
	}
}