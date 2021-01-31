export default class InteractiveEntity extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, texture) {
		super(scene, x, y, texture);

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

		this.setInteractive({ useHandCursor: true });
	}

	onSelected() {}

	onUnselected() {}
}
