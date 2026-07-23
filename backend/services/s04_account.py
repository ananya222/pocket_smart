# services/s04_account.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import data_objects.d02_account_data as account_data
import data_objects.d01_user_data as user_data
import data_objects.d04_goal_data as goal_data

account_bp = Blueprint("account_bp", __name__)

@account_bp.route("/update_allowance_savings", methods=["POST"])
@jwt_required()
def update_allowance_savings():
    data = request.json
    user_id = get_jwt_identity()
    savings_progress_amount = data.get("savingsProgressAmount")
    current_balance = data.get("currentBalance")
    savings_progress_amount_2 = data.get("savingsProgress2")
    savings_progress_amount_3 = data.get("savingsProgress3")
    goals_progress = data.get("goalsProgress") # List of { id, progress }
    allowance_amount = data.get("allowance")
    allowance_frequency = data.get("frequency")
    cycle_limit = data.get("cycleLimit")

    if savings_progress_amount is None or current_balance is None or savings_progress_amount_2 is None or savings_progress_amount_3 is None:
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

@account_bp.route("/reset_budget_settings", methods=["POST"])
@account_bp.route("/delete_account", methods=["POST"])
@jwt_required()
def reset_budget_settings():
    user_id = get_jwt_identity()

    try:
        success = account_data.delete_account_budget(user_id)
        if success:
            return jsonify({"message": "Budget settings reset successfully"}), 200
        else:
            return jsonify({"error": "Account settings not found"}), 404
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500

@account_bp.route("/delete_user_credentials", methods=["POST"])
@account_bp.route("/delete_user", methods=["POST"])
@jwt_required()
def delete_user_credentials():
    user_id = get_jwt_identity()

    try:
        success = user_data.delete_user(user_id)
        if success:
            return jsonify({"message": "User credentials deleted successfully"}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500
