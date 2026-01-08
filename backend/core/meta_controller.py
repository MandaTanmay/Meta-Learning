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
    intent, i_conf = intent_classifier.predict(query)
    difficulty = predict_difficulty(query)
    risk = predict_risk(query)

    # Out-of-domain fallback
    if domain != "STUDENT":
        return {
            "answer": "Sorry, I don’t have information on that topic. Please contact the administration for more details.",
            "domain": domain,
            "intent": None,
            "difficulty": None,
            "engine": "RULE",
            "confidence": d_conf,
            "quality": None,
            "source": "rule"
        }

    # Academic integrity guard
    forbidden_keywords = ["hack", "leak", "cheat", "predict marks", "get exam paper"]
    if any(kw in query.lower() for kw in forbidden_keywords):
        return {
            "answer": "Sorry, this query is blocked due to academic integrity policies.",
            "domain": domain,
            "intent": intent,
            "difficulty": difficulty,
            "engine": "RULE",
            "confidence": round((d_conf + i_conf) / 2, 2),
            "quality": None,
            "source": "rule"
        }

    # Retrieval-first logic for factual/student queries
    result = None
    engine = None
    if intent == "NUMERIC":
        result = calculate(query)
        engine = "CALCULATOR"
    elif intent == "FACTUAL" and domain == "STUDENT":
        retrieval_result = retrieval_engine.retrieve(query)
        # Use a stricter confidence threshold for retrieval
        if retrieval_result and retrieval_result.get("confidence", 0) >= 0.8:
            result = retrieval_result
            engine = "RETRIEVAL"
        else:
            result = explain(query)
            engine = "TRANSFORMER"
    elif intent == "EXPLANATION":
        result = explain(query)
        engine = "TRANSFORMER"
    elif intent == "UNSAFE":
        result = rule_engine("Unsafe or blocked query")
        engine = "RULE"
    else:
        result = rule_engine("Unknown engine")
        engine = "RULE"

    # Quality prediction
    quality = predict_quality(result["answer"])
    if quality == "RISKY" or not validate(result["answer"]):
        return {
            "answer": "Sorry, I cannot confidently answer this question. Please consult official resources or staff.",
            "domain": domain,
            "intent": intent,
            "difficulty": difficulty,
            "engine": engine,
            "confidence": round((d_conf + i_conf) / 2, 2),
            "quality": quality,
            "source": "rule"
        }

    return {
        "answer": result["answer"],
        "domain": domain,
        "intent": intent,
        "difficulty": difficulty,
        "engine": engine,
        "confidence": round((d_conf + i_conf) / 2, 2),
        "quality": quality,
        "source": result.get("source", None)
    }
