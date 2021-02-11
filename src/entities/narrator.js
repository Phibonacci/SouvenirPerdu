const AVAILABLE_VOICES = [
	"715",
	"calendar",
	"mmmhh",
	"picture-familiar",
	"picture-unknown",
	"radio",
	"remember",
	"this-place",
	"videotape-unknown",
	"videotape-ready",
];

export default class Narrator {
	static preload(scene) {
		for (const voice of AVAILABLE_VOICES) {
			scene.load.audio(voice, `assets/voices/${voice}.ogg`);
		}
	}

	constructor(scene) {
		this.scene = scene;
		this.played = {};
	}

	play(voice, canPlayMoreThanOnce) {
		if (this.played[voice] && !canPlayMoreThanOnce) {
			return;
		}
		this.played[voice] = true;

		if (this.sound) {
			this.sound.stop();
		}

		this.sound = this.scene.sound.add(voice, { volume: 2.5 });
		this.sound.play();
	}
}
