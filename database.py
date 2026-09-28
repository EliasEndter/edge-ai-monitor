import sqlite3
import os


class Database:
    def __init__(self, db_path="data/events.db"):
        self.db_path = db_path

        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)

        self.create_tables()

    def connect(self):
        return sqlite3.connect(self.db_path)

    def create_tables(self):
        with self.connect() as connection:
            connection.execute("""
                CREATE TABLE IF NOT EXISTS detections (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    label TEXT NOT NULL,
                    confidence REAL NOT NULL,
                    is_security_event INTEGER NOT NULL DEFAULT 0
                )
            """)

    def save_detection(self, detection, is_security_event=False):
        with self.connect() as connection:
            connection.execute(
                """
                INSERT INTO detections (
                    timestamp,
                    label,
                    confidence,
                    is_security_event
                )
                VALUES (?, ?, ?, ?)
                """,
                (
                    detection.timestamp.isoformat(),
                    detection.label,
                    detection.confidence,
                    int(is_security_event)
                )
            )