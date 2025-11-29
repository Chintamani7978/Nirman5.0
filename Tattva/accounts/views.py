from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Sum 
import random
import re
import json
import requests
from datetime import datetime

# CORE IMPORTS
from .models import Patient, HospitalOwner, Hospital, Doctor, Booking 

# In-memory storage for OTPs (Use database model for production)
otp_storage = {}

# ----------------------------------------------------------------------
# --- PATIENT FLOW VIEWS (OTP-based) ---
# ----------------------------------------------------------------------

def send_otp_page(request):
    return render(request, 'accounts/send_otp.html')

def verify_otp_page(request):
    return render(request, 'accounts/verify_otp.html')

def dashboard(request):
    # Patient Dashboard - Requires phone session key
    if 'phone' not in request.session:
        return redirect('/')
    return render(request, 'accounts/dashboard.html', {
        'phone': request.session.get('phone')
    })

@require_http_methods(["POST"])
@csrf_exempt
def check_patient_exists(request):
    """Checks if a patient with the given phone number exists in the database."""
    try:
        data = json.loads(request.body)
        phone = data.get("phone", "").strip()

        if not phone or not re.match(r"^\d{10}$", phone):
            return JsonResponse({'exists': False, 'message': 'Invalid phone number'}, status=400)

        patient_exists = Patient.objects.filter(phone=phone).exists()
        
        return JsonResponse({'exists': patient_exists})
    
    except Exception as e:
        return JsonResponse({'exists': False, 'message': f'Internal Server Error: {str(e)}'}, status=500)

@require_http_methods(["POST"])
@csrf_exempt
def send_otp(request):
    try:
        data = json.loads(request.body)
        phone = data.get("phone", "").strip()
        
        if not phone or not re.match(r"^\d{10}$", phone):
            return JsonResponse({"status": "error", "message": "Invalid phone number"})
        
        if not Patient.objects.filter(phone=phone).exists():
             return JsonResponse({
                "status": "error", 
                "message": "Patient not found. Registration required."
            }, status=403) 
        
        # Generate OTP
        otp = str(random.randint(100000, 999999))
        otp_storage[phone] = otp
        
        # 🌟 RESTORED CONSOLE PRINT FOR TESTING 🌟
        print(f"\n{'='*50}")
        print(f"📱 OTP for {phone}: {otp}")
        print(f"{'='*50}\n")
        # 🌟 ------------------------------------- 🌟
        
        # (Ultramsg sending logic remains the same)
        instance_id = getattr(settings, 'ULTRAMSG_INSTANCE_ID', None)
        token = getattr(settings, 'ULTRAMSG_TOKEN', None)
        
        if instance_id and token:
            try:
                url = f"https://api.ultramsg.com/{instance_id}/messages/chat"
                payload = {
                    "token": token,
                    "to": f"91{phone}",
                    "body": f"🔐 Your LifeCord OTP is: *{otp}*\n\nThis code is valid for 5 minutes.\n\nDo not share this code with anyone.\n\n- LifeCord Team"
                }
                requests.post(url, data=payload, timeout=10)
            except Exception:
                pass

        return JsonResponse({"status": "success", "message": "OTP sent successfully"})
    
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})

@require_http_methods(["POST"])
@csrf_exempt
def verify_otp(request):
    try:
        data = json.loads(request.body)
        phone = data.get("phone", "").strip()
        otp = data.get("otp", "").strip()
        
        if phone in otp_storage and otp_storage[phone] == otp:
            del otp_storage[phone]
            request.session["phone"] = phone
            return JsonResponse({"status": "success", "message": "OTP verified"})
        else:
            return JsonResponse({"status": "error", "message": "Invalid or expired OTP"})
    
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})

# ----------------------------------------------------------------------
# --- HOSPITAL OWNER FLOW VIEWS (Password-based, Filtered by ID) ---
# ----------------------------------------------------------------------

#@login_required 
#@login_required 
def hospital_dashboard(request, hospital_id): 
    """
    TEMPORARY FULL BYPASS: Only fetches the Hospital for context to allow 
    frontend rendering. Authorization is skipped.
    """
    try:
        # 1. Fetch the Hospital object based on the URL ID
        # THIS IS THE ONLY DB QUERY WE RUN in the template view now.
        hospital = get_object_or_404(Hospital, id=hospital_id)
        
        # 2. Skip ALL original authorization logic (HospitalOwner, user checks)
        #    since we are not logged in.
        
    except Hospital.DoesNotExist:
        # If the ID is invalid, return a 404
        return JsonResponse({'error': f'Hospital with ID {hospital_id} not found'}, status=404) 

    # 3. Render the dashboard, passing the verified ID and NAME
    return render(request, 'accounts/hospitaldashboard2.html', {
        'hospital_id': hospital_id,
        'hospital_name': hospital.name
    })


