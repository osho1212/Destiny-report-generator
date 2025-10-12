# 16-Direction Vastu Mapping with Planetary Influences and Colors
# Used for advanced Mahavastu / Astro-Vastu practice

VASTU_DIRECTIONS = {
    'East': {
        'number': 1,
        'sanskrit_name': 'Poorva',
        'associated_planet': 'Surya (Sun)',
        'planets': ['Sun'],
        'suggested_colors': ['Saffron', 'Golden', 'Red'],
        'energy_nature': 'Vitality, beginnings, clarity'
    },
    'West': {
        'number': 2,
        'sanskrit_name': 'Paschim',
        'associated_planet': 'Shani (Saturn)',
        'planets': ['Saturn'],
        'suggested_colors': ['Navy Blue', 'Dark Grey', 'Black'],
        'energy_nature': 'Stability, control, introspection'
    },
    'North': {
        'number': 3,
        'sanskrit_name': 'Uttara',
        'associated_planet': 'Budha (Mercury)',
        'planets': ['Mercury'],
        'suggested_colors': ['Green'],
        'energy_nature': 'Communication, intelligence'
    },
    'South': {
        'number': 4,
        'sanskrit_name': 'Dakshina',
        'associated_planet': 'Mangal (Mars)',
        'planets': ['Mars'],
        'suggested_colors': ['Red', 'Maroon'],
        'energy_nature': 'Action, strength, assertiveness'
    },
    'North-East': {
        'number': 5,
        'sanskrit_name': 'Ishan',
        'associated_planet': 'Guru (Jupiter) + Ketu',
        'planets': ['Jupiter', 'Ketu'],
        'suggested_colors': ['Yellow', 'Cream', 'White'],
        'energy_nature': 'Divine, wisdom, spiritual uplift'
    },
    'North-West': {
        'number': 6,
        'sanskrit_name': 'Vayavya',
        'associated_planet': 'Chandra (Moon) + Rahu (secondary)',
        'planets': ['Moon', 'Rahu'],
        'suggested_colors': ['White', 'Light Blue', 'Light Grey'],
        'energy_nature': 'Movement, change, diplomacy'
    },
    'South-East': {
        'number': 7,
        'sanskrit_name': 'Agneya',
        'associated_planet': 'Shukra (Venus) + Mangal',
        'planets': ['Venus', 'Mars'],
        'suggested_colors': ['Light Pink', 'Orange', 'Saffron'],
        'energy_nature': 'Energy, luxury, wealth'
    },
    'South-West': {
        'number': 8,
        'sanskrit_name': 'Nairutya',
        'associated_planet': 'Rahu',
        'planets': ['Rahu'],
        'suggested_colors': ['Smoky Blue', 'Charcoal', 'Muddy Brown'],
        'energy_nature': 'Stability, hidden power'
    },
    'East-North-East': {
        'number': 9,
        'sanskrit_name': 'Eshaanya (ENE)',
        'associated_planet': 'Surya + Jupiter',
        'planets': ['Sun', 'Jupiter'],
        'suggested_colors': ['Light Yellow', 'White', 'Golden'],
        'energy_nature': 'Illumination, clarity'
    },
    'East-South-East': {
        'number': 10,
        'sanskrit_name': 'Aagneya (ESE)',
        'associated_planet': 'Surya + Venus',
        'planets': ['Sun', 'Venus'],
        'suggested_colors': ['Orange', 'Peach', 'Warm tones'],
        'energy_nature': 'Power, relationship energy'
    },
    'South-South-East': {
        'number': 11,
        'sanskrit_name': 'Dakshina-Agneya (SSE)',
        'associated_planet': 'Mars + Venus',
        'planets': ['Mars', 'Venus'],
        'suggested_colors': ['Fiery Red', 'Orange-Red'],
        'energy_nature': 'Passion, ambition'
    },
    'South-South-West': {
        'number': 12,
        'sanskrit_name': 'Dakshina-Nairutya (SSW)',
        'associated_planet': 'Mars + Rahu',
        'planets': ['Mars', 'Rahu'],
        'suggested_colors': ['Terracotta', 'Brown', 'Rust'],
        'energy_nature': 'Grounding, control'
    },
    'West-South-West': {
        'number': 13,
        'sanskrit_name': 'Paschima-Nairutya (WSW)',
        'associated_planet': 'Saturn + Rahu',
        'planets': ['Saturn', 'Rahu'],
        'suggested_colors': ['Earthy Brown', 'Dark Grey'],
        'energy_nature': 'Security, persistence'
    },
    'West-North-West': {
        'number': 14,
        'sanskrit_name': 'Paschima-Vayavya (WNW)',
        'associated_planet': 'Saturn + Moon',
        'planets': ['Saturn', 'Moon'],
        'suggested_colors': ['Light Grey', 'Mist Blue'],
        'energy_nature': 'Emotional balance, flexibility'
    },
    'North-North-West': {
        'number': 15,
        'sanskrit_name': 'Uttara-Vayavya (NNW)',
        'associated_planet': 'Moon + Mercury',
        'planets': ['Moon', 'Mercury'],
        'suggested_colors': ['Pale Green', 'Aqua', 'Sky tones'],
        'energy_nature': 'Support, movement'
    },
    'North-North-East': {
        'number': 16,
        'sanskrit_name': 'Uttara-Ishan (NNE)',
        'associated_planet': 'Jupiter + Moon',
        'planets': ['Jupiter', 'Moon'],
        'suggested_colors': ['Aqua', 'Light Green', 'White'],
        'energy_nature': 'Healing, prosperity'
    }
}

