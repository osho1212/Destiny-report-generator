import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import apiService from '../services/apiService';
import ReportPreview from './ReportPreview';
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

function ReportForm() {
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
    <div className="report-form">
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
            <label htmlFor="gemstones">Gemstones</label>
            <input
              id="gemstones"
              type="text"
              {...register('gemstones')}
              placeholder="Recommended gemstones"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mantra">Mantra to Make Situation Positive</label>
            <input
              id="mantra"
              type="text"
              {...register('mantra')}
              placeholder="Positive mantra"
            />
          </div>

          <div className="form-group">
            <label htmlFor="birthNakshatra">Your Birth Nakshatra</label>
            <input
              id="birthNakshatra"
              type="text"
              {...register('birthNakshatra')}
              placeholder="Birth nakshatra"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobileDisplayPicture">Beneficial Mobile Display Picture</label>
            <input
              id="mobileDisplayPicture"
              type="text"
              {...register('mobileDisplayPicture')}
              placeholder="Suggested mobile wallpaper"
            />
          </div>

          <div className="form-group">
            <label htmlFor="beneficialSymbols">Most Beneficial Symbols</label>
            <input
              id="beneficialSymbols"
              type="text"
              {...register('beneficialSymbols')}
              placeholder="Lucky symbols"
            />
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
          {loading ? 'Generating Destiny Report...' : 'Preview & Generate Report'}
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
