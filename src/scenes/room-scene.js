import BlurPostFX from "../pipelines/blur.js";
import SpotlightPostFX from "../pipelines/spotlight.js";
import Glasses from "../entities/glasses.js";
import Notebook from "../entities/notebook.js";
import Padlock from "../entities/padlock.js";
import Lamp from "../entities/lamp.js";
import Picture from "../entities/picture.js";
import MusicPlayer from "../entities/music-player.js";
import Narrator from "../entities/narrator.js";
import Switch from "../entities/switch.js";
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
		this.load.image("lamp", "assets/lamp.png");
		this.load.image("lamp-switch", "assets/lamp-switch.png");
		this.load.image("lamp-light", "assets/lamp-light.png");
		this.load.image("notebook-page1", "assets/notebook-page1.png");
		this.load.image("notebook-page2", "assets/notebook-page2.png");
		this.load.image("picture", "assets/picture.png");
		this.load.image("picture-blur", "assets/picture-blur.png");
		this.load.image("switch-on", "assets/switch-on.png");
		this.load.image("switch-off", "assets/switch-off.png");

		this.load.audio("padlock-open", "assets/sfx/padlock-open.ogg");
		this.load.audio("padlock-digit", "assets/sfx/padlock-digit.ogg");
		this.load.audio("lamp", "assets/sfx/lamp.ogg");
		this.load.audio("glasses", "assets/sfx/glasses.ogg");

		MusicPlayer.preload(this);
		Narrator.preload(this);
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
		this.padlockOpen = this.sound.add("padlock-open");
		this.lampSwitch = this.sound.add("lamp");
		this.glassesTake = this.sound.add("glasses");

		this.narrator = new Narrator(this);

		this.background = this.add.sprite(0, 0, "background");
		this.background.setInteractive();
		this.background.setOrigin(0, 0);

		this.spotlight = new SpotlightPostFX(this.game);
		this.game.renderer.pipelines.add("Spotlight", this.spotlight);
		this.spotlight_settings = {
			position: { x: 0, y: this.background.height - 200 },
			ray: 0.25,
		};
		this.update_light();
		this.background.setPipeline(this.spotlight);

		this.background.scale = 0.7;

		this.isLockedDueToAnimation = false;
		this.selectedEntity = null;

		this.createEntities();

		for (const entity of this.entities) {
			this.add.existing(entity);

			entity.on("selected", () => {
				if (this.isLockedDueToAnimation) {
					return;
				}
				if (this.selectedEntity === entity) {
					this.useEntity(entity);
				} else {
					this.selectEntity(entity);
				}
			});
		}

		this.input.on("pointerdown", (pointer) => {
			if (this.isLockedDueToAnimation) {
				return;
			}
			if (pointer.rightButtonDown() && this.selectedEntity) {
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
		this.camera_speed = 1500;
	}

	update() {
		if (!this.selectedEntity) {
			this.cameras.main.pan(
				(game.input.mousePointer.x * this.background.width * this.background.scale) / this.game.config.width,
				(game.input.mousePointer.y * this.background.height * this.background.scale) / this.game.config.height,
				this.camera_speed,
				"Power1",
				true
			);
		} else {
			this.cameras.main.pan(this.selectedEntity.x, this.selectedEntity.y, 500, "Power1", true);
		}
		if (this.spotlight_settings) {
			this.update_light();
		}
	}

	createEntities() {
		this.glasses = new Glasses(this, 100, 1650);
		this.glasses.setPostPipeline(BlurPostFX);

		this.lamp = new Lamp(this, 290, 1420);
		for (let i = 0; i < 10; i++) {
			this.lamp.setPostPipeline(BlurPostFX);
		}

		this.picture = new Picture(this, 1730, 400).setVisible(false);
		this.notebook = new Notebook(this, 1050, 990).setVisible(false);
		this.padlock = new Padlock(this, 1620, 1050, "715").setVisible(false);
		this.switch = new Switch(this, 820, 560).setVisible(false);

		this.entities = [this.glasses, this.picture, this.lamp, this.notebook, this.padlock, this.switch];
	}

	selectEntity(entity) {
		entity.onSelected();
		this.selectedEntity = entity;

		if (entity === this.glasses) {
			this.narrator.play("mmmhh");
		}

		if (entity === this.lamp) {
			this.narrator.play("this-place");
		}

		if (entity === this.picture) {
			this.narrator.play("picture-familiar");
		}

		this.cameras.main.zoomTo(entity.zoomFactor || 3.0, 2500, "Power1", true);
	}

	useEntity(entity) {
		// Step 1: glasses -> lamp
		if (entity === this.glasses) {
			this.glassesTake.play();

			this.isLockedDueToAnimation = true;
			this.tweens.add({
				targets: this.glasses,
				alpha: 0,
				duration: 500,
				onComplete: () => {
					this.isLockedDueToAnimation = false;

					// Destroy the glasses
					this.glasses.destroy();
					this.selectedEntity = null;
					this.unselectEntity();

					// Remove blur
					this.background.removePostPipeline(BlurPostFX);

					// Play the first music track
					this.musicPlayer.play(1);

					// Show the lamp
					this.lamp.enableInteractivity();
					this.lamp.removePostPipeline(BlurPostFX);
				},
			});
		}

		// Step 2: lamp -> padlock
		if (entity === this.lamp) {
			this.lampSwitch.play();

			// Zoom out
			this.unselectEntity();

			// Play the second music track
			this.musicPlayer.play(2);

			this.notebook.setAlpha(0).setVisible(true);
			this.padlock.setAlpha(0).setVisible(true);
			this.picture.setAlpha(0).setVisible(true);
			this.switch.setAlpha(0).setVisible(true);
			this.tweens.add({
				targets: this.notebook,
				alpha: 1,
				duration: 3000,
				delay: 2500,
			});
			this.tweens.add({
				targets: this.padlock,
				alpha: 1,
				duration: 3000,
				delay: 5500,
			});
			this.tweens.add({
				targets: this.switch,
				alpha: 1,
				duration: 3000,
				delay: 5500,
			});

			// Let there be light
			this.tweens.add({
				targets: this.spotlight_settings,
				ray: 0.75,
				duration: 8500,
			});
		}

		// Step 3: padlock
		if (entity === this.padlock) {
			this.padlockOpen.play();

			this.isLockedDueToAnimation = true;
			this.tweens.add({
				targets: this.padlock,
				alpha: 0,
				duration: 500,
				onComplete: () => {
					this.isLockedDueToAnimation = false;

					// Destroy the padlock
					this.padlock.destroy();
					this.selectedEntity = null;
					this.unselectEntity();

					// Let there be light
					this.tweens.add({
						targets: this.spotlight_settings,
						ray: 2,
						duration: 30000,
					});

					// Play the last music track
					this.musicPlayer.play(4);
				},
			});
		}

		if (entity === this.switch) {
			this.switch.turnOn();
			this.tweens.add({
				targets: this.spotlight_settings,
				ray: 1.4,
				duration: 20000,
			});
			this.tweens.add({
				targets: this.picture,
				alpha: 1,
				duration: 1500,
				delay: 1000,
			});
			this.unselectEntity();
		}
	}

	unselectEntity() {
		if (this.selectedEntity) {
			this.selectedEntity.onUnselected();
		}

		this.isLockedDueToAnimation = true;
		this.cameras.main.zoomTo(1.0, 1200, "Power1", true, (_, progress) => {
			if (progress >= 0.7 && progress < 0.9) {
				this.camera_speed = 1500;
				this.selectedEntity = null;
			} else if (progress >= 0.9) {
				this.isLockedDueToAnimation = false;
				this.selectedEntity = null;
			} else {
				this.camera_speed = 5000;
			}
		});
	}
}
