-- Emergency Crisis Mode Tables
-- Comprehensive schema for real-time disaster response system

-- 1. Emergency Incident Types and Severity Levels
CREATE TYPE emergency_type AS ENUM (
  'flood',
  'cyclone',
  'fire',
  'earthquake',
  'landslide',
  'medical_emergency',
  'accident',
  'public_safety',
  'other'
);

CREATE TYPE incident_severity AS ENUM (
  'critical',
  'high',
  'medium',
  'low'
);

CREATE TYPE resource_type AS ENUM (
  'ambulance',
  'fire_team',
  'police',
  'rescue_unit',
  'medical_unit',
  'shelter',
  'water_tanker',
  'generator',
  'food_supply',
  'other'
);

CREATE TYPE deployment_status AS ENUM (
  'pending',
  'assigned',
  'en_route',
  'arrived',
  'completed',
  'cancelled'
);

-- 2. Emergency Incidents Table
CREATE TABLE emergency_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id uuid REFERENCES problems(id) ON DELETE CASCADE,
  incident_type emergency_type NOT NULL,
  severity incident_severity NOT NULL DEFAULT 'medium',
  title text NOT NULL,
  description text,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  affected_population integer DEFAULT 0,
  life_threatening boolean DEFAULT false,
  alert_broadcast_sent boolean DEFAULT false,
  detected_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  status text DEFAULT 'active', -- active, contained, resolved
  ai_confidence_score numeric(3,2) CHECK (ai_confidence_score >= 0 AND ai_confidence_score <= 1),
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Crisis Zones (predicted high-risk areas)
CREATE TABLE crisis_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  radius_km numeric NOT NULL DEFAULT 5,
  incident_type emergency_type,
  risk_level integer CHECK (risk_level >= 1 AND risk_level <= 10),
  affected_population_estimate integer,
  prediction_source text, -- 'weather_api', 'historical_data', 'ml_model', 'manual'
  forecast_confidence numeric(3,2) CHECK (forecast_confidence >= 0 AND forecast_confidence <= 1),
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  created_by uuid REFERENCES auth.users(id)
);

-- 4. Emergency Alerts (broadcast to citizens)
CREATE TABLE emergency_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid REFERENCES emergency_incidents(id) ON DELETE CASCADE,
  alert_type text, -- 'evacuation', 'shelter', 'medical_help', 'stay_indoors', 'warning'
  message text NOT NULL,
  target_latitude numeric,
  target_longitude numeric,
  radius_km numeric DEFAULT 5,
  broadcast_status text DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  sent_at timestamp with time zone,
  recipients_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. Resource Registry (ambulances, fire teams, shelters, etc.)
CREATE TABLE emergency_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type resource_type NOT NULL,
  name text NOT NULL,
  description text,
  contact_phone text,
  contact_email text,
  current_latitude numeric,
  current_longitude numeric,
  status text DEFAULT 'available', -- 'available', 'deployed', 'busy', 'offline'
  capacity integer, -- for shelters, ambulances, etc.
  available_capacity integer,
  assigned_by uuid REFERENCES auth.users(id),
  last_updated timestamp with time zone DEFAULT now(),
  metadata jsonb, -- flexible storage for resource-specific data
  created_at timestamp with time zone DEFAULT now()
);

-- 6. Resource Deployments (assignments of resources to incidents)
CREATE TABLE resource_deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid NOT NULL REFERENCES emergency_incidents(id) ON DELETE CASCADE,
  resource_id uuid NOT NULL REFERENCES emergency_resources(id),
  deployment_status deployment_status DEFAULT 'pending',
  assigned_at timestamp with time zone DEFAULT now(),
  eta_minutes integer,
  distance_km numeric,
  priority_score numeric(4,2), -- calculated from incident severity + distance
  assigned_by uuid REFERENCES auth.users(id),
  notes text,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 7. Officer Assignments (redirecting officers for crisis response)
