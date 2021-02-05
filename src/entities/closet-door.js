export default class ClosetDoor extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "closet-door-closed");

		this.scale = 0.7;
		this.zoomFactor = 2.9;

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
				if (this.isSelected) {
					this.emit("selected");
					if (this.texture.key == "closet-door-closed") {
						this.setTexture("closet-door-opened");
					}
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
