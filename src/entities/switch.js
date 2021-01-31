export default class Switch extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "switch-off");

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

	turnOn() {
		this.setTexture("switch-on");
	}

	onSelected() {}

	onUnselected() {}
}
