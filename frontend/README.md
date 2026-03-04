# Frontend Reference

## Stack

**Preferred:** Flutter (web or mobile target)

Alternative (if you are not familiar with Flutter):
- React (Vite or Create React App)
- Next.js

Flutter is the production stack at FinFresh. If you choose Flutter, target either web or mobile — both are fine. If you choose React or Next.js, the functional requirements are identical.

UI polish is not evaluated. Focus on correct functionality, clean structure, and reliable error handling.

---

## For Flutter Developers

If you choose Flutter, follow this guidance:

### Project Structure

Organize your code by feature/layer:

```
lib/
  screens/           ← Login, Dashboard, Transactions
  widgets/           ← Reusable UI components (SummaryCard, HealthScoreCard, etc.)
  services/          ← api_service.dart, auth_service.dart
  models/            ← User, Transaction, Summary, HealthScore data classes
  utils/             ← Constants (API base URL from .env), formatters, validators
```

### Environment & Configuration

- Load API base URL from `.env` using `flutter_dotenv` package
- Store JWT tokens securely using `flutter_secure_storage`, not SharedPreferences
- Implement a dedicated `auth_service.dart` that centralises token retrieval and attachment to all HTTP requests

### State Management

Pick one approach and use it consistently:
- **Provider** — straightforward for this scope
- **Riverpod** — if you prefer result types and immutability
- **BLoC** — if you want strict separation of state and UI logic

Whichever you choose, manage auth state globally so token expiry triggers redirect to login.

### HTTP Client & API Layer

- Use `dio` for HTTP requests (or `http` if you prefer simplicity)
- Centralise all API calls in `services/api_service.dart`
- Implement request/response interceptors to attach JWT headers and handle errors

### Required Packages

At minimum, you'll need:
- `dio` or `http` — HTTP client
- `flutter_secure_storage` — JWT storage
- `flutter_dotenv` — environment config
- A state management package (provider / riverpod / bloc)

### Screens & Error Handling

Implement the same three screens and state handling (loading/error/empty) as specified in the **Screens** section below. FutureBuilder or your state manager's equivalent should handle async data fetching.

---

## For React / Next.js Developers

If you choose React or Next.js, the functional requirements are identical to the Flutter version above. Refer to the **Screens** section below.

---

## Screens

### Screen 1 — Login / Register

The entry point of the application. The user must authenticate before accessing any other screen.

**Requirements:**
- Email and password input fields
- Toggle between Login and Register modes (single page, no separate route required)
- On success: store the JWT from the API response, redirect to the Dashboard
- On failure: display the error message returned by the API inline (not as a browser alert)
- Disable the submit button while the request is in flight

**Edge cases:**
- Invalid email format should be caught client-side before submission
- If the token expires mid-session, the user should be redirected back to login rather than seeing a broken UI

---

### Screen 2 — Dashboard

The main screen. Displays the user's financial overview fetched from the API.

**Summary cards** — fetch from `GET /summary`:

| Metric | Example |
|--------|---------|
| Monthly Income | ₹80,000 |
| Monthly Expenses | ₹52,000 |
| Savings | ₹28,000 |
| Savings Rate | 35% |

**Financial Health Score** — fetch from `GET /financial-health`:
- Display the numeric score (0–100)
- Display the category label: Excellent / Healthy / Moderate / At Risk
- Display suggestions as a list

**Category Breakdown** — derived from `GET /summary` response:
- List each category and its total expenditure
- Example: Housing ₹20,000 · Food ₹12,000 · Transport ₹6,000

**States the dashboard must handle:**

| State | Expected behaviour |
|-------|--------------------|
| Loading | Show a loading indicator while API calls are in flight |
| API failure | Show a clear error message; do not show broken/empty cards |
| No transactions | Show an empty state message, e.g. "No transactions found for this month" |
| Zero income | Savings Rate should display 0%, not NaN or Infinity |

**Data consistency:** API responses may return numbers as strings (e.g. `"80000"` instead of `80000`) or nulls. The dashboard must handle this safely — numbers stored as strings must be parsed, and null values must default to 0 without crashing calculations or the UI.

---

### Screen 3 — Transactions

A paginated or scrollable list of the user's transactions, fetched from `GET /transactions`.

**Each row must show:** date, type (badge or label), category, amount

**Requirements:**
- Handle loading and error states the same as the Dashboard
- Show an empty state if no transactions exist
- Pagination or infinite scroll — the list must not break or freeze with large datasets

**Optional (not required):**
- Filter by `type` or `category`
- Add a new transaction form (POST /transactions)

---

## Component Structure

**Flutter developers:** Refer to the Flutter-specific guidance above. Your structure should follow Dart conventions with `screens/`, `widgets/`, and `services/` folders.

**React / Next.js developers:** Use clean component separation:

```
src/
  components/
    SummaryCard.jsx
    HealthScoreCard.jsx
    CategoryBreakdown.jsx
    TransactionList.jsx
    LoadingState.jsx
    ErrorState.jsx
    EmptyState.jsx
  pages/
    Login.jsx
    Dashboard.jsx
    Transactions.jsx
  services/
    api.js          ← all fetch/axios calls in one place
  utils/
    formatCurrency.js
    parseNumber.js  ← safe string-to-number conversion
```

Keeping all API calls in a single `services/api.js` file makes it straightforward to see every network call in one place and to handle auth headers consistently.

---

## API Integration

Base URL should come from an environment variable, not a hardcoded string:

**Flutter**: Use `flutter_dotenv` as shown above (`.env` file with `API_BASE_URL`)

**React / Next.js**: 
- `VITE_API_URL` (for Vite) or `NEXT_PUBLIC_API_URL` (for Next.js)
- Export from a single `api.js` service file

Attach the JWT to every authenticated request:

```
Authorization: Bearer <token>
```

The three primary calls for the dashboard:

```
GET /summary
GET /financial-health
GET /transactions?page=1&limit=20
```

---

## Optional Bonus

These are not required and will not penalise you if absent:

- Chart visualisation using Recharts or Chart.js (spending breakdown, income vs expense bar)
- Date range filter on the Transactions screen
- Responsive layout for mobile

---

## What We Evaluate

- All three states handled: loading, error, empty
- Numbers never crash the UI regardless of format (string, null, missing)
- Clean component boundaries — one component does one thing
- API calls centralised, not scattered across components
- Readable code with consistent naming

Explain your frontend architecture decisions in your solution repository's README.
