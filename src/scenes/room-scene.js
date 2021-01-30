export default class RoomScene extends Phaser.Scene {
	constructor() {
		super("Room");
	}

	preload() {
		console.log("Preloading assets...");

		this.load.image("background", "assets/tests/background.png");
	}

	create() {
		console.log("Creating the game...");

		this.background = this.add.sprite(0, 0, "background");
		this.background.setOrigin(0, 0);
		this.cameras.main.setBounds(0, 0, 1920, 1080);

		this.expectedZoom = 1.0;
		this.cameras.main.zoom = this.expectedZoom;

		this.input.on("pointerdown", () => {
			this.expectedZoom = this.expectedZoom > 2 ? 1.0 : 3.0;
		});
	}

	update() {
		this.cameras.main.centerOn(
			(game.input.mousePointer.x * 1920) / 1024,
			(game.input.mousePointer.y * 1080) / 600
		);

		this.cameras.main.zoom = (this.expectedZoom + this.cameras.main.zoom) / 2;
	}
}
