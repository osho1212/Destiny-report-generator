import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import apiService from '../services/apiService';
import ReportPreview from './ReportPreview';
import ShinyText from './ShinyText';
import './ReportForm.css';

// Planet donation information - moved outside component to avoid re-creation
const planetDonationInfo = {
    'Sun': {
      day: 'Sunday',
      items: 'Wheat, Jaggery, Copper, Red cloth, Ruby, Kumkum/Red sandalwood',
      beneficiaries: 'Brahmins, the poor, or temples'
    },
    'Moon': {
      day: 'Monday',
      items: 'Rice, Milk, curd, white sugar, White cloth, Silver, Pearls, Conch shell/white flowers',
      beneficiaries: 'Women, mothers, or temple priests'
    },
    'Mars': {
      day: 'Tuesday',
      items: 'Red lentils (masoor dal), Red cloth, Copper/red coral, Jaggery, Weapons/iron tools',
      beneficiaries: 'Soldiers, laborers, temple caretakers'
    },
    'Mercury': {
      day: 'Wednesday',
      items: 'Green vegetables, Whole green moong dal, Green cloth, Bronze utensils, Emerald, Tulsi plant',
      beneficiaries: 'Students, scholars, young people'
    },
    'Jupiter': {
      day: 'Thursday',
      items: 'Turmeric (haldi), Yellow sweets/chana dal, Yellow cloth, Gold/brass, Banana/yellow flowers, Pukhraj',
      beneficiaries: 'Teachers, priests, spiritual people'
    },
    'Venus': {
      day: 'Friday',
      items: 'White sweets (kheer, mishri, sugar), White clothes, Silver, Fragrant items (itr/sandalwood), Diamond, Cow donation',
      beneficiaries: 'Women, artists, or the poor'
    },
    'Saturn': {
      day: 'Saturday',
      items: 'Black sesame seeds (til), Black cloth, Mustard oil, Iron, Urad dal (black gram), Blue sapphire',
      beneficiaries: 'Poor, handicapped, old people, sweepers'
    },
    'Rahu': {
      day: 'Saturday or Wednesday',
      items: 'Black sesame, Mustard oil, Blue/black cloth, Coconut, Blanket, Mixed grains',
      beneficiaries: 'Orphanages, poor people, or temples'
    },
    'Ketu': {
      day: 'Tuesday or Thursday',
      items: 'Brown blanket, Sesame, Dog food (feeding dogs), Multi-grain food, Flag at temple',
      beneficiaries: 'Temples, stray animals, poor'
    }
  };

// Gemstone information for each planet
const planetGemstoneInfo = {
  'Sun': {
    english: 'Ruby',
    hindi: 'माणिक्य (Maanikya)',
    hindiPlanet: 'सूर्य (Surya)'
  },
  'Moon': {
    english: 'Pearl',
    hindi: 'मोती (Moti)',
    hindiPlanet: 'चंद्र (Chandra)'
  },
  'Mars': {
    english: 'Red Coral',
    hindi: 'मूंगा (Moonga)',
    hindiPlanet: 'मंगल (Mangal)'
  },
  'Mercury': {
    english: 'Emerald',
    hindi: 'पन्ना (Panna)',
    hindiPlanet: 'बुध (Budh)'
  },
  'Jupiter': {
    english: 'Yellow Sapphire',
    hindi: 'पुखराज (Pukhraj)',
    hindiPlanet: 'बृहस्पति / गुरु (Brihaspati / Guru)'
  },
  'Venus': {
    english: 'Diamond',
    hindi: 'हीरा (Heera)',
    hindiPlanet: 'शुक्र (Shukra)'
  },
  'Saturn': {
    english: 'Blue Sapphire',
    hindi: 'नीलम (Neelam)',
    hindiPlanet: 'शनि (Shani)'
  },
  'Rahu': {
    english: 'Hessonite (Gomed)',
    hindi: 'गोमेद (Gomed)',
    hindiPlanet: 'राहु (Rahu)'
  },
  'Ketu': {
    english: "Cat's Eye",
    hindi: 'लहसुनिया (Lahsunia)',
    hindiPlanet: 'केतु (Ketu)'
  }
};

// Mantra information for each planet
const planetMantraInfo = {
  'Sun': {
    deity: 'Lord Surya',
    mantra: 'Om Hram Hreem Hroum Sah Suryaya Namah'
  },
  'Moon': {
    deity: 'Lord Shiva',
    mantra: 'Om Shram Shreem Shroum Sah Chandraya Namah'
  },
  'Mars': {
    deity: 'Lord Hanuman (or Kartikeya)',
    mantra: 'Om Kram Kreem Kroum Sah Bhaumaya Namah'
  },
  'Mercury': {
    deity: 'Lord Vishnu',
    mantra: 'Om Bram Breem Broum Sah Budhaya Namah'
  },
  'Jupiter': {
    deity: 'Lord Brihaspati or Lord Dakshinamurthy',
    mantra: 'Om Gram Greem Groum Sah Gurave Namah'
  },
  'Venus': {
    deity: 'Goddess Lakshmi',
    mantra: 'Om Dram Dreem Droum Sah Shukraya Namah'
  },
  'Saturn': {
    deity: 'Lord Shani Dev (or Lord Hanuman)',
    mantra: 'Om Pram Preem Proum Sah Shanaye Namah'
  },
  'Rahu': {
    deity: 'Goddess Durga / Lord Bhairava',
    mantra: 'Om Bhram Bhreem Bhroum Sah Rahave Namah'
  },
  'Ketu': {
    deity: 'Lord Ganesha',
    mantra: 'Om Stram Streem Stroum Sah Ketave Namah'
  }
};

