# services/s06_goals.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import data_objects.d04_goal_data as goal_data

goals_bp = Blueprint("goals_bp", __name__)

@goals_bp.route("/add_goal", methods=["POST"])
@jwt_required()
def add_goal():
    data = request.json
    user_id = get_jwt_identity()
    name = data.get("goalName")
    target_amount = data.get("targetAmount")
    time_to_reach = data.get("timeToReach")
    progress_amount = data.get("progressAmount", 0)

    if not name or target_amount is None or time_to_reach is None:
        return jsonify({"error": "Missing goal parameters"}), 400

    try:
        priority = data.get("priority", 3)
        goal_data.insert_goal(user_id, str(name), str(target_amount), int(time_to_reach), int(progress_amount), int(priority))
        return jsonify({"message": "Goal added successfully"}), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500

@goals_bp.route("/get_goals", methods=["GET"])
@jwt_required()
def get_goals():
    user_id = get_jwt_identity()

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

@goals_bp.route("/update_goal", methods=["POST"])
@jwt_required()
def update_goal():
    data = request.json
    user_id = get_jwt_identity()
    savings_goal_name = data.get("goalName")
    savings_target_amount = data.get("targetAmount")
    savings_time_to_reach = data.get("timeToReach")

    if not savings_goal_name or savings_target_amount is None or savings_time_to_reach is None:
        return jsonify({"error": "Missing goal parameters"}), 400

    try:
        goal_data.update_goal(user_id, str(savings_goal_name), str(savings_target_amount), int(savings_time_to_reach))
        return jsonify({"message": "Goal updated successfully"}), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500

@goals_bp.route("/delete_goal", methods=["POST"])
@jwt_required()
def delete_goal():
    data = request.json
    user_id = get_jwt_identity()
    goal_id = data.get("goalId")

    if not goal_id:
        return jsonify({"error": "Missing goal/user parameters"}), 400

    try:
        goal_data.delete_goal(int(goal_id), user_id)
        return jsonify({"message": "Goal deleted successfully"}), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500
