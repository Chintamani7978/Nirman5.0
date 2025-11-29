import os
import requests

ULTRAMSG_INSTANCE_ID = os.getenv("ULTRAMSG_INSTANCE_ID")
ULTRAMSG_TOKEN = os.getenv("ULTRAMSG_TOKEN")

def send_whatsapp_otp(phone, otp_code):
    """
    phone should be with country code, e.g. '919876543210'
    UltraMsg expects format like '919876543210'
    """
    if not ULTRAMSG_INSTANCE_ID or not ULTRAMSG_TOKEN:
        print("UltraMsg credentials missing")
        return False

    url = f"https://api.ultramsg.com/{ULTRAMSG_INSTANCE_ID}/messages/chat"
    params = {
        "token": ULTRAMSG_TOKEN,
        "to": phone,
        "body": f"Your OTP is: {otp_code}. It is valid for 5 minutes.",
    }

    try:
        response = requests.get(url, params=params)
        print("UltraMsg response:", response.text)
        return response.status_code == 200
    except Exception as e:
        print("Error sending OTP:", e)
        return False
