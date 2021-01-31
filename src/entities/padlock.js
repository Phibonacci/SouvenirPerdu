import PadlockDigit from "./padlock-digit.js";

export default class Padlock extends Phaser.GameObjects.Container {
	constructor(scene, x, y, password) {
		super(scene, x, y);

		this.zoomFactor = 4.0;

		this.password = password;
		this.isUnlocked = false;

		this.sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, "padlock");
		this.sprite.scale = 0.05;
		this.add(this.sprite);

		this.digits = [
			new PadlockDigit(this, -13.25, 19),
			new PadlockDigit(this, -0.5, 19),
			new PadlockDigit(this, 13, 19),
		];

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
				this.emit("selected");
			}
		});

		this.sprite.input.enabled = true;
		for (const digit of this.digits) {
			digit.input.enabled = false;
		}
	}

	getCode() {
		return this.digits.map((x) => x.getDigit()).join("");
	}

	onSelected() {
		if (!this.isUnlocked) {
			this.sprite.input.enabled = false;
			for (const digit of this.digits) {
				digit.input.enabled = true;
			}
		}
	}

	onUnselected() {
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
