import faiss
import json
import numpy as np
from sentence_transformers import SentenceTransformer
from pathlib import Path

class FaissSemanticEngine:
    def __init__(self, index_path=None, mapping_path=None, data_path=None, threshold=0.7):
        base = Path(__file__).parent.parent / 'datasets'
        self.index_path = index_path or (base / 'knowledge_base_faiss.index')
        self.mapping_path = mapping_path or (base / 'knowledge_base_faiss_mapping.json')
        self.data_path = data_path or (base / 'knowledge_base_vector.jsonl')
        self.threshold = threshold
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.index = faiss.read_index(str(self.index_path))
        with open(self.mapping_path, 'r', encoding='utf-8') as f:
            self.id_map = json.load(f)
        with open(self.data_path, 'r', encoding='utf-8') as f:
            self.records = [json.loads(line) for line in f]

    def search(self, query, top_k=1):
        query_emb = self.model.encode([query], convert_to_numpy=True)
        D, I = self.index.search(query_emb, top_k)
        best_idx = I[0][0]
        best_score = D[0][0]
        # FAISS returns L2 distance, lower is better. Convert to similarity (optional)
        # For thresholding, you may want to use a max distance or compute cosine similarity
        record = self.records[best_idx]
        # Optionally, add a threshold check here
        return {
            'id': record['id'],
            'text': record['text'],
            'metadata': record['metadata'],
            'score': float(best_score)
        }

# Example usage:
# engine = FaissSemanticEngine()
# result = engine.search('What is the grading system?')
# print(result)
