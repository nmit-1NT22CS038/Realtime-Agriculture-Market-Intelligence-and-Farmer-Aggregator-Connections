import argparse
import json
import sys
from pathlib import Path

from rainfall_processor import RainfallProcessor
from scoring_engine import ScoringEngine


def build_response(
    district: str,
    season: str,
    commodity: str,
    land_size: float,
    year: int | None,
    rainfall_csv: str
):
    rp = RainfallProcessor(rainfall_csv)
    se = ScoringEngine()

    rainfall_value = rp.get_rainfall_for_district(district, year)
    if rainfall_value is None:
        raise ValueError(f"No rainfall data found for district={district} year={year}")

    rainfall_type = rp.get_rainfall_type(rainfall_value)
    recommended = se.recommend_crops(rainfall_type, season, commodity, top_n=3)

    if not recommended:
    # fallback if strict filtering returns nothing
        main_crop = commodity
        alt_crops = []
    else:
        main_crop = recommended[0]
        alt_crops = recommended[1:]
        
    land_plan_raw = se.allocate_land(land_size, main_crop, alt_crops)

    land_plan = {k: f"{v} acres" for k, v in land_plan_raw.items()}

    return {
    "district": district,
    "rainfall_mm": round(rainfall_value, 2),
    "rainfall_type": rainfall_type,
    "season": season,
    "current_crop": commodity,
    "main_crop": main_crop,
    "recommended_crops": recommended,
    "land_plan": land_plan
}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--district", required=True)
    parser.add_argument("--season", required=True)
    parser.add_argument("--commodity", required=True)
    parser.add_argument("--land_size", required=True, type=float)
    parser.add_argument("--year", required=False, type=int, default=None)
    parser.add_argument("--rainfall_csv", required=True)
    args = parser.parse_args()

    try:
        response = build_response(
            district=args.district,
            season=args.season,
            commodity=args.commodity,
            land_size=args.land_size,
            year=args.year,
            rainfall_csv=args.rainfall_csv
        )
        print(json.dumps(response, ensure_ascii=True))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()