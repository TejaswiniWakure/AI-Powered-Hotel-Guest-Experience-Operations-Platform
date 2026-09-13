# StayFlow — AI-Powered Hotel Guest Experience & Operations Platform

> **Guest Experience. Hotel Operations. One Flow.**

StayFlow is a production-quality, commercial-grade, multi-tenant hotel SaaS platform engineered to unify guests, frontline staff, operations managers, and property administrators into one continuous, high-efficiency workflow.

```
Guest ──> Request ──> Understand ──> Prioritize ──> Assign ──> Resolve ──> Feedback ──> Analytics ──> Insight ──> Action
```

---

## 🌟 Executive Overview

In traditional hospitality environments, guest requests, housekeeping, maintenance, and guest relations operate in disconnected silos. A dripping faucet reported by a guest on Floor 3 might take hours to reach the right engineer, recurrent HVAC issues across an entire wing go unnoticed until negative reviews appear on TripAdvisor, and managers lack real-time visibility into SLA compliance.

**StayFlow solves this end-to-end** by orchestrating the entire lifecycle of hotel guest requests and operational incidents with AI-driven intelligence, real-time WebSocket synchronization, automated 4-factor staff assignment, dynamic SLA countdowns, and proactive floor-cluster trend detection.

---

## 🏛️ Platform Architecture & Experiences

StayFlow is designed with 4 distinct, purpose-built role portals and 1 public commercial showcase:

### 1. 🏨 Guest Web Experience (`/guest`)
* **Instant Room Access**: Zero-install mobile-first web portal with QR-code room detection (`?room=312`).
* **AI Concierge**: Grounded RAG assistant with vector cosine retrieval and citations from the hotel's verified knowledge base (dining hours, pool policies, checkout times, local recommendations).
* **Service Ordering Catalog**: 1-tap ordering for Housekeeping, In-Room Dining, Extra Linens, and Luggage Assistance with instant pricing and live status tracking.
* **Multimodal Issue Reporting**: Camera/photo upload with instant AI vision diagnosis, category detection, severity classification, and department dispatch.
* **Live Request Timeline**: Real-time status tracker (`Pending` → `Assigned` → `In Progress` → `Resolved`) with visual SLA countdown.
* **5-Star Guest Rating & Feedback**: Post-resolution satisfaction survey with rating and comment submission.

### 2. 👷 Staff Operational Workspace (`/staff`)
* **Role-Specific Task Feed**: Filterable view of assigned tasks (`All`, `Pending`, `In Progress`, `Completed`, `At Risk`).
* **SLA Urgency Badges**: Dynamic countdown chips indicating on-track, at-risk (< 15 mins), or breached tasks.
* **Task Execution Lifecycle**: 1-tap state machine to **Accept**, **Start**, and **Complete** tasks.
* **Resolution Proof Verification**: Mandatory photo proof upload and resolution notes before completing maintenance or cleaning tasks.
* **AI SOP Assistant**: On-demand RAG troubleshooting assistant querying internal Standard Operating Procedures (e.g., HVAC error codes, water pressure fixes, room turnover checklists).
* **Personal Performance Metrics**: Individual scorecards tracking completed tasks, on-time resolution percentage, average resolution time, and guest ratings.

### 3. 📊 Manager Command Center (`/manager`)
* **Executive KPI Dashboard**: Real-time monitoring of Active Requests, SLA Compliance %, Staff On-Duty, and Average Guest Rating.
* **Live Operations Stream**: Chronological audit feed of all guest requests, status transitions, reassignments, and completions.
* **Request Management & Override**: Capabilities to reprioritize requests, reassign tasks to different team members, and view AI reasoning logs.
* **Staff Workload & Capacity**: Department-by-department view of staff availability, current active loads, and performance ratings.
* **MongoDB Aggregation Analytics**: Interactive Recharts visualizations showing request volume by department, hourly distribution, peak load times, and SLA trends.
* **48-Hour Issue Trend Detection**: Automated clustering algorithms that detect recurring equipment or service failures (e.g., recurring HVAC failures on Floor 3) and recommend preventive maintenance actions.
* **Guest Preferences & VIP Tracking**: Room-by-room log of dietary restrictions, pillow preferences, and repeat guest notes.
* **Safety & Compliance Audits**: Scheduled inspections and compliance checklist management.
* **Operational Reporting**: Custom report generator with CSV and print export.