# ----------------------------------------------------------------------
# --- DASHBOARD API VIEW (WITH FILTERING) ---
# ----------------------------------------------------------------------

@require_http_methods(["GET"])
def get_dashboard_data(request, hospital_id): 
    """Fetches dashboard data filtered by the provided hospital_id."""
    try:
        # 1. Get the target Hospital (Used as the filtering criteria)
        hospital = Hospital.objects.get(id=hospital_id)
        
        # --- Filtering all queries based on the Hospital instance ---
        
        # 2. Appointments Count 
        # Assumes Booking is linked to Hospital via doctor__hospitals M2M link
        appointments_count = Booking.objects.filter(doctor__hospitals=hospital).count() 
        
        # 3. Doctors Data (Filtered)
        doctors_data = []
        # Note: If this line crashes, you need to populate data in your database
        doctors_qs = hospital.doctors.all()[:4] 

        for doc in doctors_qs:
            next_slot_time = "—"
            status_text = "Off"
            status_class = "off"
            
            if doc.available:
                status_class = "online"
                status_text = "Online"
                
                # Filter bookings for the future
                next_booking = doc.bookings.filter(time__gt=datetime.now().time()).order_by('time').first() 
                if next_booking:
                    next_slot_time = f"Today, {next_booking.time.strftime('%I:%M %p')}"
                    status_class = "busy"
                    status_text = "Busy"
            
            doctors_data.append({
                'name': doc.name,
                'spec': doc.specification,
                'slot': next_slot_time,
                'status': status_class,
                'status_text': status_text,
            })

        # 4. Upcoming Appointments (Filtered by Hospital)
        upcoming_bookings = Booking.objects.select_related('patient', 'doctor') \
            .filter(doctor__hospitals=hospital, availability=True, time__gt=datetime.now().time()) \
            .order_by('time')[:2]
        
        upcoming_data = []
        for booking in upcoming_bookings:
            upcoming_data.append({
                'patient': booking.patient.name,
                'doc': booking.doctor.name,
                'time': booking.time.strftime('%A, %I:%M %p'),
                'status': 'Confirmed', 
            })

        # --- Combine all data ---
        dashboard_data = {
            'kpis': {
                # This requires 'revenue' field on the Hospital model
                'revenue_today': f"₹ {hospital.revenue:,.0f}", 
                'appointments_count': appointments_count,
            },
            'doctors': doctors_data,
            'upcoming': upcoming_data,
            'charts': {
                'appointments_7d': { 
                    'labels': ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], 
                    'booked': [34,28,36,30,40,22,20],
                    'walkin': [12,8,10,6,14,8,4]
                },
            }
        }

        return JsonResponse(dashboard_data)

    except Hospital.DoesNotExist:
        return JsonResponse({'error': 'Hospital not found'}, status=404)
    except Exception as e:
        # If a model attribute is missing (e.g., Hospital.revenue), it will hit here
        return JsonResponse({'error': f'Internal Server Error: {str(e)}'}, status=500)
    
# views.py (Add this function)

@require_http_methods(["POST"])
@csrf_exempt
def update_doctor_availability(request):
    """Updates the 'available' status of the logged-in doctor."""
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Not authenticated'}, status=401)
    
    try:
        # 1. Get the current Doctor profile linked to the user
        # NOTE: You need a one-to-one relationship from User to Doctor for this to work.
        doctor = get_object_or_404(Doctor, user=request.user)
    except Doctor.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Doctor profile not found'}, status=404)

    try:
        data = json.loads(request.body)
        new_status = data.get("is_available") # True or False
        
        # 2. Update the status
        doctor.available = new_status
        doctor.save()
        
        return JsonResponse({'status': 'success', 'is_available': doctor.available})
        
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON format'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
# views.py (Rename the old function to doctor_dashboard_view)

def doctor_dashboard_view(request, hospital_id): # <-- NEW NAME HERE
    """Renders the unsecured Doctor's Command Center (for testing)."""
    try:
        hospital = get_object_or_404(Hospital, id=hospital_id)
    except Hospital.DoesNotExist:
        return JsonResponse({'error': f'Hospital with ID {hospital_id} not found'}, status=404) 

    # Renders the doctor's specific template
    return render(request, 'accounts/doctors_dashboard.html', {
        'hospital_id': hospital_id,
        'hospital_name': hospital.name
    })

# NOTE: The API view `get_dashboard_data` is fine as it is.