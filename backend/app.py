from flask import Flask
from flask_cors import CORS
from Models.models import db
from config import Config
from Routes.routes import api


app = Flask(__name__)
app.config.from_object(Config)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

print("Config and CORS set")

db.init_app(app)
app.register_blueprint(api)

print("DB initialized and Blueprint registered")

with app.app_context():
    db.create_all()

print("App context entered and DB tables created")

if __name__ == "__main__":
    print("Running app...")
    app.run(debug=True)
