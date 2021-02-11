export default class Videotape extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "videotape");

		this.zoomFactor = 5.5;
		this.scale = 0.1;
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

	onSelected() {}

	onUnselected() {}
}
