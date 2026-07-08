# data_objects/user_data.py
import mysql.connector
from init_db import get_db

# Query strings
USER_EXIST_QUERY = "SELECT user_id, password, full_name, email, phone_number FROM user WHERE email = %s OR phone_number = %s"
CHECK_EMAIL_QUERY = "SELECT 1 FROM user WHERE email = %s"
CHECK_PHONE_QUERY = "SELECT 1 FROM user WHERE phone_number = %s"
INSERT_USER_QUERY = "INSERT INTO user (full_name, phone_number, email, password) VALUES (%s, %s, %s, %s)"
UPDATE_PASSWORD_QUERY = "UPDATE user SET password = %s WHERE user_id = %s"
DELETE_USER_QUERY = "DELETE FROM user WHERE user_id = %s"
GET_USER_BY_ID_QUERY = "SELECT user_id, full_name, email, phone_number FROM user WHERE user_id = %s"

def check_email_exists(email):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(CHECK_EMAIL_QUERY, (email,))
        return cursor.fetchone() is not None
    finally:
        cursor.close()
        db.close()

def check_phone_exists(phone_number):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(CHECK_PHONE_QUERY, (phone_number,))
        return cursor.fetchone() is not None
    finally:
        cursor.close()
        db.close()

def create_user(full_name, phone_number, email, password):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(INSERT_USER_QUERY, (full_name, phone_number, email, password))
        db.commit()
        return cursor.lastrowid
    finally:
        cursor.close()
        db.close()

def get_user_by_credentials(email_or_phone):
    db = get_db()
    cursor = db.cursor(buffered=True, dictionary=True)
    try:
        cursor.execute(USER_EXIST_QUERY, (email_or_phone, email_or_phone))
        return cursor.fetchone()
    finally:
        cursor.close()
        db.close()

def get_user_by_id(user_id):
    db = get_db()
    cursor = db.cursor(buffered=True, dictionary=True)
    try:
        cursor.execute(GET_USER_BY_ID_QUERY, (user_id,))
        return cursor.fetchone()
    finally:
        cursor.close()
        db.close()

def get_user_password(user_id):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute("SELECT password FROM user WHERE user_id = %s", (user_id,))
        row = cursor.fetchone()
        return row[0] if row else None
    finally:
        cursor.close()
        db.close()

def update_password(user_id, new_password):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(UPDATE_PASSWORD_QUERY, (new_password, user_id))
        db.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        db.close()

def delete_user(user_id):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(DELETE_USER_QUERY, (user_id,))
        db.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        db.close()
