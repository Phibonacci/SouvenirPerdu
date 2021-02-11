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
import Television from "../entities/television.js";
import ClosetDoor from "../entities/closet-door.js";
import Videotape from "../entities/videotape.js";
import Recorder from "../entities/recorder.js";
import Calendar from "../entities/calendar.js";

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
		this.load.image("television", "assets/television.png");
		this.load.image("snow", "assets/snow.png");
		this.load.image("closet-door-closed", "assets/closet-door-closed.png");
		this.load.image("closet-door-opened", "assets/closet-door-opened.png");
		this.load.image("videotape", "assets/videotape.png");
		this.load.image("calendar", "assets/calendar-july.png");
		this.load.image("recorder-on", "assets/recorder-on.png");
		this.load.image("recorder-off", "assets/recorder-off.png");

		this.load.audio("padlock-open", "assets/sfx/padlock-open.ogg");
		this.load.audio("padlock-digit", "assets/sfx/padlock-digit.ogg");
		this.load.audio("lamp", "assets/sfx/lamp.ogg");
		this.load.audio("glasses", "assets/sfx/glasses.ogg");
		this.load.audio("television", "assets/sfx/television.ogg");
		this.load.audio("closet-door", "assets/sfx/closet-door.ogg");

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
		this.closetOpen = this.sound.add("closet-door");

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
		this.closetDoor = new ClosetDoor(this, 2017, 1013).setVisible(false);
		this.padlock = new Padlock(this, 1945, 1030, "715").setVisible(false);
		this.switch = new Switch(this, 820, 560).setVisible(false);
		this.videotape = new Videotape(this, 1974, 980).setVisible(false);
		this.recorder = new Recorder(this, 1568, 930).setVisible(false);
		this.calendar = new Calendar(this, 2200, 480).setVisible(false);
		this.television = new Television(this, 1590, 770);

		this.entities = [
			this.glasses,
			this.picture,
			this.lamp,
			this.notebook,
			this.closetDoor,
			this.padlock,
			this.switch,
			this.videotape,
			this.recorder,
			this.calendar,
			this.television,
		];
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
			this.narrator.play("picture-unknown");
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
			this.television.setAlpha(0).setVisible(true);
			this.recorder.setAlpha(0).setVisible(true);
			this.tweens.add({
				targets: this.notebook,
				alpha: 1,
				duration: 3000,
				delay: 2500,
			});
			this.tweens.add({
				targets: this.padlock,
				alpha: 1,
				duration: 1000,
				delay: 7000,
			});
			this.tweens.add({
				targets: this.switch,
				alpha: 1,
				duration: 3000,
				delay: 5500,
			});
			this.tweens.add({
				targets: this.television,
				alpha: 1,
				duration: 1000,
				delay: 7000,
			});
			this.tweens.add({
				targets: this.recorder,
				alpha: 1,
				duration: 1000,
				delay: 6000,
			});

			// Let there be light
			this.tweens.add({
				targets: this.spotlight_settings,
				ray: 0.8,
				duration: 9000,
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

					// Play the last music track
					this.musicPlayer.play(4);
					this.closetDoor.setAlpha(0).setVisible(true);
					this.tweens.add({
						targets: this.closetDoor,
						alpha: 1,
						duration: 1000,
						delay: 0,
					});
				},
			});
		}

		if (entity === this.switch) {
			this.switch.turnOn();

			// Let there be light
			this.tweens.add({
				targets: this.spotlight_settings,
				ray: 1.4,
				duration: 20000,
			});

			this.calendar.setAlpha(0).setVisible(true);
			this.tweens.add({
				targets: this.calendar,
				alpha: 1,
				duration: 3000,
				delay: 5000,
			});

			// make picture appear
			this.tweens.add({
				targets: this.picture,
				alpha: 1,
				duration: 1500,
				delay: 2000,
			});
			this.unselectEntity();
		}

		if (entity == this.television) {
			this.television.switchState();
		}

		if (entity == this.closetDoor) {
			this.closetOpen.play();
			this.videotape.setVisible(true);
			this.tweens.add({
				targets: this.videotape,
				alpha: 1,
				duration: 1000,
				delay: 0,
			});
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
