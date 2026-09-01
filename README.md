# PRIMEFORM LABS — VMC OPERATOR HMI
## Vertical Machining Center Startup & Operation Workflow Simulation

[![Live Demo](https://img.shields.io/badge/Live_Demo-https%3A%2F%2Fprimeform.netlify.app%2F-10b981?style=for-the-badge&logo=netlify)](https://primeform.netlify.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub_Repo-PRIMEFORM--LABS-06b6d4?style=for-the-badge&logo=github)](https://github.com/LokeshwarMenati/PRIMEFORM-LABS)

A production-quality, responsive Human-Machine Interface (HMI) built for VMC (Vertical Machining Center) operators. It enforces a strict, safety-first 6-stage startup and operation workflow with server-validated finite state machine transitions, SQLite/Prisma ORM persistence, dark industrial UX aesthetics, micro-interactions, keyboard accessibility, unit/E2E test suites, custom job order generation, and live simulation mechanics.

---

## 🌐 Live Production Application Deployment

- **Live Production Deployment URL**: [https://primeform.netlify.app/](https://primeform.netlify.app/)
- **GitHub Repository**: [https://github.com/LokeshwarMenati/PRIMEFORM-LABS](https://github.com/LokeshwarMenati/PRIMEFORM-LABS)

---

## 📌 About the Project

In industrial precision manufacturing, operating a **10,000 RPM high-speed metal milling CNC machine** without proper safety checks can cause **fatal accidents, broken $500 tools, ruined raw material, or expensive machine crashes**. 

This application simulates the touchscreen console (HMI) attached to a industrial VMC machine. It acts as an **enforced safety gate** that prevents an operator from starting machining operations until **100% of mandatory pre-flight checklists are physically verified and confirmed**.

### Key Features Implemented:
1. **Dedicated Operator Login Screen**: Operator identification & session sign-in / sign-out.
2. **6-Stage Guided Workflow**: Sequential progression with stage-locking rules.
3. **Preloaded & Custom Job Order Inputs**: Load default scenarios or create custom part inputs (e.g. Titanium Turbine Flange).
4. **Interactive Demo Guide**: One-click automated workflow demonstration for recruiters & reviewers.
5. **Real-Time Simulation Engine**: Live feed clock, percentage progress (0-100%), phase detection (Facing → Roughing → Finishing → Drilling), emergency stop, state preservation, and reset.
6. **Full-Stack Persistence**: SQLite database backed by Prisma ORM; refreshing the browser preserves progress and audit history.

---

## 🎯 Purpose & Industrial Use Case

| Real-World Problem | HMI Software Solution |
| :--- | :--- |
| **Accidental Spindle Start** | Machining operation is locked until 14 mandatory safety, tooling, and setup checks are 100% complete. |
| **Unverified Tool Loading** | Every tool (Face Mill, End Mill, Drill) must be explicitly verified against CNC program specifications before loading. |
| **Workpiece Misalignment** | Workholding vise seating, 45 Nm torque clamping, and G54 zero offset must be verified before cutting. |
| **Audit & Quality Tracking** | Every confirmation action logs a permanent audit entry (`Confirmed by Demo Operator at HH:MM:SS`) in the database. |

---

## 💻 Skills & Technologies Used

| Skill / Domain | Technology Stack | Implementation Details |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14+ (App Router), React 18 | SSR, React Server Components, Client Components |
| **Type Safety** | TypeScript Strict Mode | Zero implicit `any`, 100% type-checked domain schemas |
| **State Management** | Zustand | Global HMI state, client caching, modal management |
| **Database & ORM** | Prisma ORM + SQLite (`prisma/dev.db`) | Relational schema, migrations, data seeding |
| **API Architecture** | Next.js Route Handlers + Zod | RESTful endpoints with strict payload validation |
| **State Machine Engine** | Pure TypeScript (`WorkflowStateMachine`) | Enforces stage rules, blocks out-of-order jumps |
| **Industrial UI/UX Design** | Custom Dark Tailwind CSS System | High-contrast dark theme, glow accents, responsive grid |
| **Animations & Icons** | Framer Motion + Lucide Icons | Microinteractions, active stage pulses, toast feedback |
| **Unit Testing** | Vitest & React Testing Library | 11/11 unit tests covering state machine rules |
| **E2E Automation** | Playwright Browser Automation | End-to-end browser test simulating full 6-stage flow |

---

## 📖 Step-by-Step Execution Guide

### Step 1: Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**

### Step 2: Clone the Repository
```bash
git clone https://github.com/LokeshwarMenati/PRIMEFORM-LABS.git
cd PRIMEFORM-LABS
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Setup & Seed Database
Initialize the SQLite database and seed the mock manufacturing scenario:
```bash
npx prisma db push
npx prisma db seed
```

### Step 5: Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🕹 How to Use the Application (User Guide)

### 1. Signing In & Viewing the Overview
- Upon visiting `http://localhost:3000`, click **`ONE-CLICK SIGN IN AS DEMO OPERATOR`** on the Login Screen.
- Review the loaded job order: **VMC Housing Plate (`PF-VM-001`)**, Material: **Aluminium 6061-T6**, CNC Program: **`O1001 Rev 03`**, Work Offset: **`G54`**.

### 2. Executing the 6-Stage Workflow
1. Click **`BEGIN MACHINE CHECKS`** to move to Stage 02.
2. Confirm each of the 6 safety checks (`CHK-01` through `CHK-06`). Notice progress bar update to `6 / 6 COMPLETE`.
3. Click **`NEXT: REQUIRED TOOLS`** to move to Stage 03. Confirm tools `T01` to `T04`.
4. Click **`NEXT: WORKPIECE SETUP`** to move to Stage 04. Confirm setup steps 1 to 4.
5. Click **`NEXT: READY REVIEW`** to view the green readiness verification banner.
6. Click **`PROCEED TO OPERATION`** to enter Stage 06.
7. Click **`START OPERATION`** to launch live machining simulation. Watch progress advance through Facing, Roughing, Finishing, and Drilling.
8. Click **`STOP OPERATION`** to test state preservation.

### 3. Loading a Custom Job Order (Input Generator)
- Click **`+ New Job Input`** in the top header.
- Type custom job details (e.g. Part Name: `Titanium Turbine Flange`, Program: `O2002`, Offset: `G55`) or select a preset.
- Click **`SUBMIT & LOAD CUSTOM HMI JOB`**. The system updates the database and regenerates the HMI workflow for your custom input!

### 4. Running the Recruiter Automated Walkthrough
- Click **`How It Works`** in the top header.
- Click **`RUN AUTOMATED WORKFLOW DEMO`** to watch the system automatically execute the entire 6-stage workflow.

---

## 🧪 Testing Suite Instructions

### Run Unit Tests (Vitest)
```bash
npm run test
```
Executes unit tests validating stage boundary enforcement, prerequisite verification, out-of-order rejection, and state preservation.

### Run End-to-End Browser Tests (Playwright)
```bash
npx playwright test
```
Automates the full 6-stage operator journey in headless browser mode.

---

## 🔌 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Database ping & system diagnostics |
| `GET` | `/api/scenario` | Retrieves active part & CNC scenario specs |
| `GET` | `/api/workflow` | Fetches full HMI state with checks & progress |
| `POST` | `/api/machine-checks/[id]/confirm` | Confirms a safety check item |
| `POST` | `/api/tools/[id]/confirm` | Confirms a cutting tool insertion |
| `POST` | `/api/workpiece/confirm` | Confirms a workpiece setup step |
| `POST` | `/api/workflow/next` | Validates & transitions to target stage |
| `POST` | `/api/operation/start` | Starts machining simulation cycle |
| `POST` | `/api/operation/stop` | Stops simulation cycle (preserves state) |
| `POST` | `/api/scenario/custom` | Submits custom part inputs & regenerates workflow |
| `POST` | `/api/workflow/reset` | Resets workflow back to initial boot state |

---

## ⌨️ Operator Keyboard Shortcuts

- `Enter` / `Space`: Confirm currently focused checklist item or start operation
- `Esc` / `S`: Emergency stop active simulation run

---

## 📄 License & Compliance

Developed for Primeform Labs VMC Operator HMI technical assignment. Software simulation mode only.
