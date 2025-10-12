# Zodiac Sign Body Part and Accessory Mapping
# This data is used for suggesting colors/objects to use or avoid on the body

ZODIAC_BODY_MAPPING = {
    'Aries': {
        'symbol': '♈',
        'body_part': 'Head / Hair region',
        'placement_zone': 'Head',
        'accessories': ['Ear pins', 'Hairpins', 'Headband'],
        'category': 'head'
    },
    'Taurus': {
        'symbol': '♉',
        'body_part': 'Neck',
        'placement_zone': 'Neck',
        'accessories': ['Necklace'],
        'category': 'neck'
    },
    'Gemini': {
        'symbol': '♊',
        'body_part': 'Shoulders / Arms',
        'placement_zone': 'Shoulders/Arms',
        'accessories': ['Mobile', 'Ring', 'Bracelet', 'Wristwatch', 'Pens'],
        'category': 'arms'
    },
    'Cancer': {
        'symbol': '♋',
        'body_part': 'Chest (Center)',
        'placement_zone': 'Chest Center',
        'accessories': ['Long pendant'],
        'category': 'chest'
    },
    'Leo': {
        'symbol': '♌',
        'body_part': 'Chest (Left side)',
        'placement_zone': 'Chest Left',
        'accessories': ['Broach'],
        'category': 'chest'
    },
    'Virgo': {
        'symbol': '♍',
        'body_part': 'Waist / Pockets',
        'placement_zone': 'Waist/Pockets',
        'accessories': ['Pocket emulates', 'Charms (kept in side pocket)'],
        'category': 'waist'
    },
    'Libra': {
        'symbol': '♎',
        'body_part': 'Waist',
        'placement_zone': 'Waist',
        'accessories': ['Belt', 'Waistband', 'Kamarbandh'],
        'category': 'waist'
    },
    'Scorpio': {
        'symbol': '♏',
        'body_part': 'Private / inner clothing area',
        'placement_zone': 'Inner clothing',
        'accessories': ['Color of undergarments'],
        'category': 'inner'
    },
    'Sagittarius': {
        'symbol': '♐',
        'body_part': 'Thighs',
        'placement_zone': 'Thighs',
        'accessories': ['Shorts', 'Trouser pockets'],
        'category': 'thighs'
    },
    'Capricorn': {
        'symbol': '♑',
        'body_part': 'Knees / lower legs',
        'placement_zone': 'Knees/Lower legs',
        'accessories': ['Trousers', 'Lowers'],
        'category': 'legs'
    },
    'Aquarius': {
        'symbol': '♒',
        'body_part': 'Ankles',
        'placement_zone': 'Ankles',
        'accessories': ['Anklet'],
        'category': 'ankles'
    },
    'Pisces': {
        'symbol': '♓',
        'body_part': 'Feet',
        'placement_zone': 'Feet',
        'accessories': ['Shoes', 'Footwear', 'Toe rings'],
        'category': 'feet'
    }
}

def get_zodiac_info(sign):
    """
    Get body part and accessory information for a zodiac sign

    Args:
        sign (str): Zodiac sign name (e.g., 'Aries', 'Taurus')

    Returns:
        dict: Zodiac information or None if not found
    """
    return ZODIAC_BODY_MAPPING.get(sign)

def get_accessories_for_sign(sign):
    """
    Get list of accessories for a specific zodiac sign

    Args:
        sign (str): Zodiac sign name

    Returns:
        list: List of accessories or empty list if not found
    """
    info = get_zodiac_info(sign)
    return info['accessories'] if info else []

def get_body_part_for_sign(sign):
    """
    Get body part/placement zone for a specific zodiac sign

    Args:
        sign (str): Zodiac sign name

    Returns:
        str: Body part description or None if not found
    """
    info = get_zodiac_info(sign)
    return info['body_part'] if info else None

def get_all_zodiac_signs():
    """
    Get list of all zodiac signs

    Returns:
        list: List of zodiac sign names
    """
    return list(ZODIAC_BODY_MAPPING.keys())
