let recognition = null;

function startAction() {
    let mode = document.getElementById("mode").value;
    let lang = document.getElementById("language").value;
    let target = document.getElementById("targetLang").value;
    let sourceText = document.getElementById("sourceText").value;

    // TEXT → VOICE
    if (mode === "tts") {
        if (!sourceText.trim()) return alert("Enter text");
        let u = new SpeechSynthesisUtterance(sourceText);
        u.lang = lang;
        window.speechSynthesis.speak(u);
    }

    // VOICE → TEXT
    if (mode === "stt") {
        startVoiceInput(lang, false);
    }

    // TRANSLATION
    if (mode === "translate") {
        if (!sourceText.trim()) {
            startVoiceInput(lang, true);
        } else {
            translateText(sourceText, lang, target);
        }
    }
}

// Voice input function
function startVoiceInput(lang, doTranslate = false) {
    if (!("webkitSpeechRecognition" in window)) {
        alert("Use Chrome browser");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.lang = lang;

    recognition.onresult = function(event) {
        let spoken = event.results[0][0].transcript;
        document.getElementById("sourceText").value = spoken;

        if (doTranslate) {
            let target = document.getElementById("targetLang").value;
            translateText(spoken, lang, target);
        }
    };

    recognition.start();
}

// Translation via Flask
function translateText(text, source, target) {
    fetch("/translate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            text: text,
            source: source.split("-")[0], // en-US → en
            target: target
        })
    })
    .then(r => r.json())
    .then(d => {
        document.getElementById("translatedText").value = d.translatedText;
    })
    .catch(() => alert("Translation failed"));
}

function clearText() {
    document.getElementById("sourceText").value = "";
    document.getElementById("translatedText").value = "";
}
