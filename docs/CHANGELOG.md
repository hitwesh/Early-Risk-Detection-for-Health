# Changelog

- All notable changes to this project are documented here.
- Add your name and date along with timestamp 
- Do not skip changelog updataion at any cost.
- Thoroughly explain about your features and changes committed.
- Always add changes on the top of previous changes, do not break this.


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


