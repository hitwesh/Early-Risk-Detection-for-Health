# Changelog

- All notable changes to this project are documented here.
- Add your name and date along with timestamp
- Do not skip changelog updataion at any cost.
- Thoroughly explain about your features and changes committed.
- Always add changes on the top of previous changes, do not break this.

## 2026-03-15 01:33pm (Added by Hitesh)

### Changed

- Hid the admin navigation link for non-admin users and redirected /admin to user/login when unauthorized.

### 2023-03-15 01:29pm (Added by Hitesh)

### Changed

- Added admin-only endpoints for stats and user histories and replaced the Admin Panel with live data and drill-down views.

## 2026-03-15 01:11pm (Added by Hitesh)

### Changed

- Stored diagnosis history timestamps as timezone-aware UTC and serialized them with timezone info for correct local display.

## 2026-03-15 01:08pm (Added by Hitesh)

### Changed

- Made user diagnosis history scrollable and clickable with per-entry detail and confidence chart views.

## 2026-03-15 01:03pm (Added by Hitesh)

### Changed

- Defaulted diagnosis sessions to use Bayesian updates with entropy-based question selection and updated engine labels.

## 2026-03-15 12:52pm (Added by Hitesh)

### Changed

- Added auth headers to diagnosis requests and redirected unauthenticated users to login before loading the user dashboard.

### Changed

- Fixed backend circular import by moving model registration into app startup before metadata creation.

### Changed

- Persisted diagnosis history in the backend and connected the User Panel to the RBAC-protected history endpoint.

## 2026-03-15 12:32pm (Added by Hitesh)

### Changed

- Mapped frontend API calls to backend auth and diagnosis routes with aligned payload fields and response parsing.

## 2026-03-15 12:24pm (Added by Hitesh)

### Changed

- Added a default JWT secret in backend settings to prevent startup validation failures when JWT_SECRET is missing.

## 2026-03-15 11:56am (Added by Hitesh)

### Added

- Added Frontend branch's Vite + React + Tailwind frontend scaffold with routing, core pages (Landing, Diagnosis, Results, User/Admin panels), and basic auth flows.
- Added Frontend branch's frontend UI components and charts to present diagnosis predictions, follow-up questions, and explainable symptom insights.

### Changed

- Moved .dockerignore to the repository root and expanded Docker build context exclusions.

### Changed

- Changed the CHANGELOG.md to match the correct working workflow between main branch and Frontend branch.

## 2026-03-15 11:33pm (Added by Hitesh)

### Changed

- Moved .dockerignore to the repository root and expanded Docker build context exclusions.

## 2026-03-15 10:51am (Added by Tamoghno)

### Added

- Added PDF report generation service and diagnosis report download endpoint.


## 2026-03-15 04:14am (Added by Debadrita)

### Changed

- Replaced the generic dashboard with new User Panel and Admin Panel views, updating navigation and routes accordingly.

## 2026-03-15 04:10am (Added by Tamoghno)

### Changed

- Optimized backend Dockerfile with multi-stage build and minimal source copy.

## 2026-03-15 03:58am (Added by Tamoghno)

### Changed

- Expanded backend .dockerignore to exclude build outputs, coverage, and env files.

## 2026-03-15 03:51am (Added by Debadrita)

### Changed

- Rewrote the Diagnosis page to restore clean JSX structure while preserving existing state, payloads, and AI question flow.
- Replaced diagnosis select fields with a custom dropdown component for consistent hover styling and animations.

## 2026-03-15 03:43am (Added by Tamoghno)

### Added

- Added backend .dockerignore to reduce Docker build context size.

## 2026-03-15 03:28am (Added by Tamoghno)

### Changed

- Removed obsolete docker-compose version field to silence compose warnings.

## 2026-03-15 03:22am (Added by Debadrita)

### Changed

- Applied glassmorphism styling, hover animations, and consistent spacing to landing, diagnosis, and dashboard pages to match auth UI styling.

## 2026-03-15 03:15am (Added by Debadrita)

### Changed

- Removed frontend route gating so all pages are publicly accessible while keeping auth pages for demo use.

## 2026-03-15 02:43am (Added by Debadrita)

