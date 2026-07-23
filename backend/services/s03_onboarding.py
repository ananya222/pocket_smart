# services/s03_onboarding.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import data_objects.d02_account_data as account_data
import data_objects.d04_goal_data as goal_data

onboarding_bp = Blueprint("onboarding_bp", __name__)

@onboarding_bp.route("/setup_initial_profile", methods=["POST"])
@onboarding_bp.route("/submit_onboarding", methods=["POST"])
@jwt_required()
def setup_initial_profile():
    data = request.json
    user_id = get_jwt_identity()
    allowance_amount = data.get("allowance")
    allowance_frequency = data.get("frequency")
    savings_goal_name = data.get("goalName")
    savings_target_amount = data.get("targetAmount")
    savings_time_to_reach = data.get("timeToReach")
    savings_progress_amount = data.get("savingsProgressAmount", 0)
    current_balance = data.get("currentBalance", str(allowance_amount))

    if allowance_amount is None or not allowance_frequency or not savings_goal_name or savings_target_amount is None or savings_time_to_reach is None:
        return jsonify({"error": "Missing onboarding parameters"}), 400

    try:
        account_data.create_account(user_id, str(allowance_amount), str(allowance_frequency), str(current_balance))
        
        # Insert onboarding goal into user_goals if it doesn't already exist
        if not goal_data.check_goal_exists(user_id, str(savings_goal_name)):
            priority = data.get("priority", 3)
            goal_data.insert_goal(user_id, str(savings_goal_name), str(savings_target_amount), int(savings_time_to_reach), int(savings_progress_amount), int(priority))
            
        return jsonify({"message": "Onboarding details saved successfully"}), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500

@onboarding_bp.route("/get_user_account_overview", methods=["GET"])
@onboarding_bp.route("/get_onboarding", methods=["GET"])
@jwt_required()
def get_user_account_overview():
    user_id = get_jwt_identity()

    try:
        onboarding_data = account_data.get_user_onboarding_details(user_id)
        if not onboarding_data:
            return jsonify({"error": "Onboarding not found"}), 404
        return jsonify({"onboarding": onboarding_data}), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500

@onboarding_bp.route("/simulate_rollover", methods=["POST"])
@jwt_required()
def simulate_rollover():
    user_id = get_jwt_identity()
    from init_db import get_db
    import datetime
    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        # Subtract 35 days to ensure it triggers both Weekly and Monthly cycles
        simulated_time = datetime.datetime.now() - datetime.timedelta(days=35)
        cursor.execute("UPDATE accounts SET last_refreshed = %s WHERE user_id = %s", (simulated_time, user_id))
        db.commit()
        return jsonify({"message": "Simulated cycle end by setting last_refreshed to 35 days ago"}), 200
    except Exception as err:
        return jsonify({"error": f"Failed to simulate rollover: {err}"}), 500
    finally:
        cursor.close()
        db.close()
