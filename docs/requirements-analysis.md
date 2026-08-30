# Commission Quote App - Requirements

Source: `Code Challenge - Commission Quote App.pdf`

## 1. Confirmed from the brief

### Must-have

#### R-01 Generate a commission quote

- **Overall:** The web app accepts loan details, uses a Mock Commission Quote API, and displays the generated quote.
  - **Frontend:** Form for `loanAmount`, `loanTermInMonths`, and `riskBand`; **Generate Quote** button; loading, success, and error states.
  - **Mock API:** Accept the three request fields and return `quoteId`, `commissionRate`, and `totalCommission`.

#### R-02 Authenticate Mock API requests

- **Overall:** Commission Quote API requests require API-key authentication.
  - **Mock API:** Require an `api-key` header; reject missing or invalid keys.

#### R-03 Handle failure

- **Overall:** Success and failure responses must be handled gracefully.
  - **Frontend:** Handle invalid numbers, API errors, and API timeouts.
  - **Mock API:** Occasionally throw a random error to simulate network conditions.

#### R-04 Engineering quality

- Working, readable, clearly structured code.
- Sensible directories, clean abstractions, and separation of concerns.
- A few unit or integration tests for core logic; 100% coverage is not required.
- Sensible technical decisions using a familiar technology stack.
- README with run instructions, test instructions, and AI-usage disclosure.
- Code and decisions must be understood and explainable.

### Required scenarios

- Successful quote.
- Invalid numeric input.
- Missing or invalid API key.
- Mock API error.
- API timeout.

### Nice-to-have

- Clean, accessible, responsive UI.
- Basic CSS or a component library is acceptable.

### Constraints

- Maximum four hours.
- Production readiness is not expected.
- The real Vendor API is unavailable; its contract and API-key requirement are fixed.
- AI is allowed and encouraged, with disclosure.
- The codebase will be extended in a later live-coding interview.

### Deliverables

- Web application.
- Mock Commission Quote API.
- Core automated tests.
- README.
- GitHub repository or project zip.

## 2. Accepted assumptions

These are not stated in the brief; they define the accepted implementation scope.

### A-01 Commission rates

`riskBand` selects `commissionRate`: `LOW = 0.1%`, `MEDIUM = 0.2%`, `HIGH = 0.3%`. The same rate is used for upfront and annual trail commission.

### A-02 Commission calculation

Assume the loan balance remains unchanged.

```text
upfrontCommission = loanAmount × commissionRate
monthlyTrailCommission = upfrontCommission ÷ 12
totalCommission = upfrontCommission + (monthlyTrailCommission × loanTermInMonths)
```

### A-03 Input validation

- All fields are required.
- `loanAmount`: AUD amount greater than `0` and no more than `10,000,000.00`, with up to two decimals.
- `loanTermInMonths`: integer from `1` to `360`.
- `riskBand`: `LOW`, `MEDIUM`, or `HIGH`.
- Frontend validation provides immediate feedback; API validation is authoritative.

### A-04 Quote response

The API returns `quoteId`, `commissionRate`, `upfrontCommission`, `monthlyTrailCommission`, and `totalCommission`. Monetary values are rounded to cents; `quoteId` is a UUID.

### A-05 Form behaviour

Submit is disabled while loading. A new request clears the previous error. Results and errors use user-readable formatting.

### A-06 API-key boundary

- Staff login and OIDC are outside this task.
- The frontend reads one demo API key from environment configuration and sends it automatically in the `api-key` header. The user does not enter or see the key.
- The Mock API reads its expected key from environment configuration and returns `401` when the header is missing or invalid.
- Exposing a demo key in the browser is accepted for this four-hour mock. A production system would keep the Vendor key behind a BFF or API gateway.

### A-07 Mock API error control

- For a repeatable review, deterministic environment configuration replaces the brief's random failure trigger while preserving the required API-failure behaviour.
- The backend reads the optional environment variable `MOCK_API_ERROR_CODE`.
- `MOCK_API_ERROR_CODE=500` returns a mock `500` error.
- `MOCK_API_ERROR_CODE=503` returns a mock `503` error.
- When the variable is not set, the Mock API does not force an error.

### A-08 Stateless deployment

- Frontend form and request state remain in the user's browser; frontend instances serve the same static build.
- The Mock API stores no session, quote, or calculation state, so any backend instance can process a request.
- All backend instances receive the same environment configuration, including `COMMISSION_QUOTE_API_KEY` and `MOCK_API_ERROR_CODE`.
- UUID quote and correlation IDs do not depend on a single instance.
- Multiple frontend or backend instances require no sticky session.
- Production Vendor credentials belong behind a BFF or API gateway; the browser-visible demo key is only an accepted MVP limitation.
