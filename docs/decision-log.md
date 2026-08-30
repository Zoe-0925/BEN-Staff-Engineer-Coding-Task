# Decision Log

## D-01 Application boundary

- **Option A — UI → Mock API:** Simplest; demo key is browser-visible.
- **Option B — UI → BFF → Mock API:** Protects the key; adds another API.
- **Option C — UI/BFF → Kong → Mock API:** Production-like; too much setup.

**Decision:** Choose A for the four-hour task.

It meets the brief with the least setup. In production, move the Vendor key behind a BFF/Kong boundary.

## D-02 Authentication scope

**Decision:** Do not add staff login or OIDC. The frontend automatically sends an environment-configured demo API key; the Mock API returns `401` for a missing or mismatched key.

This implements the brief's API-key requirement without inventing a user-authentication flow.

## D-03 Mock failure trigger

- **Option A — Random failure:** Closest literal reading of the brief; unreliable during review.
- **Option B — Environment-controlled failure:** Repeatable and easy to demonstrate.

**Decision:** Choose B. `MOCK_API_ERROR_CODE=500|503` replaces the random trigger while preserving the required failure path.

## D-04 Form state

**Decision:** Use a route-local reducer, not Redux. One page does not need global state; route unmount naturally clears the form. A future cross-route journey can lift confirmed data into shared state.

## D-05 Form definition

**Decision:** Keep field metadata in one static JSON config provided through Context. This demonstrates reusable fields and supports presentation/validation changes without adding a remote config service to the timebox.

## D-06 Styling boundary

**Decision:** Use `styled-components` with a shared theme/Grid and local component styles. Branding changes stay in theme/logo boundaries while reusable components remain self-contained; only the Page keeps a separate style file.

## D-07 Test scope

**Decision:** Use Jest for two backend main-flow tests only: calculation and successful endpoint. Manually verify frontend and named failure states against the approved mockups.
