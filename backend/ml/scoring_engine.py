# from crop_knowledge import CROP_DATABASE

from crop_knowledge import CROP_DATABASE


class ScoringEngine:
    def score_crop(
        self,
        crop_name: str,
        rainfall_type: str,
        season: str,
        current_crop: str = None
    ) -> int:
        if crop_name not in CROP_DATABASE:
            return -999

        crop = CROP_DATABASE[crop_name]
        score = 0

        # 1) Season fit
        if season in crop["seasons"]:
            score += 3
        else:
            score -= 5

        # 2) Rainfall fit
        if crop["rainfall_requirement"] == rainfall_type:
            score += 2
        else:
            score -= 1

        # 3) Diversification vs current crop
        if current_crop and current_crop in CROP_DATABASE:
            current = CROP_DATABASE[current_crop]
            if crop["water_intensity"] == current["water_intensity"]:
                score -= 1

        return score

    def recommend_crops(
        self,
        rainfall_type: str,
        season: str,
        current_crop: str,
        top_n: int = 3
    ):
        scores = []

        for crop in CROP_DATABASE:
            if crop.lower() == current_crop.lower():
                continue

            score = self.score_crop(
                crop,
                rainfall_type,
                season,
                current_crop
            )

            if score < 0:
                continue

            scores.append((crop, score))

        scores.sort(key=lambda x: (-x[1], x[0]))
        return [crop for crop, _ in scores[:top_n]]

    @staticmethod
    def allocate_land(total_land: float, main_crop: str, alt_crops: list[str]):
        if total_land <= 0:
            raise ValueError("total_land must be greater than 0")

        plan = {}
        main_portion = 0.6 * total_land
        remaining = total_land - main_portion
        plan[main_crop] = round(main_portion, 2)

        if not alt_crops:
            return plan

        split = remaining / len(alt_crops)
        for crop in alt_crops:
            plan[crop] = round(split, 2)

        return plan
# class ScoringEngine:
#     def score_crop(self, crop_name: str, rainfall_type: str, season: str) -> int:
#         if crop_name not in CROP_DATABASE:
#             return 0

#         crop = CROP_DATABASE[crop_name]
#         score = 0

#         if crop["rainfall_requirement"] == rainfall_type:
#             score += 2

#         if season in crop["seasons"]:
#             score += 2

#         return score

#     def recommend_crops(self, rainfall_type: str, season: str, current_crop: str, top_n: int = 3):
#         scores = []
#         for crop in CROP_DATABASE:
#             if crop.lower() == current_crop.lower():
#                 continue
#             scores.append((crop, self.score_crop(crop, rainfall_type, season)))

#         scores.sort(key=lambda x: (-x[1], x[0]))
#         return [crop for crop, _ in scores[:top_n]]

#     @staticmethod
#     def allocate_land(total_land: float, main_crop: str, alt_crops: list[str]):
#         if total_land <= 0:
#             raise ValueError("total_land must be greater than 0")

#         plan = {}
#         main_portion = 0.6 * total_land
#         remaining = total_land - main_portion
#         plan[main_crop] = round(main_portion, 2)

#         if not alt_crops:
#             return plan

#         split = remaining / len(alt_crops)
#         for crop in alt_crops:
#             plan[crop] = round(split, 2)

#         return plan
    
'''
from crop_knowledge import CROP_DATABASE


class ScoringEngine:

    def score_crop(
        self,
        crop_name: str,
        rainfall_type: str,
        season: str,
        water_availability: str
    ) -> int:

        if crop_name not in CROP_DATABASE:
            return -999  # invalid crop

        crop = CROP_DATABASE[crop_name]
        score = 0

        # -------------------------------
        # 1. Season Check (MOST IMPORTANT)
        # -------------------------------
        if season in crop["seasons"]:
            score += 3
        else:
            score -= 5  # strong penalty

        # -------------------------------
        # 2. Rainfall Matching
        # -------------------------------
        if crop["rainfall_requirement"] == rainfall_type:
            score += 2
        else:
            score -= 1

        # -------------------------------
        # 3. Water Availability Logic
        # -------------------------------
        if water_availability == "Low":
            if crop["water_intensity"] == "High":
                score -= 6  # avoid recommending
            elif crop["water_intensity"] == "Low":
                score += 2  # safe crops

        elif water_availability == "Medium":
            if crop["water_intensity"] == "High":
                score -= 2
            elif crop["water_intensity"] == "Medium":
                score += 1

        elif water_availability == "High":
            if crop["water_intensity"] == "High":
                score += 2

        return score

    # -----------------------------------
    # Recommendation Function
    # -----------------------------------
    def recommend_crops(
        self,
        rainfall_type: str,
        season: str,
        water_availability: str,
        current_crop: str,
        top_n: int = 3
    ):

        scores = []

        for crop in CROP_DATABASE:
            if crop.lower() == current_crop.lower():
                continue

            score = self.score_crop(
                crop,
                rainfall_type,
                season,
                water_availability
            )

            # Hard filter: remove bad options
            if score < 0:
                continue

            scores.append((crop, score))

        # Sort by score (descending), then name
        scores.sort(key=lambda x: (-x[1], x[0]))

        return [crop for crop, _ in scores[:top_n]]

    # -----------------------------------
    # Land Allocation Strategy
    # -----------------------------------
    @staticmethod
    def allocate_land(
        total_land: float,
        main_crop: str,
        alt_crops: list[str]
    ):
        if total_land <= 0:
            raise ValueError("total_land must be greater than 0")

        plan = {}

        main_portion = 0.6 * total_land
        remaining = total_land - main_portion

        plan[main_crop] = round(main_portion, 2)

        if not alt_crops:
            return plan

        split = remaining / len(alt_crops)

        for crop in alt_crops:
            plan[crop] = round(split, 2)

        return plan'''