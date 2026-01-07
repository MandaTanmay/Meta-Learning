from core.domain_classifier import predict_domain
from core.intent_classifier import IntentClassifier
from core.difficulty_predictor import predict_difficulty
from core.hallucination_predictor import predict_risk
from core.engine_predictor import predict_engine
from core.quality_predictor import predict_quality
from core.validator import validate

from engines.rule_engine import rule_engine
from engines.retrieval_engine import RetrievalEngine
from engines.calculator import calculate
from engines.transformer_engine import explain

# Initialize the IntentClassifier
intent_classifier = IntentClassifier()

# Initialize the RetrievalEngine
retrieval_engine = RetrievalEngine()

def handle_query(query: str):
    domain, d_conf = predict_domain(query)
    if domain != "STUDENT":
        return rule_engine("Outside student domain")

    intent, i_conf = intent_classifier.predict(query)
    difficulty = predict_difficulty(query)
    risk = predict_risk(query)

    engine = predict_engine(intent)

    if engine == "RULE":
        response = rule_engine(intent)
    elif engine == "CALCULATOR":
        response = calculate(query)
    elif engine == "RETRIEVAL":
        response = retrieval_engine.retrieve(query)
    else:
        if risk == "HIGH_RISK":
            return rule_engine("High hallucination risk")
        response = explain(query)

    quality = predict_quality(response)

    if quality == "RISKY" or not validate(response):
        return rule_engine("Answer validation failed")

    return {
        "answer": response,
        "domain": domain,
        "intent": intent,
        "difficulty": difficulty,
        "engine": engine,
        "confidence": round((d_conf + i_conf) / 2, 2),
        "quality": quality
    }
