# data_objects/transaction_data.py
import mysql.connector
from init_db import get_db

# Query strings
INSERT_TRANSACTION_QUERY = "INSERT INTO transactions (user_id, merchant, category, amount, date, icon, month_label, avoidable, reason) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
GET_TRANSACTIONS_QUERY = "SELECT transaction_id, merchant, category, amount, date, icon, month_label, avoidable, reason FROM transactions WHERE user_id = %s ORDER BY transaction_id DESC"
UPDATE_TRANSACTION_QUERY = "UPDATE transactions SET merchant = %s, category = %s, amount = %s, date = %s, icon = %s, month_label = %s, avoidable = %s, reason = %s WHERE transaction_id = %s AND user_id = %s"
DELETE_TRANSACTION_QUERY = "DELETE FROM transactions WHERE transaction_id = %s AND user_id = %s"

def insert_transaction(user_id, merchant, category, amount, date, icon, month_label, avoidable, reason):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(INSERT_TRANSACTION_QUERY, (user_id, merchant, category, amount, date, icon, month_label, avoidable, reason))
        db.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        db.close()

def get_transactions(user_id):
    db = get_db()
    cursor = db.cursor(buffered=True, dictionary=True)
    try:
        cursor.execute(GET_TRANSACTIONS_QUERY, (user_id,))
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()

def update_transaction(transaction_id, user_id, merchant, category, amount, date, icon, month_label, avoidable, reason):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(UPDATE_TRANSACTION_QUERY, (merchant, category, amount, date, icon, month_label, avoidable, reason, transaction_id, user_id))
        db.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        db.close()

def delete_transaction(transaction_id, user_id):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(DELETE_TRANSACTION_QUERY, (transaction_id, user_id))
        db.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        db.close()
