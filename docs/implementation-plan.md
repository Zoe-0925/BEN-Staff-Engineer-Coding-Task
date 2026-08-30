# Commission Quote App - Implementation Plan

Status: Ready for implementation

This plan divides code generation into reviewable Jira-style tickets. The AI must implement only the ticket explicitly selected by the candidate, report its verification results, and then stop for review. It must not begin the next ticket automatically.

## Working agreement for every ticket

1. Before editing, read `README.md`, `docs/technical-spec.md`, `docs/code-quality-instructions.md`, and the active ticket in full.
2. Read the relevant Requirements, Functional Spec, OpenAPI, Decision Log, and approved mockup sections for the active ticket.
3. Treat the ticket as a reviewable implementation slice, not as a replacement for the Technical Spec or API contract.
4. Inspect the current workspace before editing; preserve candidate changes.
5. Change only the files listed in the active ticket.
6. For a TDD ticket, write the named test first and confirm the expected failure.
7. Add the minimum implementation that satisfies the approved contract.
8. Refactor only for readability without changing behaviour.
9. Run the ticket's acceptance checks.
10. Present the changed files, completed behaviour, commands run, and any unresolved issue.
11. Stop and wait for candidate approval.

If a required decision is missing or artifacts conflict, stop. Do not invent a solution in code.

## CQ-001 - Project scaffold and quality gates

**Goal:** Create the approved npm, TypeScript, Vite, ESLint, Prettier, environment, and local-run foundation without implementing business behaviour.

**Create or modify:**

- Repository-root `.gitignore`.
- `code/.prettierrc.json`, `code/package.json`, and `code/package-lock.json`.
- Frontend build-root files listed in the Technical Spec.
- Backend build-root files listed in the Technical Spec.
- Frontend and backend `.env.example` files.

**Implementation:**

- Use Node.js 24+, npm, Vite React TypeScript, and the exact approved ports and scripts.
- Configure ESLint and Prettier according to Code Quality Instructions.
- Configure TypeScript strict mode; do not weaken it.
- Add only the dependencies approved by the Technical Spec and Code Quality Instructions.
- Do not add business components, DTOs, middleware, routes, services, or tests in this ticket.

**Acceptance criteria:**

- All three dependency installations succeed.
- Package scripts and environment examples match README and Technical Spec.
- No Vite demo assets or unrelated dependencies remain.
- The candidate can review the complete dependency and tooling choices before business code begins.

**Stop for review:** dependency lists, scripts, compiler options, lint configuration, formatting configuration, and environment variable names.

## CQ-002 - Commission calculation through TDD

**Depends on:** CQ-001 approved.

**Goal:** Implement the authoritative pure commission calculation and currency rounding.

**Create or modify:**

- `code/backend/test/commissionQuoteService.test.js`
- `code/backend/src/schemas/commissionQuoteSchema.ts`
- `code/backend/src/services/commissionQuoteService.ts`
- Backend package configuration only if required to run the already approved Jest command.

**Implementation order:**

1. Write the canonical `500000 / 360 / LOW` calculation test.
2. Run it and confirm it fails because the implementation is missing.
3. Define the approved backend request, response, and field-error types.
4. Implement risk-rate mapping, integer-cents calculation, UUID creation, and response mapping.
5. Refactor only after the test passes.

**Acceptance criteria:**

- Calculation and rounding exactly match Functional Spec and OpenAPI.
- The service is deterministic except for UUID creation and has no Express or environment dependency.
- The test passes using Jest against compiled CommonJS output.
- Build, lint, format check, and the calculation test pass.

**Stop for review:** formula implementation, monetary rounding, naming, service boundary, and test readability.

## CQ-003 - Successful API request through TDD

**Depends on:** CQ-002 approved.

**Goal:** Make one valid authenticated REST request return the approved `200` response with end-to-end correlation.

**Create or modify:**

- `code/backend/test/createCommissionQuoteRoute.test.js`
- `code/backend/src/app.ts`
- `code/backend/src/server.ts`
- `code/backend/src/middleware/httpLogger.ts`
- `code/backend/src/middleware/apiKeyAuth.ts`
- `code/backend/src/routes/createCommissionQuoteRoute.ts`
- Existing backend schema and service only when required by the approved success flow.

**Implementation order:**

1. Write the successful endpoint test using Node's built-in `fetch` and an ephemeral port.
2. Run it and confirm the expected failure.
3. Add correlation middleware, local CORS, API-key authentication, JSON parsing, route validation, service call, and response mapping in the approved order.
4. Add server startup and environment loading without duplicating application construction.
5. Refactor only after both confirmed tests pass.

**Acceptance criteria:**

- A valid request returns `200` and the exact OpenAPI response contract.
- A valid incoming correlation UUID is echoed; otherwise the API generates one.
- `app.ts` exports the named `app` without listening.
- Both Jest tests, backend build, lint, and format check pass.

