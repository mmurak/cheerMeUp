class GlobalManager {
	constructor() {
		this.voiceSelector = document.getElementById("voiceSelector");
		this.speedSelector = document.getElementById("speedSelector");
		this.pitchSelector = document.getElementById("pitchSelector");
		this.pitchLabel = document.getElementById("pitchLabel");
		this.giveMeWisdom = document.getElementById("giveMeWisdom");
		this.replayWisdom = document.getElementById("replayWisdom");
		this.wisdomArea = document.getElementById("wisdomArea");
		this.inputArea = document.getElementById("inputArea");
		this.utter = document.getElementById("utter");
		this.displayText = document.getElementById("displayText");
		this.currentQuote = "";
		this.currentAuthor = "";
		this.currentVoice = "";
		this.currentUserVoice = "";
		this.audio;
		this.audio2 = null;
		this.audio2Text = "";
		this.speechEngine = new SpeechEngine();
		this.lsVoice = "CMUliteVoice";
	}
}

let G = new GlobalManager();

addEventListener("load", () => {
	// Set up the widgets' disabled flag
	G.replayWisdom.disabled = true;
	G.displayText.disabled = true;

	// Changed voice selection
	G.voiceSelector.addEventListener("change", () => {
		localStorage.setItem(G.lsVoice, G.voiceSelector.options[G.voiceSelector.selectedIndex].value);
	});

	G.pitchSelector.addEventListener("input", () => {
		G.pitchLabel.innerHTML = "Pitch (" + Number(G.pitchSelector.value).toFixed(1) + "): ";
	});

	// load a new wisdom and speak
	G.giveMeWisdom.addEventListener("click", () => {
		G.wisdomArea.innerHTML = "&nbsp;<br/>&nbsp;";
		G.inputArea.value = "";
		G.inputArea.focus();
		let quote = selectOneQuote();
		G.currentQuote = quote[0];
		G.currentAuthor = quote[1];
		G.currentVoice = G.voiceSelector.options[G.voiceSelector.selectedIndex].value;
		widgetsControl(true);
		G.displayText.disabled = false;
		speak(G.currentQuote, G.currentVoice);
	});

	// Replay the wisdom
	G.replayWisdom.addEventListener("click", () => {
		G.currentVoice = G.voiceSelector.options[G.voiceSelector.selectedIndex].value;
		widgetsControl(true);
		speak(G.currentQuote, G.currentVoice);
	});

	// speak the user entered utterance
	G.utter.addEventListener("click", () => {
		widgetsControl(true);
		G.currentVoice = G.voiceSelector.options[G.voiceSelector.selectedIndex].value;
		speak(G.inputArea.value, G.currentVoice);
	});

	// Display text control
	G.displayText.addEventListener("click", () => {
		if (G.currentQuote == "")  return;
		let displayLine = G.currentQuote + "<br/>";
		displayLine += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--A <a href='https://google.com/search?q=\"" + singleQuoteEscape(G.currentQuote) + "\"' style='text-decoration:none;color:black' target='_blank'>quote</a> from ";
		if (G.currentAuthor != "") {
			displayLine += "<a href='https://google.com/search?q=\"" + singleQuoteEscape(G.currentAuthor) + "\"' target='_blank'>" + G.currentAuthor + "</a>.";
		} else {
			displayLine += "an unknown person.";
		}
		G.wisdomArea.innerHTML = displayLine;
		G.inputArea.focus();
	});

	constructVoiceSelector("en");	// to make Firefox happy
	G.speechEngine.engine.onvoiceschanged = (e) => {
		while (G.voiceSelector.firstChild) {
			G.voiceSelector.removeChild(G.voiceSelector.firstChild);
		}
		constructVoiceSelector('en');		// to make Chrome happy
	}

});

function singleQuoteEscape(text) {
	return text.replaceAll("'", "’");
}

function constructVoiceSelector(prefix) {
	const voiceList = G.speechEngine.getVoices(prefix, true, true);  //   speechSynthesis.getVoices();
	console.log(voiceList);
	for (let i=0; i<voiceList.length; i++) {
		const newOption = document.createElement('option');
		newOption.value = voiceList[i].voiceURI;
		newOption.text = voiceList[i].name;
		newOption.selected = voiceList[i].default;
		G.voiceSelector.appendChild(newOption);
	}
	let stVoice = localStorage.getItem(G.lsVoice);
	for (let i = 0; i < G.voiceSelector.length; i++) {
		let opt = G.voiceSelector.options[i];
		if (opt.value == stVoice) {
			opt.selected = true;
		}
	}
}

function selectOneQuote() {
	let idx = Math.floor(Math.random() * quoteDict.length);
	return [quoteDict[idx][1], quoteDict[idx][0]];
}

function speak(text, voiceID) {
	G.speechEngine.speak("en-US", text, voiceID, G.speedSelector.value, G.pitchSelector.value, onPauseStop)
}

function widgetsControl(flag) {
	G.voiceSelector.disabled = flag;
	G.speedSelector.disabled = flag;
	G.pitchSelector.disabled = flag;
	G.giveMeWisdom.disabled = flag;
	G.replayWisdom.disabled = flag;
	G.utter.disabled = flag;
}

function onPauseStop() {
	widgetsControl(false);
	G.inputArea.focus();
}

