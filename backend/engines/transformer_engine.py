from transformers import pipeline

model = pipeline("text2text-generation", model="google/flan-t5-small")

def explain(query: str):
    result = model(query, max_length=120)
    return {
        "answer": result[0]["generated_text"],
        "confidence": 1.0,  # Transformers are not probabilistic here, so use 1.0
        "source": "transformer"
    }
