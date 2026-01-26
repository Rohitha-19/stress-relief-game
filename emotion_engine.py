def detect_emotion(data):
    if not data:
        return "Calm"

    avg_reaction = sum(d['reaction'] for d in data) / len(data)
    total_clicks = sum(d['clicks'] for d in data)

    if avg_reaction > 1.5:
        return "Stressed"

    if total_clicks <= len(data):
        return "Bored"

    return "Calm"
