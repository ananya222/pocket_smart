# services/s05_transactions.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import data_objects.d03_transaction_data as transaction_data

transactions_bp = Blueprint("transactions_bp", __name__)

@transactions_bp.route("/add_transaction", methods=["POST"])
@jwt_required()
def add_transaction():
    data = request.json
    user_id = get_jwt_identity()
    title = data.get("title")
    category = data.get("category")
    amount = data.get("amount")
    date = data.get("date")
    icon = data.get("icon")
    month_label = data.get("monthLabel")
    avoidable = 1 if data.get("avoidable") else 0
    reason = data.get("reason", "")

    if not title or not category or amount is None or not date or not icon or not month_label:
        return jsonify({"error": "Missing transaction parameters"}), 400

    try:
        transaction_data.insert_transaction(
            user_id, title, category, float(amount), date, icon, month_label, avoidable, reason
        )
        return jsonify({"message": "Transaction added successfully"}), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500

@transactions_bp.route("/get_transactions", methods=["GET"])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()

    try:
        rows = transaction_data.get_transactions(user_id)
        transactions = []
        for r in rows:
            transactions.append({
                "id": str(r["transaction_id"]),
                "title": r["merchant"],
                "category": r["category"],
                "amount": float(r["amount"]),
                "date": r["date"],
                "icon": r["icon"],
                "monthLabel": r["month_label"],
                "avoidable": True if r["avoidable"] == 1 else False,
                "reason": r["reason"]
            })
        return jsonify({"transactions": transactions}), 200
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500

@transactions_bp.route("/update_transaction", methods=["POST"])
@jwt_required()
def update_transaction():
    data = request.json
    transaction_id = data.get("transactionId")
    user_id = get_jwt_identity()
    title = data.get("title")
    category = data.get("category")
    amount = data.get("amount")
    date = data.get("date")
    icon = data.get("icon")
    month_label = data.get("monthLabel")
    avoidable = 1 if data.get("avoidable") else 0
    reason = data.get("reason", "")

    if not transaction_id or not title or not category or amount is None or not date or not icon or not month_label:
        return jsonify({"error": "Missing required update parameters"}), 400

    try:
        success = transaction_data.update_transaction(
            int(transaction_id), user_id, title, category, float(amount), date, icon, month_label, avoidable, reason
        )
        if success:
            return jsonify({"message": "Transaction updated successfully"}), 200
        else:
            return jsonify({"error": "Transaction not found or unauthorized"}), 404
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500

@transactions_bp.route("/delete_transaction", methods=["POST"])
@jwt_required()
def delete_transaction():
    data = request.json
    transaction_id = data.get("transactionId")
    user_id = get_jwt_identity()

    if not transaction_id:
        return jsonify({"error": "Missing transaction parameters"}), 400

    try:
        success = transaction_data.delete_transaction(int(transaction_id), user_id)
        if success:
            return jsonify({"message": "Transaction deleted successfully"}), 200
        else:
            return jsonify({"error": "Transaction not found or unauthorized"}), 404
    except Exception as err:
        return jsonify({"error": f"Internal query failed: {err}"}), 500
