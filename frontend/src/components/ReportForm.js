import React, { useState } from 'react';
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
  'Ashvini': {
    mobileDisplayPicture: `• Drum/Pair of fish
• Coiled serpent/Female cat/Owl/Blue sparrow`,
    beneficialSymbols: `• Drum/Pair of fish
• Coiled serpent/Female cat/Owl/Blue sparrow`,
    prosperitySymbols: `• Inverted triangle/ELEPHANT/CROW
• Winnowing Basket/MALE MONKEY`,
    mentalPhysicalWellbeing: `• Hand/fist/FEMALE BUFFALO/FALCON`,
    accomplishments: `• Shoot of a plant/MALE BUFFALO
• Tears/FEMALE DOG
• Empty circles of ring/FEMALE HORSE/ASIAN KOEL`,
    avoidSymbols: `• Bright jewel/pearl/FEMALE TIGER/WOODPECKER
• POTTER'S WHEEL/MALE TIGER
• SWORD/MALE LION/PIGEON
• BOW AND ARROW/FEMALE CAT/SWAN
• Deer's head/FEMALE SERPENT/HEN
• A drum/flute/FEMALE LION/PEACOCK
• Sharp knife/GOAT/PEACOCK
• Elephants tusks/MALE MANGOOSE/STORK`
  },
  'Bharani': {
    mobileDisplayPicture: `• Horse head/HORSE/EAGLE
• ROYAL THRONE/PALANQUIN/MOUSE/EAGLE`,
    beneficialSymbols: `• Horse head/HORSE/EAGLE
• ROYAL THRONE/PALANQUIN/MOUSE/EAGLE`,
    prosperitySymbols: `• SHARP KNIFE/GOAT/PEACOCK
• ELEPHANT TUSK/MALE MANGOOSE/STORK`,
    mentalPhysicalWellbeing: `• Bright jewel/pearl/FEMALE TIGER/WOODPECKER`,
    accomplishments: `• Potter's wheel/MALE TIGER
• SWORD/MALE LION/PIGEON
• BOW AND ARROW/FEMALE CAT/SWAN`,
    avoidSymbols: `• LOTUS/FEMALE DEER/NIGHTINGALE
• Three foot prints/FEMALE MONKEY
• Hand or Fist/FEMALE BUFFALO/FALCON
• Chariot/SERPENT/WHITE OWL
• Shoot of a plant/MALE BUFFALO
• Tears/FEMALE DOG
• Empty circles of ring/FEMALE HORSE/ASIAN KOEL
• UDDER OF A COW/GOAT/SEA CROW
• SERPENT IN WATER/FEMALE COW`
  },
  'Krittika': {
    mobileDisplayPicture: `• Inverted triangle/ELEPHANT/crow`,
    beneficialSymbols: `• Inverted triangle/ELEPHANT/crow`,
    prosperitySymbols: `• Three foot prints/FEMALE MONKEY
• CHARIOT/SERPENT/WHITE OWL`,
    mentalPhysicalWellbeing: `• SHOOT OF A PLANT/MALE BUFFALO`,
    accomplishments: `• Udder of a cow/GOAT/SEA CROW
• SERPENT IN WATER/FEMALE COW
• Lotus/FEMALE DEER/NIGHTINGALE`,
    avoidSymbols: `• Bright jewel/pearl/FEMALE TIGER/WOODPECKER
• COILED SERPENT/FEMALE CAT/OWL
• Potter's wheel/MALE TIGER
• Drum/pair of fish/FEMALE ELEPHANT
• Circular amulet/umbrella/ear rings/MALE DEER
• SWORD/MALE LION/PIGEON
• BOW AND ARROW/FEMALE CAT/SWAN
• Deer's head/FEMALE SERPENT/HEN
• A drum/flute/FEMALE LION/PEACOCK`
  },
  'Rohini': {
    mobileDisplayPicture: `• Sharp knife/GOAT/PEACOCK
• MALE COW(NANDI)/PEACOCK`,
    beneficialSymbols: `• Sharp knife/GOAT/PEACOCK
• MALE COW(NANDI)/PEACOCK`,
    prosperitySymbols: `• DEER'S HEAD/FEMALE SERPENT/HEN
• Drum/FLUTE/FEMALE LION/PEACOCK`,
    mentalPhysicalWellbeing: `• POTTER'S WHEEL/MALE TIGER`,
    accomplishments: `• COILED SERPENT/FEMALE CAT/OWL
• Drum/pair of fish/FEMALE ELEPHANT
• Circular amulet/umbrella/ear rings/MALE DEER`,
    avoidSymbols: `• SERPENT IN WATER/FEMALE COW
• Lotus/FEMALE DEER/NIGHTINGALE
• Shoot of a plant
• Tears/FEMALE DOG
• Empty circles of ring/FEMALE HORSE/ASIAN KOEL
• Horse head/HORSE/EAGLE
• RETICULATED ROOT/MALE DOG/RED VULTURE
• ROYAL THRONE/PALANQUIN/MOUSE/EAGLE
• UDDER OF A COW/GOAT/SEA CROW`
  }
};

