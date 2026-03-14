# System Architecture

## Overview

Early Health Risk Detection AI is a modular, microservice-friendly platform for symptom intake, disease prediction, and risk insights. The system separates UI, API orchestration, AI inference, and data persistence for scalability and maintainability.

## High-Level Architecture

```
+-------------------+
|  React Frontend   |
+---------+---------+
          |
          v
+-------------------+
|  FastAPI Backend  |
|  (API Gateway)    |
+----+---------+----+
     |         |
     v         v
+---------+  +----------------+
|  Auth   |  | AI Prediction  |
| Service |  | Engine (ML)    |
+----+----+  +--------+-------+
     |                |
     v                v
+------------------------------+
|         SQLite DB            |
+------------------------------+
```

## System Components

### Frontend Layer

Technologies:

- React
- TailwindCSS

Responsibilities:

- symptom input
- dynamic AI questions
- prediction display
- dashboards

### Backend Layer

Technology:

- FastAPI

Responsibilities:

- API routing
- request validation
- authentication and authorization
- AI model integration
- database communication

Key endpoints:

- POST /predict
- POST /symptom-question
- POST /auth/login
- POST /auth/register
- GET /admin/dashboard

### AI Prediction Engine

Technology:

- PyTorch

Responsibilities:

- symptom vector encoding
- disease prediction
- probability calculation
- top-5 ranking

Model pipeline:

```
User Symptoms
    |
    v
Symptom Vector Encoding
    |
    v
Symptom Embeddings
    |
    v
Neural Network Model
    |
    v
Disease Probability Output
```

### Symptom Graph Engine

Purpose:

- capture relationships between symptoms

Example:

- fever <-> cough <-> fatigue

Outputs:

- symptom embeddings
- disease similarity clusters

Implementation notes:

- co-occurrence matrix
- dimensionality reduction

### Dynamic Question Engine

Purpose:

- select the next most informative question

Logic:

```
User symptom
    |
    v
Candidate diseases
    |
    v
Information gain analysis
    |
    v
Next best question
```

### Authentication and Authorization

Security:

- JWT tokens
- RBAC

Roles:

- User
- Admin

Capabilities:

- User: submit symptoms, view predictions, view history
- Admin: monitor system, view analytics, manage datasets

### Database Layer

Technology:

- SQLite

Stores:

- users
- predictions
- symptom history
- admin analytics

## Data Flow

```
User enters symptoms
    |
    v
Frontend sends request
    |
    v
FastAPI backend
    |
    v
AI model inference
    |
    v
Prediction results returned
    |
    v
Frontend displays results
```

## Scalability Considerations

- model microservice deployment
- containerization with Docker
- Kubernetes scaling
- model versioning

## AI Pipeline

```
Dataset
    |
    v
Preprocessing
    |
    v
Symptom Embeddings
    |
    v
Neural Network Training
    |
    v
Model Export
    |
    v
Inference API
```

## Future Improvements

- LLM-based symptom reasoning
- clinical knowledge graph
- real-time wearable integration
- telemedicine integration
