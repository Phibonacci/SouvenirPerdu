import RoomScene from "./scenes/room-scene.js";
import GrayscalePipeline from "./pipelines/grayscale.js";
import BlurPostFX from "./pipelines/blur.js";

export default class Game extends Phaser.Game {
	constructor() {
		super({
			type: Phaser.AUTO,
			width: 1024,
			height: 600,
			scale: {
				mode: Phaser.Scale.FIT,
				autoCenter: Phaser.Scale.CENTER_BOTH,
			},
			scene: [RoomScene],
			pipeline: { GrayscalePipeline, BlurPostFX },
		});
	}
}
