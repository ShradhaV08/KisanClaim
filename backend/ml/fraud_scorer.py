"""
Model 1: Fraud Credibility Scorer
Random Forest classifier trained on synthetic data.
Input: 11 claim features → Output: credibility score 0-100
"""
import os
import numpy as np
import joblib
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler

MODEL_DIR = os.path.join(os.path.dirname(__file__), "trained_models")
MODEL_PATH = os.path.join(MODEL_DIR, "fraud_scorer.joblib")
SCALER_PATH = os.path.join(MODEL_DIR, "fraud_scaler.joblib")

# Crop risk factors (higher = riskier)
CROP_RISK = {
    "Rice": 0.3, "Wheat": 0.25, "Cotton": 0.6, "Sugarcane": 0.4,
    "Maize": 0.3, "Pulses": 0.2, "Vegetables": 0.65, "Fruits": 0.7,
    "Oilseeds": 0.35, "Spices": 0.75,
}

# Region risk factors
REGION_RISK = {
    "Uttar Pradesh": 0.5, "Bihar": 0.55, "Madhya Pradesh": 0.45,
    "Punjab": 0.3, "Haryana": 0.3, "Maharashtra": 0.4,
    "Gujarat": 0.35, "Karnataka": 0.4, "Tamil Nadu": 0.35,
    "Andhra Pradesh": 0.45, "Telangana": 0.4, "Rajasthan": 0.6,
    "West Bengal": 0.5, "Kerala": 0.3, "Himachal Pradesh": 0.35,
    "Uttarakhand": 0.4,
}


def extract_features(claim_data: dict) -> np.ndarray:
    """Extract 11 features from claim data."""
    days_since_policy = claim_data.get("days_since_policy_start", 180)
    claim_amount = claim_data.get("amount", 0)
    coverage_amount = claim_data.get("coverage_amount", 100000)
    coverage_ratio = min(claim_amount / max(coverage_amount, 1), 1.0)
    land_size = claim_data.get("land_size", 5)
    affected_area = claim_data.get("affected_area", land_size * 0.5)
    damage_ratio = min(affected_area / max(land_size, 0.1), 1.0)
    previous_claims = claim_data.get("previous_claims", 0)
    description_length = len(claim_data.get("description", ""))
    document_count = claim_data.get("document_count", 0)
    crop_type = claim_data.get("crop_type", "Rice")
    crop_risk = CROP_RISK.get(crop_type, 0.4)
    irrigation = 1.0 if claim_data.get("irrigation_type", "irrigated") == "rainfed" else 0.0
    region = claim_data.get("region", "")
    region_risk = REGION_RISK.get(region, 0.4)

    return np.array([[
        days_since_policy,
        coverage_ratio,
        land_size,
        damage_ratio,
        previous_claims,
        description_length,
        document_count,
        crop_risk,
        irrigation,
        region_risk,
        claim_amount,
    ]])


def generate_training_data(n_samples=5000):
    """Generate synthetic training data mimicking real fraud patterns."""
    np.random.seed(42)
    X = []
    y = []

    for _ in range(n_samples):
        is_fraud = np.random.random() < 0.2  # 20% fraud rate

        if is_fraud:
            days = np.random.choice([
                np.random.randint(1, 30),    # very early claims
                np.random.randint(1, 90),
            ])
            coverage_ratio = np.random.uniform(0.6, 1.0)  # high claims
            land_size = np.random.uniform(1, 20)
            damage_ratio = np.random.uniform(0.7, 1.0)    # high damage
            prev_claims = np.random.choice([0, 1, 2, 3, 4, 5], p=[0.1, 0.1, 0.2, 0.2, 0.2, 0.2])
            desc_len = np.random.randint(5, 30)            # short descriptions
            doc_count = np.random.randint(0, 2)            # few documents
            crop_risk = np.random.uniform(0.4, 0.8)
            irrigation = np.random.choice([0, 1], p=[0.3, 0.7])
            region_risk = np.random.uniform(0.4, 0.7)
            amount = np.random.uniform(30000, 200000)
        else:
            days = np.random.randint(30, 365)
            coverage_ratio = np.random.uniform(0.05, 0.5)
            land_size = np.random.uniform(1, 20)
            damage_ratio = np.random.uniform(0.1, 0.6)
            prev_claims = np.random.choice([0, 1, 2, 3], p=[0.5, 0.3, 0.15, 0.05])
            desc_len = np.random.randint(30, 300)
            doc_count = np.random.randint(1, 5)
            crop_risk = np.random.uniform(0.2, 0.6)
            irrigation = np.random.choice([0, 1], p=[0.6, 0.4])
            region_risk = np.random.uniform(0.2, 0.5)
            amount = np.random.uniform(1000, 80000)

        X.append([days, coverage_ratio, land_size, damage_ratio, prev_claims,
                  desc_len, doc_count, crop_risk, irrigation, region_risk, amount])
        y.append(0 if is_fraud else 1)  # 1 = legitimate, 0 = fraudulent

    return np.array(X), np.array(y)


