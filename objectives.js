// The professor's "Lab objectives (for Lab Exam 2)" checklist, transcribed
// from the handout's tables.
//
// kind: 'model'     — findable on the lab bench models, so pinnable here
//       'histology' — microscope slides; NOT covered by the model photos in
//                     this site, listed so the checklist tells the whole truth
//
// `aliases` are other wordings that should count as having covered a term.
// The professor groups several structures onto one line ("R & L pulmonary
// veins", "Cardiac veins"), so a pin named "Left pulmonary vein" or "Great
// cardiac vein" has to satisfy the grouped entry.

const OBJECTIVE_GROUPS = [
  {
    id: 'chambers',
    title: 'Chambers of the Heart',
    kind: 'model',
    terms: [
      { name: 'Right atrium' },
      { name: 'Right auricle', aliases: ['right auricular appendage'] },
      { name: 'Right ventricle' },
      { name: 'Left atrium' },
      { name: 'Left auricle', aliases: ['left auricular appendage'] },
      { name: 'Left ventricle' },
      { name: 'Pectinate muscle', aliases: ['pectinate muscles'] },
      { name: 'Papillary muscle', aliases: ['papillary muscles'] },
      { name: 'Trabeculae carneae', aliases: ['trabecula carnea'] },
      { name: 'Chordae tendineae', aliases: ['chorda tendinea'] },
      { name: 'Interventricular septum', aliases: ['ventricular septum'] }
    ]
  },
  {
    id: 'valves',
    title: 'Valves of the Heart',
    kind: 'model',
    terms: [
      { name: 'Tricuspid valve', aliases: ['right atrioventricular valve', 'right av valve'] },
      { name: 'Bicuspid valve', aliases: ['left atrioventricular valve', 'left av valve', 'mitral valve'] },
      { name: 'Pulmonary semilunar valve', aliases: ['pulmonary valve', 'pulmonic valve'] },
      { name: 'Aortic semilunar valve', aliases: ['aortic valve'] }
    ]
  },
  {
    id: 'great_vessels',
    title: 'Great vessels',
    kind: 'model',
    terms: [
      { name: 'Superior vena cava', aliases: ['svc'] },
      { name: 'Inferior vena cava', aliases: ['ivc'] },
      { name: 'Cardiac veins', aliases: ['great cardiac vein', 'middle cardiac vein', 'small cardiac vein', 'anterior cardiac vein', 'cardiac vein'] },
      { name: 'Coronary sinus' },
      { name: 'Pulmonary trunk' },
      { name: 'R & L pulmonary arteries', aliases: ['right pulmonary artery', 'left pulmonary artery', 'pulmonary artery', 'pulmonary arteries'] },
      { name: 'R & L pulmonary veins', aliases: ['right pulmonary vein', 'left pulmonary vein', 'right pulmonary veins', 'left pulmonary veins', 'pulmonary vein', 'pulmonary veins'] },
      { name: 'Ascending aorta' },
      { name: 'Aortic arch', aliases: ['arch of the aorta'] },
      { name: 'Descending aorta', aliases: ['thoracic aorta', 'descending thoracic aorta'] },
      { name: 'R & L coronary arteries', aliases: ['right coronary artery', 'left coronary artery', 'coronary artery', 'coronary arteries', 'anterior interventricular artery', 'posterior interventricular artery', 'circumflex artery', 'marginal artery'] },
      { name: 'Ligamentum arteriosum' }
    ]
  },
  {
    id: 'heart_wall',
    title: 'Layers of Heart Wall',
    kind: 'model',
    terms: [
      { name: 'Mediastinum' },
      { name: 'Pericardial sac', aliases: ['pericardium', 'pericardial sac pericardium'] },
      { name: 'Fibrous layer', aliases: ['fibrous pericardium'] },
      { name: 'Serous layer', aliases: ['serous pericardium'] },
      { name: 'Pericardial cavity' },
      { name: 'Epicardium', aliases: ['visceral pericardium'] },
      { name: 'Myocardium' },
      { name: 'Endocardium' }
    ]
  },
  {
    id: 'conduction',
    title: 'Electrical Conduction',
    kind: 'model',
    terms: [
      { name: 'Sinoatrial (SA) node', aliases: ['sa node', 'sinoatrial node', 'sinus node'] },
      { name: 'Atrioventricular (AV) node', aliases: ['av node', 'atrioventricular node'] },
      { name: 'Atrioventricular bundle (of His)', aliases: ['bundle of his', 'av bundle', 'atrioventricular bundle'] },
      { name: 'R & L bundle branches', aliases: ['right bundle branch', 'left bundle branch', 'bundle branch', 'bundle branches'] },
      { name: 'Purkinje fibers', aliases: ['purkinje fibres', 'purkinje fiber'] }
    ]
  },
  {
    id: 'resp_upper',
    title: 'Respiratory System — nose, palate & pharynx',
    kind: 'model',
    terms: [
      { name: 'External nares', aliases: ['nostrils', 'nares', 'external nares nostrils'] },
      { name: 'Nasal cavity' },
      { name: 'Superior concha', aliases: ['superior turbinate', 'superior nasal concha'] },
      { name: 'Middle concha', aliases: ['middle turbinate', 'middle nasal concha'] },
      { name: 'Inferior concha', aliases: ['inferior turbinate', 'inferior nasal concha'] },
      { name: 'Superior meatus' },
      { name: 'Middle meatus' },
      { name: 'Inferior meatus' },
      { name: 'Pharynx' },
      { name: 'Nasopharynx' },
      { name: 'Opening of auditory tube', aliases: ['auditory tube', 'eustachian tube', 'pharyngotympanic tube', 'opening of eustachian tube'] },
      { name: 'Oropharynx' },
      { name: 'Laryngopharynx', aliases: ['hypopharynx'] },
      { name: 'Hard palate' },
      { name: 'Soft palate' },
      { name: 'Uvula' }
    ]
  },
  {
    id: 'larynx',
    title: 'Larynx',
    kind: 'model',
    terms: [
      { name: 'Larynx', aliases: ['voice box'] },
      { name: 'Epiglottis' },
      { name: 'Thyroid cartilage', aliases: ['adams apple'] },
      { name: 'Cricoid cartilage' },
      { name: 'Cricothyroid ligament' },
      { name: 'Glottis' },
      { name: 'Vocal cords', aliases: ['vocal folds', 'true vocal cords', 'true vocal folds', 'vocal cord', 'vocal fold'] }
    ]
  },
  {
    id: 'trachea_bronchi',
    title: 'Trachea & bronchial tree',
    kind: 'model',
    terms: [
      { name: 'Trachea', aliases: ['windpipe'] },
      { name: 'Carina' },
      { name: 'R & L primary bronchi', aliases: ['right primary bronchus', 'left primary bronchus', 'primary bronchus', 'primary bronchi', 'main bronchus', 'mainstem bronchus'] },
      { name: 'R & L secondary bronchi', aliases: ['right secondary bronchus', 'left secondary bronchus', 'secondary bronchus', 'secondary bronchi', 'lobar bronchus'] },
      { name: 'R & L tertiary bronchi', aliases: ['right tertiary bronchus', 'left tertiary bronchus', 'tertiary bronchus', 'tertiary bronchi', 'segmental bronchus'] }
    ]
  },
  {
    id: 'lung_lobes',
    title: 'Lung lobes',
    kind: 'model',
    terms: [
      { name: 'Right superior', aliases: ['right superior lobe', 'superior lobe of the right lung', 'right upper lobe'] },
      { name: 'Right middle', aliases: ['right middle lobe', 'middle lobe'] },
      { name: 'Right inferior', aliases: ['right inferior lobe', 'right lower lobe'] },
      { name: 'Left superior', aliases: ['left superior lobe', 'left upper lobe'] },
      { name: 'Left inferior', aliases: ['left inferior lobe', 'left lower lobe'] }
    ]
  },
  {
    id: 'pleura',
    title: 'Pleural membranes',
    kind: 'model',
    terms: [
      { name: 'Visceral pleura' },
      { name: 'Parietal pleura' },
      { name: 'Pleural cavity', aliases: ['pleural space'] }
    ]
  },
  {
    id: 'resp_muscles',
    title: 'Respiratory muscles',
    kind: 'model',
    terms: [
      { name: 'Diaphragm' },
      { name: 'External intercostal', aliases: ['external intercostals', 'external intercostal muscle'] },
      { name: 'Internal intercostal', aliases: ['internal intercostals', 'internal intercostal muscle'] }
    ]
  },

  /* ---- histology: microscope slides, not the bench models ---- */
  {
    id: 'blood',
    title: 'Human Blood',
    kind: 'histology',
    slide: '#16',
    terms: [
      { name: 'Platelets' }, { name: 'Leukocytes' }, { name: 'Erythrocytes' },
      { name: 'Neutrophil' }, { name: 'Eosinophil' }, { name: 'Basophil' },
      { name: 'Lymphocyte' }, { name: 'Monocyte' }
    ]
  },
  {
    id: 'artery_vein_nerve',
    title: 'Artery, Vein, Nerve',
    kind: 'histology',
    slide: '#3',
    terms: [
      { name: 'Artery' }, { name: 'Vein' }, { name: 'Tunica externa' },
      { name: 'Tunica media' }, { name: 'Tunica interna' }, { name: 'Lumen' },
      { name: 'Internal elastic lamina' }, { name: 'Endothelium' }
    ]
  },
  {
    id: 'cardiac_muscle',
    title: 'Heart, Intercalated Discs',
    kind: 'histology',
    slide: '#45',
    terms: [
      { name: 'Nucleus' }, { name: 'Intercalated disc' },
      { name: 'Striations' }, { name: 'Myofiber' }
    ]
  },
  {
    id: 'nasal_epithelium',
    title: 'Nasal Epithelium',
    kind: 'histology',
    slide: '#38',
    terms: [
      { name: 'Respiratory region' }, { name: 'Epithelium' },
      { name: 'Septal cartilage' }, { name: 'Cilia' }, { name: 'Goblet cells' }
    ]
  },
  {
    id: 'trachea_histo',
    title: 'Trachea (histology)',
    kind: 'histology',
    slide: '#9',
    terms: [
      { name: 'Tracheal cartilage' }, { name: 'Mucosa' }, { name: 'Cilia' },
      { name: 'Goblet cells' }, { name: 'Tracheal glands' }
    ]
  },
  {
    id: 'lung_histo',
    title: 'Lung (histology)',
    kind: 'histology',
    slide: '#51',
    terms: [
      { name: 'Pulmonary artery' }, { name: 'Pulmonary vein' }, { name: 'Bronchi' },
      { name: 'Bronchial cartilage' }, { name: 'Mucosa' }, { name: 'Bronchial glands' },
      { name: 'Lumen' }, { name: 'Pseudostratified ciliated columnar epithelium' },
      { name: 'Cilia' }
    ]
  },
  {
    id: 'lung_bronchi_histo',
    title: 'Lung and Bronchi (histology)',
    kind: 'histology',
    slide: '#52',
    terms: [
      { name: 'Bronchioles' }, { name: 'Pulmonary arteriole' }, { name: 'Bronchiole' },
      { name: 'Alveoli', aliases: ['alveolus', 'alveoli alveolus'] },
      { name: 'Pulmonary venule' }, { name: 'Lumen of bronchiole' },
      { name: 'Ciliated cuboidal epithelium' }, { name: 'Simple squamous epithelium' },
      { name: 'Alveolar duct' }
    ]
  }
];
