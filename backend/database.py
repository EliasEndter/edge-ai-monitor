import os
import sqlite3


PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")


class Database:
    def __init__(self, db_path=None):
        self.db_path = db_path or os.path.join(DATA_DIR, "events.db")

        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)

        self.create_tables()

    def connect(self):
        return sqlite3.connect(self.db_path)

    def create_tables(self):
        with self.connect() as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS detections (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    label TEXT NOT NULL,
                    confidence REAL NOT NULL,
                    is_security_event INTEGER NOT NULL DEFAULT 0
                )
                """
            )

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
                    int(is_security_event),
                ),
            )

    def get_detections(self, limit=20):
        with self.connect() as connection:
            connection.row_factory = sqlite3.Row

            rows = connection.execute(
                """
                SELECT *
                FROM detections
                ORDER BY id DESC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()

            return [dict(row) for row in rows]

    def get_security_events(self, limit=20):
        with self.connect() as connection:
            connection.row_factory = sqlite3.Row

            rows = connection.execute(
                """
                SELECT *
                FROM detections
                WHERE is_security_event = 1
                ORDER BY id DESC LIMIT ?
                """,
                (limit,),
            ).fetchall()

            return [dict(row) for row in rows]

    def get_stats(self):
        with self.connect() as connection:
            total_detections = connection.execute(
                "SELECT COUNT(*) FROM detections"
            ).fetchone()[0]

            security_events = connection.execute(
                """
                SELECT COUNT(*)
                FROM detections
                WHERE is_security_event = 1
                """
            ).fetchone()[0]

            person_detections = connection.execute(
                """
                SELECT COUNT(*)
                FROM detections
                WHERE label = 'person'
                """
            ).fetchone()[0]

        return {
            "total_detections": total_detections,
            "security_events": security_events,
            "person_detections": person_detections,
        }

