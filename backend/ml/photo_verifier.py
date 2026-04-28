"""
Model 3: Photo Verifier
3a — GPS Check: EXIF metadata extraction + haversine distance
3b — Damage Type Matching: Color histogram heuristic analysis
"""
import os
import math
from io import BytesIO
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
import numpy as np


def _get_exif_gps(image: Image.Image) -> dict | None:
    """Extract GPS coordinates from image EXIF data."""
    try:
        exif_data = image._getexif()
        if not exif_data:
            return None

        gps_info = {}
        for tag_id, value in exif_data.items():
            tag = TAGS.get(tag_id, tag_id)
            if tag == "GPSInfo":
                for gps_tag_id, gps_value in value.items():
                    gps_tag = GPSTAGS.get(gps_tag_id, gps_tag_id)
                    gps_info[gps_tag] = gps_value

        if not gps_info:
            return None

        def _convert_to_degrees(value):
            d = float(value[0])
            m = float(value[1])
            s = float(value[2])
            return d + (m / 60.0) + (s / 3600.0)

        if "GPSLatitude" in gps_info and "GPSLongitude" in gps_info:
            lat = _convert_to_degrees(gps_info["GPSLatitude"])
            if gps_info.get("GPSLatitudeRef", "N") == "S":
                lat = -lat
            lon = _convert_to_degrees(gps_info["GPSLongitude"])
            if gps_info.get("GPSLongitudeRef", "E") == "W":
                lon = -lon
            return {"latitude": lat, "longitude": lon}

    except Exception:
        pass
    return None


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two GPS coordinates in kilometers."""
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def verify_gps(image_bytes: bytes, expected_lat: float, expected_lon: float) -> dict:
    """
    3a — Verify that the photo was taken near the claimed land.
    """
    try:
        img = Image.open(BytesIO(image_bytes))
        gps = _get_exif_gps(img)

        if gps is None:
            return {
                "status": "no_gps",
                "pass": False,
                "message": "No GPS data found in image. Please enable location services when taking photos.",
                "distance_km": None,
            }

        distance = _haversine_km(
            gps["latitude"], gps["longitude"],
            expected_lat, expected_lon
        )

        if distance < 5:
            return {
                "status": "pass",
                "pass": True,
                "message": f"Photo location verified ({distance:.1f} km from registered land)",
                "distance_km": round(distance, 2),
                "photo_coords": gps,
            }
        elif distance < 20:
            return {
                "status": "warning",
                "pass": False,
                "message": f"Photo taken {distance:.1f} km from registered land (threshold: 5 km)",
                "distance_km": round(distance, 2),
                "photo_coords": gps,
            }
        else:
            return {
                "status": "fail",
                "pass": False,
                "message": f"Photo taken {distance:.1f} km from registered land — location mismatch",
                "distance_km": round(distance, 2),
                "photo_coords": gps,
            }

    except Exception as e:
        return {
            "status": "error",
            "pass": False,
            "message": f"Could not process image for GPS verification: {str(e)}",
            "distance_km": None,
        }


# ── 3b: Damage Type Matching (Heuristic) ──────────────────────────

# Color profile expectations per damage type
DAMAGE_COLOR_PROFILES = {
    "weather": {
        "description": "Flood/Storm Damage",
        "expect_high": ["brown", "grey"],  # muddy, waterlogged
        "expect_low": ["green"],            # healthy vegetation destroyed
        "texture": "low_variance",          # uniform waterlogged areas
    },
    "crop_damage": {
        "description": "General Crop Damage",
        "expect_high": ["brown", "yellow"],  # dead/dying crops
        "expect_low": ["green"],
        "texture": "mixed",
    },
    "pest": {
        "description": "Pest/Disease Infestation",
        "expect_high": ["yellow", "brown"],  # discolored crops
        "expect_low": [],
        "texture": "high_variance",  # patchy damage
    },
    "other": {
        "description": "Other Damage",
        "expect_high": [],
        "expect_low": [],
        "texture": "any",
    },
}


def _analyze_image_colors(image_bytes: bytes) -> dict:
    """Analyze color distribution in an image."""
    try:
        img = Image.open(BytesIO(image_bytes)).convert("RGB")
        img = img.resize((200, 200))  # normalize size
        pixels = np.array(img)

        # Calculate color ratios
        r, g, b = pixels[:, :, 0], pixels[:, :, 1], pixels[:, :, 2]
        total = pixels.shape[0] * pixels.shape[1]

        # Green (vegetation)
        green_mask = (g > r * 1.1) & (g > b * 1.1) & (g > 60)
        green_ratio = np.sum(green_mask) / total

        # Brown (dead crops, soil)
        brown_mask = (r > 80) & (g > 50) & (g < r * 0.9) & (b < g * 0.8)
        brown_ratio = np.sum(brown_mask) / total

        # Yellow (diseased/dying)
        yellow_mask = (r > 150) & (g > 120) & (b < 80)
        yellow_ratio = np.sum(yellow_mask) / total

        # Grey (waterlogged)
        grey_mask = (np.abs(r.astype(int) - g.astype(int)) < 20) & \
                    (np.abs(g.astype(int) - b.astype(int)) < 20) & \
                    (r > 60) & (r < 180)
        grey_ratio = np.sum(grey_mask) / total

        # Texture variance (high = patchy, low = uniform)
        grey_img = np.mean(pixels, axis=2)
        texture_variance = np.std(grey_img)

        return {
            "green_ratio": round(float(green_ratio), 3),
            "brown_ratio": round(float(brown_ratio), 3),
            "yellow_ratio": round(float(yellow_ratio), 3),
            "grey_ratio": round(float(grey_ratio), 3),
            "texture_variance": round(float(texture_variance), 2),
            "avg_brightness": round(float(np.mean(grey_img)), 1),
        }

    except Exception as e:
        return {"error": str(e)}


def verify_damage(image_bytes: bytes, claimed_damage_type: str) -> dict:
    """
    3b — Check if the photo plausibly matches the claimed damage type.
    Returns a confidence score and explanation.
    """
    colors = _analyze_image_colors(image_bytes)

    if "error" in colors:
        return {
            "confidence": 50,
            "match": "unknown",
            "message": f"Could not analyze image: {colors['error']}",
            "color_analysis": colors,
        }

    profile = DAMAGE_COLOR_PROFILES.get(claimed_damage_type, DAMAGE_COLOR_PROFILES["other"])
    confidence = 50  # base confidence
    reasons = []

    color_map = {
        "green": colors["green_ratio"],
        "brown": colors["brown_ratio"],
        "yellow": colors["yellow_ratio"],
        "grey": colors["grey_ratio"],
    }

    # Check expected high colors
    for color in profile.get("expect_high", []):
        ratio = color_map.get(color, 0)
        if ratio > 0.15:
            confidence += 15
            reasons.append(f"High {color} content ({ratio:.0%}) consistent with {profile['description']}")
        elif ratio > 0.05:
            confidence += 5

    # Check expected low colors (green = healthy → should be low for damage)
    for color in profile.get("expect_low", []):
        ratio = color_map.get(color, 0)
        if ratio < 0.15:
            confidence += 10
            reasons.append(f"Low {color} content ({ratio:.0%}) indicates damaged vegetation")
        elif ratio > 0.4:
            confidence -= 15
            reasons.append(f"High {color} content ({ratio:.0%}) — land appears healthy, inconsistent with damage claim")

    # Texture check
    expected_texture = profile.get("texture", "any")
    tv = colors["texture_variance"]
    if expected_texture == "high_variance" and tv > 50:
        confidence += 5
        reasons.append("Patchy texture consistent with pest damage")
    elif expected_texture == "low_variance" and tv < 30:
        confidence += 5
        reasons.append("Uniform texture consistent with flood/waterlogging")

    # Very green image with damage claim = suspicious
    if colors["green_ratio"] > 0.5 and claimed_damage_type != "other":
        confidence -= 20
        reasons.append("Image shows predominantly healthy green vegetation")

    confidence = max(0, min(100, confidence))

    if confidence >= 65:
        match = "consistent"
    elif confidence >= 40:
        match = "inconclusive"
    else:
        match = "inconsistent"

    if not reasons:
        reasons.append(f"Image analyzed for {profile['description']} indicators")

    return {
        "confidence": confidence,
        "match": match,
        "message": f"Photo {'appears consistent with' if match == 'consistent' else 'is inconclusive for' if match == 'inconclusive' else 'does not appear to match'} claimed damage type: {profile['description']}",
        "reasons": reasons,
        "color_analysis": colors,
    }


def verify_photo(image_bytes: bytes, claimed_damage_type: str,
                 expected_lat: float | None = None, expected_lon: float | None = None) -> dict:
    """
    Run both GPS and damage verification on a photo.
    """
    result = {
        "gps_result": None,
        "damage_result": None,
        "overall_pass": True,
        "issues": [],
    }

    # GPS check
    if expected_lat is not None and expected_lon is not None:
        gps_result = verify_gps(image_bytes, expected_lat, expected_lon)
        result["gps_result"] = gps_result
        if not gps_result["pass"]:
            result["overall_pass"] = False
            result["issues"].append(gps_result["message"])

    # Damage check
    damage_result = verify_damage(image_bytes, claimed_damage_type)
    result["damage_result"] = damage_result
    if damage_result["match"] == "inconsistent":
        result["overall_pass"] = False
        result["issues"].append(damage_result["message"])
    elif damage_result["match"] == "inconclusive":
        result["issues"].append(damage_result["message"])

    return result
