# Astro Vastu Logic - Links Planets, Directions, Colors, and Body Parts

from .vastu_directions import get_direction_info, get_colors_for_planet, VASTU_DIRECTIONS
from .zodiac_mapping import ZODIAC_BODY_MAPPING

# Classical Navagraha (9 Planets) - Zodiac Sign (Rāśi) Association
# Includes rulership, exaltation, debilitation, and nature

PLANET_ZODIAC_CLASSICAL = {
    'Sun': {
        'sanskrit_name': 'Surya',
        'ruled_signs': ['Leo'],
        'ruled_signs_sanskrit': ['Simha'],
        'exaltation_sign': 'Aries',
        'exaltation_sign_sanskrit': 'Mesha',
        'debilitation_sign': 'Libra',
        'debilitation_sign_sanskrit': 'Tula',
        'element': 'Fire',
        'nature': 'Royal, Kshatriya'
    },
    'Moon': {
        'sanskrit_name': 'Chandra',
        'ruled_signs': ['Cancer'],
        'ruled_signs_sanskrit': ['Karka'],
        'exaltation_sign': 'Taurus',
        'exaltation_sign_sanskrit': 'Vrishabha',
        'debilitation_sign': 'Scorpio',
        'debilitation_sign_sanskrit': 'Vrishchika',
        'element': 'Water',
        'nature': 'Emotional, Nurturing'
    },
    'Mars': {
        'sanskrit_name': 'Mangal',
        'ruled_signs': ['Aries', 'Scorpio'],
        'ruled_signs_sanskrit': ['Mesha', 'Vrishchika'],
        'exaltation_sign': 'Capricorn',
        'exaltation_sign_sanskrit': 'Makara',
        'debilitation_sign': 'Cancer',
        'debilitation_sign_sanskrit': 'Karka',
        'element': 'Fire',
        'nature': 'Warrior, Dynamic'
    },
    'Mercury': {
        'sanskrit_name': 'Budha',
        'ruled_signs': ['Gemini', 'Virgo'],
        'ruled_signs_sanskrit': ['Mithuna', 'Kanya'],
        'exaltation_sign': 'Virgo',
        'exaltation_sign_sanskrit': 'Kanya',
        'debilitation_sign': 'Pisces',
        'debilitation_sign_sanskrit': 'Meena',
        'element': 'Air/Earth',
        'nature': 'Intellectual'
    },
    'Jupiter': {
        'sanskrit_name': 'Guru',
        'ruled_signs': ['Sagittarius', 'Pisces'],
        'ruled_signs_sanskrit': ['Dhanu', 'Meena'],
        'exaltation_sign': 'Cancer',
        'exaltation_sign_sanskrit': 'Karka',
        'debilitation_sign': 'Capricorn',
        'debilitation_sign_sanskrit': 'Makar',
        'element': 'Ether/Water',
        'nature': 'Wisdom'
    },
    'Venus': {
        'sanskrit_name': 'Shukra',
        'ruled_signs': ['Taurus', 'Libra'],
        'ruled_signs_sanskrit': ['Vrishabha', 'Tula'],
        'exaltation_sign': 'Pisces',
        'exaltation_sign_sanskrit': 'Meena',
        'debilitation_sign': 'Virgo',
        'debilitation_sign_sanskrit': 'Kanya',
        'element': 'Earth/Air',
        'nature': 'Harmony'
    },
    'Saturn': {
        'sanskrit_name': 'Shani',
        'ruled_signs': ['Capricorn', 'Aquarius'],
        'ruled_signs_sanskrit': ['Makara', 'Kumbha'],
        'exaltation_sign': 'Libra',
        'exaltation_sign_sanskrit': 'Tula',
        'debilitation_sign': 'Aries',
        'debilitation_sign_sanskrit': 'Mesha',
        'element': 'Air',
        'nature': 'Discipline'
    },
    'Rahu': {
        'sanskrit_name': 'Rahu',
        'ruled_signs': ['Aquarius'],  # Co-ruler
        'ruled_signs_sanskrit': ['Kumbha'],
        'co_ruler': True,
        'exaltation_sign': 'Taurus',
        'exaltation_sign_sanskrit': 'Vrishabha',
        'debilitation_sign': 'Scorpio',
        'debilitation_sign_sanskrit': 'Vrishchika',
        'element': 'Air/Shadow',
        'nature': 'Transformation'
    },
    'Ketu': {
        'sanskrit_name': 'Ketu',
        'ruled_signs': ['Scorpio'],  # Co-ruler
        'ruled_signs_sanskrit': ['Vrishchika'],
        'co_ruler': True,
        'exaltation_sign': 'Scorpio',
        'exaltation_sign_sanskrit': 'Vrishchika',
        'debilitation_sign': 'Taurus',
        'debilitation_sign_sanskrit': 'Vrishabha',
        'element': 'Fire/Shadow',
        'nature': 'Moksha'
    }
}

