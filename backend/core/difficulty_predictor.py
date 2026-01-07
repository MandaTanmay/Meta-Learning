def predict_difficulty(query: str):
    if len(query.split()) < 4:
        return "EASY"
    if len(query.split()) < 8:
        return "MEDIUM"
    return "HARD"
