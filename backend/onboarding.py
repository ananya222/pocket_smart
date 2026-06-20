# onboarding.py
from flask import Blueprint, request, jsonify
import mysql.connector
from db import get_db, ONBOARDING_QUERIES, GOALS_QUERIES
SAVE_ONBOARDING_QUERY = ONBOARDING_QUERIES["SAVE_ONBOARDING_QUERY"]
UPDATE_GOAL_QUERY = ONBOARDING_QUERIES["UPDATE_GOAL_QUERY"]
UPDATE_SAVINGS_AND_BALANCE_QUERY = ONBOARDING_QUERIES["UPDATE_SAVINGS_AND_BALANCE_QUERY"]
UPDATE_ONBOARDING_SAVINGS_PROGRESS_QUERY = ONBOARDING_QUERIES["UPDATE_ONBOARDING_SAVINGS_PROGRESS_QUERY"]
CHECK_USER_GOAL_EXISTS_QUERY = GOALS_QUERIES["CHECK_USER_GOAL_EXISTS_QUERY"]
INSERT_USER_GOAL_QUERY = GOALS_QUERIES["INSERT_USER_GOAL_QUERY"]
UPDATE_USER_GOAL_PROGRESS_QUERY = GOALS_QUERIES["UPDATE_USER_GOAL_PROGRESS_QUERY"]
SELECT_ACTIVE_GOAL_PROGRESS_QUERY = GOALS_QUERIES["SELECT_ACTIVE_GOAL_PROGRESS_QUERY"]
GET_USER_GOALS_QUERY = GOALS_QUERIES["GET_USER_GOALS_QUERY"]
DELETE_USER_GOAL_QUERY = GOALS_QUERIES["DELETE_USER_GOAL_QUERY"]
ONBOARDING_STATUS_QUERY = ONBOARDING_QUERIES["ONBOARDING_STATUS_QUERY"]

onboarding_bp = Blueprint("onboarding_bp", __name__)

@onboarding_bp.route("/submit_onboarding", methods=["POST"])
def submit_onboarding():
    data = request.json
    user_id = data.get("userId")
    allowance_amount = data.get("allowance")
    allowance_frequency = data.get("frequency")
    savings_goal_name = data.get("goalName")
    savings_target_amount = data.get("targetAmount")
    savings_time_to_reach = data.get("timeToReach")
    savings_goal_image = data.get("goalImage")
    savings_progress_amount = data.get("savingsProgressAmount", 0)
    current_balance = data.get("currentBalance", str(allowance_amount))

    if not user_id or allowance_amount is None or not allowance_frequency or not savings_goal_name or savings_target_amount is None or savings_time_to_reach is None:
        return jsonify({
            "error": "Missing onboarding parameters"
        }), 400

    values = (
        user_id,
        str(allowance_amount),
        str(allowance_frequency),
        str(savings_goal_name),
        str(savings_target_amount),
        int(savings_time_to_reach),
        savings_goal_image,
        int(savings_progress_amount),
        str(current_balance)
    )


    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(SAVE_ONBOARDING_QUERY, values)
        # Insert onboarding goal into user_goals if it doesn't already exist
        cursor.execute(CHECK_USER_GOAL_EXISTS_QUERY, (user_id, str(savings_goal_name)))
        existing_count = cursor.fetchone()[0]
        if existing_count == 0:
            cursor.execute(INSERT_USER_GOAL_QUERY, (user_id, str(savings_goal_name), str(savings_target_amount), int(savings_time_to_reach), savings_goal_image, int(savings_progress_amount)))
        db.commit()
        return jsonify({
            "message": "Onboarding details saved successfully"
        }), 200
    except mysql.connector.Error as err:
        return jsonify({
            "error": f"Database query failed: {err}"
        }), 500
    finally:
        cursor.close()
        db.close()

@onboarding_bp.route("/update_goal", methods=["POST"])
def update_goal():
    data = request.json
    user_id = data.get("userId")
    savings_goal_name = data.get("goalName")
    savings_target_amount = data.get("targetAmount")
    savings_time_to_reach = data.get("timeToReach")
    savings_goal_image = data.get("goalImage")

    if not user_id or not savings_goal_name or savings_target_amount is None or savings_time_to_reach is None:
        return jsonify({
            "error": "Missing goal parameters"
        }), 400

    values = (
        str(savings_goal_name),
        str(savings_target_amount),
        int(savings_time_to_reach),
        savings_goal_image,
        user_id
    )

    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(UPDATE_GOAL_QUERY, values)
        db.commit()
        return jsonify({
            "message": "Goal updated successfully"
        }), 200
    except mysql.connector.Error as err:
        return jsonify({
            "error": f"Database query failed: {err}"
        }), 500
    finally:
        cursor.close()
        db.close()