CREATE TABLE emergency_officer_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  officer_id uuid NOT NULL REFERENCES profiles(id),
  incident_id uuid NOT NULL REFERENCES emergency_incidents(id) ON DELETE CASCADE,
  assignment_status deployment_status DEFAULT 'pending',
  current_latitude numeric,
  current_longitude numeric,
  distance_to_incident_km numeric,
  skill_match_score numeric(3,2), -- 0-1 score of officer fit for incident type
  priority_ranking integer, -- 1 = closest, 2 = second closest, etc.
  assigned_at timestamp with time zone DEFAULT now(),
  eta_minutes integer,
  completed_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 8. Crisis Response Activity Log
CREATE TABLE crisis_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid NOT NULL REFERENCES emergency_incidents(id) ON DELETE CASCADE,
  activity_type text NOT NULL, -- 'detection', 'prioritization', 'alert_sent', 'resource_assigned', 'officer_assigned', 'status_update'
  description text,
  created_by uuid REFERENCES auth.users(id),
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_emergency_incidents_severity ON emergency_incidents(severity);
CREATE INDEX idx_emergency_incidents_type ON emergency_incidents(incident_type);
CREATE INDEX idx_emergency_incidents_location ON emergency_incidents USING GIST (ll_to_earth(latitude, longitude));
CREATE INDEX idx_emergency_incidents_status ON emergency_incidents(status);
CREATE INDEX idx_emergency_incidents_life_threatening ON emergency_incidents(life_threatening);
CREATE INDEX idx_crisis_zones_active ON crisis_zones(active);
CREATE INDEX idx_crisis_zones_location ON crisis_zones USING GIST (ll_to_earth(latitude, longitude));
CREATE INDEX idx_emergency_resources_status ON emergency_resources(status);
CREATE INDEX idx_emergency_resources_type ON emergency_resources(resource_type);
CREATE INDEX idx_resource_deployments_incident ON resource_deployments(incident_id);
CREATE INDEX idx_resource_deployments_status ON resource_deployments(deployment_status);
CREATE INDEX idx_officer_assignments_status ON emergency_officer_assignments(assignment_status);
CREATE INDEX idx_officer_assignments_incident ON emergency_officer_assignments(incident_id);

-- Row-Level Security Policies
ALTER TABLE emergency_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_officer_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_activity_log ENABLE ROW LEVEL SECURITY;

-- Allow ministry staff to read all emergency data
CREATE POLICY "Ministry staff can read emergency incidents" ON emergency_incidents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ministry'
    )
  );

CREATE POLICY "Ministry staff can create emergency incidents" ON emergency_incidents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ministry'
    )
  );

-- Citizens can read alerts affecting them (within zone)
CREATE POLICY "Citizens can read alerts in their zone" ON emergency_alerts
  FOR SELECT
  TO authenticated
  USING (true); -- simplified; in production, check if user is in alert radius

-- Similar policies for other tables...
CREATE POLICY "Citizens can read crisis zones" ON crisis_zones
  FOR SELECT
  TO authenticated
  USING (active = true);

-- Audit trigger
CREATE OR REPLACE FUNCTION log_crisis_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO crisis_activity_log (incident_id, activity_type, description, created_by, metadata)
    VALUES (NEW.id, 'detection', 'New incident detected: ' || NEW.title, auth.uid(), jsonb_build_object('severity', NEW.severity, 'type', NEW.incident_type));
  ELSIF TG_OP = 'UPDATE' AND OLD.severity != NEW.severity THEN
    INSERT INTO crisis_activity_log (incident_id, activity_type, description, created_by, metadata)
    VALUES (NEW.id, 'status_update', 'Severity changed from ' || OLD.severity || ' to ' || NEW.severity, auth.uid(), NULL);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER emergency_incidents_audit_trigger
AFTER INSERT OR UPDATE ON emergency_incidents
FOR EACH ROW
EXECUTE FUNCTION log_crisis_activity();
