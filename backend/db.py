# db.py
import mysql.connector
import json
import os

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Home@2024",
        database="pocketsmart"
    )

def load_queries(filename):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(current_dir, filename)
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)

INIT_QUERIES = load_queries("init_queries.json")
USER_QUERIES = load_queries("user_queries.json")
ONBOARDING_QUERIES = load_queries("onboarding_queries.json")
GOALS_QUERIES = load_queries("goals_queries.json")
TRANSACTIONS_QUERIES = load_queries("transactions_queries.json")
