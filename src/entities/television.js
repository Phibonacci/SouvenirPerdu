export default class Television extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);

		this.zoomFactor = 1.7;

		this.television = new Phaser.GameObjects.Sprite(scene, 0, 0, "television");
		this.television.scale = 0.5;
		this.television.setVisible(false);
		this.add(this.television);
		this.television.setAlpha(0);

		this.snow = new Phaser.GameObjects.Sprite(scene, -14.6, 22, "snow");
		this.snow.scale = 0.173;
		this.snow.setVisible(false);
		this.add(this.snow);

		this.television.on("pointerdown", (pointer) => {
			if (pointer.leftButtonDown()) {
				this.emit("selected");
			}
		});

		this.television.on("pointerover", () => {
			this.television.tint = 0x808080;
		});

		this.television.on("pointerout", () => {
			this.television.tint = 0xffffff;
		});
	}

	onSelected() {
		this.television.input.enabled = false;
	}

	onUnselected() {
		this.television.input.enabled = true;
	}

	setVisible() {
		this.television.setVisible(true);
		this.television.setInteractive({ useHandCursor: true });
	}

	set transparancy(value) {
		this.television.setAlpha(value);
	}

	switchState() {
		this.snow.setVisible(!this.snow.visible);
	}
}
