import BlurPostFX from "../pipelines/blur.js";
import InteractiveEntity from "../entities/interactive-entity.js";

export default class RoomScene extends Phaser.Scene {
	constructor() {
		super("Room");
	}

	preload() {
		console.log("Preloading assets...");

		this.load.image("background", "assets/background.png");
		this.load.image("glasses", "assets/glasses.png");

		this.load.audio("test-music", "assets/music.ogg");
	}

	create() {
		console.log("Creating the game...");

		this.background = this.add.sprite(0, 0, "background");
		this.background.setOrigin(0, 0);
		this.background.setInteractive();

		this.background.scale = 0.7;

		this.isZoomedIn = false;
		this.selectedEntity = null;

		this.createEntities();

		for (const entity of this.entities) {
			this.add.existing(entity);

			entity.on("pointerdown", (pointer) => {
				if (pointer.leftButtonDown()) {
					if (this.isZoomedIn) {
						this.useEntity(entity);
					} else {
						this.selectEntity(entity);
					}
				}
			});
		}

		this.input.on("pointerdown", (pointer) => {
			if (pointer.rightButtonDown() && this.isZoomedIn) {
				this.unselectEntity();
			}
		});

		this.input.mouse.disableContextMenu();

		this.music = this.sound.add("test-music");
		for (let i = 0; i < 10; i++) {
			this.background.setPostPipeline(BlurPostFX);
		}
		this.cameras.main.setBounds(
			0,
			0,
			this.background.width * this.background.scale,
			this.background.height * this.background.scale
		);
	}

	update() {
		if (!this.selectedEntity) {
			this.cameras.main.pan(
				(game.input.mousePointer.x * this.background.width * this.background.scale) / this.game.config.width,
				(game.input.mousePointer.y * this.background.height * this.background.scale) / this.game.config.height,
				1000,
				"Power1",
				true
			);
		} else {
			this.cameras.main.centerOn(this.selectedEntity.x, this.selectedEntity.y);
		}
	}

	createEntities() {
		this.glasses = new InteractiveEntity(this, 150, 1520, "glasses");
		this.glasses.scale = 0.1;

		this.entities = [this.glasses];
	}

	selectEntity(entity) {
		this.isZoomedIn = true;
		this.selectedEntity = entity;
		this.cameras.main.zoomTo(3.0, 1000, "Power1", true);
	}

	useEntity(entity) {
		if (entity === this.glasses) {
			this.background.removePostPipeline(BlurPostFX);
			this.music.volume = 0;
			this.tweens.add({
				targets: this.music,
				volume: 0.2,
				duration: 2000,
			});
			this.music.play({ loop: true });
			this.glasses.destroy();
		}
		this.unselectEntity();
	}

	unselectEntity() {
		this.cameras.main.zoomTo(1.0, 1000, "Power1", true, (_, progress) => {
			if (progress >= 0.3) {
				this.isZoomedIn = false;
				this.selectedEntity = null;
			}
		});
	}
}
