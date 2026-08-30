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

### API route not found

```bash
npm run e2e:api-404
```

Submit valid values. Expect **The requested resource was not found.** on the form page with all values
preserved.

### Frontend route not found

```bash
npm run e2e:success
```

Open `http://localhost:3000/invalid`. Expect the application header and footer with `404` and
**Page not found.** Return to `http://localhost:3000/` and confirm the form starts with empty values.

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
