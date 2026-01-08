import json
import faiss
from sentence_transformers import SentenceTransformer
import numpy as np

# Load vector-db ready records
data_path = 'datasets/knowledge_base_vector.jsonl'
with open(data_path, 'r', encoding='utf-8') as f:
    records = [json.loads(line) for line in f]

# Use a strong embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Compute embeddings
texts = [rec['text'] for rec in records]
embeddings = model.encode(texts, show_progress_bar=True, convert_to_numpy=True)

# Build FAISS index
embedding_dim = embeddings.shape[1]
index = faiss.IndexFlatL2(embedding_dim)
index.add(embeddings)

# Save index and mapping
faiss.write_index(index, 'datasets/knowledge_base_faiss.index')
with open('datasets/knowledge_base_faiss_mapping.json', 'w', encoding='utf-8') as f:
    json.dump([rec['id'] for rec in records], f, ensure_ascii=False, indent=2)

print(f"FAISS index built with {len(records)} records.")
