// Openly-licensed images pulled in to cover checklist entries that neither the
// lab-bench photos nor the sibling sites could reach — the nasal epithelium
// slide above all, plus better bronchiole and alveolar views.
//
// These arrive BLANK on purpose: they are here for you to label, same as your
// own photos. Sourcing follows the labeling app's practice — Wikimedia Commons
// and OpenStax, credited in the footer.
//
// The OpenStax diagram shipped with its answers printed on it; the labels have
// been cropped and painted out so it can be used as a quiz slide.

const SOURCED_SLIDES = [
  {
    id: "src_nasal_mucosa",
    src: "images/wiki_nasal_mucosa.jpg",
    title: "Nasal mucosa — histology (Slide #38)",
    hint: "Respiratory region: epithelium at the surface, seromucous glands beneath, vessels in the lamina propria."
  },
  {
    id: "src_bronchiole",
    src: "images/wiki_bronchiole.jpg",
    title: "Bronchiole — histology",
    hint: "Airway lumen lined by epithelium, with the wall and surrounding lung tissue around it."
  },
  {
    id: "src_alveoli",
    src: "images/wiki_bronchus.jpg",
    title: "Alveoli & alveolar walls — histology (Slide #52)",
    hint: "Alveolar spaces separated by thin septa — the squamous lining is the gas-exchange surface."
  },
  {
    id: "src_resp_zone",
    src: "images/wiki_resp_zone.jpg",
    title: "Respiratory zone — bronchiole to alveoli",
    hint: "Terminal and respiratory bronchioles leading to alveolar ducts, alveolar sacs and alveoli, with the capillary bed."
  }
];

const SOURCED_CREDITS = [
  {
    what: "Nasal mucosa micrograph",
    src: "Doc. RNDr. Josef Reischig, CSc. — Wikimedia Commons, “Nasal mucosa - human (254 09)”",
    lic: "CC BY-SA 3.0",
    url: "https://commons.wikimedia.org/wiki/File:Nasal_mucosa_-_human_(254_09).jpg"
  },
  {
    what: "Bronchiole micrograph",
    src: "Yale Rosen — Wikimedia Commons, “Normal lung; bronchiole”",
    lic: "CC BY-SA 2.0",
    url: "https://commons.wikimedia.org/wiki/File:Normal_lung;_bronchiole_(3627471928).jpg"
  },
  {
    what: "Alveoli micrograph",
    src: "Jpogi — Wikimedia Commons, “Human tertiary bronchus - Respiratory bronchiole”",
    lic: "Public domain",
    url: "https://commons.wikimedia.org/wiki/File:Human_tertiary_bronchus_-_Respiratory_bronchiole.jpg"
  },
  {
    what: "Respiratory zone diagram (printed labels cropped and masked)",
    src: "OpenStax College, <em>Anatomy &amp; Physiology</em> — Wikimedia Commons, “2309 The Respiratory Zone”",
    lic: "CC BY 3.0",
    url: "https://commons.wikimedia.org/wiki/File:2309_The_Respiratory_Zone.jpg"
  },
  {
    what: "Reference stations (heart, respiratory and histology diagrams) imported from the sibling labeling app",
    src: "OpenStax <em>Anatomy and Physiology</em> (CC BY 4.0), Wikimedia Commons contributors, and BIOL 40B course slides",
    lic: "see that site's credits",
    url: "https://producer456.github.io/bio40b-lab-exam-2-labeling/"
  }
];
