# Civic Knowledge Graph (CKG) Architecture & API

## Overview
The Civic Knowledge Graph (CKG) connects citizens, problems, solutions, ministries, and geolocations into an intelligent, graph-based knowledge model. It supports backend graph inference (embeddings + relationships) and frontend visualization (D3.js/Graphin).

---

## 1. Architecture

### Data Layer
- **Supabase/Postgres**: Stores all entities (users, problems, solutions, comments, ministries, locations).
- **pgvector**: Stores embeddings for semantic similarity.
- **Relationship Tables**: `problem_relationships`, `solution_approvals`, `ministry_regions`, etc.

### Inference Layer
- **Embedding Generation**: Gemini/OpenAI API for problems/solutions.
- **Similarity Calculation**: pgvector cosine similarity for semantic edges.
- **Background Jobs**: Nightly refresh of embeddings and relationships.

### API Layer
- **Supabase RPC/REST Endpoints**: Role-based endpoints for graph data.
- **RLS Policies**: Enforce access control and anonymization.

### Visualization Layer
- **React + D3.js/Graphin**: Interactive graph explorer for citizen, ministry, and admin views.

---

## 2. API Endpoints

### Graph Data
- `/api/graph/citizen` — Citizen view (anonymized, filtered by user activity)
- `/api/graph/ministry` — Ministry view (filtered by assigned region/domain)
- `/api/graph/admin` — Admin view (full graph, all relationships)

### Export
- `/api/graph/export` — Export visible graph to CSV/GraphML

### AI Queries
- `/api/graph/query` — Natural language queries (future Gemini/OpenAI integration)

---

## 3. Integration Hooks (Future AI)
- **Natural Language Query**: "Show me related problems about waste management in Tamil Nadu."
- **Automatic Clustering**: AI-driven community impact clusters.
- **Summarization**: High-impact node summaries.
- **Graph Metrics**: Centrality, clustering coefficient, engagement density.

---

## 4. Security & Privacy
- **Role-based filtering**: Citizen, ministry, admin.
- **Anonymization**: No personal identifiers in graph data.
- **Rate limiting**: Paginate large queries.
- **Embedding security**: Vectors encrypted at rest.

---

## 5. Background Jobs
- **Embedding refresh**: Update embeddings for new/changed records.
- **Relationship inference**: Recompute semantic similarity edges.
- **Graph export**: Prepare data for visualization and analytics.

---

## 6. Extensibility
- Designed for future AI-powered features and external graph engines (Neo4j, Memgraph, RedisGraph).

---

## 7. References
- [pgvector](https://github.com/pgvector/pgvector)
- [Supabase](https://supabase.com/)
- [Graphin](https://graphin.dev/)
- [D3.js](https://d3js.org/)

---

## Contact
For questions or contributions, open an issue or contact the project maintainer.
