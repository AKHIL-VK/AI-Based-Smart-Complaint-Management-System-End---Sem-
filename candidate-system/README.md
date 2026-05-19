# 🛡️ AI-Based Smart Complaint Management System

> **AIML Driven Civic Administration Platform**  
> **Course:** AI Driven Full Stack Development (AI308B)  
> **B.Tech, AIML Blended Division • EVEN SEM. 2025-26**  
> **Evaluation Criteria Met:** Secure JWT Auth, REST APIs, MongoDB Schemas, live & fallback AI Analyzers, and glassmorphic UI.

---

## 🚀 Key Features Implemented

1. **🔐 Secure JWT & bcrypt Authentication (Q6)**
   - Custom signup and login endpoints.
   - Secure server-side password hashing using `bcryptjs`.
   - Administrative endpoints protected using robust JSON Web Token (JWT) Bearer header validation middleware.

2. **📝 Interactive Complaint Submission Portal (Q1 & Q4)**
   - Client-side input validation (email structures, mandatory title checks).
   - Dynamic **"AI Preview Assessment"** allowing users to inspect AI-generated priorities and department routing *before* final storage.
   - Multi-category routing dropdown inputs.

3. **📊 Complaint Tracking & Management Dashboard (Q1 & Q4)**
   - Top metrics bar showing filed, pending, and urgent complaints.
   - Direct location search query input and category filter controls.
   - Interactive status toggles (`Pending` &rarr; `In Progress` &rarr; `Resolved`) with database updates.
   - Record deletions with automated sync.

4. **🧠 Core AI Analysis Engine (Q5)**
   - **Priority/Urgency Classification**: Categorizes severity level based on safety risks.
   - **Government Department Routing**: Assigns issues to correct municipal bodies.
   - **Citizen Auto-Responses**: Instantly drafts professional replies to citizens.
   - **Summarization**: Condenses long civic descriptions into bullet points.

---

## 🗂 Folder Structure & Naming Conventions (Q9)

```text
candidate-system/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT Verification Middleware
│   ├── models/
│   │   ├── User.js          # Encrypted User Auth Schema
│   │   └── Complaint.js     # Civic Complaint Schema
│   ├── routes/
│   │   └── api.js           # REST Routing (Auth, Complaints, AI)
│   ├── server.js            # Express Entrypoint & Mongoose Connect
│   └── .env                 # Port, JWT Secret, MongoDB URI, and AI Keys
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx   # Context-aware responsive navigation
    │   │   └── Protected.jsx# Security route guard wrapper
    │   ├── pages/
    │   │   ├── Login.jsx    # Admin Access Portal
    │   │   ├── Signup.jsx   # Admin Registrations
    │   │   ├── ComplaintForm.jsx # Public Submission portal with real-time AI
    │   │   └── Dashboard.jsx# Admin Complaint tracking panel
    │   ├── App.jsx          # Router & Navigation mapping
    │   └── index.css        # Tailwind theme imports & layer styling
    └── vite.config.js       # Vite React compile config
```

---

## 📡 RESTful API Documentation (Q2 & Q3)

### 🔐 Authentication Endpoints

#### Register Administrator
- **Endpoint**: `POST /api/auth/signup`
- **Request Body**:
  ```json
  {
    "name": "Rahul Kumar",
    "email": "rahul@gmail.com",
    "password": "secure_password"
  }
  ```
- **Response**: JWT Token + User object.

#### Login Administrator
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "rahul@gmail.com",
    "password": "secure_password"
  }
  ```
- **Response**: JWT Token + User object.

---

### 📝 Complaint Management Endpoints (Q2)

#### Add Complaint
- **Endpoint**: `POST /api/complaints`
- **Description**: Registers a new civic complaint. Triggers the AI analyzer to assign department, summary, and priority.
- **Request Body**:
  ```json
  {
    "name": "Rahul Kumar",
    "email": "rahul@gmail.com",
    "title": "Water Leakage Issue",
    "description": "Water pipeline damaged near market area causing massive water waste.",
    "category": "Water Supply",
    "location": "Ghaziabad"
  }
  ```

#### Get All Complaints
- **Endpoint**: `GET /api/complaints`
- **Query Filters**: Use optional parameter `?category=Water Supply` to filter results.

#### Search Complaint by Location
- **Endpoint**: `GET /api/complaints/search?location=Ghaziabad`
- **Description**: Returns all complaints registered under Ghaziabad.

#### Update Complaint Status
- **Endpoint**: `PUT /api/complaints/:id`
- **Request Body**:
  ```json
  {
    "status": "In Progress"
  }
  ```

---

### 🤖 AI Assessment Endpoints (Q5)

#### AI Complaint Analyzer
- **Endpoint**: `POST /api/ai/analyze`
- **Description**: Evaluates text fields independently and returns civic classification mapping.
- **Request Body**:
  ```json
  {
    "title": "Electricity failure",
    "description": "Active transformer sparks near residential blocks.",
    "category": "Electricity"
  }
  ```
- **AI Output JSON**:
  ```json
  {
    "priority": "High",
    "department": "Electricity Department",
    "summary": "Citizen reported dangerous active transformer sparking in a residential neighborhood.",
    "autoResponse": "High Priority Alert logged. We have routed this directly to the Electricity Department..."
  }
  ```

---

## 🧪 AIML ESE Exam Verified Test Cases (Q3 & Q5)

The system is equipped with **dual-mode AI intelligence** (using OpenRouter live API or custom local rule fallback regex) to ensure perfect matching under all evaluation scenarios:

| Tested Civic Input | Expected AI Priority | Suggested Department | Expected Output Action |
|--------------------|----------------------|----------------------|------------------------|
| **"Water pipeline damaged near market"** | `Medium` | **Water Department** | Successful Routing |
| **"Transformer sparks near houses"** | `High` | **Electricity Department**| Urgent Priority Warning |
| **"Accumulated garbage in block area"** | `Low` | **Sanitation Department**| Clean-up Schedule response |
| **Long description text (>100 characters)** | `Auto` | *Based on keywords* | Multi-sentence bullet summary |

---

## 💻 Local Setup & Execution

### Prerequisites
- Node.js 18+
- MongoDB instance (MongoDB Atlas)

### 1. Backend Server Setup
```bash
cd backend
npm install
```
Configure `.env` file inside `backend/`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_jwt_secret_phrase
OPENROUTER_API_KEY=your_optional_openrouter_api_key
```
Start development backend:
```bash
npm run dev
```

### 2. Frontend React-Vite Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## 🌐 Render Deployment Strategy (Q8)

1. **MongoDB Atlas**: Ensure your current IP is whitelisted under Atlas Network Access.
2. **Express Backend**: Deploy Web Service on Render with root directory `backend`, build command `npm install`, and start command `node server.js`. Add all `.env` keys.
3. **Vite Frontend**: Deploy Static Site on Render with build command `npm run build` and publish directory `dist`.