// Nakshatra information with symbols
const nakshatraInfo = {
  'Ashwani': {
    mobileDisplayPicture: `◦ Drum/Pair of fish
◦ Coiled serpent/female cat/owl/blue sparrow`,
    beneficialSymbols: `◦ Drum/Pair of fish
◦ Coiled serpent/female cat/owl/blue sparrow`,
    prosperitySymbols: `◦ Inverted triangle/ELEPHANT/CROW
◦ Winnowing Basket/MALE MONKEY`,
    mentalPhysicalWellbeing: `◦ Hand/fist/FEMALE BUFFALO/FALCON`,
    accomplishments: `◦ Shoot of a plant/MALE BUFFALO
◦ Tears/FEMALE DOG
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL`,
    avoidSymbols: `◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER
◦ POTTER'S WHEEL/MALE TIGER
◦ SWORD/MALE LION/PIGEON
◦ BOW AND ARROW/FEMALE CAT/SWAN
◦ Deer's head/FEMALE SERPENT/HEN
◦ A drum/flute/FEMALE LION/PEACOCK
◦ Sharp knife/GOAT/PEACOCK
◦ Elephants tusks/MALE MANGOOSE/STORK`
  },
  'Bharani': {
    mobileDisplayPicture: `◦ Horse head/HORSE/EAGLE
◦ ROYAL THRONE/PALANQUIN/MOUSE/EAGLE`,
    beneficialSymbols: `◦ Horse head/HORSE/EAGLE
◦ ROYAL THRONE/PALANQUIN/MOUSE/EAGLE`,
    prosperitySymbols: `◦ SHARP KNIFE/GOAT/PEACOCK
◦ ELEPHANT TUSK/MALE MANGOOSE/STORK`,
    mentalPhysicalWellbeing: `◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER`,
    accomplishments: `◦ Potter's wheel/MALE TIGER
◦ SWORD/MALE LION/PIGION
◦ BOW AND ARROW/FEMALE CAT/SWAN`,
    avoidSymbols: `◦ LOTUS/FEMALE DEER/NIGHTINGALE
◦ Three foot prints/FEMALE MONKEY
◦ Hand or Fist/FEMALE BUFFALO/FALCON
◦ Chariot/SERPENT/WHITE OWL
◦ Shoot of a plant/MALE BUFFALO
◦ Tears/FEMALE DOG
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL
◦ UDDER OF A COW/GOAT/SEA CROW
◦ SERPENT IN WATER/FEMALE COW`
  },
  'Krittika': {
    mobileDisplayPicture: `◦ Inverted triangle/ELEPHANT/crow`,
    beneficialSymbols: `◦ Inverted triangle/ELEPHANT/crow`,
    prosperitySymbols: `◦ Three foot prints/FEMALE MONKEY
◦ CHARIOT/SERPENT/WHITE OWL`,
    mentalPhysicalWellbeing: `◦ SHOOT OF A PLANT/MALE BUFFALO`,
    accomplishments: `◦ Udder of a cow/GOAT/SEA CROW
◦ SERPENT IN WATER/FEMALE COW
◦ Lotus/FEMALE DEER/NIGHTINGALE`,
    avoidSymbols: `◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER
◦ COILED SERPENT/FEMALE CAT/OWL
◦ Potter's wheel/MALE TIGER
◦ Drum/pair of fish/FEMALE ELEPHANT
◦ Circular amulet/umbrella/ear rings/MALE DEER
◦ SWORD/MALE LION/PIGION
◦ BOW AND ARROW/FEMALE CAT/SWAN
◦ Deer's head/FEMALE SERPENT/HEN
◦ A drum/flute/FEMALE LION/PEACOCK`
  },
  'Rohini': {
    mobileDisplayPicture: `◦ Sharp knife/GOAT/PEACOCK
◦ UTTARAFALFUNI/MALE COW(NANDI)/PEACOCK`,
    beneficialSymbols: `◦ Sharp knife/GOAT/PEACOCK
◦ UTTARAFALFUNI/MALE COW(NANDI)/PEACOCK`,
    prosperitySymbols: `◦ DEER'S HEAD/FEMALE SERPENT/HEN
◦ Drum/FLUTE/FEMALE LION/PEACOCK`,
    mentalPhysicalWellbeing: `◦ POTTER'S WHEEL/MALE TIGER`,
    accomplishments: `◦ COILED SERPENT/FEMALE CAT/OWL
◦ Drum/pair of fish/FEMALE ELEPHANT
◦ Circular amulet/umbrella/ear rings/MALE DEER`,
    avoidSymbols: `◦ SERPENT IN WATER/FEMALE COW
◦ Lotus/FEMALE DEER/NIGHTINGALE
◦ Shoot of a plant
◦ Tears/FEMALE DOG
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL
◦ Horse head/HORSE/EAGLE
◦ RETICULATED ROOT/MALE DOG/RED VULTURE
◦ ROYAL THRONE/PALANQUIN/MOUSE/EAGLE
◦ UDDER OF A COW/GOAT/SEA CROW`
  },
  'Mrigashira': {
    mobileDisplayPicture: `◦ HASTA/FEMALE BUFFALO/FALCON
◦ Chariot/SERPENT/WHITE OWL`,
    beneficialSymbols: `◦ HASTA/FEMALE BUFFALO/FALCON
◦ Chariot/SERPENT/WHITE OWL`,
    prosperitySymbols: `◦ Tear/FEMALE DOG
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL`,
    mentalPhysicalWellbeing: `◦ Lotus/FEMALE DEER/NIGHTINGALE`,
    accomplishments: `◦ RETICULATED ROOT/MALE DOG/RED VULTURE
◦ Horse head/HORSE/EAGLE
◦ ROYAL THRONE/PALANQUIN/MOUSE/EAGLE`,
    avoidSymbols: `◦ COILED SERPENT/FEMALE CAT/OWL
◦ Potter's wheel/MALE TIGER
◦ Drum/pair of fish/FEMALE ELEPHANT
◦ Winnowing basket/MALE MONKEY
◦ Swinging Hammock/FEMALE RAT/FEMALE EAGLE
◦ Inverted triangle/ELEPHANT/CROW
◦ Circular amulet/umbrella/ear rings/MALE DEER
◦ SWORD/MALE LION/PIGION
◦ BOW AND ARROW/FEMALE CAT/SWAN`
  },
  'Ardra': {
    mobileDisplayPicture: `◦ Deer's Head/FEMALE SERPENT/HEN
◦ BRIGHT JEWEL/PEARL/FEMALE TIGER/WOODPECKER`,
    beneficialSymbols: `◦ Deer's Head/FEMALE SERPENT/HEN
◦ BRIGHT JEWEL/PEARL/FEMALE TIGER/WOODPECKER`,
    prosperitySymbols: `◦ BOW AND ARROW/FEMALE CAT/SWAN
◦ Swords/MALE LION/PIGEON`,
    mentalPhysicalWellbeing: `◦ Circular amulet/umbrella/ear ring/MALE DEER(STAG)`,
    accomplishments: `◦ Winnowing basket/MALE MONKEY
◦ Swinging Hammock/FEMALE RAT/FEMALE EAGLE
◦ Inverted triangle/ELEPHANT/CROW`,
    avoidSymbols: `◦ Lotus/FEMALE DEER/NIGHTINGALE
◦ Sharp knife/GOAT/PEACOCK
◦ Elephants tusks/MALE MANGOOSE/STORK
◦ Horse head/HORSE/EAGLE
◦ ROYAL THRONE/PALANQUIN
◦ RETICULATED ROOT
◦ UDDER OF A COW/GOAT/SEA CROW
◦ SERPENT IN WATER/FEMALE COW`
  },
  'Punarvasu': {
    mobileDisplayPicture: `◦ TEAR/FEMALE DOG
◦ Shoot of a plant/MALE BUFFALO`,
    beneficialSymbols: `◦ TEAR/FEMALE DOG
◦ Shoot of a plant/MALE BUFFALO`,
    prosperitySymbols: `◦ UDDER OF A COW/GOAT/SEA CROW
◦ SERPENT IN WATER/FEMALE COW`,
    mentalPhysicalWellbeing: `◦ Reticulated root/MALE DOG/RED VULTURE`,
    accomplishments: `◦ Sharp knife/GOAT/PEACOCK
◦ Elephants tusks/MALE MANGOOSE/STORK`,
    avoidSymbols: `◦ Three foot prints/FEMALE MONKEY
◦ Hand or Fist/FEMALE BUFFALO/FALCON
◦ Chariot/SERPENT/WHITE OWL
◦ COILED SERPENT/FEMALE CAT/OWL
◦ Drum/pair of fish/FEMALE ELEPHANT
◦ Circular amulet/umbrella/ear rings/MALE DEER
◦ Winnowing basket/MALE MONKEY
◦ Swinging Hammock/FEMALE RAT/FEMALE EAGLE
◦ Inverted triangle/ELEPHANT/CROW`
  },
  'Pushya': {
    mobileDisplayPicture: `◦ BOW AND ARROW/FEMALE CAT/SWAN
◦ POTTER'S WHEEL/MALE TIGER`,
    beneficialSymbols: `◦ BOW AND ARROW/FEMALE CAT/SWAN
◦ POTTER'S WHEEL/MALE TIGER`,
    prosperitySymbols: `◦ COILED SERPEN/FEMALE CAT/OWL/BLUE SPARROW
◦ Pair of fish/FEMALE ELEPHANT`,
    mentalPhysicalWellbeing: `◦ WINNOWING BASKET/MALE MONKEY`,
    accomplishments: `◦ Three foot prints/FEMALE MONKEY
◦ Hand or Fist/FEMALE BUFFALO/FALCON
◦ Chariot/SERPENT/WHITE OWL`,
    avoidSymbols: `◦ Sharp knife/GOAT/PEACOCK
◦ Elephants tusks/MALE MANGOOSE/STORK
◦ Horse head/HORSE/EAGLE
◦ ROYAL THRONE/PALANQUIN
◦ RETICULATED ROOT
◦ Deer's head/FEMALE SERPENT/HEN
◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER
◦ A drum/flute/FEMALE LION/PEACOCK`
  },
  'Ashlesha': {
    mobileDisplayPicture: `◦ UDDER OF A COW/GOAT/SEA CROW
◦ LOTUS/FEMALE DEER/NIGHTINGALE`,
    beneficialSymbols: `◦ UDDER OF A COW/GOAT/SEA CROW
◦ LOTUS/FEMALE DEER/NIGHTINGALE`,
    prosperitySymbols: `◦ ROYAL THRONE/PALANQUIN
◦ Horse head/HORSE/EAGLE`,
    mentalPhysicalWellbeing: `◦ ELEPHANT TUSK/MALE MANGOOSE/STORK`,
    accomplishments: `◦ Deer's head/FEMALE SERPENT/HEN
◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER
◦ A drum/flute/FEMALE LION/PEACOCK`,
    avoidSymbols: `◦ Three foot prints/FEMALE MONKEY
◦ Hand or Fist/FEMALE BUFFALO/FALCON
◦ Chariot/SERPENT/WHITE OWL
◦ Shoot of a plant/MALE BUFFALO
◦ Tears/FEMALE DOG
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL
◦ Winnowing basket/MALE MONKEY
◦ Swinging Hammock/FEMALE RAT/FEMALE EAGLE
◦ Inverted triangle/ELEPHANT/CROW`
  },
  'Magha': {
    mobileDisplayPicture: `◦ COILED SERPENT/FEMALE CAT/OWL
◦ Circular amulet/umbrella/ear rings/MALE DEER`,
    beneficialSymbols: `◦ COILED SERPENT/FEMALE CAT/OWL
◦ Circular amulet/umbrella/ear rings/MALE DEER`,
    prosperitySymbols: `◦ Inverted triangle/ELEPHANT/CROW
◦ Swinging hammock/FEMALE RAT/FEMALE EAGLE`,
    mentalPhysicalWellbeing: `◦ Three foot print/FEMALE MONKEY`,
    accomplishments: `◦ Shoot of a plant/MALE BUFFALO
◦ Tears/FEMALE DOG
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL`,
    avoidSymbols: `◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER
◦ POTTER'S WHEEL/MALE TIGER
◦ SWORD/MALE LION/PIGEON
◦ BOW AND ARROW/FEMALE CAT/SWAN
◦ Deer's head/FEMALE SERPENT/HEN
◦ A drum/flute/FEMALE LION/PEACOCK
◦ Sharp knife/GOAT/PEACOCK
◦ Elephants tusks/MALE MANGOOSE/STORK`
  },
  'Purva Phalguni': {
    mobileDisplayPicture: `◦ ROYAL THRONE/PALANQUIN/MOUSE/EAGLE
◦ RETICULATED ROOT/MALE DOG/RED VULTURE`,
    beneficialSymbols: `◦ ROYAL THRONE/PALANQUIN/MOUSE/EAGLE
◦ RETICULATED ROOT/MALE DOG/RED VULTURE`,
    prosperitySymbols: `◦ SHARP KNIFE/GOAT/PEACOCK`,
    mentalPhysicalWellbeing: `◦ A drum/flute/FEMALE LION/PEACOCK`,
    accomplishments: `◦ Potter's wheel/MALE TIGER
◦ SWORD/MALE LION/PIGION
◦ BOW AND ARROW/FEMALE CAT/SWAN`,
    avoidSymbols: `◦ LOTUS/FEMALE DEER/NIGHTINGALE
◦ Three foot prints/FEMALE MONKEY
◦ Hand or Fist/FEMALE BUFFALO/FALCON
◦ Chariot/SERPENT/WHITE OWL
◦ Shoot of a plant/MALE BUFFALO
◦ Tears/FEMALE DOG
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL
◦ UDDER OF A COW/GOAT/SEA CROW
◦ SERPENT IN WATER/FEMALE COW`
  },
  'Uttara Phalguni': {
    mobileDisplayPicture: `◦ Swinging Hammock/FEMALE RAT/FEMALE EAGLE
◦ Winnowing basket/MALE MONKEY`,
    beneficialSymbols: `◦ Swinging Hammock/FEMALE RAT/FEMALE EAGLE
◦ Winnowing basket/MALE MONKEY`,
    prosperitySymbols: `◦ Hand or Fist/FEMALE BUFFALO/FALCON
◦ Chariot/SERPENT/WHITE OWL`,
    mentalPhysicalWellbeing: `◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL`,
    accomplishments: `◦ Udder of a cow/GOAT/SEA CROW
◦ SERPENT IN WATER/FEMALE COW
◦ Lotus/FEMALE DEER/NIGHTINGALE`,
    avoidSymbols: `◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER
◦ COILED SERPENT/FEMALE CAT/OWL
◦ Potter's wheel/MALE TIGER
◦ Drum/pair of fish/FEMALE ELEPHANT
◦ Circular amulet/umbrella/ear rings/MALE DEER
◦ SWORD/MALE LION/PIGION
◦ BOW AND ARROW/FEMALE CAT/SWAN
◦ Deer's head/FEMALE SERPENT/HEN
◦ A drum/flute/FEMALE LION/PEACOCK`
  },
  'Hasta': {
    mobileDisplayPicture: `◦ Elephants tusks/MALE MANGOOSE/STORK
◦ MALE COW(NANDI)/PEACOCK`,
    beneficialSymbols: `◦ Elephants tusks/MALE MANGOOSE/STORK
◦ MALE COW(NANDI)/PEACOCK`,
    prosperitySymbols: `◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER
◦ DEER'S HEAD/FEMALE SERPENT/HEN`,
    mentalPhysicalWellbeing: `◦ SWORD/MALE LION/PIGEON`,
    accomplishments: `◦ COILED SERPENT/FEMALE CAT/OWL
◦ Drum/pair of fish/FEMALE ELEPHANT
◦ Circular amulet/umbrella/ear rings/MALE DEER`,
    avoidSymbols: `◦ SERPENT IN WATER/FEMALE COW
◦ Lotus/FEMALE DEER/NIGHTINGALE
◦ Shoot of a plant
◦ Tears/FEMALE DOG
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL
◦ Horse head/HORSE/EAGLE
◦ RETICULATED ROOT/MALE DOG/RED VULTURE
◦ ROYAL THRONE/PALANQUIN/MOUSE/EAGLE
◦ UDDER OF A COW/GOAT/SEA CROW`
  },
  'Chitra': {
    mobileDisplayPicture: `◦ Three foot prints/FEMALE MONKEY
◦ Hand or Fist/FEMALE BUFFALO/FALCON`,
    beneficialSymbols: `◦ Three foot prints/FEMALE MONKEY
◦ Hand or Fist/FEMALE BUFFALO/FALCON`,
    prosperitySymbols: `◦ Shoot of a plant/MALE BUFFALO
◦ Tears/FEMALE DOG`,
    mentalPhysicalWellbeing: `◦ SERPENT IN WATER/FEMALE COW`,
    accomplishments: `◦ ROYAL THRONE/PALANQUIN
◦ RETICULATED ROOT/MALE DOG/RED VULTURE
◦ Horse head/HORSE/EAGLE`,
    avoidSymbols: `◦ COILED SERPENT/FEMALE CAT/OWL
◦ Drum/Pair of fish/FEMALE ELEPHANT
◦ Circular amulet/umbrella/ear rings/MALE DEER
◦ Potter's wheel/MALE TIGER
◦ SWORD/MALE LION/PIGION
◦ BOW AND ARROW/FEMALE CAT/SWAN
◦ Winnowing basket/MALE MONKEY
◦ Swinging Hammock/FEMALE RAT/FEMALE EAGLE
◦ Inverted triangle/ELEPHANT/CROW`
  },
  'Swati': {
    mobileDisplayPicture: `◦ A drum/flute/FEMALE LION/PEACOCK
◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER`,
    beneficialSymbols: `◦ A drum/flute/FEMALE LION/PEACOCK
◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER`,
    prosperitySymbols: `◦ BOW AND ARROW/FEMALE CAT/SWAN
◦ POTTER'S WHEEL/MALE TIGER`,
    mentalPhysicalWellbeing: `◦ Drum/pair of fish/FEMALE ELEPHANT`,
    accomplishments: `◦ Winnowing basket/MALE MONKEY
◦ Swinging Hammock/FEMALE RAT/FEMALE EAGLE
◦ Inverted triangle/ELEPHANT/CROW`,
    avoidSymbols: `◦ Lotus/FEMALE DEER/NIGHTINGALE
◦ Sharp knife/GOAT/PEACOCK
◦ Elephants tusks/MALE MANGOOSE/STORK
◦ Horse head/HORSE/EAGLE
◦ ROYAL THRONE/PALANQUIN
◦ RETICULATED ROOT
◦ UDDER OF A COW/GOAT/SEA CROW
◦ SERPENT IN WATER/FEMALE COW`
  },
  'Vishakha': {
    mobileDisplayPicture: `◦ Shoot of a plant/MALE BUFFALO
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL`,
    beneficialSymbols: `◦ Shoot of a plant/MALE BUFFALO
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL`,
    prosperitySymbols: `◦ LOTUS/FEMALE DEER/NIGHTINGALE
◦ UDDER OF A COW/GOAT/SEA CROW`,
    mentalPhysicalWellbeing: `◦ Horse head/HORSE/EAGLE`,
    accomplishments: `◦ Sharp knife/GOAT/PEACOCK
◦ Elephants tusks/MALE MANGOOSE/STORK`,
    avoidSymbols: `◦ Three foot prints/FEMALE MONKEY
◦ Hand or Fist/FEMALE BUFFALO/FALCON
◦ Chariot/SERPENT/WHITE OWL
◦ COILED SERPENT/FEMALE CAT/OWL
◦ Drum/pair of fish/FEMALE ELEPHANT
◦ Circular amulet/umbrella/ear rings/MALE DEER
◦ Winnowing basket/MALE MONKEY
◦ Swinging Hammock/FEMALE RAT/FEMALE EAGLE
◦ Inverted triangle/ELEPHANT/CROW`
  },
  'Anuradha': {
    mobileDisplayPicture: `◦ Potter's wheel/MALE TIGER
◦ SWORD/MALE LION/PIGION`,
    beneficialSymbols: `◦ Potter's wheel/MALE TIGER
◦ SWORD/MALE LION/PIGION`,
    prosperitySymbols: `◦ Circular amulet/umbrella/ear rings/MALE DEER
◦ COILED SERPENT/FEMALE CAT/OWL`,
    mentalPhysicalWellbeing: `◦ Inverted triangle/ELEPHANT/CROW`,
    accomplishments: `◦ Three foot prints/FEMALE MONKEY
◦ Hand or Fist/FEMALE BUFFALO/FALCON
◦ Chariot/SERPENT/WHITE OWL`,
    avoidSymbols: `◦ Deer's head/FEMALE SERPENT/HEN
◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER
◦ A drum/flute/FEMALE LION/PEACOCK
◦ Sharp knife/GOAT/PEACOCK
◦ Elephants tusks/MALE MANGOOSE/STORK
◦ RETICULATED ROOT/MALE DOG/RED VULTURE
◦ Horse head/HORSE/EAGLE
◦ ROYAL THRONE/PALANQUIN/MOUSE/EAGLE`
  },
  'Jyeshtha': {
    mobileDisplayPicture: `◦ SERPENT IN WATER/FEMALE COW
◦ LOTUS/FEMALE DEER/NIGHTINGALE`,
    beneficialSymbols: `◦ SERPENT IN WATER/FEMALE COW
◦ LOTUS/FEMALE DEER/NIGHTINGALE`,
    prosperitySymbols: `◦ ROYAL THRONE/PALANQUIN/MOUSE/EAGLE
◦ RETICULATED ROOT/MALE DOG/RED VULTURE`,
    mentalPhysicalWellbeing: `◦ SHARP KNIFE/GOAT/PEACOCK`,
    accomplishments: `◦ Deer's head/FEMALE SERPENT/HEN
◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER
◦ A drum/flute/FEMALE LION/PEACOCK`,
    avoidSymbols: `◦ Three foot prints/FEMALE MONKEY
◦ Hand or Fist/FEMALE BUFFALO/FALCON
◦ Chariot/SERPENT/WHITE OWL
◦ Shoot of a plant/MALE BUFFALO
◦ Tears/FEMALE DOG
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL
◦ Winnowing basket/MALE MONKEY
◦ Swinging Hammock/FEMALE RAT/FEMALE EAGLE
◦ Inverted triangle/ELEPHANT/CROW`
  },
  'Mula': {
    mobileDisplayPicture: `◦ Pair of fish/FEMALE ELEPHANT
◦ Circular amulet/umbrella/ear rings/MALE DEER`,
    beneficialSymbols: `◦ Pair of fish/FEMALE ELEPHANT
◦ Circular amulet/umbrella/ear rings/MALE DEER`,
    prosperitySymbols: `◦ Swinging hammock/FEMALE RAT/FEMALE EAGLE
◦ Winnowing basket/MALE MONKEY`,
    mentalPhysicalWellbeing: `◦ Chariot/SERPENT/WHITE OWL`,
    accomplishments: `◦ Shoot of a plant/MALE BUFFALO
◦ Tears/FEMALE DOG
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL`,
    avoidSymbols: `◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER
◦ POTTER'S WHEEL/MALE TIGER
◦ SWORD/MALE LION/PIGEON
◦ BOW AND ARROW/FEMALE CAT/SWAN
◦ Deer's head/FEMALE SERPENT/HEN
◦ A drum/flute/FEMALE LION/PEACOCK
◦ Sharp knife/GOAT/PEACOCK
◦ Elephants tusks/MALE MANGOOSE/STORK`
  },
  'Purva Ashadha': {
    mobileDisplayPicture: `◦ RETICULATED ROOT/MALE DOG/RED VULTURE
◦ Horse head/HORSE/EAGLE`,
    beneficialSymbols: `◦ RETICULATED ROOT/MALE DOG/RED VULTURE
◦ Horse head/HORSE/EAGLE`,
    prosperitySymbols: `◦ ELEPHANT TUSK/MALE MANGOOSE/STORK`,
    mentalPhysicalWellbeing: `◦ DEER'S HEAD/FEMALE SERPENT/HEN`,
    accomplishments: `◦ Potter's wheel/MALE TIGER
◦ SWORD/MALE LION/PIGION
◦ BOW AND ARROW/FEMALE CAT/SWAN`,
    avoidSymbols: `◦ LOTUS/FEMALE DEER/NIGHTINGALE
◦ Three foot prints/FEMALE MONKEY
◦ Hand or Fist/FEMALE BUFFALO/FALCON
◦ Chariot/SERPENT/WHITE OWL
◦ Shoot of a plant/MALE BUFFALO
◦ Tears/FEMALE DOG
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL
◦ UDDER OF A COW/GOAT/SEA CROW
◦ SERPENT IN WATER/FEMALE COW`
  },
  'Uttara Ashadha': {
    mobileDisplayPicture: `◦ Winnowing basket/MALE MONKEY
◦ Inverted triangle/ELEPHANT/CROW`,
    beneficialSymbols: `◦ Winnowing basket/MALE MONKEY
◦ Inverted triangle/ELEPHANT/CROW`,
    prosperitySymbols: `◦ Three foot prints/FEMALE MONKEY
◦ Hand or Fist/FEMALE BUFFALO/FALCON`,
    mentalPhysicalWellbeing: `◦ TEAR/FEMALE DOG`,
    accomplishments: `◦ Udder of a cow/GOAT/SEA CROW
◦ SERPENT IN WATER/FEMALE COW
◦ Lotus/FEMALE DEER/NIGHTINGALE`,
    avoidSymbols: `◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER
◦ COILED SERPENT/FEMALE CAT/OWL
◦ Potter's wheel/MALE TIGER
◦ Drum/pair of fish/FEMALE ELEPHANT
◦ Circular amulet/umbrella/ear rings/MALE DEER
◦ SWORD/MALE LION/PIGION
◦ BOW AND ARROW/FEMALE CAT/SWAN
◦ Deer's head/FEMALE SERPENT/HEN
◦ A drum/flute/FEMALE LION/PEACOCK`
  },
  'Shravana': {
    mobileDisplayPicture: `◦ Sharp knife/GOAT/PEACOCK
◦ Elephants tusks/MALE MANGOOSE/STORK`,
    beneficialSymbols: `◦ Sharp knife/GOAT/PEACOCK
◦ Elephants tusks/MALE MANGOOSE/STORK`,
    prosperitySymbols: `◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER
◦ Drum/flute/FEMALE LION/PEACOCK`,
    mentalPhysicalWellbeing: `◦ BOW AND ARROW/FEMALE CAT/SWAN`,
    accomplishments: `◦ COILED SERPENT/FEMALE CAT/OWL
◦ Drum/pair of fish/FEMALE ELEPHANT
◦ Circular amulet/umbrella/ear rings/MALE DEER`,
    avoidSymbols: `◦ SERPENT IN WATER/FEMALE COW
◦ Lotus/FEMALE DEER/NIGHTINGALE
◦ Shoot of a plant
◦ Tears/FEMALE DOG
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL
◦ Horse head/HORSE/EAGLE
◦ RETICULATED ROOT/MALE DOG/RED VULTURE
◦ ROYAL THRONE/PALANQUIN/MOUSE/EAGLE
◦ UDDER OF A COW/GOAT/SEA CROW`
  },
  'Dhanishta': {
    mobileDisplayPicture: `◦ Three foot prints/FEMALE MONKEY
◦ Chariot/SERPENT/WHITE OWL`,
    beneficialSymbols: `◦ Three foot prints/FEMALE MONKEY
◦ Chariot/SERPENT/WHITE OWL`,
    prosperitySymbols: `◦ Shoot of a plant/MALE BUFFALO
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL`,
    mentalPhysicalWellbeing: `◦ UDDER OF A COW/GOAT/SEA CROW`,
    accomplishments: `◦ RETICULATED ROOT/MALE DOG/RED VULTURE
◦ Horse head/HORSE/EAGLE
◦ ROYAL THRONE/PALANQUIN/MOUSE/EAGLE`,
    avoidSymbols: `◦ COILED SERPENT/FEMALE CAT/OWL
◦ Potter's wheel/MALE TIGER
◦ Drum/pair of fish/FEMALE ELEPHANT
◦ Winnowing basket/MALE MONKEY
◦ Swinging Hammock/FEMALE RAT/FEMALE EAGLE
◦ Inverted triangle/ELEPHANT/CROW
◦ Circular amulet/umbrella/ear rings/MALE DEER
◦ SWORD/MALE LION/PIGION
◦ BOW AND ARROW/FEMALE CAT/SWAN`
  },
  'Shatabhisha': {
    mobileDisplayPicture: `◦ Deer's head/FEMALE SERPENT/HEN
◦ A drum/flute/FEMALE LION/PEACOCK`,
    beneficialSymbols: `◦ Deer's head/FEMALE SERPENT/HEN
◦ A drum/flute/FEMALE LION/PEACOCK`,
    prosperitySymbols: `◦ POTTER'S WHEEL/MALE TIGER
◦ SWORD/MALE LION/PIGEON`,
    mentalPhysicalWellbeing: `◦ COILED SERPENT/FEMALE CAT/OWL`,
    accomplishments: `◦ Winnowing basket/MALE MONKEY
◦ Swinging Hammock/FEMALE RAT/FEMALE EAGLE
◦ Inverted triangle/ELEPHANT/CROW`,
    avoidSymbols: `◦ RETICULATED ROOT/MALE DOG/RED VULTURE
◦ Horse head/HORSE/EAGLE
◦ Sharp knife/GOAT/PEACOCK
◦ Elephants tusks/MALE MANGOOSE/STORK
◦ UDDER OF A COW/GOAT/SEA CROW
◦ SERPENT IN WATER/FEMALE COW
◦ Lotus/FEMALE DEER/NIGHTINGALE
◦ ROYAL THRONE/PALANQUIN/MOUSE/EAGLE`
  },
  'Purva Bhadrapada': {
    mobileDisplayPicture: `◦ Tears/FEMALE DOG
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL`,
    beneficialSymbols: `◦ Tears/FEMALE DOG
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL`,
    prosperitySymbols: `◦ SERPENT IN WATER/FEMALE COW
◦ Lotus/FEMALE DEER/NIGHTINGALE`,
    mentalPhysicalWellbeing: `◦ ROYAL THRONE/PALANQUIN/MOUSE/EAGLE`,
    accomplishments: `◦ Sharp knife/GOAT/PEACOCK
◦ Elephants tusks/MALE MANGOOSE/STORK`,
    avoidSymbols: `◦ Drum/pair of fish/FEMALE ELEPHANT
◦ Three foot prints/FEMALE MONKEY
◦ Hand or Fist/FEMALE BUFFALO/FALCON
◦ Chariot/SERPENT/WHITE OWL
◦ Winnowing basket/MALE MONKEY
◦ Swinging Hammock/FEMALE RAT/FEMALE EAGLE
◦ Inverted triangle/ELEPHANT/CROW
◦ Circular amulet/umbrella/ear rings/MALE DEER`
  },
  'Uttara Bhadrapada': {
    mobileDisplayPicture: `◦ SWORD/MALE LION/PIGION
◦ BOW AND ARROW/FEMALE CAT/SWAN`,
    beneficialSymbols: `◦ SWORD/MALE LION/PIGION
◦ BOW AND ARROW/FEMALE CAT/SWAN`,
    prosperitySymbols: `◦ Pair of fish/FEMALE ELEPHANT
◦ Circular amulet/umbrella/ear rings/MALE DEER`,
    mentalPhysicalWellbeing: `◦ SWINGING HAMMOCK/FEMALE RAT/FEMALE EAGLE`,
    accomplishments: `◦ Three foot prints/FEMALE MONKEY
◦ Hand or Fist/FEMALE BUFFALO/FALCON
◦ Chariot/SERPENT/WHITE OWL`,
    avoidSymbols: `◦ Sharp knife/GOAT/PEACOCK
◦ Elephants tusks/MALE MANGOOSE/STORK
◦ Horse head/HORSE/EAGLE
◦ ROYAL THRONE/PALANQUIN
◦ RETICULATED ROOT
◦ Deer's head/FEMALE SERPENT/HEN
◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER
◦ A drum/flute/FEMALE LION/PEACOCK`
  },
  'Revati': {
    mobileDisplayPicture: `◦ UDDER OF A COW/GOAT/SEA CROW
◦ SERPENT IN WATER/FEMALE COW`,
    beneficialSymbols: `◦ UDDER OF A COW/GOAT/SEA CROW
◦ SERPENT IN WATER/FEMALE COW`,
    prosperitySymbols: `◦ RETICULATED ROOT/MALE DOG/RED VULTURE
◦ Horse head/HORSE/EAGLE`,
    mentalPhysicalWellbeing: `◦ Male cow(Nandi)/Peacock`,
    accomplishments: `◦ Deer's head/FEMALE SERPENT/HEN
◦ Bright jewel/pearl/FEMALE TIGER/WOODPECKER
◦ A drum/flute/FEMALE LION/PEACOCK`,
    avoidSymbols: `◦ Shoot of a plant/MALE BUFFALO
◦ Tears/FEMALE DOG
◦ Empty circles of ring/FEMALE HORSE/ASIAN KOEL
◦ Three foot prints/FEMALE MONKEY
◦ Hand or Fist/FEMALE BUFFALO/FALCON
◦ Chariot/SERPENT/WHITE OWL
◦ Winnowing basket/MALE MONKEY
◦ Swinging Hammock/FEMALE RAT/FEMALE EAGLE
◦ Inverted triangle/ELEPHANT/CROW`
  }
};

