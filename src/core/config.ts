import StandardScene from "./scenes/StandardScene";

export const windowSize = {
	width: window.innerWidth,
	height: window.innerHeight
}

export const phaserConfig = {
	width: windowSize.width,
	height: windowSize.height,
	scene: [StandardScene],
	loader: {
		path: "../assets/"
	},
	physics: {
		default: 'matter',
		matter: {
			debug: {
				showBody: true,
			}
		}
	}
}