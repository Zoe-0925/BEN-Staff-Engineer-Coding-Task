# Commission Quote App - Technical Spec

Status: Ready for implementation

## Implementation rules

- Use test-driven development only for the confirmed main flow. Write and run its failing tests before writing the corresponding implementation.
- Follow red-green-refactor: expected failure, minimum passing code, then behaviour-preserving cleanup.
- Do not generate the complete application and add tests afterward.
- Do not weaken, delete, skip, or rewrite a confirmed test merely to make an implementation pass.
- Draft tests only in the test files already listed in this Technical Spec.
- Do not add a full error-scenario test matrix, coverage target, snapshot tests, or styled-component implementation tests.
- Implement the confirmed structure, names, data flow, and behaviour exactly as specified.
- Do not replace the selected patterns with alternative abstractions.
- Do not add, rename, move, or merge files unless the Technical Spec is updated first.
- Do not invent missing config, component props, validation rules, or UI styles; leave them as TBD until confirmed.
- Define shared config and domain schemas under `code/frontend/src/schemas/`.
- Group frontend API DTOs in `CommissionQuoteDto.ts` and export them as named types.
- For non-DTO schemas, the filename must match its exported type or interface name.
- Define each component's prop type directly in its own `.tsx` file; do not create separate `*Props.ts` files.
- Declare the local prop type near the top of the component file, after imports and before the component implementation.
- Do not export a component prop type when no other file consumes that type.
- Keep Requirements, Functional Spec, and Technical Spec consistent before coding.
- Follow `docs/code-quality-instructions.md` for naming, TypeScript, React, Node.js, formatting, and cleanup rules.
- Follow `docs/implementation-plan.md` one ticket at a time. Do not begin the next ticket without candidate approval.

### OpenAPI contract

- `code/backend/openapi.yaml` is the machine-readable API contract for the frontend and backend.
- It defines the single `POST /api/commission-quotes` endpoint, `api-key` security, optional `x-correlation-id`, request and response schemas, and `200`, `400`, `401`, `404`, `500`, and `503` responses.
- Frontend DTOs, backend DTOs, validation, response mapping, and tests must match this file.
- When the API contract changes, update `openapi.yaml`, Functional Spec, and affected TypeScript types together before implementation.
- Do not add Swagger UI, generated clients, or generated server code for this MVP.

### TDD implementation order

1. Backend commission calculation and monetary rounding.
2. Backend successful endpoint request with a valid API key and valid payload.

- These are main-flow test drafts, not a commitment to exhaustive coverage.
- Complete each numbered slice with red-green-refactor before starting the next.
- Use only Jest. Do not install another test runner, test transformer, DOM test environment, React test library, HTTP test library, or API mocking library.
- Write backend tests as plain JavaScript and run them against the TypeScript-compiled `code/backend/dist` output.
- Do not add frontend automated tests in this MVP; verify the UI manually against the approved mockups and main flow.

### Implementation sequence

The detailed implementation sequence and review boundaries are defined by `docs/implementation-plan.md`:

1. `CQ-001`: project scaffold and quality gates.
2. `CQ-002`: commission calculation through TDD.
3. `CQ-003`: successful API request through TDD.
4. `CQ-004`: backend validation and failure paths.
5. `CQ-005`: frontend schemas and data foundation.
6. `CQ-006`: reusable fields and local form state.
7. `CQ-007`: quote page and request states.
8. `CQ-008`: application shell, routing, and approved presentation.
9. `CQ-009`: final verification and handoff.

Complete only the ticket selected by the candidate, then stop for review. Do not start optional UI refinement before the end-to-end main flow works.

### Required project root

```text
.
├── .gitignore
├── README.md
├── docs/
│   ├── brand-logo.svg
│   ├── commission-quote-layout.html
│   ├── commission-quote-state-layouts.html
│   ├── code-quality-instructions.md
│   ├── decision-log.md
│   ├── evaluation-signals.md
│   ├── functional-spec.md
│   ├── implementation-plan.md
│   ├── requirements-analysis.md
│   └── technical-spec.md
└── code/
    ├── .prettierrc.json
    ├── package.json
    ├── package-lock.json
    ├── frontend/
    └── backend/
```

- Use Node.js 22 or later and npm.
- Repository-root `.gitignore` ignores every `node_modules/`, `dist/`, `.env`, and local OS/editor file; it must not ignore either `.env.example`.
- All executable application code and npm tooling live under `code/`; documentation remains at the repository root.
- `code/package.json` contains local orchestration scripts, the `concurrently` development dependency, and the code-workspace Prettier dependency.
- `code/.prettierrc.json` contains the exact formatting rules in Code Quality Instructions.
- Run application npm commands from `code/` unless a command explicitly states otherwise.

## 1. Frontend stack

- React + TypeScript.
- Vite with the `react-ts` template.
- Axios for HTTP requests; do not use native `fetch`.
- `loglevel` for frontend logging; each file that logs imports `loglevel` directly.
- npm is the package manager; commit `package-lock.json`.
- Do not use Create React App.
- React Router in declarative mode.
- `App` defines the valid application routes.
- The UI contains exactly one business page: `CommissionQuotePage` at `/`.
- Do not create any other business page or route for this MVP.
- `CommissionQuoteForm` owns local field values, validation errors, and form validity.
- `CommissionQuotePage` owns API submission, request state, service errors, and response.

## 2. Required frontend file structure

Frontend build root:

```text
code/frontend/
├── .env.example
├── package.json
├── package-lock.json
├── index.html
├── eslint.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
```

- After scaffolding, remove Vite demo assets, demo styles, and its generated frontend README so the final frontend tree matches this section exactly.

Frontend source tree:

```text
code/frontend/src/
├── App.tsx
├── main.tsx
├── vite-env.d.ts
├── assets/
│   └── brand-logo.svg
├── config/
│   └── commissionQuoteFormConfig.json
├── context/
│   └── ConfigContext.tsx
├── hooks/
│   └── useConfig.ts
├── mappers/
│   └── commissionQuoteRequestMapper.ts
├── pages/
│   ├── CommissionQuotePage.tsx
│   └── CommissionQuotePage.styles.ts
├── components/
│   ├── AppHeader/
│   │   └── AppHeader.tsx
│   ├── AppFooter/
│   │   └── AppFooter.tsx
│   ├── Input/
│   │   └── Input.tsx
│   ├── Select/
│   │   └── Select.tsx
│   ├── Button/
│   │   └── Button.tsx
│   ├── CommissionQuoteForm/
│   │   └── CommissionQuoteForm.tsx
│   ├── NotFound/
│   │   └── NotFound.tsx
│   ├── UnknownError/
│   │   └── UnknownError.tsx
│   └── CommissionQuoteResult/
│       └── CommissionQuoteResult.tsx
├── services/
│   └── commissionQuoteApi.ts
├── styles/
│   ├── GlobalStyle.ts
│   ├── Grid.ts
│   ├── styled.d.ts
│   └── theme.ts
├── utils/
│   └── validateField.ts
└── schemas/
    ├── CommissionQuoteDto.ts
    ├── Field.ts
    ├── FieldMetadata.ts
    ├── FieldValue.ts
    ├── FormConfig.ts
    ├── FormAction.ts
    ├── FormState.ts
    ├── ConfigContextValue.ts
    ├── LogEntry.ts
    ├── RequestState.ts
    ├── RiskBand.ts
    ├── SelectOption.ts
    └── Validation.ts
```

