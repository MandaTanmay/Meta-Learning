import sqlite3
import pandas as pd
from fastapi import APIRouter

router = APIRouter()

@router.get("/metrics/feedback")
def feedback_metrics():
    conn = sqlite3.connect("feedback/feedback.db")
    df = pd.read_sql_query("SELECT * FROM feedback", conn)
    conn.close()
    if df.empty:
        return {"count": 0, "helpful": 0, "not_helpful": 0, "by_engine": {}, "by_domain": {}}
    helpful = df[df["feedback"] == 1].shape[0]
    not_helpful = df[df["feedback"] == 0].shape[0]
    by_engine = df.groupby("engine")["feedback"].value_counts().unstack(fill_value=0).to_dict()
    by_domain = df.groupby("domain")["feedback"].value_counts().unstack(fill_value=0).to_dict()
    return {
        "count": int(df.shape[0]),
        "helpful": int(helpful),
        "not_helpful": int(not_helpful),
        "by_engine": by_engine,
        "by_domain": by_domain
    }
