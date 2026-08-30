# Commission Quote App

Status: MVP implemented and verified.

## Overview

This four-hour take-home project lets a staff user enter loan details and generate a commission quote through a Mock Commission Quote API.

## Technology stack

### Frontend

- React 19 and TypeScript 6.
- Vite 8 for local development and production builds.
- React Router 7 for application routing.
- Styled Components 6 for component-scoped styling and shared theme tokens.
- Axios for API requests and `loglevel` for structured browser logging.

### Backend

- Node.js 24, Express 5, and TypeScript 6.
- Zod for request schema validation.
- Pino and `pino-http` for structured request logging and correlation IDs.
- Jest 30 for focused service and endpoint tests.

### Tooling

- npm lockfiles and clean `npm ci` installation for the root, frontend, and backend workspaces.
- ESLint with zero-warning enforcement.
- Prettier for deterministic formatting.

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

## SDLC and delivery artifacts

This repository was developed incrementally through an SDLC-style workflow: requirements analysis,
functional and API design, technical design, implementation planning, ticket-by-ticket delivery, and
final verification.

To keep the implementation fully aligned with the reviewed requirements—and to reduce the risk of
AI-generated assumptions or hallucinations—each decision, contract, design boundary, and review
checkpoint was recorded as a version-controlled artifact. Implementation proceeded one reviewed
ticket at a time, creating a traceable path from the original requirements to the final code and
verification evidence.

The project artifacts are available directly in this GitHub repository:

- [Requirements analysis](./docs/requirements-analysis.md)
- [Functional Spec](./docs/functional-spec.md)
- [Technical Spec](./docs/technical-spec.md)
- [Code Quality Instructions](./docs/code-quality-instructions.md)
- [Implementation Plan](./docs/implementation-plan.md)
- [OpenAPI contract](./code/backend/openapi.yaml)
- [Decision Log](./docs/decision-log.md)
- [Evaluation Signals](./docs/evaluation-signals.md)
- [Success UI mockup](./docs/commission-quote-layout.html)
- [UI state mockups](./docs/commission-quote-state-layouts.html)

## Key engineering decisions

- **Exact currency calculations:** loan amounts are converted to integer AUD cents before commission
  calculations to avoid floating-point errors.
- **Config-driven form:** reviewed JSON flows through `ConfigProvider` and `useConfig`, allowing the
  form to render approved metadata without duplicating field definitions in the Page.
- **Layered validation:** the UI provides immediate feedback, while the API independently validates
  the DTO and business rules as the authoritative boundary.
- **Centralised request errors:** one reusable error mapper converts Axios failures into explicit UI
  request states, keeping the Page orchestration readable.
- **End-to-end correlation:** the same correlation ID connects frontend logs, HTTP headers, backend
  request logs, and safe system-error UI.
- **Local state by design:** form and request state remain route-local because this single-page MVP
  does not require Redux or persisted client state.
- **Explicit demo security boundary:** the browser-visible API key is accepted only for the local
  Mock API; a production Vendor key would remain behind a BFF or API gateway.

## Run locally on macOS

Local setup has been verified on macOS. Windows and Linux setup instructions are planned as a future enhancement.

### Prerequisites

- Homebrew.
- Git.
- Node.js 24.x. npm is included with Node.js.

No Docker, database, or global npm package is required.

Confirm the installed versions:

```bash
git --version
node --version
npm --version
```

`node --version` must report `v24`. On macOS, install and activate Node.js 24 through NVM:

```bash
brew install nvm
mkdir -p "$HOME/.nvm"
```

Add these commands to the active shell profile: `~/.bash_profile` for Bash or `~/.zshrc` for Zsh.

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix nvm)/nvm.sh" ] && \. "$(brew --prefix nvm)/nvm.sh"
```

Reload the profile for the active shell:

```bash
# Bash
source "$HOME/.bash_profile"

# Zsh
source "$HOME/.zshrc"
```

Then install and activate Node.js and npm:

```bash
nvm install 24
nvm use 24
nvm install-latest-npm
nvm alias default 24
node --version
npm --version
```

The final `node --version` output must start with `v24`, and `npm --version` must print a version.
Node installed through NVM includes npm; `nvm install-latest-npm` installs the latest npm version
supported by the active Node.js 24 release. If a new Terminal reports `npm: command not found`, run
the matching profile reload command followed by `nvm use 24` before retrying.

### Install and run

From the repository root:

```bash
cd code
npm ci
npm --prefix frontend ci
npm --prefix backend ci

npm run e2e:success
```

Open `http://localhost:3000` in a browser.

- UI: `http://localhost:3000`
- API: `http://localhost:8090`
- API endpoint: `POST http://localhost:8090/api/commission-quotes`

Press `Control+C` in Terminal to stop both applications.

