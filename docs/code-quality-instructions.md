# Commission Quote App - Code Quality Instructions

Status: Ready for implementation

These instructions apply to every generated or edited source file. Requirements, Functional Spec, OpenAPI, and Technical Spec take precedence if a general style rule conflicts with an approved contract.

## 1. Selected baseline

- Use the Google TypeScript Style Guide as the general human-readable baseline.
- Use ESLint for correctness and React rules.
- Use Prettier for formatting only.
- Project-specific rules in this document override general style-guide preferences.
- Do not introduce an alternative style guide or change lint rules to make generated code pass.

Required ESLint baselines:

- Frontend: ESLint recommended, typescript-eslint `recommendedTypeChecked`, React recommended, JSX runtime, and React Hooks recommended.
- Backend: ESLint recommended and typescript-eslint `recommendedTypeChecked`.
- Disable `react/prop-types` because component props are checked by TypeScript; use the JSX runtime config instead of requiring `React` imports.
- Treat warnings as build failures by running ESLint with `--max-warnings=0`.
- Do not lint the two plain-JavaScript Jest files with TypeScript rules.

Reference sources:

- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [typescript-eslint shared configs](https://typescript-eslint.io/users/configs/)
- [React ESLint Hooks rules](https://react.dev/reference/eslint-plugin-react-hooks)
- [React ESLint recommended and JSX runtime configs](https://github.com/jsx-eslint/eslint-plugin-react)

Required Prettier settings:

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "all"
}
```

## 2. Readability and naming

- Prefer code that can be understood without an explanation.
- Use the approved business vocabulary: commission quote, loan amount, loan term, risk band, upfront commission, monthly trail commission, and total commission.
- Do not invent synonyms for an existing domain name.
- Use descriptive English names. Do not use unclear abbreviations, initials, or clever names.
- Approved common technical abbreviations include API, DTO, UI, UUID, HTTP, and JSON.
- Use `PascalCase` for React components and TypeScript types.
- Use `camelCase` for variables and functions.
- Start function names with a verb, for example `validateField`, `mapCommissionQuoteRequest`, and `createCommissionQuote`.
- Start boolean names with `is`, `has`, or `can`, for example `isLoading` and `hasErrors`.
- Use `UPPER_SNAKE_CASE` only for true module-level constants and the already approved event names.
- Do not use vague names such as `data`, `item`, `obj`, `temp`, `value1`, `resultData`, or `handleStuff` when a domain name is available.
- Do not shorten approved names such as `commissionQuote` to `cq` or `loanTermInMonths` to `term`.

## 3. TypeScript

- Do not use `any`.
- Treat caught errors as `unknown` and narrow them before reading their properties.
- Do not use `as` merely to silence a type error. Fix the type or perform a runtime check.
- Avoid the non-null assertion operator `!`. Prove that the value exists through control flow.
- Reuse the approved shared schemas and DTOs. Do not create parallel types with the same meaning.
- Use `import type` when an import is used only as a type.
- Prefer discriminated unions for state already defined that way, including `RequestState` and `FormAction`.
- Handle every approved union case explicitly. An unexpected case must fail clearly during development rather than silently falling through.
- Do not use `enum` when the approved contract uses a string-literal union.
- Do not change public DTO field names, types, or optionality outside a contract review.

## 4. Functions and control flow

- Give each function one clear responsibility.
- Keep business calculations, validation, and mapping in deterministic pure functions.
- Prefer early returns for invalid input and error paths.
- Avoid deep nesting, chained ternaries, hidden mutation, and boolean flags that make one function perform unrelated jobs.
- Do not combine authentication, validation, calculation, HTTP mapping, and logging in one function.
- Pass dependencies and values explicitly. Do not rely on mutable module-level state.
- A function may be longer when keeping one cohesive flow together is clearer than splitting it into artificial one-line helpers.

## 5. Modules and reuse

- Follow the exact file ownership and boundaries in the Technical Spec.
- Reuse the approved stable boundaries: config-driven fields, reusable Input/Select/Button components, schemas, validator, mapper, API service, middleware, and commission service.
- Extract shared code only when it has a clear name and a confirmed second consumer, or when it creates a required test or domain boundary.
- Do not add base components, factories, repositories, dependency-injection containers, generic form frameworks, or wrapper services for possible future use.
- Do not create a general-purpose `utils` dumping ground. The approved utilities are the specifically named `validateField.ts` and `handleRequestError.ts`.
- Do not duplicate business rules or magic values. Each rule must have one clear owner.
- Do not move code across approved boundaries merely to reduce a small amount of repetition.

## 6. React

- Use function components and Hooks.
- Keep rendering pure. Do not mutate props, state, context values, or imported JSON config.
- Keep side effects in event handlers, effects, or the API boundary; never perform requests or logging during render.
- Keep field state and validation inside `CommissionQuoteForm` as specified.
- Keep request state and API orchestration inside `CommissionQuotePage` as specified.
- Do not store state that can be derived clearly from existing state during render.
- Do not add `useMemo`, `useCallback`, `memo`, or refs without a concrete correctness or measured rendering reason.
- Do not define a component inside another component.
- Do not put business logic or API calls in styled components.
- Do not add Redux, another state library, or another form library.

## 7. Node.js and Express

- Keep Express request and response objects inside middleware and the route file.
- Keep `commissionQuoteService.ts` independent of Express and environment variables.
- Use `async`/`await` when asynchronous work exists; do not mix callbacks and promises.
- Return immediately after sending an HTTP response.
- Do not throw for an approved, expected validation outcome when the contract defines a normal error response.
- Let unexpected exceptions reach the final error handler.
- Read and validate environment variables at the approved startup or boundary location only.
- Do not log secrets, API keys, full request bodies, or full response bodies.

## 8. Errors and logging

- Never silently swallow an error.
- A `catch` block must map the error, log and rethrow it, or pass it to the approved error boundary.
- Preserve the original error when `commissionQuoteApi.ts` logs and rethrows an Axios failure.
- UI messages must be safe and user-readable. Internal details belong only in structured logs.
- Use the approved event names and correlation ID behaviour. Do not create alternate event names for the same event.
- Do not use temporary `console.log`; use `loglevel` in the frontend and request-scoped Pino in the backend.

## 9. Comments and documentation

- Write comments only for a non-obvious reason, business assumption, constraint, or trade-off.
- Do not write comments that merely translate the next line into English.
- Do not add large generated comment blocks, decorative section comments, TODOs, or commented-out code.
- Public names and clear control flow should explain normal behaviour without comments.
- When implementation discovers a missing decision, stop and update the relevant artifact before coding it.

## 10. Required cleanup

- Remove unused imports, unused variables, dead code, scaffold demo code, and commented-out alternatives.
- Do not leave placeholder implementations, fake fallback values, or temporary test controls.
- Do not disable ESLint rules inline unless the Technical Spec records the exact reason.
- Do not weaken TypeScript compiler settings to make code compile.
- Formatting, lint, build, and the confirmed tests must pass before final handoff.

## 11. AI self-review before presenting a ticket

Before presenting any implementation ticket for review, verify:

- The implementation changes only files allowed by that ticket.
- Names match the approved domain vocabulary and Technical Spec.
- No new architecture, dependency, schema, route, field, state, or business rule was invented.
- There is no `any`, unsafe type suppression, silent error handling, dead code, or temporary logging.
- Business functions remain pure and HTTP/UI concerns remain at their boundaries.
- Formatting and the relevant lint, build, and test commands pass.
- The diff is small enough for a human to review as one coherent change.