- This is the required structure for the confirmed frontend design.
- `CommissionQuoteDto.ts` exports `CommissionQuoteRequest`, `CommissionQuoteResponse`, and `ErrorResponse`.
- Every other shared schema file exports exactly one named TypeScript `type` or `interface`.
- Component prop types remain private to their component files and are not added to `schemas/`.

### Complete frontend schema contracts

Implement these files exactly. Do not rename fields, add parallel types, or move component props into this folder.

#### `CommissionQuoteDto.ts`

```ts
import type { RiskBand } from "./RiskBand";

export type CommissionQuoteRequest = {
  loanAmount: number;
  loanTermInMonths: number;
  riskBand: RiskBand;
};

export type CommissionQuoteResponse = {
  quoteId: string;
  commissionRate: 0.001 | 0.002 | 0.003;
  upfrontCommission: number;
  monthlyTrailCommission: number;
  totalCommission: number;
};

export type ErrorResponse = {
  error: {
    code:
      | "VALIDATION_ERROR"
      | "UNAUTHORIZED"
      | "NOT_FOUND"
      | "INTERNAL_ERROR"
      | "SERVICE_UNAVAILABLE";
    message: string;
    fieldErrors?: Partial<
      Record<keyof CommissionQuoteRequest, string>
    >;
  };
};
```

#### `RiskBand.ts`

```ts
export type RiskBand = "LOW" | "MEDIUM" | "HIGH";
```

#### `FieldValue.ts`

```ts
import type { RiskBand } from "./RiskBand";

export type FieldValue = number | RiskBand | null;
```

- Empty Input and Select values are `null`; they are never stored as empty strings.
- `loanAmount` and `loanTermInMonths` are numbers in form state and in the request DTO.

#### `FieldMetadata.ts`

```ts
import type { FieldValue } from "./FieldValue";

export type FieldMetadata = {
  name: string;
  value: FieldValue;
};
```

#### `Validation.ts`

```ts
export type Validation = {
  min?: number;
  max?: number;
  integer?: boolean;
  maxDecimalPlaces?: number;
  errorMessage: string;
};
```

- `integer` and `maxDecimalPlaces` keep generic validation config-driven; `validateField.ts` must not switch on a field name.

#### `SelectOption.ts`

```ts
export type SelectOption = {
  label: string;
  value: string;
};
```

#### `Field.ts`

```ts
import type { SelectOption } from "./SelectOption";
import type { Validation } from "./Validation";

export type Field = {
  type: "Input" | "Select";
  name: string;
  label: string;
  width: {
    xs: number;
    md: number;
  };
  isRequired: boolean;
  requiredErrorMessage: string;
  validation: Validation;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  options?: SelectOption[];
};
```

- Input uses optional `prefix` and `suffix` presentation metadata.
- Select uses `placeholder` and `options`.
- `type` is the discriminant used by the Page switch statement; do not create `FieldType.ts`.
- `name` remains a string; do not create `FieldName.ts`.

#### `FormConfig.ts`

```ts
import type { Field } from "./Field";

export type FormConfig = {
  formContext: string;
  value: Field[];
};
```

#### `FormState.ts`

```ts
import type { FieldMetadata } from "./FieldMetadata";

export type FormState = {
  values: FieldMetadata[];
  errors: Record<string, string | undefined>;
  touched: string[];
};
```

#### `FormAction.ts`

```ts
import type { FieldMetadata } from "./FieldMetadata";

export type FormAction =
  | {
      type: "UPDATE_FIELD";
      payload: FieldMetadata;
    }
  | {
      type: "SET_FIELD_ERROR";
      payload: {
        name: string;
        error?: string;
      };
    }
  | {
      type: "SET_FIELD_ERRORS";
      payload: Record<string, string | undefined>;
    };
```

- `SET_FIELD_ERROR` also marks its field name as touched.
- `SET_FIELD_ERRORS` replaces the current error map with full-form or API field errors and marks every supplied field name as touched.
- Route unmount resets the form; do not add a reducer reset action.

#### `ConfigContextValue.ts`

```ts
import type { FormConfig } from "./FormConfig";

export type ConfigContextValue = FormConfig[] | undefined;
```

- `undefined` means the hook is outside `ConfigProvider`; an empty array is a valid provider value with no matching config.

#### `LogEntry.ts`

```ts
export type LogEntry = {
  level: "info" | "warn" | "error";
  event: string;
  message: string;
  correlationId?: string;
};
```

#### `RequestState.ts`

```ts
import type {
  CommissionQuoteResponse,
  ErrorResponse,
} from "./CommissionQuoteDto";

export type RequestState =
  | {
      status: "idle";
    }
  | {
      status: "loading";
      correlationId: string;
    }
  | {
      status: "success";
      correlationId: string;
      response: CommissionQuoteResponse;
    }
  | {
      status: "serviceError";
      correlationId: string;
      message: string;
      fieldErrors?: ErrorResponse["error"]["fieldErrors"];
    }
  | {
      status: "unknownError";
      correlationId: string;
    };
```

- Client validation remains in `FormState`; it is not a `RequestState` status.
- `500` and unrecognised caught request errors use `unknownError`.
- `400`, `401`, API `404`, `503`, and timeout use `serviceError` when they remain on the form page.
- Missing form config also renders `UnknownError`, but it is not a `RequestState` because no request occurred.

Required component prop contracts:

```ts
// Input.tsx
type InputProps = {
  field: Field;
  value: number | null;
  error?: string;
  disabled: boolean;
  onChange: (field: FieldMetadata, error?: string) => void;
  onBlur: (name: string, error?: string) => void;
};

// Select.tsx
type SelectProps = {
  field: Field;
  value: RiskBand | null;
  error?: string;
  disabled: boolean;
  onChange: (field: FieldMetadata, error?: string) => void;
  onBlur: (name: string, error?: string) => void;
};

// Button.tsx
type ButtonProps = {
  type: "button" | "submit";
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  disabled: boolean;
};

// CommissionQuoteForm.tsx
type CommissionQuoteFormProps = {
  fields: Field[];
  isLoading: boolean;
  apiFieldErrors?: ErrorResponse["error"]["fieldErrors"];
  onSubmit: (request: CommissionQuoteRequest) => Promise<void>;
};

// CommissionQuoteResult.tsx
type CommissionQuoteResultProps = {
  quote: CommissionQuoteResponse;
};

// UnknownError.tsx
type UnknownErrorProps = {
  correlationId: string;
};

// Grid.ts
type GridItemProps = {
  $width: Field["width"];
};
```

