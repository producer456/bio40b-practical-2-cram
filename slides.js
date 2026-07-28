// Slide manifest for BIOL 40B Practical 2 — Build Your Own Pins.
// Images are the user's own lab photos from "Images for practical 2 40b",
// copied into images/ with stable slugs so pin coordinates never break.
//
// `title` here is only the DEFAULT name. Renaming a slide in Build mode
// stores an override in localStorage; the preset can also override it.

const SLIDE_ORDER = [
  "heart_ext_anterior",
  "heart_ant_vessels",
  "heart_base_posterior",
  "heart_coronal_chambers",
  "heart_interior_ventricle",
  "heart_interior_right",
  "heart_coronal_ref",
  "heart_lungs_insitu",
  "thorax_lungs_diaphragm",
  "lung_sectioned",
  "larynx_trachea_bronchi",
  "larynx_coronal",
  "airway_wall_sections",
  "head_midsagittal"
];

const SLIDE_DATA = {
  heart_ext_anterior: {
    src: "images/heart_ext_anterior.webp",
    title: "Heart — external, anterior",
    hint: "Roman-numeral model: atria, ventricles, great vessels, coronary sulcus."
  },
  heart_ant_vessels: {
    src: "images/heart_ant_vessels.jpeg",
    title: "Heart — anterior with great vessels",
    hint: "Aortic arch and its branches, SVC, pulmonary trunk, coronary vessels."
  },
  heart_base_posterior: {
    src: "images/heart_base_posterior.webp",
    title: "Heart — base & great vessels (posterior)",
    hint: "Numbered model seen from above/behind: arch branches, pulmonary veins, valves."
  },
  heart_coronal_chambers: {
    src: "images/heart_coronal_chambers.webp",
    title: "Heart — coronal section, chambers & valves",
    hint: "Chambers opened: AV valves, chordae tendineae, papillary muscles, septum."
  },
  heart_interior_ventricle: {
    src: "images/heart_interior_ventricle.webp",
    title: "Heart — interior, ventricle opened",
    hint: "Trabeculae carneae, papillary muscles, semilunar valve, myocardium."
  },
  heart_interior_right: {
    src: "images/heart_interior_right.webp",
    title: "Heart — interior, right side opened",
    hint: "Right atrium and ventricle: pectinate muscles, tricuspid valve, openings."
  },
  heart_coronal_ref: {
    src: "images/heart_coronal_ref.webp",
    title: "Heart — coronal section (numbered reference)",
    hint: "Reference figure with lead lines already drawn — good for checking yourself."
  },
  heart_lungs_insitu: {
    src: "images/heart_lungs_insitu.webp",
    title: "Heart & lungs in situ",
    hint: "Heart between the lungs on the diaphragm; great vessels, pericardium."
  },
  thorax_lungs_diaphragm: {
    src: "images/thorax_lungs_diaphragm.webp",
    title: "Thorax — lungs & diaphragm",
    hint: "Lobes and fissures, trachea and main bronchi, mediastinum, diaphragm."
  },
  lung_sectioned: {
    src: "images/lung_sectioned.webp",
    title: "Lung — sectioned, bronchial tree & vessels",
    hint: "Bronchial tree branching, pulmonary vessels, hilum, lobes."
  },
  larynx_trachea_bronchi: {
    src: "images/larynx_trachea_bronchi.webp",
    title: "Larynx, trachea & bronchial tree",
    hint: "Cartilages, tracheal rings, carina, primary/secondary/tertiary bronchi."
  },
  larynx_coronal: {
    src: "images/larynx_coronal.webp",
    title: "Larynx — coronal section (vocal folds)",
    hint: "True and false vocal folds, ventricle, cartilages, intrinsic muscles."
  },
  airway_wall_sections: {
    src: "images/airway_wall_sections.webp",
    title: "Airway wall cross-sections",
    hint: "Trachea → bronchus → bronchiole: cartilage, smooth muscle, mucosa."
  },
  head_midsagittal: {
    src: "images/head_midsagittal.webp",
    title: "Head & neck — midsagittal section",
    hint: "Nasal cavity, conchae, pharynx regions, epiglottis, larynx, esophagus."
  }
};
