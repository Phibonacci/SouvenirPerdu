import PadlockDigit from "./padlock-digit.js";

export default class Padlock extends Phaser.GameObjects.Container {
	constructor(scene, x, y, password) {
		super(scene, x, y);

		this.password = password;
		this.isUnlocked = false;

		this.sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, "padlock");
		this.sprite.scale = 0.1;
		this.add(this.sprite);

		this.digits = [new PadlockDigit(this, -27, 38), new PadlockDigit(this, -0.5, 38), new PadlockDigit(this, 26, 38)];

		for (const digit of this.digits) {
			this.add(digit);
			digit.on("digit-changed", () => {
				this.onCodeChanged();
			});
		}

		this.sprite.setInteractive({ useHandCursor: true });

		this.sprite.on("pointerover", () => {
			this.sprite.tint = 0x808080;
			for (const digit of this.digits) {
				digit.tint = 0x808080;
			}
		});

		this.sprite.on("pointerout", () => {
			this.sprite.tint = 0xffffff;
			for (const digit of this.digits) {
				digit.tint = 0xffffff;
			}
		});

		this.sprite.on("pointerdown", (pointer) => {
			if (pointer.leftButtonDown()) {
				if (!this.scene.isZoomedIn) {
					this.select();
				} else if (this.isUnlocked) {
					this.emit("unlocked");
				}
			}
		});

		this.unselect();
	}

	getCode() {
		return this.digits.map((x) => x.getDigit()).join("");
	}

	select() {
		if (!this.isUnlocked) {
			this.sprite.input.enabled = false;
			for (const digit of this.digits) {
				digit.input.enabled = true;
			}
		}
		this.emit("selected");
	}

	unselect() {
		this.sprite.input.enabled = true;
		for (const digit of this.digits) {
			digit.input.enabled = false;
		}
	}

	onCodeChanged() {
		if (!this.isUnlocked && this.getCode() === this.password) {
			this.isUnlocked = true;
			this.sprite.setTexture("padlock-unlocked");
			this.sprite.input.enabled = true;
			for (const digit of this.digits) {
				digit.input.enabled = false;
			}
		}
	}
}
