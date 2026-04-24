from pathlib import Path
import pandas as pd


class RainfallProcessor:
    def __init__(self, csv_path: str | Path):
        self.csv_path = Path(csv_path)
        if not self.csv_path.exists():
            raise FileNotFoundError(f"Rainfall CSV not found at: {self.csv_path}")

        self.df = pd.read_csv(self.csv_path)
        self._validate_columns()
        self.df["district_norm"] = self.df["district"].astype(str).str.strip().str.lower()

    def _validate_columns(self):
        required = {"district", "year", "annual_actual"}
        missing = required - set(self.df.columns)
        if missing:
            raise ValueError(f"Rainfall CSV missing columns: {sorted(missing)}")

    def get_latest_year(self) -> int:
        return int(self.df["year"].max())

    def get_rainfall_for_district(self, district: str, year: int | None = None) -> float | None:
        if year is None:
            year = self.get_latest_year()

        district_norm = district.strip().lower()
        rows = self.df[
            (self.df["district_norm"] == district_norm) &
            (self.df["year"] == year)
        ]
        if rows.empty:
            return None
        return float(rows.iloc[0]["annual_actual"])

    @staticmethod
    def get_rainfall_type(annual_actual: float) -> str:
        if annual_actual < 600:
            return "Low"
        if annual_actual < 1200:
            return "Medium"
        return "High"

    def get_rainfall_category_for_district(self, district: str, year: int | None = None) -> str:
        annual_actual = self.get_rainfall_for_district(district, year)
        if annual_actual is None:
            raise ValueError(f"No rainfall data for district={district}, year={year}")
        return self.get_rainfall_type(annual_actual)