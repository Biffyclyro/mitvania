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
		this.add.image(0, 0, 'background');
	}
	
}
