import pandas as pd
import joblib
import os
from flask import Flask, request, jsonify, render_template

app = Flask(__name__, template_folder='templates')

# Construct the absolute path to your model and preprocessor files
base_dir = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(base_dir, '..', 'artifacts', 'adaboost_model.pkl')
PREPROCESSOR_PATH = os.path.join(base_dir, '..', 'artifacts', 'preprocessor.pkl')

# Load the model and preprocessor at application startup
try:
    final_model = joblib.load(MODEL_PATH)
    preprocessor = joblib.load(PREPROCESSOR_PATH)
    print("Model and preprocessor loaded successfully!")
except FileNotFoundError:
    raise RuntimeError(f"Model or preprocessor not found. Please check paths: {MODEL_PATH} and {PREPROCESSOR_PATH}")

# List of all feature columns expected by the model in the correct order
# You can get this from the preprocessor after it's fit.
# The preprocessor.get_feature_names_out() returns an array of strings.
# Example: ['num__latitude', 'num__longitude', ...]
expected_features = preprocessor.get_feature_names_out()

@app.route("/")
def home():
    # Render the HTML form
    return render_template("index.html")

@app.route("/predict", methods=['POST'])
def predict_socket_type():
    """
    Predicts if a charging station is a DC-type socket based on form input.
    """
    try:
        data = request.form.to_dict()

        # Define the base data dictionary with default False values for one-hot encoded features
        # and default 0 for numeric features that might not be in the form
        input_data = {
            'latitude': 0.0, 'longitude': 0.0, 'available': 0.0, 'capacity': 0.0,
            'total': 0.0, 'capacity_num': 0.0, 'cpu_num': 0.0, 'supports_4w': False,
            'supports_2w': False, 'n_vehicle_types': 0, 'station_type_charging': False,
        }

        # Update numeric and boolean fields from form data
        for key in ['latitude', 'longitude', 'available', 'capacity', 'total', 'capacity_num', 'cpu_num']:
            if data.get(key):
                input_data[key] = float(data[key])
        for key in ['supports_4w', 'supports_2w']:
            input_data[key] = data.get(key) == 'on'
        if data.get('n_vehicle_types'):
            input_data['n_vehicle_types'] = int(data['n_vehicle_types'])

        # Handle one-hot encoding for vendor_name and station_type from the form
        vendor_mapping = {
            'BSES': 'vendor_name_BSES', 'BatterySmart': 'vendor_name_BatterySmart',
            'BluSmart': 'vendor_name_BluSmart', 'E-Fill Electric': 'vendor_name_E-Fill Electric',
            'EEE': 'vendor_name_EEE', 'EESL': 'vendor_name_EESL', 'ElectriVa': 'vendor_name_ElectriVa',
            'GensolCharge Pvt. Ltd.': 'vendor_name_GensolCharge Pvt. Ltd.', 'HPCL': 'vendor_name_HPCL',
            'JBM Renewables': 'vendor_name_JBM Renewables', 'Jio-bp': 'vendor_name_Jio-bp',
            'PlugNgo': 'vendor_name_PlugNgo', 'Powerbank': 'vendor_name_Powerbank',
            'Pvt. Ltd.': 'vendor_name_Pvt. Ltd.', 'REIL': 'vendor_name_REIL', 'REVOS': 'vendor_name_REVOS',
            'Smart E': 'vendor_name_Smart E', 'Sun Mobility': 'vendor_name_Sun Mobility',
            'TPDDL': 'vendor_name_TPDDL', 'Verdemobility': 'vendor_name_Verdemobility'
        }
        
        selected_vendor = data.get('vendor_name')
        if selected_vendor and selected_vendor in vendor_mapping:
            input_data[vendor_mapping[selected_vendor]] = True

        selected_station_type = data.get('station_type')
        if selected_station_type == 'charging':
            input_data['station_type_charging'] = True
        
        # Create a new DataFrame with the column names that the preprocessor expects.
        # This is the crucial step to fix the KeyError.
        input_df = pd.DataFrame(columns=expected_features)
        
        # Populate the DataFrame with the correct values from the form.
        for col_name in expected_features:
            # The preprocessor renames columns, so we need to map them back.
            # This is a bit of a manual process but it's the most robust for this pipeline.
            if col_name.startswith('num__'):
                original_name = col_name.replace('num__', '')
                input_df[col_name] = [input_data.get(original_name, 0.0)]
            elif col_name == 'remainder__supports_4w':
                input_df[col_name] = [input_data.get('supports_4w', False)]
            elif col_name == 'remainder__supports_2w':
                input_df[col_name] = [input_data.get('supports_2w', False)]
            elif col_name == 'remainder__n_vehicle_types':
                input_df[col_name] = [input_data.get('n_vehicle_types', 0)]
            elif col_name.startswith('remainder__vendor_name'):
                original_name = col_name.replace('remainder__', '')
                input_df[col_name] = [input_data.get(original_name, False)]
            elif col_name == 'remainder__station_type_charging':
                input_df[col_name] = [input_data.get('station_type_charging', False)]
            else:
                # Handle other columns, if any
                input_df[col_name] = [input_data.get(col_name, False)]
        
        # Preprocess the input data
        processed_data = preprocessor.transform(input_df)

        # Make a prediction
        prediction = final_model.predict(processed_data)

        # Interpret the prediction
        result = "DC-type socket" if prediction[0] == 1 else "Not a DC-type socket"
        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)