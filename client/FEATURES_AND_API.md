# Student AI Dashboard: Features & API Endpoints

## Features
- Deterministic, decision-oriented AI backend (not a chatbot)
- Strict pipeline: ML + rules + logic for safe, explainable answers
- Academic domain enforcement
- Academic integrity guard (blocks cheating, leaks, etc.)
- Multi-model pipeline: domain, intent, difficulty, risk, quality
- Hard engine routing: Rule, Retrieval, Calculator, Transformer
- Output validation and refusal logic
- Feedback storage and automatic model retraining
- Live model metrics dashboard

## API Endpoints
- `POST /query` — Main inference endpoint
- `POST /feedback` — Store user feedback
- `GET /metrics/domain` — Domain classifier metrics
- `GET /metrics/intent` — Intent classifier metrics
- `GET /metrics/quality` — Quality predictor metrics
- `GET /health` — Backend health check

## Frontend Integration
- Query interface: submits to `/query`, displays structured answer
- Feedback buttons: submit to `/feedback`
- Model evaluation dashboard: fetches `/metrics/*`
- All results shown in UI with correct fields

---

For more, see backend/app.py and components in client/components/.
