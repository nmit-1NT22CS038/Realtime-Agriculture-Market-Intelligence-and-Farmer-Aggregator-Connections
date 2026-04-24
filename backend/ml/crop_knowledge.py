CROP_DATABASE = {
    "Rice": {"rainfall_requirement": "High", "seasons": ["Kharif"], "water_intensity": "High"},
    "Maize": {"rainfall_requirement": "Medium", "seasons": ["Kharif", "Rabi"], "water_intensity": "Medium"},
    "Wheat": {"rainfall_requirement": "Low", "seasons": ["Rabi"], "water_intensity": "Low"},
    "Ragi": {"rainfall_requirement": "Low", "seasons": ["Kharif"], "water_intensity": "Low"},
    "Jowar": {"rainfall_requirement": "Low", "seasons": ["Kharif"], "water_intensity": "Low"},
    "Tur Dal": {"rainfall_requirement": "Medium", "seasons": ["Kharif"], "water_intensity": "Low"},
    "Green Gram": {"rainfall_requirement": "Low", "seasons": ["Rabi"], "water_intensity": "Low"},
    "Chana Dal": {"rainfall_requirement": "Low", "seasons": ["Rabi"], "water_intensity": "Low"},
    "Groundnut": {"rainfall_requirement": "Low", "seasons": ["Kharif"], "water_intensity": "Low"},
    "Sunflower": {"rainfall_requirement": "Medium", "seasons": ["Rabi"], "water_intensity": "Low"},
    "Cotton": {"rainfall_requirement": "Medium", "seasons": ["Kharif"], "water_intensity": "Medium"},
    "Onion": {"rainfall_requirement": "Low", "seasons": ["Rabi"], "water_intensity": "Medium"},
    "Potato": {"rainfall_requirement": "Low", "seasons": ["Rabi"], "water_intensity": "Medium"},
}

def get_crop_info(crop_name: str):
    return CROP_DATABASE.get(crop_name)

def get_all_crops():
    return list(CROP_DATABASE.keys())