const DIGIT_SIZE = 64;

export default class PadlockDigit extends Phaser.GameObjects.TileSprite {
	constructor(padlock, x, y) {
		super(padlock.scene, x, y, DIGIT_SIZE, DIGIT_SIZE, "digits");
		this.scale = 0.5;

		this.on("pointermove", (pointer) => {
			if (padlock.isUnlocked) {
				return;
			}
			if (pointer.leftButtonDown()) {
				this.tilePositionY += pointer.position.y - pointer.prevPosition.y;
				this.tilePositionY = ((this.tilePositionY % (DIGIT_SIZE * 10)) + DIGIT_SIZE * 10) % (DIGIT_SIZE * 10);
			}
		});
		this.on("pointerup", (pointer) => {
			if (pointer.button === 0) {
				this.resetDigitPosition();
			}
		});
		this.on("pointerover", () => {
			if (padlock.isUnlocked) {
				return;
			}
			this.tint = 0x808080;
		});
		this.on("pointerout", () => {
			this.tint = 0xffffff;
			this.resetDigitPosition();
		});

		this.setInteractive({ useHandCursor: true });
	}

	getDigit() {
		return Math.round(this.tilePositionY / DIGIT_SIZE) % 10;
	}

	resetDigitPosition() {
		this.setDigitPosition(this.getDigit());
	}

	setDigitPosition(digit) {
		let targetY = digit * DIGIT_SIZE;
		if (targetY === 0 && this.tilePositionY > DIGIT_SIZE) {
			targetY = DIGIT_SIZE * 10;
		}
		this.scene.tweens.add({
			targets: this,
			tilePositionY: targetY,
			duration: 100,
		});

		this.emit("digit-changed", digit);
	}
}
