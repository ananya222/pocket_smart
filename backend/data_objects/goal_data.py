# data_objects/goal_data.py
import mysql.connector
from init_db import get_db

# Query strings
GET_USER_GOAL_COUNT_QUERY = "SELECT COUNT(*) FROM goals WHERE user_id = %s"
CHECK_USER_GOAL_EXISTS_QUERY = "SELECT COUNT(*) FROM goals WHERE user_id = %s AND name = %s"
INSERT_USER_GOAL_QUERY = "INSERT INTO goals (user_id, name, target_amount, time_to_reach, progress, priority, is_active) VALUES (%s, %s, %s, %s, %s, %s, 1)"
UPDATE_USER_GOAL_PROGRESS_QUERY = "UPDATE goals SET progress = %s WHERE goal_id = %s AND user_id = %s"
SELECT_ACTIVE_GOAL_PROGRESS_QUERY = "SELECT progress FROM goals WHERE user_id = %s AND is_active = 1 LIMIT 1"
GET_USER_GOALS_QUERY = "SELECT * FROM goals WHERE user_id = %s ORDER BY goal_id DESC"
DELETE_USER_GOAL_QUERY = "DELETE FROM goals WHERE goal_id = %s AND user_id = %s"
UPDATE_GOAL_QUERY = "UPDATE goals SET name = %s, target_amount = %s, time_to_reach = %s, progress = 0 WHERE user_id = %s AND is_active = 1"
UPDATE_ONBOARDING_SAVINGS_PROGRESS_QUERY = "UPDATE goals SET progress = %s WHERE user_id = %s AND is_active = 1"

def get_user_goal_count(user_id):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(GET_USER_GOAL_COUNT_QUERY, (user_id,))
        row = cursor.fetchone()
        return row[0] if row else 0
    finally:
        cursor.close()
        db.close()

def check_goal_exists(user_id, name):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(CHECK_USER_GOAL_EXISTS_QUERY, (user_id, name))
        row = cursor.fetchone()
        return (row[0] if row else 0) > 0
    finally:
        cursor.close()
        db.close()

def insert_goal(user_id, name, target_amount, time_to_reach, progress, priority=3):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(INSERT_USER_GOAL_QUERY, (user_id, name, target_amount, time_to_reach, progress, priority))
        db.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        db.close()

def update_goal(user_id, name, target_amount, time_to_reach):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(UPDATE_GOAL_QUERY, (name, target_amount, time_to_reach, user_id))
        db.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        db.close()

def update_goal_progress(goal_id, user_id, progress):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(UPDATE_USER_GOAL_PROGRESS_QUERY, (progress, goal_id, user_id))
        db.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        db.close()

def get_active_goal_progress(user_id):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(SELECT_ACTIVE_GOAL_PROGRESS_QUERY, (user_id,))
        row = cursor.fetchone()
        return row[0] if row else 0
    finally:
        cursor.close()
        db.close()

def update_onboarding_savings_progress(user_id, progress):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(UPDATE_ONBOARDING_SAVINGS_PROGRESS_QUERY, (progress, user_id))
        db.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        db.close()

def get_goals(user_id):
    db = get_db()
    cursor = db.cursor(buffered=True, dictionary=True)
    try:
        cursor.execute(GET_USER_GOALS_QUERY, (user_id,))
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()

def delete_goal(goal_id, user_id):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(DELETE_USER_GOAL_QUERY, (goal_id, user_id))
        db.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        db.close()
