export default class Calendar extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "calendar");

		this.scale = 0.7;
		this.zoomFactor = 1.7;
		this.inputOnZoom = true;
		this.setInteractive({ useHandCursor: true });

		this.on("pointerover", () => {
			this.tint = 0x808080;
		});

		this.on("pointerout", () => {
			this.tint = 0xffffff;
		});

		this.on("pointerdown", (pointer) => {
			if (pointer.leftButtonDown()) {
				this.emit("selected");
			}
		});
	}

	disableInputOnZoom() {
		this.inputOnZoom = false;
	}

	onSelected() {
		this.input.enabled = this.inputOnZoom;
	}

	onUnselected() {
		this.input.enabled = true;
	}
}
