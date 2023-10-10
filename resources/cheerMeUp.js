class GlobalManager {
	constructor() {
		this.apiKey = document.getElementById("APIkeyInput");
		this.signIn = document.getElementById("signIn");
		this.forgetAPIK = document.getElementById("forgetAPIK");
		this.voiceSelector = document.getElementById("voiceSelector");
		this.userStatus = document.getElementById("userStatus");
		this.giveMeWisdom = document.getElementById("giveMeWisdom");
		this.replayWisdom = document.getElementById("replayWisdom");
		this.wisdomArea = document.getElementById("wisdomArea");
		this.inputArea = document.getElementById("inputArea");
		this.utter = document.getElementById("utter");
		this.displayText = document.getElementById("displayText");
		this.lsAPI = "CMUapi-key";
		this.lsVoice = "CMUvoice";
		this.currentQuote = "";
		this.currentAuthor = "";
		this.currentVoice = "";
		this.currentUserVoice = "";
		this.audio;
		this.audio2 = null;
		this.audio2Text = "";
	}
}

let G = new GlobalManager();

addEventListener("load", () => {
	// Set up the widgets' disabled flag
	G.replayWisdom.disabled = true;
	G.displayText.disabled = true;

	// localStorage handling
	if (localStorage.getItem(G.lsAPI)) {
		G.apiKey.value = localStorage.getItem(G.lsAPI);
		setUp(localStorage.getItem(G.lsAPI));
	}

	// API Key handling
	G.signIn.addEventListener("click", () => {
		if (G.apiKey.value != "") {
			setUp(G.apiKey.value);
		}
	});

	// Clear localStorage
	G.forgetAPIK.addEventListener("click", () => {
		localStorage.removeItem(G.lsAPI);
		localStorage.removeItem(G.lsVoice);
		G.apiKey.value = "";
		G.voiceSelector.innerHTML = "";
	});

	// Changed voice selection
	G.voiceSelector.addEventListener("change", () => {
		localStorage.setItem(G.lsVoice, G.voiceSelector.options[G.voiceSelector.selectedIndex].value);
	});

	// load a new wisdom and speak
	G.giveMeWisdom.addEventListener("click", () => {
		G.wisdomArea.innerHTML = "&nbsp;<br/>&nbsp;";
		let quote = selectOneQuote();
		G.currentQuote = quote[0];
		G.currentAuthor = quote[1];
		G.displayText.disabled = false;
		if (G.voiceSelector.selectedIndex == -1) {
			return;
		}
		G.currentVoice = G.voiceSelector.options[G.voiceSelector.selectedIndex].value;
		G.giveMeWisdom.disabled = true;
		G.replayWisdom.disabled = true;
		G.utter.disabled = true;
		speak(G.currentQuote, G.apiKey.value, G.currentVoice);
	});

	// Replay the wisdom
	G.replayWisdom.addEventListener("click", () => {
		G.giveMeWisdom.disabled = true;
		G.replayWisdom.disabled = true;
		G.utter.disabled = true;
		if (G.voiceSelector.options[G.voiceSelector.selectedIndex].value != G.currentVoice) {
			G.currentVoice = G.voiceSelector.options[G.voiceSelector.selectedIndex].value;
			speak(G.currentQuote, G.apiKey.value, G.currentVoice);
			return;
		}
		G.audio.onended = () => {
			G.giveMeWisdom.disabled = false;
			if (G.currentQuote != "")  G.replayWisdom.disabled = false;
			G.utter.disabled = false;
		};
		G.audio.play();
	});

	// speak the user entered utterance
	G.utter.addEventListener("click", () => {
		if ((G.inputArea.value == "") || (G.voiceSelector.selectedIndex == -1))  return;
		let voiceID = G.voiceSelector.options[G.voiceSelector.selectedIndex].value;
		G.giveMeWisdom.disabled = true;
		G.replayWisdom.disabled = true;
		G.utter.disabled = true;
		userUtter(G.inputArea.value, G.apiKey.value, voiceID);
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
	});
});

function singleQuoteEscape(text) {
	return text.replaceAll("'", "’");
}

function setUp(apiKey) {
	localStorage.setItem(G.lsAPI, apiKey);
	constructVoiceSelector(apiKey);
	setStatus(apiKey);
}

