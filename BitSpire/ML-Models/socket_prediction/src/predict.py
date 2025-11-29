import pandas as pd
import joblib
import os

# Define the relative path to your saved model and preprocessor
# In your predict.py file
model_path = os.path.join('..', 'artifacts', 'adaboost_model.pkl')
preprocessor_path = os.path.join('..', 'artifacts', 'preprocessor.pkl')

try:
    # Load the trained model and the preprocessor
    final_model = joblib.load(model_path)
    preprocessor = joblib.load(preprocessor_path)
    print("Model and preprocessor loaded successfully.")
except FileNotFoundError:
    print("Error: The model or preprocessor files were not found.")
    print("Please check the path:", model_path)
    exit()

# Create a sample data point for a new charging station
# Make sure the columns match your training data.
new_data = pd.DataFrame([{
    'latitude': 28.6,
    'longitude': 77.2,
    'available': 10.0,
    'capacity': 5.0,
    'total': 10.0,
    'capacity_num': 5.0,
    'cpu_num': 3.5,
    'supports_4w': True,
    'supports_2w': False,
    'n_vehicle_types': 1,
    'vendor_name_BSES': False,
    'vendor_name_BatterySmart': False,
    'vendor_name_BluSmart': True,
    'vendor_name_E-Fill Electric': False,
    'vendor_name_EEE': False,
    'vendor_name_EESL': False,
    'vendor_name_ElectriVa': False,
    'vendor_name_GensolCharge Pvt. Ltd.': False,
    'vendor_name_HPCL': False,
    'vendor_name_JBM Renewables': False,
    'vendor_name_Jio-bp': False,
    'vendor_name_PlugNgo': False,
    'vendor_name_Powerbank': False,
    'vendor_name_Pvt. Ltd.': False,
    'vendor_name_REIL': False,
    'vendor_name_REVOS': False,
    'vendor_name_Smart E': False,
    'vendor_name_Sun Mobility': False,
    'vendor_name_TPDDL': False,
    'vendor_name_Verdemobility': False,
    'station_type_charging': True
}])

# Preprocess the new data using the loaded preprocessor
# We use `.transform()` not `.fit_transform()`
features_scaled = preprocessor.transform(new_data)

# Make a prediction
prediction = final_model.predict(features_scaled)

# Interpret and print the result
if prediction[0] == 1:
    print("\nPrediction: This charging station is likely to be a DC-type socket. ⚡️")
else:
    print("\nPrediction: This charging station is likely not a DC-type socket. 🔋")