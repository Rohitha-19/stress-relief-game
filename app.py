from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
player_history = []

def detect_emotion(data):
    if not data:
        return "Calm"

    avg_reaction = sum(d['reaction'] for d in data) / len(data)
    total_clicks = sum(d['clicks'] for d in data)

    # STRESSED: player is clicking but reacting slowly
    if avg_reaction > 1.5:
        return "Stressed"

    # BORED: very low engagement / idle behavior
    if total_clicks <= len(data):
        return "Bored"

    # CALM: balanced interaction
    return "Calm"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/emotion', methods=['POST'])
def emotion():
    data = request.json
    player_history.append(data)
    emotion = detect_emotion(player_history[-10:])
    return jsonify({'emotion': emotion})

if __name__ == '__main__':
    app.run(debug=True)
