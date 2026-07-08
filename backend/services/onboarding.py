# services/onboarding.py
from flask import Blueprint, request, jsonify
import data_objects.account_data as account_data
import data_objects.goal_data as goal_data

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
    savings_progress_amount = data.get("savingsProgressAmount", 0)
    current_balance = data.get("currentBalance", str(allowance_amount))

    if not user_id or allowance_amount is None or not allowance_frequency or not savings_goal_name or savings_target_amount is None or savings_time_to_reach is None:
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

@onboarding_bp.route("/update_goal", methods=["POST"])
def update_goal():
    data = request.json
    user_id = data.get("userId")
    savings_goal_name = data.get("goalName")
    savings_target_amount = data.get("targetAmount")
    savings_time_to_reach = data.get("timeToReach")

    if not user_id or not savings_goal_name or savings_target_amount is None or savings_time_to_reach is None:
        return jsonify({"error": "Missing goal parameters"}), 400

    try:
        goal_data.update_goal(user_id, str(savings_goal_name), str(savings_target_amount), int(savings_time_to_reach))
        return jsonify({"message": "Goal updated successfully"}), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500

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
    cycle_limit = data.get("cycleLimit")

    if not user_id or savings_progress_amount is None or current_balance is None or savings_progress_amount_2 is None or savings_progress_amount_3 is None:
        return jsonify({"error": "Missing update parameters"}), 400

    try:
        if allowance_amount is None:
            acct = account_data.get_account_by_user_id(user_id)
            allowance_amount = acct["allowance_amount"] if acct else "5,000"

        if isinstance(allowance_amount, (int, float)):
            allowance_amount = f"{int(allowance_amount):,}"

        # If cycle_limit is not explicitly sent, detect if this is a balance top-up
        if cycle_limit is None:
            acct = account_data.get_account_by_user_id(user_id)
            if acct:
                db_bal = float(str(acct.get("current_balance") or 0).replace(",", ""))
                new_bal = float(str(current_balance).replace(",", ""))
                diff = new_bal - db_bal
                if diff > 0:
                    db_limit = float(str(acct.get("cycle_limit") or acct.get("allowance_amount") or 0).replace(",", ""))
                    cycle_limit = str(int(db_limit + diff))
                else:
                    cycle_limit = acct.get("cycle_limit") or acct.get("allowance_amount")

        account_data.update_savings_and_balance(user_id, str(current_balance), str(allowance_amount), allowance_frequency, cycle_limit)

        if goals_progress:
            for gp in goals_progress:
                g_id = gp.get("id")
                progress = gp.get("progress")
                goal_data.update_goal_progress(int(g_id), user_id, int(progress))

        active_progress = goal_data.get_active_goal_progress(user_id)
        if active_progress is not None:
            goal_data.update_onboarding_savings_progress(user_id, active_progress)

        return jsonify({"message": "Savings and balance updated successfully"}), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500

@onboarding_bp.route("/add_goal", methods=["POST"])
def add_goal():
    data = request.json
    user_id = data.get("userId")
    name = data.get("goalName")
    target_amount = data.get("targetAmount")
    time_to_reach = data.get("timeToReach")
    progress_amount = data.get("progressAmount", 0)

    if not user_id or not name or target_amount is None or time_to_reach is None:
        return jsonify({"error": "Missing goal parameters"}), 400

    try:
        priority = data.get("priority", 3)
        goal_data.insert_goal(user_id, str(name), str(target_amount), int(time_to_reach), int(progress_amount), int(priority))
        return jsonify({"message": "Goal added successfully"}), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500

@onboarding_bp.route("/get_goals", methods=["GET"])
def get_goals():
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    try:
        goals = goal_data.get_goals(user_id)
        mapped_goals = []
        for g in goals:
            g["id"] = g.pop("goal_id")
            g["progress_amount"] = g.pop("progress")
            mapped_goals.append(g)
        return jsonify({"goals": mapped_goals}), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500

@onboarding_bp.route("/delete_goal", methods=["POST"])
def delete_goal():
    data = request.json
    user_id = data.get("userId")
    goal_id = data.get("goalId")

    if not user_id or not goal_id:
        return jsonify({"error": "Missing goal/user parameters"}), 400

    try:
        goal_data.delete_goal(int(goal_id), user_id)
        return jsonify({"message": "Goal deleted successfully"}), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500

@onboarding_bp.route("/get_onboarding", methods=["GET"])
def get_onboarding():
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    try:
        onboarding_data = account_data.get_user_onboarding_details(user_id)
        if not onboarding_data:
            return jsonify({"error": "Onboarding not found"}), 404
        return jsonify({"onboarding": onboarding_data}), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500

@onboarding_bp.route("/delete_account", methods=["POST"])
def delete_account():
    data = request.json
    user_id = data.get("userId")

    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    try:
        success = account_data.delete_account(user_id)
        if success:
            return jsonify({"message": "Account deleted successfully"}), 200
        else:
            return jsonify({"error": "Account not found"}), 404
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500