- Declare each prop type in the named implementation file after its imports; do not export it.
- Import the referenced shared types from `schemas/`.
- `AppHeader`, `AppFooter`, and `NotFound` take no props.
- None of these prop types belongs in `schemas/`.
- `code/backend/openapi.yaml` already exists at the backend root and remains outside `code/backend/src/`.

### Build and application entry

Create the frontend from the repository root with:

```bash
npm create vite@latest code/frontend -- --template react-ts
```

Required npm scripts:

```text
npm run dev       → start the Vite development server
npm run typecheck → run TypeScript checking without creating the Vite bundle
npm run build     → run TypeScript compilation and create the production bundle
npm run lint      → run ESLint
```

- The frontend has no automated test script in this MVP.

### Frontend HTTP configuration

- `VITE_COMMISSION_QUOTE_API_BASE_URL=http://localhost:5000` is stored in `code/frontend/.env.example`.
- `commissionQuoteApi.ts` creates one module-level Axios instance with that `baseURL` and `timeout: 60000`.
- It exports `createCommissionQuote(request: CommissionQuoteRequest, correlationId: string): Promise<CommissionQuoteResponse>`.
- It calls `POST /api/commission-quotes` with the request DTO and the confirmed headers.
- The function returns `response.data`; it does not expose `AxiosResponse` to the Page.
- On failure, it records the request failure/timeout log and rethrows the original Axios error; do not create a custom frontend error class or error service.
- Each quote request sends `Content-Type: application/json`, `api-key`, and `x-correlation-id`.
- The API key comes from `VITE_COMMISSION_QUOTE_API_KEY`; never accept it from a UI field.
- Read `x-correlation-id` from every Axios response, including known error responses.
- Do not add Axios interceptors for this single-endpoint MVP; keep request creation and response mapping explicit in `commissionQuoteApi.ts`.

Application entry flow:

```text
index.html
→ src/main.tsx
→ BrowserRouter
→ ThemeProvider
→ ConfigProvider
→ GlobalStyle
→ App
```

- `main.tsx` is the browser entry point and mounts React with `createRoot`.
- `main.tsx` contains app-level providers only; it does not contain page or business logic.
- `App.tsx` renders `AppHeader`, the route switch, and `AppFooter`.
- Copy the approved `docs/brand-logo.svg` unchanged to `code/frontend/src/assets/brand-logo.svg` during implementation.

## 3. Component structure

```text
App
├── AppHeader
├── main
│   ├── Route "/"
│   │   └── CommissionQuotePage
│   │       ├── CommissionQuoteForm
│   │       │   ├── reusable Input
│   │       │   ├── reusable Select
│   │       │   └── reusable Button
│   │       └── CommissionQuoteResult
│   └── Route "*"
│       └── NotFound
└── AppFooter
```

- There is one reusable `Input` component file, rendered for every configured input field.
- There is one reusable `Select` component file.
- There is one reusable `Button` component file.
- `CommissionQuoteForm` renders the configured fields and aggregates their local state.
- Field components do not submit the form or call the API.
- `CommissionQuoteForm` does not call the API; it passes a valid `CommissionQuoteRequest` to the Page through `onSubmit`.
- `AppHeader` and `AppFooter` render outside the route switch so they remain visible on the quote page and the 404 page.
- `AppFooter` displays: `© {currentYear} B Mock. All rights reserved.`
- `currentYear` is generated at runtime; `B Mock` explicitly identifies the placeholder branding.
- `AppFooter` is a minimal full-width footer with a subtle top border and centred muted text.
- The app shell uses a column flex layout and the route content uses `flex: 1`, keeping the Footer at the viewport bottom when no quote result exists.
- The Footer is not fixed or sticky and must never overlay page content.
- Before a quote result is generated, the unused area between the form and Footer remains empty.

### Routes and form-state lifecycle