# Legacy mapping for backward compatibility
PLANET_ZODIAC_RULERSHIP = {
    'Sun': ['Leo'],
    'Moon': ['Cancer'],
    'Mars': ['Aries', 'Scorpio'],
    'Mercury': ['Gemini', 'Virgo'],
    'Jupiter': ['Sagittarius', 'Pisces'],
    'Venus': ['Taurus', 'Libra'],
    'Saturn': ['Capricorn', 'Aquarius'],
    'Rahu': ['Aquarius'],
    'Ketu': ['Scorpio']
}

def get_planet_classical_info(planet):
    """
    Get complete classical information for a planet

    Args:
        planet (str): Planet name (e.g., 'Sun', 'Mars')

    Returns:
        dict: Classical planet information including Sanskrit name, rulership, exaltation, etc.
    """
    return PLANET_ZODIAC_CLASSICAL.get(planet)

def is_planet_exalted_in_sign(planet, sign):
    """
    Check if a planet is exalted in a given sign

    Args:
        planet (str): Planet name
        sign (str): Zodiac sign name

    Returns:
        bool: True if planet is exalted in the sign
    """
    planet_info = PLANET_ZODIAC_CLASSICAL.get(planet)
    if planet_info:
        return planet_info['exaltation_sign'] == sign
    return False

def is_planet_debilitated_in_sign(planet, sign):
    """
    Check if a planet is debilitated in a given sign

    Args:
        planet (str): Planet name
        sign (str): Zodiac sign name

    Returns:
        bool: True if planet is debilitated in the sign
    """
    planet_info = PLANET_ZODIAC_CLASSICAL.get(planet)
    if planet_info:
        return planet_info['debilitation_sign'] == sign
    return False

def get_planet_strength_in_sign(planet, sign):
    """
    Get the strength status of a planet in a sign

    Args:
        planet (str): Planet name
        sign (str): Zodiac sign name

    Returns:
        str: 'exalted', 'own_sign', 'debilitated', or 'neutral'
    """
    planet_info = PLANET_ZODIAC_CLASSICAL.get(planet)
    if not planet_info:
        return 'unknown'

    if planet_info['exaltation_sign'] == sign:
        return 'exalted'
    elif sign in planet_info['ruled_signs']:
        return 'own_sign'
    elif planet_info['debilitation_sign'] == sign:
        return 'debilitated'
    else:
        return 'neutral'

def get_body_parts_for_planet(planet):
    """
    Get body parts associated with a planet based on zodiac rulership

    Args:
        planet (str): Planet name (e.g., 'Sun', 'Mars')

    Returns:
        list: List of dicts containing zodiac signs and their body parts
    """
    ruled_signs = PLANET_ZODIAC_RULERSHIP.get(planet, [])
    body_parts = []

    for sign in ruled_signs:
        zodiac_info = ZODIAC_BODY_MAPPING.get(sign)
        if zodiac_info:
            body_parts.append({
                'zodiac_sign': sign,
                'body_part': zodiac_info['body_part'],
                'placement_zone': zodiac_info['placement_zone'],
                'accessories': zodiac_info['accessories']
            })

    return body_parts

def get_placement_suggestions_for_direction(direction, planet=None):
    """
    Get placement suggestions (body parts, colors, accessories) for a direction

    Args:
        direction (str): Direction name (e.g., 'North', 'South-East')
        planet (str, optional): Specific planet to focus on. If None, uses all planets for that direction

    Returns:
        dict: Placement suggestions including body parts, colors, and accessories
    """
    direction_info = get_direction_info(direction)

    if not direction_info:
        return None

    planets = [planet] if planet else direction_info['planets']

    suggestions = {
        'direction': direction,
        'sanskrit_name': direction_info['sanskrit_name'],
        'energy_nature': direction_info['energy_nature'],
        'planets': [],
        'all_colors': direction_info['suggested_colors'],
        'all_body_parts': [],
        'all_accessories': []
    }

    for p in planets:
        planet_data = {
            'planet': p,
            'colors': get_colors_for_planet(p),
            'body_parts': get_body_parts_for_planet(p)
        }

        suggestions['planets'].append(planet_data)

        # Aggregate all body parts and accessories
        for bp_info in planet_data['body_parts']:
            suggestions['all_body_parts'].append(bp_info['body_part'])
            suggestions['all_accessories'].extend(bp_info['accessories'])

    # Remove duplicates
    suggestions['all_body_parts'] = list(set(suggestions['all_body_parts']))
    suggestions['all_accessories'] = list(set(suggestions['all_accessories']))

    return suggestions

