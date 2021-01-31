export default class Notebook extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "notebook-page1");

		this.scale = 0.1;
		this.setInteractive({ useHandCursor: true });

		this.on("pointerover", () => {
			this.tint = 0xc0c0c0;
		});

		this.on("pointerout", () => {
			this.tint = 0xffffff;
		});

		this.on("pointerup", (pointer) => {
			if (pointer.button === 0) {
				if (this.isSelected) {
					this.scene.narrator.play("715");
					this.setTexture(this.texture.key === "notebook-page1" ? "notebook-page2" : "notebook-page1");
				} else {
					this.emit("selected");
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
