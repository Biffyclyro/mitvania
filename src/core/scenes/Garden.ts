import "phaser";

export default class Garden extends Phaser.Scene {
	constructor() {
		super('Garden');
	}

	preload(): void {
		this.load.path = "../../assets/"
		this.load.image('background', 'backgrounds/Background_0.png');
	}

	create(): void {
		const background = this.add.image(512, 384, 'background');
		background.setScale(2)
	}
	
}
