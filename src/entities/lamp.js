export default class Lamp extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);

		this.isLit = false;
		this.zoomFactor = 1.5;

		this.switch = new Phaser.GameObjects.Sprite(scene, 50, 10, "lamp-switch");
		this.switch.scale = 0.5;
		this.add(this.switch);

		this.light = new Phaser.GameObjects.Sprite(scene, 0, -140, "lamp-light");
		this.light.scale = 0.5;
		this.light.alpha = 0;
		this.add(this.light);

		this.sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, "lamp");
		this.sprite.scale = 0.4;
		this.add(this.sprite);

		this.sprite.on("pointerdown", (pointer) => {
			if (pointer.leftButtonDown()) {
				this.emit("selected");
			}
		});

		this.switch.on("pointerover", () => {
			this.switch.tint = 0x808080;
		});

		this.switch.on("pointerout", () => {
			this.switch.tint = 0xffffff;
		});

		this.sprite.on("pointerover", () => {
			this.sprite.tint = 0x808080;
			this.switch.tint = 0x808080;
		});

		this.sprite.on("pointerout", () => {
			this.sprite.tint = 0xffffff;
			this.switch.tint = 0xffffff;
		});

		this.switch.on("pointermove", (pointer) => {
			if (pointer.leftButtonDown() && !this.isLit) {
				this.switch.y += (pointer.position.y - pointer.prevPosition.y) * this.switch.scale;
				if (this.switch.y < 5) {
					this.switch.y = 5;
				}
				if (this.switch.y > 30) {
					this.switch.y = 30;
					this.isLit = true;
					this.light.alpha = 0.25;
					this.emit("selected");
				}
			}
		});
	}

	enableInteractivity() {
		this.switch.setInteractive({ useHandCursor: true });
		this.sprite.setInteractive({ useHandCursor: true });
	}

	onSelected() {
		this.sprite.input.enabled = false;
		this.switch.input.enabled = !this.isLit;
	}

	onUnselected() {
		this.sprite.input.enabled = true;
		this.switch.input.enabled = false;
	}
}