### 4. ⚙️ Administrator Control Center (`/admin`)
* **Multi-Tenant Property Management**: Hotel profile, check-in/checkout policies, timezone, and contact details.
* **Interactive Room Manager**: Floor-by-floor inventory of all rooms, types, statuses (Occupied, Available, Maintenance, Cleaning), and instant QR code generation for room doors.
* **Staff & User Administration**: User management across all roles, department assignments, and contact information.
* **Department & Service Catalog**: Management of hotel operational departments and service menu pricing.
* **SLA Configuration**: Custom SLA response and resolution time thresholds per priority level (`Low`, `Medium`, `High`, `Critical`).
* **RAG Knowledge Base Manager**: Document uploader with automatic text chunking and vector indexing for guest concierge and staff SOPs.
* **Audit & Activity Logs**: Immutable operational audit logs tracking all system actions and user logins.

### 5. 🌐 Commercial Landing & Pricing (`/`, `/pricing`)
* **Commercial SaaS Showcase**: Interactive workflow visualizer, live demo switcher, feature breakdowns, and testimonials.
* **Multi-Tier Pricing Matrix**: Essential (₹4,999/mo), Professional (₹9,999/mo), and Enterprise tiers.
* **Instant Self-Serve Onboarding**: Complete hotel property registration and 14-day free trial activation.

---

## 🧠 Core Intelligence & Automation Engines

### 1. Multimodal AI Request Understanding & Diagnosis
* Automatically parses natural language guest descriptions and visual image inputs.
* Extracts category, urgency, safety risk flags, and estimated resolution difficulty.
* Operates with an enterprise-grade deterministic heuristic fallback engine, ensuring 100% platform availability and instant responses even if external AI APIs are unreachable.

### 2. 4-Factor Smart Assignment Engine
When a request is submitted, StayFlow calculates an objective composite score for all available on-duty staff members:
$$\text{Score} = (\text{Skill Match} \times 40\%) + (\text{Availability} \times 25\%) + (\text{Workload Capacity} \times 20\%) + (\text{Floor Proximity} \times 15\%)$$
* Automatically assigns the highest-scoring staff member.
* Persists an audit explanation explaining exactly why that staff member was selected.

### 3. Dynamic SLA Engine
* Calculates target resolution timestamps based on priority levels (`Critical`: 30m, `High`: 45m, `Medium`: 60m, `Low`: 120m).
* Real-time categorization of tasks into `On Track`, `At Risk` (remaining time < 25% or < 15 min), or `Breached`.
* Triggers real-time alerts to managers when tasks breach or enter critical status.

### 4. 48-Hour Spatial & Categorical Trend Pattern Detector
* Continuously scans operational logs for patterns within rolling 48-hour windows.
* Detects recurring equipment faults localized to specific floors or wings (e.g., multiple AC issues on Floor 3).
* Flags systemic anomalies to managers and generates 1-tap preventive maintenance actions.

### 5. Grounded RAG Knowledge & SOP Engine
* Chunks hotel policy documents, amenities guidelines, and engineering manuals.
* Uses vector cosine similarity embeddings to retrieve the top matching context chunks.
* Synthesizes answers strictly grounded in hotel documentation and provides explicit source citations.

### 6. Multi-Tenant WebSocket Synchronization
* Built on Socket.IO with hotel room scoping (`hotelId`).
* Broadcasts updates for new requests, status changes, task assignments, and safety checks in real-time.

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, JavaScript (ES6+), Vite, Tailwind CSS v4, React Router v7, Axios, Recharts, Lucide React |
| **Backend** | Node.js, Express 5, Mongoose 9, Socket.IO, JWT, bcryptjs |
| **Database** | MongoDB (Strict multi-tenant architecture with `hotelId` isolation) |
| **Design Language** | Luxury Hospitality Palette: Midnight Navy (`#172033`), Champagne Gold (`#C9A86A`), Warm Ivory (`#F7F5EF`) with Playfair Display & Inter typography |

---

## 🔑 Demo Accounts & Pre-Seeded Scenarios

StayFlow comes pre-loaded with a luxury hotel property: **StayFlow Grand Pune (Code: `SFGP`)**.

All demo accounts share the password: `StayFlow@2026`

| Persona | Email | Role | Default View / Pre-configured State |
|---|---|---|---|
| **Property Administrator** | `admin@stayflow.demo` | `admin` | Full hotel settings, room inventory with QR codes, SLA matrix, knowledge base |
| **Operations Manager** | `manager@stayflow.demo` | `manager` | Live operations feed, KPI overview, Recharts analytics, recurring HVAC trend alert on Floor 3 |
| **Maintenance Engineer** | `staff@stayflow.demo` | `staff` | Active tasks assigned (Room 312 HVAC diagnosis, plumbing), SOP assistant, performance metrics |
| **In-House Guest** | `guest@stayflow.demo` | `guest` | Checked into **Room 312**, active service requests, AI concierge chat, issue reporting |

