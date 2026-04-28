"""
Model 2: Pattern Anomaly Detector
Isolation Forest (unsupervised) — detects suspicious claim patterns.
Does NOT contribute to credibility score, only raises flags.
"""
import os
import numpy as np
import joblib
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

MODEL_DIR = os.path.join(os.path.dirname(__file__), "trained_models")
MODEL_PATH = os.path.join(MODEL_DIR, "pattern_detector.joblib")
SCALER_PATH = os.path.join(MODEL_DIR, "pattern_scaler.joblib")


def extract_pattern_features(claim_data: dict, user_history: list) -> np.ndarray:
    """
    Extract pattern-based features from a claim + the user's claim history.
    """
    # Current claim features
    amount = claim_data.get("amount", 0)
    claim_type = claim_data.get("type", "other")

    # User history analysis
    num_past_claims = len(user_history)
    if num_past_claims > 0:
        past_amounts = [c.get("amount", 0) for c in user_history]
        avg_amount = np.mean(past_amounts)
        amount_deviation = abs(amount - avg_amount) / max(avg_amount, 1)

        # Time between claims
        past_dates = sorted([c.get("submitted_timestamp", 0) for c in user_history])
        if len(past_dates) >= 2:
            intervals = [past_dates[i+1] - past_dates[i] for i in range(len(past_dates)-1)]
            avg_interval = np.mean(intervals) / (24 * 3600)  # days
            min_interval = min(intervals) / (24 * 3600)
        else:
            avg_interval = 365
            min_interval = 365

        # Type repetition
        past_types = [c.get("type", "") for c in user_history]
        type_counts = {}
        for t in past_types:
            type_counts[t] = type_counts.get(t, 0) + 1
        same_type_ratio = type_counts.get(claim_type, 0) / max(num_past_claims, 1)
    else:
        avg_amount = amount
        amount_deviation = 0
        avg_interval = 365
        min_interval = 365
        same_type_ratio = 0

    return np.array([[
        num_past_claims,
        amount,
        amount_deviation,
        avg_interval,
        min_interval,
        same_type_ratio,
        claim_data.get("land_size", 5),
        claim_data.get("days_since_policy_start", 180),
    ]])


def generate_training_data(n_samples=3000):
    """Generate synthetic pattern data for training Isolation Forest."""
    np.random.seed(123)
    X = []

    for _ in range(n_samples):
        is_anomaly = np.random.random() < 0.1  # 10% anomalies

        if is_anomaly:
            num_claims = np.random.randint(3, 10)
            amount = np.random.uniform(50000, 300000)
            deviation = np.random.uniform(2.0, 5.0)
            avg_interval = np.random.uniform(5, 30)
            min_interval = np.random.uniform(1, 10)
            same_type_ratio = np.random.uniform(0.7, 1.0)
            land_size = np.random.uniform(1, 5)
            days = np.random.uniform(5, 60)
        else:
            num_claims = np.random.randint(0, 4)
            amount = np.random.uniform(2000, 80000)
            deviation = np.random.uniform(0, 1.5)
            avg_interval = np.random.uniform(60, 365)
            min_interval = np.random.uniform(30, 365)
            same_type_ratio = np.random.uniform(0, 0.5)
            land_size = np.random.uniform(1, 20)
            days = np.random.uniform(30, 365)

        X.append([num_claims, amount, deviation, avg_interval,
                  min_interval, same_type_ratio, land_size, days])

    return np.array(X)


def train_and_save():
    """Train the pattern detector and save to disk."""
    os.makedirs(MODEL_DIR, exist_ok=True)
    X = generate_training_data()

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = IsolationForest(
        n_estimators=100, contamination=0.1, random_state=42
    )
    model.fit(X_scaled)

    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    print("Pattern detector trained and saved.")
    return model, scaler


def load_model():
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


def predict(claim_data: dict, user_history: list) -> dict:
    """
    Detect anomalous patterns in claim data.
    Returns: {is_suspicious: bool, flag: str|None, reasons: list, details: dict}
    """
    model, scaler = get_model()
    features = extract_pattern_features(claim_data, user_history)
    features_scaled = scaler.transform(features)

    # IsolationForest: -1 = anomaly, 1 = normal
    prediction = model.predict(features_scaled)[0]
    anomaly_score = model.decision_function(features_scaled)[0]

    is_suspicious = prediction == -1
    reasons = []

    # Generate specific reasons
    num_claims = len(user_history)
    amount = claim_data.get("amount", 0)

    if num_claims >= 3:
        past_amounts = [c.get("amount", 0) for c in user_history]
        avg = np.mean(past_amounts) if past_amounts else amount
        if amount > avg * 2:
            reasons.append(f"Claim amount (₹{amount:,.0f}) is {amount/avg:.1f}x the user's average")

    if num_claims >= 2:
        past_dates = sorted([c.get("submitted_timestamp", 0) for c in user_history])
        if len(past_dates) >= 2:
            last_interval = past_dates[-1] - past_dates[-2]
            if last_interval < 15 * 24 * 3600:
                reasons.append(f"Only {last_interval//(24*3600)} days since last claim")

    past_types = [c.get("type", "") for c in user_history]
    claim_type = claim_data.get("type", "")
    if past_types.count(claim_type) >= 3:
        reasons.append(f"Same damage type '{claim_type}' claimed {past_types.count(claim_type)} times previously")

    if num_claims > 4:
        reasons.append(f"Unusually high claim frequency ({num_claims} total claims)")

    if is_suspicious and not reasons:
        reasons.append("Statistical anomaly detected in claim pattern")

    return {
        "is_suspicious": is_suspicious,
        "flag": "suspicious" if is_suspicious else "normal",
        "reasons": reasons,
        "details": {
            "model": "IsolationForest",
            "anomaly_score": round(float(anomaly_score), 4),
            "prediction": "anomaly" if is_suspicious else "normal",
            "user_claim_count": num_claims,
        }
    }