```tsx
<Routes>
  <Route path="/" element={<CommissionQuotePage />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

- `/` is the only valid business route in this MVP and renders `CommissionQuotePage`.
- `*` is only the unmatched-route fallback; it renders `NotFound` with `404` and `Page not found.` and is not a business page.
- Do not add additional routes, nested routes, or multi-step pages in this MVP.
- Form values, touched state, validation errors, request state, service errors, and quote result remain local to the commission quote route.
- Navigating away from `/`, including navigating to an invalid URL, unmounts `CommissionQuotePage` and destroys all of that route-local state.
- Returning to `/` mounts a new page with empty fields and no previous errors or result.
- Do not persist form state in Context, Redux, `localStorage`, or `sessionStorage`.
- Do not add a route-change effect to clear state; component unmount is the reset mechanism.

## 4. Form configuration

- `commissionQuoteFormConfig.json` simulates a config collection loaded from an external source such as an API or database.
- `ConfigContext` reads the full config array and provides it to the app.
- `useConfig(formContext)` wraps `useContext`, searches the array by `formContext`, and returns the matching config object.
- `CommissionQuotePage` calls `useConfig("commissionQuote")` and passes the returned `config.value` to `CommissionQuoteForm`.
- `CommissionQuotePage` does not import or search the JSON directly.
- `CommissionQuoteForm` renders `config.value` in array order and uses a switch statement to map each `Field.type` to a reusable component.

### Context flow

1. `ConfigContext.tsx` imports `commissionQuoteFormConfig.json` once.
2. `ConfigProvider` provides the complete config array.
3. `useConfig(formContext)` reads the array with `useContext(ConfigContext)`.
4. The hook finds the first item whose `formContext` matches the argument.
5. The hook returns the matching `FormConfig` item or `undefined` when no item matches.

```text
useConfig("commissionQuote") → FormConfig | undefined
```

### Context error handling

- If `useConfig` is called outside `ConfigProvider`, throw `useConfig must be used within ConfigProvider`.
- If no item matches `formContext`, return `undefined`.
- This includes an empty config array or deletion of the `"commissionQuote"` config object from the array.
- If `CommissionQuotePage` receives `undefined`, do not render the form.
- Reuse the same `UnknownError` component used for unexpected errors; do not create a config-specific error page or component.
- Do not render a blank page, an empty form, or fall back to hard-coded fields.
- `UnknownError` displays:
  - Heading: `Something went wrong.`
  - Body: `Please contact your administrator.`
  - Smaller text: `Correlation ID: {correlationId}`
- `UnknownError.tsx` defines its local prop type with required `correlationId: string`.
- The displayed correlation ID must be the same value recorded in the corresponding error log.
- Create the config-error correlation ID with a lazy `useState` initializer. Log it from `useEffect` guarded by `useRef` so React development Strict Mode and re-renders do not duplicate the log or change the displayed ID.
- Log this config error when displaying `UnknownError`:

```text
level: error
event: CONFIG_NOT_FOUND
message: Config not found for formContext: commissionQuote
correlationId: generated UUID when available
```

- This is a configuration error, not an API or field-validation error.
- `CONFIG_NOT_FOUND` and its log message are internal-only. Never display the event name, `formContext`, or `Config not found` message in the UI.

The JSON root is an array. This MVP contains one config object:

```json
[
  {
    "formContext": "commissionQuote",
    "value": [
      {
        "type": "Input",
        "name": "loanAmount",
        "label": "Loan amount",
        "width": { "xs": 12, "md": 12 },
        "isRequired": true,
        "requiredErrorMessage": "Please enter the loan amount.",
        "validation": {
          "min": 0.01,
          "max": 10000000,
          "maxDecimalPlaces": 2,
          "errorMessage": "Please enter a valid loan amount."
        },
        "prefix": "$"
      },
      {
        "type": "Input",
        "name": "loanTermInMonths",
        "label": "Loan term",
        "width": { "xs": 12, "md": 12 },
        "isRequired": true,
        "requiredErrorMessage": "Please enter the loan term in months.",
        "validation": {
          "min": 1,
          "max": 360,
          "integer": true,
          "errorMessage": "The loan term must be between 1 and 360 months."
        },
        "suffix": "months"
      },
      {
        "type": "Select",
        "name": "riskBand",
        "label": "Risk band",
        "width": { "xs": 12, "md": 12 },
        "isRequired": true,
        "requiredErrorMessage": "Please select a risk band.",
        "placeholder": "Select a risk band",
        "validation": {
          "errorMessage": "Please select a valid risk band."
        },
        "options": [
          { "label": "Low", "value": "LOW" },
          { "label": "Medium", "value": "MEDIUM" },
          { "label": "High", "value": "HIGH" }
        ]
      }
    ]
  }
]
```

- The array represents all available form configurations.
- `formContext` uniquely identifies one form configuration.
- `FormConfig.value` is an ordered `Field[]`.
- The commission quote config contains two input items and one select item.
- Config can change existing field labels, order, widths, validation limits/messages, and select options without changing component code.
- Adding a new DTO field or a new `Field.type` requires corresponding schema, mapper, and switch changes; config is not claimed to make API-contract changes code-free.

Each item in `FormConfig.value` is a `Field` object containing:

- `type`: `"Input" | "Select"`.
- `name`: `string` matching a request DTO property.
- `label`: text displayed above the field.
- `width`: responsive 12-column grid width with inline shape `{ xs: number; md: number }`.
- `isRequired`: whether an empty value is invalid.
- `requiredErrorMessage`: message shown when a required field is empty.
- `validation`: field validation rules and the single message used for any non-required validation failure.

`Validation.ts` exports:

```text
Validation
- min?: number
- max?: number
- integer?: boolean
- maxDecimalPlaces?: number
- errorMessage: string
```

- Every rule is config-driven; generic validation must not branch on a field name.
- A field has only two client-side error outcomes: its configured required error or its configured validation error.

- `width.xs` and `width.md` must each be an integer from 1 to 12.
- Do not create a separate `FieldWidth` schema; width is part of the `Field` config schema.
- Input and Select prop types reference `Field["width"]` rather than redefining the object.

A select field also contains `options`. Every option contains:

- `label`: text displayed to the user.
- `value`: value stored and submitted.

Render mapping:

```text
Field.type = "Input"  → render reusable Input
Field.type = "Select" → render reusable Select
```

### Config performance

- Import the static JSON once at module scope.
- `ConfigContext` passes the imported array reference directly; do not spread, clone, or rebuild it during render.
- `useConfig("commissionQuote")` uses `find` because the MVP contains one config item.
- Use `field.name` as the stable React key when rendering `config.value`.
- Do not add `Map`, caching, `useMemo`, or `React.memo` for this static one-item config.
- Loading and caching remote config is outside the MVP scope.

## 5. Reusable field contract

Input and Select are controlled components. Each receives:

- `field`
- `value`
- `error`
- `disabled`
- `onChange`
- `onBlur`

The `field` prop supplies `name`, `label`, `width`, `isRequired`, `requiredErrorMessage`, `validation`, and the type-specific presentation metadata from config.

Every field change returns the same metadata shape:

```text
{
  name,
  value
}
```

- `name` must match a property in `CommissionQuoteRequest`.
- The component displays its configured label and required state from `field`.
- Input and Select each use `field.width` on their own outer `GridItem`; `CommissionQuoteForm` must not add a second field wrapper.
- The component displays the error provided by its parent.
- On blur, the component calls `validateField(field, value)`, then calls `onBlur(field.name, error)`; the Form stores the returned error and marks the field as touched.
- If the component currently has an error, it revalidates on change and includes the new error or `undefined` in `onChange(field, error)`.
- The component does not own the form's business values.

## 6. Form data flow

`CommissionQuoteForm` stores the current values as a local metadata list:

```text
[
  { name: "loanAmount", value: 500000 },
  { name: "loanTermInMonths", value: 360 },
  { name: "riskBand", value: "LOW" }
]
```

- Initialise the list from `config.value` in the same order with one `{ name: field.name, value: null }` item per field.
- Local `useReducer` owns the metadata list and field errors.
- One generic change handler dispatches an update by `name`.
- The handler always dispatches `UPDATE_FIELD`. If that field already has an error, it also dispatches `SET_FIELD_ERROR` with the revalidated error or `undefined` supplied by the component.
- The generic blur handler dispatches `SET_FIELD_ERROR` with the component's validation result.
- No field-specific change handlers are required.
- `hasErrors` is derived with `Object.values(errors).some(Boolean)`; it is not stored separately.
- `validateField.ts` contains the single shared field-validation function.
- Its exact signature is `validateField(field: Field, value: FieldValue): string | undefined`.
- If `value` is `null`, return `requiredErrorMessage` only when `isRequired` is true.
- For `Input`, enforce the configured `min`, `max`, `integer`, and `maxDecimalPlaces` rules when present.
- For `Select`, require the value to match one of `field.options[].value`.
- Return `validation.errorMessage` for any non-required failure; otherwise return `undefined`.
- Input and Select call `validateField()` for their client-side validation; `validateForm()` calls the same function for every configured field.
- `validateField()` returns the configured error message or `undefined`; it does not update React state.
- After successful validation, the Form passes the metadata list to `mapCommissionQuoteRequest()` from `commissionQuoteRequestMapper.ts`.
- Its exact signature is `mapCommissionQuoteRequest(values: FieldMetadata[]): CommissionQuoteRequest`.
- The mapper converts the generic metadata list into `CommissionQuoteRequest`:

```text
{
  loanAmount: 500000,
  loanTermInMonths: 360,
  riskBand: "LOW"
}
```

- The mapper performs mapping only; it does not validate fields or call the API.
- The mapper finds values by metadata `name`, never by array position.
- `CommissionQuoteForm` calls `onSubmit(requestDto)` only after validation and mapping succeed.
- The Generate quote button is disabled when `hasErrors` is true or the Page reports loading.
- An untouched empty form has no displayed errors, so its button is enabled; selecting **Generate quote** runs full-form validation, stores required errors, and disables the button.
- Correcting every displayed error clears `hasErrors` and restores the button.

### Client-side validation timing

- Do not display an error while the user is entering a field for the first time.
- When a field loses focus, validate it and display its inline error when invalid.
- Once a field has an error, revalidate it on every change and clear the error immediately when the value becomes valid.
- A field displays only its own error.
- An empty required field uses `requiredErrorMessage`.
- Any other invalid value uses `validation.errorMessage`.
- No debounce timer is required; blur defines when the user has finished the first editing attempt.

### Full-form validation

```text
Generate quote / Future Next
→ validateForm()
→ validate every configured field
```

1. `validateForm()` checks every field in `config.value`, including untouched fields.
2. Each empty required field receives its configured `requiredErrorMessage`.
3. Each non-empty invalid field receives its configured `validation.errorMessage`.
4. Each reusable field displays the error associated with its own `name`.
5. If any field is invalid, do not call `onSubmit` and do not navigate.
6. If every field is valid, create `CommissionQuoteRequest` and continue with Generate quote or a future Next action.

## 7. Page layout

The page uses the existing Grid system:

```text
Grid
├── GridItem: page-level error
├── GridItem: configured field
├── GridItem: configured field
├── GridItem: configured field
├── GridItem: Generate quote button
└── GridItem: quote result
```

- Every dynamically rendered field has its own `GridItem` wrapper.
- `Grid.ts` exports the shared styled `Grid` and `GridItem`.
- `Grid` uses 12 equal columns.
- `GridItem` receives the field's `width` object.
- At the `xs` breakpoint, use `width.xs` as the column span.
- At the `md` breakpoint and above, use `width.md` as the column span.
- CSS Grid auto-placement determines rows: `6 + 6 = 12` places two items on one row; `12` occupies a full row.
- Do not add a separate row or new-line flag.
- Input and Select fill the width of their own GridItem.
- Field width comes from form config and is passed through the field props.
- The current three fields use `{ "xs": 12, "md": 12 }`, so each appears on its own row.
- Field order comes from the config.
- The button appears after the configured fields.
- The response appears below the button.
- Page-level errors and the response use full-width Grid items.

### Commission quote result

- `CommissionQuoteResult` receives one `CommissionQuoteResponse` through its props.
- Render it only after a successful API response.
- For this MVP, field order and labels are hard-coded in `CommissionQuoteResult.tsx`; do not add result config or Context lookup.
- Display the following fields in this order:
  1. `quoteId` — label: **Quote ID**
  2. `commissionRate` — label: **Commission rate**
  3. `upfrontCommission` — label: **Upfront commission**
  4. `monthlyTrailCommission` — label: **Monthly trail commission**
  5. `totalCommission` — label: **Total commission**
- Display `commissionRate` as a percentage. Example: `0.001` becomes `0.1%`.
- Display commission amounts as AUD currency with exactly two decimal places using `Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" })`.
- Display `quoteId` unchanged.
- Use only values returned by the API; do not recalculate commission in React.
- A config-driven result component is a documented extension, not part of the four-hour MVP.