**Stop for review:** middleware order, endpoint contract, authentication comparison, correlation flow, and endpoint test.

## CQ-004 - Backend validation and failure paths

**Depends on:** CQ-003 approved.

**Goal:** Complete the approved API behaviour without expanding the automated test matrix.

**Create or modify:**

- `code/backend/src/middleware/notFound.ts`
- `code/backend/src/middleware/errorHandler.ts`
- Existing backend route, schema, service, app, server, and logging middleware.

**Implementation:**

- Complete strict Zod schema validation and pure business-rule validation.
- Return the approved `400`, `401`, API `404`, configured `500`, and configured `503` envelopes.
- Apply `MOCK_API_ERROR_CODE` only after authentication and validation and before calculation.
- Validate backend environment variables before listening.
- Register `notFound` and then `errorHandler` after the route.
- Keep all error responses safe and all logs structured and correlated.
- Do not add new automated error tests.

**Acceptance criteria:**

- Direct Postman calls enforce the same required fields and business rules as the UI.
- Missing or invalid API keys cannot reach parsing, validation, or calculation.
- `MOCK_API_ERROR_CODE=500` and `503` reproduce the approved responses deterministically.
- Malformed JSON returns the approved `400`; unhandled exceptions return the approved `500`.
- Existing tests, backend build, lint, and format check pass.

**Stop for review:** error envelopes, validation ownership, middleware ordering, environment failure trigger, and logging safety.

## CQ-005 - Frontend schemas and data foundation

**Depends on:** CQ-004 approved.

**Goal:** Implement the typed, config-driven frontend data layer without rendering the business page.

**Required sources for this ticket:**

- Technical Spec is the implementation authority for the exact schema contracts, file structure, config and Context flow, `useConfig` behaviour, validator signature, mapper signature, Axios service, correlation, and logging.
- Functional Spec supplies the approved field values, labels, options, validation rules, and user-facing messages. It does not define the frontend architecture.
- OpenAPI supplies the authoritative request, response, error DTO, header, and endpoint contract.
- Code Quality Instructions apply to every generated TypeScript file.

Read all four sources before editing. Do not implement CQ-005 from Functional Spec alone.

**Create or modify:**

- Every approved file under `code/frontend/src/schemas/`.
- `code/frontend/src/config/commissionQuoteFormConfig.json`
- `code/frontend/src/context/ConfigContext.tsx`
- `code/frontend/src/hooks/useConfig.ts`
- `code/frontend/src/utils/validateField.ts`
- `code/frontend/src/mappers/commissionQuoteRequestMapper.ts`
- `code/frontend/src/services/commissionQuoteApi.ts`

**Implementation:**

- Copy the schema contracts exactly from Technical Spec.
- Store the approved form config as a JSON array containing the `commissionQuote` form.
- Make `useConfig("commissionQuote")` return one matching config or `undefined`.
- Implement generic config-driven field validation without switching on field names.
- Map request values by metadata name, never by array position.
- Configure one Axios client with the approved base URL, timeout, API key, and correlation headers.
- Log and rethrow the original narrowed Axios error.

**Acceptance criteria:**

- Config labels, validation messages, widths, options, and metadata match Functional Spec.
- DTOs match OpenAPI exactly.
- No React component, API page orchestration, fallback config, or hardcoded field rendering is added.
- Frontend type check, lint, and format check pass. The Vite production bundle is not required until CQ-008 creates the application entry.

**Stop for review:** all TypeScript schemas, JSON config, config lookup, validator, mapper, and Axios contract.

## CQ-006 - Reusable fields and local form state

**Depends on:** CQ-005 approved.

**Goal:** Render the configured fields through reusable controlled components and implement the approved local validation lifecycle.

**Create or modify:**

- `code/frontend/src/components/Input/Input.tsx`
- `code/frontend/src/components/Select/Select.tsx`
- `code/frontend/src/components/Button/Button.tsx`
- `code/frontend/src/components/CommissionQuoteForm/CommissionQuoteForm.tsx`
- `code/frontend/src/styles/Grid.ts`
- `code/frontend/src/styles/theme.ts`
- `code/frontend/src/styles/styled.d.ts`

**Implementation:**

- Keep each component's prop type in its own `.tsx` file.
- Render fields dynamically from config using the approved `type` switch.
- Give every field its own Grid item and apply config width.
- Store one `{ name, value }` entry per config field in the form reducer.
- Validate a field first on blur, then on change after it has been touched and invalid.
- On submit, validate all fields and pass the validated metadata list to the Page; do not map or classify errors in the Form.
- Keep the untouched form button enabled; disable it when known errors exist or the request is loading.
- Do not call the API from a field or from `CommissionQuoteForm`.

**Acceptance criteria:**

- One Input implementation renders both numeric input fields.
- Required and invalid messages appear at the approved field location.
- Correcting all known errors re-enables submission.
- Form submission emits only a metadata list that passed client validation.
- Frontend type check, lint, and format check pass.

