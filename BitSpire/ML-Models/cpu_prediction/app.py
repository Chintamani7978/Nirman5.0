from flask import Flask, render_template, request
import pickle
import numpy as np

# Load trained model
with open(r"C:\Users\RAJIB\Desktop\UniCharge\ml-engine\models\cpu_prediction\pickle_files\model_before.pkl", "rb") as f:
    model = pickle.load(f)

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    prediction = None
    if request.method == "POST":
        try:
            # Get form values
            energy = float(request.form["energy"])
            age = int(request.form["age"])
            duration = float(request.form["duration"])
            time_of_day = int(request.form["time_of_day"])
            day_of_week = int(request.form["day_of_week"])
            charger_type = int(request.form["charger_type"])
            user_type = int(request.form["user_type"])

            # Compute charging rate automatically
            rate = energy / duration if duration > 0 else 0

            # Create input array
            sample = np.array([[energy, rate, age, duration,
                                time_of_day, day_of_week, charger_type, user_type]])

            # Predict cost per unit
            prediction = round(model.predict(sample)[0], 3)

        except Exception as e:
            prediction = f"Error in input: {e}"
    
    return render_template("index.html", prediction=prediction)

if __name__ == "__main__":
    app.run(debug=True)