### Changed

- Refined auth UI with glassmorphism cards, gradient backgrounds, animated buttons, and improved navbar auth display.

## 2026-03-15 02:41am (Added by Tamoghno)

### Added

- Added backend Dockerfile and root docker-compose for containerized runs.
- Added deployment guide with Docker build/run steps.

### Changed

- Updated backend .env with JWT defaults for container configuration.
- Updated .gitignore to exclude local database files and pytest cache.

## 2026-03-15 02:16am (Added by Debadrita)

### Added

- Implemented frontend authentication with Register and Login pages using JWT storage in localStorage.
- Protected diagnosis, results, and dashboard routes using a ProtectedRoute gate.

## 2026-03-15 02:16am (Added by Tamoghno)

### Changed

- Updated auth tests to use unique emails for repeatable test runs.

### Changed

- Fixed a syntax error in settings configuration initialization.

### Changed

- Updated Pydantic settings and schemas to non-deprecated config patterns.
- Replaced FastAPI startup event with lifespan handler to remove deprecation warnings.

### Added

- Added backend test suite scaffolding with pytest client and core API tests.

## 2026-03-15 01:39am (Added by Tamoghno)

### Added

- Added global API exception handling with standardized error payloads.
- Added request ID and security header middleware for production diagnostics.
- Added health and readiness endpoints for operational checks.

### Changed

- Added CORS and trusted host middleware to improve deployment readiness.

## 2026-03-15 12:20pm (Added by Tamoghno)

### Changed

- Trimmed backend requirements.txt to only the packages used by the current backend code.

## 2026-03-15 12:10am (Added by Debadrita)

### Changed

- Refactored the Diagnosis page to use structured patient intake, AI question flow, progress tracking, and engine reporting instead of free-text symptoms.

## 2026-03-14 11:37pm (Added by Tamoghno)

### Added

- Added interactive diagnosis session storage and endpoints for start, answer, and result.

### Changed

- Added vector-based diagnosis inference for session results.

## 2026-03-14 11:28pm (Added by Debadrita)

### Changed

- Expanded the landing page with hero, how-it-works, and key features sections with a Start Diagnosis CTA.
- Added follow-up question handling, loading feedback, and history storage to the Diagnosis flow.
- Enhanced the Dashboard to display stored diagnosis history entries.

## 2026-03-14 10:37pm (Added by Debadrita)

### Changed

- Applied a healthcare dashboard UI refresh with a rose gradient background, updated navigation styling, and card layouts using rounded corners and soft shadows.
  
## 2026-03-14 10:29pm (Added by Debadrita)

### Added

- Built the Results page to render top predictions, probability percentages, a Recharts bar chart, and explainable symptom contributors from backend responses

## 2026-03-14 10:22pm (Added by Debadrita)

### Changed

- Updated the frontend Navbar links to match the required navigation routes (Home, Diagnosis, Dashboard).

## 2026-03-14 09:52pm (Added by Debadrita)

### Added

- Added a Vite + React + Tailwind + React Router frontend scaffold for SymptoScan, including base routing, pages, components, and an API service stub.

## 2026-03-14 07:37pm (Added by Hitesh)

### Changed

- Enforced diagnosis input validation for minimum symptoms and sensible age/BMI ranges.

## 2026-03-14 07:23pm (Added by Hitesh)

### Changed

- Aligned diagnosis inference with training features using symptom embeddings and scaler normalization.
- Implemented diagnosis inference using cached model artifacts and risk-factor weighting.

### Added

- Added backend AI module structure with dataset cache, bayesian engine, symptom engine, and model loader.
- Added diagnosis engine wrapper and diagnosis request/response schemas.
- Added diagnosis prediction endpoint and routed it through the FastAPI app.

## 2026-03-14 06:39pm (Added by Hitesh)

### Changed

- Replaced auth service exceptions with HTTP errors for consistent client responses.

### Added

- Added OAuth2 bearer token decoding and current-user dependency for protected endpoints.
- Added users route to expose the authenticated user profile.

### Changed

- Updated backend app routing to include users endpoints with tags.

## 2026-03-14 05:51pm (Added by Hitesh)

