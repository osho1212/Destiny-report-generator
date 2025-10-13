import React, { useState } from 'react';
import ShinyText from './ShinyText';
import './ReportPreview.css';

function ReportPreview({ formData, onClose, onExport }) {
  const [filename, setFilename] = useState('Destiny_Report');
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
        { key: 'beneficialSymbols', label: 'Most Beneficial Symbols' },
        { key: 'nakshatraProsperitySymbols', label: 'Prosperity Giving Symbols' },
        { key: 'nakshatraMentalPhysicalWellbeing', label: 'Mental/Physical Wellbeing Symbols' },
        { key: 'nakshatraAccomplishments', label: 'Accomplishment/Achievement Symbols' },
        { key: 'nakshatraAvoidSymbols', label: 'Symbols to Avoid' }
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
        { key: 'aspectsOnHouses', label: 'Aspects on Houses' },
        { key: 'aspectsOnPlanets', label: 'Aspects on Planets' },
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
        { key: 'saturnRelation', label: 'Saturn Relation' },
        { key: 'saturnFollowing', label: 'Saturn is following' },
        { key: 'professionalMindset', label: 'Professional Mindset' },
        { key: 'venusRelation', label: 'Venus Relation' },
        { key: 'venusFollowing', label: 'Venus is following' },
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

          {sections.map((section, idx) => {
            // Check if section has any non-empty fields
            const hasCustomFields = section.customFields && section.customFields.some(cf => cf.getValue());
            const hasRegularFields = section.fields && section.fields.some(field => {
              if (field.key === 'mapOfHouse') {
                const imageUrls = formData.houseMapImages || [];
                const textValue = formData[field.key];
                return imageUrls.length > 0 || textValue;
              }
              return formData[field.key];
            });

            // If section has no content, don't render it
            if (!hasCustomFields && !hasRegularFields) return null;

            return (
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

                  // Special handling for house map images
                  if (field.key === 'mapOfHouse') {
                    const imageUrls = formData.houseMapImages || [];
                    const analyses = formData.houseMapAnalyses || [];
                    const textValue = formData[field.key];

                    // If neither images nor text, return null
                    if (imageUrls.length === 0 && !textValue) return null;

                    return (
                      <div key={fieldIdx} className="preview-field">
                        <span className="field-label">{field.label}:</span>
                        <div className="field-value">
                          {imageUrls.length > 0 && (
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '20px',
                              marginBottom: '10px'
                            }}>
                              {imageUrls.map((imageUrl, imgIdx) => (
                                <div key={imgIdx} style={{
                                  border: '2px solid #e5e7eb',
                                  borderRadius: '8px',
                                  padding: '12px',
                                  backgroundColor: '#f9fafb'
                                }}>
                                  <div style={{
                                    fontWeight: '600',
                                    marginBottom: '10px',
                                    color: '#374151',
                                    fontSize: '14px'
                                  }}>
                                    Map {imgIdx + 1}
                                  </div>
                                  <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '15px'
                                  }}>
                                    <div>
                                      <img
                                        src={imageUrl}
                                        alt={`House Map ${imgIdx + 1}`}
                                        style={{
                                          width: '100%',
                                          maxHeight: '300px',
                                          objectFit: 'contain',
                                          borderRadius: '6px',
                                          border: '1px solid #d1d5db'
                                        }}
                                      />
                                    </div>
                                    {analyses[imgIdx] && (
                                      <div style={{
                                        padding: '10px',
                                        backgroundColor: 'white',
                                        borderRadius: '6px',
                                        border: '1px solid #d1d5db',
                                        whiteSpace: 'pre-wrap',
                                        maxHeight: '300px',
                                        overflowY: 'auto'
                                      }}>
                                        <div style={{
                                          fontWeight: '600',
                                          marginBottom: '8px',
                                          fontSize: '13px',
                                          color: '#6b7280'
                                        }}>
                                          Room Directions:
                                        </div>
                                        {analyses[imgIdx]}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {textValue && <div>{textValue}</div>}
                        </div>
                      </div>
                    );
                  }

                  // Regular field handling
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
            );
          })}

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
          <div style={{
            width: '100%',
            marginBottom: '15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#555'
            }}>
              File Name:
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #ff8c00',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff6600'}
              onBlur={(e) => e.target.style.borderColor = '#ff8c00'}
            />
          </div>
          <div style={{
            display: 'flex',
            gap: '15px',
            width: '100%'
          }}>
            <button className="btn-secondary" onClick={onClose}>
              Edit Report
            </button>
            <button className="btn-primary" onClick={() => onExport(filename)}>
              <ShinyText text="Export Report" disabled={false} speed={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportPreview;
