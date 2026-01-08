def rule_engine(reason: str):
    return {
        "answer": f"Request blocked: {reason}.",
        "confidence": 1.0,
        "source": "rule"
    }