## 8. Submit flow

1. User changes a field and `CommissionQuoteForm` updates its local value.
2. The field validates on blur; an already-invalid field revalidates on change.
3. User selects **Generate quote**.
4. The Form runs `validateForm()` across every configured field.
5. If any field is invalid, each affected field displays its own error and submission stops.
6. If all fields are valid, the Form creates `CommissionQuoteRequest` and calls `onSubmit(requestDto)`.
7. `CommissionQuotePage` enters loading state and calls the API.
8. The Page renders either the quote response or a page-level error.
9. If the frontend catches an error that has no confirmed status mapping, it renders `UnknownError`.

## 9. Frontend request states

- `idle`: show the form.
- `loading`: disable the button, show **Generating quote...**, and prevent duplicate submission.
- `success`: clear the previous error and show `CommissionQuoteResult`.
- `serviceError`: preserve form values and show a page-level error.
- `unknownError`: replace the form content with `UnknownError`.
- Client validation errors belong to `FormState`, not `RequestState`.
- Every request state after `idle` stores its correlation ID for response logging and error display.
- Request state is local to `CommissionQuotePage` and is destroyed when that route unmounts.

### Mockup-to-state data flow

- `CommissionQuotePage` is the single owner of the current request state, API response, page-level error, and whether `UnknownError` replaces the form content.
- `CommissionQuoteForm` owns field values and field errors. It receives `isLoading` and optional API `fieldErrors` from the Page.
- When API `fieldErrors` change, the Form copies them into its local reducer by field `name`. Editing a field clears that field's API error and resumes the normal client-validation flow.
- Page-level alerts are rendered directly by `CommissionQuotePage` and styled in `CommissionQuotePage.styles.ts`; do not add another alert component or file.
- The loading result placeholder is rendered by the Page; do not pass incomplete data to `CommissionQuoteResult`.

State transitions:

1. **Idle:** render the configured form with no result or page-level error.
2. **Client validation error:** `validateForm()` stores required or validation messages in the Form reducer; render them below their matching controls and do not call the API.
3. **Loading:** create the correlation ID, clear the previous result and page-level error, preserve field values, disable all controls, call `commissionQuoteApi`, and render the approved loading button, note, and result placeholder.
4. **200 success:** store the returned `CommissionQuoteResponse`, clear errors, restore the controls, and render `CommissionQuoteResult` using only the response data.
5. **400:** preserve values, pass returned `fieldErrors` to the Form, and display the returned `error.message` in the page-level alert.
6. **401:** preserve values, restore the controls, and display the returned API-key `error.message` in the page-level alert.
7. **503:** preserve values, restore the controls, and display the service-unavailable message in the page-level alert.
8. **Request timeout:** abort the request, preserve values, restore the controls, and display the timeout message in the page-level alert.
9. **500 or unrecognised caught error:** log with the correlation ID and replace the form content with `UnknownError`.
10. **Frontend route `*`:** React Router renders `NotFound`; this is separate from an API `404` response.
11. **API 404:** preserve the form and display the returned `error.message` in the page-level alert; do not navigate to `NotFound`.

