# Commission Quote App

Status: specification complete; implementation pending.

## Overview

This four-hour take-home project lets a staff user enter loan details and generate a commission quote through a Mock Commission Quote API.

The MVP contains:

- One React + TypeScript UI.
- One Node.js + Express + TypeScript REST API.
- API-key authentication through the `api-key` request header.
- Client and API validation.
- Loading, success, validation, authentication, timeout, service-unavailable, not-found, and unexpected-error states.
- Focused automated tests for core behaviour.

## Source-of-truth artifacts

Implementation must follow these reviewed artifacts:

- [Requirements](docs/requirements-analysis.md)
- [Functional Spec](docs/functional-spec.md)
- [Technical Spec](docs/technical-spec.md)
- [Code Quality Instructions](docs/code-quality-instructions.md)
- [Implementation Plan](docs/implementation-plan.md)
- [OpenAPI contract](backend/openapi.yaml)
- [Decision Log](docs/decision-log.md)
- [Evaluation Signals](docs/evaluation-signals.md)
- [Success UI mockup](docs/commission-quote-layout.html)
- [UI state mockups](docs/commission-quote-state-layouts.html)

If code and an artifact disagree, stop and update the artifact before changing the implementation.

Implementation is reviewed one ticket at a time. The AI must complete only the ticket selected by the candidate and stop before starting the next ticket.

## Architecture

```text
Browser UI
  → POST /api/commission-quotes
  → Mock Commission Quote API
  → authenticate
  → validate
  → calculate
  → return quote or error
```

The UI and API are stateless. Form state remains in the browser, and the API does not persist quotes or sessions.

## Local environment

Prerequisite: Node.js 22 or later and npm.

The committed examples will contain:

```text
frontend/.env.example
VITE_COMMISSION_QUOTE_API_KEY=local-demo-key
VITE_COMMISSION_QUOTE_API_BASE_URL=http://localhost:5000
```

```text
backend/.env.example
PORT=5000
COMMISSION_QUOTE_API_KEY=local-demo-key
MOCK_API_ERROR_CODE=
```

Copy each `.env.example` to `.env` before running the application. The frontend and backend API-key values must match.

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Real `.env` files must remain Git-ignored. The browser-visible key is an accepted demo limitation; a production Vendor key would remain behind a BFF or API gateway.

## Run locally

Install dependencies from the project root:

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
```

Then run both applications:

```bash
npm run dev
```

Run only one application when required:

```bash
npm run dev:ui
npm run dev:api
```

- UI: `http://localhost:3000`
- API: `http://localhost:5000`
- Postman: `POST http://localhost:5000/api/commission-quotes`

Code-quality commands from the project root:

```bash
npm run format:check
npm --prefix frontend run typecheck
npm --prefix frontend run lint
npm --prefix backend run lint
```

## Reproduce API errors

Normal operation:

```text
MOCK_API_ERROR_CODE=
```

Unexpected API error:

```text
MOCK_API_ERROR_CODE=500
```

Service unavailable:

```text
MOCK_API_ERROR_CODE=503
```

Restart the backend after changing its `.env`, then submit a valid quote from the UI.

To reproduce `401`, use a missing or mismatched frontend API key. Do not add UI test controls, query parameters, or test-only endpoints.

## Test-driven development

The confirmed main flow follows red-green-refactor:

1. Add one focused test for the next confirmed behaviour.
2. Run it and confirm it fails for the expected reason.
3. Add the minimum implementation required to pass.
4. Run the relevant test again.
5. Refactor without changing behaviour, then run the suite.

Do not generate the main-flow implementation before its tests. Only draft tests in the test files already listed in the Technical Spec. Do not expand this four-hour task into a complete error-scenario test matrix.

Main-flow test order:

1. Commission calculation and currency rounding.
2. Successful REST request with a valid API key and valid payload.

Use Jest only. Backend tests are plain JavaScript and run against the compiled backend output. Do not install a TypeScript Jest transformer, React test library, DOM test environment, HTTP test library, or API mocking library.

Frontend UI behaviour is verified manually against the approved mockups and successful main flow.

Backend test command:

```bash
cd backend
npm test
```

The backend contains `commissionQuoteService.test.js` and `createCommissionQuoteRoute.test.js` for the confirmed main flow.

## Confirmed MVP limitations

- No staff login or OIDC.
- No database, quote history, or server-side session.
- No real Kong, BFF, Vendor API, or production secret manager.
- No Redux or persisted form state.
- No additional business pages or multi-step flow.
- Frontend logs remain in the browser console for this MVP.

## AI usage

AI is used to draft reviewed specifications and mockups, scaffold tests and code, and identify edge cases. Requirements, contracts, assumptions, architecture, and generated implementation are owned by the candidate. AI-generated code must follow the approved artifacts and must be understood before submission.
