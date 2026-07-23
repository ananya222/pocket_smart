# init_db.py
import mysql.connector
import json
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "pocketsmart")

# Database connection helper
def get_db():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
    )

# JSON Query Loader
def load_queries(filename):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(current_dir, filename)
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)

# Load only table initialization queries
INIT_QUERIES = load_queries("init_queries.json")

# Initialization Query Strings
CREATE_DATABASE_QUERY = INIT_QUERIES["CREATE_DATABASE_QUERY"]
CREATE_USERS_TABLE_QUERY = INIT_QUERIES["CREATE_USERS_TABLE_QUERY"]
CHECK_COUNTRY_CODE_COLUMN_QUERY = INIT_QUERIES["CHECK_COUNTRY_CODE_COLUMN_QUERY"]
DROP_COUNTRY_CODE_COLUMN_QUERY = INIT_QUERIES["DROP_COUNTRY_CODE_COLUMN_QUERY"]
CREATE_ONBOARDING_TABLE_QUERY = INIT_QUERIES["CREATE_ONBOARDING_TABLE_QUERY"]
CREATE_GOALS_TABLE_QUERY = INIT_QUERIES["CREATE_GOALS_TABLE_QUERY"]
CREATE_TRANSACTIONS_TABLE_QUERY = INIT_QUERIES["CREATE_TRANSACTIONS_TABLE_QUERY"]

def initialize_database():
    try:
        # Step 1: Connect to MySQL server (without DB name) to verify/create database
        db = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
        )
        cursor = db.cursor()
        cursor.execute(CREATE_DATABASE_QUERY)
        cursor.close()
        db.close()
        print("Database 'pocketsmart' verified/created.")

        # Step 2: Connect to pocketsmart database and verify/create tables
        db = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
        )
        cursor = db.cursor()

        # Create users table
        cursor.execute(CREATE_USERS_TABLE_QUERY)
        db.commit()

        # Drop legacy country_code column if present
        cursor.execute(CHECK_COUNTRY_CODE_COLUMN_QUERY)
        if cursor.fetchone():
            cursor.execute(DROP_COUNTRY_CODE_COLUMN_QUERY)
            db.commit()
            print("Dropped legacy column 'country_code' from users table.")

        # Create accounts table
        cursor.execute(CREATE_ONBOARDING_TABLE_QUERY)
        db.commit()

        # Check if last_refreshed column exists in accounts table
        cursor.execute("SHOW COLUMNS FROM accounts LIKE 'last_refreshed'")
        if not cursor.fetchone():
            cursor.execute("ALTER TABLE accounts ADD COLUMN last_refreshed TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
            db.commit()
            print("Added 'last_refreshed' column to accounts table.")

        # Check if cycle_limit column exists in accounts table
        cursor.execute("SHOW COLUMNS FROM accounts LIKE 'cycle_limit'")
        if not cursor.fetchone():
            cursor.execute("ALTER TABLE accounts ADD COLUMN cycle_limit VARCHAR(50) DEFAULT NULL")
            db.commit()
            print("Added 'cycle_limit' column to accounts table.")

        # Create goals table
        cursor.execute(CREATE_GOALS_TABLE_QUERY)
        db.commit()

        # Check if priority column exists in goals table
        cursor.execute("SHOW COLUMNS FROM goals LIKE 'priority'")
        if not cursor.fetchone():
            cursor.execute("ALTER TABLE goals ADD COLUMN priority INT DEFAULT 3")
            db.commit()
            print("Added 'priority' column to goals table.")

        # Create transactions table
        cursor.execute(CREATE_TRANSACTIONS_TABLE_QUERY)
        db.commit()

        cursor.close()
        db.close()
        print("All database tables verified/created successfully.")

        # Auto-export database to database_preview.md for VS Code readability
        try:
            from export_tables import export_database_to_markdown
            export_database_to_markdown()
        except Exception as e:
            print("Failed to auto-export database markdown:", e)

        return True
    except mysql.connector.Error as err:
        print(f"Error initializing database: {err}")
        return False

if __name__ == "__main__":
    initialize_database()
