export default class Radio extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "radio");

		this.scene = scene;
		this.scale = 0.25;
		this.setInteractive({ useHandCursor: true });

		this.on("pointerover", () => {
			this.tint = 0x808080;
		});

		this.on("pointerout", () => {
			this.tint = 0xffffff;
		});

		this.on("pointerdown", (pointer) => {
			if (pointer.leftButtonDown()) {
				if (!this.isSelected) {
					this.emit("selected");
				} else {
					this.scene.musicPlayer.toggleBonusMusic();
					setTimeout(() => {
						this.scene.narrator.play("radio");
					}, 1000);
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
