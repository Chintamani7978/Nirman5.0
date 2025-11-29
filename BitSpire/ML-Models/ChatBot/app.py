from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS # To handle Cross-Origin Resource Sharing
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, 'templates')

app = Flask(__name__, template_folder=TEMPLATES_DIR)
CORS(app) 

# Initialize the GenAI client with your API key
# IMPORTANT: Replace "YOUR_API_KEY" with your actual API key

genai_api_key = os.getenv("GENAI_API_KEY")
genai.configure(api_key=genai_api_key)
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction="Your name is UniCharge, and you are an EV guider. You can guide users on any sort of FAQ related to the Electric Vehicle sector, guide politely. If anything unrelated to the EV sector is asked, just behave politely to the user and ask them to ask relatable things to your domain."
)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/style.css')
def style():
    return send_from_directory(TEMPLATES_DIR, 'style.css')

@app.route('/script.js')
def script():
    return send_from_directory(TEMPLATES_DIR, 'script.js')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        response = model.generate_content(user_message)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Use Render's assigned port or default to 5000
    app.run(host="0.0.0.0", port=port, debug=True)
