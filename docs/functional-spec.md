# Commission Quote App - Functional Spec

Status: Ready for implementation

## Scope

- One React + TypeScript browser UI.
- One Node.js + Express + TypeScript REST API that acts as the Mock Commission Quote API.
- API-key authentication is modelled on Kong Key Auth's client-visible behaviour.
- Staff login, OIDC, and user authorisation are outside the MVP scope.
- Client request timeout: 60 seconds.

## User flow

### Generate a quote

- **Overall:** Staff enters loan details and receives either a commission quote or an actionable error.
  - **Frontend:** Validate input, submit the request, show progress, then show the quote or error.
  - **API:** Authenticate, validate, calculate, and return the quote; reject invalid requests and simulate service failure.

## Business rules

- `LOW`: 0.1% (`0.001`).
- `MEDIUM`: 0.2% (`0.002`).
- `HIGH`: 0.3% (`0.003`).

- The quote assumes the loan balance remains unchanged for the full term.
- The same `commissionRate` is used for upfront and annual trail commission.
- Commission amounts are calculated as integer AUD cents and returned as JSON numbers.
- `quoteId` is a UUID generated for every successful quote.

## Input and validation

### `loanAmount`

- Field name: `loanAmount`.
- UI label: **Loan amount**.
- Type: number representing an AUD amount.
- Calculation representation: integer cents.
- Required: yes.
- Range: greater than `0` and no more than `10,000,000.00`.
- Decimal places: maximum 2.
- Missing: `Please enter the loan amount.`
- Invalid, including an out-of-range value or more than two decimal places: `Please enter a valid loan amount.`

### `loanTermInMonths`

- Field name: `loanTermInMonths`.
- UI label: **Loan term**.
- Type: integer.
- Required: yes.
- Range: `1–360`.
- Missing: `Please enter the loan term in months.`
- Invalid, including a non-integer or out-of-range value: `The loan term must be between 1 and 360 months.`

### `riskBand`

- Field name: `riskBand`.
- UI label: **Risk band**.
- Type: enum string.
- Required: yes.
- Accepted values: `LOW`, `MEDIUM`, `HIGH`.
- Missing: `Please select a risk band.`
- The frontend Select exposes only the three accepted values and performs required validation only.
- An invalid enum value sent directly to the API returns: `Please select a valid risk band.`

- Frontend validation provides immediate feedback and prevents an invalid form submission.
- API validation remains authoritative and independently enforces the request DTO and enum contract.

## Data contract

### Request DTO: React to Express

```text
loanAmount: number, required, 0.01–10,000,000.00, maximum 2 decimal places
loanTermInMonths: integer, required, 1–360
riskBand: enum string, required, "LOW" | "MEDIUM" | "HIGH"
```

### Express calculation model

```text
loanAmountCents: integer representing AUD cents
loanTermInMonths: integer
commissionRate: 0.001 | 0.002 | 0.003
```

- Express validates `loanAmount` before converting it to integer cents.
- Example: `500000.00` AUD becomes `50000000` cents for calculation, then is converted back to an AUD number for the response.
- Integer cents avoid JavaScript floating-point precision errors when calculating currency.

### Calculation

```text
upfrontCommissionCents = round(loanAmountCents × commissionRate)
monthlyTrailCommissionCents = round(upfrontCommissionCents ÷ 12)
totalCommissionCents = upfrontCommissionCents + (monthlyTrailCommissionCents × loanTermInMonths)
```

### Success DTO: Express to React

```text
quoteId: UUID string
commissionRate: number returned by the API as a decimal value
upfrontCommission: number in AUD, rounded to 2 decimal places
monthlyTrailCommission: number in AUD, rounded to 2 decimal places
totalCommission: number in AUD, rounded to 2 decimal places
```

- The API owns the valid commission-rate values. The frontend formats the returned number and does not duplicate the API's current rate set.

### Error DTO: Express to React

```text
error.code: "VALIDATION_ERROR" | "UNAUTHORIZED" | "NOT_FOUND" | "INTERNAL_ERROR" | "SERVICE_UNAVAILABLE"
error.message: string
error.fieldErrors: optional object keyed by loanAmount, loanTermInMonths, or riskBand
```

