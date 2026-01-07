import joblib
import os

class IntentClassifier:
    def __init__(self):
        model_path = os.path.join("models", "intent_model.pkl")
        vectorizer_path = os.path.join("models", "intent_vectorizer.pkl")

        self.model = joblib.load(model_path)
        self.vectorizer = joblib.load(vectorizer_path)

    def predict(self, query: str):
        X = self.vectorizer.transform([query])
        intent = self.model.predict(X)[0]
        confidence = max(self.model.predict_proba(X)[0])

        return intent, round(confidence, 2)

