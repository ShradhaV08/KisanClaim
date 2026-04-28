"""
Train all ML models and save to disk.
Run this once during setup: python -m backend.ml.train_models
"""
from backend.ml import fraud_scorer, pattern_detector


def train_all():
    print("=" * 60)
    print("Training KisanClaim ML Models")
    print("=" * 60)

    print("\n[1/2] Training Fraud Credibility Scorer...")
    fraud_scorer.train_and_save()

    print("\n[2/2] Training Pattern Anomaly Detector...")
    pattern_detector.train_and_save()

    print("\n" + "=" * 60)
    print("All models trained successfully!")
    print("Models saved to: backend/ml/trained_models/")
    print("=" * 60)


if __name__ == "__main__":
    train_all()