function ReportForm({ darkTheme }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();

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

  const onPreview = (data) => {
    setPreviewData(data);
    setShowPreview(true);
  };

  const onExport = async () => {
    setLoading(true);
    setMessage(null);
    setShowPreview(false);

    try {
      const reportType = previewData.reportType;
      const formData = { ...previewData };
      delete formData.reportType;

      await apiService.generateReport(reportType, formData);
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
            <textarea
              id="mapOfHouse"
              {...register('mapOfHouse')}
              placeholder="Describe house layout or upload details"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="vastuAnalysis">Analysis (Entrances, Kitchen, Washrooms)</label>
            <textarea
              id="vastuAnalysis"
              {...register('vastuAnalysis')}
              placeholder="Enter vastu analysis details"
              rows="4"
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
              <option value="Ashvini" />
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
              <option value="Abhijit" />
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
            <label htmlFor="astroVastuRemediesHouse">Astro Vastu Remedies for House</label>
            <textarea
              id="astroVastuRemediesHouse"
              {...register('astroVastuRemediesHouse')}
              placeholder="House remedies"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="whatToRemove">What to Remove from Which Directions</label>
            <textarea
              id="whatToRemove"
              {...register('whatToRemove')}
              placeholder="Items to remove and their directions"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="whatToPlace">What to Place in Which Directions</label>
            <textarea
              id="whatToPlace"
              {...register('whatToPlace')}
              placeholder="Items to place and their directions"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="astroVastuRemediesBody">Astro Vastu Remedies for Body</label>
            <textarea
              id="astroVastuRemediesBody"
              {...register('astroVastuRemediesBody')}
              placeholder="Body remedies"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="colorObjectsToUse">What Color or Objects to Use on Body</label>
            <input
              id="colorObjectsToUse"
              type="text"
              {...register('colorObjectsToUse')}
              placeholder="Colors/objects to use"
            />
          </div>

          <div className="form-group">
            <label htmlFor="colorObjectsNotToUse">What Color or Objects NOT to Use on Body</label>
            <input
              id="colorObjectsNotToUse"
              type="text"
              {...register('colorObjectsNotToUse')}
              placeholder="Colors/objects to avoid"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lockerLocation">Most Favorable Location of Locker</label>
            <input
              id="lockerLocation"
              type="text"
              {...register('lockerLocation')}
              placeholder="Best locker placement for wealth"
            />
          </div>

          <div className="form-group">
            <label htmlFor="laughingBuddhaDirection">Placement of Laughing Buddha/Vision Board - Direction</label>
            <input
              id="laughingBuddhaDirection"
              type="text"
              {...register('laughingBuddhaDirection')}
              placeholder="Direction for placement"
            />
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
            <label htmlFor="importantBooks">Important Books to Read to Uplift Your Life</label>
            <textarea
              id="importantBooks"
              {...register('importantBooks')}
              placeholder="Recommended books"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="giftsToGive">Gifts - To Give</label>
            <input
              id="giftsToGive"
              type="text"
              {...register('giftsToGive')}
              placeholder="Gifts you should give"
            />
          </div>

          <div className="form-group">
            <label htmlFor="giftsToReceive">Gifts - To Receive</label>
            <input
              id="giftsToReceive"
              type="text"
              {...register('giftsToReceive')}
              placeholder="Gifts you should receive"
            />
          </div>
        </div>

        {/* BHRIGUNANDA NADI */}
        <div className="form-section">
          <h2>Bhrigunanda Nadi</h2>

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
              <option value="docx">Word Document (.docx)</option>
              <option value="excel">Excel Spreadsheet (.xlsx)</option>
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
    </div>
  );
}

export default ReportForm;
