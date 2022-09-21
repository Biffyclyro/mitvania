import "phaser";
import Garden from "./scenes/Garden";

export const windowSize = {
	width: window.innerWidth,
	height: window.innerHeight
}

export const config = {
	width: windowSize.width,
	height: windowSize.height,
	scene: [Garden],
	loader: {
		path: "../assets/"
	},
	physics: {
		default: 'arcade'
	}
}