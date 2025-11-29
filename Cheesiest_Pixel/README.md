# SamhitaFusion 🌿⚕️  
**Integrating Traditional & Modern Healthcare Data for India**

---

## 1. Problem Statement

Indian patients routinely mix **modern medicine (allopathy)** with **traditional systems (Ayurveda, Homeopathy, Unani, Yoga, folk remedies)**, but their data is scattered across paper files, WhatsApp photos, and unconnected hospital systems.  
Because of this:

- Doctors cannot see a full picture of what a patient is actually taking.  
- Researchers cannot easily study outcomes across different systems.  
- Clinics and hospitals rarely have a unified, consent‑aware view of integrative care.

Hospitals are also very reluctant (and often legally unable) to share raw patient databases with students, so most college projects stay theoretical instead of being connected to realistic data and workflows.

---

## 2. What SamhitaFusion Does (USP)

**SamhitaFusion** is a multi‑portal web app that:

- Gives **patients** a single, free place to see all their health visits (allopathy + traditional) and share a QR health card in emergencies.
- Gives **doctors and clinics** a structured way to record visits from multiple systems in one record, with simple analytics and “incoming case” routing.
- Gives **researchers** access only to **anonymised, consented data**, with filters and charts to compare outcomes across treatment modalities.
- Adds a **consent + access‑request workflow** so that researchers cannot see or export data unless clinics/patients explicitly allow it.

> **USP in one line:**  
> “One Indian health record that understands both kadha and antibiotics, with built‑in consent and analytics.”

---

## 3. Core Features by Role

### Patient Portal

- Personal health dashboard (visits, upcoming appointments, simple trends).
- **QR Health Profile**: one tap generates a QR code linking to a read‑only summary page.
- Appointment booking with clinics/doctors (online/offline).
- Document archive for prescriptions and reports.
- Consent settings: allow or deny anonymised use of their data for research.

### Doctor Portal

- Dashboard showing today’s appointments, active patients, and **incoming cases**.
- Unified patient timeline with labelled modalities (allopathy, ayurveda, etc.).
- Visit notes and digital prescriptions stored as structured records.
- Telemedicine layout (video UI placeholder + real chat area).
- “Differential Diagnosis Assistant” panel (rule‑based now, AI‑ready later).

### Researcher Portal

- Filterable, anonymised data explorer (disease, modality, outcome, region, date).
- **Comparative Outcome Analyzer**: charts comparing outcomes by modality.
- Cohort builder (e.g., “urban 30–40 diabetes patients treated with allopathy + ayurveda”).
- Trends / outbreak charts using mock or public data.
- Locked datasets with **Request Access** button → consent workflow.

### Clinic / Admin Portal

- Multi‑step **data entry wizard**:
  - Type of entry (new registration, follow‑up, diagnosis, lab, prescription upload).
  - Patient basic data, visit details, modality, consulting/referring doctor.
  - Optional scan/upload of prescription/report.
- “Incoming Case” routing to doctor dashboards.
- User management (roles: patient, doctor, researcher, admin).
- Bulk CSV import with column mapping (for digitizing old registers).
- Institutional analytics: patient counts, visits, modality split, top conditions.

---

## 4. Data, Privacy & Ethics

We **do not** connect to live hospital EMR systems.

For this prototype we use a combination of:

- Public/open health datasets (government and research reports) cleaned and reshaped into our schema for trends and aggregate charts.  
- Anonymous survey data (age band, broad location, condition, what treatments tried, perceived outcome) collected from volunteers, without names or contact details.  
- Manually structured information from **published case reports** where personal identifiers are already removed.  
- Synthetic data generated to match realistic distributions (e.g., more diabetes cases in 40+ age group, higher urban prevalence).

Every patient/record has consent fields:

- `allowResearchUse` (boolean)  
- `allowAnonymizedSharing` (boolean)  
- `allowedResearchers: []` (whitelist of researcher IDs)

Researchers:

- See only anonymised fields.  
- Can only query records where consent flags allow it or they have been explicitly whitelisted.  
- For locked data they must send a **consent request** which is visible to the relevant clinic/doctor, who can Approve or Reject.

This design lets us **simulate a real‑world governance model** without breaking privacy laws.

---

## 5. Architecture & Tech Stack

**Frontend**

- React (JavaScript, functional components)
- React Router for multi‑page routing + protected routes
- Tailwind CSS with custom dark, greenish theme
- UI inspired by:
  - Uiverse elements – https://uiverse.io/elements
  - Reactbits – https://www.reactbits.dev/
- Recharts / Chart.js for graphs
- QR code library for patient health cards

**Backend & Data**

- Firebase Authentication (email/password)
- Cloud Firestore (NoSQL database)

_Main collections:_

- `users` – basic user profiles + role  
- `patients` – demographic + contact info  
- `healthRecords` – per visit, with modality, diagnosis, outcome, files, consent flags  
- `appointments` – schedule with doctor/clinic relationships  
- `messages` – chat messages (for teleconsult layout)  
- `hospitals` – clinic/hospital meta  
- `consentRequests` – access requests from researchers  
- `plans` & `subscriptions` – for subscription / plan state

**Optional subscription / payments (test‑mode only)**

- Stripe integrated through Firebase in **test mode** to simulate plan upgrades (no real money charged).
- Used only to show that the platform can support SaaS‑like clinic/research plans.

---

## 6. What Is Actually Implemented (Hackathon Deliverables)

- Working React frontend with:
  - Landing page
  - Signup/Login with role selection
  - Dashboard skeletons for all four roles
- Firebase‑backed login, signup, and role‑based routing.
- Firestore data models and example seed data.
- Clinic “Add Visit” wizard that:
  - Creates/updates patient.
  - Creates health record.
  - Routes an “incoming case” to the selected doctor.
- Patient QR profile generation with working read‑only route.
- Researcher explorer and comparative chart with demo data + consent enforcement.
- Admin bulk CSV import flow (front‑end parsing + Firestore save).
- Consent toggles + research access request flow (UI + Firestore).

Where full production‑grade code is heavy (e.g., video calls, full AI models, complex RCT‑level statistics), we provide:

- Complete **UI and data flow**.
- **Mocked or simplified logic** but designed so real APIs/models can be plugged in later.

---

## 7. How to Run the Project (Judge Instructions)

1. **Login / Signup Flow**
   - Open the deployed URL or local dev URL (shown below).
   - Click **Sign Up**.
   - Create at least one account for each role:
     - Patient
     - Doctor
     - Researcher
     - Admin/Clinic
   - Log in with each role and note how the dashboard changes.

2. **End‑to‑end Scenario (Recommended Demo Path)**
   1. Log in as **Clinic/Admin**:
      - Use the **Add Visit** wizard to register a new patient and assign a doctor.
   2. Log in as that **Doctor**:
      - See the new **Incoming Case** card.
      - Open it, check the unified record, add notes/prescription.
   3. Log in as the **Patient**:
      - View the visit in timeline.
      - Generate QR Health Profile and scan it from another device or open the summary link.
   4. Log in as **Researcher**:
      - Use filters to see anonymised stats/charts for a condition.
      - Try to access a locked dataset and send a **Request Access**.
   5. Back as **Clinic/Admin**:
      - Approve that request.
   6. As **Researcher** again:
      - Refresh and see that the previously locked dataset is now available.

3. **Plans / Subscription (if configured)**
   - As a Clinic/Admin user, go to **Plans**.
   - Click a paid plan; app will open a Stripe **test checkout**.
   - After test completion, come back to dashboard and see Pro‑only analytics unlocked.

---