- `AppHeader` and `AppFooter` remain visible for every state because they are outside the route switch.
- A new submission clears the previous result and page-level alert before entering loading.
- Do not render stale quote values after a new submission, API error, timeout, or unknown error.

## 10. API error and timeout handling

- Do not implement staff login, OIDC, an API-key input, or an authentication route.
- Commit `code/frontend/.env.example` containing `VITE_COMMISSION_QUOTE_API_KEY=local-demo-key`.
- Commit `code/backend/.env.example` containing `COMMISSION_QUOTE_API_KEY=local-demo-key` and an unset `MOCK_API_ERROR_CODE` example.
- The reviewer copies each `.env.example` to `.env`; both local values must match for successful requests.
- Ignore all real `.env` files in Git. Do not commit a real credential.
- `commissionQuoteApi.ts` reads `VITE_COMMISSION_QUOTE_API_KEY` and automatically sends it as the `api-key` header.
- The Mock API reads `COMMISSION_QUOTE_API_KEY` and compares it with the header before validation and calculation.
- A `VITE_` value is visible in the browser bundle, so the local demo key is not treated as a production secret.
- In production, keep the Vendor API key behind a BFF or API gateway and supply it through the platform's secret management. Do not implement that infrastructure for this task.
- `400`, `401`, and API `404`: display the API's returned user-readable `error.message`.
- `400`: also map returned `fieldErrors` to the matching component `name`.
- `401`: do not show a login prompt.
- The Mock API reads the optional `MOCK_API_ERROR_CODE` environment variable.
- `MOCK_API_ERROR_CODE=500` returns `500 INTERNAL_ERROR`.
- `MOCK_API_ERROR_CODE=503` returns `503 SERVICE_UNAVAILABLE`.
- When `MOCK_API_ERROR_CODE` is unset, do not force an API error.
- `500`: render `UnknownError` using the request correlation ID.
- `503`: show **The quote service is temporarily unavailable. Please try again later.** using the same page-level alert placement as timeout.
- Timeout is a frontend-generated `REQUEST_TIMEOUT` condition, not an HTTP `4xx` or `5xx` response.
- The Axios instance enforces the 60-second timeout. Map Axios timeout errors (`ECONNABORTED` or `ETIMEDOUT`) to `REQUEST_TIMEOUT` before generic error handling; do not add a second timeout timer.
- `CommissionQuotePage` performs all mappings from Axios `response.status` or `error.code` into `RequestState`; do not map request state inside `commissionQuoteApi.ts`.
- Timeout message: **We couldn't generate the quote. Please try again later.**
- Show the timeout message in the page-level alert, preserve the form values, restore **Generate quote**, and allow retry.
- Record the timeout with the current correlation ID; do not display a status code.
- API-key error message: **We couldn't authenticate the quote request. Please contact your administrator.**
- To demonstrate this scenario manually, start the frontend with a missing or mismatched demo key. Do not add a UI test control.
- To demonstrate error handling, start the backend with `MOCK_API_ERROR_CODE=500` or `MOCK_API_ERROR_CODE=503` and submit a valid form.
- A new submission clears the previous page-level error.
- Input values remain available after `400`, `401`, API `404`, `503`, and timeout so the user can retry.
- `500` and unrecognised caught errors replace and unmount the Form through `UnknownError`; retaining its local values is not required.

### Unexpected frontend error

- `CommissionQuotePage` must catch errors from the API submission flow.
- Any caught error without a confirmed `400`, `401`, `500`, `503`, or timeout mapping must render `UnknownError`.
- `UnknownError` displays **Something went wrong.**, then **Please contact your administrator.**, then the smaller **Correlation ID: {correlationId}** text.
- Use the current request correlation ID; if none exists, generate one with `crypto.randomUUID()`.
- Log the error before rendering the page.
- Do not display the caught error message, stack trace, or technical details to the user.
- Do not only log the error or leave the page in loading state.

## 11. Frontend logging

- Do not create a custom logger service or wrapper.
- Each file that emits logs imports the selected logging library directly and calls its static `info`, `error`, or equivalent method.
- Components do not call `console` directly.
- `CommissionQuotePage.tsx` creates the config-error correlation ID with `crypto.randomUUID()`, records `CONFIG_NOT_FOUND` through the logging library, and passes the same ID to `UnknownError`.
- `commissionQuoteApi.ts` records request, response, API failure, and timeout logs through the logging library.
- In this MVP, frontend library logs are written only to the user's browser developer console.
- Frontend logs are not sent to the API and no separate logging endpoint is added.
- Every error log contains `level`, `event`, and `message`.
- Use only these frontend event names: `CONFIG_NOT_FOUND`, `QUOTE_REQUEST_STARTED`, `QUOTE_REQUEST_SUCCEEDED`, `QUOTE_REQUEST_FAILED`, `QUOTE_REQUEST_TIMEOUT`, and `UNEXPECTED_FRONTEND_ERROR`.
- `correlationId` is optional in `LogEntry`.
- Logging must never throw or interrupt the user flow because a correlation ID is unavailable.
- Each valid quote submission creates a new UUID for that HTTP request.
- Store it only in the current page request state; do not use Context, `localStorage`, or `sessionStorage`.
- Use the same correlation ID for the frontend request log, HTTP request, response log, and error or timeout log.
- `commissionQuoteApi.ts` sends it in the `x-correlation-id` request header so backend logs can join the same trace.
- The backend endpoint reads `x-correlation-id`; if the header is missing, it creates a UUID.
- The backend uses the resolved correlation ID for all request logs and returns it in the `x-correlation-id` response header, including error responses.
- The frontend reads the response header and uses that correlation ID for the response log.
- Config errors generate one stable correlation ID for that rendered error and pass it to `UnknownError`.
- A config error has no backend request; in this MVP its matching log exists only in the browser console.
- In a production application, the same logging calls can be configured with a remote frontend collector such as the organisation's monitoring platform. Remote collection is outside this MVP.
- Log API failure, timeout, and unexpected frontend errors.
- Do not log the API key, full form values, or full request/response bodies.
- Frontend logging library: `loglevel`.
- Correlation-ID generator: browser-native `crypto.randomUUID()`.

## 12. Styling boundary

### Current UI reference