The committed E2E environment uses a mock API key and starts the complete UI and API without Docker
or a local `.env`. The `.env.example` files remain as configuration references, and real `.env` files
remain Git-ignored.

## Manual E2E verification

Run every command in this section from `code/`. Stop the current scenario with `Control+C` before
starting another one. Each command starts the same application with a committed environment from
`code/e2e/environments/`; there are no UI test controls or test-only API routes.

Use these valid form values unless a scenario says otherwise:

- Loan amount: `500000`
- Loan term: `360`
- Risk band: `Low`

### Successful quote

```bash
npm run e2e:success
```

Submit the valid values. Expect commission rate `0.1%`, upfront commission `$500.00`, monthly trail
commission `$41.67`, and total commission `$15,501.20`.

### Client validation

```bash
npm run e2e:success
```

Submit the empty form. Expect the required message under every field. Then enter `0` for loan amount
or `361` for loan term and expect the configured validation messages.

### API validation

Start `npm run e2e:success`, then run this command in a second Terminal:

```bash
curl -i -X POST http://localhost:8090/api/commission-quotes -H 'Content-Type: application/json' -H 'api-key: local-demo-key' -H 'x-correlation-id: 550e8400-e29b-41d4-a716-446655440001' -d '{"loanAmount":0,"loanTermInMonths":361,"riskBand":"LOW"}'
```

Expect HTTP `400`, `VALIDATION_ERROR`, and field errors for `loanAmount` and `loanTermInMonths`.

### Authentication error

```bash
npm run e2e:auth-error
```

Submit valid values. Expect the authentication message on the form page with all values preserved.

### Request timeout

```bash
npm run e2e:timeout
```

Submit valid values. This environment configures the normal Axios client with a `1ms` timeout.
Expect the loading state followed by **We couldn't generate the quote. Please try again later.** The
form values remain available for retry.

### Unexpected API error

```bash
npm run e2e:api-500
```

Submit valid values. Expect the system error page with a safe message and correlation ID. The same
correlation ID appears in the frontend and backend logs.

### Service unavailable

```bash
npm run e2e:api-503
```

Submit valid values. Expect **The quote service is temporarily unavailable. Please try again later.**
on the form page with all values preserved.

### Frontend route not found

```bash
npm run e2e:success
```

Open `http://localhost:3000/invalid`. Expect the application header and footer with `404` and
**Page not found.** Click the header logo and confirm the app returns to `/` with an empty form. The
same logo action clears form, request, error, and result state when used from the quote page.

### Missing form configuration

```bash
npm run e2e:missing-config
```

Open `http://localhost:3000/`. Expect the system error page with a safe message and correlation ID.
The browser log contains `CONFIG_NOT_FOUND`; the internal configuration detail is not displayed.

### Direct successful API request

Start `npm run e2e:success`, then run this command in a second Terminal:

```bash
curl -i -X POST http://localhost:8090/api/commission-quotes -H 'Content-Type: application/json' -H 'api-key: local-demo-key' -H 'x-correlation-id: 550e8400-e29b-41d4-a716-446655440001' -d '{"loanAmount":500000,"loanTermInMonths":360,"riskBand":"LOW"}'
```

Expect HTTP `200`, the quote DTO, and response header
`x-correlation-id: 550e8400-e29b-41d4-a716-446655440001`. The backend request log contains the same
value.

## Testing and quality gates

The main flow was developed with a focused red-green-refactor cycle. Automated coverage verifies the
commission calculation, currency rounding, successful authenticated endpoint request, response DTO,
and correlation header. The error-state matrix is verified through the committed manual E2E
environments documented above.

Run all quality gates from `code/`:

```bash
npm run format:check
npm --prefix frontend run typecheck
npm --prefix frontend run lint
npm --prefix frontend run build
npm --prefix backend run lint
npm --prefix backend run build
npm --prefix backend test
```

The backend Jest suite contains:

- `commissionQuoteService.test.js` for calculation and currency rounding.
- `createCommissionQuoteRoute.test.js` for the successful authenticated HTTP contract and correlation
  header.

Frontend behaviour is verified manually against the approved mockups and the committed E2E
environments. Final verification completed with zero formatting or lint warnings, successful
frontend and backend builds, and `2` passing Jest test suites containing `2` passing tests.

## Confirmed MVP limitations

- No staff login or OIDC.
- No database, quote history, or server-side session.
- No real Kong, BFF, Vendor API, or production secret manager.
- No Redux or persisted form state.
- No additional business pages or multi-step flow.
- Frontend logs remain in the browser console for this MVP.

## AI usage

AI is used to draft reviewed specifications and mockups, scaffold tests and code, and identify edge cases. Requirements, contracts, assumptions, architecture, and generated implementation are owned by the candidate. AI-generated code must follow the approved artifacts and must be understood before submission.
