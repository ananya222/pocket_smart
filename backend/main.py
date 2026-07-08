# main.py
from flask import Flask
from init_db import initialize_database
from services.signup import signup_bp
from services.login import login_bp
from services.onboarding import onboarding_bp
from services.transactions import transactions_bp

# Ensure database and tables exist before starting the app
initialize_database()

app = Flask(__name__)

# Register route blueprints
app.register_blueprint(signup_bp)
app.register_blueprint(login_bp)
app.register_blueprint(onboarding_bp)
app.register_blueprint(transactions_bp)



@app.route("/")
def home():
    return "Backend is running (Modular Mode)"

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
