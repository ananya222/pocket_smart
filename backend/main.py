import os
from flask import Flask
from flask_jwt_extended import JWTManager
from init_db import initialize_database
from services.s01_signup import signup_bp
from services.s02_login import login_bp
from services.s03_onboarding import onboarding_bp
from services.s04_account import account_bp
from services.s05_transactions import transactions_bp
from services.s06_goals import goals_bp

# Ensure database and tables exist before starting the app
initialize_database()

app = Flask(__name__)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "pocketsmart-jwt-secret-key-2026")
jwt = JWTManager(app)

# Register route blueprints
app.register_blueprint(signup_bp)
app.register_blueprint(login_bp)
app.register_blueprint(onboarding_bp)
app.register_blueprint(account_bp)
app.register_blueprint(transactions_bp)
app.register_blueprint(goals_bp)



@app.route("/")
def home():
    return "Backend is running (Modular Mode)"

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
