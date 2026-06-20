# login.py
from flask import Blueprint, request, jsonify
import mysql.connector
from db import get_db, USER_QUERIES, ONBOARDING_QUERIES, GOALS_QUERIES
USER_EXIST_QUERY = USER_QUERIES["USER_EXIST_QUERY"]
ONBOARDING_STATUS_QUERY = ONBOARDING_QUERIES["ONBOARDING_STATUS_QUERY"]
GET_USER_GOAL_COUNT_QUERY = GOALS_QUERIES["GET_USER_GOAL_COUNT_QUERY"]
INSERT_USER_GOAL_QUERY = GOALS_QUERIES["INSERT_USER_GOAL_QUERY"]

login_bp = Blueprint("login_bp", __name__)

@login_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    identifier = data.get("email")
    password = data.get("password")

    if not identifier or not password:
        return jsonify({
            "error": "Missing email/phone or password"
        }), 400

    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        # Step 1: Check if user exists by email or phone_number
        cursor.execute(USER_EXIST_QUERY, (identifier, identifier))
        user_record = cursor.fetchone()

        if not user_record:
            return jsonify({
                "error": "User not found"
            }), 404

        # Step 2: User exists, verify password
        db_password = user_record[1]
        if db_password != password:
            return jsonify({
                "error": "Incorrect password"
            }), 401

        # Step 3: Check onboarding status
        user_id = user_record[0]
        cursor.execute(ONBOARDING_STATUS_QUERY, (user_id,))
        onboard_record = cursor.fetchone()

        onboarding_completed = onboard_record is not None
        onboarding_data = None
        if onboarding_completed:
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

            # Automatic migration: if no goals in user_goals, copy the onboarding goal
            cursor.execute(GET_USER_GOAL_COUNT_QUERY, (user_id,))
            goal_count = cursor.fetchone()[0]
            if goal_count == 0:
                cursor.execute(INSERT_USER_GOAL_QUERY, (user_id, onboard_record[2], onboard_record[3], onboard_record[4], onboard_record[5], onboard_record[6]))
                db.commit()


        # Login successful
        user_data = {
            "id": user_id,
            "fullName": user_record[2],
            "email": user_record[3],
            "phoneNumber": user_record[4],
            "onboardingCompleted": onboarding_completed,
            "onboarding": onboarding_data
        }

        return jsonify({
            "message": "Login successful",
            "user": user_data
        }), 200
    except mysql.connector.Error as err:
        return jsonify({
            "error": f"Database query failed: {err}"
        }), 500
    finally:
        cursor.close()
        db.close()