> **Pro Tip**: Use the **1-Click Persona Switcher** on the `/login` page to effortlessly jump between Guest, Staff, Manager, and Admin perspectives!

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **MongoDB**: Local MongoDB instance running on `127.0.0.1:27017` (or remote MongoDB connection URI)

### 1. Clone the Repository
```bash
git clone https://github.com/TejaswiniWakure/AI-Powered-Hotel-Guest-Experience-Operations-Platform.git
cd AI-Powered-Hotel-Guest-Experience-Operations-Platform
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create or verify .env file
# (Pre-configured for local MongoDB and Port 5001)
cp .env.example .env 2>/dev/null || true
```

Default backend `.env` configuration:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/stayflow
JWT_SECRET=stayflow_production_jwt_secret_key_2026
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Seed Database with Realistic Hotel Data
```bash
npm run seed
```
*Seeds 3 hotel properties, 11+ rooms, departments, staff members, active requests, SOP documents, and recurring trend patterns.*

### 4. Run Backend Verification Tests
```bash
npm test
```
*Executes the automated 10-point test suite verifying health, RBAC enforcement, RAG concierge, SOP assistant, AI request routing, smart assignment scoring, and trend pattern detection.*

### 5. Start Backend Server
```bash
npm run dev
# or: node server.js
# Backend will run on http://127.0.0.1:5001
```

### 6. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
# Frontend will run on http://localhost:5173
```

To build for production:
```bash
npm run build
```

---

## 📡 Core API Endpoints

### Authentication (`/api/auth`)
* `POST /login` — Authenticate user and receive scoped JWT
* `POST /signup` — Register new hotel property and manager
* `GET /me` — Fetch current user profile and hotel metadata
* `POST /forgot-password` — Password recovery dispatcher
* `GET /demo-accounts` — Fetch available demo persona credentials

### Guest Portal (`/api/guest`)
* `GET /dashboard` — Active requests and recommendations
* `GET /services` — Hotel service catalog
* `POST /requests/service` — Submit service order
* `POST /requests/issue` — Multimodal issue submission with AI diagnosis
* `GET /requests` — Guest request history and status tracking
* `POST /feedback` — Submit post-resolution rating & review
* `POST /concierge/chat` — Grounded RAG knowledge assistant

### Staff Workspace (`/api/staff`)
* `GET /dashboard` — Personal workload, SLA summary, and active tasks
* `GET /tasks` — Filterable tasks list
* `PUT /tasks/:id/accept` — Acknowledge task assignment
* `PUT /tasks/:id/start` — Transition task to In Progress
* `PUT /tasks/:id/complete` — Complete task with photo proof and notes
* `POST /assistant` — Query SOP troubleshooting knowledge base
* `GET /performance` — Personal resolution speed, ratings, and SLA score

### Manager Command Center (`/api/manager`)
* `GET /dashboard` — High-level hotel KPIs and operational health
* `GET /operations` — Real-time live activity stream
* `GET /requests` — Full hotel requests with filter controls
* `PUT /requests/:id/reassign` — Reassign task to another staff member
* `PUT /requests/:id/priority` — Update priority and recalculate SLA
* `GET /staff` — Staff availability and workload matrix
* `GET /analytics` — Real-time MongoDB aggregation metrics
* `GET /trends` — 48-hour equipment failure pattern clusters
* `POST /trends/:id/action` — Schedule preventive maintenance action
* `GET /guest-preferences` — VIP guest notes and preferences
* `GET /reports` — Operational report exports

### Admin Control Center (`/api/admin`)
* `GET /overview` — Property-wide operational overview
* `GET /hotel` & `PUT /hotel` — Property profile and policies
* `GET /rooms` & `POST /rooms` — Room inventory and status management
* `GET /staff` & `POST /staff` — Staff onboarding and role assignment
* `GET /departments` & `POST /departments` — Department management
* `GET /services` & `POST /services` — Service catalog management
* `GET /sla` & `PUT /sla` — SLA duration configuration
* `GET /knowledge` & `POST /knowledge` — Upload and chunk RAG documents
* `GET /logs` — Operational audit trails

---

## 🔒 Security & Multi-Tenancy

* **Strict Tenant Isolation**: All database queries enforce `{ hotelId }` scoping extracted from cryptographically signed JWT tokens.
* **Role-Based Access Control (RBAC)**: Enforced via Express middleware on every API route and mirrored on the frontend via React Router guards.
* **Sanitized Inputs & Password Hashing**: Passwords hashed with `bcryptjs` (salt rounds: 10).

---

## 📄 License & Ownership

Designed and engineered as a modern, AI-powered hospitality operational SaaS platform.
StayFlow &copy; 2026. All rights reserved.
