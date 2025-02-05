export default class Recorder extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "recorder-off");

		this.scale = 0.332;
		this.zoomFactor = 2.9;
		this.tapeInputEnabled = false;

		this.setInteractive({ useHandCursor: true });

		this.on("pointerover", () => {
			this.tint = 0x808080;
		});

		this.on("pointerover", () => {
			this.tint = 0xc0c0c0;
		});

		this.on("pointerout", () => {
			this.tint = 0xffffff;
		});

		this.on("pointerup", (pointer) => {
			if (pointer.button === 0) {
				this.emit("selected");
			}
		});
	}

	insertVideoTape() {
		this.setTexture("recorder-on");
	}

	enableVideotapeInput() {
		this.tapeInputEnabled = true;
	}

	isVideoTapeInputEnabled() {
		return this.tapeInputEnabled;
	}

	onSelected() {}

	onUnselected() {}
}
