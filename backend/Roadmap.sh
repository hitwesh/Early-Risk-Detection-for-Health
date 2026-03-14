#!/usr/bin/env bash
# Roadmap for backend development.
# Treat this as a living specification for milestones, scope, and acceptance criteria.

cat <<'ROADMAP'
Roadmap: Backend Development Bible
=================================

Version: 1.0
Maintainer: Backend Team
Last Updated: 2026-03-14

Milestone 1 -> Project Foundation
---------------------------------
Objective:
- Establish the backend project baseline so development is consistent and reproducible.

Scope:
- Define repository layout and ownership of backend modules.
- Confirm environment configuration keys and defaults.
- Agree on local dev workflow and basic run commands.

Key Deliverables:
- Backend folder structure is stable and documented.
- Environment configuration file exists with initial keys.
- FastAPI entry point exists and can start locally.

Acceptance Criteria:
- `uvicorn main:app --reload` runs without errors from the backend folder.
- Root endpoint returns a simple JSON payload.
- No unexpected imports or missing files.

Milestone 2 -> Core Backend Infrastructure
------------------------------------------
Objective:
- Implement the internal wiring needed for clean architecture and dependency boundaries.

Scope:
- Core configuration loader (env settings) and structured logging.
- Database session management and base model setup (SQLAlchemy).
- Database migration system (Alembic).
- Core error handling patterns and dependency injection stubs.

Key Deliverables:
- Config module reads .env values and exposes typed settings.
- Logger module provides consistent log formatting and levels.
- Database module provides engine/session and base metadata.

Acceptance Criteria:
- App can import config, logger, and db modules without circular dependencies.
- Database session can be created and disposed safely.
- Logging is visible during application startup.

Milestone 3 -> Authentication & Users
-------------------------------------
Objective:
- Provide secure user access and role management for the API.

Scope:
- User model, schema, repository, and service layers.
- JWT-based authentication and password hashing.
- Role-based access control (RBAC) for user vs admin.

Key Deliverables:
- Auth routes for register, login, and token refresh.
- User CRUD endpoints limited by role.
- Secure password storage and validation.

Acceptance Criteria:
- Users can register and login to receive a token.
- Protected routes require valid tokens.
- Admin-only endpoints reject non-admins.

Milestone 4 -> AI Model Integration
-----------------------------------
Objective:
- Connect the API to the existing AI model artifacts and inference pipeline.

Scope:
- Model loader that reads model and label artifacts from ai-model.
- Inference service that accepts symptom vectors and returns predictions.
- Input validation and preprocessing integration.

Key Deliverables:
- AI service that exposes a single inference function.
- Model is loaded once at startup, not per request.
- Errors are surfaced clearly to API callers.

Acceptance Criteria:
- Health check confirms model is loaded.
- Inference returns deterministic top-k predictions for known inputs.
- Invalid input is rejected with a clear error.

Milestone 5 -> Diagnosis API
----------------------------
Objective:
- Deliver the public API endpoints used by the frontend for diagnosis flow.

Scope:
- Diagnosis model, schema, repository, and service.
- Endpoints for submitting symptoms and fetching results.
- Optional question-engine integration for follow-ups.
- API versioning strategy and v1 route ownership.

Key Deliverables:
- POST endpoint that accepts symptoms and returns predictions.
- Endpoint to get or list diagnosis history per user.
- Data persistence for diagnosis requests.

Acceptance Criteria:
- Requests validate and store input, then return predictions.
- History endpoint returns only the requesting user's data.
- Errors are consistent with API standards.

Milestone 6 -> Production Readiness
-----------------------------------
Objective:
- Harden the API and operational features for real-world use.

Scope:
- Centralized error handling and standardized responses.
- JWT validation and input sanitization standards.
- Rate limiting and request size guards (if required).
- Basic observability: structured logs and metrics hooks.

Key Deliverables:
- Global exception handlers and consistent error payloads.
- Security headers and CORS configuration.
- Health and readiness endpoints.

Acceptance Criteria:
- Linting and tests pass with no critical warnings.
- App can start with production config without manual tweaks.
- Logs contain request context identifiers.

Milestone 7 -> Testing
----------------------
Objective:
- Ensure the backend behaves correctly under expected scenarios.

Scope:
- Unit tests for services and repositories.
- Integration tests for API endpoints.
- Validation of authentication and protected routes.

Key Deliverables:
- Test suite using pytest.
- Example fixtures for database setup.
- API tests for critical endpoints.

Acceptance Criteria:
- Tests run successfully with pytest.
- Core endpoints have coverage.
- Test database can run independently of production data.

Milestone 8 -> Deployment
-------------------------
Objective:
- Provide repeatable deployment pipelines for staging and production.

Scope:
- Docker containerization and environment variable wiring.
- Optional Kubernetes manifests for scaling.
- CI/CD pipeline setup (GitHub Actions).

Key Deliverables:
- Dockerfile and compose workflow for local containers.
- Deployment docs with env variables and run commands.
- Release checklist for versioned deployments.

Acceptance Criteria:
- Container starts and serves API on configured port.
- Deployment docs are sufficient for a fresh machine setup.
- No secrets are committed to the repo.

Operating Rules
---------------
- Follow the existing folder boundaries in backend/app.
- Keep services thin and move persistence into repositories.
- Avoid new dependencies unless necessary and approved.
- Update CHANGELOG.md for every change.

ROADMAP
