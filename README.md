# PRIMEFORM LABS — VMC OPERATOR HMI
## Vertical Machining Center Startup & Operation Workflow Simulation

A production-quality, responsive Human-Machine Interface (HMI) built for VMC machine operators. It enforces a strict, safety-first 6-stage startup and operation workflow with server-validated finite state machine transitions, SQLite/Prisma ORM persistence, dark industrial UX aesthetics, micro-interactions, keyboard accessibility, unit/E2E test suites, and simulation mechanics.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router, React 18, TypeScript Strict Mode)
- **Design System & Styling**: Custom Dark Industrial Tailwind CSS Design System + Lucide Icons + Framer Motion
- **State Management**: Zustand (Local HMI State & Offline Caching)
- **Database & ORM**: Prisma ORM with SQLite File Storage (`prisma/dev.db`)
- **API & Validation**: Next.js Route Handlers + Zod Schema Validation
- **Testing**: Vitest & React Testing Library (Unit) + Playwright (E2E Browser Automation)
- **Authentication**: Lightweight Operator Session & Identification Layer (Enterprise OAuth Ready)

---

## 🚦 Guided Workflow & State Machine Engine

The HMI strictly guides the operator through 6 sequential stages:

```
POWER ON
   ↓
MACHINE CHECKS (6/6 Checks)
   ↓
REQUIRED TOOLS (4/4 Tools)
   ↓
WORKPIECE SETUP (4/4 Steps)
   ↓
READY REVIEW (Readiness Banner)
   ↓
OPERATION (READY → RUNNING → STOPPED)
```

### State Machine Rules (Enforced on Frontend & Server API)
1. **POWER ON → MACHINE CHECKS**: Initialized upon machine bootup.
2. **MACHINE CHECKS → TOOLS**: Requires all 6 machine checks (Power, E-Stop, Door Guard, Alarm, Lube/Coolant, Reference Return) to be confirmed.
3. **TOOLS → WORKPIECE**: Requires all 4 cutting tools (T01 Face Mill, T02 Rough Mill, T03 Finish Mill, T04 Drill) to be seated & confirmed.
4. **WORKPIECE → READY REVIEW**: Requires all workpiece setup steps (Vise mounting, Stock loading, 45 Nm torque, G54 offset) to be verified.
5. **READY REVIEW → OPERATION**: Requires 100% completion across all prerequisite checklists.
6. **OPERATION STATES**:
   - `Start Operation` transitions status `READY` / `STOPPED` → `RUNNING`.
   - `Stop Operation` transitions status `RUNNING` → `STOPPED` while preserving elapsed time & progress.
   - Bypassing stages forward via URL or API is strictly rejected by server-side validation.

---

## 📦 Mock Manufacturing Scenario

- **Part Name**: VMC Housing Plate
- **Part Number**: PF-VM-001
- **Quantity**: 1
- **Operation**: Face Milling + Pocket Machining (`OP-20`)
- **Material**: Aluminium 6061-T6
- **Drawing Revision**: PF-VM-001 Rev B
- **CNC Program**: O1001 Rev 03
- **Work Offset**: G54
- **Fixture**: Precision machine vise, Fixed parallels

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/primeform-labs/vmc-operator-hmi.git
cd vmc-operator-hmi
npm install
```

### 3. Database Migration & Seeding
```bash
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Suite

### Unit & State Machine Tests (Vitest)
```bash
npm run test
```
Executes unit tests validating stage boundary enforcement, prerequisite verification, out-of-order rejection, and state preservation.

### Playwright End-to-End Workflow Test
```bash
npx playwright test
```
Automates the full 6-stage operator journey in headless browser mode.

---

## 🔌 API Reference

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
| `POST` | `/api/workflow/reset` | Resets workflow back to initial boot state |

---

## ⌨️ Operator Keyboard Shortcuts

- `Enter` / `Space`: Confirm currently focused checklist item or start operation
- `Esc` / `S`: Emergency stop active simulation run

---

## 📄 License & Compliance

Developed by Senior HMI & Full-Stack Engineers for Primeform Labs technical assignment. Software simulation mode only.
