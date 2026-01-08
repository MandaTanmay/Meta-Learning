import os
import json
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load knowledge base
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "../datasets/knowledge_base.json")

class RetrievalEngine:
    def __init__(self, threshold=0.7):
        self.threshold = threshold
        self.knowledge_base = self._load_knowledge_base()
        self.vectorizer = TfidfVectorizer(stop_words="english")
        # Only use entries with a 'question' key for TF-IDF fitting
        self.qa_entries = [entry for entry in self.knowledge_base if "question" in entry]
        self.tfidf_matrix = self.vectorizer.fit_transform([entry["question"] for entry in self.qa_entries])

    def _load_knowledge_base(self):
        with open(DATA_PATH, "r") as file:
            data = json.load(file)
            return data["facts"]

    def retrieve(self, query):
        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        max_sim_index = np.argmax(similarities)
        max_sim = similarities[max_sim_index]

        if max_sim < self.threshold:
            return {
                "answer": "I'm sorry, I cannot confidently answer this question.",
                "confidence": float(max_sim),
                "source": None,
            }

        best_match = self.qa_entries[max_sim_index]
        answer = best_match["answer"]
        # Block tautological or generic answers
        if (
            answer.strip().lower() == query.strip().lower() or
            len(answer.strip()) < 10 or
            answer.strip().lower() in ["i don't know", "not sure", "unknown", "no answer"]
        ):
            return {
                "answer": "I'm sorry, I cannot confidently answer this question.",
                "confidence": float(max_sim),
                "source": None,
            }
        return {
            "answer": answer,
            "confidence": float(max_sim),
            "source": best_match.get("category", None),
        }
