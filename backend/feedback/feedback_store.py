import sqlite3
import datetime

def store_feedback(query, feedback, domain=None, intent=None, engine=None):
    conn = sqlite3.connect("feedback/feedback.db")
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            query TEXT,
            feedback INTEGER,
            domain TEXT,
            intent TEXT,
            engine TEXT,
            timestamp TEXT
        )
    """)
    cur.execute(
        "INSERT INTO feedback (query, feedback, domain, intent, engine, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
        (query, feedback, domain, intent, engine, datetime.datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()
