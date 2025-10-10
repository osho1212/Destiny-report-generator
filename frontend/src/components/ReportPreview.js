import React from 'react';
import ShinyText from './ShinyText';
import './ReportPreview.css';

function ReportPreview({ formData, onClose, onExport }) {
  // Helper function to format dasha data
  // Format: Planet(Source), NL(NL Source), (Additional house), SL(SL source)
  const formatDasha = (prefix) => {
    const planet = formData[`${prefix}_planet`];
    const source = formData[`${prefix}_source`];
    const nl = formData[`${prefix}_nl`];
    const nlSource = formData[`${prefix}_nl_source`];
    const additionalHouse = formData[`${prefix}_additional_house`];
    const sl = formData[`${prefix}_sl`];
    const slSource = formData[`${prefix}_sl_source`];

    const parts = [];

    // Planet(Source)
    if (planet) {
      if (source) {
        parts.push(`${planet}(${source})`);
      } else {
        parts.push(planet);
      }
    }

    // NL Planet(NL Source)
    if (nl) {
      if (nlSource) {
        parts.push(`${nl}(${nlSource})`);
      } else {
        parts.push(nl);
      }
    }

    // (Additional house)
    if (additionalHouse) {
      parts.push(`(${additionalHouse})`);
    }

    // SL Planet(SL source)
    if (sl) {
      if (slSource) {
        parts.push(`${sl}(${slSource})`);
      } else {
        parts.push(sl);
      }
    }

    // Add period dates if this is pratyantardasha
    if (prefix === 'pratyantardasha') {
      const periodFrom = formData[`${prefix}_period_from`];
      const periodTo = formData[`${prefix}_period_to`];

      if (periodFrom && periodTo) {
        const formattedFrom = new Date(periodFrom).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        const formattedTo = new Date(periodTo).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        parts.push(`Period: ${formattedFrom} - ${formattedTo}`);
      }
    }

    return parts.length > 0 ? parts.join(', ') : null;
  };

  const sections = [
    {
      title: 'ABOUT THE CLIENT',
      fields: [
        { key: 'name', label: 'Name' },
        { key: 'dateOfBirth', label: 'Date of Birth' },
        { key: 'timeOfBirth', label: 'Time of Birth' },
        { key: 'placeOfBirth', label: 'Place of Birth' }
      ]
    },
    {
      title: 'VASTU ANALYSIS',
      fields: [
        { key: 'mapOfHouse', label: 'Map of the House' },
        { key: 'vastuAnalysis', label: 'Analysis (Entrances, Kitchen, Washrooms)' },
        { key: 'vastuRemedies', label: 'Remedies' }
      ]
    },
    {
      title: 'ASTROLOGY',
      fields: [
        { key: 'donationsToDo', label: 'Donations to Do' },
        { key: 'donationsToWhom', label: 'Donations - To Whom' },
        { key: 'gemstones', label: 'Gemstones' },
        { key: 'mantra', label: 'Mantra to Make Situation Positive' },
        { key: 'birthNakshatra', label: 'Your Birth Nakshatra' },
        { key: 'mobileDisplayPicture', label: 'Beneficial Mobile Display Picture' },
        { key: 'beneficialSymbols', label: 'Most Beneficial Symbols' }
      ],
      customFields: [
        { label: 'Mahadasha', getValue: () => formatDasha('mahadasha') },
        { label: 'Antardasha', getValue: () => formatDasha('antardasha') },
        { label: 'Pratyantar Dasha', getValue: () => formatDasha('pratyantardasha') }
      ]
    },
    {
      title: 'ASTRO VASTU SOLUTION',
      fields: [
        { key: 'astroVastuRemediesHouse', label: 'Astro Vastu Remedies for House' },
        { key: 'whatToRemove', label: 'What to Remove from Which Directions' },
        { key: 'whatToPlace', label: 'What to Place in Which Directions' },
        { key: 'astroVastuRemediesBody', label: 'Astro Vastu Remedies for Body' },
        { key: 'colorObjectsToUse', label: 'What Color or Objects to Use on Body' },
        { key: 'colorObjectsNotToUse', label: 'What Color or Objects NOT to Use on Body' },
        { key: 'lockerLocation', label: 'Most Favorable Location of Locker' },
        { key: 'laughingBuddhaDirection', label: 'Placement of Laughing Buddha/Vision Board - Direction' },
        { key: 'wishListInkColor', label: 'Color of Ink to Write Wish List' }
      ]
    },
    {
      title: 'GUIDELINES',
      fields: [
        { key: 'neverCriticize', label: 'To Whom You Should Never Criticize or Judge' },
        { key: 'importantBooks', label: 'Important Books to Read to Uplift Your Life' },
        { key: 'giftsToGive', label: 'Gifts - To Give' },
        { key: 'giftsToReceive', label: 'Gifts - To Receive' }
      ]
    },
    {
      title: 'BHRIGUNANDA NADI',
      fields: [
        { key: 'professionalMindset', label: 'Professional Mindset' },
        { key: 'financialMindset', label: 'Financial Mindset' }
      ]
    }
  ];

  return (
    <div className="preview-overlay">
      <div className="preview-modal">
        <div className="preview-header">
          <h2>Report Preview</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="preview-content">
          <div className="preview-title">DESTINY REPORT</div>

          {sections.map((section, idx) => (
            <div key={idx} className="preview-section">
              <h3>{section.title}</h3>
              <div className="preview-fields">
                {/* Render custom fields first (like Dashas) */}
                {section.customFields && section.customFields.map((customField, customIdx) => {
                  const value = customField.getValue();
                  if (!value) return null;

                  return (
                    <div key={`custom-${customIdx}`} className="preview-field">
                      <span className="field-label">{customField.label}:</span>
                      <span className="field-value">{value}</span>
                    </div>
                  );
                })}

                {/* Render regular fields */}
                {section.fields && section.fields.map((field, fieldIdx) => {
                  const value = formData[field.key];
                  if (!value) return null;

                  return (
                    <div key={fieldIdx} className="preview-field">
                      <span className="field-label">{field.label}:</span>
                      <span className="field-value">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="preview-timestamp">
            Generated on: {new Date().toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })}
          </div>
        </div>

        <div className="preview-actions">
          <button className="btn-secondary" onClick={onClose}>
            Edit Report
          </button>
          <button className="btn-primary" onClick={onExport}>
            <ShinyText text="Export Report" disabled={false} speed={3} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportPreview;
