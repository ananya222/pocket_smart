# transactions.py
from flask import Blueprint, request, jsonify
import mysql.connector
from db import get_db, TRANSACTIONS_QUERIES

INSERT_TRANSACTION_QUERY = TRANSACTIONS_QUERIES["INSERT_TRANSACTION_QUERY"]
GET_TRANSACTIONS_QUERY = TRANSACTIONS_QUERIES["GET_TRANSACTIONS_QUERY"]

transactions_bp = Blueprint("transactions_bp", __name__)

@transactions_bp.route("/add_transaction", methods=["POST"])
def add_transaction():
    data = request.json
    user_id = data.get("userId")
    title = data.get("title")
    category = data.get("category")
    amount = data.get("amount")
    date = data.get("date")
    icon = data.get("icon")
    month_label = data.get("monthLabel")
    avoidable = 1 if data.get("avoidable") else 0
    reason = data.get("reason", "")

    if not user_id or not title or not category or amount is None or not date or not icon or not month_label:
        return jsonify({"error": "Missing transaction parameters"}), 400

    db = get_db()
    cursor = db.cursor(buffered=True)
    try:
        values = (user_id, title, category, float(amount), date, icon, month_label, avoidable, reason)
        cursor.execute(INSERT_TRANSACTION_QUERY, values)
        db.commit()
        return jsonify({"message": "Transaction added successfully"}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database query failed: {err}"}), 500
    finally:
        cursor.close()
        db.close()

@transactions_bp.route("/get_transactions", methods=["GET"])
def get_transactions():
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "Missing userId parameter"}), 400

    db = get_db()
    cursor = db.cursor(buffered=True, dictionary=True)
    try:
        cursor.execute(GET_TRANSACTIONS_QUERY, (user_id,))
        rows = cursor.fetchall()
        transactions = []
        for r in rows:
            transactions.append({
                "id": str(r["id"]),
                "title": r["title"],
                "category": r["category"],
                "amount": float(r["amount"]),
                "date": r["date"],
                "icon": r["icon"],
                "monthLabel": r["month_label"],
                "avoidable": True if r["avoidable"] == 1 else False,
                "reason": r["reason"]
            })
        return jsonify({"transactions": transactions}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database query failed: {err}"}), 500
    finally:
        cursor.close()
        db.close()
