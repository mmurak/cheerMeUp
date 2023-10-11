class SpeechEngine {
	constructor() {
		this.lang;
		this.pitch;
		this.rate;
		this.text;
		this.voice;
		this.volume;
		this.engine = speechSynthesis;
		this.dictionary = {};
	}
	getVoices(prefix, local, online) {
		const voiceList = this.engine.getVoices();
		this.dictionary = {};
		for (let e of voiceList) {
			if (e.lang.startsWith(prefix)) {
				if ((e.localService && local) || (!e.localService && online)) {
					this.dictionary[e.voiceURI] = e;
				}
			}
		}
		return Object.values(this.dictionary);
	}
	speak(lang, text, voice, rate, pitch, onPauseStop) {
		const uttr = new SpeechSynthesisUtterance(text);
		uttr.lang = lang;
		uttr.rate = rate;
		uttr.pitch = pitch;
		uttr.voice = this.dictionary[voice];
		uttr.addEventListener("pause", (e) => onPauseStop());
		uttr.addEventListener("stop", (e) => onPauseStop());
		uttr.addEventListener("end", (e) => onPauseStop());
		speechSynthesis.speak(uttr);
	}
	pause() {
		this.engine.pause();
	}
	resume() {
		if (this.engine.pending) {
			this.engine.resume();
		}
	}
	stop() {
		this.engine.pause();
		this.engine.cancel();
	}
	isSpeaking() {
		return this.engine.speaking;
	};
}
