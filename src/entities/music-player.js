export default class MusicPlayer {
	static preload(scene) {
		scene.load.audio("all-piano", "assets/musics/all-piano.ogg");
		scene.load.audio("bonus-savannah", "assets/musics/bonus-savannah.ogg");
		scene.load.audio("part2-bass", "assets/musics/part2-bass.ogg");
		scene.load.audio("part2-guitar", "assets/musics/part2-guitar.ogg");
		scene.load.audio("part3-bass", "assets/musics/part3-bass.ogg");
		scene.load.audio("part3-drums", "assets/musics/part3-drums.ogg");
		scene.load.audio("part3-guitar", "assets/musics/part3-guitar.ogg");
		scene.load.audio("part4-flute", "assets/musics/part4-flute.ogg");
	}

	constructor(scene) {
		this.scene = scene;
		this.playing = 0;

		const names = [
			["all-piano"],
			["all-piano", "part2-bass", "part2-guitar"],
			["all-piano", "part3-bass", "part3-drums", "part3-guitar"],
			["all-piano", "part3-bass", "part3-drums", "part3-guitar", "part4-flute"],
		];

		this.loops = names.map((part) => part.map((name) => this.scene.sound.add(name)));
	}

	play(part) {
		let seekTo = 0;
		if (this.playing > 0) {
			seekTo = this.loops[this.playing][0].playTime;
		}

		this.playing = part;
		this.loops.forEach((part) => part.forEach((music) => music.stop()));
		this.loops[part - 1].forEach((music) => music.play({ loop: true, volume: 0.1, seek: seekTo }));
	}

	stop() {
		this.loops.forEach((part) => part.forEach((music) => music.stop()));
	}
}
