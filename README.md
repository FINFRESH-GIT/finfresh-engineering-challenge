# FinFresh Engineering Challenge

**Role:** Full Stack Engineer  
**Experience:** 2+ Years  
**Location:** Hybrid – IIT Madras Research Park  
**Time Limit:** 8–10 Hours  

---

## About FinFresh

FinFresh (often branded as FinFresh Wealth Creations) is an IIT Madras–incubated fintech startup focused on improving financial wellness for India's salaried population using a behavior-first approach. It positions itself as a "habitual finance management" platform that combines behavioral science + AI-style nudges to help users build better money habits (saving/spending), while also offering practical personal-finance workflows like budgeting, goal-based planning, investing, and tax optimization.

This challenge will have you build a core component of that vision: a personal finance dashboard where users can track their money and understand their financial health.

---

## What You Are Building

A **Personal Finance Tracker** — a 3-tier application:

```
Flutter (Web / Mobile)  →  REST API (Python or Node.js)  →  MongoDB
```

Users can register, log in, record income and expense transactions, and view a financial dashboard that summarises their spending and calculates a financial health score.

---

## Allowed Stack

| Tier | Options |
|------|---------|
| Frontend | **Flutter** (preferred) or React / Next.js |
| Backend | Python (FastAPI / Django) OR Node.js (Express / NestJS) |
| Database | MongoDB |

Flutter is the primary stack at FinFresh — we strongly prefer it for the frontend. If you are not familiar with Flutter, React or Next.js is acceptable, but Flutter submissions will be weighted more favourably.

Stick to one backend language. Pick whatever you are most productive in.

---

## Use of AI Tools

**You are expected to use AI tools.** ChatGPT, Claude, GitHub Copilot — use whatever helps you move faster. This is not a memory test.

What we are evaluating is your **engineering judgment**: whether you understand what the AI generated, whether it actually works, and whether you made deliberate decisions about structure and trade-offs. Copy-pasting AI output that does not work, or structures that make no sense for the problem, will be obvious in review.

---

## Repository Structure

```
api/
  README.md     ← endpoints, MongoDB schema, financial health score algorithm
frontend/
  README.md     ← screens, component structure, functional requirements
README.md       ← this file
```

Read `api/README.md` and `frontend/README.md` before starting. They contain the full specification.

---

## Commit History

Commit your work in **multiple commits** showing progression. Repositories with a single commit will be screened out — a single commit tells us nothing about how you actually work.

Suggested structure (adapt as needed):

```
commit 1 – project setup, folder structure, environment config
commit 2 – auth endpoints (register + login) and JWT middleware
commit 3 – transaction and summary APIs
commit 4 – financial health score implementation
commit 5 – frontend: dashboard and auth screens
commit 6 – frontend: transactions screen, error and loading states
```

Commit messages should be descriptive. "fix stuff" is not useful.

---

## Evaluation Criteria

| Area | What we look for |
|------|-----------------|
| **Git history** | Multiple meaningful commits showing development progression |
| **Architecture decisions** | Your solution README explains *why* choices were made, not just what was built |
| **API correctness** | Endpoints match the spec, correct HTTP status codes, auth enforced on protected routes |
| **MongoDB schema** | Correct types, indexes where appropriate, structure makes sense for financial data |
| **Financial health score** | Formula implemented correctly, no divide-by-zero, edge cases handled |
| **Frontend reliability** | Loading, error, and empty states all handled; numeric values never crash the UI |
| **Code quality** | Readable, consistent naming, concerns are separated, no dead code |
| **Scope judgment** | Did you prioritize core features (auth, transactions, score) over nice-to-haves? Shipping a complete dashboard is worth more than a polished but incomplete feature set. |

We do **not** evaluate:
- UI visual design or polish
- Pixel-perfect layouts
- Whether you used AI tools

---

## Your Solution README

Your submitted repository must include a README that covers:

1. How to run the project locally (setup steps, environment variables)
2. Why you chose your backend framework and how the project is structured
3. How auth is implemented (JWT strategy, token expiry)
4. How the financial health score is calculated and any design decisions you made
5. What you would do differently or improve with more time

This is where we see your thinking. A missing or shallow README is a significant negative signal.

---

## Submission

Share a **GitHub repository link** with your solution.

Ensure the repository is public or that access has been granted before submitting.

---

FinFresh Team
