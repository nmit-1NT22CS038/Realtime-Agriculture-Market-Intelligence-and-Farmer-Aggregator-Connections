import argparse
import hashlib
import os
import random
import sys
import numpy as np


def safe_label_encode(le, value):
    """Encode categorical value, return -1 for unseen categories"""
    if value in le.classes_:
        return le.transform([value])[0]
    else:
        return -1


def month_cyclic_features(month):
    """Generate sin/cos features for month cyclicity"""
    month_sin = np.sin(2 * np.pi * month / 12)
    month_cos = np.cos(2 * np.pi * month / 12)
    return month_sin, month_cos


def get_aggregation_features(df_hist, district_encoded, commodity_encoded, month):
    """Get historical aggregation features"""
    global_mean = df_hist['Modal Price (Rs./Quintal)'].mean()
    
    # District-Commodity historical avg
    dc_data = df_hist[
        (df_hist['District Name'] == district_encoded) &
        (df_hist['Commodity'] == commodity_encoded)
    ]
    district_avg = dc_data['Modal Price (Rs./Quintal)'].mean() if not dc_data.empty else global_mean
    
    # Commodity-Month historical avg
    cm_data = df_hist[
        (df_hist['Commodity'] == commodity_encoded) &
        (df_hist['month'] == month)
    ]
    month_avg = cm_data['Modal Price (Rs./Quintal)'].mean() if not cm_data.empty else global_mean
    
    # Commodity price volatility
    volatility = dc_data['Modal Price (Rs./Quintal)'].std() if len(dc_data) > 1 else global_mean * 0.1
    
    return district_avg, month_avg, volatility


def fallback(crop: str, district: str, quantity: float):
    """Fallback heuristic model"""
    seed_text = f"{crop}-{district}".encode("utf-8")
    seed = int(hashlib.md5(seed_text).hexdigest()[:8], 16)
    random.seed(seed)
    base = 22 + random.random() * 30
    quantity_adjustment = min(quantity * 0.2, 20)
    return round(base + quantity_adjustment, 2), 58.0, "fallback-heuristic"


def try_model(model_path: str, district: str, market: str, commodity: str, variety: str, 
              season: str, year: int, month: int, label_encoders_path: str, 
              feature_columns_path: str, historical_data_path: str):
    """Try to predict using the trained RF model"""
    if not model_path or not label_encoders_path or not feature_columns_path or not historical_data_path:
        print(f"ERROR: Missing paths - model:{model_path}, encoders:{label_encoders_path}, features:{feature_columns_path}, history:{historical_data_path}", file=sys.stderr, flush=True)
        return None
    
    # Verify all files exist
    if not os.path.exists(model_path):
        abs_path = os.path.abspath(model_path)
        print(f"ERROR: Model file not found: {model_path} (absolute: {abs_path})", file=sys.stderr, flush=True)
        return None
    if not os.path.exists(label_encoders_path):
        abs_path = os.path.abspath(label_encoders_path)
        print(f"ERROR: Encoders file not found: {label_encoders_path} (absolute: {abs_path})", file=sys.stderr, flush=True)
        return None
    if not os.path.exists(feature_columns_path):
        abs_path = os.path.abspath(feature_columns_path)
        print(f"ERROR: Features file not found: {feature_columns_path} (absolute: {abs_path})", file=sys.stderr, flush=True)
        return None
    if not os.path.exists(historical_data_path):
        abs_path = os.path.abspath(historical_data_path)
        print(f"ERROR: History file not found: {historical_data_path} (absolute: {abs_path})", file=sys.stderr, flush=True)
        return None

    try:
        import joblib
        import pandas as pd
        
        # Load model and metadata
        model = joblib.load(model_path)
        label_encoders = joblib.load(label_encoders_path)
        feature_columns = joblib.load(feature_columns_path)
        df_hist = pd.read_csv(historical_data_path)
        
        # Encode categorical inputs
        input_dict = {
            'District Name': safe_label_encode(label_encoders['District Name'], district),
            'Market Name': safe_label_encode(label_encoders['Market Name'], market),
            'Commodity': safe_label_encode(label_encoders['Commodity'], commodity),
            'Variety': safe_label_encode(label_encoders['Variety'], variety),
            'season': safe_label_encode(label_encoders['season'], season),
            'year': year,
            'month': month,
        }
        
        # Cyclic features
        month_sin, month_cos = month_cyclic_features(month)
        input_dict['month_sin'] = month_sin
        input_dict['month_cos'] = month_cos
        
        # Aggregation features
        district_avg, month_avg, volatility = get_aggregation_features(
            df_hist, 
            input_dict['District Name'], 
            input_dict['Commodity'], 
            month
        )
        input_dict['district_commodity_avg_price'] = district_avg
        input_dict['commodity_month_avg_price'] = month_avg
        input_dict['commodity_price_volatility'] = volatility
        
        # Create input dataframe in correct order
        input_df = pd.DataFrame([[input_dict[col] for col in feature_columns]], 
                               columns=feature_columns)
        
        # Predict
        predicted_price = model.predict(input_df)[0]
        return round(float(predicted_price), 2), 82.0, "aggprice-rf-model"
        
    except Exception as e:
        print(f"ERROR: Model prediction error: {e}", file=sys.stderr, flush=True)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--district", required=True)
    parser.add_argument("--market", required=True)
    parser.add_argument("--commodity", required=True)
    parser.add_argument("--variety", required=True)
    parser.add_argument("--season", required=True)
    parser.add_argument("--year", required=True, type=int)
    parser.add_argument("--month", required=True, type=int)
    parser.add_argument("--model", required=False, default="")
    parser.add_argument("--encoders", required=False, default="")
    parser.add_argument("--features", required=False, default="")
    parser.add_argument("--history", required=False, default="")
    args = parser.parse_args()

    print(f"DEBUG: predict.py invoked with model={args.model}, encoders={args.encoders}, features={args.features}, history={args.history}", file=sys.stderr, flush=True)

    result = try_model(
        args.model, 
        args.district, 
        args.market, 
        args.commodity, 
        args.variety, 
        args.season, 
        args.year, 
        args.month,
        args.encoders,
        args.features,
        args.history
    )
    
    if result is None:
        print(f"DEBUG: ML model failed, using fallback", file=sys.stderr, flush=True)
        result = fallback(args.commodity, args.district, 100.0)
    else:
        print(f"DEBUG: ML model succeeded with price={result[0]}", file=sys.stderr, flush=True)

    print(f"{result[0]},{result[1]},{result[2]}")


if __name__ == "__main__":
    main()