@onboarding_bp.route("/update_allowance_savings", methods=["POST"])
def update_allowance_savings():
    data = request.json
    user_id = data.get("userId")
    savings_progress_amount = data.get("savingsProgressAmount")
    current_balance = data.get("currentBalance")
    savings_progress_amount_2 = data.get("savingsProgress2")
    savings_progress_amount_3 = data.get("savingsProgress3")
    goals_progress = data.get("goalsProgress") # List of { id, progress }
    allowance_amount = data.get("allowance")
    allowance_frequency = data.get("frequency")

    if not user_id or savings_progress_amount is None or current_balance is None or savings_progress_amount_2 is None or savings_progress_amount_3 is None:
        return jsonify({
            "error": "Missing update parameters"
        }), 400

    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        if allowance_amount is None:
            cursor.execute("SELECT allowance_amount FROM user_onboarding WHERE user_id = %s", (user_id,))
            row = cursor.fetchone()
            allowance_amount = row[0] if row else "5,000"

        if isinstance(allowance_amount, (int, float)):
            allowance_amount = f"{int(allowance_amount):,}"

        values = (
            int(savings_progress_amount),
            str(current_balance),
            int(savings_progress_amount_2),
            int(savings_progress_amount_3),
            str(allowance_amount),
            allowance_frequency,
            user_id
        )

        # 1. Update user_onboarding table
        cursor.execute(UPDATE_SAVINGS_AND_BALANCE_QUERY, values)

        # 2. Update user_goals table progress for each goal if provided
        if goals_progress:
            for gp in goals_progress:
                g_id = gp.get("id")
                progress = gp.get("progress")
                cursor.execute(UPDATE_USER_GOAL_PROGRESS_QUERY, (int(progress), int(g_id), user_id))

        # 3. Sync the primary goal's progress in user_onboarding from user_goals
        cursor.execute(SELECT_ACTIVE_GOAL_PROGRESS_QUERY, (user_id, user_id))
        row = cursor.fetchone()
        if row:
            active_progress = row[0]
            cursor.execute(UPDATE_ONBOARDING_SAVINGS_PROGRESS_QUERY, (active_progress, user_id))

        db.commit()
        return jsonify({
            "message": "Savings and balance updated successfully"
        }), 200
    except mysql.connector.Error as err:
        return jsonify({
            "error": f"Database query failed: {err}"
        }), 500
    finally:
        cursor.close()
        db.close()

@onboarding_bp.route("/add_goal", methods=["POST"])
def add_goal():
    data = request.json
    user_id = data.get("userId")
    name = data.get("goalName")
    target_amount = data.get("targetAmount")
    time_to_reach = data.get("timeToReach")
    image_url = data.get("goalImage")
    progress_amount = data.get("progressAmount", 0)

    if not user_id or not name or target_amount is None or time_to_reach is None:
        return jsonify({"error": "Missing goal parameters"}), 400

    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(INSERT_USER_GOAL_QUERY, (user_id, str(name), str(target_amount), int(time_to_reach), image_url, int(progress_amount)))
        db.commit()
        goal_id = cursor.lastrowid
        return jsonify({
            "message": "Goal added successfully",
            "goalId": goal_id
        }), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database query failed: {err}"}), 500
    finally:
        cursor.close()
        db.close()

@onboarding_bp.route("/get_goals", methods=["GET"])
def get_goals():
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute(GET_USER_GOALS_QUERY, (user_id,))
        goals = cursor.fetchall()
        return jsonify({"goals": goals}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database query failed: {err}"}), 500
    finally:
        cursor.close()
        db.close()

@onboarding_bp.route("/delete_goal", methods=["POST"])
def delete_goal():
    data = request.json
    user_id = data.get("userId")
    goal_id = data.get("goalId")

    if not user_id or not goal_id:
        return jsonify({"error": "Missing goal/user parameters"}), 400

    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(DELETE_USER_GOAL_QUERY, (int(goal_id), user_id))
        db.commit()
        return jsonify({"message": "Goal deleted successfully"}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database query failed: {err}"}), 500
    finally:
        cursor.close()
        db.close()

@onboarding_bp.route("/get_onboarding", methods=["GET"])
def get_onboarding():
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        cursor.execute(ONBOARDING_STATUS_QUERY, (user_id,))
        onboard_record = cursor.fetchone()
        if not onboard_record:
            return jsonify({"error": "Onboarding not found"}), 404

        onboarding_data = {
            "allowance": onboard_record[0],
            "frequency": onboard_record[1],
            "goalName": onboard_record[2],
            "targetAmount": onboard_record[3],
            "timeToReach": onboard_record[4],
            "goalImage": onboard_record[5],
            "savingsProgressAmount": onboard_record[6],
            "currentBalance": onboard_record[7],
            "savingsProgress2": onboard_record[8],
            "savingsProgress3": onboard_record[9]
        }
        return jsonify({"onboarding": onboarding_data}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database query failed: {err}"}), 500
    finally:
        cursor.close()
        db.close()


