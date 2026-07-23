# services/s02_login.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import data_objects.d01_user_data as user_data
import data_objects.d02_account_data as account_data

login_bp = Blueprint("login_bp", __name__)

@login_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    identifier = data.get("email")
    password = data.get("password")

    if not identifier or not password:
        return jsonify({"error": "Missing email/phone or password"}), 400

    try:
        user_record = user_data.get_user_by_credentials(identifier)
        if not user_record:
            return jsonify({"error": "User not found"}), 404

        db_password = user_record["password"]
        if db_password != password:
            return jsonify({"error": "Incorrect password"}), 401

        user_id = user_record["user_id"]
        onboarding_data = account_data.get_user_onboarding_details(user_id)
        onboarding_completed = onboarding_data is not None

        # Generate JWT access token
        access_token = create_access_token(identity=str(user_id))

        user_payload = {
            "id": user_id,
            "fullName": user_record["full_name"],
            "email": user_record["email"],
            "phoneNumber": user_record["phone_number"],
            "onboardingCompleted": onboarding_completed,
            "onboarding": onboarding_data
        }

        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user": user_payload
        }), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500

@login_bp.route("/change_password", methods=["POST"])
@jwt_required()
def change_password():
    data = request.json
    user_id = get_jwt_identity()
    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")

    if not old_password or not new_password:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        db_password = user_data.get_user_password(user_id)
        if not db_password:
            return jsonify({"error": "User not found"}), 404

        if db_password != old_password:
            return jsonify({"error": "Incorrect current password"}), 401

        user_data.update_password(user_id, new_password)
        return jsonify({"message": "Password updated successfully"}), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500