# Mapping of planets to their primary colors
PLANET_COLORS = {
    'Sun': ['Saffron', 'Golden', 'Red', 'Orange'],
    'Moon': ['White', 'Light Blue', 'Light Grey', 'Aqua'],
    'Mars': ['Red', 'Maroon', 'Fiery Red', 'Orange-Red'],
    'Mercury': ['Green', 'Pale Green'],
    'Jupiter': ['Yellow', 'Light Yellow', 'Cream', 'Golden'],
    'Venus': ['Light Pink', 'Orange', 'Peach', 'White'],
    'Saturn': ['Navy Blue', 'Dark Grey', 'Black', 'Light Grey'],
    'Rahu': ['Smoky Blue', 'Charcoal', 'Muddy Brown', 'Earthy Brown'],
    'Ketu': ['Yellow', 'Cream', 'White']
}

def get_direction_info(direction):
    """
    Get Vastu information for a specific direction

    Args:
        direction (str): Direction name (e.g., 'East', 'North-East')

    Returns:
        dict: Direction information or None if not found
    """
    return VASTU_DIRECTIONS.get(direction)

def get_colors_for_direction(direction):
    """
    Get suggested colors for a specific direction

    Args:
        direction (str): Direction name

    Returns:
        list: List of colors or empty list if not found
    """
    info = get_direction_info(direction)
    return info['suggested_colors'] if info else []

def get_planets_for_direction(direction):
    """
    Get associated planets for a specific direction

    Args:
        direction (str): Direction name

    Returns:
        list: List of planets or empty list if not found
    """
    info = get_direction_info(direction)
    return info['planets'] if info else []

def get_colors_for_planet(planet):
    """
    Get suggested colors for a specific planet

    Args:
        planet (str): Planet name (e.g., 'Sun', 'Moon', 'Mars')

    Returns:
        list: List of colors or empty list if not found
    """
    return PLANET_COLORS.get(planet, [])

def get_directions_for_planet(planet):
    """
    Get all directions associated with a planet

    Args:
        planet (str): Planet name

    Returns:
        list: List of directions where this planet has influence
    """
    directions = []
    for direction, info in VASTU_DIRECTIONS.items():
        if planet in info['planets']:
            directions.append(direction)
    return directions

def get_all_directions():
    """
    Get list of all 16 directions

    Returns:
        list: List of direction names
    """
    return list(VASTU_DIRECTIONS.keys())

def suggest_colors_for_planets(planets):
    """
    Suggest colors based on multiple planets

    Args:
        planets (list): List of planet names

    Returns:
        dict: Dictionary with colors to use and colors to avoid
    """
    colors_to_use = set()

    for planet in planets:
        colors = get_colors_for_planet(planet)
        colors_to_use.update(colors)

    return {
        'colors_to_use': list(colors_to_use),
        'planets': planets
    }
