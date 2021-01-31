export default class Picture extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "picture-blur");

		this.scale = 0.2;
		this.zoomFactor = 2.5;

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

	remember() {
		this.setTexture("picture");
	}

	onSelected() {}

	onUnselected() {}
}
