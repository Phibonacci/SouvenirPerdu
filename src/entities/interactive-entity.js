export default class InteractiveEntity extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, texture) {
		super(scene, x, y, texture);

		this.on("pointerover", () => {
			this.tint = 0xff0000;
		});
		this.on("pointerout", () => {
			this.tint = 0xffffff;
		});

		this.setInteractive({
			useHandCursor: true,
			pixelPerfect: false,
		});
	}
}