### Changed

- Added bcrypt password length validation to reject passwords longer than 72 bytes.

### Added

- Added authentication core utilities for password hashing and JWT creation.
- Added user model, schemas, repository, and service for registration and login.
- Added auth API routes and wired them into the FastAPI app.
- Added automatic table creation for the user model during startup.

### Changed

- Updated the backend entry point to include auth routing.

## 2026-03-14 05:40pm (Added by Hitesh)

### Added

- Added core backend infrastructure modules for config, logging, database engine/base, and database dependency injection.
- Added backend logs folder for file-based logging output.

### Changed

- Updated backend entry point to use environment settings and structured startup logging.

### Added

- Added loguru and pydantic-settings to backend requirements for logging and settings management.

## 2026-03-14 05:28pm (Added by Hitesh)

### Changed

- Expanded backend Roadmap.sh with version header, migration strategy, API versioning, testing milestone, security hardening notes, and CI/CD coverage.

### Added

- Added backend Roadmap.sh with detailed milestone plan and acceptance criteria.

## 2026-03-14 05:20pm (Added by Hitesh)

### Added

- Added backend environment configuration defaults for app name, version, SQLite database URL, and model path.
- Added a minimal FastAPI entry point with a root health response.

## 2026-03-14 05:16pm (Added by Hitesh)

### Added

- Added the consolidated backend app structure with api v1 routes, core, db, models, schemas, services, repositories, and ai modules.
- Added backend placeholder files for routes, core, db, models, schemas, services, repositories, ai loader, main entrypoint, and env file.
- Added the backend tests folder for future test coverage.

### Removed

- Removed legacy backend service folders: admin_service, auth_service, gateway, medical_service, prediction_service, shared, and user_service.
- Removed the backend venv folder from the workspace.

## 2026-03-14 01:54pm (Added by Hitesh)

### Changed

- Added automatic Bayesian-to-entropy engine switching based on remaining dataset size, with per-step timing output.

## 2026-03-14 01:30pm (Added by Hitesh)

### Changed

- Fixed a syntax error in the optional Bayesian question engine implementation.

### Added

- Added an optional Bayesian question engine operating in disease-space to speed up symptom selection.

### Changed

- Wired the diagnosis runner to select between row-based and Bayesian questioning.

## 2026-03-14 01:19pm (Added by Hitesh)

### Changed

- Cached symptom counts per iteration and limited entropy scoring to frequent symptoms using dynamic top-k thresholds.

## 2026-03-14 01:04pm (Added by Hitesh)

### Changed

- Skipped the pregnancy prompt when age is under 18 or sex is male, defaulting pregnancy to false.

## 2026-03-14 12:50pm (Added by Hitesh)

### Added

- Added medical filters for age- and sex-specific conditions to refine final probabilities.
- Added input validation helpers and migrated patient profile prompts to validated inputs.

### Changed

- Applied medical filters after disease priors in the diagnosis pipeline.

### Changed

- Replaced the fixed 6-question limit with dynamic stopping based on max questions, minimum remaining cases, and confidence threshold.

## 2026-03-14 12:36pm (Added by Hitesh)

### Added

- Added disease prior weighting to adjust probabilities based on common vs rare conditions.

### Changed

- Updated diagnosis pipeline to apply disease priors after risk factor weighting and emit debug comparisons.

### Changed

- Documented disease priors in the README.

## 2026-03-14 12:20pm (Added by Hitesh)

### Changed

- Expanded risk factor keyword matching across pulmonary, cardiac, infection, neuro, GI, renal, and cancer categories for better disease mapping.
- Added sex- and age-based exclusion rules (e.g., ovarian vs prostate conditions) to improve clinical realism.

## 2026-03-14 12:08pm (Added by Hitesh)

### Added

- Added patient profile helper for collecting extended context fields (age, sex, BMI, blood pressure, blood sugar, and history flags).
- Added risk factor debug output to show before vs after probability adjustments.

### Changed

- Expanded risk factor weighting rules to include age, sex, blood sugar, alcohol use, and family heart disease.
- Updated the diagnosis test runner to use patient_profile input and a debug toggle.

