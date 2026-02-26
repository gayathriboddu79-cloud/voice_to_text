from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/translate", methods=["POST"])
def translate():
    data = request.json
    text = data["text"]
    source = data["source"]
    target = data["target"]

    url = "https://translate.googleapis.com/translate_a/single"

    params = {
        "client": "gtx",
        "sl": source,
        "tl": target,
        "dt": "t",
        "q": text
    }

    r = requests.get(url, params=params)

    translated = r.json()[0][0][0]

    return jsonify({"translatedText": translated})

if __name__ == "__main__":
    app.run(debug=True)
