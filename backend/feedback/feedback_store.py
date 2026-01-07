import sqlite3

def store_feedback(query, feedback):
    conn = sqlite3.connect("feedback/feedback.db")
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            query TEXT,
            feedback TEXT
        )
    """)
    cur.execute("INSERT INTO feedback VALUES (?,?)", (query, feedback))
    conn.commit()
    conn.close()
