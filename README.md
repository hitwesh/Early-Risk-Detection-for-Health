# Early Health Risk Detection AI

AI-powered symptom analysis that predicts possible diseases early and helps users understand potential health risks before serious illness occurs.

Built for a MedTech Hackathon.

## Overview

Many serious illnesses begin with mild symptoms that people often ignore. This project builds an AI-driven diagnosis assistant that:

- analyzes symptoms
- predicts possible diseases
- asks targeted follow-up questions
- provides risk insights

NOTE: This system is not a medical diagnosis tool. It is a decision-support assistant.

## Key Features

### 1) AI Symptom Analysis

Users input symptoms and the AI predicts possible diseases using a trained neural network.

Output includes:

- top predicted diseases
- probability scores
- risk indication

Example:

Input symptoms:
fever, cough, fatigue

Predictions:

    Flu -- 64%
    Pneumonia -- 18%
    Common Cold -- 10%
    Bronchitis -- 6%
    COVID-like illness -- 2%

### 2) Dynamic AI Question Engine

Instead of asking all symptoms, the system asks intelligent follow-up questions like a clinician.

Example flow:

User: fever

AI:
Do you have cough?

User: yes

AI:
Are you experiencing shortness of breath?

This reduces questioning from 377 symptoms to 6-8 questions.

### 3) Symptom Relationship Modeling

The system uses symptom embeddings and disease similarity graphs to model relationships between symptoms.

Example:

fever <-> cough <-> fatigue

These relationships improve prediction accuracy and generalization.

### 4) Explainable AI (XAI)

The system can explain predictions by surfacing contributing symptoms.

Prediction: Pneumonia

Key contributing symptoms:
- fever
- cough
- shortness of breath

## AI Model

The core prediction engine is built with PyTorch.

Model inputs:

- 377 symptom features
- symptom embeddings

Model output:

- ~400 diseases

Architecture:

Input Layer
down
Dense Layer (1024)
down
Dense Layer (512)
down
Dense Layer (256)
down
Output Layer (~400 diseases)

Training techniques:

- class balancing
- feature embeddings
- batch normalization
- dropout
- train/test split

## Model Performance

- Top-1 Accuracy: ~84-85%
- Top-5 Accuracy: ~97%

Considering ~400 disease classes, this is strong performance.

## Tech Stack

Frontend:

- React
- TailwindCSS

Backend:

- Python
- FastAPI

AI / ML:

- PyTorch
- NumPy
- Pandas
- Scikit-learn

Database:

- PostgreSQL

Authentication:

- JWT (Bearer Tokens)
- RBAC

## System Architecture

```
Frontend (React)
    |
    v
Backend API (FastAPI)
    |
    v
AI Prediction Engine (PyTorch)
    |
    v
PostgreSQL Database
```

## Project Structure

```
project-root
|-- frontend
|   `-- react-app
|-- backend
|   `-- fastapi-server
|-- ai-model
|   |-- train.py
|   |-- model.py
|   |-- inference.py
|   |-- symptom_graph.py
|   |-- build_embeddings.py
|   |-- disease_model.pt
|   |-- symptom_index.json
|   `-- disease_labels.json
|-- README.md
`-- architecture.md
```

## Security Features

- JWT Authentication
- Role-Based Access Control (RBAC)
- Secure API endpoints
- User / Admin dashboards

## User Roles

User:

- symptom input
- view predictions
- view history

Admin:

- dashboard analytics
- system monitoring
- dataset updates

## Target Users

General public who want:

- early symptom insights
- risk awareness
- health guidance

## Disclaimer

This system is intended for educational and early awareness purposes only.

It does not replace professional medical diagnosis.

Users should consult qualified healthcare professionals for medical advice.

## Team

MedTech Hackathon Project

Built with care using AI and healthcare innovation.
