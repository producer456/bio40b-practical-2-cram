// Claude's estimate of which checklist entries are most likely to be tagged on
// the practical. THIS IS A PREDICTION, NOT INSIDE INFORMATION — the professor
// writes the exam, not this file. Treat a low tier as "still study it".
//
// The reasoning behind the tiers, so you can disagree with it:
//   * a practical station needs a pointer to rest unambiguously on ONE thing,
//     so large, discrete, well-separated structures get tagged more often than
//     layers, spaces and categories
//   * structures the objectives sheet also ties to a function or to the
//     oxygenated/deoxygenated question are worth more to him, so they recur
//   * terms that appear on several of his slides (Cilia, Mucosa, Lumen) are
//     real but tend to be asked once, not once per slide
//   * left/right and superior/middle/inferior pairs are favourite tags,
//     because they separate students who memorised position from those who
//     memorised a picture
//
// tier A ≈ expect it, B ≈ likely, C ≈ plausible. Anything absent is not
// "safe" — it is just less probable than these 80.

const LIKELY_ITEMS = [
  /* ---- tier A: the ones a practical almost has to include ---- */
  { name: "Right atrium", tier: "A" },
  { name: "Right ventricle", tier: "A" },
  { name: "Left atrium", tier: "A" },
  { name: "Left ventricle", tier: "A" },
  { name: "Interventricular septum", tier: "A" },
  { name: "Tricuspid valve", tier: "A" },
  { name: "Bicuspid valve", tier: "A" },
  { name: "Pulmonary semilunar valve", tier: "A" },
  { name: "Aortic semilunar valve", tier: "A" },
  { name: "Chordae tendineae", tier: "A" },
  { name: "Papillary muscle", tier: "A" },
  { name: "Superior vena cava", tier: "A" },
  { name: "Inferior vena cava", tier: "A" },
  { name: "Pulmonary trunk", tier: "A" },
  { name: "Ascending aorta", tier: "A" },
  { name: "Aortic arch", tier: "A" },
  { name: "Descending aorta", tier: "A" },
  { name: "R & L pulmonary arteries", tier: "A" },
  { name: "R & L pulmonary veins", tier: "A" },
  { name: "R & L coronary arteries", tier: "A" },
  { name: "Coronary sinus", tier: "A" },
  { name: "Myocardium", tier: "A" },
  { name: "Epicardium", tier: "A" },
  { name: "Endocardium", tier: "A" },
  { name: "Sinoatrial (SA) node", tier: "A" },
  { name: "Atrioventricular (AV) node", tier: "A" },
  { name: "Trachea", tier: "A" },
  { name: "Epiglottis", tier: "A" },
  { name: "Thyroid cartilage", tier: "A" },
  { name: "Cricoid cartilage", tier: "A" },
  { name: "Diaphragm", tier: "A" },
  { name: "Right superior", tier: "A" },
  { name: "Right middle", tier: "A" },
  { name: "Right inferior", tier: "A" },
  { name: "Left superior", tier: "A" },
  { name: "Left inferior", tier: "A" },
  { name: "R & L primary bronchi", tier: "A" },
  { name: "Nasopharynx", tier: "A" },
  { name: "Oropharynx", tier: "A" },
  { name: "Laryngopharynx", tier: "A" },

  /* ---- tier B ---- */
  { name: "Right auricle", tier: "B" },
  { name: "Left auricle", tier: "B" },
  { name: "Pectinate muscle", tier: "B" },
  { name: "Trabeculae carneae", tier: "B" },
  { name: "Ligamentum arteriosum", tier: "B" },
  { name: "Cardiac veins", tier: "B" },
  { name: "Pericardial sac", tier: "B" },
  { name: "Pericardial cavity", tier: "B" },
  { name: "Atrioventricular bundle (of His)", tier: "B" },
  { name: "Purkinje fibers", tier: "B" },
  { name: "R & L bundle branches", tier: "B" },
  { name: "Larynx", tier: "B" },
  { name: "Vocal cords", tier: "B" },
  { name: "Glottis", tier: "B" },
  { name: "Cricothyroid ligament", tier: "B" },
  { name: "Carina", tier: "B" },
  { name: "R & L secondary bronchi", tier: "B" },
  { name: "R & L tertiary bronchi", tier: "B" },
  { name: "Visceral pleura", tier: "B" },
  { name: "Parietal pleura", tier: "B" },
  { name: "Pleural cavity", tier: "B" },
  { name: "Hard palate", tier: "B" },
  { name: "Soft palate", tier: "B" },
  { name: "Uvula", tier: "B" },
  { name: "Nasal cavity", tier: "B" },

  /* ---- tier C ---- */
  { name: "Mediastinum", tier: "C" },
  { name: "External intercostal", tier: "C" },
  { name: "Internal intercostal", tier: "C" },
  { name: "Superior concha", tier: "C" },
  { name: "Middle concha", tier: "C" },
  { name: "Inferior concha", tier: "C" },
  { name: "External nares", tier: "C" },
  { name: "Opening of auditory tube", tier: "C" },
  { name: "Erythrocytes", tier: "C" },
  { name: "Neutrophil", tier: "C" },
  { name: "Lymphocyte", tier: "C" },
  { name: "Tunica media", tier: "C" },
  { name: "Tunica interna", tier: "C" },
  { name: "Intercalated disc", tier: "C" },
  { name: "Alveoli", tier: "C" }
];

// Rough probability attached to each tier, used to rank study effort.
const TIER_WEIGHT = { A: 0.9, B: 0.7, C: 0.5 };
const UNFLAGGED_WEIGHT = 0.25;
