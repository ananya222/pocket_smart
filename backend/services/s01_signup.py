# services/s01_signup.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import data_objects.d01_user_data as user_data

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

        new_user_id = user_data.create_user(full_name, phone_number, email, password)

        # Generate JWT access token
        access_token = create_access_token(identity=str(new_user_id))

        user_payload = {
            "id": new_user_id,
            "fullName": full_name,
            "email": email,
            "phoneNumber": phone_number,
            "onboardingCompleted": False,
            "onboarding": None
        }

        return jsonify({
            "message": "Signup successful",
            "access_token": access_token,
            "user": user_payload
        }), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500
