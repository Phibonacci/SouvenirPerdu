export default class Pouet extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "pouet");

		this.scale = 0.01;
		this.zoomFactor = 15;
		this.setInteractive({ useHandCursor: true });

		this.on("pointerover", () => {
			this.tint = 0xa0a0a0;
		});

		this.on("pointerout", () => {
			this.tint = 0xffffff;
		});

		this.on("pointerdown", (pointer) => {
			if (pointer.leftButtonDown()) {
				if (!this.isSelected) {
					this.emit("selected");
				} else {
					scene.soundPlayer.playRandomPouet();
				}
			}
		});
	}

	onSelected() {
		this.isSelected = true;
	}

	onUnselected() {
		this.isSelected = false;
	}
}
