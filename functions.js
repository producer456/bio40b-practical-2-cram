// Function questions — one for every structure in the Lab Exam 2 objectives.
//
// The practical asks you to NAME a pinned structure; the written half of the
// same objectives sheet asks what it DOES. This file is the second half.
//
//   term   must match a `name` in objectives.js exactly, so the coverage test
//          can prove nothing on the handout is missing
//   group  the objectives group it is asked under (a term listed in several
//          groups — Cilia, Mucosa, Lumen, Goblet cells — is asked once, and
//          `also` lists the other groups it belongs to)
//   ask    overrides the default "What is the function of X?" wording, for
//          entries where position, not function, is the thing being tested
//   fn     the correct option
//   wrong  exactly three distractors. These are deliberately the real
//          functions of the structures you are most likely to confuse it with
//          — the whole point is that a vague memory does not survive them.
//          They are also written to roughly the length of the right answer:
//          if the correct option is always the wordiest one, the quiz can be
//          passed without knowing any anatomy. tests/functions-test.js fails
//          the build if that creeps back in
//   note   shown after you answer, one line on how to tell them apart
//
// Nothing here is generated. If you disagree with a wording, edit it; your
// professor's phrasing beats mine.

const FUNCTION_ITEMS = [

  /* ─────────── Chambers of the Heart ─────────── */
  {
    term: 'Right atrium', group: 'chambers',
    fn: 'Receives deoxygenated blood returning from the body and passes it into the right ventricle',
    wrong: [
      'Receives oxygenated blood returning from the lungs and passes it into the left ventricle',
      'Pumps deoxygenated blood out through the pulmonary trunk to be reoxygenated in the lungs',
      'Pumps oxygenated blood out through the aorta at the pressure the whole body runs on'
    ],
    note: 'Atria receive, ventricles pump. Right side handles deoxygenated blood.'
  },
  {
    term: 'Right auricle', group: 'chambers',
    fn: 'A wrinkled flap on the right atrium that expands to increase how much blood that atrium holds',
    wrong: [
      'A wrinkled flap on the left atrium that expands to increase how much blood that atrium holds',
      'A patch of tissue in the right atrial wall that fires to set the rate of every heartbeat',
      'A wide vein on the back of the heart that empties used coronary blood into the right atrium'
    ],
    note: 'Auricle = "little ear". Right one sits over the ascending aorta, left one over the pulmonary trunk.'
  },
  {
    term: 'Right ventricle', group: 'chambers',
    fn: 'Pumps deoxygenated blood into the pulmonary trunk and on to the lungs, at low pressure',
    wrong: [
      'Pumps oxygenated blood into the aorta and on to the whole body, at high pressure',
      'Receives deoxygenated blood arriving from the superior and inferior venae cavae',
      'Receives oxygenated blood arriving back from the lungs by the four pulmonary veins'
    ],
    note: 'Its wall is thin — the lungs are a short, low-pressure trip.'
  },
  {
    term: 'Left atrium', group: 'chambers',
    fn: 'Receives oxygenated blood from the four pulmonary veins and passes it into the left ventricle',
    wrong: [
      'Receives deoxygenated blood from the two venae cavae and passes it into the right ventricle',
      'Pumps oxygenated blood into the aorta, supplying every organ except the lungs themselves',
      'Pumps deoxygenated blood into the pulmonary trunk to be sent to the lungs for gas exchange'
    ],
    note: 'It forms most of the posterior surface of the heart — the pulmonary veins enter from behind.'
  },
  {
    term: 'Left auricle', group: 'chambers',
    fn: 'A wrinkled flap on the left atrium that expands to increase how much blood that atrium holds',
    wrong: [
      'A wrinkled flap on the right atrium that expands to increase how much blood that atrium holds',
      'A set of tendinous cords anchoring the bicuspid valve cusps so they cannot flip backwards',
      'A pair of vessels bringing oxygenated blood back from the left lung into the left atrium'
    ],
    note: 'Same job as the right auricle, other side. On the anterior view it overlaps the pulmonary trunk.'
  },
  {
    term: 'Left ventricle', group: 'chambers',
    fn: 'Pumps oxygenated blood into the aorta at high pressure, supplying the whole body',
    wrong: [
      'Pumps deoxygenated blood into the pulmonary trunk at low pressure, supplying the lungs',
      'Receives oxygenated blood from the pulmonary veins and passes it to the chamber below',
      'Receives deoxygenated blood from the venae cavae and passes it to the chamber below'
    ],
    note: 'Its wall is roughly three times thicker than the right ventricle — that thickness is the giveaway on a cross-section.'
  },
  {
    term: 'Pectinate muscle', group: 'chambers',
    fn: 'Comb-like ridges in the atrial walls and auricles that add strength and let the atrium stretch as it fills',
    wrong: [
      'Irregular ridges on the ventricle walls that keep the walls from sticking together as it empties',
      'Cone-shaped muscles that shorten during systole and pull the chordae tendineae taut',
      'Tendinous cords running from the free edge of a valve cusp down to the ventricle floor'
    ],
    note: 'Pectinate = atria (comb-like). Trabeculae carneae = ventricles.'
  },
  {
    term: 'Papillary muscle', group: 'chambers',
    fn: 'Contracts to pull the chordae tendineae taut, holding the AV valve cusps shut against ventricular pressure',
    wrong: [
      'Contracts to squeeze the last of the blood out of the atrium into the ventricle below it',
      'Forms comb-like ridges in the wall of the atrium so that thin-walled chamber can stretch as it fills',
      'Carries the electrical impulse from the AV node down through the interventricular septum'
    ],
    note: 'The muscle pulls, the chordae are just the cords. Together they stop valve prolapse.'
  },
  {
    term: 'Trabeculae carneae', group: 'chambers',
    fn: 'Irregular muscular ridges on the ventricle walls that reinforce them and stop the walls sticking together',
    wrong: [
      'Comb-like muscular ridges inside the atria and their auricles, letting those thin-walled chambers stretch',
      'Tendinous cords that run from the AV valve cusps down to the papillary muscles below',
      'The thick muscular wall that keeps the blood in the two ventricles from mixing'
    ],
    note: 'Carneae = "fleshy". You see them lining the inside of an opened ventricle.'
  },
  {
    term: 'Chordae tendineae', group: 'chambers',
    fn: 'Tendinous cords anchoring the AV valve cusps to the papillary muscles so the cusps cannot flip into the atrium',
    wrong: [
      'Muscular cones that shorten during ventricular systole and put those cords under tension',
      'Elastic strands that snap the cusps of the semilunar valves shut the moment the ventricle relaxes and pressure drops',
      'Conducting fibres that carry the impulse into the papillary muscles just before systole'
    ],
    note: '"Heart strings" — cords only, no contraction. The pulling is done by the papillary muscles.'
  },
  {
    term: 'Interventricular septum', group: 'chambers',
    fn: 'The muscular wall between the two ventricles, keeping oxygenated and deoxygenated blood from mixing',
    wrong: [
      'The much thinner wall standing between the two atria, marked in its centre by the dimple of the fossa ovalis',
      'The fibrous ring separating atria from ventricles, which anchors all four valve rings',
      'The double-walled sac that separates the beating heart from the lungs on either side'
    ],
    note: 'It also carries the bundle branches down toward the apex.'
  },

  /* ─────────── Valves of the Heart ─────────── */
  {
    term: 'Tricuspid valve', group: 'valves',
    fn: 'Stops blood flowing back into the right atrium when the right ventricle contracts',
    wrong: [
      'Stops blood flowing back into the left atrium when the left ventricle contracts',
      'Stops blood falling back into the right ventricle out of the pulmonary trunk',
      'Stops blood falling back into the left ventricle out of the ascending aorta'
    ],
    note: 'Right AV valve, three cusps. "Try before you buy" — tricuspid on the right.'
  },
  {
    term: 'Bicuspid valve', group: 'valves',
    fn: 'Stops blood flowing back into the left atrium when the left ventricle contracts',
    wrong: [
      'Stops blood flowing back into the right atrium when the right ventricle contracts',
      'Stops blood falling back into the left ventricle out of the ascending aorta',
      'Stops blood falling back into the right ventricle out of the pulmonary trunk'
    ],
    note: 'Also called the mitral valve. Left AV valve, two cusps, holds the highest pressure in the heart.'
  },
  {
    term: 'Pulmonary semilunar valve', group: 'valves',
    fn: 'Stops blood falling back into the right ventricle from the pulmonary trunk once that ventricle relaxes',
    wrong: [
      'Stops blood falling back out of the ascending aorta into the left ventricle once that ventricle relaxes',
      'Stops blood flowing back into the right atrium while the right ventricle is contracting',
      'Stops blood flowing back into the left atrium while the left ventricle is contracting'
    ],
    note: 'Semilunar valves have no chordae — the cusps fill with backflowing blood and balloon shut.'
  },
  {
    term: 'Aortic semilunar valve', group: 'valves',
    fn: 'Stops blood falling back into the left ventricle from the aorta once that ventricle relaxes',
    wrong: [
      'Stops blood falling back into the right ventricle from the pulmonary trunk as it relaxes',
      'Stops blood flowing back into the left atrium while the left ventricle is contracting',
      'Diverts blood into the coronary arteries while the left ventricle is still contracting'
    ],
    note: 'Its closure is what fills the coronary arteries — they open just above these cusps.'
  },

  /* ─────────── Great vessels ─────────── */
  {
    term: 'Superior vena cava', group: 'great_vessels',
    fn: 'Returns deoxygenated blood from the head, neck, arms and chest wall to the right atrium',
    wrong: [
      'Returns deoxygenated blood from everything below the diaphragm to the right atrium',
      'Returns oxygenated blood from both lungs to the left atrium, entering it from behind',
      'Carries oxygenated blood up out of the aortic arch toward the head, neck and arms'
    ],
    note: 'Superior = drains above the diaphragm. Both venae cavae empty into the RIGHT atrium.'
  },
  {
    term: 'Inferior vena cava', group: 'great_vessels',
    fn: 'Returns deoxygenated blood from everything below the diaphragm to the right atrium',
    wrong: [
      'Returns deoxygenated blood from the head, neck, arms and chest wall to the right atrium',
      'Carries oxygenated blood down through the abdomen to supply the gut, kidneys and legs',
      'Returns oxygenated blood from both lungs to the left atrium, entering it from behind'
    ],
    note: 'It pierces the diaphragm and enters the right atrium low and posteriorly.'
  },
  {
    term: 'Cardiac veins', group: 'great_vessels',
    fn: 'Drain deoxygenated blood out of the heart muscle itself and deliver it to the coronary sinus',
    wrong: [
      'Deliver oxygenated blood to the heart muscle itself, branching off the ascending aorta',
      'Return deoxygenated blood from the head, neck and arms directly into the right atrium',
      'Carry oxygenated blood back from the lungs and empty it into the left atrium behind'
    ],
    note: 'Great cardiac vein runs with the anterior interventricular artery; middle cardiac vein runs on the back.'
  },
  {
    term: 'Coronary sinus', group: 'great_vessels',
    fn: 'A wide vein on the back of the heart that collects the cardiac veins and empties into the right atrium',
    wrong: [
      'A wide vein on the back of the heart that collects the cardiac veins and empties into the left atrium',
      'The pocket behind each aortic valve cusp from which the two coronary arteries arise',
      'The groove circling the heart between atria and ventricles, holding the right coronary artery'
    ],
    note: 'It sits in the posterior coronary sulcus and is the third opening into the right atrium.'
  },
  {
    term: 'Pulmonary trunk', group: 'great_vessels',
    fn: 'Carries deoxygenated blood out of the right ventricle and splits into the right and left pulmonary arteries',
    wrong: [
      'Carries oxygenated blood out of the left ventricle, and gives rise to the two arteries feeding the heart itself',
      'Collects oxygenated blood coming back from both lungs and delivers it into the left atrium',
      'Carries deoxygenated blood from the chest wall and abdomen back into the right atrium'
    ],
    note: 'It crosses in front of the aorta as it leaves the heart, then divides under the aortic arch.'
  },
  {
    term: 'R & L pulmonary arteries', group: 'great_vessels',
    fn: 'Carry deoxygenated blood from the pulmonary trunk into the lungs — the only arteries carrying deoxygenated blood',
    wrong: [
      'Carry oxygenated blood from the lungs back to the left atrium — the only veins carrying oxygenated blood',
      'Carry oxygenated blood out of the aortic arch to supply the head, the neck and both upper limbs',
      'Supply the lung tissue itself with oxygenated blood, branching off the thoracic aorta behind'
    ],
    note: 'Arteries always lead AWAY from the heart — that is what makes them arteries, not their oxygen content.'
  },
  {
    term: 'R & L pulmonary veins', group: 'great_vessels',
    fn: 'Carry oxygenated blood from the lungs to the left atrium — the only veins carrying oxygenated blood',
    wrong: [
      'Carry deoxygenated blood from the right ventricle out to the lungs — the only arteries in the body that do',
      'Return deoxygenated blood from the lung tissue itself into the veins of the chest wall',
      'Carry oxygenated blood out of the left ventricle and on toward the rest of the body'
    ],
    note: 'Four of them, entering the left atrium from behind — two per lung.'
  },
  {
    term: 'Ascending aorta', group: 'great_vessels',
    fn: 'The first stretch of aorta leaving the left ventricle; the coronary arteries branch from it',
    wrong: [
      'The stretch that curves over the heart, giving off the arteries to the head and arms',
      'The stretch running down behind the heart, supplying the thorax and the abdomen',
      'The vessel leaving the right ventricle that divides to reach both of the lungs'
    ],
    note: 'Ascending → arch → descending. Only the ascending part feeds the heart itself.'
  },
  {
    term: 'Aortic arch', group: 'great_vessels',
    fn: 'Curves over the heart and gives off the branches supplying the head, neck and upper limbs',
    wrong: [
      'Leaves the left ventricle and immediately gives off the two coronary arteries',
      'Runs downward behind the heart, supplying the thoracic and abdominal organs',
      'Carries deoxygenated blood out of the right ventricle toward the capillary beds of both of the lungs'
    ],
    note: 'Its three branches, left to right on the model: brachiocephalic trunk, left common carotid, left subclavian.'
  },
  {
    term: 'Descending aorta', group: 'great_vessels',
    fn: 'Runs down behind the heart through the thorax and abdomen, supplying the trunk and lower body',
    wrong: [
      'Curves over the top of the heart and gives off the branches to the head, neck and both upper limbs',
      'Leaves the left ventricle and gives rise to the arteries feeding the heart muscle',
      'Returns deoxygenated blood from the whole lower body up into the right atrium'
    ],
    note: 'Called thoracic aorta above the diaphragm and abdominal aorta below it.'
  },
  {
    term: 'R & L coronary arteries', group: 'great_vessels',
    fn: 'Branch off the ascending aorta to supply the heart muscle itself with oxygenated blood',
    wrong: [
      'Drain used blood out of the heart muscle and carry it into the coronary sinus',
      'Branch off the aortic arch to supply the head, the neck and both upper limbs',
      'Carry deoxygenated blood from the right ventricle to the capillaries of the lungs'
    ],
    note: 'They fill during ventricular RELAXATION — while the ventricle contracts, the vessels are squeezed shut.'
  },
  {
    term: 'Ligamentum arteriosum', group: 'great_vessels',
    fn: 'A fibrous cord between the pulmonary trunk and aortic arch — the remnant of the fetal ductus arteriosus',
    wrong: [
      'A dimple in the wall between the two atria — the remnant of the fetal foramen ovale',
      'A fibrous band tying the pericardial sac down onto the diaphragm so the heart cannot swing inside the chest',
      'A band of conducting tissue that carries the impulse out to the right ventricle wall'
    ],
    note: 'In the fetus the duct shunted blood past the unused lungs; after birth it seals into this cord.'
  },

  /* ─────────── Layers of the Heart Wall ─────────── */
  {
    term: 'Mediastinum', group: 'heart_wall',
    fn: 'The central compartment of the thoracic cavity, between the lungs, holding the heart and great vessels',
    wrong: [
      'The double-walled sac immediately around the heart, anchoring it and limiting its filling',
      'The fluid-filled slit between the two serous pericardial layers, in which the heart beats without friction',
      'The fluid-filled space between the lung surface and the chest wall on either side'
    ],
    note: 'It is a region, not a membrane — trachea and oesophagus are in there too.'
  },
  {
    term: 'Pericardial sac', group: 'heart_wall',
    fn: 'The double-walled sac enclosing the heart, anchoring it in place and keeping it from overfilling',
    wrong: [
      'The double membrane enclosing each lung, letting it slide freely against the chest wall',
      'The outermost layer of the heart wall itself, carrying fat and the coronary vessels',
      'The thick middle layer of the heart wall, whose contraction does the actual pumping'
    ],
    note: 'Sac = fibrous layer + serous layer together.'
  },
  {
    term: 'Fibrous layer', group: 'heart_wall',
    fn: 'The tough outer pericardial layer that resists overstretching and anchors the heart to diaphragm and sternum',
    wrong: [
      'The thin slippery pericardial layer that secretes the fluid the beating heart slides in',
      'The layer fused to the heart surface itself, carrying the coronary arteries in their fat',
      'The smooth endothelial lining inside the chambers, which keeps blood from clotting as it passes through them'
    ],
    note: 'Dense connective tissue — it is why a healthy heart cannot simply balloon out.'
  },
  {
    term: 'Serous layer', group: 'heart_wall',
    fn: 'The thin, slippery double layer of the pericardium that secretes fluid so the heart beats without friction',
    wrong: [
      'The tough outer connective tissue layer that stops the heart from overfilling with blood',
      'The thick middle layer of the heart wall, built of cardiac muscle joined into a syncytium',
      'The endothelial sheet lining the inside of every chamber and covering both faces of each of the four valves'
    ],
    note: 'It has two sheets: parietal (lining the fibrous layer) and visceral (the epicardium).'
  },
  {
    term: 'Pericardial cavity', group: 'heart_wall',
    fn: 'The thin space between the parietal and visceral serous layers, holding the fluid the heart slides in',
    wrong: [
      'The thin space between the two pleural layers, holding the fluid that each lung slides against as it inflates',
      'The chamber inside the heart itself that fills with blood coming back from the body',
      'The compartment between the two lungs in which the heart and great vessels sit'
    ],
    note: 'A potential space — it holds only a few millilitres unless something goes wrong.'
  },
  {
    term: 'Epicardium', group: 'heart_wall',
    fn: 'The outermost layer of the heart wall — the visceral serous pericardium, carrying fat and the coronary vessels',
    wrong: [
      'The innermost lining of the heart chambers and of the valves, continuous with the endothelium lining every vessel',
      'The thick middle layer of cardiac muscle, whose contraction generates the whole pumping force',
      'The tough outer bag of connective tissue that anchors the heart to the diaphragm and sternum'
    ],
    note: 'EPI = on top. ENDO = inside. The epicardium IS the visceral pericardium — one structure, two names.'
  },
  {
    term: 'Myocardium', group: 'heart_wall',
    fn: 'The thick middle layer of cardiac muscle whose contraction pumps the blood',
    wrong: [
      'The outer layer on the heart surface, holding fat and the coronary vessels',
      'The smooth inner lining of the chambers, reducing friction on flowing blood',
      'The serous membrane whose fluid lets the heart beat without rubbing its sac'
    ],
    note: 'Thickest in the left ventricle. Everything else in the wall is packaging around this.'
  },
  {
    term: 'Endocardium', group: 'heart_wall',
    fn: 'The smooth inner lining of the chambers and valves, continuous with the lining of the blood vessels',
    wrong: [
      'The outer covering on the surface of the heart, also known as the visceral layer of the serous pericardium',
      'The muscular layer whose contraction ejects the blood out of the ventricles each beat',
      'The serous membrane whose fluid lets the heart beat inside its sac without friction'
    ],
    note: 'Simple squamous endothelium — its slickness is what stops clots forming inside the chambers.'
  },

  /* ─────────── Electrical Conduction ─────────── */
  {
    term: 'Sinoatrial (SA) node', group: 'conduction',
    fn: 'The pacemaker — it fires on its own and sets the rate of every heartbeat',
    wrong: [
      'The relay that holds the impulse up so the atria can empty before the ventricles fire',
      'The bundle that carries the impulse down through the interventricular septum',
      'The network that spreads the impulse through the ventricle walls from the apex up'
    ],
    note: 'In the right atrial wall near the entrance of the superior vena cava. Fastest intrinsic rate wins, so it leads.'
  },
  {
    term: 'Atrioventricular (AV) node', group: 'conduction',
    fn: 'Holds the impulse up about a tenth of a second so the atria finish emptying before the ventricles contract',
    wrong: [
      'Fires spontaneously to start each heartbeat and to set the resting rate at somewhere around 75 beats a minute',
      'Carries the impulse down along the two sides of the interventricular septum',
      'Delivers the impulse out into the ventricular muscle so the walls contract'
    ],
    note: 'It is also the only electrical route between atria and ventricles — the fibrous skeleton insulates everywhere else.'
  },
  {
    term: 'Atrioventricular bundle (of His)', group: 'conduction',
    fn: 'Carries the impulse from the AV node through the fibrous skeleton and into the interventricular septum',
    wrong: [
      'Generates the impulse that begins each cardiac cycle and sets the pace that the rest of the heart then follows',
      'Pauses the impulse so the ventricles cannot fire while the atria are still emptying',
      'Spreads the impulse sideways across both atria so they contract at the same moment'
    ],
    note: 'The only muscular bridge that crosses the atrioventricular fibrous ring.'
  },
  {
    term: 'R & L bundle branches', group: 'conduction',
    fn: 'Carry the impulse down either side of the interventricular septum toward the apex of the heart',
    wrong: [
      'Carry the impulse across the atrial wall from the sinoatrial node to the AV node',
      'Deliver the impulse from the septum outward into the walls of both the ventricles',
      'Delay the impulse briefly so that atrial contraction can finish before the ventricles'
    ],
    note: 'They run inside the septum, then hand off to Purkinje fibres at the apex.'
  },
  {
    term: 'Purkinje fibers', group: 'conduction',
    fn: 'Spread the impulse through the ventricular muscle so the ventricles contract from the apex upward',
    wrong: [
      'Carry the impulse down the two sides of the septum toward the apex of the heart',
      'Set the resting heart rate by firing spontaneously faster than anything else can',
      'Delay conduction between the atria and the ventricles by about a tenth of a second, so the atria empty first'
    ],
    note: 'Bottom-up contraction is what squeezes blood toward the valves at the top rather than sloshing it around.'
  },

  /* ─────────── Respiratory: nose, palate & pharynx ─────────── */
  {
    term: 'External nares', group: 'resp_upper',
    fn: 'The nostril openings that admit air into the nasal cavity',
    wrong: [
      'The rear openings that pass air on into the nasopharynx',
      'The openings through which the sinuses drain into the nose',
      'The opening between the vocal cords into the lower airway'
    ],
    note: 'External nares = nostrils in front. Internal nares (choanae) are the pair at the back.'
  },
  {
    term: 'Nasal cavity', group: 'resp_upper',
    fn: 'Warms, moistens and filters incoming air, and houses the receptors for smell',
    wrong: [
      'Carries both air and food down from the back of the mouth toward the oesophagus',
      'Routes air into the trachea and food into the oesophagus, and houses the vocal cords',
      'Provides the surface where oxygen and carbon dioxide cross between air and blood'
    ],
    note: 'Three jobs: condition the air, trap debris, smell.'
  },
  {
    term: 'Superior concha', group: 'resp_upper',
    fn: 'The highest scroll of bone in the cavity; it sits beside the olfactory epithelium and swirls air toward it',
    wrong: [
      'The lowest and largest scroll, which does most of the warming and moistening of the air',
      'The middle scroll, projecting from the ethmoid bone into the centre of the nasal cavity',
      'The bony shelf below the cavity that separates it from the mouth, so that you can chew and go on breathing'
    ],
    note: 'All three conchae create turbulence; the superior one is the one associated with smell.'
  },
  {
    term: 'Middle concha', group: 'resp_upper',
    fn: 'The middle scroll of bone, part of the ethmoid, adding turbulence so air is conditioned and debris trapped',
    wrong: [
      'The topmost and smallest of the scrolls, sitting right beside the epithelium that carries the sense of smell',
      'The lowest and largest scroll, and the only one of the three that is a separate bone',
      'The air groove underneath a scroll, into which the paranasal sinuses empty their mucus'
    ],
    note: 'Concha = the scroll itself. The meatus is the groove underneath it.'
  },
  {
    term: 'Inferior concha', group: 'resp_upper',
    fn: 'The lowest and largest scroll — a separate bone — doing most of the warming and moistening of the air',
    wrong: [
      'The topmost and smallest scroll, sitting beside the epithelium that carries the sense of smell',
      'The middle scroll, which is not its own bone but a projection of the ethmoid into the cavity',
      'The groove below the lowest scroll, which receives the duct draining tears from the eye'
    ],
    note: 'Superior and middle conchae are parts of the ethmoid; the inferior concha is its own bone.'
  },
  {
    term: 'Superior meatus', group: 'resp_upper',
    fn: 'The air groove under the superior concha, into which the posterior ethmoid sinuses drain',
    wrong: [
      'The air groove under the middle concha, draining the frontal and maxillary sinuses',
      'The air groove under the inferior concha, which receives the nasolacrimal duct',
      'The scroll of bone itself, which stirs the incoming air into useful turbulence'
    ],
    note: 'Each meatus is named for the concha ABOVE it, and each drains a different set of sinuses.'
  },
  {
    term: 'Middle meatus', group: 'resp_upper',
    fn: 'The air groove under the middle concha, draining the frontal, maxillary and anterior ethmoid sinuses',
    wrong: [
      'The air groove under the superior concha, draining the posterior ethmoid sinuses only',
      'The air groove under the inferior concha, receiving the duct that drains tears from the eye',
      'The scroll of ethmoid bone itself, which projects into the cavity and stirs the air passing it'
    ],
    note: 'Most sinus drainage lands here — which is why blockage at this spot causes sinusitis.'
  },
  {
    term: 'Inferior meatus', group: 'resp_upper',
    fn: 'The air groove under the inferior concha, which receives the nasolacrimal duct draining tears from the eye',
    wrong: [
      'The air groove under the middle concha, which receives the frontal, maxillary and anterior ethmoid sinuses',
      'The air groove under the superior concha, which receives the posterior ethmoid sinuses',
      'The largest of the three bony scrolls, which conditions most of the air coming into the nose'
    ],
    note: 'This is why crying makes your nose run.'
  },
  {
    term: 'Pharynx', group: 'resp_upper',
    fn: 'The muscular funnel behind the nose and mouth, passing air toward the larynx and food toward the oesophagus',
    wrong: [
      'The cartilage box below it that holds the vocal cords and keeps the airway propped open',
      'The cavity above it that warms, moistens and filters air before it goes any further in',
      'The cartilage-ringed tube below it that carries air down the neck to the point where it splits toward both lungs'
    ],
    note: 'Throat. Shared by both systems, and split into three named floors.'
  },
  {
    term: 'Nasopharynx', group: 'resp_upper',
    fn: 'The top floor of the pharynx, behind the nasal cavity — air only, and it holds the auditory tube openings',
    wrong: [
      'The middle floor, behind the mouth, carrying both air and food and holding the palatine tonsils',
      'The bottom floor, where the shared passage finally splits into airway in front and gut behind',
      'The chamber in front of it that warms and filters the air before it ever reaches the throat'
    ],
    note: 'Air only — the soft palate shuts it off the moment you swallow.'
  },
  {
    term: 'Opening of auditory tube', group: 'resp_upper',
    fn: 'Lets air pass between the nasopharynx and the middle ear so pressure on the eardrum can equalise',
    wrong: [
      'Lets the paranasal sinuses drain their mucus down into the nasal cavity through a meatus',
      'Lets tears drain from the eye into the nasal cavity through the nasolacrimal duct below',
      'Lets air pass from the pharynx into the larynx once the epiglottis has lifted clear again'
    ],
    note: 'It is why your ears pop when you swallow on a plane — and why throat infections reach the ear.'
  },
  {
    term: 'Oropharynx', group: 'resp_upper',
    fn: 'The middle floor of the pharynx, behind the mouth, carrying both air and food and holding the palatine tonsils',
    wrong: [
      'The top floor, behind the nose, carrying air alone and holding the pharyngeal tonsil and the auditory tube openings',
      'The bottom floor, where the shared passage finally divides into the airway and the oesophagus',
      'The flap of elastic cartilage that folds back over the airway every time that you swallow'
    ],
    note: 'It starts where the soft palate ends — the first floor food ever enters.'
  },
  {
    term: 'Laryngopharynx', group: 'resp_upper',
    fn: 'The bottom floor of the pharynx, where the path divides — air forward into the larynx, food back into the oesophagus',
    wrong: [
      'The top floor, which handles air alone and connects through the auditory tubes to the middle ear on either side of the head',
      'The middle floor, sitting behind the mouth, where swallowed food first joins the airway',
      'The cartilage-walled box just in front of it that holds the vocal cords and makes the voice'
    ],
    note: 'The junction itself. The epiglottis is the switch that decides which way things go.'
  },
  {
    term: 'Hard palate', group: 'resp_upper',
    fn: 'The bony roof of the mouth that separates nasal cavity from oral cavity so you can chew and breathe at once',
    wrong: [
      'The muscular back of the roof of the mouth, which rises to block off the nasopharynx every time that you swallow',
      'The fleshy tag hanging behind it, which swings up to help seal the nose off during swallowing',
      'The flap of elastic cartilage that folds down over the larynx each time that you swallow'
    ],
    note: 'Hard = bone, front. Soft = muscle, back, and it moves.'
  },
  {
    term: 'Soft palate', group: 'resp_upper',
    fn: 'The muscular back of the palate, which lifts during swallowing to seal off the nasopharynx',
    wrong: [
      'The bony front of the palate, which lets you chew and breathe at the same time',
      'The cartilage flap that closes the entrance to the larynx as the bolus goes past',
      'The muscular tube behind it that pushes the swallowed bolus down to the stomach'
    ],
    note: 'When it fails, you get food coming out of your nose — that is exactly the job it does.'
  },
  {
    term: 'Uvula', group: 'resp_upper',
    fn: 'The fleshy tag on the soft palate that swings up with it to help seal the nasopharynx during swallowing',
    wrong: [
      'The flap of elastic cartilage in the throat that swings down to cover the larynx every time that you swallow',
      'The bony shelf in the roof of the mouth that separates the nasal cavity from the mouth',
      'The pair of lymphoid masses on either side of the back of the mouth, trapping pathogens'
    ],
    note: 'It also triggers the gag reflex when touched.'
  },

  /* ─────────── Larynx ─────────── */
  {
    term: 'Larynx', group: 'larynx',
    fn: 'Keeps the airway open, routes air and food to the right tubes, and houses the vocal cords',
    wrong: [
      'Carries air down from the throat to the point where it splits toward the two lungs',
      'Warms, moistens and filters the air on its way in, and carries the sense of smell',
      'Serves as the shared passage in which the air and food streams cross one another'
    ],
    note: 'Voice box — nine cartilages, and the top of the airway proper.'
  },
  {
    term: 'Epiglottis', group: 'larynx',
    fn: 'A flap of elastic cartilage that folds over the laryngeal opening during swallowing, sending food to the oesophagus',
    wrong: [
      'The opening between the vocal cords themselves, through which all the air must pass on its way to the lower airway',
      'The muscular flap at the back of the roof of the mouth, which closes the nasal route as you swallow',
      'The one complete ring of cartilage in the airway, holding the bottom of the larynx permanently open'
    ],
    note: 'Epiglottis = the lid. Glottis = the hole it covers. Do not swap them.'
  },
  {
    term: 'Thyroid cartilage', group: 'larynx',
    fn: 'The large shield-shaped cartilage forming the front wall of the larynx and anchoring the vocal cords',
    wrong: [
      'The complete signet-ring cartilage below it, joining the larynx to the top of the trachea',
      'The leaf-shaped flap above it, which folds over the airway opening every time you swallow',
      'The stack of C-shaped rings below it, which keep the windpipe from collapsing as you breathe'
    ],
    note: 'The Adam’s apple. Shield in front, open at the back.'
  },
  {
    term: 'Cricoid cartilage', group: 'larynx',
    fn: 'The only complete ring of cartilage in the airway; it supports the larynx and joins it to the trachea',
    wrong: [
      'The shield-shaped plate in front of it that forms the Adam’s apple and anchors the front end of the vocal cords',
      'The leaf-shaped flap above it that covers the laryngeal opening while you are swallowing',
      'The pair of elastic folds inside it that vibrate in the airstream to produce the voice'
    ],
    note: 'Signet-ring shaped — narrow in front, tall at the back — and the only unbroken ring anywhere in the airway.'
  },
  {
    term: 'Cricothyroid ligament', group: 'larynx',
    fn: 'Connects the cricoid cartilage to the thyroid cartilage, and is the spot cut for an emergency airway',
    wrong: [
      'Connects the larynx to the hyoid bone above it, suspending the whole box in the neck',
      'Connects the two vocal folds across the midline so they can be tensed symmetrically',
      'Ties the lower end of the trachea down onto the fibrous sac surrounding the heart, behind the sternum'
    ],
    note: 'A cricothyrotomy goes through here because there is nothing but membrane between skin and airway.'
  },
  {
    term: 'Glottis', group: 'larynx',
    fn: 'The vocal folds plus the opening between them — the airway through the larynx and the source of sound',
    wrong: [
      'The cartilage flap that folds down over that opening the moment you swallow',
      'The shield-shaped cartilage forming the front wall of the larynx, which anchors the vocal cords inside it',
      'The space at the back of the mouth where the air and food paths cross over'
    ],
    note: 'Cords + opening. Air passing through it makes them vibrate.'
  },
  {
    term: 'Vocal cords', group: 'larynx',
    fn: 'Elastic folds that vibrate as air rushes past them, producing sound; their tension sets the pitch',
    wrong: [
      'Folds sitting just above them that protect the airway but produce no sound at all',
      'The lid that closes the airway so that swallowed food passes into the oesophagus',
      'The stacked rings of cartilage below them, holding the airway open all the way down toward the lungs'
    ],
    note: 'The true vocal cords (folds) make the sound; the vestibular folds above are the "false" ones.'
  },

  /* ─────────── Trachea & bronchial tree ─────────── */
  {
    term: 'Trachea', group: 'trachea_bronchi',
    fn: 'Carries air from the larynx down toward the lungs, held open by C-shaped rings of cartilage',
    wrong: [
      'Carries food from the pharynx down to the stomach, running just behind the airway',
      'Houses the vocal cords and routes air and food into the correct tube below it',
      'Divides immediately to deliver air into each of the five lobes of the two lungs'
    ],
    note: 'The rings are open at the back so a swallowed bolus can bulge the oesophagus forward.'
  },
  {
    term: 'Carina', group: 'trachea_bronchi',
    fn: 'The ridge of cartilage at the fork of the trachea; it is highly sensitive and sets off coughing',
    wrong: [
      'The one complete ring of cartilage in the whole airway, sitting at the bottom of the larynx above it',
      'The ridge of muscle inside the atrial wall that lets that chamber stretch',
      'The flap of cartilage that closes off the airway each time that you swallow'
    ],
    note: 'Last tracheal cartilage, right at the split into the two primary bronchi.'
  },
  {
    term: 'R & L primary bronchi', group: 'trachea_bronchi',
    fn: 'The two branches off the trachea — one carrying air into each lung',
    wrong: [
      'The next branches down, one carrying air into each lobe of a lung',
      'The branches beyond those, supplying each bronchopulmonary segment',
      'The smallest airways, whose muscle sets how much air gets through'
    ],
    note: 'The right one is wider and more vertical, which is why inhaled objects land in the right lung.'
  },
  {
    term: 'R & L secondary bronchi', group: 'trachea_bronchi',
    fn: 'Carry air into each lobe — three of them on the right, two on the left',
    wrong: [
      'Carry air from the trachea into each whole lung, one to either side',
      'Carry air into the individual bronchopulmonary segments of a lobe',
      'Carry air the last stretch from the bronchioles into the alveolar sacs'
    ],
    note: 'Also called lobar bronchi — count them and you know which lung you are looking at.'
  },
  {
    term: 'R & L tertiary bronchi', group: 'trachea_bronchi',
    fn: 'Carry air into the individual bronchopulmonary segments within each lobe',
    wrong: [
      'Carry air into each whole lobe — three on the right side, two on the left',
      'Carry air from the bottom of the trachea into each lung as a whole',
      'Are the first airways in the tree to lose their cartilage altogether'
    ],
    note: 'Also called segmental bronchi. Each segment can be removed surgically on its own.'
  },

  /* ─────────── Lung lobes ─────────── */
  {
    term: 'Right superior', group: 'lung_lobes',
    ask: 'Which describes the right superior lobe?',
    fn: 'The top lobe of the three-lobed right lung, lying above the horizontal fissure',
    wrong: [
      'The top lobe of the two-lobed left lung, the one carrying the cardiac notch',
      'The small wedge between the horizontal and oblique fissures on the right',
      'The bottom lobe on the right, taking up most of the back of that lung'
    ],
    note: 'Right lung = 3 lobes, left = 2. That difference is a favourite exam tag.'
  },
  {
    term: 'Right middle', group: 'lung_lobes',
    ask: 'Which describes the right middle lobe?',
    fn: 'The small wedge between the horizontal and oblique fissures — the lobe the left lung has no match for',
    wrong: [
      'The uppermost lobe on the right, sitting above the horizontal fissure at the top of the lung',
      'The lower lobe on the right, below the oblique fissure and resting down on the diaphragm',
      'The upper lobe on the left, carrying the notch that makes room for the heart beside it'
    ],
    note: 'The only middle lobe in the body — the left lung gives that space to the heart instead.'
  },
  {
    term: 'Right inferior', group: 'lung_lobes',
    ask: 'Which describes the right inferior lobe?',
    fn: 'The lobe below the oblique fissure on the right, forming most of the back and base of that lung',
    wrong: [
      'The lobe below the oblique fissure on the left, which sits directly on top of the diaphragm',
      'The lobe above the horizontal fissure on the right, at the very top of that three-lobed lung',
      'The small wedge lying between the two fissures on the right, with no equivalent on the left'
    ],
    note: 'Because the oblique fissure runs backward and down, the "inferior" lobes are largely posterior.'
  },
  {
    term: 'Left superior', group: 'lung_lobes',
    ask: 'Which describes the left superior lobe?',
    fn: 'The upper of the two left lobes — it carries the cardiac notch that makes room for the heart',
    wrong: [
      'The upper of the three right lobes, sitting above the horizontal fissure of that lung',
      'The lower left lobe, lying below the oblique fissure and resting on the diaphragm',
      'The small middle wedge between two fissures, which exists only on the right side'
    ],
    note: 'Cardiac notch and lingula are both on this lobe — they are how you tell a left lung from a right.'
  },
  {
    term: 'Left inferior', group: 'lung_lobes',
    ask: 'Which describes the left inferior lobe?',
    fn: 'The lower of the two left lobes, below the oblique fissure and resting on the diaphragm',
    wrong: [
      'The lower of the three right lobes, below the oblique fissure on that side of the chest',
      'The upper left lobe, the one carrying the cardiac notch and the tongue-like lingula',
      'The wedge found between the horizontal and oblique fissures, present on one side only'
    ],
    note: 'The left lung has only an oblique fissure — no horizontal one, so only two lobes.'
  },

  /* ─────────── Pleural membranes ─────────── */
  {
    term: 'Visceral pleura', group: 'pleura',
    fn: 'The membrane stuck to the lung surface itself, dipping down into the fissures between the lobes',
    wrong: [
      'The membrane lining the inside of the chest wall, the diaphragm and the sides of the mediastinum',
      'The fluid-filled gap between the two pleural membranes, which lets the lung slide',
      'The membrane covering the heart surface, carrying its fat and coronary vessels'
    ],
    note: 'Visceral = on the organ. Parietal = on the wall. Same rule as the pericardium.'
  },
  {
    term: 'Parietal pleura', group: 'pleura',
    fn: 'The membrane lining the inside of the chest wall, the diaphragm and the sides of the mediastinum',
    wrong: [
      'The membrane bonded to the lung surface itself, dipping into the fissures between lobes',
      'The slippery fluid-filled space between the lung surface and the wall of the chest',
      'The tough outer bag of connective tissue that holds the heart down in the chest'
    ],
    note: 'This is the layer with pain fibres — pleuritic chest pain comes from here, not from the lung.'
  },
  {
    term: 'Pleural cavity', group: 'pleura',
    fn: 'The fluid-filled space between the pleurae; its surface tension makes the lung follow the expanding chest wall',
    wrong: [
      'The fluid-filled space between the two serous pericardial layers, letting the heart beat inside its sac without friction',
      'The air space deep inside the lung where oxygen and carbon dioxide cross into and out of blood',
      'The compartment between the two lungs that contains the heart, trachea and great vessels'
    ],
    note: 'Break the seal — a pneumothorax — and the lung collapses even though the lung itself is undamaged.'
  },

  /* ─────────── Respiratory muscles ─────────── */
  {
    term: 'Diaphragm', group: 'resp_muscles',
    fn: 'The main muscle of quiet breathing in: it contracts and flattens, enlarging the chest so air is drawn in',
    wrong: [
      'The muscle layer that pulls the ribs up and out, widening the chest during inhalation',
      'The muscle layer that pulls the ribs down and inward, forcing air out during hard exhalation and coughing',
      'The muscle that relaxes and domes upward in order to draw fresh air into the lungs'
    ],
    note: 'It moves DOWN when it contracts. Quiet exhalation is just this muscle relaxing.'
  },
  {
    term: 'External intercostal', group: 'resp_muscles',
    fn: 'Pulls the ribs up and out to widen the chest during inhalation',
    wrong: [
      'Pulls the ribs down and in to force air out during hard exhalation',
      'Flattens downward to increase the vertical depth of the chest cavity',
      'Holds the ribs steady so the lungs can recoil on their own afterwards'
    ],
    note: 'Fibres run down-and-forward, like hands in your front pockets. External = inhale.'
  },
  {
    term: 'Internal intercostal', group: 'resp_muscles',
    fn: 'Pulls the ribs down and in to force air out during hard exhalation, coughing or speech',
    wrong: [
      'Pulls the ribs up and out to draw air in during ordinary quiet inhalation',
      'Relaxes and domes upward during inhalation, increasing the vertical depth of the chest',
      'Separates the thoracic cavity from the abdominal cavity below the ribcage'
    ],
    note: 'Deeper layer, fibres at right angles to the externals. Quiet breathing out uses neither — it is passive recoil.'
  },

  /* ─────────── Human Blood (slide #16) ─────────── */
  {
    term: 'Platelets', group: 'blood',
    fn: 'Cell fragments that stick to a damaged vessel wall, plug it, and set off clotting',
    wrong: [
      'Cells packed with haemoglobin that carry oxygen out to every tissue in the body',
      'Cells that leave the bloodstream to fight infection and clear away dead tissue',
      'The straw-coloured fluid carrying the cells, the clotting proteins and the salts'
    ],
    note: 'Not whole cells — fragments shed from megakaryocytes. Smallest things on the slide.'
  },
  {
    term: 'Leukocytes', group: 'blood',
    fn: 'White blood cells — they defend against infection and clear away damaged tissue',
    wrong: [
      'Red blood cells — they carry oxygen from the lungs out to the working tissues',
      'Cell fragments that clump at a wound and seal small breaks in a vessel wall',
      'Plasma proteins that turn into fibrin threads and make the blood clot solid'
    ],
    note: 'The only cells on the slide with a nucleus — that is how you spot them among the red cells.'
  },
  {
    term: 'Erythrocytes', group: 'blood',
    fn: 'Carry oxygen bound to haemoglobin, and help carry carbon dioxide back to the lungs',
    wrong: [
      'Engulf invading bacteria and clear the debris out of infected or damaged tissue',
      'Produce the antibodies that mark specific invaders for destruction by other cells',
      'Clump together at a break in a vessel wall and plug the leak until it can heal'
    ],
    note: 'Biconcave discs with no nucleus — maximum surface area, maximum room for haemoglobin.'
  },
  {
    term: 'Neutrophil', group: 'blood',
    fn: 'The commonest white cell — first to arrive at a bacterial infection, which it phagocytoses',
    wrong: [
      'Attacks parasitic worms too large for one cell to swallow, and damps down allergic reactions',
      'Releases histamine and heparin to drive and sustain the inflammatory response',
      'Leaves the blood and matures into a macrophage in chronically infected tissue'
    ],
    note: 'Multi-lobed nucleus, pale granules, 50–70% of white cells. If it is a WBC and there are lots of them, it is this.'
  },
  {
    term: 'Eosinophil', group: 'blood',
    fn: 'Attacks parasitic worms and moderates allergic reactions',
    wrong: [
      'Swallows bacteria as first responder to acute infection',
      'Releases histamine and heparin at an inflamed site',
      'Produces antibodies against one specific invader'
    ],
    note: 'Bilobed nucleus and red-orange granules — it takes up the eosin stain.'
  },
  {
    term: 'Basophil', group: 'blood',
    fn: 'Releases histamine to widen vessels and heparin to keep blood from clotting at an inflamed site',
    wrong: [
      'Phagocytoses bacteria in huge numbers, as the first cell to arrive at an acute bacterial infection',
      'Targets parasitic worms too big for one cell to swallow, and damps down allergies',
      'Leaves the bloodstream and matures into a macrophage in the tissues it settles in'
    ],
    note: 'Rarest white cell, deep blue-purple granules so dense they hide the nucleus.'
  },
  {
    term: 'Lymphocyte', group: 'blood',
    fn: 'Runs the specific immune response — T cells attack infected cells, B cells make antibodies',
    wrong: [
      'Swallows bacteria straight away as the first cell to reach an acute infection',
      'Turns into a macrophage once it has migrated out of the blood into the tissues',
      'Releases the histamine and heparin that drive an allergic or inflammatory reaction'
    ],
    note: 'Big round nucleus filling almost the whole cell, with barely a rim of cytoplasm.'
  },
  {
    term: 'Monocyte', group: 'blood',
    fn: 'Leaves the blood and becomes a macrophage, engulfing debris and pathogens in chronic infection',
    wrong: [
      'Stays in the blood and produces antibodies against one specific invading organism',
      'Is the very first cell to reach an acute bacterial infection and swallow the bacteria',
      'Releases the histamine that widens vessels during an allergic or inflammatory response'
    ],
    note: 'Largest white cell, kidney- or horseshoe-shaped nucleus.'
  },

  /* ─────────── Artery, Vein, Nerve (slide #3) ─────────── */
  {
    term: 'Artery', group: 'artery_vein_nerve',
    fn: 'Carries blood away from the heart under high pressure; its thick muscular wall holds the lumen round',
    wrong: [
      'Carries blood back toward the heart at low pressure, with valves to stop it running backwards',
      'Exchanges gases and nutrients with the tissue across a wall that is only one cell thick',
      'Drains excess fluid out of the tissue spaces and returns it to the bloodstream at the neck'
    ],
    note: 'On the slide it is the one that stays open and round with the thickest middle layer.'
  },
  {
    term: 'Vein', group: 'artery_vein_nerve',
    fn: 'Carries blood back toward the heart at low pressure; thin-walled, valved, and holding most of the blood volume',
    wrong: [
      'Carries blood away from the heart under high pressure, its thick muscular wall holding the lumen open and round',
      'Exchanges oxygen and carbon dioxide with the surrounding tissue across a single cell layer',
      'Carries electrical signals between the spinal cord and the muscles and skin of the body'
    ],
    note: 'Floppy, often collapsed or oval on the slide, with a large lumen relative to its wall.'
  },
  {
    term: 'Tunica externa', group: 'artery_vein_nerve',
    fn: 'The outer collagen coat that anchors the vessel to the tissue around it and stops it overstretching',
    wrong: [
      'The middle layer of smooth muscle and elastic fibres whose contraction changes the diameter of the vessel',
      'The inner endothelial lining that gives the blood a frictionless surface to flow over',
      'The open channel down the middle through which the blood itself actually travels'
    ],
    note: 'Also called tunica adventitia. Thickest layer in a vein.'
  },
  {
    term: 'Tunica media', group: 'artery_vein_nerve',
    fn: 'Smooth muscle and elastic fibres that constrict or dilate the vessel, controlling blood pressure and flow',
    wrong: [
      'The outer coat of tough collagen that tethers the vessel to whatever tissue surrounds it',
      'The single layer of flat cells lining the inside, continuous with the lining of the heart',
      'The perforated elastic sheet lying between the innermost and the middle layers, letting the artery recoil'
    ],
    note: 'Thickest layer in an artery — this is the layer that makes an artery an artery.'
  },
  {
    term: 'Tunica interna', group: 'artery_vein_nerve',
    fn: 'The innermost layer — endothelium on a thin basement membrane — giving a slick surface that resists clotting',
    wrong: [
      'The muscular middle layer, whose smooth muscle narrows and widens the vessel to control flow and blood pressure',
      'The tough outer layer of collagen, which holds the vessel in place among its neighbours',
      'The open space down the centre of the vessel that the flowing blood actually occupies'
    ],
    note: 'Also called tunica intima. Its endothelium is continuous with the heart’s endocardium.'
  },
  {
    term: 'Lumen', group: 'artery_vein_nerve', also: ['lung_histo'],
    fn: 'The open space inside a vessel or tube through which blood or air actually moves',
    wrong: [
      'The innermost cell layer lining that space and keeping the surface frictionless',
      'The muscular layer around it whose contraction narrows the space and slows flow',
      'The outer coat of collagen tying the tube to the structures lying alongside it'
    ],
    note: 'The hole, not a tissue. Its diameter is what resistance to flow depends on.'
  },
  {
    term: 'Internal elastic lamina', group: 'artery_vein_nerve',
    fn: 'A perforated sheet of elastin between the inner and middle layers that lets the artery recoil after each pulse',
    wrong: [
      'A sheet of smooth muscle between those two layers, whose contraction actively narrows the vessel and slows the flow',
      'The outermost coat of collagen fibres that anchors the vessel to the surrounding tissue',
      'The thin basement membrane on which the flat cells of the vessel lining sit and divide'
    ],
    note: 'Its wavy line on a stained slide is a reliable way to identify an artery.'
  },
  {
    term: 'Endothelium', group: 'artery_vein_nerve',
    fn: 'The simple squamous lining of every vessel — frictionless, and it releases chemicals that set vessel width',
    wrong: [
      'The sheet of smooth muscle wrapped around that lining, whose contraction changes the diameter of the vessel',
      'The collagen coat outside that, anchoring the vessel to the structures surrounding it',
      'The elastic membrane inside the wall that lets an artery spring back after every beat'
    ],
    note: 'One cell thick everywhere, from the heart chambers out to the capillaries.'
  },

  /* ─────────── Heart, Intercalated Discs (slide #45) ─────────── */
  {
    term: 'Nucleus', group: 'cardiac_muscle',
    fn: 'Holds the cell’s DNA and directs it — in cardiac muscle there are one or two, sitting centrally',
    wrong: [
      'Holds the cell’s DNA — in skeletal muscle there are many, pushed out to the cell edge',
      'Stores and releases the calcium that triggers each contraction of the muscle fibre',
      'Joins one muscle cell to the next so the electrical impulse can pass between them'
    ],
    note: 'Central and few = cardiac. Many and peripheral = skeletal. Easiest way to tell the two slides apart.'
  },
  {
    term: 'Intercalated disc', group: 'cardiac_muscle',
    fn: 'The junction between cardiac cells: desmosomes hold them together, gap junctions pass the impulse on',
    wrong: [
      'The dark band within each sarcomere, where the thick and the thin filaments overlap one another fully',
      'The point where a motor nerve ending delivers its signal across to a muscle cell',
      'The membrane sac wrapped around each fibre that releases calcium into the cytoplasm'
    ],
    note: 'Unique to cardiac muscle, and the reason the heart behaves as a functional syncytium.'
  },
  {
    term: 'Striations', group: 'cardiac_muscle',
    fn: 'The banding produced by lined-up actin and myosin filaments — the machinery that shortens the cell',
    wrong: [
      'The junctions that mechanically and electrically couple one cardiac cell to the next',
      'The branch points where one cardiac fibre splits to join two of its neighbours',
      'The connective tissue sheets that wrap around bundles of muscle fibres and carry vessels'
    ],
    note: 'Cardiac and skeletal muscle both show them; smooth muscle does not.'
  },
  {
    term: 'Myofiber', group: 'cardiac_muscle',
    fn: 'The individual cardiac muscle cell — short, branched, joined end to end with its neighbours',
    wrong: [
      'The long, unbranched, multinucleate muscle cell that is found in skeletal muscle',
      'The junction that ties two cardiac cells together and lets the impulse cross over',
      'The single filament of actin or myosin that slides during a muscle contraction'
    ],
    note: 'Branching is the giveaway on the slide — skeletal fibres run straight and parallel.'
  },

  /* ─────────── Nasal Epithelium (slide #38) ─────────── */
  {
    term: 'Respiratory region', group: 'nasal_epithelium',
    fn: 'The part of the nasal lining that warms, moistens and filters air — ciliated, with goblet cells',
    wrong: [
      'The patch of lining high under the roof of the cavity that carries the receptors for smell',
      'The plate of hyaline cartilage that divides the nasal cavity into a left and a right half',
      'The air groove beneath a bony scroll into which a paranasal sinus drains its mucus'
    ],
    note: 'Nearly all of the cavity. The olfactory region is a small patch up under the roof.'
  },
  {
    term: 'Epithelium', group: 'nasal_epithelium',
    fn: 'The cell layer lining the cavity; it makes the mucus sheet and moves it, conditioning and cleaning the air',
    wrong: [
      'The layer of connective tissue and glands lying underneath that lining and feeding it',
      'The plate of hyaline cartilage that supports the front wall of the nasal cavity',
      'The scroll of bone projecting into the cavity, which stirs the air passing over it into useful turbulence'
    ],
    note: 'Pseudostratified ciliated columnar: it looks layered because the nuclei sit at different heights.'
  },
  {
    term: 'Septal cartilage', group: 'nasal_epithelium',
    fn: 'The hyaline cartilage forming the front of the nasal septum, dividing the cavity and shaping the nose',
    wrong: [
      'The scroll of bone projecting sideways into the cavity to create turbulence in the air',
      'The bony shelf beneath the cavity that separates it from the mouth so you can chew',
      'The stack of C-shaped cartilages further down that keeps the trachea from collapsing as you breathe in'
    ],
    note: 'It is the front, flexible part of the septum — a deviated septum usually means this cartilage.'
  },
  {
    term: 'Cilia', group: 'nasal_epithelium', also: ['trachea_histo', 'lung_histo'],
    fn: 'Hair-like projections that beat in waves, sweeping the mucus sheet and its trapped debris toward the pharynx',
    wrong: [
      'Goblet-shaped cells scattered through the lining that secrete the mucus sheet out onto the surface of the airway',
      'Folds of the cell membrane that multiply the surface area available for absorption',
      'Thin-walled sacs at the end of the airway across which oxygen crosses into the blood'
    ],
    note: 'The mucociliary escalator. In the nose it sweeps back and down; below the larynx it sweeps up.'
  },
  {
    term: 'Goblet cells', group: 'nasal_epithelium', also: ['trachea_histo'],
    fn: 'Scattered cells that secrete mucus, moistening the air and trapping dust, pollen and bacteria',
    wrong: [
      'Hair-like projections on the lining cells that beat to move that mucus along',
      'Cells down in the alveolar wall that make the surfactant which stops the air sac from collapsing',
      'Wandering cells that engulf any particles that make it as far as the alveoli'
    ],
    note: 'Named for their shape — a stem with a full cup of mucus at the top.'
  },

  /* ─────────── Trachea, histology (slide #9) ─────────── */
  {
    term: 'Tracheal cartilage', group: 'trachea_histo',
    fn: 'C-shaped hyaline rings that hold the airway open, incomplete behind so the oesophagus can bulge forward',
    wrong: [
      'Complete rings of hyaline cartilage that encircle the airway fully at every level below',
      'Irregular plates of hyaline cartilage scattered around the wall of a bronchus further down in the lung',
      'The one complete signet-ring cartilage that sits at the bottom of the larynx above it'
    ],
    note: 'C-shaped and stacked — that shape, seen in section, is how you know it is trachea and not bronchus.'
  },
  {
    term: 'Mucosa', group: 'trachea_histo', also: ['lung_histo'],
    fn: 'The innermost lining — epithelium plus the connective tissue under it — which makes and moves the mucus',
    wrong: [
      'The plates or rings of cartilage lying outside it, which keep the airway from collapsing as you breathe',
      'The outer connective tissue coat that binds the airway to the structures alongside it',
      'The band of smooth muscle that closes the gap at the back of each cartilage ring'
    ],
    note: 'Lining + lamina propria. The submucosa with its glands sits just outside it.'
  },
  {
    term: 'Tracheal glands', group: 'trachea_histo',
    fn: 'Glands in the submucosa that pour extra mucus and watery secretion onto the lining through small ducts',
    wrong: [
      'Single goblet cells sitting within the lining itself, releasing their mucus straight onto the surface',
      'Cells down in the alveolar wall that secrete surfactant into the air space they enclose',
      'Nodules of lymphoid tissue in the wall that filter particles out of the passing airstream'
    ],
    note: 'These are multicellular and sit deep to the epithelium — goblet cells are single and sit in it.'
  },

  /* ─────────── Lung, histology (slide #51) ─────────── */
  {
    term: 'Pulmonary artery', group: 'lung_histo',
    fn: 'Brings deoxygenated blood from the right side of the heart to the capillaries around the alveoli',
    wrong: [
      'Carries newly oxygenated blood from the alveolar capillaries back toward the left atrium',
      'Supplies the lung tissue itself with oxygenated blood, branching off the thoracic aorta',
      'Drains lymph out of the lung tissue and returns it to the veins at the base of the neck'
    ],
    note: 'On a slide it runs alongside a bronchus — artery and airway travel together.'
  },
  {
    term: 'Pulmonary vein', group: 'lung_histo',
    fn: 'Collects newly oxygenated blood from the alveolar capillaries and carries it toward the left atrium',
    wrong: [
      'Carries deoxygenated blood from the right ventricle out to the capillaries of the alveoli',
      'Returns deoxygenated blood from the bronchial walls back to the right side of the heart',
      'Carries air from the smallest bronchioles onward into the alveolar ducts and their sacs'
    ],
    note: 'It travels alone in the connective tissue septa, not next to a bronchus — that is how to tell it from the artery.'
  },
  {
    term: 'Bronchi', group: 'lung_histo',
    fn: 'Conducting airways inside the lung, held open by cartilage plates, delivering air toward the bronchioles',
    wrong: [
      'Airways with no cartilage left in their walls, whose ring of smooth muscle sets how much air gets past them',
      'Thin-walled sacs where oxygen and carbon dioxide cross between the air and the blood',
      'Vessels that carry deoxygenated blood inward toward the gas exchange surface itself'
    ],
    note: 'Cartilage present = bronchus. Cartilage gone = bronchiole. That is the whole distinction.'
  },
  {
    term: 'Bronchial cartilage', group: 'lung_histo',
    fn: 'Irregular plates of hyaline cartilage in the bronchial wall that keep the airway from collapsing',
    wrong: [
      'C-shaped rings of hyaline cartilage, stacked one above another along the entire length of the trachea',
      'The single complete ring of cartilage sitting at the base of the larynx above them',
      'Rings of smooth muscle that tighten around the airway and narrow it during an attack'
    ],
    note: 'Plates, not rings — as the bronchi branch, they get smaller and eventually disappear.'
  },
  {
    term: 'Bronchial glands', group: 'lung_histo',
    fn: 'Submucosal glands in the bronchial wall that add mucus and watery secretion to the airway lining',
    wrong: [
      'Single mucus-producing cells that sit within the airway lining itself and empty onto it',
      'Cells in the wall of the alveolus that secrete the surfactant keeping the sac inflated',
      'Clusters of lymphoid tissue in the airway wall that trap and destroy inhaled bacteria'
    ],
    note: 'Same idea as the tracheal glands, one level further down the tree.'
  },
  {
    term: 'Pseudostratified ciliated columnar epithelium', group: 'lung_histo',
    fn: 'The lining of the conducting airways: tall ciliated cells and goblet cells that trap debris and sweep it up',
    wrong: [
      'The single flat cell layer lining the alveolus, thin enough for gases to diffuse straight across it',
      'The stacked, many-layered lining of the mouth and oesophagus, built to survive constant abrasion',
      'The cube-shaped ciliated lining of the smallest bronchioles, where goblet cells have run out'
    ],
    note: 'It looks stratified because the nuclei sit at different levels, but every cell touches the basement membrane.'
  },

  /* ─────────── Lung and Bronchi, histology (slide #52) ─────────── */
  {
    term: 'Bronchioles', group: 'lung_bronchi_histo',
    fn: 'Small airways with no cartilage, ringed by smooth muscle that sets how much air reaches the alveoli',
    wrong: [
      'Airways whose walls are propped permanently open by irregular plates of hyaline cartilage',
      'Thin-walled sacs, wrapped in capillaries, where oxygen crosses from the air into the blood',
      'Ducts that carry mucus from the submucosal glands out onto the surface of the airway'
    ],
    note: 'No cartilage means they can be squeezed shut — which is what happens in an asthma attack.'
  },
  {
    term: 'Bronchiole', group: 'lung_bronchi_histo',
    fn: 'A single cartilage-free airway under 1 mm across, whose smooth muscle widens or narrows to change airflow',
    wrong: [
      'A single airway of the same size held permanently open by cartilage plates in its wall',
      'A single thin-walled sac in which gas is exchanged with the blood in the capillary net',
      'A single small vessel that delivers deoxygenated blood into the capillary net wrapped around the alveoli'
    ],
    note: 'Same structure as the plural entry — the handout lists it twice because the slide shows several at once.'
  },
  {
    term: 'Pulmonary arteriole', group: 'lung_bronchi_histo',
    fn: 'A small branch of the pulmonary artery delivering deoxygenated blood into the capillary net round the alveoli',
    wrong: [
      'A small vessel collecting the freshly oxygenated blood away from that same capillary net and back heartward',
      'A small airway carrying air the last stretch from a bronchiole into the alveolar sacs',
      'A small vessel supplying the bronchial walls themselves with oxygenated systemic blood'
    ],
    note: 'It runs beside a bronchiole. If a small vessel is alone in a septum, suspect a venule instead.'
  },
  {
    term: 'Alveoli', group: 'lung_bronchi_histo',
    fn: 'Thin-walled air sacs, wrapped in capillaries, where oxygen and carbon dioxide cross between air and blood',
    wrong: [
      'Small airways whose muscular walls control how much air arrives further down the tree',
      'The passages linking the respiratory bronchioles to the clusters of thin-walled sacs at the end of the tree',
      'Capillaries that carry blood from the right side of the heart into the lung tissue'
    ],
    note: 'The only place gas exchange actually happens — everything above them just delivers air.'
  },
  {
    term: 'Pulmonary venule', group: 'lung_bronchi_histo',
    fn: 'A small vessel collecting oxygenated blood from the alveolar capillaries and starting it back to the heart',
    wrong: [
      'A small vessel bringing deoxygenated blood from the right side of the heart into those same capillaries',
      'A small airway delivering the last of the air into the alveolar ducts and their sacs',
      'A lymph vessel draining excess fluid out of the alveolar walls and back to the veins'
    ],
    note: 'Venules travel in the connective tissue septa, away from the bronchioles.'
  },
  {
    term: 'Lumen of bronchiole', group: 'lung_bronchi_histo',
    fn: 'The air space inside the bronchiole — the diameter the surrounding smooth muscle narrows or widens',
    wrong: [
      'The blood space inside a small vessel, through which the red cells travel in single file',
      'The layer of smooth muscle wrapped around that air space, which sets its diameter',
      'The air space inside an alveolus, where the gas exchange with the blood takes place'
    ],
    note: 'On a slide it often looks scalloped, because the wall folds inward when the muscle contracts.'
  },
  {
    term: 'Ciliated cuboidal epithelium', group: 'lung_bronchi_histo',
    fn: 'The cube-shaped ciliated lining of the smaller bronchioles, still sweeping debris back up the tree',
    wrong: [
      'The tall ciliated lining, full of goblet cells, that is found in the trachea and bronchi',
      'The single layer of flat cells that forms the alveolar wall where gas exchange happens',
      'The stacked lining of the oropharynx, built in many layers to survive constant abrasion'
    ],
    note: 'As airways narrow, the lining gets shorter: columnar → cuboidal → simple squamous at the alveoli.'
  },
  {
    term: 'Simple squamous epithelium', group: 'lung_bronchi_histo',
    fn: 'The single flat cell layer of the alveolar wall — thin enough for gases to diffuse straight across',
    wrong: [
      'The tall ciliated layer lining the bronchi, which traps debris and sweeps it upward',
      'The cube-shaped ciliated layer that lines the smaller bronchioles, further down the branching tree',
      'The many-layered lining of the pharynx above, which is built to withstand friction'
    ],
    note: 'Thinness is the function — anything thicker would slow diffusion.'
  },
  {
    term: 'Alveolar duct', group: 'lung_bronchi_histo',
    fn: 'The final passage from a respiratory bronchiole into the alveolar sacs, its wall little more than rings of alveoli',
    wrong: [
      'The small airway just upstream of it, still fully walled all the way around and lined by cube-shaped cells',
      'A single thin-walled sac in which gas is exchanged with the blood in the capillaries',
      'The duct through which a submucosal gland empties its mucus onto the airway lining'
    ],
    note: 'Knobs of smooth muscle sit between its alveolar openings — the last of the muscle in the tree.'
  }
];

/* Look-ups the app and the tests both use. */
const FUNCTION_BY_TERM = {};
FUNCTION_ITEMS.forEach(function (it) { FUNCTION_BY_TERM[it.term] = it; });

/* Which questions belong to an objectives group — an item shared by several
   groups (Cilia, Mucosa, Lumen, Goblet cells) shows up under each of them. */
function functionItemsForGroup(groupId) {
    return FUNCTION_ITEMS.filter(function (it) {
        return it.group === groupId || (it.also && it.also.indexOf(groupId) !== -1);
    });
}
