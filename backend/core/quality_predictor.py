def predict_quality(answer: str):
    if not answer or len(answer) < 5:
        return "RISKY"
    return "GOOD"
