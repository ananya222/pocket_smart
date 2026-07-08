# data_objects/account_data.py
import mysql.connector
import datetime
from init_db import get_db

# Query strings
ONBOARDING_STATUS_QUERY = "SELECT allowance_amount, allowance_frequency, current_balance, last_refreshed, cycle_limit FROM accounts WHERE user_id = %s"
SAVE_ONBOARDING_QUERY = "INSERT INTO accounts (user_id, allowance_amount, allowance_frequency, current_balance, cycle_limit) VALUES (%s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE allowance_amount = VALUES(allowance_amount), allowance_frequency = VALUES(allowance_frequency), current_balance = VALUES(current_balance), cycle_limit = VALUES(cycle_limit), last_refreshed = CURRENT_TIMESTAMP"
UPDATE_SAVINGS_AND_BALANCE_QUERY = "UPDATE accounts SET current_balance = %s, allowance_amount = %s, allowance_frequency = COALESCE(%s, allowance_frequency), cycle_limit = %s, last_refreshed = CURRENT_TIMESTAMP WHERE user_id = %s"
DELETE_ACCOUNT_QUERY = "DELETE FROM accounts WHERE user_id = %s"

def get_account_by_user_id(user_id):
    db = get_db()
    cursor = db.cursor(buffered=True, dictionary=True)
    try:
        cursor.execute(ONBOARDING_STATUS_QUERY, (user_id,))
        return cursor.fetchone()
    finally:
        cursor.close()
        db.close()

def create_account(user_id, allowance_amount, allowance_frequency, current_balance):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(SAVE_ONBOARDING_QUERY, (user_id, allowance_amount, allowance_frequency, current_balance, current_balance))
        db.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        db.close()

def update_savings_and_balance(user_id, current_balance, allowance_amount, allowance_frequency, cycle_limit=None):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        if cycle_limit is None:
            cycle_limit = current_balance
        cursor.execute(UPDATE_SAVINGS_AND_BALANCE_QUERY, (current_balance, allowance_amount, allowance_frequency, cycle_limit, user_id))
        db.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        db.close()

def delete_account(user_id):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(DELETE_ACCOUNT_QUERY, (user_id,))
        db.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        db.close()

def get_user_onboarding_details(user_id):
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute("SELECT allowance_amount, allowance_frequency, current_balance, last_refreshed, cycle_limit FROM accounts WHERE user_id = %s", (user_id,))
        account_record = cursor.fetchone()
        if not account_record:
            return None

        cursor.execute("SELECT name, target_amount, time_to_reach, progress, goal_id, priority FROM goals WHERE user_id = %s ORDER BY goal_id ASC", (user_id,))
        goals_records = cursor.fetchall()

        # Dynamically map all goals to support any number of goals
        goals_list = []
        for r in goals_records:
            goals_list.append({
                "name": r[0],
                "targetAmount": r[1],
                "timeToReach": r[2],
                "progress": r[3],
                "id": r[4],
                "priority": r[5] if len(r) > 5 else 3
            })

        # Calculate if cycle rollover is due
        last_refreshed = account_record[3]
        frequency = account_record[1]
        now = datetime.datetime.now()
        
        rollover_due = False
        saved_amount = 0.0

        if last_refreshed:
            delta = now - last_refreshed
            if frequency == "Weekly":
                if delta.days >= 7:
                    rollover_due = True
            elif frequency == "Monthly":
                if delta.days >= 30 or now.month != last_refreshed.month or now.year != last_refreshed.year:
                    rollover_due = True

        # Parse current remaining balance as savedAmount if rollover is due
        if rollover_due:
            raw_bal = account_record[2]
            if raw_bal:
                try:
                    saved_amount = float(str(raw_bal).replace(",", ""))
                except ValueError:
                    saved_amount = 0.0

        # Calculate total expenses in the current cycle
        if frequency == "Monthly":
            month_names = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ]
            current_month_label = f"{month_names[now.month - 1]} {now.year}"
            cursor.execute("""
                SELECT COALESCE(SUM(amount), 0) 
                FROM transactions 
                WHERE user_id = %s AND month_label = %s AND amount < 0
            """, (user_id, current_month_label))
        else:  # Weekly
            cursor.execute("""
                SELECT COALESCE(SUM(amount), 0) 
                FROM transactions 
                WHERE user_id = %s AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND amount < 0
            """, (user_id,))
        current_cycle_spent = abs(float(cursor.fetchone()[0]))

        cycle_limit = account_record[4]
        if not cycle_limit:
            cycle_limit = account_record[0]

        return {
            "allowance": account_record[0],
            "frequency": account_record[1],
            "currentBalance": account_record[2],
            "goals": goals_list,
            "rolloverDue": rollover_due,
            "savedAmount": saved_amount,
            "currentCycleSpent": current_cycle_spent,
            "cycleLimit": cycle_limit
        }
    finally:
        cursor.close()
        db.close()
