import RoomScene from "./scenes/room-scene.js";

export default class Game extends Phaser.Game {
	constructor() {
		super({
			type: Phaser.AUTO,
			width: 1024,
			height: 600,
			scene: [RoomScene],
		});
	}
}