**Stop for review:** reusable component APIs, config-driven rendering, reducer behaviour, blur/change validation, and submit boundary.

## CQ-007 - Quote page and request states

**Depends on:** CQ-006 approved.

**Goal:** Connect the form to the API and render every approved request outcome.

**Create or modify:**

- `code/frontend/src/pages/CommissionQuotePage.tsx`
- `code/frontend/src/pages/CommissionQuotePage.styles.ts`
- `code/frontend/src/components/CommissionQuoteResult/CommissionQuoteResult.tsx`
- `code/frontend/src/components/UnknownError/UnknownError.tsx`
- `code/frontend/src/utils/handleRequestError.ts`
- Existing frontend API service only if integration reveals a contract mismatch.

**Implementation:**

- Own API submission and `RequestState` in `CommissionQuotePage`.
- Reuse `handleRequestError` as the single application-level caught-request error handler.
- Map validated form metadata in the Page. Treat an `undefined` mapping result as `unknownError` without throwing or calling the API.
- Generate one UUID per request and preserve it through request, logs, response, and displayed system errors.
- Render success values only from the response; never recalculate them in the UI.
- Map `400`, `401`, API `404`, `503`, timeout, `500`, and unknown failures exactly as Technical Spec states.
- Preserve the form for recoverable failures; unmount it for `500` and unknown errors.
- If config is missing, log `CONFIG_NOT_FOUND` with the approved internal message and render the same `UnknownError` page without exposing config details.

**Acceptance criteria:**

- Loading, success, field error, authentication error, timeout, unavailable, and unexpected-error flows match the approved state rules.
- A successful response renders rate, upfront, monthly trail, and total commission using approved formatting.
- No new error strategy, request state, retry mechanism, or fallback data is introduced.
- Frontend type check, lint, and format check pass.

**Stop for review:** page orchestration, correlation lifecycle, status mapping, missing-config handling, and result mapping.

## CQ-008 - Application shell, routing, and approved presentation

**Depends on:** CQ-007 approved.

**Goal:** Complete the runnable UI and apply the approved mockups without changing business behaviour.

**Create or modify:**

- `code/frontend/src/main.tsx`
- `code/frontend/src/App.tsx`
- `code/frontend/src/components/AppHeader/AppHeader.tsx`
- `code/frontend/src/components/AppFooter/AppFooter.tsx`
- `code/frontend/src/components/NotFound/NotFound.tsx`
- `code/frontend/src/styles/GlobalStyle.ts`
- `code/frontend/src/styles/theme.ts`
- `code/frontend/src/styles/styled.d.ts`
- Existing page and component files when presentation-only changes are required to match the mockups.
- Copy `docs/brand-logo.svg` unchanged to `code/frontend/src/assets/brand-logo.svg`.

**Implementation:**

- Mount providers in the approved order.
- Route `/` to `CommissionQuotePage` and `*` to `NotFound`.
- Keep Header and Footer outside the route switch.
- Apply the approved white/plum theme, responsive grid, typography, spacing, footer, fake B logo, and state layouts.
- Use styled-components according to the approved global, page, and reusable-component boundaries.
- Do not copy a real bank logo or add a progress bar, navigation, animation, or extra page.

**Acceptance criteria:**

- `npm run dev` starts UI on `3000` and API on `8090`.
- The UI matches the approved success and state mockups at desktop and narrow widths.
- Unknown routes render the approved 404 page and clear local form state by unmounting the route.
- Frontend and backend builds, lint, format check, and confirmed tests pass.

**Stop for review:** full happy path, layout, responsive behaviour, Header/Footer, 404, and all visible states.

## CQ-009 - Final verification and handoff

**Depends on:** CQ-001 through CQ-008 approved.

**Goal:** Prove the reviewed implementation is internally consistent and ready to submit.

**Modify:**

- README only when actual commands or verified limitations differ from the current draft.
- Source files only to fix a demonstrated defect; do not perform an architectural rewrite.

**Verification:**

- Install from a clean dependency state using the documented commands.
- Run format check, frontend and backend lint, both builds, and both Jest tests.
- Run the successful browser flow and direct Postman flow.
- Manually reproduce client validation, API validation, `401`, timeout, `500`, `503`, API `404`, UI `404`, and missing-config behaviour.
- Confirm correlation IDs appear in the request, response, safe system UI, and logs as specified.
- Compare final files against Requirements, Functional Spec, OpenAPI, Technical Spec, mockups, and Code Quality Instructions.
- Remove dead code, demo code, temporary logging, test controls, stale artifacts, and unused dependencies.

**Acceptance criteria:**

- All required commands pass from the documented locations.
- No approved requirement or assumption is contradicted by implementation.
- README setup, run, test, error reproduction, limitations, decisions, and AI disclosure are accurate.
- Any remaining limitation is explicit and does not break the confirmed MVP.

**Stop for final candidate review:** complete diff, verification evidence, known limitations, and interview explanation points.