def train_and_save():
    """Train the fraud scorer and save to disk."""
    os.makedirs(MODEL_DIR, exist_ok=True)
    X, y = generate_training_data()

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = GradientBoostingClassifier(
        n_estimators=100, max_depth=5, random_state=42, learning_rate=0.1
    )
    model.fit(X_scaled, y)

    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    print(f"Fraud scorer trained and saved. Accuracy: {model.score(X_scaled, y):.3f}")
    return model, scaler


def load_model():
    """Load the trained model."""
    if not os.path.exists(MODEL_PATH):
        return train_and_save()
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    return model, scaler


_model = None
_scaler = None


def get_model():
    global _model, _scaler
    if _model is None:
        _model, _scaler = load_model()
    return _model, _scaler


def predict(claim_data: dict) -> dict:
    """
    Predict fraud credibility score for a claim.
    Returns: {score: 0-100, risk_level: str, flags: list, details: dict}
    """
    model, scaler = get_model()
    features = extract_features(claim_data)
    features_scaled = scaler.transform(features)

    # Get probability of being legitimate (class 1)
    proba = model.predict_proba(features_scaled)[0]
    legitimate_prob = proba[1] if len(proba) > 1 else proba[0]
    score = round(legitimate_prob * 100)

    # Generate flags based on individual feature checks
    flags = []

    days = claim_data.get("days_since_policy_start", 180)
    if days < 30:
        flags.append({
            "type": "early_claim", "severity": "warning",
            "description": f"Claim filed only {days} days after policy purchase"
        })
    elif days < 90:
        flags.append({
            "type": "relatively_early_claim", "severity": "info",
            "description": "Claim filed within first 3 months of policy"
        })

    coverage_amount = claim_data.get("coverage_amount", 100000)
    amount = claim_data.get("amount", 0)
    if coverage_amount > 0 and (amount / coverage_amount) > 0.8:
        flags.append({
            "type": "high_coverage_ratio", "severity": "warning",
            "description": f"Claiming {round(amount/coverage_amount*100)}% of total coverage"
        })

    land_size = claim_data.get("land_size", 5)
    affected_area = claim_data.get("affected_area", land_size * 0.5)
    if land_size > 0 and (affected_area / land_size) > 0.9:
        flags.append({
            "type": "high_damage_ratio", "severity": "warning",
            "description": f"{round(affected_area/land_size*100)}% of farm area reported damaged"
        })

    prev = claim_data.get("previous_claims", 0)
    if prev > 3:
        flags.append({
            "type": "frequent_claims", "severity": "warning",
            "description": f"{prev} previous claims on record"
        })

    desc = claim_data.get("description", "")
    if len(desc) < 20:
        flags.append({
            "type": "vague_description", "severity": "warning",
            "description": "Claim description is too brief for proper assessment"
        })

    doc_count = claim_data.get("document_count", 0)
    if doc_count == 0:
        flags.append({
            "type": "no_documents", "severity": "warning",
            "description": "No supporting documents provided"
        })

    # Determine risk level
    if score >= 75:
        risk_level = "low"
    elif score >= 40:
        risk_level = "medium"
    else:
        risk_level = "high"

    # Feature importances for explainability
    feature_names = [
        "days_since_policy_start", "coverage_ratio", "land_size",
        "damage_ratio", "previous_claims", "description_length",
        "document_count", "crop_risk", "irrigation_type",
        "region_risk", "claim_amount"
    ]
    importances = dict(zip(feature_names, model.feature_importances_.tolist()))

    return {
        "score": score,
        "risk_level": risk_level,
        "flags": flags,
        "details": {
            "model": "GradientBoostingClassifier",
            "features_used": feature_names,
            "feature_importances": importances,
            "legitimate_probability": round(legitimate_prob, 4),
        }
    }
