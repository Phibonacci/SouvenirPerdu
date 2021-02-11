export default class Television extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);

		this.television_noise = scene.sound.add("television");
		this.zoomFactor = 2.0;

		this.television = new Phaser.GameObjects.Sprite(scene, 0, 0, "television");
		this.television.scale = 0.5;
		this.television.setVisible(false);
		this.add(this.television);

		this.snow = new Phaser.GameObjects.Sprite(scene, -14.6, 22.8, "snow");
		this.snow.scale = 0.176;
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

	onSelected() {}

	onUnselected() {
		this.television.input.enabled = true;
	}

	setVisible() {
		this.television.setVisible(true);
		this.television.setInteractive({ useHandCursor: true });
	}

	switchState() {
		this.snow.setVisible(!this.snow.visible);
		if (this.snow.visible) {
			this.television_noise.play({ loop: true, volume: 0.5 });
		} else {
			this.television_noise.stop();
		}
	}
}
