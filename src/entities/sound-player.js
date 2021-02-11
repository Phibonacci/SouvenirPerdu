const SOUNDS = [
	"padlock-open",
	"padlock-digit",
	"lamp",
	"wall-switch",
	"glasses",
	"television",
	"closet-door",
	"all-piano",
	"videotape",
	"pouet-claire",
	"pouet-louca",
	"pouet-marie",
	"pouet-maxou",
	"pouet-jean",
];

export default class SoundPlayer {
	static preload(scene) {
		for (const name of SOUNDS) {
			scene.load.audio(name, `assets/sfx/${name}.ogg`);
		}
	}

	constructor(scene) {
		this.scene = scene;
	}

	play(name) {
		const sound = this.scene.sound.add(name, { volume: 1.0 });
		sound.play();
	}

	playRandomPouet() {
		const pouets = SOUNDS.filter((x) => x.startsWith("pouet"));
		this.play(pouets[Math.floor(Math.random() * pouets.length)]);
	}
}
