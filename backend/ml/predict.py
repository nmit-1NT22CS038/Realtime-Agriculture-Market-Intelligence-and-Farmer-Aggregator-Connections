import argparse
import hashlib
import os
import random


def fallback(crop: str, district: str, quantity: float):
    seed_text = f"{crop}-{district}".encode("utf-8")
    seed = int(hashlib.md5(seed_text).hexdigest()[:8], 16)
    random.seed(seed)
    base = 22 + random.random() * 30
    quantity_adjustment = min(quantity * 0.2, 20)
    return round(base + quantity_adjustment, 2), 58.0, "fallback-heuristic"


def try_model(model_path: str, quantity: float):
    if not model_path or not os.path.exists(model_path):
        return None

    try:
        import joblib  # type: ignore
        model = joblib.load(model_path)
        prediction = model.predict([[quantity]])
        value = float(prediction[0])
        return round(value, 2), 70.0, "joblib-model"
    except Exception:
        return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--crop", required=True)
    parser.add_argument("--district", required=True)
    parser.add_argument("--quantity", required=True, type=float)
    parser.add_argument("--model", required=False, default="")
    args = parser.parse_args()

    result = try_model(args.model, args.quantity)
    if result is None:
        result = fallback(args.crop, args.district, args.quantity)

    print(f"{result[0]},{result[1]},{result[2]}")


if __name__ == "__main__":
    main()
