# API & Backend Reference

## Stack

Choose one:
- **Python** — FastAPI or Django REST Framework
- **Node.js** — Express or NestJS

Database: **MongoDB**

---

## Environment Variables

Your backend must use environment variables. Do not hardcode secrets or configuration.

Never commit `.env` to git. Use `.env.example` to show what variables are needed.

---

## Authentication

All endpoints except `/auth/register` and `/auth/login` require:

```
Authorization: Bearer <token>
```

The token is a JWT. The `userId` is extracted from the token server-side — never trust a `userId` from the request body or URL params for ownership checks.

### Password Security

Hash all passwords using **bcrypt** or **argon2** before storing. Never store plain text passwords.


---

## Endpoints

### Auth

**POST /auth/register**

Request:
```json
{
  "name": "Arun Kumar",
  "email": "arun@example.com",
  "password": "securepassword"
}
```

Response `201`:
```json
{
  "token": "<jwt>",
  "user": { "id": "...", "name": "Arun Kumar", "email": "arun@example.com" }
}
```

Errors: `400` if email already exists, `422` if validation fails.

---

**POST /auth/login**

Request:
```json
{
  "email": "arun@example.com",
  "password": "securepassword"
}
```

Response `200`:
```json
{
  "token": "<jwt>",
  "user": { "id": "...", "name": "Arun Kumar", "email": "arun@example.com" }
}
```

Errors: `401` if credentials are invalid.

---

### Transactions

**POST /transactions**

Creates a transaction for the authenticated user.

Request:
```json
{
  "type": "expense",
  "category": "Food",
  "amount": 1200,
  "date": "2026-01-10",
  "description": "Lunch with team"
}
```

- `type` must be one of: `income`, `expense`, `investment`, `debt`
- `amount` must be a positive number
- `date` must be a valid ISO date string
- `description` is optional

Response `201`:
```json
{
  "id": "...",
  "type": "expense",
  "category": "Food",
  "amount": 1200,
  "date": "2026-01-10",
  "description": "Lunch with team",
  "createdAt": "2026-03-04T10:00:00Z"
}
```

Errors: `400` if validation fails, `401` if unauthenticated.

---

**GET /transactions**

Returns a paginated list of transactions for the authenticated user.

Query params:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Results per page |
| `type` | string | — | Filter by `income`, `expense`, `investment`, or `debt` |
| `category` | string | — | Filter by category name |

Response `200`:
```json
{
  "data": [
    { "id": "...", "type": "expense", "category": "Food", "amount": 1200, "date": "2026-01-10", "description": "Lunch" }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 143
  }
}
```

---

### Summary

**GET /summary**

Calculates and returns the monthly financial summary for the authenticated user based on the current calendar month.

Response `200`:
```json
{
  "income": 80000,
  "expense": 52000,
  "savings": 28000,
  "savingsRate": 35.0,
  "categories": {
    "Housing": 20000,
    "Food": 12000,
    "Transport": 6000,
    "Entertainment": 4000
  }
}
```

- `savingsRate` = `(savings / income) * 100`, rounded to 1 decimal place
- If `income` is 0, return `savingsRate: 0` — do not divide by zero
- `categories` covers all transaction types, not only expenses

---

### Financial Health Score

**GET /financial-health**

Calculates the authenticated user's financial health score from their transaction history.

Response `200`:
```json
{
  "score": 74,
  "category": "Healthy",
  "breakdown": {
    "emergencyFund": 20,
    "savingsRate": 20,
    "debtRatio": 20,
    "investmentRatio": 14
  },
  "suggestions": [
    "Increase your emergency fund to cover at least 6 months of expenses",
    "Consider increasing your investment contributions"
  ]
}
```

See the **Financial Health Score** section below for the full algorithm.

---

## MongoDB Schema

### `users`

```
_id:          ObjectId
name:         String  (required)
email:        String  (required, unique, indexed)
passwordHash: String  (required)
createdAt:    Date    (default: now)
```

### `transactions`

```
_id:         ObjectId
userId:      ObjectId (required, indexed)
type:        String   (required, enum: ["income", "expense", "investment", "debt"])
category:    String   (required)
amount:      Number   (required, min: 0)
date:        Date     (required)
description: String   (optional)
createdAt:   Date     (default: now)
```

> Index on `{ userId: 1, date: -1 }` — this is the most common query pattern. Without it, lookups across large transaction sets will be slow.

### `goals`

```
_id:           ObjectId
userId:        ObjectId (required, indexed)
goalName:      String   (required)
targetAmount:  Number   (required)
currentAmount: Number   (default: 0)
targetDate:    Date     (required)
createdAt:     Date     (default: now)
```

Goals are optional scope — include if time permits.

---

## Financial Health Score Algorithm

The score ranges from **0 to 100**, split equally across four components (25 points each).

### Component 1 — Emergency Fund (max 25 pts)

```
emergencyFundMonths = totalSavings / monthlyExpenses
```

Where `totalSavings` = cumulative `(income - expense)` across all transactions, and `monthlyExpenses` = average monthly expense over the last 3 months.

| Coverage | Points |
|----------|--------|
| < 1 month | 5 |
| 1–3 months | 10 |
| 3–6 months | 20 |
| > 6 months | 25 |

---

### Component 2 — Savings Rate (max 25 pts)

```
savingsRate = (monthlySavings / monthlyIncome) * 100
```

| Rate | Points |
|------|--------|
| < 10% | 5 |
| 10–20% | 10 |
| 20–40% | 20 |
| > 40% | 25 |

---

### Component 3 — Debt Ratio (max 25 pts)

```
debtRatio = (monthlyDebtPayments / monthlyIncome) * 100
```

Where `monthlyDebtPayments` = sum of transactions with `type: "debt"` in the current month.

| Ratio | Points |
|-------|--------|
| > 50% | 5 |
| 30–50% | 10 |
| 10–30% | 20 |
| < 10% | 25 |

---

### Component 4 — Investment Ratio (max 25 pts)

```
investmentRatio = (monthlyInvestments / monthlyIncome) * 100
```

Where `monthlyInvestments` = sum of transactions with `type: "investment"` in the current month.

| Ratio | Points |
|-------|--------|
| < 5% | 5 |
| 5–15% | 10 |
| 15–30% | 20 |
| > 30% | 25 |

---

### Total Score

```
score = emergencyFund + savingsRate + debtRatio + investmentRatio
```

Maximum = 25 + 25 + 25 + 25 = **100**

### Categories

| Score | Label |
|-------|-------|
| 80–100 | Excellent |
| 60–79 | Healthy |
| 40–59 | Moderate |
| < 40 | At Risk |

### Edge Cases

| Situation | Behaviour |
|-----------|-----------|
| `income = 0` | Savings Rate, Debt Ratio, Investment Ratio all return 0 pts; do not divide by zero |
| No transactions of a type | That component scores the minimum (5 pts) |
| `monthlyExpenses = 0` | Emergency Fund returns maximum (25 pts) — no expenses means infinite coverage |
| Negative amounts | Clamp to 0 before computing ratios |

---

## Design Decisions

Explain your own design decisions in your solution repository's README. Things worth covering:

- **Why you chose Python vs Node.js** — e.g. "chose FastAPI because X" or "chose Express because Y"
- **How you structured the project** — e.g. folder layout, separation of concerns, why you organised it that way
- **How authentication is implemented** — JWT secret storage, token expiry time, refresh tokens?
- **How the health score is computed** — single endpoint fetch on demand, or cached? Why?
- **What you would do differently with more time** — scalability, caching, testing coverage