function constructVoiceSelector(apiKey) {
	voiceSelector.innerHTML = "";
	const headers = new Headers();
	headers.append("xi-api-key", apiKey);
	headers.append("Content-Type", "application/json");

	fetch("https://api.elevenlabs.io/v1/voices", {
		method: "GET",
		headers: headers,
	})
	.then(response => {
		if (response.ok) {
			return response.json();
		} else {
			alert("Error: " + response.status + "\n" + G.apiKey.value);
			localStorage.removeItem(G.lsAPI);
			G.apiKey.value = "";
			throw new Error("Error: " + response.status);
		}
	})
	.then(json => {
		let vid = localStorage.getItem(G.lsVoice);
		for (let v of json.voices) {
			let o = document.createElement("option");
			o.text = v.name;
			o.value = v.voice_id;
			if (v.voice_id == vid) {
				o.selected = true;
			}
			voiceSelector.appendChild(o);
		}
	})
	.catch(error => {
		console.error('Error:', error);
	});
}

function setStatus(apiKey) {
	const headers = new Headers();
	headers.append('xi-api-key', apiKey);
	headers.append('Content-Type', 'application/json');

	fetch(`https://api.elevenlabs.io/v1/user/subscription`, {
		method: 'GET',
		headers: headers,
	})
	.then(response => {
		if (response.ok) {
			return response.json();
		} else {
			throw new Error('Error: ' + response.status);
		}
	})
	.then(json => {
		let resetDate = Number(json.next_character_count_reset_unix);
		G.userStatus.innerHTML = "Quota: " + json.character_count + "/" + json.character_limit + " [counter reset on " + new Date(resetDate * 1000).toLocaleString() + "]";
    })
    .catch(error => {
        console.error('Error:', error);
        status.innerText += '\nError: ' + error.message;
    });
}

function selectOneQuote() {
	let idx = Math.floor(Math.random() * quoteDict.length);
	return [quoteDict[idx][1], quoteDict[idx][0]];
}

function speak(text, apiKey, voiceID) {
	const headers = new Headers();
	headers.append('Accept', 'audio/mpeg');
	headers.append('xi-api-key', apiKey);
	headers.append('Content-Type', 'application/json');

	const body = JSON.stringify({
		text: text,
		model_id: 'eleven_monolingual_v1',
		voice_settings: {
			stability: 0.5,
			similarity_boost: 0.5
		}
	});

	fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceID}/stream`, {
		method: 'POST',
		headers: headers,
		body: body
	})
	.then(response => {
		if (response.ok) {
			return response.blob();
		} else {
			alert("Error: " + response.status);
			throw new Error('Error: ' + response.status);
		}
	})
	.then(blob => {
		const url = window.URL.createObjectURL(blob);
		G.audio = new Audio(url);
		G.audio.play();
		G.audio.onended = () => {
//			status.innerText += '\nAudio has finished playing!';
			G.giveMeWisdom.disabled = false;
			G.replayWisdom.disabled = false;
			G.utter.disabled = false;
			setStatus(apiKey);
		};
	})
	.catch(error => {
		console.error('Error:', error);
		G.giveMeWisdom.disabled = false;
		G.utter.disabled = false;
	});

}

function userUtter(text, apiKey, voiceID) {
	if ((G.audio2 != null) && (G.audio2Text == text) && (voiceID == G.currentUserVoice)) {
		G.audio2.onended = () => {
			G.giveMeWisdom.disabled = false;
			if (G.currentQuote != "")  G.replayWisdom.disabled = false;
			G.utter.disabled = false;
		};
		G.audio2.play();
		return;
	}
	G.audio2Text = text;
	G.currentUserVoice = voiceID;
	const headers = new Headers();
	headers.append('Accept', 'audio/mpeg');
	headers.append('xi-api-key', apiKey);
	headers.append('Content-Type', 'application/json');

	const body = JSON.stringify({
		text: text,
		model_id: 'eleven_monolingual_v1',
		voice_settings: {
			stability: 0.5,
			similarity_boost: 0.5
		}
	});

	fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceID}/stream`, {
		method: 'POST',
		headers: headers,
		body: body
	})
	.then(response => {
		if (response.ok) {
			return response.blob();
		} else {
			alert("Error: " + response.status);
			throw new Error('Error: ' + response.status);
		}
	})
	.then(blob => {
		const url = window.URL.createObjectURL(blob);
		G.audio2 = new Audio(url);
		G.audio2.play();
		G.audio2.onended = () => {
//			status.innerText += '\nAudio has finished playing!';
			G.giveMeWisdom.disabled = false;
			if (G.currentQuote != "")  G.replayWisdom.disabled = false;
			G.utter.disabled = false;
			setStatus(apiKey);
		};
	})
	.catch(error => {
		console.error('Error:', error);
		G.giveMeWisdom.disabled = false;
		G.utter.disabled = false;
	});

}
