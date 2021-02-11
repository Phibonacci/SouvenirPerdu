const AVAILABLE_VOICES = ["mmmhh", "picture-familiar", "picture-unknown", "radio", "remember", "this-place", "715"];

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

	play(voice) {
		if (this.played[voice]) {
			return;
		}
		this.played[voice] = true;

		const sound = this.scene.sound.add(voice, { volume: 2.5 });
		sound.play();
	}
}
