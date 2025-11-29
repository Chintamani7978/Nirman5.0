
# Civic Knowledge Graph Security Implementation (Full Visibility)

This file documents the security and privacy controls for the CKG system, with full graph visibility for all users.

---

## 1. Role-Based Access Controls
- **Citizen:**
  - Can view all problems, solutions, users, ministries, locations, and relationships in the graph.
  - Personal identifiers (display names, emails, etc.) are visible.
- **Ministry:**
  - Can view all problems, solutions, users, ministries, locations, and relationships in the graph.
- **Admin:**
  - Full graph visibility, can trigger AI refresh and manage node merges.

---

## 2. Anonymization
- No anonymization is applied. All user and entity details are visible to all roles.

---

## 3. Data Filtering
- No data filtering is applied. All graph data is accessible to all users.

---

## 4. Rate Limiting
- Rate limiting and pagination may still be applied for performance, but not for access control.

---

## 5. Embedding Security
- Embedding vectors are stored securely, but can be exposed to frontend if needed for advanced features.

---

## 6. API Endpoints
- All endpoints return full graph data for all users, regardless of role.

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

## Contact
For questions or contributions, open an issue or contact the project maintainer.
