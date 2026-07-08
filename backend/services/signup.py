# services/signup.py
from flask import Blueprint, request, jsonify
import data_objects.user_data as user_data

signup_bp = Blueprint("signup_bp", __name__)

@signup_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    full_name = data.get("fullName")
    phone_number = data.get("phoneNumber")
    email = data.get("email")
    password = data.get("password")

    if not full_name or not phone_number or not email or not password:
        return jsonify({"error": "Missing required signup parameters"}), 400

    try:
        if user_data.check_email_exists(email):
            return jsonify({"error": "Email already in use"}), 400

        if user_data.check_phone_exists(phone_number):
            return jsonify({"error": "Phone number already in use"}), 400

        user_data.create_user(full_name, phone_number, email, password)
        return jsonify({"message": "Signup successful"}), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500

@signup_bp.route("/delete_user", methods=["POST"])
def delete_user():
    data = request.json
    user_id = data.get("userId")

    if not user_id:
        return jsonify({"error": "Missing userId parameter"}), 400

    try:
        success = user_data.delete_user(user_id)
        if success:
            return jsonify({"message": "User deleted successfully"}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500