def generate_placement_recommendation(planet, direction):
    """
    Generate a formatted placement recommendation for a planet in a direction

    Args:
        planet (str): Planet name
        direction (str): Direction name

    Returns:
        dict: Formatted recommendation with color, body part, and accessory suggestions
    """
    direction_info = get_direction_info(direction)

    if not direction_info:
        return {
            'error': f'Direction "{direction}" not found'
        }

    # Check if planet is associated with this direction
    if planet not in direction_info['planets']:
        return {
            'warning': f'Planet "{planet}" is not typically associated with direction "{direction}"',
            'direction_planets': direction_info['planets']
        }

    # Get colors for the planet
    colors = get_colors_for_planet(planet)

    # Get body parts for the planet
    body_parts_info = get_body_parts_for_planet(planet)

    recommendation = {
        'planet': planet,
        'direction': direction,
        'sanskrit_direction': direction_info['sanskrit_name'],
        'colors': colors,
        'primary_color': colors[0] if colors else None,
        'body_parts': [],
        'accessories': [],
        'formatted_suggestion': ''
    }

    # Format body parts and accessories
    for bp_info in body_parts_info:
        recommendation['body_parts'].append({
            'zodiac_sign': bp_info['zodiac_sign'],
            'body_part': bp_info['body_part'],
            'placement_zone': bp_info['placement_zone']
        })
        recommendation['accessories'].extend(bp_info['accessories'])

    # Remove duplicate accessories
    recommendation['accessories'] = list(set(recommendation['accessories']))

    # Generate formatted suggestion
    if recommendation['body_parts'] and recommendation['colors']:
        body_part_text = ' or '.join([bp['body_part'] for bp in recommendation['body_parts']])
        color_text = ' or '.join(colors[:2])  # Use first 2 colors
        accessory_text = ', '.join(recommendation['accessories'][:3]) if recommendation['accessories'] else 'appropriate items'

        recommendation['formatted_suggestion'] = (
            f"Place {planet} in {direction} ({direction_info['sanskrit_name']}): "
            f"Use {color_text} colors on {body_part_text}. "
            f"Suggested items: {accessory_text}."
        )

    return recommendation

def generate_removal_recommendation(planet, direction):
    """
    Generate a formatted removal recommendation for a planet from a direction

    Args:
        planet (str): Planet name
        direction (str): Direction name

    Returns:
        dict: Formatted recommendation for what to remove/avoid
    """
    direction_info = get_direction_info(direction)

    if not direction_info:
        return {
            'error': f'Direction "{direction}" not found'
        }

    # Get colors for the planet (these should be avoided in the removal context)
    colors = get_colors_for_planet(planet)

    # Get body parts for the planet
    body_parts_info = get_body_parts_for_planet(planet)

    recommendation = {
        'planet': planet,
        'direction': direction,
        'sanskrit_direction': direction_info['sanskrit_name'],
        'avoid_colors': colors,
        'body_parts': [],
        'avoid_accessories': [],
        'formatted_suggestion': ''
    }

    # Format body parts and accessories to avoid
    for bp_info in body_parts_info:
        recommendation['body_parts'].append({
            'zodiac_sign': bp_info['zodiac_sign'],
            'body_part': bp_info['body_part'],
            'placement_zone': bp_info['placement_zone']
        })
        recommendation['avoid_accessories'].extend(bp_info['accessories'])

    # Remove duplicate accessories
    recommendation['avoid_accessories'] = list(set(recommendation['avoid_accessories']))

    # Generate formatted suggestion
    if recommendation['body_parts'] and recommendation['avoid_colors']:
        body_part_text = ' or '.join([bp['body_part'] for bp in recommendation['body_parts']])
        color_text = ' or '.join(colors[:2])  # Use first 2 colors
        accessory_text = ', '.join(recommendation['avoid_accessories'][:3]) if recommendation['avoid_accessories'] else 'related items'

        recommendation['formatted_suggestion'] = (
            f"Remove {planet} from {direction} ({direction_info['sanskrit_name']}): "
            f"Avoid {color_text} colors on {body_part_text}. "
            f"Remove or avoid: {accessory_text}."
        )

    return recommendation

def batch_generate_recommendations(placements, action='place'):
    """
    Generate recommendations for multiple planet-direction combinations

    Args:
        placements (list): List of dicts with 'planet' and 'direction' keys
        action (str): Either 'place' or 'remove'

    Returns:
        list: List of recommendation dicts
    """
    recommendations = []

    for placement in placements:
        planet = placement.get('planet')
        direction = placement.get('direction')

        if not planet or not direction:
            continue

        if action == 'place':
            rec = generate_placement_recommendation(planet, direction)
        else:
            rec = generate_removal_recommendation(planet, direction)

        recommendations.append(rec)

    return recommendations
