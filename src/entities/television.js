export default class Television extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);

		this.television_noise = scene.sound.add("television");
		this.zoomFactor = 2.0;
		this.isWedding = false;

		this.television = new Phaser.GameObjects.Sprite(scene, 0, 0, "television");
		this.television.scale = 0.5;
		this.television.setVisible(false);
		this.add(this.television);

		this.tvImage = new Phaser.GameObjects.Sprite(scene, -14.6, 22.8, "snow");
		this.tvImage.scale = 0.176;
		this.tvImage.setVisible(false);
		this.add(this.tvImage);

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

	setImageToWedding() {
		this.isWedding = true;
		this.tvImage.setTexture("wedding");
	}

	hasSeenWedding() {
		return this.isWedding;
	}

	onSelected() {}

	onUnselected() {
		this.television.input.enabled = true;
	}

	setVisible() {
		this.television.setVisible(true);
		this.television.setInteractive({ useHandCursor: true });
	}

	turnOn() {
		this.tvImage.setVisible(true);
		this.television_noise.play({ loop: true, volume: 0.5 });
	}

	turnOff() {
		this.tvImage.setVisible(false);
		this.television_noise.stop();
	}

	switchState() {
		this.tvImage.setVisible(!this.tvImage.visible);
		if (this.tvImage.visible) {
			this.turnOn();
		} else {
			this.turnOff();
		}
	}
}
