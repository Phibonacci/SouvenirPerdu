import BlurPostFX from "../pipelines/blur.js";
import SpotlightPostFX from "../pipelines/spotlight.js";
import InteractiveEntity from "../entities/interactive-entity.js";
import Padlock from "../entities/padlock.js";
import MusicPlayer from "../entities/music-player.js";

export default class RoomScene extends Phaser.Scene {
	constructor() {
		super("Room");
	}

	preload() {
		console.log("Preloading assets...");

		this.load.image("background", "assets/background.png");
		this.load.image("glasses", "assets/glasses.png");
		this.load.image("digits", "assets/digits.png");
		this.load.image("padlock", "assets/padlock.png");
		this.load.image("padlock-unlocked", "assets/padlock-unlocked.png");

		MusicPlayer.preload(this);
	}

	update_light() {
		this.spotlight.set1f("tx", this.spotlight_settings.position.x / this.background.width);
		this.spotlight.set1f("ty", this.spotlight_settings.position.y / this.background.height);
		this.spotlight.set1f("r", this.spotlight_settings.ray * this.cameras.main.zoom);
		this.spotlight.set2f("resolution", this.game.config.width, this.game.config.height);
	}

	create() {
		console.log("Creating the game...");

		this.musicPlayer = new MusicPlayer(this);

		this.background = this.add.image(0, 0, "background");
		this.background.setOrigin(0, 0);

		this.spotlight = new SpotlightPostFX(this.game);
		this.game.renderer.pipelines.add("Spotlight", this.spotlight);
		this.spotlight_settings = {
			position: { x: 0, y: this.background.height },
			ray: 0.3,
		};
		this.update_light();
		this.background.setPipeline(this.spotlight);

		this.background.scale = 0.7;

		this.isZoomedIn = false;
		this.selectedEntity = null;

		this.createEntities();

		for (const entity of this.entities) {
			this.add.existing(entity);

			entity.on("selected", () => {
				if (this.isZoomedIn) {
					this.useEntity(entity);
				} else {
					this.selectEntity(entity);
				}
			});
		}

		this.input.on("pointerdown", (pointer) => {
			if (pointer.rightButtonDown() && this.isZoomedIn) {
				this.unselectEntity();
			}
		});

		this.input.mouse.disableContextMenu();

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
		if (this.spotlight_settings) {
			this.update_light();
		}
	}

	createEntities() {
		this.glasses = new InteractiveEntity(this, 150, 1520, "glasses");
		this.glasses.scale = 0.1;

		this.padlock = new Padlock(this, 1700, 1000, "517");
		this.add.existing(this.padlock);

		this.padlock.on("unlocked", () => {
			this.useEntity(this.padlock);
		});

		this.entities = [this.glasses, this.padlock];
	}

	selectEntity(entity) {
		this.isZoomedIn = true;
		this.selectedEntity = entity;
		this.cameras.main.zoomTo(3.0, 1000, "Power1", true);
	}

	useEntity(entity) {
		if (entity === this.glasses) {
			this.background.removePostPipeline(BlurPostFX);
			this.glasses.destroy();
			this.tweens.add({
				targets: this.spotlight_settings,
				ray: 0.8,
				duration: 8500,
			});
			this.selectedEntity = null;
			this.musicPlayer.play(1);
		}
		if (entity === this.padlock) {
			this.padlock.destroy();
			this.tweens.add({
				targets: this.spotlight_settings,
				ray: 2,
				duration: 30000,
			});
			this.selectedEntity = null;
			this.musicPlayer.play(4);
		}
		this.unselectEntity();
	}

	unselectEntity() {
		if (this.selectedEntity) {
			this.selectedEntity.unselect();
		}
		this.cameras.main.zoomTo(1.0, 1000, "Power1", true, (_, progress) => {
			if (progress >= 0.3) {
				this.isZoomedIn = false;
				this.selectedEntity = null;
			}
		});
	}
}
