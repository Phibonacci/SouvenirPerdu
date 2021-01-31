const DIGIT_SIZE = 64;

export default class PadlockDigit extends Phaser.GameObjects.TileSprite {
	constructor(padlock, x, y) {
		const textureWidth = padlock.scene.game.textures.get("digits").getSourceImage().width;
		const textureHeight = padlock.scene.game.textures.get("digits").getSourceImage().height;
		super(padlock.scene, x, y, textureWidth, textureHeight / 10, "digits");
		this.scale = 0.14;

		this.on("pointermove", (pointer) => {
			if (padlock.isUnlocked) {
				return;
			}
			if (pointer.leftButtonDown()) {
				this.tilePositionY += (pointer.prevPosition.y - pointer.position.y) * 3;
				this.tilePositionY = ((this.tilePositionY % (this.height * 10)) + this.height * 10) % (this.height * 10);
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
		return Math.round(this.tilePositionY / this.height) % 10;
	}

	resetDigitPosition() {
		this.setDigitPosition(this.getDigit());
	}

	setDigitPosition(digit) {
		let targetY = digit * this.height;
		if (targetY === 0 && this.tilePositionY > this.height) {
			targetY = this.height * 10;
		}
		this.scene.tweens.add({
			targets: this,
			tilePositionY: targetY,
			duration: 100,
		});

		this.emit("digit-changed", digit);
	}
}
