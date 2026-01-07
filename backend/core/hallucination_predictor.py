def predict_risk(query: str):
    if query.lower().startswith(("who", "when", "where")):
        return "HIGH_RISK"
    return "LOW_RISK"