- Success-state visual source of truth: [commission-quote-layout.html](/Users/shenqiuzhang/Documents/BEN Coding Task/docs/commission-quote-layout.html).
- Validation, loading, timeout, service-unavailable, authentication, frontend-route 404, and unexpected-error visual source of truth: [commission-quote-state-layouts.html](/Users/shenqiuzhang/Documents/BEN Coding Task/docs/commission-quote-state-layouts.html).
- Implement the mockup's current layout, component proportions, spacing, typography, colours, borders, and responsive behaviour.
- Initialise `theme.ts` from the values shown in this mockup.
- The current theme is fixed light mode with white page and surface backgrounds.
- The primary plum colour is `#870E40`.
- Keep the mockup's existing font family, font sizes, and font weights unchanged.
- Mockup measurement labels and state labels are documentation only. Do not render them in the application.
- Mockup field and result values are illustrative. Do not prefill the form, copy example results into state, truncate `quoteId`, or add input masking; keep the approved numeric inputs and format only returned result values.
- Implement the actual heading, introduction, fields, Generate quote button, and quote result card shown inside the mockup.
- Render a field error directly below its own control in `12px` error text; use the same placement for required and validation errors, changing only the configured message.
- Render page-level API errors below the introduction and above the fields.
- During loading, preserve and disable the field controls; disable the button and show a spinner with **Generating quote...**.
- Directly below the loading button, show the small plain-text message: **We are generating your commission quote. This may take a moment.**
- Below the loading message, show an empty result container with centered **Loading...** as its only content. Do not show the `Quote result` heading until a result exists.
- Do not show old or partial quote values during loading.
- After timeout or authentication failure, preserve the field values, restore **Generate quote**, and do not show a result.
- `NotFound` and `UnknownError` use the centered, minimal layouts shown in the state mockup.
- A later approved design replaces this visual reference; it must not change form config, DTOs, validation, calculation, routing, or API behaviour.

- Use `styled-components` for component styles and page layout.
- Use `ThemeProvider` at the app root.
- `theme.ts` is the single source for colours, typography, spacing, border radii, and breakpoints.
- `styled.d.ts` defines the typed styled-components theme.
- `GlobalStyle.ts` contains only the global reset, body defaults, and base typography.
- `Grid.ts` contains the shared 12-column responsive Grid and GridItem styled components.
- `CommissionQuotePage` remains a normal React functional component; do not define the page itself as a styled-component.
- `CommissionQuotePage.tsx` owns page behaviour, data flow, rendering, and API state.
- `CommissionQuotePage.styles.ts` owns page-specific container width, padding, and section spacing.
- The Page follows `GlobalStyle` and theme tokens and composes the shared `Grid` and `GridItem` for layout.
- Input, Select, Button, and other reusable UI components define their private styled elements in the same `.tsx` file.
- `AppHeader.tsx`, `AppFooter.tsx`, `Input.tsx`, `Select.tsx`, `Button.tsx`, `CommissionQuoteForm.tsx`, `NotFound.tsx`, `UnknownError.tsx`, and `CommissionQuoteResult.tsx` each keep their component-specific styled elements in that same file.
- Do not create a separate `.styles.ts` file for those components.
- A page-only wrapper may be a local styled element when needed, but it is not exported as a reusable component.
- Do not use CSS Modules, inline styles, or hard-coded brand colours and fonts inside `.tsx` files.

### Branding and logo

- `AppHeader.tsx` renders the application header and imports `assets/brand-logo.svg`.
- `brand-logo.svg` is a project-created circular monogram containing an original white geometric letter `B` on a plum background.
- The circular badge distinguishes the logo from rectangular application buttons.
- `AppHeader` is a simple full-width bar with a bottom border.
- It displays the non-interactive context `Home loans / Commission quote` beside the logo.
- `Commission quote` uses the primary plum colour to identify the current page.
- The header contains no links, buttons, menus, or navigation behaviour.
- Do not add a progress bar: this MVP contains one page and no confirmed multi-step journey.
- Do not download, trace, or imitate the real Bendigo Bank logo, and do not embed a third-party font or graphic asset in the placeholder.
- Styled elements inside `AppHeader.tsx` control logo dimensions, alignment, and header spacing.
- Replacing `brand-logo.svg` changes the logo without modifying the form, page, validation, or API code.
- A logo with different dimensions may require only an adjustment to the styled logo element in `AppHeader.tsx`.
- The current mockup provides the default colours and fonts. A replacement logo, colours, or fonts may be supplied later.

### Change boundaries

- Change colours, typography, spacing, radii, or breakpoints in `theme.ts`.
- Change one component's presentation in its local styled-component definitions.
- Change commission-quote page-specific layout in `CommissionQuotePage.styles.ts`.
- Change field widths in form config; change shared grid behaviour in `Grid.ts`.
- Change the logo by replacing `assets/brand-logo.svg`.
- Styling or branding changes must not modify form config, DTOs, validation, calculation, or API behaviour.

## 13. Backend stack and structure

### Libraries

- Node.js + Express + TypeScript.
- `zod` for request schema validation.
- Pure TypeScript functions for business-rule validation and commission calculation.
- `pino` and `pino-http` for structured backend logging and request-scoped correlation.
- `cors` for local browser access.
- `dotenv` for local backend environment variables.
- `tsx` for the development watcher.
- `jest` is the only testing dependency.
- Do not install Supertest, ts-jest, another test runner, or another mocking library.

### Required backend file structure

```text
code/backend/
├── .env.example
├── eslint.config.js
├── openapi.yaml
├── package.json
├── package-lock.json
├── tsconfig.json
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── middleware/
│   │   ├── apiKeyAuth.ts
│   │   ├── errorHandler.ts
│   │   ├── httpLogger.ts
│   │   └── notFound.ts
│   ├── routes/
│   │   └── createCommissionQuoteRoute.ts
│   ├── schemas/
│   │   └── commissionQuoteSchema.ts
│   └── services/
│       └── commissionQuoteService.ts
└── test/
    ├── commissionQuoteService.test.js
    └── createCommissionQuoteRoute.test.js
```

- `app.ts` creates and exports the named Express application `app` without listening on a port, so `server.ts` and the compiled endpoint test use the same instance.
- `server.ts` loads local environment variables and listens on `PORT`.
- Before listening, `server.ts` requires a non-empty `COMMISSION_QUOTE_API_KEY` and accepts only an unset, `500`, or `503` `MOCK_API_ERROR_CODE`; invalid server configuration fails startup.
- `httpLogger.ts` configures `pino-http`, resolves the correlation ID, attaches the request-scoped logger, and sets the response correlation header.
- `apiKeyAuth.ts` compares the `api-key` header with `COMMISSION_QUOTE_API_KEY`.
- `apiKeyAuth.ts` must reject a missing request header and must never treat two missing values as a match.
- `createCommissionQuoteRoute.ts` is the only endpoint file. It defines `POST /api/commission-quotes`, applies request-schema validation, calls the service's business validator, applies the configured mock error, calls the service's quote creator, and maps the successful HTTP response.
- Do not add a separate Controller for this one-endpoint MVP.
- `commissionQuoteSchema.ts` exports the strict Zod request schema, its inferred `CommissionQuoteRequest`, `CommissionQuoteResponse`, and `CommissionQuoteFieldErrors = Partial<Record<keyof CommissionQuoteRequest, string>>` matching `openapi.yaml`.
- `commissionQuoteService.ts` exports `validateCommissionQuoteBusinessRules(request: CommissionQuoteRequest): CommissionQuoteFieldErrors | undefined`.
- `commissionQuoteService.ts` exports `createCommissionQuote(request: CommissionQuoteRequest): CommissionQuoteResponse`.
- `commissionQuoteService.ts` contains the pure business validator, risk mapping, currency calculation, UUID creation, and response creation. It does not read environment variables and has no Express `req` or `res` dependency.
- `notFound.ts` returns the safe API `404` error envelope.
- `apiKeyAuth.ts` returns the approved `401` envelope directly.
- `createCommissionQuoteRoute.ts` returns approved schema/business `400` and configured mock `500`/`503` envelopes directly.
- `errorHandler.ts` is the final Express middleware. It maps malformed JSON to the approved `400` envelope and every otherwise-unhandled exception to the approved `500` envelope without exposing stack traces.
- Each endpoint gets its own route file. Future endpoints must not be added to `createCommissionQuoteRoute.ts`.

