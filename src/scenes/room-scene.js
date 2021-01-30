import GrayscalePipeline from "../pipelines/grayscale.js";

export default class RoomScene extends Phaser.Scene {
	constructor() {
		super("Room");
	}

	preload() {
		console.log("Preloading assets...");

		this.load.image("background", "assets/tests/background.png");
		this.load.image("fish", "assets/tests/fish.png");

		this.load.audio("test-music", "assets/tests/music.ogg");
	}

	create() {
		console.log("Creating the game...");

		this.background = this.add.sprite(0, 0, "background");
		this.background.setOrigin(0, 0);
		this.background.setInteractive();
		this.background.setPostPipeline(GrayscalePipeline);
		this.cameras.main.setBounds(0, 0, 1920, 1080);

		this.cameras.main.tint = 0x000000;

		this.isZoomedIn = false;

		this.fish = this.add.sprite(200, 1000, "fish");
		this.fish.scale = 0.5;
		this.fish.setInteractive({
			useHandCursor: true,
			pixelPerfect: false,
		});
		this.fish.on("pointerover", () => {
			if (!this.isZoomedIn) {
				this.fish.tint = 0x444444;
			}
		});
		this.fish.on("pointerout", () => {
			this.fish.tint = 0xffffff;
		});

		this.fish.on("pointerdown", (pointer) => {
			if (pointer.leftButtonDown()) {
				this.fish.tint = 0xffffff;
				this.isZoomedIn = true;
				this.cameras.main.zoomTo(3.0, 1000, "Power1", true);
			}
		});

		this.input.on("pointerdown", (pointer) => {
			if (pointer.rightButtonDown() && this.isZoomedIn) {
				if (!this.music.isPlaying) {
					this.music.play({ loop: true });
				}
				this.background.resetPipeline(GrayscalePipeline);
				this.cameras.main.zoomTo(1.0, 1000, "Power1", true, (_, progress) => {
					if (progress >= 0.3) {
						this.isZoomedIn = false;
					}
				});
			}
		});

		this.input.mouse.disableContextMenu();

		this.music = this.sound.add("test-music", { volume: 0.5 });
	}

	update() {
		if (!this.isZoomedIn) {
			this.cameras.main.pan(
				(game.input.mousePointer.x * this.background.width) / this.game.config.width,
				(game.input.mousePointer.y * this.background.height) / this.game.config.height,
				1000,
				"Power1",
				true
			);
		} else {
			this.cameras.main.centerOn(this.fish.x, this.fish.y);
		}
	}
}
