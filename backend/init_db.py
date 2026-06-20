# init_db.py
import mysql.connector
from db import INIT_QUERIES

CREATE_DATABASE_QUERY = INIT_QUERIES["CREATE_DATABASE_QUERY"]
CREATE_USERS_TABLE_QUERY = INIT_QUERIES["CREATE_USERS_TABLE_QUERY"]
CHECK_COUNTRY_CODE_COLUMN_QUERY = INIT_QUERIES["CHECK_COUNTRY_CODE_COLUMN_QUERY"]
DROP_COUNTRY_CODE_COLUMN_QUERY = INIT_QUERIES["DROP_COUNTRY_CODE_COLUMN_QUERY"]
CREATE_ONBOARDING_TABLE_QUERY = INIT_QUERIES["CREATE_ONBOARDING_TABLE_QUERY"]
CHECK_SAVINGS_GOAL_IMAGE_COLUMN_QUERY = INIT_QUERIES["CHECK_SAVINGS_GOAL_IMAGE_COLUMN_QUERY"]
ADD_SAVINGS_GOAL_IMAGE_COLUMN_QUERY = INIT_QUERIES["ADD_SAVINGS_GOAL_IMAGE_COLUMN_QUERY"]
CHECK_SAVINGS_PROGRESS_COLUMN_QUERY = INIT_QUERIES["CHECK_SAVINGS_PROGRESS_COLUMN_QUERY"]
ADD_SAVINGS_PROGRESS_COLUMN_QUERY = INIT_QUERIES["ADD_SAVINGS_PROGRESS_COLUMN_QUERY"]
CHECK_CURRENT_BALANCE_COLUMN_QUERY = INIT_QUERIES["CHECK_CURRENT_BALANCE_COLUMN_QUERY"]
ADD_CURRENT_BALANCE_COLUMN_QUERY = INIT_QUERIES["ADD_CURRENT_BALANCE_COLUMN_QUERY"]
CHECK_SAVINGS_PROGRESS_2_COLUMN_QUERY = INIT_QUERIES["CHECK_SAVINGS_PROGRESS_2_COLUMN_QUERY"]
ADD_SAVINGS_PROGRESS_2_COLUMN_QUERY = INIT_QUERIES["ADD_SAVINGS_PROGRESS_2_COLUMN_QUERY"]
CHECK_SAVINGS_PROGRESS_3_COLUMN_QUERY = INIT_QUERIES["CHECK_SAVINGS_PROGRESS_3_COLUMN_QUERY"]
ADD_SAVINGS_PROGRESS_3_COLUMN_QUERY = INIT_QUERIES["ADD_SAVINGS_PROGRESS_3_COLUMN_QUERY"]
CREATE_GOALS_TABLE_QUERY = INIT_QUERIES["CREATE_GOALS_TABLE_QUERY"]
CREATE_TRANSACTIONS_TABLE_QUERY = INIT_QUERIES["CREATE_TRANSACTIONS_TABLE_QUERY"]

def initialize_database():
    try:
        # Step 1: Connect to MySQL server (without specifying DB) to check/create database
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Home@2024"
        )
        cursor = db.cursor()
        cursor.execute(CREATE_DATABASE_QUERY)
        cursor.close()
        db.close()
        print("Database 'pocketsmart' verified/created.")

        # Step 2: Connect to pocketsmart database and create users table if it doesn't exist
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Home@2024",
            database="pocketsmart"
        )
        cursor = db.cursor()

        cursor.execute(CREATE_USERS_TABLE_QUERY)
        db.commit()

        # Drop country_code if it exists from earlier schemas
        cursor.execute(CHECK_COUNTRY_CODE_COLUMN_QUERY)
        if cursor.fetchone():
            cursor.execute(DROP_COUNTRY_CODE_COLUMN_QUERY)
            db.commit()
            print("Dropped column 'country_code' from users table.")

        cursor.execute(CREATE_ONBOARDING_TABLE_QUERY)
        db.commit()

        cursor.execute(CREATE_GOALS_TABLE_QUERY)
        db.commit()

        cursor.execute(CREATE_TRANSACTIONS_TABLE_QUERY)
        db.commit()

        # Check if savings_goal_image exists, if not alter table
        cursor.execute(CHECK_SAVINGS_GOAL_IMAGE_COLUMN_QUERY)
        if not cursor.fetchone():
            cursor.execute(ADD_SAVINGS_GOAL_IMAGE_COLUMN_QUERY)
            db.commit()
            print("Added column 'savings_goal_image' to user_onboarding table.")

        # Check if savings_progress_amount exists, if not alter table
        cursor.execute(CHECK_SAVINGS_PROGRESS_COLUMN_QUERY)
        if not cursor.fetchone():
            cursor.execute(ADD_SAVINGS_PROGRESS_COLUMN_QUERY)
            db.commit()
            print("Added column 'savings_progress_amount' to user_onboarding table.")

        # Check if current_balance exists, if not alter table
        cursor.execute(CHECK_CURRENT_BALANCE_COLUMN_QUERY)
        if not cursor.fetchone():
            cursor.execute(ADD_CURRENT_BALANCE_COLUMN_QUERY)
            db.commit()
            print("Added column 'current_balance' to user_onboarding table.")

        # Check if savings_progress_amount_2 exists, if not alter table
        cursor.execute(CHECK_SAVINGS_PROGRESS_2_COLUMN_QUERY)
        if not cursor.fetchone():
            cursor.execute(ADD_SAVINGS_PROGRESS_2_COLUMN_QUERY)
            db.commit()
            print("Added column 'savings_progress_amount_2' to user_onboarding table.")

        # Check if savings_progress_amount_3 exists, if not alter table
        cursor.execute(CHECK_SAVINGS_PROGRESS_3_COLUMN_QUERY)
        if not cursor.fetchone():
            cursor.execute(ADD_SAVINGS_PROGRESS_3_COLUMN_QUERY)
            db.commit()
            print("Added column 'savings_progress_amount_3' to user_onboarding table.")


        cursor.close()
        db.close()
        print("Table 'users' and 'user_onboarding' verified/created successfully.")
        return True
    except mysql.connector.Error as err:
        print(f"Error initializing database: {err}")
        return False

if __name__ == "__main__":
    initialize_database()
