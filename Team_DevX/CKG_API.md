
# Civic Knowledge Graph API Implementation (Full Visibility)

This file documents the API endpoints and security logic for the CKG system, with full graph visibility for all users.

---

## API Endpoints

### 1. Graph Data
- **GET /api/graph**
- Returns full graph data (all nodes and edges) for all users, regardless of role.
- Example response:
```json
{
  "nodes": [ { "id": "user-123abc", "type": "user", "label": "Alice" }, { "id": "ministry-789xyz", "type": "ministry", "label": "Ministry of Water" }, ... ],
  "edges": [ { "source": "user-123abc", "target": "problem-456def", "type": "USER_REPORTED" }, { "source": "ministry-789xyz", "target": "problem-456def", "type": "PROBLEM_ASSIGNED_TO" }, ... ]
}
```

### 2. Export
- **GET /api/graph/export**
- Exports visible graph to CSV/GraphML.

### 3. AI Query (future)
- **POST /api/graph/query**
- Accepts natural language query, returns relevant graph data.

---

## Security & Privacy Implementation

- All endpoints return full graph data for all users, with no filtering or anonymization.
- Personal identifiers (display names, emails, etc.) are visible to all users.
- Embedding vectors can be exposed to frontend if needed for advanced features.
- Rate limiting and pagination may be applied for performance, but not for access control.
- RLS policies on tables (profiles, relationships) allow access for all users.

---

## Example RLS Policy (Supabase/Postgres)
```sql
-- All users can view all profiles
CREATE POLICY "All users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

-- All users can view all problems
CREATE POLICY "All users can view all problems" ON public.problems
  FOR SELECT USING (true);

-- All users can view all relationships
CREATE POLICY "All users can view all relationships" ON public.problem_relationships
  FOR SELECT USING (true);
```

---

## Extensibility
- Endpoints are designed for future AI-powered features and external graph engines.

---

## Contact
For questions or contributions, open an issue or contact the project maintainer.