## REST API contract

### Generate quote

```http
POST /api/commission-quotes
Content-Type: application/json
api-key: <key>
```

Request:

```json
{
  "loanAmount": 500000.00,
  "loanTermInMonths": 360,
  "riskBand": "LOW"
}
```

Success: `200 OK`

```json
{
  "quoteId": "550e8400-e29b-41d4-a716-446655440000",
  "commissionRate": 0.001,
  "upfrontCommission": 500.00,
  "monthlyTrailCommission": 41.67,
  "totalCommission": 15501.20
}
```

Error envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Check the loan details and try again.",
    "fieldErrors": {
      "loanAmount": "Please enter a valid loan amount."
    }
  }
}
```

`fieldErrors` is included only for validation errors.

## Authentication

- The frontend reads the demo key from `VITE_COMMISSION_QUOTE_API_KEY` and adds it automatically; there is no API-key field in the UI.
- The Mock API reads the expected key from `COMMISSION_QUOTE_API_KEY`.
- The API reads only the `api-key` request header.
- Missing and invalid keys both return `401 Unauthorized`.
- Expired, rotated, or misconfigured keys are represented as an invalid key and use the same `401`; do not add a separate UI state or error code.
- Authentication runs before request validation and quote calculation.
- Failed authentication never reaches quote calculation.

This reproduces the behaviour relevant to the challenge; it does not require Kong itself.

## HTTP and UI error mapping

### Validation failure

- Condition: malformed JSON or invalid field.
- API: `400 Bad Request`, code `VALIDATION_ERROR`.
- UI: show the returned `error.message` and inline `fieldErrors`; preserve input.

### Authentication failure

- Condition: missing or invalid API key.
- API: `401 Unauthorized`, code `UNAUTHORIZED`.
- UI: show the returned `error.message`: `We couldn't authenticate the quote request. Please contact your administrator.`

### Unknown route

- Condition: the requested API route does not exist.
- API: `404 Not Found`, code `NOT_FOUND`.
- UI: show the returned `error.message`; this is not a normal commission-quote flow.

### Mock API error: 500

- Condition: `MOCK_API_ERROR_CODE=500`.
- API: `500 Internal Server Error`, code `INTERNAL_ERROR`.
- UI: render `UnknownError` with heading `Something went wrong.`, body `Please contact your administrator.`, and the smaller correlation ID text.

### Mock API error: 503

- Condition: `MOCK_API_ERROR_CODE=503`.
- API: `503 Service Unavailable`, code `SERVICE_UNAVAILABLE`.
- UI: show `The quote service is temporarily unavailable. Please try again later.`

### Request timeout

- Condition: request exceeds 60 seconds.
- API: no HTTP response is required.
- UI code: `REQUEST_TIMEOUT`.
- UI: show `We couldn't generate the quote. Please try again later.`

- `403 Forbidden` is not part of this MVP. Key Auth authenticates the caller; no separate authorisation rule exists.
- Error responses must not expose stack traces or internal implementation details.

### Mock error configuration

- The backend reads the optional `MOCK_API_ERROR_CODE` environment variable.
- Accepted values are `500` and `503`.
- When it is unset, the API does not force an error.
- Do not add a UI control, query parameter, or test-only endpoint for this behaviour.

## Frontend UX

### Page structure

```text
Commission quote

Loan amount
[$ ____________________]

Loan term
[____________________] months

Risk band
[Select risk band    ▾]

[ Generate quote ]

Quote result
Quote ID:                 ...
Commission rate:          ...
Upfront commission:       ...
Monthly trail commission: ...
Total commission:         ...
```

- Use a single-column form with one input per row.
- Show the response below the button after a successful request.
- Show field errors below their input and service errors above the fields.

### Form behaviour

- Every input uses the UI label defined in **Input and validation** and shows that it is required.
- `loanAmount` uses a numeric input with an AUD `$` prefix.
- `loanTermInMonths` uses a numeric input and displays `months` beside it.
- `riskBand` is a select with a placeholder and the three accepted values.
- First validate a field on blur. Once invalid, revalidate it on change and clear its error as soon as it becomes valid.
- Generate quote validates every field, including untouched fields.

