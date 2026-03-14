# Changelog

- All notable changes to this project are documented here.
- Add your name and date along with timestamp 
- Do not skip changelog updataion at any cost.
- Thoroughly explain about your features and changes committed.
- Always add changes on the top of previous changes, do not break this.


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


