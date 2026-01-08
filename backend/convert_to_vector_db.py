import json
from pathlib import Path

# Load the original R23_Regulations.json
with open('data/R23_Regulations.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

vector_records = []
for entry in data['knowledge_base']:
    vector_records.append({
        'id': entry['id'],
        'text': entry['content'],
        'metadata': entry['metadata']
    })


# Save as vector-db ready JSONL (one record per line)
output_path = Path(__file__).parent / 'datasets' / 'knowledge_base_vector.jsonl'
output_path.parent.mkdir(parents=True, exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    for rec in vector_records:
        f.write(json.dumps(rec, ensure_ascii=False) + '\n')

print(f"Converted {len(vector_records)} records to vector-db ready format.")
