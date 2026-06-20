# signup.py
from flask import Blueprint, request, jsonify
import mysql.connector
from db import get_db, USER_QUERIES
CHECK_EMAIL_QUERY = USER_QUERIES["CHECK_EMAIL_QUERY"]
CHECK_PHONE_QUERY = USER_QUERIES["CHECK_PHONE_QUERY"]
INSERT_USER_QUERY = USER_QUERIES["INSERT_USER_QUERY"]

signup_bp = Blueprint("signup_bp", __name__)

@signup_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    full_name = data.get("fullName")
    phone_number = data.get("phoneNumber")
    email = data.get("email")
    password = data.get("password")

    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        # Check if email already exists
        cursor.execute(CHECK_EMAIL_QUERY, (email,))
        if cursor.fetchone():
            return jsonify({
                "error": "Email already in use"
            }), 400

        # Check if phone number already exists
        cursor.execute(CHECK_PHONE_QUERY, (phone_number,))
        if cursor.fetchone():
            return jsonify({
                "error": "Phone number already in use"
            }), 400

        values = (
            full_name,
            phone_number,
            email,
            password
        )

        cursor.execute(INSERT_USER_QUERY, values)
        db.commit()
        return jsonify({
            "message": "Signup successful"
        }), 200
    except mysql.connector.Error as err:
        return jsonify({
            "error": f"Database query failed: {err}"
        }), 500
    finally:
        cursor.close()
        db.close()
