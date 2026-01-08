import logging
logging.basicConfig(level=logging.INFO)

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
from engines.faiss_engine import FaissSemanticEngine

# Initialize the IntentClassifier
intent_classifier = IntentClassifier()

# Initialize the RetrievalEngine
retrieval_engine = RetrievalEngine()

# Initialize the FAISS semantic engine
faiss_engine = FaissSemanticEngine()

def handle_query(query: str):
    domain, d_conf = predict_domain(query)
    intent, i_conf = intent_classifier.predict(query)
    difficulty = predict_difficulty(query)
    risk = predict_risk(query)

    logging.info(f"Query: {query}")
    logging.info(f"Predicted domain: {domain} (conf: {d_conf}) | intent: {intent} (conf: {i_conf})")

    # Out-of-domain fallback
    if domain != "STUDENT":
        logging.info("Out-of-domain. Returning fallback.")
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
        logging.info("Blocked by academic integrity guard.")
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

    # Key fix: fallback to CALCULATOR for numeric queries
    result = None
    engine = None
    if intent == "NUMERIC" or ("calculate" in query.lower() or "cgpa" in query.lower() or "percentage" in query.lower()):
        result = calculate(query)
        engine = "CALCULATOR"
        logging.info("Engine selected: CALCULATOR (fallback)")
    elif intent == "FACTUAL" and domain == "STUDENT":
        # Try FAISS semantic search first
        faiss_result = faiss_engine.search(query, top_k=3)
        logging.info(f"FAISS top-3 scores: {[faiss_result['score'] for faiss_result in [faiss_engine.search(query, top_k=i+1) for i in range(3)]]}")
        # Lower threshold for testing (e.g., < 5.0)
        if faiss_result and faiss_result['score'] < 5.0:
            result = {
                "answer": faiss_result['text'],
                "confidence": 1.0 - faiss_result['score'],
                "source": faiss_result['metadata'].get('source', None)
            }
            engine = "FAISS_SEMANTIC"
            logging.info("Engine selected: FAISS_SEMANTIC")
        else:
            retrieval_result = retrieval_engine.retrieve(query)
            logging.info(f"Retrieval confidence: {retrieval_result.get('confidence', 0)}")
            if retrieval_result and retrieval_result.get("confidence", 0) >= 0.8:
                result = retrieval_result
                engine = "RETRIEVAL"
                logging.info("Engine selected: RETRIEVAL")
            else:
                result = explain(query)
                engine = "TRANSFORMER"
                logging.info("Engine selected: TRANSFORMER")
    elif intent == "EXPLANATION":
        result = explain(query)
        engine = "TRANSFORMER"
        logging.info("Engine selected: TRANSFORMER (EXPLANATION)")
    elif intent == "UNSAFE":
        result = rule_engine("Unsafe or blocked query")
        engine = "RULE"
        logging.info("Engine selected: RULE (UNSAFE)")
    else:
        result = rule_engine("Unknown engine")
        engine = "RULE"
        logging.info("Engine selected: RULE (Unknown)")

    # Quality prediction
    quality = predict_quality(result["answer"])
    # Relax validation for explanations
    if quality == "RISKY" or (not validate(result["answer"]) and intent != "EXPLANATION"):
        logging.info("Blocked by quality or validation.")
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

    logging.info(f"Final engine: {engine} | Answer: {result['answer']}")
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
