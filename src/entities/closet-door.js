export default class ClosetDoor extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "closet-door-closed");

		this.scale = 0.7;
		this.zoomFactor = 2.9;
		this.inputOnZoom = true;

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
						scene.soundPlayer.play("closet-door");
						this.inputOnZoom = false;
					}
				} else {
					this.emit("selected");
				}
			}
		});
	}

	onSelected() {
		this.isSelected = true;
		this.input.enabled = this.inputOnZoom;
	}

	onUnselected() {
		this.isSelected = false;
		this.input.enabled = true;
	}
}