### Validation boundary

- Zod schema validation checks that the JSON body is a strict object with all required fields, correct primitive types, integer `loanTermInMonths`, and a valid `riskBand` enum.
- Business-rule validation checks the confirmed amount, decimal-place, term-range, and risk rules before calculation.
- Validate at most two amount decimals with `Math.round(loanAmount * 100) / 100 === loanAmount`; do not use `Number.isInteger(loanAmount * 100)`, which can reject valid decimals because of binary floating-point representation.
- After validation, convert once with `loanAmountCents = Math.round(loanAmount * 100)` and perform commission rounding in integer cents. Convert cents back to AUD numbers only when creating the response DTO.
- The API is authoritative. Calling it directly from Postman applies the same required-field and business validation as the UI flow.
- Both validation layers return `400 VALIDATION_ERROR` with user-readable `fieldErrors` keyed by DTO field name.
- Do not return raw Zod messages. Map missing fields to their approved `requiredErrorMessage` and other invalid values to their approved `validation.errorMessage` from the Functional Spec/form config.
- Every `400` uses the top-level message `Check the loan details and try again.`; malformed JSON may omit `fieldErrors`.
- Schema and business validation must match `openapi.yaml`, Functional Spec, and frontend rules.

### Middleware and service order

```text
request
→ pino-http correlation and request logging
→ CORS
→ API-key authentication
→ express.json()
→ Zod request schema validation
→ business-rule validation
→ MOCK_API_ERROR_CODE handling
→ commission calculation
→ success response
```

After registering the quote route, `app.ts` registers `notFound` and then `errorHandler`. Any unhandled stage that throws or passes an error ends in `errorHandler`; a request that matches no route ends in `notFound`.

- Correlation/logging runs first so every response, including `401`, has the correlation ID and request log.
- `apiKeyAuth` runs before `express.json()`; an unauthenticated malformed request returns `401`, not `400`.
- Schema and business-rule failures stop before mock-error handling and calculation.
- `MOCK_API_ERROR_CODE=500` or `503` stops before calculation and returns the configured error.
- Only a fully authenticated and validated request with no configured mock error reaches calculation.

### Backend logging and correlation

- `pino-http` uses `genReqId` to accept `x-correlation-id` only when it is a valid UUID; when missing or invalid, generate a UUID with `node:crypto.randomUUID()`.
- Set the resolved value on the `x-correlation-id` response header before calling the next middleware.
- Use the request-scoped Pino logger for route and error logs so every entry contains the same request ID.
- Log request completion with method, path, status, response time, and correlation ID.
- Log `4xx` at `warn`, `5xx` and unexpected exceptions at `error`, and successful requests at `info`.
- Write structured JSON logs to stdout so logs from multiple pods can be collected centrally.
- Do not log the API key, full request body, full response body, or stack trace in the HTTP response.
- A Postman request may omit `x-correlation-id`; the API generates and returns one.

## 14. Ports, CORS, and local API access

- Frontend URL: `http://localhost:3000`.
- Backend URL: `http://localhost:5000`.
- Vite must use port `3000` with `strictPort: true`.
- Backend uses `PORT=5000` from `code/backend/.env.example`.
- The Axios base URL is `http://localhost:5000` through `VITE_COMMISSION_QUOTE_API_BASE_URL`.
- Use application-level `cors()` with origin `*` for this local MVP and do not enable credentials.
- Allow `POST` and `OPTIONS`; allow `Content-Type`, `api-key`, and `x-correlation-id` request headers.
- Expose `x-correlation-id` so the browser can read it from the response.
- Postman can call `http://localhost:5000/api/commission-quotes` directly; CORS does not restrict non-browser clients.

## 15. npm scripts and local orchestration

Code-workspace `code/package.json`:

```text
npm run dev          → run UI and API together with concurrently
npm run dev:ui       → run only frontend
npm run dev:api      → run only backend
npm run format       → apply Prettier to frontend/src, backend/src, and backend/test
npm run format:check → verify formatting without changing files
```

- Run these scripts from `code/`.
- The code-workspace `dev` script uses the local `concurrently` dev dependency and stops both processes when either one fails.
- `dev:ui` runs `npm --prefix frontend run dev`.
- `dev:api` runs `npm --prefix backend run dev`.
- `format` and `format:check` use `code/.prettierrc.json` and do not rewrite reviewed Markdown, HTML mockups, SVG, or OpenAPI.
- Use the valid npm syntax `npm run dev:ui` and `npm run dev:api` in documentation and scripts.

Backend `package.json`:

```text
npm run dev    → tsx watch src/server.ts
npm run build  → tsc -p tsconfig.json
npm start      → node dist/server.js
npm test       → npm run build, then run jest against backend/test
npm run lint   → eslint src --max-warnings=0
```

- `code/backend/eslint.config.js` is the flat ESLint configuration for backend TypeScript source files; do not add a Jest ESLint plugin for the two plain-JavaScript tests.
- Backend tests are plain JavaScript and import the compiled CommonJS modules from `code/backend/dist`.
- `commissionQuoteService.test.js` covers the approved successful calculation.
- `createCommissionQuoteRoute.test.js` starts the compiled Express app on an ephemeral port, sends a valid request with Node's built-in `fetch`, asserts `200`, the response contract, and correlation header, then closes the server.
- Both tests use the canonical `500000 / 360 / LOW` request and expected values documented in the Functional Spec/OpenAPI example; assert `quoteId` by UUID shape, not a fixed value.
- The endpoint test sets `COMMISSION_QUOTE_API_KEY` and clears `MOCK_API_ERROR_CODE` before importing or starting the compiled app.
- Do not add tests for error scenarios or frontend implementation within the four-hour scope.
