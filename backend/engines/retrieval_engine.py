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
        self.tfidf_matrix = self.vectorizer.fit_transform([entry["question"] for entry in self.knowledge_base])

    def _load_knowledge_base(self):
        with open(DATA_PATH, "r") as file:
            return json.load(file)

    def retrieve(self, query):
        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        max_sim_index = np.argmax(similarities)
        max_sim = similarities[max_sim_index]

        if max_sim < self.threshold:
            return {
                "answer": "I'm sorry, I cannot confidently answer this question.",
                "confidence": max_sim,
                "source": None,
            }

        best_match = self.knowledge_base[max_sim_index]
        return {
            "answer": best_match["answer"],
            "confidence": max_sim,
            "source": best_match["category"],
        }