function ReportForm({ darkTheme }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [planetSources, setPlanetSources] = useState({}); // Store planet -> source mapping
  const [aspectsOnHouses, setAspectsOnHouses] = useState([{ planet: '', aspects: [{ houses: [''], degree: '' }] }]);
  const [aspectsOnPlanets, setAspectsOnPlanets] = useState([{ planet: '', aspects: [{ planets: [''], degree: '' }] }]);
  const [showAspectsModal, setShowAspectsModal] = useState(false);
  const [removalItems, setRemovalItems] = useState([{ planet: '', directions: [''] }]);
  const [placementItems, setPlacementItems] = useState([{ planet: '', direction: '' }]);
  const [colorObjectSuggestions, setColorObjectSuggestions] = useState('');
  const [saturnRelationPlanets, setSaturnRelationPlanets] = useState([{ planet: '', hasBTag: false }]);
  const [venusRelationPlanets, setVenusRelationPlanets] = useState([{ planet: '', hasBTag: false }]);
  const [kundliPdf, setKundliPdf] = useState(null);
  const [showKundliViewer, setShowKundliViewer] = useState(false);
  const [kundliZoom, setKundliZoom] = useState(1);
  // Responsive initial dimensions for Kundli viewer
  const getInitialKundliSize = () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      return {
        width: Math.min(window.innerWidth - 20, 400),
        height: Math.min(window.innerHeight - 100, 500)
      };
    }
    return { width: 600, height: 700 };
  };

  const getInitialKundliPosition = () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      return {
        x: 10,
        y: 50
      };
    }
    return { x: 100, y: 100 };
  };

  const [kundliPosition, setKundliPosition] = useState(getInitialKundliPosition());
  const [kundliSize, setKundliSize] = useState(getInitialKundliSize());
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // No Star checkbox states for dasha sections
  const [mahadashaNoStar, setMahadashaNoStar] = useState(false);
  const [antardashaNoStar, setAntardashaNoStar] = useState(false);
  const [pratyantardashaNoStar, setPratyantardashaNoStar] = useState(false);

  // House Map state - array to support multiple maps with analysis
  const [houseMaps, setHouseMaps] = useState([]);

  // Modal state for viewing maps
  const [viewingMap, setViewingMap] = useState(null);
  const [mapZoom, setMapZoom] = useState(1);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();

  // Update Saturn Relation formatted string whenever planets change
  useEffect(() => {
    const formattedString = 'SA-' + saturnRelationPlanets
      .filter(item => {
        const planet = typeof item === 'string' ? item : item.planet;
        return planet !== '';
      })
      .map(item => {
        if (typeof item === 'string') {
          return item;
        }
        return item.hasBTag ? `${item.planet}(b)` : item.planet;
      })
      .join('-');

    setValue('saturnRelation', formattedString === 'SA-' ? '' : formattedString);
  }, [saturnRelationPlanets, setValue]);

  // Update Venus Relation formatted string whenever planets change
  useEffect(() => {
    const formattedString = 'VE-' + venusRelationPlanets
      .filter(item => {
        const planet = typeof item === 'string' ? item : item.planet;
        return planet !== '';
      })
      .map(item => {
        if (typeof item === 'string') {
          return item;
        }
        return item.hasBTag ? `${item.planet}(b)` : item.planet;
      })
      .join('-');

    setValue('venusRelation', formattedString === 'VE-' ? '' : formattedString);
  }, [venusRelationPlanets, setValue]);

  // Watch all dasha source fields for auto-suggestion
  const mahadashaSource = watch('mahadasha_source');
  const mahadashaNLSource = watch('mahadasha_nl_source');
  const mahadashaSLSource = watch('mahadasha_sl_source');
  const antardashaSource = watch('antardasha_source');
  const antardashaNLSource = watch('antardasha_nl_source');
  const antardashaSLSource = watch('antardasha_sl_source');
  const pratyantardashaSource = watch('pratyantardasha_source');
  const pratyantardashaNLSource = watch('pratyantardasha_nl_source');
  const pratyantardashaSLSource = watch('pratyantardasha_sl_source');

  // Watch all planet selections
  const mahadashaPlanet = watch('mahadasha_planet');
  const mahadashaNL = watch('mahadasha_nl');
  const mahadashaSL = watch('mahadasha_sl');
  const antardashaPlanet = watch('antardasha_planet');
  const antardashaNL = watch('antardasha_nl');
  const antardashaSL = watch('antardasha_sl');
  const pratyantardashaPlanet = watch('pratyantardasha_planet');
  const pratyantardashaNL = watch('pratyantardasha_nl');
  const pratyantardashaSL = watch('pratyantardasha_sl');

  // Auto-suggest donations based on sources containing 8
  React.useEffect(() => {
    const suggestedPlanets = [];

    // Check all source fields for number 8
    if (mahadashaSource && mahadashaSource.includes('8') && mahadashaPlanet) {
      suggestedPlanets.push(mahadashaPlanet);
    }
    if (mahadashaNLSource && mahadashaNLSource.includes('8') && mahadashaNL) {
      suggestedPlanets.push(mahadashaNL);
    }
    if (mahadashaSLSource && mahadashaSLSource.includes('8') && mahadashaSL) {
      suggestedPlanets.push(mahadashaSL);
    }
    if (antardashaSource && antardashaSource.includes('8') && antardashaPlanet) {
      suggestedPlanets.push(antardashaPlanet);
    }
    if (antardashaNLSource && antardashaNLSource.includes('8') && antardashaNL) {
      suggestedPlanets.push(antardashaNL);
    }
    if (antardashaSLSource && antardashaSLSource.includes('8') && antardashaSL) {
      suggestedPlanets.push(antardashaSL);
    }
    if (pratyantardashaSource && pratyantardashaSource.includes('8') && pratyantardashaPlanet) {
      suggestedPlanets.push(pratyantardashaPlanet);
    }
    if (pratyantardashaNLSource && pratyantardashaNLSource.includes('8') && pratyantardashaNL) {
      suggestedPlanets.push(pratyantardashaNL);
    }
    if (pratyantardashaSLSource && pratyantardashaSLSource.includes('8') && pratyantardashaSL) {
      suggestedPlanets.push(pratyantardashaSL);
    }

    // Remove duplicates
    const uniquePlanets = [...new Set(suggestedPlanets)];

    if (uniquePlanets.length > 0) {
      // Format donations to do with day and items
      const donationsList = uniquePlanets.map(planet => {
        const info = planetDonationInfo[planet];
        if (info) {
          return `${planet} (${info.day}): ${info.items}`;
        }
        return planet;
      }).join('\n\n');

      // Format beneficiaries
      const beneficiariesList = uniquePlanets.map(planet => {
        const info = planetDonationInfo[planet];
        if (info) {
          return `${planet}: ${info.beneficiaries}`;
        }
        return planet;
      }).join('\n');

      setValue('donationsToDo', donationsList);
      setValue('donationsToWhom', beneficiariesList);
    }
  }, [mahadashaSource, mahadashaNLSource, mahadashaSLSource,
      antardashaSource, antardashaNLSource, antardashaSLSource,
      pratyantardashaSource, pratyantardashaNLSource, pratyantardashaSLSource,
      mahadashaPlanet, mahadashaNL, mahadashaSL,
      antardashaPlanet, antardashaNL, antardashaSL,
      pratyantardashaPlanet, pratyantardashaNL, pratyantardashaSL,
      setValue]);

  // Watch gemstone planet selection
  const gemstonePlanet = watch('gemstone_planet');

  // Auto-suggest gemstone based on selected planet
  React.useEffect(() => {
    if (gemstonePlanet) {
      const info = planetGemstoneInfo[gemstonePlanet];
      if (info) {
        const gemstoneText = `${gemstonePlanet} - ${info.english} (${info.hindi})`;
        setValue('gemstones', gemstoneText);
      }
    } else {
      setValue('gemstones', '');
    }
  }, [gemstonePlanet, setValue]);

  // Watch mantra planet selection
  const mantraPlanet = watch('mantra_planet');

  // Auto-suggest mantra based on selected planet
  React.useEffect(() => {
    if (mantraPlanet) {
      const info = planetMantraInfo[mantraPlanet];
      if (info) {
        const mantraText = `${mantraPlanet} - ${info.deity}: ${info.mantra}`;
        setValue('mantra', mantraText);
      }
    } else {
      setValue('mantra', '');
    }
  }, [mantraPlanet, setValue]);

  // Watch nakshatra selection
  const birthNakshatra = watch('birthNakshatra');

  // Auto-fill nakshatra fields based on selected nakshatra
  React.useEffect(() => {
    if (birthNakshatra && nakshatraInfo[birthNakshatra]) {
      const info = nakshatraInfo[birthNakshatra];
      setValue('mobileDisplayPicture', info.mobileDisplayPicture);
      setValue('beneficialSymbols', info.beneficialSymbols);
      setValue('nakshatraProsperitySymbols', info.prosperitySymbols);
      setValue('nakshatraMentalPhysicalWellbeing', info.mentalPhysicalWellbeing);
      setValue('nakshatraAccomplishments', info.accomplishments);
      setValue('nakshatraAvoidSymbols', info.avoidSymbols);
    }
  }, [birthNakshatra, setValue]);

  // Save planet-source mappings when sources are typed
  React.useEffect(() => {
    const newMappings = {};

    // Mahadasha
    if (mahadashaPlanet && mahadashaSource) {
      newMappings[mahadashaPlanet] = mahadashaSource;
    }
    if (mahadashaNL && mahadashaNLSource) {
      newMappings[mahadashaNL] = mahadashaNLSource;
    }
    if (mahadashaSL && mahadashaSLSource) {
      newMappings[mahadashaSL] = mahadashaSLSource;
    }

    // Antardasha
    if (antardashaPlanet && antardashaSource) {
      newMappings[antardashaPlanet] = antardashaSource;
    }
    if (antardashaNL && antardashaNLSource) {
      newMappings[antardashaNL] = antardashaNLSource;
    }
    if (antardashaSL && antardashaSLSource) {
      newMappings[antardashaSL] = antardashaSLSource;
    }

    // Pratyantardasha
    if (pratyantardashaPlanet && pratyantardashaSource) {
      newMappings[pratyantardashaPlanet] = pratyantardashaSource;
    }
    if (pratyantardashaNL && pratyantardashaNLSource) {
      newMappings[pratyantardashaNL] = pratyantardashaNLSource;
    }
    if (pratyantardashaSL && pratyantardashaSLSource) {
      newMappings[pratyantardashaSL] = pratyantardashaSLSource;
    }

    // Update state with new mappings
    if (Object.keys(newMappings).length > 0) {
      setPlanetSources(prev => ({ ...prev, ...newMappings }));
    }
  }, [
    mahadashaPlanet, mahadashaSource, mahadashaNL, mahadashaNLSource, mahadashaSL, mahadashaSLSource,
    antardashaPlanet, antardashaSource, antardashaNL, antardashaNLSource, antardashaSL, antardashaSLSource,
    pratyantardashaPlanet, pratyantardashaSource, pratyantardashaNL, pratyantardashaNLSource, pratyantardashaSL, pratyantardashaSLSource
  ]);

  // Auto-fill sources when planets are selected (Mahadasha)
  React.useEffect(() => {
    if (mahadashaPlanet && planetSources[mahadashaPlanet] && !mahadashaSource) {
      setValue('mahadasha_source', planetSources[mahadashaPlanet]);
    }
  }, [mahadashaPlanet, planetSources, mahadashaSource, setValue]);

  React.useEffect(() => {
    if (mahadashaNL && planetSources[mahadashaNL] && !mahadashaNLSource) {
      setValue('mahadasha_nl_source', planetSources[mahadashaNL]);
    }
  }, [mahadashaNL, planetSources, mahadashaNLSource, setValue]);

  React.useEffect(() => {
    if (mahadashaSL && planetSources[mahadashaSL] && !mahadashaSLSource) {
      setValue('mahadasha_sl_source', planetSources[mahadashaSL]);
    }
  }, [mahadashaSL, planetSources, mahadashaSLSource, setValue]);

  // Auto-fill sources when planets are selected (Antardasha)
  React.useEffect(() => {
    if (antardashaPlanet && planetSources[antardashaPlanet] && !antardashaSource) {
      setValue('antardasha_source', planetSources[antardashaPlanet]);
    }
  }, [antardashaPlanet, planetSources, antardashaSource, setValue]);

  React.useEffect(() => {
    if (antardashaNL && planetSources[antardashaNL] && !antardashaNLSource) {
      setValue('antardasha_nl_source', planetSources[antardashaNL]);
    }
  }, [antardashaNL, planetSources, antardashaNLSource, setValue]);

  React.useEffect(() => {
    if (antardashaSL && planetSources[antardashaSL] && !antardashaSLSource) {
      setValue('antardasha_sl_source', planetSources[antardashaSL]);
    }
  }, [antardashaSL, planetSources, antardashaSLSource, setValue]);

  // Auto-fill sources when planets are selected (Pratyantardasha)
  React.useEffect(() => {
    if (pratyantardashaPlanet && planetSources[pratyantardashaPlanet] && !pratyantardashaSource) {
      setValue('pratyantardasha_source', planetSources[pratyantardashaPlanet]);
    }
  }, [pratyantardashaPlanet, planetSources, pratyantardashaSource, setValue]);

  React.useEffect(() => {
    if (pratyantardashaNL && planetSources[pratyantardashaNL] && !pratyantardashaNLSource) {
      setValue('pratyantardasha_nl_source', planetSources[pratyantardashaNL]);
    }
  }, [pratyantardashaNL, planetSources, pratyantardashaNLSource, setValue]);

  React.useEffect(() => {
    if (pratyantardashaSL && planetSources[pratyantardashaSL] && !pratyantardashaSLSource) {
      setValue('pratyantardasha_sl_source', planetSources[pratyantardashaSL]);
    }
  }, [pratyantardashaSL, planetSources, pratyantardashaSLSource, setValue]);

  // Auto-populate removal and placement items based on aspects
  useEffect(() => {
    const planetDegreeMap = new Map(); // Map to store planet with their non-120° degrees
    const planetAllDegrees = new Map(); // Map to store all degrees for determining duplicates
    const planetHousesCount = new Map(); // Track how many houses each planet hits
    const planetInBothAspects = new Map(); // Track if planet is in both houses and planets aspects

    // Collect planets with their degrees from aspects on houses
    aspectsOnHouses.forEach(aspect => {
      if (aspect.planet) {
        const degrees = aspect.aspects
          .filter(a => a.degree)
          .map(a => a.degree);

        // Count total houses hit
        let totalHouses = 0;
        aspect.aspects.forEach(a => {
          const validHouses = a.houses.filter(h => h);
          totalHouses += validHouses.length;
        });

        if (totalHouses > 0) {
          planetHousesCount.set(aspect.planet, totalHouses);
        }

        if (degrees.length > 0) {
          if (!planetDegreeMap.has(aspect.planet)) {
            planetDegreeMap.set(aspect.planet, new Set());
          }
          if (!planetAllDegrees.has(aspect.planet)) {
            planetAllDegrees.set(aspect.planet, new Set());
          }
          degrees.forEach(deg => {
            planetAllDegrees.get(aspect.planet).add(deg);
            // Only add to removal map if not 120°
            if (deg !== '120°') {
              planetDegreeMap.get(aspect.planet).add(deg);
            }
          });
        }
      }
    });

    // Collect planets with their degrees from aspects on planets
    aspectsOnPlanets.forEach(aspect => {
      if (aspect.planet) {
        const degrees = aspect.aspects
          .filter(a => a.degree)
          .map(a => a.degree);

        // Check if this planet also appears in aspectsOnHouses
        if (planetHousesCount.has(aspect.planet)) {
          planetInBothAspects.set(aspect.planet, true);
        }

        if (degrees.length > 0) {
          if (!planetDegreeMap.has(aspect.planet)) {
            planetDegreeMap.set(aspect.planet, new Set());
          }
          if (!planetAllDegrees.has(aspect.planet)) {
            planetAllDegrees.set(aspect.planet, new Set());
          }
          degrees.forEach(deg => {
            planetAllDegrees.get(aspect.planet).add(deg);
            // Only add to removal map if not 120°
            if (deg !== '120°') {
              planetDegreeMap.get(aspect.planet).add(deg);
            }
          });
        }
      }
    });

    // Create removal items - one entry per planet with array of directions
    const newRemovalItems = [];
    planetDegreeMap.forEach((degrees, planet) => {
      let directionCount = degrees.size;

      // Special case: If planet hits multiple houses AND another planet, create 3 boxes
      if (planetInBothAspects.has(planet) && planetHousesCount.get(planet) > 1) {
        directionCount = 3;
      }
      // Special case: If planet only in aspectsOnPlanets and hits planets at different degrees, show only 1 box
      else if (!planetHousesCount.has(planet) && degrees.size >= 2) {
        directionCount = 1;
      }

      if (directionCount > 0) {
        const existing = removalItems.find(item => item.planet === planet);

        // Create array of directions
        const directions = [];
        for (let i = 0; i < directionCount; i++) {
          directions.push(existing && existing.directions[i] ? existing.directions[i] : '');
        }

        newRemovalItems.push({
          planet: planet,
          directions: directions
        });
      }
    });

    // Create placement items for each unique planet (one per planet)
    // Include all planets regardless of degrees
    const newPlacementItems = [];
    planetAllDegrees.forEach((degrees, planet) => {
      const existing = placementItems.find(item => item.planet === planet);
      newPlacementItems.push({
        planet: planet,
        direction: existing ? existing.direction : ''
      });
    });

    // Only update if the structure has changed
    const currentRemovalKey = removalItems.map(item => `${item.planet}-${item.directions.length}`).sort().join(',');
    const newRemovalKey = newRemovalItems.map(item => `${item.planet}-${item.directions.length}`).sort().join(',');
    const currentPlacementKey = placementItems.map(item => item.planet).sort().join(',');
    const newPlacementKey = newPlacementItems.map(item => item.planet).sort().join(',');

    if (currentRemovalKey !== newRemovalKey || currentPlacementKey !== newPlacementKey) {
      if (newRemovalItems.length > 0 || newPlacementItems.length > 0) {
        setRemovalItems(newRemovalItems.length > 0 ? newRemovalItems : [{ planet: '', directions: [''] }]);
        setPlacementItems(newPlacementItems.length > 0 ? newPlacementItems : [{ planet: '', direction: '' }]);
      } else {
        setRemovalItems([{ planet: '', directions: [''] }]);
        setPlacementItems([{ planet: '', direction: '' }]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspectsOnHouses, aspectsOnPlanets]);

  // Auto-generate color and object suggestions based on placement items
  useEffect(() => {
    // Planet to colors mapping
    const planetColors = {
      'Sun': ['Saffron', 'Golden', 'Red', 'Orange'],
      'Moon': ['White', 'Light Blue', 'Light Grey', 'Aqua'],
      'Mars': ['Red', 'Maroon', 'Fiery Red', 'Orange-Red'],
      'Mercury': ['Green', 'Pale Green'],
      'Jupiter': ['Yellow', 'Light Yellow', 'Cream', 'Golden'],
      'Venus': ['Light Pink', 'Orange', 'Peach', 'White'],
      'Saturn': ['Navy Blue', 'Dark Grey', 'Black', 'Light Grey'],
      'Rahu': ['Smoky Blue', 'Charcoal', 'Muddy Brown', 'Earthy Brown'],
      'Ketu': ['Yellow', 'Cream', 'White']
    };

    // Direction to Planets mapping (12 Rashi-linked directions)
    const directionPlanets = {
      'East': ['Mars'],              // Aries
      'North-West': ['Venus'],        // Taurus
      'North-North-West': ['Mercury'], // Gemini
      'North-North-East': ['Moon'],   // Cancer
      'East-North-East': ['Sun'],     // Leo
      'North': ['Mercury'],           // Virgo
      'West-South-West': ['Venus'],   // Libra
      'South-South-West': ['Mars'],   // Scorpio
      'North-East': ['Jupiter'],      // Sagittarius
      'South': ['Saturn'],            // Capricorn
      'West': ['Saturn'],             // Aquarius
      'South-East': ['Jupiter']       // Pisces
    };

    // Planet to Body Parts mapping (based on Rāśi rulership)
    const planetBodyParts = {
      'Mars': [
        { rashi: 'Aries', part: 'Head / Hair region', accessories: ['Ear pins', 'Hairpins', 'Headband'] },
        { rashi: 'Scorpio', part: 'Innerwear / private zone', accessories: ['Color of undergarments'] }
      ],
      'Venus': [
        { rashi: 'Taurus', part: 'Neck', accessories: ['Necklace'] },
        { rashi: 'Libra', part: 'Waist', accessories: ['Belt', 'Waistband', 'Kamarbandh'] }
      ],
      'Mercury': [
        { rashi: 'Gemini', part: 'Shoulders / Arms', accessories: ['Mobile', 'Ring', 'Bracelet', 'Wristwatch', 'Pens'] },
        { rashi: 'Virgo', part: 'Waist / Pockets', accessories: ['Pocket emulates', 'Charms'] }
      ],
      'Moon': [
        { rashi: 'Cancer', part: 'Chest (Center)', accessories: ['Long pendant'] }
      ],
      'Sun': [
        { rashi: 'Leo', part: 'Chest (Left side)', accessories: ['Broach'] }
      ],
      'Jupiter': [
        { rashi: 'Sagittarius', part: 'Thighs', accessories: ['Shorts', 'Trouser pockets'] },
        { rashi: 'Pisces', part: 'Feet', accessories: ['Shoes', 'Footwear', 'Toe rings'] }
      ],
      'Saturn': [
        { rashi: 'Capricorn', part: 'Knees / Lower legs', accessories: ['Trousers', 'Lowers'] },
        { rashi: 'Aquarius', part: 'Ankles', accessories: ['Anklet'] }
      ],
      'Rahu': [
        { rashi: 'Aquarius', part: 'Ankles', accessories: ['Anklet'] }
      ],
      'Ketu': [
        { rashi: 'Scorpio', part: 'Innerwear / private zone', accessories: ['Color of undergarments'] }
      ]
    };

    // Filter placement items that have both planet and direction selected
    const validPlacements = placementItems.filter(item => item.planet && item.direction);

    if (validPlacements.length === 0) {
      setValue('colorObjectsToUse', '');
      return;
    }

    // Generate suggestions for each placement
    const suggestions = validPlacements.map(item => {
      const planet = item.planet;
      const direction = item.direction;

      // Get colors for this planet
      const colors = planetColors[planet] || [];

      // Get planets associated with this direction
      const directionPlanetsList = directionPlanets[direction] || [];

      // Get body parts from all planets associated with this direction
      const bodyPartsData = [];
      directionPlanetsList.forEach(dirPlanet => {
        const parts = planetBodyParts[dirPlanet] || [];
        bodyPartsData.push(...parts);
      });

      const bodyParts = bodyPartsData.map(data => data.part).join(' or ');
      const accessories = bodyPartsData.flatMap(data => data.accessories).slice(0, 3).join(', ');

      if (!colors.length && !bodyParts) {
        return null;
      }

      let suggestion = `• ${planet} in ${direction}:`;
      if (colors.length) suggestion += ` Use ${colors.slice(0, 3).join(', ')} colors`;
      if (bodyParts) suggestion += ` on ${bodyParts}`;
      if (accessories) suggestion += ` (${accessories})`;

      return suggestion;
    }).filter(s => s !== null).join('\n');

    setValue('colorObjectsToUse', suggestions);
  }, [placementItems, setValue]);

  // Auto-generate color and object suggestions for removal items (what NOT to use)
  useEffect(() => {
    // Planet to colors mapping
    const planetColors = {
      'Sun': ['Saffron', 'Golden', 'Red', 'Orange'],
      'Moon': ['White', 'Light Blue', 'Light Grey', 'Aqua'],
      'Mars': ['Red', 'Maroon', 'Fiery Red', 'Orange-Red'],
      'Mercury': ['Green', 'Pale Green'],
      'Jupiter': ['Yellow', 'Light Yellow', 'Cream', 'Golden'],
      'Venus': ['Light Pink', 'Orange', 'Peach', 'White'],
      'Saturn': ['Navy Blue', 'Dark Grey', 'Black', 'Light Grey'],
      'Rahu': ['Smoky Blue', 'Charcoal', 'Muddy Brown', 'Earthy Brown'],
      'Ketu': ['Yellow', 'Cream', 'White']
    };

    // Direction to Planets mapping (12 Rashi-linked directions)
    const directionPlanets = {
      'East': ['Mars'],              // Aries
      'North-West': ['Venus'],        // Taurus
      'North-North-West': ['Mercury'], // Gemini
      'North-North-East': ['Moon'],   // Cancer
      'East-North-East': ['Sun'],     // Leo
      'North': ['Mercury'],           // Virgo
      'West-South-West': ['Venus'],   // Libra
      'South-South-West': ['Mars'],   // Scorpio
      'North-East': ['Jupiter'],      // Sagittarius
      'South': ['Saturn'],            // Capricorn
      'West': ['Saturn'],             // Aquarius
      'South-East': ['Jupiter']       // Pisces
    };

    // Planet to Body Parts mapping (based on Rāśi rulership)
    const planetBodyParts = {
      'Mars': [
        { rashi: 'Aries', part: 'Head / Hair region', accessories: ['Ear pins', 'Hairpins', 'Headband'] },
        { rashi: 'Scorpio', part: 'Innerwear / private zone', accessories: ['Color of undergarments'] }
      ],
      'Venus': [
        { rashi: 'Taurus', part: 'Neck', accessories: ['Necklace'] },
        { rashi: 'Libra', part: 'Waist', accessories: ['Belt', 'Waistband', 'Kamarbandh'] }
      ],
      'Mercury': [
        { rashi: 'Gemini', part: 'Shoulders / Arms', accessories: ['Mobile', 'Ring', 'Bracelet', 'Wristwatch', 'Pens'] },
        { rashi: 'Virgo', part: 'Waist / Pockets', accessories: ['Pocket emulates', 'Charms'] }
      ],
      'Moon': [
        { rashi: 'Cancer', part: 'Chest (Center)', accessories: ['Long pendant'] }
      ],
      'Sun': [
        { rashi: 'Leo', part: 'Chest (Left side)', accessories: ['Broach'] }
      ],
      'Jupiter': [
        { rashi: 'Sagittarius', part: 'Thighs', accessories: ['Shorts', 'Trouser pockets'] },
        { rashi: 'Pisces', part: 'Feet', accessories: ['Shoes', 'Footwear', 'Toe rings'] }
      ],
      'Saturn': [
        { rashi: 'Capricorn', part: 'Knees / Lower legs', accessories: ['Trousers', 'Lowers'] },
        { rashi: 'Aquarius', part: 'Ankles', accessories: ['Anklet'] }
      ],
      'Rahu': [
        { rashi: 'Aquarius', part: 'Ankles', accessories: ['Anklet'] }
      ],
      'Ketu': [
        { rashi: 'Scorpio', part: 'Innerwear / private zone', accessories: ['Color of undergarments'] }
      ]
    };

    // Filter removal items that have both planet and at least one direction
    const validRemovals = removalItems.filter(item =>
      item.planet && item.directions && item.directions.some(dir => dir)
    );

    if (validRemovals.length === 0) {
      setValue('colorObjectsNotToUse', '');
      return;
    }

    // Generate suggestions for each removal
    const suggestions = validRemovals.map(item => {
      const planet = item.planet;
      const validDirections = item.directions.filter(dir => dir);

      if (validDirections.length === 0) return null;

      // Get colors for this planet
      const colors = planetColors[planet] || [];

      // Get all unique body parts from all directions
      const allBodyPartsData = [];
      validDirections.forEach(direction => {
        const directionPlanetsList = directionPlanets[direction] || [];
        directionPlanetsList.forEach(dirPlanet => {
          const parts = planetBodyParts[dirPlanet] || [];
          allBodyPartsData.push(...parts);
        });
      });

      // Remove duplicates
      const uniqueBodyParts = [...new Set(allBodyPartsData.map(data => data.part))];
      const bodyParts = uniqueBodyParts.join(' or ');

      const allAccessories = allBodyPartsData.flatMap(data => data.accessories);
      const uniqueAccessories = [...new Set(allAccessories)];
      const accessories = uniqueAccessories.slice(0, 3).join(', ');

      if (!colors.length && !bodyParts) {
        return null;
      }

      const directionsList = validDirections.join(' and ');
      let suggestion = `• ${planet} from ${directionsList}:`;
      if (colors.length) suggestion += ` Avoid ${colors.slice(0, 3).join(', ')} colors`;
      if (bodyParts) suggestion += ` on ${bodyParts}`;
      if (accessories) suggestion += ` (${accessories})`;

      return suggestion;
    }).filter(s => s !== null).join('\n');

    setValue('colorObjectsNotToUse', suggestions);
  }, [removalItems, setValue]);

  // Auto-fill ink color based on Laughing Buddha direction
  useEffect(() => {
    const laughingBuddhaDir = watch('laughingBuddhaDirection');

    if (!laughingBuddhaDir) {
      setValue('wishListInkColor', '');
      return;
    }

    // Direction to Planet mapping
    const directionPlanets = {
      'East': ['Mars'],
      'North-West': ['Venus'],
      'North-North-West': ['Mercury'],
      'North-North-East': ['Moon'],
      'East-North-East': ['Sun'],
      'North': ['Mercury'],
      'West-South-West': ['Venus'],
      'South-South-West': ['Mars'],
      'North-East': ['Jupiter'],
      'South': ['Saturn'],
      'West': ['Saturn'],
      'South-East': ['Jupiter']
    };

    // Planet to colors mapping
    const planetColors = {
      'Sun': ['Saffron', 'Golden', 'Red', 'Orange'],
      'Moon': ['White', 'Light Blue', 'Light Grey', 'Aqua'],
      'Mars': ['Red', 'Maroon', 'Fiery Red', 'Orange-Red'],
      'Mercury': ['Green', 'Pale Green'],
      'Jupiter': ['Yellow', 'Light Yellow', 'Cream', 'Golden'],
      'Venus': ['Light Pink', 'Orange', 'Peach', 'White'],
      'Saturn': ['Navy Blue', 'Dark Grey', 'Black', 'Light Grey'],
      'Rahu': ['Smoky Blue', 'Charcoal', 'Muddy Brown', 'Earthy Brown'],
      'Ketu': ['Yellow', 'Cream', 'White']
    };

    const planets = directionPlanets[laughingBuddhaDir] || [];
    if (planets.length > 0) {
      const planet = planets[0];
      const colors = planetColors[planet] || [];
      const colorSuggestion = colors.slice(0, 2).join(' or ');
      setValue('wishListInkColor', colorSuggestion);
    }
  }, [watch('laughingBuddhaDirection'), setValue, watch]);

  // Auto-generate book recommendations based on Mahadasha and Antardasha planets
  useEffect(() => {
    const planetBooks = {
      'Sun': [
        'LEADERS EAT LAST BY Simon Sinek',
        'CORPORATE CHANAKYA IN LEADERSHIP BY Radhakrishnan Pillai',
        'THE LEADER IN YOU BY Dale Carnegie',
        '5 LEVELS OF LEADERSHIP BY John C Maxwell',
        'ATTITUDE IS EVERYTHING BY Jeff Keller',
        'THE 48 LAWS OF POWER BY Robert Greene'
      ],
      'Moon': [
        'MASTER YOUR EMOTIONS BY Thibaut Meurisse',
        'EMOTIONAL INTELLIGENCE BY Daniel Goleman',
        'POWER OF YOUR SUBCONSCIOUS MIND BY Joseph Murphy',
        'HOW TO STOP WORRYING AND START LIVING BY Dale Carnegie',
        'THE POWER OF POSITIVE THINKING BY Norman Vincent Peale',
        'THE HIDDEN MESSAGES IN WATER BY Masaru Emoto'
      ],
      'Mars': [
        'THE ART OF WAR BY Sun Tzu',
        'ANGER: TAMING A POWERFUL EMOTION BY Gary Chapman',
        'THE 5 AM CLUB BY Robin Sharma',
        'CAN\'T HURT ME BY David Goggin',
        'AWAKEN THE GIANT WITHIN BY Anthony Robbins',
        'GRIT BY Angela Duckworth'
      ],
      'Mercury': [
        'THE GREATEST SALESMAN IN THE WORLD BY Og Mandino',
        'HOW TO WIN FRIENDS AND INFLUENCE PEOPLE BY Dale Carnegie',
        'TALK LIKE TED BY Carmine Gallo',
        'NEVER EAT ALONE BY Keith Ferrazzi',
        'HOW TO READ A BOOK BY Mortimer J. Adler',
        'PUBLIC SPEAKING BY Dale Carnegie'
      ],
      'Jupiter': [
        'THE LUCK PRINCIPLE BY Dr. Richard Wiseman',
        'THE PROPHET BY Khalil Gibran',
        'MEDITATIONS BY Marcus Aurelius',
        'AUTOBIOGRAPHY OF A YOGI BY Paramhansa Yogananda',
        'THE GEETA',
        'THE COACHING HABIT BY Michael Bungay Stanier'
      ],
      'Venus': [
        'PSYCHOLOGY OF MONEY BY Morgan Housel',
        'THINK AND GROW RICH BY Napoleon Hill',
        'THE GOOD LIFE BY Robert Waldinger',
        'SECRETS OF THE MILLIONAIRE MIND BY T. Harv Eker'
      ],
      'Saturn': [
        'HYPER FOCUS BY Chris Bailey',
        'THE 80/20 PRINCIPLE BY Richard Koch',
        'HOMO SAPIENS BY Yuval Noah Harari',
        'THE ONE THING BY Gary Keller',
        'THE POWER OF HABITS BY Charles Duhigg',
        'ATOMIC HABITS BY James Clear',
        'DEEP WORK BY Cal Newport'
      ],
      'Rahu': [
        'EVERYBODY LIES BY Seth Stephens',
        'INSTANT INFLUENCE AND CHARISMA BY Paul McKenna',
        'ILLUSIONS BY Richard Bach',
        'THE MAGIC OF THINKING BIG BY David Schwartz',
        '500 SOCIAL MEDIA MARKETING TIPS BY Andrew Macarthy'
      ],
      'Ketu': [
        'LETTING GO BY David R. Hawkins',
        'BOOK OF SECRETS BY Osho',
        'MEDITATION - FIRST AND LAST FREEDOM BY Osho',
        'THE POWER OF NOW BY Eckhart Tolle',
        'A COMPLAINT FREE WORLD BY Will Bowen',
        'THE SECRET POWER BY Dr. Joe Vitale'
      ]
    };

    // Get planets from Mahadasha and Antardasha (first planets, not NL)
    const mahadashaPlanet = watch('mahadasha_planet');
    const antardashaPlanet = watch('antardasha_planet');

    const selectedPlanets = [];
    if (mahadashaPlanet) selectedPlanets.push(mahadashaPlanet);
    if (antardashaPlanet && antardashaPlanet !== mahadashaPlanet) {
      selectedPlanets.push(antardashaPlanet);
    }

    if (selectedPlanets.length === 0) {
      setValue('importantBooks', '');
      return;
    }

    // Generate book recommendations for each planet
    const bookRecommendations = [];
    selectedPlanets.forEach(planet => {
      const books = planetBooks[planet] || [];
      if (books.length > 0) {
        bookRecommendations.push(`${planet}:`);
        books.slice(0, 3).forEach(book => {
          bookRecommendations.push(`• ${book}`);
        });
      }
    });

    setValue('importantBooks', bookRecommendations.join('\n'));
  }, [watch('mahadasha_planet'), watch('antardasha_planet'), setValue, watch]);

  // Auto-generate gift recommendations for Gifts to Give
  useEffect(() => {
    const planetGifts = {
      'Sun': [
        'Orange colour things',
        'Gold items',
        'Ashoka pillar',
        'Any government symbol',
        'Sun statues or murals'
      ],
      'Moon': [
        'White colour things',
        'Silver items',
        'Pearl jewellery',
        'Dairy products',
        'Mother Mary statues',
        'Ma Saraswati statues'
      ],
      'Mars': [
        'Red colour things',
        'Knife',
        'Swords',
        'Weapons miniatures',
        'Swiss knife'
      ],
      'Mercury': [
        'Green colour things',
        'Speakers set of 2',
        'Books',
        'Green plants',
        'Green scenery'
      ],
      'Jupiter': [
        'Yellow colour things',
        'Brass decorative items',
        'God pictures or statues',
        'Gold items',
        'Kesar',
        'Religious books',
        'Buddha statues or posters'
      ],
      'Venus': [
        'Diamonds',
        'Platinum',
        'Cream colour flowers',
        'Branded perfumes',
        'Anything of very exclusive brand',
        'Make-up items',
        'Beautiful flowers'
      ],
      'Saturn': [
        'Black colour things',
        'Iron show pieces',
        'Black shoes',
        'Binoculars',
        'Telescope'
      ],
      'Rahu': [
        'Buddha head',
        'Wine bottles',
        'Exclusive tea or coffee hampers',
        'Black elephant statue or miniature or pictures',
        'Grey colour things'
      ],
      'Ketu': [
        'Ganesha ji idols or posters',
        'Chess',
        'Black and white blankets/kurta'
      ]
    };

    const selectedPlanet = watch('giftsToGivePlanet');

    if (!selectedPlanet) {
      setValue('giftsToGive', '');
      return;
    }

    const gifts = planetGifts[selectedPlanet] || [];
    if (gifts.length > 0) {
      const giftText = gifts.map(gift => `• ${gift}`).join('\n');
      setValue('giftsToGive', giftText);
    } else {
      setValue('giftsToGive', '');
    }
  }, [watch('giftsToGivePlanet'), setValue, watch]);

  // Auto-generate Professional Mindset based on Saturn following
  useEffect(() => {
    const saturnFollowingPlanet = watch('saturnFollowing');

    const saturnRelationNotes = {
      'Jupiter': `1. Good combination if no malefic conjoin
2. Native enjoy a divine grace in their profession.
3. They should always seek blessings from their Guru/Guides.
4. They can themselves become great Gurus, successful trainers, life coaches.
5. He can be teacher, in bank job, advisor, counsellor.`,

      'Sun': `1. It may create disturbances in native's professional life because of native's ego.
2. May face ego clashes with their colleagues or boss. Often end up with multiple enemies due to their headstrong nature.
3. They may enter their family business or work with their family in any chosen area.
4. They should always maintain cordial relations with their father and family/Sun significance(Boss, government officials)
5. They can associate with government.
6. He will have desire of fame in profession.
7. Father-son will have issues.
8. Leg pain either self or father.
9. Chacha,Tau, Elder brother can be in government job.
10. Chacha,Tau, Elder brother will have ego, attitude and anger.
11. If its not government job, he will have lots of problems in the job.`,

      'Moon': `1. A fickle minded approach towards one's career. Frequent changes in the profession.
2. Sheer lack of emotional support.
3. Attain professional success far away from their birth place.
4. More travel will give better professional success.
5. Can be good astrologer/psychological counselling.
6. Sa:Mo is Vish Yoga. Person should do puja of Ardh-Narishwar.
7. Can do food/travelling/dairy related work.
8. Water will keep on dripping from one tap in home.
9. Can't take decisions easily.
10. Will have to pass through depression for sure.
11. Mother will have pain in legs.
12. Chacha, Tau, elder brother will be emotional, travel a lot and do change of place.
13. Should throw out wet clothes from bathroom immediately after the bath.`,

      'Mars': `1. Native may take impulsive decisions in life and end up regretting them later.
2. May face problems in profession due to negative people and betrayals.
3. May achieve great success in technical field, Defence, Army, Vastu consultant.
4. Should sleep on floor for 43 days if facing any work related issues.
5. Being physically active like jogging or gymming can benefit in professional success.
6. Work related to land, real estate, tantric, engineer, factory, police, surgeon, butcher.
7. Career will be set using Mantra sadhna.
8. Walk barefoot on grass.
9. Can be a factory owner.
10. Gives too much property.
11. Can be builder, coloniser.`,

      'Rahu': `1. Native is always feeling insecure regarding profession.
2. This only about career expansion.
3. This combination may trigger sudden troubles or unexpected changes in the career.
4. Possibility of career in an unorthodox/non-traditional career, secret service, Bollywood, film industry, technology, foreign related work.
5. May excel in foreign or sectors like cinema and film industry.
6. Working online or establishing themselves over the social media channels such as Facebook, Instagram and YouTube.
7. Native work can be of repetitive nature like photocopy machine because Rahu is repetitive work.`,

      'Mercury': `1. It may take longer than expected to learn new concepts as Saturn is slow and steady planet. But maybe quick in grasping subjects that Saturn represent.
2. Native prefer owning a business over pursuing a job.
3. Accounting, commissioning, education, teacher, writer and trade are the sectors favourable for these natives.
4. They are excellent persuaders and can become extraordinary salespeople.
5. Career stream should be related to the education you received
6. More you read, more your profession will grow.
7. Education can be in psychology, philosophy, mining, history and political science.`,

      'Ketu': `1. Native may feel a detachment from their profession, shows loss of consistency.
2. Good professional options are Yoga, Medical, doctor, surgeon, pundit, chemical, Law and Consultancy, Research and development, Astrology.
3. Native may sense an invisible force guiding them all along in their careers.
4. Karma of these natives can help them attain salvation.
5. Problems and hurdles in profession.
6. Native can have 3 houses, can live in third floor or his house can have 3 floors. Can have corner house.`,

      'Venus': `1. This conjunction gives lot of wealth to the profession.
2. There will be an increase in wealth and prosperity after marriage.
3. Professional options are related to finance, computer, ladies items, beauty, art, luxury and vehicle.
4. Once in a life, native is going to have a powerful influence in society and chosen career field.
5. If Venus degree is more than Saturn, work will be less but money is more. If Saturn degree is more than Venus degree, work will be too much but money is less.`
    };

    if (saturnFollowingPlanet && saturnRelationNotes[saturnFollowingPlanet]) {
      setValue('professionalMindset', saturnRelationNotes[saturnFollowingPlanet]);
    } else {
      setValue('professionalMindset', '');
    }
  }, [watch('saturnFollowing'), setValue, watch]);

  // Auto-generate Financial Mindset based on Venus following
  useEffect(() => {
    const venusFollowingPlanet = watch('venusFollowing');

    const venusRelationNotes = {
      'Sun': `1. Native should avoid physical intimacy in the daytime, can give incurable disease.
2. Native can receive wealth from father/government.
3. Native may offer sweets made from flour to make this combination useful.
4. Father will be wealthy.
5. There can be conflict between wife and father-in-law.
6. Father will be wealthy.
7. Fame through wealth.
8. Wife can be in government job.
9. Wife will have ego attitude and anger.
10. Wife will come from a good/famous family.
11. Wife and father-in-law will have troubles.`,

      'Moon': `1. These natives should stay away from their mothers to ensure optimum marital bliss.
2. If money is stuck, start travelling.
3. Native likes the presentation and garnishes over the food.
4. Should donate good food to attract an influx of wealth.
5. To maintain the harmony between mother and wife, donate a mixture of raw cow milk and homemade butter in a steel pot to a temple.
6. Can receive wealth from mother.
7. Wife and mother-in-law will have troubles.
8. Mother will be wealthy.
9. Wife will be emotional, do travel and can do change of place.`,

      'Mars': `1. Can invest in real estate or lands to use better this combination.
2. Stay physically active and money will keep on flowing.
3. The spouses of the male natives often struggle with their health and temper.
4. Younger brothers of these natives may prosper after marriage.
5. Last birth husband-wife.
6. Husband and younger brother will be wealthy.
7. Native is very romantic.`,

      'Rahu': `1. These natives should prefer earning their livelihood away from their native place.
2. Spouse may be unpredictable, may even lead to infidelity.
3. These natives should use luxury goods depending on their bank balance and affordability.
4. Can receive money from foreign.
5. Wife can be ill.
6. Wife can go to foreign, politics or jail.
7. Dada ji will be wealthy.`,

      'Jupiter': `1. Native should always respect their tutors, teachers, guides and gurus to uplift their wealth.
2. Unnecessarily criticising or hurling verbal abuses at the teachers may lead to loss of wealth.
3. Make sure your faith in spiritual practices is not deviated.
4. Wife will be religious, counsellor, loves food and sleep.
5. Native will have house.
6. Native will be wealthy.`,

      'Saturn': `1. Native can get massive wealth through their profession.
2. Native should treat their subordinates and employees with the utmost respect.
3. They should behave in an orderly manner and with optimum discipline.
4. Staying active with a managed schedule can bring wealth and satisfaction.
5. Wife can be sad and lazy, dark complexion, older.
6. Old house
7. Late marriage
8. Dhan-yog, millionaire`,

      'Mercury': `1. They should indulge in meaningful communications.
2. They should write journal daily.
3. Journeys over short distance, trading, and consistent learning can bring them wealth.
4. More you will read, more money will flow.
5. Wife would be intelligent.
6. Sister/daughter would be wealthy
7. Can do education in beauty parlour, interior fashion designing, biology, textile engineering, software engineering, computer engineering.
8. Krishna Bhagwan
9. vishnu-Laxmi yog, native will be millionaire, wealthy.
10. Can have 2 wives.
11. Sister, mama will be wealthy
12. Wife can do business.`,

      'Ketu': `1. More the wealth, more the native loses interest in worldly matters. Ke only provide when you do not think about it. So remove focus from wealth.
2. They should start treating wealth as a matter of secondary significance.
3. Their lifestyle should be simple and devoid of a show-off.
4. These natives may perform financially well with little or no regard for the overall financial profits.
5. If money is blocked, surrender 100 percent, only then you will get the money or do gardening.
6. Native can receive wealth from dead person/can find secret treasure.
7. Gains from agriculture because Ketu is roots.
8. Temple near the wife's house.
9. Wife can be spiritual, religious.
10. Wife can have defect in legs, piles.
11. Mama-bhania, nana, saala will be wealthy.`
    };

    if (venusFollowingPlanet && venusRelationNotes[venusFollowingPlanet]) {
      setValue('financialMindset', venusRelationNotes[venusFollowingPlanet]);
    } else {
      setValue('financialMindset', '');
    }
  }, [watch('venusFollowing'), setValue, watch]);

  // Handle Kundli PDF upload
  const handleKundliUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file);
      setKundliPdf(fileUrl);
      setShowKundliViewer(true);
      setKundliZoom(1);

      // Extract text from PDF using backend API
      try {
        const formData = new FormData();
        formData.append('file', file);

        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${API_URL}/extract-pdf-data`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Auto-fill form fields with extracted data
            if (result.data.name) {
              setValue('name', result.data.name);
            }
            if (result.data.dateOfBirth) {
              setValue('dateOfBirth', result.data.dateOfBirth);
            }
            if (result.data.timeOfBirth) {
              setValue('timeOfBirth', result.data.timeOfBirth);
            }
            if (result.data.placeOfBirth) {
              setValue('placeOfBirth', result.data.placeOfBirth);
            }

            console.log('Extracted data:', result.data);
            console.log('First 500 chars of PDF:', result.extractedText);
          }
        } else {
          console.error('Failed to extract PDF data:', await response.text());
        }
      } catch (error) {
        console.error('Error extracting PDF text:', error);
      }
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  // Handle dragging
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('kundli-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - kundliPosition.x,
        y: e.clientY - kundliPosition.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setKundliPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
    if (isResizing) {
      const newWidth = Math.max(150, resizeStart.width + (e.clientX - resizeStart.x));
      const newHeight = Math.max(150, resizeStart.height + (e.clientY - resizeStart.y));
      setKundliSize({ width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: kundliSize.width,
      height: kundliSize.height
    });
  };

  // Touch event handlers for mobile support
  const handleTouchStart = (e) => {
    if (e.target.classList.contains('kundli-header')) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - kundliPosition.x,
        y: touch.clientY - kundliPosition.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging || isResizing) {
      e.preventDefault(); // Prevent scrolling while dragging/resizing
      const touch = e.touches[0];
      if (isDragging) {
        setKundliPosition({
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y
        });
      }
      if (isResizing) {
        const newWidth = Math.max(150, resizeStart.width + (touch.clientX - resizeStart.x));
        const newHeight = Math.max(150, resizeStart.height + (touch.clientY - resizeStart.y));
        setKundliSize({ width: newWidth, height: newHeight });
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleResizeTouchStart = (e) => {
    e.stopPropagation();
    const touch = e.touches[0];
    setIsResizing(true);
    setResizeStart({
      x: touch.clientX,
      y: touch.clientY,
      width: kundliSize.width,
      height: kundliSize.height
    });
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart]);

  // Default room template for each map
  const defaultRoomTemplate = {
    'Main Entrance': '',
    'Living Room': '',
    'Kitchen': '',
    'Master Bedroom': '',
    'Bedroom 2': '',
    'Bedroom 3': '',
    'Dining Room': '',
    'Pooja Room/Prayer Room': '',
    'Bathroom 1': '',
    'Bathroom 2': '',
    'Bathroom 3': '',
    'Study Room': '',
    'Store Room': '',
    'Balcony': '',
    'Terrace': '',
    'Garage': '',
    'Garden': '',
    'Staircase': ''
  };

  // Handle House Map upload - supports multiple files (images and PDFs)
  const handleMapUpload = async (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file =>
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );

    if (validFiles.length === 0) {
      alert('Please upload valid image files (JPG, PNG, etc.) or PDF files');
      return;
    }

    const newMaps = [];

    for (const file of validFiles) {
      if (file.type === 'application/pdf') {
        // Handle PDF files - send to backend for conversion
        try {
          const formData = new FormData();
          formData.append('file', file);

          const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
          const response = await fetch(`${API_URL}/convert-pdf-to-image`, {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error('Failed to convert PDF');
          }

          const result = await response.json();

          if (result.success && result.images) {
            // Add each page as a separate map
            result.images.forEach((imageBase64, idx) => {
              newMaps.push({
                url: imageBase64,
                name: `${file.name} - Page ${idx + 1}`,
                rooms: { ...defaultRoomTemplate }
              });
            });
          }
        } catch (error) {
          console.error('Error converting PDF:', error);
          alert(`Failed to convert PDF "${file.name}": ${error.message || 'Unknown error'}`);
        }
      } else {
        // Handle image files
        newMaps.push({
          url: URL.createObjectURL(file),
          name: file.name,
          rooms: { ...defaultRoomTemplate }
        });
      }
    }

    if (newMaps.length > 0) {
      setHouseMaps(prev => [...prev, ...newMaps]);
    }

    // Reset the input to allow re-uploading the same file
    event.target.value = '';
  };

  // Remove a specific house map
  const removeHouseMap = (index) => {
    setHouseMaps(prev => prev.filter((_, i) => i !== index));
  };

  // Update room direction for a specific map
  const updateRoomDirection = (mapIndex, roomName, direction) => {
    setHouseMaps(prev => prev.map((map, i) =>
      i === mapIndex ? {
        ...map,
        rooms: { ...map.rooms, [roomName]: direction }
      } : map
    ));
  };

  // Auto-generate gift recommendations for Gifts to Receive
  useEffect(() => {
    const planetGifts = {
      'Sun': [
        'Orange colour things',
        'Gold items',
        'Ashoka pillar',
        'Any government symbol',
        'Sun statues or murals'
      ],
      'Moon': [
        'White colour things',
        'Silver items',
        'Pearl jewellery',
        'Dairy products',
        'Mother Mary statues',
        'Ma Saraswati statues'
      ],
      'Mars': [
        'Red colour things',
        'Knife',
        'Swords',
        'Weapons miniatures',
        'Swiss knife'
      ],
      'Mercury': [
        'Green colour things',
        'Speakers set of 2',
        'Books',
        'Green plants',
        'Green scenery'
      ],
      'Jupiter': [
        'Yellow colour things',
        'Brass decorative items',
        'God pictures or statues',
        'Gold items',
        'Kesar',
        'Religious books',
        'Buddha statues or posters'
      ],
      'Venus': [
        'Diamonds',
        'Platinum',
        'Cream colour flowers',
        'Branded perfumes',
        'Anything of very exclusive brand',
        'Make-up items',
        'Beautiful flowers'
      ],
      'Saturn': [
        'Black colour things',
        'Iron show pieces',
        'Black shoes',
        'Binoculars',
        'Telescope'
      ],
      'Rahu': [
        'Buddha head',
        'Wine bottles',
        'Exclusive tea or coffee hampers',
        'Black elephant statue or miniature or pictures',
        'Grey colour things'
      ],
      'Ketu': [
        'Ganesha ji idols or posters',
        'Chess',
        'Black and white blankets/kurta'
      ]
    };

    const selectedPlanet = watch('giftsToReceivePlanet');

    if (!selectedPlanet) {
      setValue('giftsToReceive', '');
      return;
    }

    const gifts = planetGifts[selectedPlanet] || [];
    if (gifts.length > 0) {
      const giftText = gifts.map(gift => `• ${gift}`).join('\n');
      setValue('giftsToReceive', giftText);
    } else {
      setValue('giftsToReceive', '');
    }
  }, [watch('giftsToReceivePlanet'), setValue, watch]);

  const onPreview = (data) => {
    // Format aspectsOnHouses: "Venus hits Houses 1st and 3rd at 90° and 5th at 180°"
    const formattedAspectsOnHouses = aspectsOnHouses
      .filter(aspect => aspect.planet && aspect.aspects.some(a => a.houses.some(h => h) && a.degree))
      .map(aspect => {
        const parts = aspect.aspects
          .filter(a => a.houses.some(h => h) && a.degree)
          .map(a => {
            const validHouses = a.houses.filter(h => h);
            const houseList = validHouses.map(h => `${h}${getOrdinalSuffix(h)}`).join(' and ');
            return `${validHouses.length > 1 ? 'Houses ' : 'House '}${houseList} at ${a.degree}`;
          });

        return `${aspect.planet} hits ${parts.join(' and ')}`;
      })
      .join('\n');

    // Format aspectsOnPlanets: "Mars hits Planets Jupiter and Venus at 120° and Saturn at 90°"
    const formattedAspectsOnPlanets = aspectsOnPlanets
      .filter(aspect => aspect.planet && aspect.aspects.some(a => a.planets.some(p => p) && a.degree))
      .map(aspect => {
        const parts = aspect.aspects
          .filter(a => a.planets.some(p => p) && a.degree)
          .map(a => {
            const validPlanets = a.planets.filter(p => p);
            const planetList = validPlanets.join(' and ');
            return `${validPlanets.length > 1 ? 'Planets ' : 'Planet '}${planetList} at ${a.degree}`;
          });

        return `${aspect.planet} hits ${parts.join(' and ')}`;
      })
      .join('\n');

    // Format removal items
    const formattedRemovalItems = removalItems
      .filter(item => item.planet && item.directions.some(d => d))
      .map(item => {
        const filledDirections = item.directions.filter(d => d);
        if (filledDirections.length === 0) return null;

        const directionText = filledDirections.join(' and ');
        return `• Remove ${item.planet} from ${directionText}`;
      })
      .filter(item => item !== null)
      .join('\n');

    // Format placement items
    const formattedPlacementItems = placementItems
      .filter(item => item.planet && item.direction)
      .map(item => `• Place ${item.planet} in ${item.direction}`)
      .join('\n');

    // Format room directions for each map
    const formattedRoomDirections = houseMaps.map(map => {
      const specifiedRooms = Object.entries(map.rooms)
        .filter(([room, direction]) => direction !== '')
        .map(([room, direction]) => `• ${room}: ${direction}`)
        .join('\n');
      return specifiedRooms;
    });

    const updatedData = {
      ...data,
      aspectsOnHouses: formattedAspectsOnHouses,
      aspectsOnPlanets: formattedAspectsOnPlanets,
      whatToRemove: formattedRemovalItems,
      whatToPlace: formattedPlacementItems,
      houseMapImages: houseMaps.map(m => m.url),
      houseMapAnalyses: formattedRoomDirections,
      mahadasha_no_star: mahadashaNoStar,
      antardasha_no_star: antardashaNoStar,
      pratyantardasha_no_star: pratyantardashaNoStar
    };

    setPreviewData(updatedData);
    setShowPreview(true);
  };

  // Helper function for ordinal suffix
  const getOrdinalSuffix = (num) => {
    const n = parseInt(num);
    if (n === 1) return 'st';
    if (n === 2) return 'nd';
    if (n === 3) return 'rd';
    return 'th';
  };

  const onExport = async (customFilename) => {
    setLoading(true);
    setMessage(null);
    setShowPreview(false);

    try {
      const reportType = previewData.reportType;
      const formData = { ...previewData };
      delete formData.reportType;

      // Send Kundli PDF directly (pages 1, 3, 4) if present
      if (kundliPdf) {
        try {
          const response = await fetch(kundliPdf);
          const blob = await response.blob();
          const reader = new FileReader();

          const kundliBase64 = await new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });

          formData.kundliPdf = kundliBase64;
          formData.kundliPages = [1, 3, 4]; // Pages to extract
        } catch (error) {
          console.error('Error processing Kundli PDF:', error);
        }
      }

      // Convert house map blob URLs to base64 if present
      if (formData.houseMapImages && formData.houseMapImages.length > 0) {
        try {
          const base64Images = await Promise.all(
            formData.houseMapImages.map(async (imageUrl) => {
              try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const reader = new FileReader();

                return await new Promise((resolve, reject) => {
                  reader.onloadend = () => resolve(reader.result);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });
              } catch (error) {
                console.error('Error converting image to base64:', error);
                return null;
              }
            })
          );

          // Filter out failed conversions
          formData.houseMapImages = base64Images.filter(img => img !== null);
        } catch (error) {
          console.error('Error converting images to base64:', error);
          delete formData.houseMapImages;
        }
      }

      await apiService.generateReport(reportType, formData, customFilename);
      setMessage({ type: 'success', text: 'Report generated successfully!' });
      reset();
      setPreviewData(null);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to generate report. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const onClosePreview = () => {
    setShowPreview(false);
  };

  return (
    <div className={`report-form ${darkTheme ? 'dark-theme' : ''}`}>
      {/* Kundli PDF Upload Button */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label
          htmlFor="kundliUpload"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          📄 Upload Kundli PDF
        </label>
        <input
          id="kundliUpload"
          type="file"
          accept="application/pdf"
          onChange={handleKundliUpload}
          style={{ display: 'none' }}
        />
        {kundliPdf && (
          <>
            <button
              type="button"
              onClick={() => setShowKundliViewer(true)}
              style={{
                marginLeft: '10px',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              👁️ View Kundli
            </button>
            <button
              type="button"
              onClick={() => {
                setKundliPdf(null);
                setShowKundliViewer(false);
                setKundliZoom(1);
                // Reset file input
                const fileInput = document.getElementById('kundliUpload');
                if (fileInput) fileInput.value = '';
              }}
              style={{
                marginLeft: '10px',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
              title="Remove Kundli"
            >
              🗑️ Remove
            </button>
          </>
        )}
      </div>

      {/* Kundli PDF Viewer Modal */}
      {showKundliViewer && kundliPdf && (
        <div
          style={{
            position: 'fixed',
            left: `${kundliPosition.x}px`,
            top: `${kundliPosition.y}px`,
            width: `${kundliSize.width}px`,
            height: `${kundliSize.height}px`,
            backgroundColor: 'white',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            borderRadius: '12px',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            touchAction: 'none',
            userSelect: 'none'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Header */}
          <div
            className="kundli-header"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              color: 'white',
              padding: window.innerWidth <= 768 ? '16px' : '12px 16px',
              cursor: 'move',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              userSelect: 'none',
              touchAction: 'none',
              minHeight: window.innerWidth <= 768 ? '50px' : 'auto'
            }}
          >
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Kundli PDF</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setKundliZoom(Math.max(0.5, kundliZoom - 0.1))}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                -
              </button>
              <span style={{ fontSize: '14px' }}>{Math.round(kundliZoom * 100)}%</span>
              <button
                type="button"
                onClick={() => setKundliZoom(Math.min(2, kundliZoom + 0.1))}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setShowKundliViewer(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  marginLeft: '10px'
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* PDF Content */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              padding: '10px',
              backgroundColor: '#f3f4f6',
              position: 'relative'
            }}
          >
            <iframe
              src={kundliPdf}
              style={{
                width: `${100 / kundliZoom}%`,
                height: `${100 / kundliZoom}%`,
                transform: `scale(${kundliZoom})`,
                transformOrigin: 'top left',
                border: 'none'
              }}
              title="Kundli PDF"
            />

            {/* Resize Handle */}
            <div
              onMouseDown={handleResizeMouseDown}
              onTouchStart={handleResizeTouchStart}
              className="kundli-resize-handle"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: window.innerWidth <= 768 ? '40px' : '20px',
                height: window.innerWidth <= 768 ? '40px' : '20px',
                cursor: 'nwse-resize',
                background: 'linear-gradient(135deg, transparent 50%, #1e3a8a 50%)',
                borderBottomRightRadius: '12px',
                touchAction: 'none'
              }}
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onPreview)}>
        {/* ABOUT THE CLIENT */}
        <div className="form-section">
          <h2>About the Client</h2>

          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              placeholder="Enter client name"
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth', { required: 'Date of birth is required' })}
              />
              {errors.dateOfBirth && <span className="error">{errors.dateOfBirth.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="timeOfBirth">Time of Birth *</label>
              <input
                id="timeOfBirth"
                type="time"
                {...register('timeOfBirth', { required: 'Time of birth is required' })}
              />
              {errors.timeOfBirth && <span className="error">{errors.timeOfBirth.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="placeOfBirth">Place of Birth *</label>
            <input
              id="placeOfBirth"
              type="text"
              {...register('placeOfBirth', { required: 'Place of birth is required' })}
              placeholder="City, State, Country"
            />
            {errors.placeOfBirth && <span className="error">{errors.placeOfBirth.message}</span>}
          </div>
        </div>

        {/* VASTU ANALYSIS */}
        <div className="form-section">
          <h2>Vastu Analysis</h2>

          <div className="form-group">
            <label htmlFor="mapOfHouse">Map of the House</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={handleMapUpload}
                style={{ display: 'none' }}
                id="mapUpload"
              />
              <label
                htmlFor="mapUpload"
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #4169e1 0%, #1e3a8a 100%)',
                  color: 'white',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  display: 'inline-block'
                }}
              >
                📁 Upload House Map{houseMaps.length > 0 ? 's' : ''} ({houseMaps.length})
              </label>
              {houseMaps.length > 0 && (
                <button
                  type="button"
                  onClick={() => setHouseMaps([])}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: 'none'
                  }}
                >
                  🗑️ Remove All
                </button>
              )}
            </div>
            {houseMaps.length > 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                marginBottom: '10px'
              }}>
                {houseMaps.map((map, index) => (
                  <div key={index} style={{
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '15px',
                    backgroundColor: '#f9fafb'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}>
                      <h4 style={{ margin: 0, color: '#374151' }}>Map {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeHouseMap(index)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                        title="Remove this map"
                      >
                        🗑️ Remove
                      </button>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '15px'
                    }}>
                      <div>
                        <img
                          src={map.url}
                          alt={`House Map ${index + 1}`}
                          onClick={() => setViewingMap(map.url)}
                          style={{
                            width: '100%',
                            maxHeight: '300px',
                            objectFit: 'contain',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            cursor: 'pointer'
                          }}
                          title="Click to view full size"
                        />
                        <div style={{
                          marginTop: '8px',
                          fontSize: '12px',
                          color: '#6b7280',
                          textAlign: 'center',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {map.name}
                        </div>
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '10px',
                          fontWeight: '600',
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          Room Directions
                        </label>
                        <div style={{
                          maxHeight: '300px',
                          overflowY: 'auto',
                          padding: '10px',
                          backgroundColor: 'white',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db'
                        }}>
                          {Object.keys(map.rooms).map((roomName) => (
                            <div key={roomName} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '8px 0',
                              borderBottom: '1px solid #f3f4f6'
                            }}>
                              <label style={{
                                fontSize: '13px',
                                color: '#4b5563',
                                flex: 1
                              }}>
                                {roomName}:
                              </label>
                              <select
                                value={map.rooms[roomName]}
                                onChange={(e) => updateRoomDirection(index, roomName, e.target.value)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  border: '1px solid #d1d5db',
                                  fontSize: '13px',
                                  minWidth: '120px',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="">Not specified</option>
                                <option value="North">North</option>
                                <option value="North-North-East">North-North-East</option>
                                <option value="North-East">North-East</option>
                                <option value="East-North-East">East-North-East</option>
                                <option value="East">East</option>
                                <option value="East-South-East">East-South-East</option>
                                <option value="South-East">South-East</option>
                                <option value="South-South-East">South-South-East</option>
                                <option value="South">South</option>
                                <option value="South-South-West">South-South-West</option>
                                <option value="South-West">South-West</option>
                                <option value="West-South-West">West-South-West</option>
                                <option value="West">West</option>
                                <option value="West-North-West">West-North-West</option>
                                <option value="North-West">North-West</option>
                                <option value="North-North-West">North-North-West</option>
                                <option value="Center">Center</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <textarea
              id="mapOfHouse"
              {...register('mapOfHouse')}
              placeholder="Describe house layout or upload details"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="vastuRemedies">Remedies</label>
            <textarea
              id="vastuRemedies"
              {...register('vastuRemedies')}
              placeholder="List vastu remedies"
              rows="4"
            />
          </div>
        </div>

        {/* ASTROLOGY */}
        <div className="form-section">
          <h2>Astrology</h2>

          {/* MAHADASHA */}
          <div className="dasha-group">
            <label className="dasha-label">Mahadasha</label>
            <div className="dasha-fields">
              <div className="dasha-field">
                <label htmlFor="mahadasha_planet">Planet</label>
                <select id="mahadasha_planet" {...register('mahadasha_planet')}>
                  <option value="">Select Planet</option>
                  <option value="Ketu">Ketu</option>
                  <option value="Venus">Venus</option>
                  <option value="Sun">Sun</option>
                  <option value="Moon">Moon</option>
                  <option value="Rahu">Rahu</option>
                  <option value="Mars">Mars</option>
                  <option value="Jupiter">Jupiter</option>
                  <option value="Saturn">Saturn</option>
                  <option value="Mercury">Mercury</option>
                </select>
              </div>
              <div className="dasha-field">
                <label htmlFor="mahadasha_no_star">
                  <input
                    id="mahadasha_no_star"
                    type="checkbox"
                    checked={mahadashaNoStar}
                    onChange={(e) => setMahadashaNoStar(e.target.checked)}
                    style={{ width: 'auto', marginRight: '5px' }}
                  />
                  No Star
                </label>
              </div>
              <div className="dasha-field">
                <label htmlFor="mahadasha_source">Source</label>
                <input id="mahadasha_source" type="text" {...register('mahadasha_source')} placeholder="Source" />
              </div>
              <div className="dasha-field">
                <label htmlFor="mahadasha_nl">NL</label>
                <select id="mahadasha_nl" {...register('mahadasha_nl')}>
                  <option value="">Select Planet</option>
                  <option value="Ketu">Ketu</option>
                  <option value="Venus">Venus</option>
                  <option value="Sun">Sun</option>
                  <option value="Moon">Moon</option>
                  <option value="Rahu">Rahu</option>
                  <option value="Mars">Mars</option>
                  <option value="Jupiter">Jupiter</option>
                  <option value="Saturn">Saturn</option>
                  <option value="Mercury">Mercury</option>
                </select>
              </div>
              <div className="dasha-field">
                <label htmlFor="mahadasha_nl_source">Source</label>
                <input id="mahadasha_nl_source" type="text" {...register('mahadasha_nl_source')} placeholder="Source" />
              </div>
              <div className="dasha-field">
                <label htmlFor="mahadasha_additional_house">Additional House</label>
                <input id="mahadasha_additional_house" type="text" {...register('mahadasha_additional_house')} placeholder="Additional House" />
              </div>
              <div className="dasha-field">
                <label htmlFor="mahadasha_sl">SL</label>
                <select id="mahadasha_sl" {...register('mahadasha_sl')}>
                  <option value="">Select Planet</option>
                  <option value="Ketu">Ketu</option>
                  <option value="Venus">Venus</option>
                  <option value="Sun">Sun</option>
                  <option value="Moon">Moon</option>
                  <option value="Rahu">Rahu</option>
                  <option value="Mars">Mars</option>
                  <option value="Jupiter">Jupiter</option>
                  <option value="Saturn">Saturn</option>
                  <option value="Mercury">Mercury</option>
                </select>
              </div>
              <div className="dasha-field">
                <label htmlFor="mahadasha_sl_source">Source</label>
                <input id="mahadasha_sl_source" type="text" {...register('mahadasha_sl_source')} placeholder="Source" />
              </div>
            </div>
          </div>

          {/* ANTARDASHA */}
          <div className="dasha-group">
            <label className="dasha-label">Antardasha</label>
            <div className="dasha-fields">
              <div className="dasha-field">
                <label htmlFor="antardasha_planet">Planet</label>
                <select id="antardasha_planet" {...register('antardasha_planet')}>
                  <option value="">Select Planet</option>
                  <option value="Ketu">Ketu</option>
                  <option value="Venus">Venus</option>
                  <option value="Sun">Sun</option>
                  <option value="Moon">Moon</option>
                  <option value="Rahu">Rahu</option>
                  <option value="Mars">Mars</option>
                  <option value="Jupiter">Jupiter</option>
                  <option value="Saturn">Saturn</option>
                  <option value="Mercury">Mercury</option>
                </select>
              </div>
              <div className="dasha-field">
                <label htmlFor="antardasha_no_star">
                  <input
                    id="antardasha_no_star"
                    type="checkbox"
                    checked={antardashaNoStar}
                    onChange={(e) => setAntardashaNoStar(e.target.checked)}
                    style={{ width: 'auto', marginRight: '5px' }}
                  />
                  No Star
                </label>
              </div>
              <div className="dasha-field">
                <label htmlFor="antardasha_source">Source</label>
                <input id="antardasha_source" type="text" {...register('antardasha_source')} placeholder="Source" />
              </div>
              <div className="dasha-field">
                <label htmlFor="antardasha_nl">NL</label>
                <select id="antardasha_nl" {...register('antardasha_nl')}>
                  <option value="">Select Planet</option>
                  <option value="Ketu">Ketu</option>
                  <option value="Venus">Venus</option>
                  <option value="Sun">Sun</option>
                  <option value="Moon">Moon</option>
                  <option value="Rahu">Rahu</option>
                  <option value="Mars">Mars</option>
                  <option value="Jupiter">Jupiter</option>
                  <option value="Saturn">Saturn</option>
                  <option value="Mercury">Mercury</option>
                </select>
              </div>
              <div className="dasha-field">
                <label htmlFor="antardasha_nl_source">Source</label>
                <input id="antardasha_nl_source" type="text" {...register('antardasha_nl_source')} placeholder="Source" />
              </div>
              <div className="dasha-field">
                <label htmlFor="antardasha_additional_house">Additional House</label>
                <input id="antardasha_additional_house" type="text" {...register('antardasha_additional_house')} placeholder="Additional House" />
              </div>
              <div className="dasha-field">
                <label htmlFor="antardasha_sl">SL</label>
                <select id="antardasha_sl" {...register('antardasha_sl')}>
                  <option value="">Select Planet</option>
                  <option value="Ketu">Ketu</option>
                  <option value="Venus">Venus</option>
                  <option value="Sun">Sun</option>
                  <option value="Moon">Moon</option>
                  <option value="Rahu">Rahu</option>
                  <option value="Mars">Mars</option>
                  <option value="Jupiter">Jupiter</option>
                  <option value="Saturn">Saturn</option>
                  <option value="Mercury">Mercury</option>
                </select>
              </div>
              <div className="dasha-field">
                <label htmlFor="antardasha_sl_source">Source</label>
                <input id="antardasha_sl_source" type="text" {...register('antardasha_sl_source')} placeholder="Source" />
              </div>
            </div>
          </div>

          {/* PRATYANTARDASHA */}
          <div className="dasha-group">
            <label className="dasha-label">Pratyantar Dasha</label>
            <div className="dasha-fields">
              <div className="dasha-field">
                <label htmlFor="pratyantardasha_planet">Planet</label>
                <select id="pratyantardasha_planet" {...register('pratyantardasha_planet')}>
                  <option value="">Select Planet</option>
                  <option value="Ketu">Ketu</option>
                  <option value="Venus">Venus</option>
                  <option value="Sun">Sun</option>
                  <option value="Moon">Moon</option>
                  <option value="Rahu">Rahu</option>
                  <option value="Mars">Mars</option>
                  <option value="Jupiter">Jupiter</option>
                  <option value="Saturn">Saturn</option>
                  <option value="Mercury">Mercury</option>
                </select>
              </div>
              <div className="dasha-field">
                <label htmlFor="pratyantardasha_no_star">
                  <input
                    id="pratyantardasha_no_star"
                    type="checkbox"
                    checked={pratyantardashaNoStar}
                    onChange={(e) => setPratyantardashaNoStar(e.target.checked)}
                    style={{ width: 'auto', marginRight: '5px' }}
                  />
                  No Star
                </label>
              </div>
              <div className="dasha-field">
                <label htmlFor="pratyantardasha_source">Source</label>
                <input id="pratyantardasha_source" type="text" {...register('pratyantardasha_source')} placeholder="Source" />
              </div>
              <div className="dasha-field">
                <label htmlFor="pratyantardasha_nl">NL</label>
                <select id="pratyantardasha_nl" {...register('pratyantardasha_nl')}>
                  <option value="">Select Planet</option>
                  <option value="Ketu">Ketu</option>
                  <option value="Venus">Venus</option>
                  <option value="Sun">Sun</option>
                  <option value="Moon">Moon</option>
                  <option value="Rahu">Rahu</option>
                  <option value="Mars">Mars</option>
                  <option value="Jupiter">Jupiter</option>
                  <option value="Saturn">Saturn</option>
                  <option value="Mercury">Mercury</option>
                </select>
              </div>
              <div className="dasha-field">
                <label htmlFor="pratyantardasha_nl_source">Source</label>
                <input id="pratyantardasha_nl_source" type="text" {...register('pratyantardasha_nl_source')} placeholder="Source" />
              </div>
              <div className="dasha-field">
                <label htmlFor="pratyantardasha_additional_house">Additional House</label>
                <input id="pratyantardasha_additional_house" type="text" {...register('pratyantardasha_additional_house')} placeholder="Additional House" />
              </div>
              <div className="dasha-field">
                <label htmlFor="pratyantardasha_sl">SL</label>
                <select id="pratyantardasha_sl" {...register('pratyantardasha_sl')}>
                  <option value="">Select Planet</option>
                  <option value="Ketu">Ketu</option>
                  <option value="Venus">Venus</option>
                  <option value="Sun">Sun</option>
                  <option value="Moon">Moon</option>
                  <option value="Rahu">Rahu</option>
                  <option value="Mars">Mars</option>
                  <option value="Jupiter">Jupiter</option>
                  <option value="Saturn">Saturn</option>
                  <option value="Mercury">Mercury</option>
                </select>
              </div>
              <div className="dasha-field">
                <label htmlFor="pratyantardasha_sl_source">Source</label>
                <input id="pratyantardasha_sl_source" type="text" {...register('pratyantardasha_sl_source')} placeholder="Source" />
              </div>
            </div>

            {/* Period Date Range */}
            <div className="period-group">
              <label className="period-label">Period</label>
              <div className="period-dates">
                <div className="period-field">
                  <label htmlFor="pratyantardasha_period_from">From</label>
                  <input id="pratyantardasha_period_from" type="date" {...register('pratyantardasha_period_from')} />
                </div>
                <div className="period-field">
                  <label htmlFor="pratyantardasha_period_to">To</label>
                  <input id="pratyantardasha_period_to" type="date" {...register('pratyantardasha_period_to')} />
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="donationsToDo">Donations to Do</label>
            <textarea
              id="donationsToDo"
              {...register('donationsToDo')}
              placeholder="Auto-suggested based on sources with 8"
              rows="6"
            />
            <span className="help-text">💡 Includes day, items & beneficiaries - Auto-filled when source contains 8</span>
          </div>

          <div className="form-group">
            <label htmlFor="donationsToWhom">Donations - To Whom</label>
            <textarea
              id="donationsToWhom"
              {...register('donationsToWhom')}
              placeholder="Auto-suggested beneficiaries"
              rows="4"
            />
            <span className="help-text">💡 Auto-filled with beneficiaries for planets with source containing 8</span>
          </div>

          <div className="form-group">
            <label htmlFor="gemstone_planet">Gemstones - Select Planet</label>
            <select id="gemstone_planet" {...register('gemstone_planet')}>
              <option value="">Select Planet</option>
              <option value="Sun">Sun</option>
              <option value="Moon">Moon</option>
              <option value="Mars">Mars</option>
              <option value="Mercury">Mercury</option>
              <option value="Jupiter">Jupiter</option>
              <option value="Venus">Venus</option>
              <option value="Saturn">Saturn</option>
              <option value="Rahu">Rahu</option>
              <option value="Ketu">Ketu</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="gemstones">Recommended Gemstone</label>
            <input
              id="gemstones"
              type="text"
              {...register('gemstones')}
              placeholder="Select a planet above to see gemstone"
              readOnly
            />
            <span className="help-text">💎 Auto-filled when you select a planet above</span>
          </div>

          <div className="form-group">
            <label htmlFor="mantra_planet">Mantra to Make Situation Positive - Select Planet</label>
            <select id="mantra_planet" {...register('mantra_planet')}>
              <option value="">Select Planet</option>
              <option value="Sun">Sun</option>
              <option value="Moon">Moon</option>
              <option value="Mars">Mars</option>
              <option value="Mercury">Mercury</option>
              <option value="Jupiter">Jupiter</option>
              <option value="Venus">Venus</option>
              <option value="Saturn">Saturn</option>
              <option value="Rahu">Rahu</option>
              <option value="Ketu">Ketu</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="mantra">Recommended Mantra</label>
            <textarea
              id="mantra"
              {...register('mantra')}
              placeholder="Select a planet above to see deity and mantra"
              rows="3"
              readOnly
            />
            <span className="help-text">🕉️ Auto-filled with deity and mantra when you select a planet above</span>
          </div>

          <div className="form-group">
            <label htmlFor="birthNakshatra">Your Birth Nakshatra</label>
            <input
              id="birthNakshatra"
              type="text"
              {...register('birthNakshatra')}
              placeholder="Start typing nakshatra name..."
              list="nakshatra-list"
            />
            <datalist id="nakshatra-list">
              <option value="Ashwani" />
              <option value="Bharani" />
              <option value="Krittika" />
              <option value="Rohini" />
              <option value="Mrigashira" />
              <option value="Ardra" />
              <option value="Punarvasu" />
              <option value="Pushya" />
              <option value="Ashlesha" />
              <option value="Magha" />
              <option value="Purva Phalguni" />
              <option value="Uttara Phalguni" />
              <option value="Hasta" />
              <option value="Chitra" />
              <option value="Swati" />
              <option value="Vishakha" />
              <option value="Anuradha" />
              <option value="Jyeshtha" />
              <option value="Mula" />
              <option value="Purva Ashadha" />
              <option value="Uttara Ashadha" />
              <option value="Shravana" />
              <option value="Dhanishta" />
              <option value="Shatabhisha" />
              <option value="Purva Bhadrapada" />
              <option value="Uttara Bhadrapada" />
              <option value="Revati" />
            </datalist>
            <span className="help-text">⭐ Select a nakshatra to auto-fill symbol fields below</span>
          </div>

          <div className="form-group">
            <label htmlFor="mobileDisplayPicture">Beneficial Mobile Display Picture</label>
            <textarea
              id="mobileDisplayPicture"
              {...register('mobileDisplayPicture')}
              placeholder="Suggested mobile wallpaper symbols"
              rows="3"
            />
            <span className="help-text">📱 Auto-filled when nakshatra is selected</span>
          </div>

          <div className="form-group">
            <label htmlFor="beneficialSymbols">Most Beneficial Symbols</label>
            <textarea
              id="beneficialSymbols"
              {...register('beneficialSymbols')}
              placeholder="Lucky symbols"
              rows="3"
            />
            <span className="help-text">✨ Auto-filled when nakshatra is selected</span>
          </div>

          <div className="form-group">
            <label htmlFor="nakshatraProsperitySymbols">Prosperity Giving Symbols</label>
            <textarea
              id="nakshatraProsperitySymbols"
              {...register('nakshatraProsperitySymbols')}
              placeholder="Symbols for prosperity and wealth"
              rows="3"
            />
            <span className="help-text">💰 Auto-filled when nakshatra is selected</span>
          </div>

          <div className="form-group">
            <label htmlFor="nakshatraMentalPhysicalWellbeing">Mental/Physical Wellbeing Symbols</label>
            <textarea
              id="nakshatraMentalPhysicalWellbeing"
              {...register('nakshatraMentalPhysicalWellbeing')}
              placeholder="Symbols for health and wellbeing"
              rows="3"
            />
            <span className="help-text">🧘 Auto-filled when nakshatra is selected</span>
          </div>

          <div className="form-group">
            <label htmlFor="nakshatraAccomplishments">Accomplishment/Achievement Symbols</label>
            <textarea
              id="nakshatraAccomplishments"
              {...register('nakshatraAccomplishments')}
              placeholder="Symbols for success and achievements"
              rows="3"
            />
            <span className="help-text">🏆 Auto-filled when nakshatra is selected</span>
          </div>

          <div className="form-group">
            <label htmlFor="nakshatraAvoidSymbols">Symbols to Avoid</label>
            <textarea
              id="nakshatraAvoidSymbols"
              {...register('nakshatraAvoidSymbols')}
              placeholder="Symbols that should be avoided"
              rows="5"
            />
            <span className="help-text">⚠️ Auto-filled when nakshatra is selected</span>
          </div>
        </div>

        {/* ASTRO VASTU SOLUTION */}
        <div className="form-section">
          <h2>Astro Vastu Solution</h2>

          <div className="form-group">
            <button
              type="button"
              onClick={() => setShowAspectsModal(true)}
              className="aspects-modal-btn"
            >
              Aspects
            </button>
          </div>

          {/* Display configured aspects */}
          {(aspectsOnHouses.some(a => a.planet && a.aspects.some(asp => asp.houses.some(h => h) && asp.degree)) ||
            aspectsOnPlanets.some(a => a.planet && a.aspects.some(asp => asp.planets.some(p => p) && asp.degree))) && (
            <div className="form-group aspects-display">
              {aspectsOnHouses.some(a => a.planet && a.aspects.some(asp => asp.houses.some(h => h) && asp.degree)) && (
                <div className="aspects-display-section">
                  <h4>Aspects on Houses:</h4>
                  <div className="aspects-display-content">
                    {aspectsOnHouses
                      .filter(aspect => aspect.planet && aspect.aspects.some(a => a.houses.some(h => h) && a.degree))
                      .map((aspect, idx) => {
                        const parts = aspect.aspects
                          .filter(a => a.houses.some(h => h) && a.degree)
                          .map(a => {
                            const validHouses = a.houses.filter(h => h);
                            const houseList = validHouses.map(h => `${h}${getOrdinalSuffix(h)}`).join(' and ');
                            return `${validHouses.length > 1 ? 'Houses ' : 'House '}${houseList} at ${a.degree}`;
                          });
                        return <div key={idx}>{aspect.planet} hits {parts.join(' and ')}</div>;
                      })}
                  </div>
                </div>
              )}
              {aspectsOnPlanets.some(a => a.planet && a.aspects.some(asp => asp.planets.some(p => p) && asp.degree)) && (
                <div className="aspects-display-section">
                  <h4>Aspects on Planets:</h4>
                  <div className="aspects-display-content">
                    {aspectsOnPlanets
                      .filter(aspect => aspect.planet && aspect.aspects.some(a => a.planets.some(p => p) && a.degree))
                      .map((aspect, idx) => {
                        const parts = aspect.aspects
                          .filter(a => a.planets.some(p => p) && a.degree)
                          .map(a => {
                            const validPlanets = a.planets.filter(p => p);
                            const planetList = validPlanets.join(' and ');
                            return `${validPlanets.length > 1 ? 'Planets ' : 'Planet '}${planetList} at ${a.degree}`;
                          });
                        return <div key={idx}>{aspect.planet} hits {parts.join(' and ')}</div>;
                      })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label>What to Remove from Which Directions</label>
            {removalItems.map((item, index) => (
              <div key={index} className="removal-item-row">
                <span className="removal-label">Remove</span>
                <input
                  type="text"
                  value={item.planet}
                  readOnly
                  className="removal-planet-input"
                  placeholder="Select planet in Aspects"
                />
                <span className="removal-label">from</span>
                {item.directions.map((direction, dirIndex) => (
                  <React.Fragment key={dirIndex}>
                    <select
                      value={direction}
                      onChange={(e) => {
                        const newItems = [...removalItems];
                        newItems[index].directions[dirIndex] = e.target.value;
                        setRemovalItems(newItems);
                      }}
                      className="removal-direction-select"
                    >
                      <option value="">Select Direction</option>
                      <option value="East">East (Aries)</option>
                      <option value="North-West">North-West (Taurus)</option>
                      <option value="North-North-West">North-North-West (Gemini)</option>
                      <option value="North-North-East">North-North-East (Cancer)</option>
                      <option value="East-North-East">East-North-East (Leo)</option>
                      <option value="North">North (Virgo)</option>
                      <option value="West-South-West">West-South-West (Libra)</option>
                      <option value="South-South-West">South-South-West (Scorpio)</option>
                      <option value="North-East">North-East (Sagittarius)</option>
                      <option value="South">South (Capricorn)</option>
                      <option value="West">West (Aquarius)</option>
                      <option value="South-East">South-East (Pisces)</option>
                    </select>
                    {dirIndex < item.directions.length - 1 && (
                      <span className="removal-label">and</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>What to Place in Which Directions</label>
            {placementItems.map((item, index) => (
              <div key={index} className="removal-item-row">
                <span className="removal-label">Place</span>
                <input
                  type="text"
                  value={item.planet}
                  readOnly
                  className="removal-planet-input"
                  placeholder="Select planet in Aspects"
                />
                <span className="removal-label">in</span>
                <select
                  value={item.direction}
                  onChange={(e) => {
                    const newItems = [...placementItems];
                    newItems[index].direction = e.target.value;
                    setPlacementItems(newItems);
                  }}
                  className="removal-direction-select"
                >
                  <option value="">Select Direction</option>
                  <option value="East">East (Aries)</option>
                  <option value="North-West">North-West (Taurus)</option>
                  <option value="North-North-West">North-North-West (Gemini)</option>
                  <option value="North-North-East">North-North-East (Cancer)</option>
                  <option value="East-North-East">East-North-East (Leo)</option>
                  <option value="North">North (Virgo)</option>
                  <option value="West-South-West">West-South-West (Libra)</option>
                  <option value="South-South-West">South-South-West (Scorpio)</option>
                  <option value="North-East">North-East (Sagittarius)</option>
                  <option value="South">South (Capricorn)</option>
                  <option value="West">West (Aquarius)</option>
                  <option value="South-East">South-East (Pisces)</option>
                </select>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label htmlFor="colorObjectsToUse">What Color or Objects to Use on Body (Auto-generated from placements)</label>
            <textarea
              id="colorObjectsToUse"
              {...register('colorObjectsToUse')}
              placeholder="Select planets and directions in 'What to Place' section above..."
              rows="5"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="colorObjectsNotToUse">What Color or Objects NOT to Use on Body (Auto-generated from removals)</label>
            <textarea
              id="colorObjectsNotToUse"
              {...register('colorObjectsNotToUse')}
              placeholder="Select planets and directions in 'What to Remove' section above..."
              rows="5"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lockerLocation">Most Favorable Location of Locker</label>
            <select
              id="lockerLocation"
              {...register('lockerLocation')}
            >
              <option value="">Select Direction</option>
              <option value="East">East (Aries)</option>
              <option value="North-West">North-West (Taurus)</option>
              <option value="North-North-West">North-North-West (Gemini)</option>
              <option value="North-North-East">North-North-East (Cancer)</option>
              <option value="East-North-East">East-North-East (Leo)</option>
              <option value="North">North (Virgo)</option>
              <option value="West-South-West">West-South-West (Libra)</option>
              <option value="South-South-West">South-South-West (Scorpio)</option>
              <option value="North-East">North-East (Sagittarius)</option>
              <option value="South">South (Capricorn)</option>
              <option value="West">West (Aquarius)</option>
              <option value="South-East">South-East (Pisces)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="laughingBuddhaDirection">Placement of Laughing Buddha/Vision Board - Direction</label>
            <select
              id="laughingBuddhaDirection"
              {...register('laughingBuddhaDirection')}
            >
              <option value="">Select Direction</option>
              <option value="East">East (Aries)</option>
              <option value="North-West">North-West (Taurus)</option>
              <option value="North-North-West">North-North-West (Gemini)</option>
              <option value="North-North-East">North-North-East (Cancer)</option>
              <option value="East-North-East">East-North-East (Leo)</option>
              <option value="North">North (Virgo)</option>
              <option value="West-South-West">West-South-West (Libra)</option>
              <option value="South-South-West">South-South-West (Scorpio)</option>
              <option value="North-East">North-East (Sagittarius)</option>
              <option value="South">South (Capricorn)</option>
              <option value="West">West (Aquarius)</option>
              <option value="South-East">South-East (Pisces)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="wishListInkColor">Color of Ink to Write Wish List</label>
            <input
              id="wishListInkColor"
              type="text"
              {...register('wishListInkColor')}
              placeholder="Ink color for wish list"
            />
          </div>
        </div>

        {/* Aspects Modal */}
        {showAspectsModal && (
          <div className="aspects-modal-overlay" onClick={() => setShowAspectsModal(false)}>
            <div className="aspects-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="aspects-modal-header">
                <h2>Aspects Configuration</h2>
                <button
                  type="button"
                  onClick={() => setShowAspectsModal(false)}
                  className="aspects-modal-close"
                >
                  ×
                </button>
              </div>

              <div className="aspects-modal-body">
                <div className="aspects-modal-section">
                  <h3>Aspects on Houses</h3>
                  {aspectsOnHouses.map((aspect, aspectIndex) => (
                <div key={aspectIndex} className="aspect-container">
                  <div className="aspect-row">
                    <select
                      value={aspect.planet}
                      onChange={(e) => {
                        const newAspects = [...aspectsOnHouses];
                        newAspects[aspectIndex].planet = e.target.value;
                        setAspectsOnHouses(newAspects);
                      }}
                      className="aspect-select"
                    >
                      <option value="">Planet</option>
                      <option value="Sun">Sun</option>
                      <option value="Moon">Moon</option>
                      <option value="Mars">Mars</option>
                      <option value="Mercury">Mercury</option>
                      <option value="Jupiter">Jupiter</option>
                      <option value="Venus">Venus</option>
                      <option value="Saturn">Saturn</option>
                      <option value="Rahu">Rahu</option>
                      <option value="Ketu">Ketu</option>
                    </select>

                    <span className="aspect-label">hits</span>

                    {aspect.aspects.map((aspectItem, aspectItemIndex) => (
                      <React.Fragment key={aspectItemIndex}>
                        {aspectItemIndex > 0 && <span className="aspect-label">and</span>}

                        {aspectItem.houses.map((house, houseIndex) => (
                          <React.Fragment key={houseIndex}>
                            {houseIndex > 0 && <span className="aspect-label">&</span>}

                            <select
                              value={house}
                              onChange={(e) => {
                                const newAspects = [...aspectsOnHouses];
                                newAspects[aspectIndex].aspects[aspectItemIndex].houses[houseIndex] = e.target.value;
                                setAspectsOnHouses(newAspects);
                              }}
                              className="aspect-select aspect-select-small"
                            >
                              <option value="">H</option>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>

                            {houseIndex === aspectItem.houses.length - 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newAspects = [...aspectsOnHouses];
                                  newAspects[aspectIndex].aspects[aspectItemIndex].houses.push('');
                                  setAspectsOnHouses(newAspects);
                                }}
                                className="aspect-btn aspect-btn-tiny"
                                title="Add house at same degree"
                              >
                                +
                              </button>
                            )}

                            {aspectItem.houses.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newAspects = [...aspectsOnHouses];
                                  newAspects[aspectIndex].aspects[aspectItemIndex].houses =
                                    newAspects[aspectIndex].aspects[aspectItemIndex].houses.filter((_, i) => i !== houseIndex);
                                  setAspectsOnHouses(newAspects);
                                }}
                                className="aspect-btn aspect-btn-tiny aspect-btn-remove"
                                title="Remove house"
                              >
                                −
                              </button>
                            )}
                          </React.Fragment>
                        ))}

                        <span className="aspect-label">at</span>

                        <select
                          value={aspectItem.degree}
                          onChange={(e) => {
                            const newAspects = [...aspectsOnHouses];
                            newAspects[aspectIndex].aspects[aspectItemIndex].degree = e.target.value;
                            setAspectsOnHouses(newAspects);
                          }}
                          className="aspect-select aspect-select-small"
                        >
                          <option value="">°</option>
                          <option value="90°">90°</option>
                          <option value="120°">120°</option>
                          <option value="180°">180°</option>
                        </select>

                        {aspectItemIndex === aspect.aspects.length - 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newAspects = [...aspectsOnHouses];
                              newAspects[aspectIndex].aspects.push({ houses: [''], degree: '' });
                              setAspectsOnHouses(newAspects);
                            }}
                            className="aspect-btn aspect-btn-mini"
                            title="Add different degree"
                          >
                            +
                          </button>
                        )}

                        {aspect.aspects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newAspects = [...aspectsOnHouses];
                              newAspects[aspectIndex].aspects = newAspects[aspectIndex].aspects.filter((_, i) => i !== aspectItemIndex);
                              setAspectsOnHouses(newAspects);
                            }}
                            className="aspect-btn aspect-btn-mini aspect-btn-remove"
                            title="Remove aspect"
                          >
                            −
                          </button>
                        )}
                      </React.Fragment>
                    ))}

                    {aspectIndex === aspectsOnHouses.length - 1 && (
                      <button
                        type="button"
                        onClick={() => setAspectsOnHouses([...aspectsOnHouses, { planet: '', aspects: [{ houses: [''], degree: '' }] }])}
                        className="aspect-btn"
                        title="Add new planet"
                      >
                        ⊕
                      </button>
                    )}

                    {aspectsOnHouses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newAspects = aspectsOnHouses.filter((_, i) => i !== aspectIndex);
                          setAspectsOnHouses(newAspects);
                        }}
                        className="aspect-btn aspect-btn-remove"
                        title="Remove planet"
                      >
                        ⊖
                      </button>
                    )}
                  </div>
                </div>
              ))}
                </div>

                <div className="aspects-modal-section">
                  <h3>Aspects on Planets</h3>
                  {aspectsOnPlanets.map((aspect, aspectIndex) => (
                <div key={aspectIndex} className="aspect-container">
                  <div className="aspect-row">
                    <select
                      value={aspect.planet}
                      onChange={(e) => {
                        const newAspects = [...aspectsOnPlanets];
                        newAspects[aspectIndex].planet = e.target.value;
                        setAspectsOnPlanets(newAspects);
                      }}
                      className="aspect-select"
                    >
                      <option value="">Planet</option>
                      <option value="Sun">Sun</option>
                      <option value="Moon">Moon</option>
                      <option value="Mars">Mars</option>
                      <option value="Mercury">Mercury</option>
                      <option value="Jupiter">Jupiter</option>
                      <option value="Venus">Venus</option>
                      <option value="Saturn">Saturn</option>
                      <option value="Rahu">Rahu</option>
                      <option value="Ketu">Ketu</option>
                    </select>

                    <span className="aspect-label">hits</span>

                    {aspect.aspects.map((aspectItem, aspectItemIndex) => (
                      <React.Fragment key={aspectItemIndex}>
                        {aspectItemIndex > 0 && <span className="aspect-label">and</span>}

                        {aspectItem.planets.map((planet, planetIndex) => (
                          <React.Fragment key={planetIndex}>
                            {planetIndex > 0 && <span className="aspect-label">&</span>}

                            <select
                              value={planet}
                              onChange={(e) => {
                                const newAspects = [...aspectsOnPlanets];
                                newAspects[aspectIndex].aspects[aspectItemIndex].planets[planetIndex] = e.target.value;
                                setAspectsOnPlanets(newAspects);
                              }}
                              className="aspect-select aspect-select-small"
                            >
                              <option value="">P</option>
                              <option value="Sun">Sun</option>
                              <option value="Moon">Moon</option>
                              <option value="Mars">Mars</option>
                              <option value="Mercury">Mercury</option>
                              <option value="Jupiter">Jupiter</option>
                              <option value="Venus">Venus</option>
                              <option value="Saturn">Saturn</option>
                              <option value="Rahu">Rahu</option>
                              <option value="Ketu">Ketu</option>
                            </select>

                            {planetIndex === aspectItem.planets.length - 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newAspects = [...aspectsOnPlanets];
                                  newAspects[aspectIndex].aspects[aspectItemIndex].planets.push('');
                                  setAspectsOnPlanets(newAspects);
                                }}
                                className="aspect-btn aspect-btn-tiny"
                                title="Add planet at same degree"
                              >
                                +
                              </button>
                            )}

                            {aspectItem.planets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newAspects = [...aspectsOnPlanets];
                                  newAspects[aspectIndex].aspects[aspectItemIndex].planets =
                                    newAspects[aspectIndex].aspects[aspectItemIndex].planets.filter((_, i) => i !== planetIndex);
                                  setAspectsOnPlanets(newAspects);
                                }}
                                className="aspect-btn aspect-btn-tiny aspect-btn-remove"
                                title="Remove planet"
                              >
                                −
                              </button>
                            )}
                          </React.Fragment>
                        ))}

                        <span className="aspect-label">at</span>

                        <select
                          value={aspectItem.degree}
                          onChange={(e) => {
                            const newAspects = [...aspectsOnPlanets];
                            newAspects[aspectIndex].aspects[aspectItemIndex].degree = e.target.value;
                            setAspectsOnPlanets(newAspects);
                          }}
                          className="aspect-select aspect-select-small"
                        >
                          <option value="">°</option>
                          <option value="90°">90°</option>
                          <option value="120°">120°</option>
                          <option value="180°">180°</option>
                        </select>

                        {aspectItemIndex === aspect.aspects.length - 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newAspects = [...aspectsOnPlanets];
                              newAspects[aspectIndex].aspects.push({ planets: [''], degree: '' });
                              setAspectsOnPlanets(newAspects);
                            }}
                            className="aspect-btn aspect-btn-mini"
                            title="Add different degree"
                          >
                            +
                          </button>
                        )}

                        {aspect.aspects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newAspects = [...aspectsOnPlanets];
                              newAspects[aspectIndex].aspects = newAspects[aspectIndex].aspects.filter((_, i) => i !== aspectItemIndex);
                              setAspectsOnPlanets(newAspects);
                            }}
                            className="aspect-btn aspect-btn-mini aspect-btn-remove"
                            title="Remove aspect"
                          >
                            −
                          </button>
                        )}
                      </React.Fragment>
                    ))}

                    {aspectIndex === aspectsOnPlanets.length - 1 && (
                      <button
                        type="button"
                        onClick={() => setAspectsOnPlanets([...aspectsOnPlanets, { planet: '', aspects: [{ planets: [''], degree: '' }] }])}
                        className="aspect-btn"
                        title="Add new planet"
                      >
                        ⊕
                      </button>
                    )}

                    {aspectsOnPlanets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newAspects = aspectsOnPlanets.filter((_, i) => i !== aspectIndex);
                          setAspectsOnPlanets(newAspects);
                        }}
                        className="aspect-btn aspect-btn-remove"
                        title="Remove planet"
                      >
                        ⊖
                      </button>
                    )}
                  </div>
                </div>
              ))}
                </div>
              </div>

              <div className="aspects-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAspectsModal(false)}
                  className="aspects-modal-done-btn"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GUIDELINES */}
        <div className="form-section">
          <h2>Guidelines</h2>

          <div className="form-group">
            <label htmlFor="neverCriticize">To Whom You Should Never Criticize or Judge</label>
            <input
              id="neverCriticize"
              type="text"
              {...register('neverCriticize')}
              placeholder="People to avoid criticizing"
            />
          </div>

          <div className="form-group">
            <label htmlFor="importantBooks">Important Books to Read to Uplift Your Life (Auto-generated from Mahadasha & Antardasha)</label>
            <textarea
              id="importantBooks"
              {...register('importantBooks')}
              placeholder="Select Mahadasha and Antardasha planets above..."
              rows="8"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="giftsToGivePlanet">Gifts - To Give - Select Planet</label>
            <select
              id="giftsToGivePlanet"
              {...register('giftsToGivePlanet')}
            >
              <option value="">Select Planet</option>
              <option value="Sun">Sun</option>
              <option value="Moon">Moon</option>
              <option value="Mars">Mars</option>
              <option value="Mercury">Mercury</option>
              <option value="Jupiter">Jupiter</option>
              <option value="Venus">Venus</option>
              <option value="Saturn">Saturn</option>
              <option value="Rahu">Rahu</option>
              <option value="Ketu">Ketu</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="giftsToGive">Gifts - To Give (Auto-generated)</label>
            <textarea
              id="giftsToGive"
              {...register('giftsToGive')}
              placeholder="Select planet above..."
              rows="5"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="giftsToReceivePlanet">Gifts - To Receive - Select Planet</label>
            <select
              id="giftsToReceivePlanet"
              {...register('giftsToReceivePlanet')}
            >
              <option value="">Select Planet</option>
              <option value="Sun">Sun</option>
              <option value="Moon">Moon</option>
              <option value="Mars">Mars</option>
              <option value="Mercury">Mercury</option>
              <option value="Jupiter">Jupiter</option>
              <option value="Venus">Venus</option>
              <option value="Saturn">Saturn</option>
              <option value="Rahu">Rahu</option>
              <option value="Ketu">Ketu</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="giftsToReceive">Gifts - To Receive (Auto-generated)</label>
            <textarea
              id="giftsToReceive"
              {...register('giftsToReceive')}
              placeholder="Select planet above..."
              rows="5"
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        {/* BHRIGUNANDA NADI */}
        <div className="form-section">
          <h2>Bhrigunanda Nadi</h2>

          <div className="form-group">
            <label>Saturn Relation</label>
            <input type="hidden" {...register('saturnRelation')} />
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
              <span style={{ fontWeight: 'bold' }}>SA</span>
              {saturnRelationPlanets.map((item, index) => {
                // Normalize item to object format (handle legacy string format)
                const normalizedItem = typeof item === 'string'
                  ? { planet: item, hasBTag: false }
                  : item;

                return (
                  <React.Fragment key={index}>
                    <span style={{ fontWeight: 'bold' }}>-</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <select
                        value={normalizedItem.planet}
                        onChange={(e) => {
                          const newPlanets = [...saturnRelationPlanets].map((p, i) => {
                            if (i === index) {
                              return { planet: e.target.value, hasBTag: normalizedItem.hasBTag };
                            }
                            return typeof p === 'string' ? { planet: p, hasBTag: false } : p;
                          });
                          setSaturnRelationPlanets(newPlanets);
                        }}
                        style={{ width: '80px', padding: '2px' }}
                      >
                        <option value="">+</option>
                        <option value="SU">SU</option>
                        <option value="MO">MO</option>
                        <option value="MA">MA</option>
                        <option value="ME">ME</option>
                        <option value="JU">JU</option>
                        <option value="VE">VE</option>
                        <option value="SA">SA</option>
                        <option value="RA">RA</option>
                        <option value="KE">KE</option>
                      </select>
                      {normalizedItem.planet && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px' }}>
                          <input
                            type="checkbox"
                            className="nadi-checkbox"
                            checked={normalizedItem.hasBTag}
                            onChange={(e) => {
                              const newPlanets = [...saturnRelationPlanets].map((p, i) => {
                                if (i === index) {
                                  return { planet: normalizedItem.planet, hasBTag: e.target.checked };
                                }
                                return typeof p === 'string' ? { planet: p, hasBTag: false } : p;
                              });
                              setSaturnRelationPlanets(newPlanets);
                            }}
                          />
                          (b)
                        </label>
                      )}
                    </div>
                    {index === saturnRelationPlanets.length - 1 && normalizedItem.planet && (
                      <button
                        type="button"
                        onClick={() => setSaturnRelationPlanets([...saturnRelationPlanets, { planet: '', hasBTag: false }])}
                        style={{
                          padding: '2px 8px',
                          cursor: 'pointer',
                          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          marginLeft: '5px'
                        }}
                      >
                        +
                      </button>
                    )}
                    {saturnRelationPlanets.length > 1 && index !== saturnRelationPlanets.length - 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newPlanets = saturnRelationPlanets.filter((_, i) => i !== index);
                          setSaturnRelationPlanets(newPlanets.length ? newPlanets : [{ planet: '', hasBTag: false }]);
                        }}
                        style={{
                          padding: '2px 8px',
                          cursor: 'pointer',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          marginLeft: '5px'
                        }}
                      >
                        ×
                      </button>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="saturnFollowing">Saturn is following</label>
            <select
              id="saturnFollowing"
              {...register('saturnFollowing')}
            >
              <option value="">Select Planet</option>
              <option value="Sun">Sun</option>
              <option value="Moon">Moon</option>
              <option value="Mars">Mars</option>
              <option value="Mercury">Mercury</option>
              <option value="Jupiter">Jupiter</option>
              <option value="Venus">Venus</option>
              <option value="Saturn">Saturn</option>
              <option value="Rahu">Rahu</option>
              <option value="Ketu">Ketu</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="professionalMindset">Professional Mindset</label>
            <textarea
              id="professionalMindset"
              {...register('professionalMindset')}
              placeholder="Professional mindset insights"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Venus Relation</label>
            <input type="hidden" {...register('venusRelation')} />
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
              <span style={{ fontWeight: 'bold' }}>VE</span>
              {venusRelationPlanets.map((item, index) => {
                // Normalize item to object format (handle legacy string format)
                const normalizedItem = typeof item === 'string'
                  ? { planet: item, hasBTag: false }
                  : item;

                return (
                  <React.Fragment key={index}>
                    <span style={{ fontWeight: 'bold' }}>-</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <select
                        value={normalizedItem.planet}
                        onChange={(e) => {
                          const newPlanets = [...venusRelationPlanets].map((p, i) => {
                            if (i === index) {
                              return { planet: e.target.value, hasBTag: normalizedItem.hasBTag };
                            }
                            return typeof p === 'string' ? { planet: p, hasBTag: false } : p;
                          });
                          setVenusRelationPlanets(newPlanets);
                        }}
                        style={{ width: '80px', padding: '2px' }}
                      >
                        <option value="">+</option>
                        <option value="SU">SU</option>
                        <option value="MO">MO</option>
                        <option value="MA">MA</option>
                        <option value="ME">ME</option>
                        <option value="JU">JU</option>
                        <option value="VE">VE</option>
                        <option value="SA">SA</option>
                        <option value="RA">RA</option>
                        <option value="KE">KE</option>
                      </select>
                      {normalizedItem.planet && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px' }}>
                          <input
                            type="checkbox"
                            className="nadi-checkbox"
                            checked={normalizedItem.hasBTag}
                            onChange={(e) => {
                              const newPlanets = [...venusRelationPlanets].map((p, i) => {
                                if (i === index) {
                                  return { planet: normalizedItem.planet, hasBTag: e.target.checked };
                                }
                                return typeof p === 'string' ? { planet: p, hasBTag: false } : p;
                              });
                              setVenusRelationPlanets(newPlanets);
                            }}
                          />
                          (b)
                        </label>
                      )}
                    </div>
                    {index === venusRelationPlanets.length - 1 && normalizedItem.planet && (
                      <button
                        type="button"
                        onClick={() => setVenusRelationPlanets([...venusRelationPlanets, { planet: '', hasBTag: false }])}
                        style={{
                          padding: '2px 8px',
                          cursor: 'pointer',
                          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          marginLeft: '5px'
                        }}
                      >
                        +
                      </button>
                    )}
                    {venusRelationPlanets.length > 1 && index !== venusRelationPlanets.length - 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newPlanets = venusRelationPlanets.filter((_, i) => i !== index);
                          setVenusRelationPlanets(newPlanets.length ? newPlanets : [{ planet: '', hasBTag: false }]);
                        }}
                        style={{
                          padding: '2px 8px',
                          cursor: 'pointer',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          marginLeft: '5px'
                        }}
                      >
                        ×
                      </button>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="venusFollowing">Venus is following</label>
            <select
              id="venusFollowing"
              {...register('venusFollowing')}
            >
              <option value="">Select Planet</option>
              <option value="Sun">Sun</option>
              <option value="Moon">Moon</option>
              <option value="Mars">Mars</option>
              <option value="Mercury">Mercury</option>
              <option value="Jupiter">Jupiter</option>
              <option value="Venus">Venus</option>
              <option value="Saturn">Saturn</option>
              <option value="Rahu">Rahu</option>
              <option value="Ketu">Ketu</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="financialMindset">Financial Mindset</label>
            <textarea
              id="financialMindset"
              {...register('financialMindset')}
              placeholder="Financial mindset insights"
              rows="4"
            />
          </div>
        </div>

        {/* REPORT FORMAT */}
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="reportType">Report Format *</label>
            <select
              id="reportType"
              {...register('reportType', { required: 'Please select a report format' })}
            >
              <option value="pdf">PDF Document</option>
            </select>
            {errors.reportType && <span className="error">{errors.reportType.message}</span>}
          </div>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? (
            'Generating Destiny Report...'
          ) : (
            <ShinyText text="Preview & Generate Report" disabled={false} speed={3} />
          )}
        </button>
      </form>

      {showPreview && previewData && (
        <ReportPreview
          formData={previewData}
          onClose={onClosePreview}
          onExport={onExport}
        />
      )}

      {/* Image Viewer Modal */}
      {viewingMap && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
            overflow: 'auto'
          }}
          onClick={() => {
            setViewingMap(null);
            setMapZoom(1);
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setViewingMap(null);
                setMapZoom(1);
              }}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                zIndex: 10001
              }}
              title="Close"
            >
              ✕
            </button>

            {/* Zoom Controls */}
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'white',
                borderRadius: '25px',
                padding: '10px 15px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                zIndex: 10001
              }}
            >
              <button
                onClick={() => setMapZoom(prev => Math.max(0.5, prev - 0.25))}
                style={{
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}
                title="Zoom out"
              >
                −
              </button>
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                minWidth: '50px',
                textAlign: 'center'
              }}>
                {Math.round(mapZoom * 100)}%
              </span>
              <button
                onClick={() => setMapZoom(prev => Math.min(3, prev + 0.25))}
                style={{
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}
                title="Zoom in"
              >
                +
              </button>
              <button
                onClick={() => setMapZoom(1)}
                style={{
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                title="Reset zoom"
              >
                Reset
              </button>
            </div>

            <img
              src={viewingMap}
              alt="House Map - Full View"
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setMapZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
              }}
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                transform: `scale(${mapZoom})`,
                transition: 'transform 0.2s ease-in-out',
                cursor: mapZoom > 1 ? 'move' : 'default',
                imageRendering: 'high-quality'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportForm;
