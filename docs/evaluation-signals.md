# Evaluation Signals

The brief does not require a production-ready application. The target is a working four-hour solution that demonstrates production-aware engineering judgement.

- **Requirement judgement:** Separate brief requirements from accepted assumptions and define a clear MVP scope.
- **Domain judgement:** Use a small, explicit commission model without presenting it as real underwriting logic.
- **Architecture judgement:** Compare direct API, BFF, and Kong-backed options; select UI + one API for the timebox.
- **API design:** Define a consistent REST contract, schemas, validation, and error envelope.
- **Security awareness:** Model `api-key` authentication correctly; explain the production credential boundary without deploying Kong.
- **Failure design:** Give `400`, `401`, `500`, `503`, and timeout distinct meanings; do not invent unused statuses.
- **UX quality:** Provide clear field errors, loading, success, service error, preserved input, and retry.
- **Test judgement:** Automate the calculation and successful API boundary; manually verify named UI failure paths; avoid coverage for its own sake.
- **Maintainability:** Keep calculation, HTTP handling, authentication, and UI state separate without unnecessary abstractions.
- **Evolvability:** Make the risk-rate rule and API boundary easy to change during the live-coding follow-up.
- **Communication:** Explain setup, assumptions, trade-offs, limitations, next steps, and AI usage in the README.

## Production-aware, not production-built

Implement now:

- Boundary validation.
- API-key authentication behaviour.
- Safe and consistent error responses.
- Accessible UI states.
- Focused automated tests.
- Clear configuration and run instructions.

Explain, but do not build now:

- BFF/Kong credential isolation.
- Enterprise identity and authorisation.
- Persistent quote history and audit storage.
- Rate limiting, retries, circuit breaking, and full observability.
- HA deployment, secrets management, and CI/CD infrastructure.

Staff-level judgement is visible in the boundary between these two lists.

## Sources

- [GitLab Staff Engineering Framework](https://handbook.gitlab.com/handbook/engineering/careers/matrix/staff/)
- [Dropbox Staff Software Engineer Framework](https://dropbox.github.io/dbx-career-framework/ic5_staff_software_engineer.html)
- [System Initiative Software Engineer III Take-home](https://github.com/systeminit/coding-assessment-sde3)
- [Microsoft Research: What Makes a Great Software Engineer](https://www.microsoft.com/en-us/research/publication/appendix-to-what-makes-a-great-software-engineer/)