## 2026-03-14 12:00pm (Added by Hitesh)

### Changed

- Added interactive prompts for patient context (age, BMI, blood pressure, and history flags) in the diagnosis test runner.

### Added

- Added risk factor weighting to refine disease probabilities using patient context.
- Added a risk factor utility module and a sample patient profile in the diagnosis test runner.

### Changed

- Updated the diagnosis pipeline to apply risk-based probability adjustments and report active risk factors.

### Changed

- Documented risk factor weighting in the README.

## 2026-03-14 11:30am (Added by Hitesh)

### Changed

- Limited entropy scoring to the most frequent symptoms (top-40, or top-20 on small datasets) to cut per-question compute time.

### Changed

- Added timing instrumentation to the diagnosis loop to measure entropy, filtering, per-iteration, model inference, and total runtime.

## 2026-03-14 11:14am (Added by Hitesh)

### Added

- Documented dataset setup and local cache generation in README without committing raw data or numpy artifacts.

### Changed

- Updated .gitignore to exclude generated numpy arrays and local dataset CSVs from version control.

### Added

- Added a dataset cache utility to store and load X, y, and symptom names as numpy arrays for faster startup.

### Changed

- Updated question engine and diagnosis tests to load cached arrays instead of re-reading the full CSV on every run.
- Precomputed symptom counts for candidate selection and simplified dataset filtering to speed up entropy scans.
- Added early stopping in the diagnosis flow when remaining cases fall below the threshold.

## 2026-03-14 11:00am (Added by Hitesh)

### Changed

- Optimized question engine symptom ranking to evaluate only symptoms present in the remaining dataset, reducing per-question entropy work.

## 2026-03-14 10:54am (Added by Hitesh)

### Changed

- Normalized yes/no input handling to accept y/yes and n/no in the diagnosis flow and question engine test.

## 2026-03-14 10:45am (Added by Hitesh)

### Added

- Created the combined diagnosis pipeline to connect the question engine with the trained disease predictor.
- Added an interactive diagnosis test script to run the end-to-end question flow and prediction output.

### Changed

- Aligned the diagnosis pipeline model input size with the embedding-augmented feature vector to prevent checkpoint shape mismatches.

## 2026-03-14 10:31am (Added by Hitesh)

### Added

- Implemented the dynamic question engine module to rank symptoms by information gain and select the next best question.

### Changed

- Wired the question engine test harness to the actual dataset path and label column in the repo for reliable validation.

### Added

- Added an interactive test script for the question engine to validate question selection and dataset filtering.

## 2026-03-14 10:13am (Added by Hitesh)

### Added

- Created a presentation-ready README with clear sections, system overview, architecture summary, and project structure.
- Added docs/architecture.md with a structured system architecture description, component breakdowns, data flow, and AI pipeline.

### Changed

- Refined README content for industry-style formatting and improved readability.

## 2026-03-14 10:03am (Added by Hitesh)

### Added

- Created clean-architecture microservice scaffolding under backend for auth, user, prediction, medical, and admin services (routes, models, schemas, services, repository).
- Added a minimal FastAPI app for auth_service (health endpoint).
- Added infrastructure folder structure for docker, kubernetes, and nginx.
- Added dataset structure with raw and processed folders, plus the raw disease_symptom_dataset.csv.
- Added AI model workspace files: dataset_loader.py, preprocessing.py, model.py, train.py, inference.py, test_model.py.
- Added symptom graph utilities and embedding builder: symptom_graph.py and build_embeddings.py.

### Changed

- Implemented dataset loading with normalized column names.
- Implemented preprocessing to handle both label columns (Disease/diseases) and binary symptom columns.
- Added training pipeline with train/test split, class weights, accuracy reporting, and longer training (250 epochs).
- Added feature augmentation by concatenating symptom embeddings to binary vectors.
- Added feature normalization with StandardScaler before training.
- Increased model capacity to handle augmented features (1024/512/256 hidden layers).
- Set a CPU-only training toggle to avoid unsupported GPU kernels (FORCE_CPU = True).

### Artifacts (Generated)

- disease_model.pt
- symptom_index.json
- disease_labels.json
- symptom_embeddings.npy
