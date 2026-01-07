from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from core.intent_classifier import IntentClassifier
from core.meta_controller import MetaController
from core.validator import validate_response
from engines.retrieval_engine import RetrievalEngine
from engines.calculator import calculate
from engines.rule_engine import rule_engine
from engines.transformer_engine import explain

# Initialize FastAPI app
app = FastAPI(title="Student Meta-Learning AI Backend")

# Initialize components
intent_classifier = IntentClassifier()
meta_controller = MetaController()
retrieval_engine = RetrievalEngine()

class QueryRequest(BaseModel):
    query: str

@app.post("/query")
def handle_query(request: QueryRequest):
    query = request.query

    # Step 1: Predict intent
    intent, confidence = intent_classifier.predict(query)

    # Step 2: Select engine
    engine = meta_controller.select_engine(intent)

    # Step 3: Process query
    if engine == "RETRIEVAL":
        result = retrieval_engine.retrieve(query)
    elif engine == "CALCULATOR":
        result = calculate(query)
    elif engine == "RULE":
        result = rule_engine(query)
    elif engine == "TRANSFORMER":
        result = explain(query)
    else:
        raise HTTPException(status_code=400, detail="Unsupported engine")

    # Step 4: Validate output
    if not result["answer"]:
        raise HTTPException(status_code=500, detail="Failed to generate a valid response")

    # Step 5: Return response
    return {
        "query": query,
        "intent": intent,
        "engine": engine,
        "answer": result["answer"],
        "confidence": result["confidence"],
        "source": result["source"],
        "explanation": f"The {engine} engine was used based on the predicted intent."
    }

@app.get("/health")
def health():
    return {"status": "Backend running"}
