def predict_engine(intent: str):
    if intent == "NUMERIC":
        return "CALCULATOR"
    if intent == "FACTUAL":
        return "RETRIEVAL"
    if intent == "EXPLANATION":
        return "TRANSFORMER"
    return "RULE"
