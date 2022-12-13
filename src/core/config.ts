import Standard from "./scenes/Standard";

export const windowSize = {
	width: window.innerWidth,
	height: window.innerHeight
}

export const phaserConfig = {
	width: windowSize.width,
	height: windowSize.height,
	scene: [Standard],
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