### Request state

The UI has five explicit states:

- `idle`
- `loading`
- `success`
- `serviceError`
- `unknownError`

Client validation errors are stored in form state; they are not a request state.

While loading:

- Button is disabled and labelled **Generating quote...**.
- Inputs remain visible.
- Duplicate requests are prevented.
- Previous service error is cleared.

### Successful result

Display a summary card containing:

- Quote ID.
- Commission rate formatted as a percentage.
- Upfront commission formatted as AUD currency.
- Monthly trail commission formatted as AUD currency.
- Total commission formatted as AUD currency.

### Error presentation

- Field errors appear inline below their matching controls.
- API and timeout errors appear as a page-level alert, not against a field.
- For `400`, `401`, API `404`, `503`, and timeout alerts, input values remain available and the user can retry.
- `500` and unrecognised frontend errors replace the form with `UnknownError`; preserving form values is not required in that terminal state.
- Error copy describes what happened and what the user can do next; do not display status codes as the main message.

### Nice-to-have UI polish

- Responsive layout.
- Connect field errors using `aria-invalid` and `aria-describedby`.
- Announce the result through an accessible live region.

## Use case scenarios

### UC-01 Generate quote - main flow

- **Actor:** Staff user.
- **Preconditions:** The page is available and the UI has an API key.
- **Trigger:** Staff selects **Generate quote**.
- **Flow:**
  1. **Frontend:** Validate all fields.
  2. **Frontend:** Enter `loading`, disable all controls, and send the REST request.
  3. **API:** Authenticate the `api-key`.
  4. **API:** Validate the JSON payload.
  5. **API:** Map `riskBand` to `commissionRate`, then calculate upfront, monthly trail, and total commission.
  6. **API:** Generate `quoteId` and return `200` with `CommissionQuote`.
  7. **Frontend:** Enter `success` and display the quote.
- **Outcome:** One quote is shown; no data is persisted.

### UC-02 Invalid form

- **Condition:** A required field is missing or invalid.
- **Frontend:** Do not call the API; show inline field errors below their matching controls.
- **Outcome:** Input is preserved and no quote is produced.

### UC-03 API validation failure

- **Condition:** The API receives invalid JSON or invalid field data.
- **API:** Return `400 VALIDATION_ERROR`; do not calculate a quote.
- **Frontend:** Show returned field errors where available.

### UC-04 Authentication failure

- **Condition:** `api-key` is missing or invalid.
- **API:** Return `401 UNAUTHORIZED` before validation or calculation.
- **Frontend:** End loading and show the API-key error message. Do not show a login prompt.

### UC-05 Mock API failure

- **Condition:** `MOCK_API_ERROR_CODE` is `500` or `503`.
- **API:** Return the configured mock error.
- **Frontend:** Render the UI state mapped to the returned status.

### UC-06 Unexpected API failure

- **Condition:** An unhandled server error occurs.
- **API:** Return safe `500 INTERNAL_ERROR` JSON without internal details.
- **Frontend:** End loading, log the failure, and replace the form content with `UnknownError` showing the correlation ID.

### UC-07 API timeout

- **Condition:** The request is incomplete after 60 seconds.
- **Frontend:** Axios ends the timed-out request, the Page exits loading, preserves input, and shows the timeout error.
- **Outcome:** User may submit again.

## MVP patterns

- **Contract-first REST:** request, response, and error behaviour are defined before implementation.
- **Boundary validation:** frontend validation improves UX; API validation protects the system.
- **Authentication middleware:** API-key checks run before business logic.
- **Pure domain calculation:** risk-to-rate mapping and commission calculation have no HTTP or UI dependency.
- **Consistent error envelope:** authentication, validation, route, mock-service, and unexpected failures use the same JSON shape.
- **Explicit UI state:** request state drives loading, success, and error presentation.

## Test coverage

- One Jest test covers successful commission calculation and currency rounding.
- One Jest endpoint test covers a successful request with a valid API key, valid payload, response contract, and correlation header.
- Error states and frontend behaviour are verified manually against the approved mockups.
