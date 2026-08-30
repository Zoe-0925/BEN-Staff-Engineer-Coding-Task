# Commission Quote App

Status: MVP implemented and verified.

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
- [OpenAPI contract](code/backend/openapi.yaml)
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

## Run locally on macOS

### Prerequisites

- Git.
- Node.js 24.x. npm is included with Node.js.

No Docker, database, or global npm package is required.

Confirm the installed versions:

```bash
git --version
node --version
npm --version
```

`node --version` must report `v24`. If Node.js is not installed, install the macOS Node.js 24 package from [nodejs.org](https://nodejs.org/en/download/archive/v24).

### Install and run

From the repository root:

```bash
cp code/frontend/.env.example code/frontend/.env
cp code/backend/.env.example code/backend/.env

cd code
npm ci
npm --prefix frontend ci
npm --prefix backend ci

npm run dev
```

Open `http://localhost:3000` in a browser.

- UI: `http://localhost:3000`
- API: `http://localhost:8090`
- API endpoint: `POST http://localhost:8090/api/commission-quotes`

Press `Control+C` in Terminal to stop both applications.

The example frontend and backend API keys already match. Real `.env` files remain Git-ignored.

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
cd code/backend
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
