#!/usr/bin/env gjs
// Unit tests for the pure logic in app.js (grading + queue building).
// No node on this machine, so these run under gjs / SpiderMonkey:
//     gjs tests/logic-test.js
// app.js bails out before touching the DOM when `document` is undefined,
// which is exactly the case here.

const GLib = imports.gi.GLib;

const here = GLib.path_get_dirname(new Error().fileName || 'tests/x');
const repo = GLib.path_get_dirname(here);

function load(relative) {
    const [ok, bytes] = GLib.file_get_contents(GLib.build_filenamev([repo, relative]));
    if (!ok) throw new Error('cannot read ' + relative);
    return new TextDecoder().decode(bytes);
}

// One eval so the files share a scope — `const` inside eval does not leak out.
(0, eval)(load('likelihood.js') + '\n' + load('app.js'));

const L = globalThis.P2_LOGIC;
if (!L) throw new Error('app.js did not export P2_LOGIC');

let passed = 0;
const failures = [];

function check(name, actual, expected) {
    const a = JSON.stringify(actual), b = JSON.stringify(expected);
    if (a === b) { passed++; }
    else { failures.push(name + '\n      expected ' + b + '\n      got      ' + a); }
}

function verdict(given, label, others, strict) {
    return L.gradeAnswer(given, label, others || [], !!strict).verdict;
}

/* ---- normalizeAnswer ---- */
check('lowercases and trims', L.normalizeAnswer('  Left Ventricle  '), 'left ventricle');
check('collapses inner whitespace', L.normalizeAnswer('left\t\n  ventricle'), 'left ventricle');
check('drops punctuation', L.normalizeAnswer('chordae tendineae!!'), 'chordae tendineae');
check('drops a leading article', L.normalizeAnswer('the aorta'), 'aorta');
check('keeps a non-leading article', L.normalizeAnswer('vena cava the'), 'vena cava the');
check('strips accents', L.normalizeAnswer('Ménière'), 'meniere');
check('expands ampersand', L.normalizeAnswer('heart & lungs'), 'heart and lungs');
check('empty stays empty', L.normalizeAnswer('   '), '');
check('handles null', L.normalizeAnswer(null), '');
check('digits survive', L.normalizeAnswer('Slide 45'), 'slide 45');

/* ---- expandVariants ---- */
check('slash makes alternatives',
    Array.from(L.expandVariants('Bicuspid valve / Mitral valve')).sort(),
    ['bicuspid valve', 'mitral valve']);
check('parenthetical is optional',
    Array.from(L.expandVariants('Aorta (ascending)')).sort(),
    ['aorta', 'aorta ascending']);
check('semicolon also splits',
    Array.from(L.expandVariants('Windpipe; Trachea')).sort(),
    ['trachea', 'windpipe']);
check('plain label yields one form',
    Array.from(L.expandVariants('Diaphragm')),
    ['diaphragm']);

/* ---- levenshtein ---- */
check('lev identical', L.levenshtein('aorta', 'aorta'), 0);
check('lev one substitution', L.levenshtein('aorta', 'aorto'), 1);
check('lev empty vs word', L.levenshtein('', 'aorta'), 5);
check('lev superior/inferior', L.levenshtein('superior', 'inferior'), 3);

/* ---- typoTolerance ---- */
check('short words forgive one', L.typoTolerance(6), 1);
check('medium words forgive one', L.typoTolerance(16), 1);
check('long words forgive two', L.typoTolerance(20), 2);
check('very long capped at three', L.typoTolerance(90), 3);

/* ---- gradeAnswer: the happy paths ---- */
check('exact answer', verdict('Left ventricle', 'Left ventricle'), 'right');
check('case and spacing ignored', verdict('  left   VENTRICLE ', 'Left ventricle'), 'right');
check('article ignored', verdict('the diaphragm', 'Diaphragm'), 'right');
check('alternative wording accepted', verdict('mitral valve', 'Bicuspid valve / Mitral valve'), 'right');
check('other alternative accepted', verdict('bicuspid valve', 'Bicuspid valve / Mitral valve'), 'right');
check('parenthetical omitted', verdict('aorta', 'Aorta (ascending)'), 'right');
check('parenthetical included', verdict('ascending aorta', 'Aorta (ascending)'), 'wrong');
check('parenthetical in given order', verdict('aorta ascending', 'Aorta (ascending)'), 'right');

/* ---- gradeAnswer: typos ---- */
check('single typo forgiven', verdict('chordae tendinae', 'Chordae tendineae'), 'close');
check('doubled letter forgiven', verdict('diaphragmm', 'Diaphragm'), 'close');
check('strict mode rejects a typo', verdict('diaphragmm', 'Diaphragm', [], true), 'wrong');
check('blank is wrong', verdict('', 'Diaphragm'), 'wrong');
check('whitespace-only is wrong', verdict('   ', 'Diaphragm'), 'wrong');
check('unrelated word is wrong', verdict('spleen', 'Diaphragm'), 'wrong');

/* ---- gradeAnswer: the confusion guard ----
   These are the pairs a sloppy fuzzy matcher gets wrong, and getting them
   wrong on a practical is worse than not forgiving typos at all. */
const VESSELS = ['Superior vena cava', 'Inferior vena cava'];
check('inferior is not a typo of superior',
    verdict('Inferior vena cava', 'Superior vena cava', VESSELS), 'wrong');
check('superior is not a typo of inferior',
    verdict('Superior vena cava', 'Inferior vena cava', VESSELS), 'wrong');
check('superior still grades itself right',
    verdict('Superior vena cava', 'Superior vena cava', VESSELS), 'right');
check('a real typo still passes alongside a rival',
    verdict('Superior vena cavaa', 'Superior vena cava', VESSELS), 'close');

const SIDES = ['Left ventricle', 'Right ventricle', 'Left atrium', 'Right atrium'];
check('right ventricle is not a typo of left ventricle',
    verdict('Right ventricle', 'Left ventricle', SIDES), 'wrong');
check('left atrium is not a typo of left ventricle',
    verdict('Left atrium', 'Left ventricle', SIDES), 'wrong');

const LOBES = ['Superior lobe', 'Middle lobe', 'Inferior lobe'];
check('middle lobe is not a typo of inferior lobe',
    verdict('Middle lobe', 'Inferior lobe', LOBES), 'wrong');

const FOLDS = ['True vocal fold', 'False vocal fold'];
check('false fold is not a typo of true fold',
    verdict('False vocal fold', 'True vocal fold', FOLDS), 'wrong');

const BRONCHI = ['Primary bronchus', 'Secondary bronchus', 'Tertiary bronchus'];
check('secondary is not a typo of tertiary',
    verdict('Secondary bronchus', 'Tertiary bronchus', BRONCHI), 'wrong');

/* The same structure pinned on two slides must not shout down its own typo. */
check('a duplicate of the label is not a rival',
    verdict('Diaphragmm', 'Diaphragm', ['Diaphragm', 'Spleen']), 'close');
check('an accepted synonym is not a rival',
    verdict('Mitral valv', 'Bicuspid valve / Mitral valve', ['Mitral valve']), 'close');

/* An exact match for a different structure is never a typo, however close. */
check('exact rival match is wrong even when near',
    verdict('Trachea', 'Trachae / Trachea', ['Trachea']), 'right');

/* ---- buildQueue ---- */
const PINS = {
    slideA: [
        { id: 'p1', x: 0.1, y: 0.1, label: 'Aorta' },
        { id: 'p2', x: 0.2, y: 0.2, label: '' },            // unnamed -> skipped
        { id: 'p3', x: 0.3, y: 0.3, label: 'Left atrium' }
    ],
    slideB: [
        { id: 'p4', x: 0.4, y: 0.4, label: 'Trachea' }
    ],
    slideC: [
        { id: 'p5', x: 0.5, y: 0.5, label: '   ' }           // whitespace -> skipped
    ]
};
const ORDER = ['slideA', 'slideB', 'slideC'];

const q = L.buildQueue(PINS, ORDER, { shuffle: false });
check('unnamed pins are excluded', q, [
    { slideId: 'slideA', pinIds: ['p1', 'p3'] },
    { slideId: 'slideB', pinIds: ['p4'] }
]);
check('question count', L.countQuestions(q), 3);

const qOnly = L.buildQueue(PINS, ORDER, { shuffle: false },
    new Set(['slideA::p3', 'slideB::p4']));
check('retry set restricts the queue', qOnly, [
    { slideId: 'slideA', pinIds: ['p3'] },
    { slideId: 'slideB', pinIds: ['p4'] }
]);

const qNone = L.buildQueue(PINS, ORDER, { shuffle: false }, new Set(['slideZ::p9']));
check('empty retry set yields nothing', qNone, []);
check('empty queue counts zero', L.countQuestions(qNone), 0);

const qSubset = L.buildQueue(PINS, ['slideB'], { shuffle: false });
check('slide selection is honoured', qSubset, [{ slideId: 'slideB', pinIds: ['p4'] }]);

// Shuffling must preserve the question set and keep each slide's pins together.
let rngState = 7;
const rand = function () { rngState = (rngState * 1103515245 + 12345) % 2147483648; return rngState / 2147483648; };
const qShuf = L.buildQueue(PINS, ORDER, { shuffle: true, rand: rand });
check('shuffle keeps every question', L.countQuestions(qShuf), 3);
check('shuffle keeps blocks intact', qShuf.map(function (b) { return b.pinIds.length; }).sort(), [1, 2]);
check('shuffle keeps slide grouping',
    qShuf.map(function (b) { return b.slideId; }).sort(), ['slideA', 'slideB']);

/* ---- rectEdgePoint (leader lines from label box to pin) ---- */
// Label centred at (100,100), 40 wide by 20 tall -> half extents 20 x 10.
check('pin straight below meets the bottom edge',
    L.rectEdgePoint(100, 100, 20, 10, 100, 200), { x: 100, y: 110 });
check('pin straight above meets the top edge',
    L.rectEdgePoint(100, 100, 20, 10, 100, 0), { x: 100, y: 90 });
check('pin to the right meets the right edge',
    L.rectEdgePoint(100, 100, 20, 10, 300, 100), { x: 120, y: 100 });
check('pin to the left meets the left edge',
    L.rectEdgePoint(100, 100, 20, 10, 0, 100), { x: 80, y: 100 });
check('diagonal exits whichever edge comes first',
    L.rectEdgePoint(100, 100, 20, 10, 200, 200), { x: 110, y: 110 });
check('pin inside the label gets no line',
    L.rectEdgePoint(100, 100, 20, 10, 105, 103), null);
check('pin exactly on the edge gets no line',
    L.rectEdgePoint(100, 100, 20, 10, 120, 100), null);
check('pin exactly at the centre gets no line',
    L.rectEdgePoint(100, 100, 20, 10, 100, 100), null);

/* ---- clamp01 (labels cannot be dragged off the image) ---- */
check('clamps below zero', L.clamp01(-0.4), 0);
check('clamps above one', L.clamp01(1.7), 1);
check('leaves a fraction alone', L.clamp01(0.42), 0.42);

/* ---- formatClock ---- */
check('two minutes', L.formatClock(120), '2:00');
check('rounds up part seconds', L.formatClock(119.2), '2:00');
check('pads seconds', L.formatClock(65), '1:05');
check('zero', L.formatClock(0), '0:00');
check('never negative', L.formatClock(-5), '0:00');

/* ---- the professor's checklist ---- */
const GROUPS = [
    {
        id: 'g1', title: 'Great vessels', kind: 'model',
        terms: [
            { name: 'Superior vena cava', aliases: ['svc'] },
            { name: 'R & L coronary arteries', aliases: ['right coronary artery', 'left coronary artery'] },
            { name: 'Cardiac veins', aliases: ['great cardiac vein'] },
            { name: 'Aortic arch' }
        ]
    },
    {
        id: 'g2', title: 'Human Blood', kind: 'histology', slide: '#16',
        terms: [{ name: 'Platelets' }, { name: 'Monocyte' }]
    }
];

function cov(labels) { return L.computeCoverage(GROUPS, labels); }
function covNames(labels, gi) { return cov(labels)[gi].missing; }

check('an exact label covers its term',
    covNames(['Aortic arch'], 0), ['Superior vena cava', 'R & L coronary arteries', 'Cardiac veins']);
check('an alias covers the grouped entry',
    cov(['Right coronary artery'])[0].terms[1].covered, true);
check('a more specific vein covers the grouped entry',
    cov(['Great cardiac vein'])[0].terms[2].covered, true);
check('a slash label covers either side',
    cov(['Aortic arch / aorta'])[0].terms[3].covered, true);
check('a typo still counts as studied',
    cov(['superior veina cava'])[0].terms[0].covered, true);
check('singular covers a plural entry',
    cov(['Cardiac vein'])[0].terms[2].covered, true);
check('an unrelated label covers nothing',
    cov(['Spleen'])[0].covered, 0);
check('coverage records what covered it',
    cov(['Right coronary artery'])[0].terms[1].by, 'Right coronary artery');

check('totals split model from histology', (function () {
    const t = L.coverageTotals(cov(['Aortic arch', 'Platelets']));
    return [t.all.covered, t.all.total, t.model.covered, t.model.total,
            t.histology.covered, t.histology.total];
})(), [2, 6, 1, 4, 1, 2]);

/* ---- canonicalising a typed label ---- */
function canon(s) { return L.canonicalizeLabel(GROUPS, s); }
check('a clean typo snaps to the official wording', canon('Aortic artch').label, 'Aortic arch');
check('snapping is flagged', canon('Aortic artch').snapped, true);
check('an already-official label is left alone', canon('Aortic arch').snapped, false);
check('snapping resolves to the specific alias, not the grouped heading',
    canon('right coronry artery').label, 'Right coronary artery');
check('a structure he did not list is left alone', canon('Apex of heart').snapped, false);
check('an empty label is left alone', canon('   ').snapped, false);
check('nonsense is left alone', canon('zzzz qqqq').snapped, false);

/* Never quietly rewrite one structure into a different one. A dropped letter
   that sits equally close to two real terms must stay as typed. */
const TUNICA = [{ id: 'g', title: 'x', kind: 'model', terms: [
    { name: 'Tunica interna' }, { name: 'Tunica externa' }
]}];
check('a label equidistant from two structures is left alone',
    L.canonicalizeLabel(TUNICA, 'tunica enterna').snapped, false);
check('but an unambiguous one still snaps',
    L.canonicalizeLabel(TUNICA, 'tunica externna').label, 'Tunica externa');

/* ---- finding labels that match nothing ---- */
const PINSET = {
    slideA: [
        { id: 'p1', label: 'Aortic arch' },          // fine
        { id: 'p2', label: 'right coronry artery' }, // typo, fixable
        { id: 'p3', label: 'su' },                   // stray keystroke
        { id: 'p4', label: 'Apex of heart' },        // real, just not listed
        { id: 'p5', label: '' }                      // unnamed, ignored
    ]
};
const un = L.unmatchedLabels(GROUPS, PINSET, { slideA: 'Slide A' });
check('clean labels are not flagged',
    un.map(function (u) { return u.label; }).indexOf('Aortic arch'), -1);
check('unnamed pins are not flagged',
    un.filter(function (u) { return !u.label; }).length, 0);
check('a typo is flagged with a suggestion',
    (un.filter(function (u) { return u.label === 'right coronry artery'; })[0] || {}).suggestion,
    'Right coronary artery');
check('a two-letter stub gets no invented suggestion',
    (un.filter(function (u) { return u.label === 'su'; })[0] || {}).suggestion, null);
check('an unlisted structure gets no suggestion',
    (un.filter(function (u) { return u.label === 'Apex of heart'; })[0] || {}).suggestion, null);
check('flagged rows carry their slide', un[0].slideTitle, 'Slide A');

/* ---- word bank search ---- */
check('search matches a prefix',
    L.searchTerms(GROUPS, 'aort', 5).map(function (t) { return t.name; }), ['Aortic arch']);
check('search matches through an alias',
    L.searchTerms(GROUPS, 'svc', 5).map(function (t) { return t.name; }), ['Superior vena cava']);
check('search tolerates a typo',
    L.searchTerms(GROUPS, 'platlets', 5).map(function (t) { return t.name; }), ['Platelets']);
check('an empty search returns the head of the list',
    L.searchTerms(GROUPS, '', 3).length, 3);
check('every term is enumerable', L.allTerms(GROUPS).length, 6);

/* ---- cram ranking ---- */
const LIKELY = [
    { name: 'Superior vena cava', tier: 'A' },
    { name: 'Aortic arch', tier: 'A' },
    { name: 'Cardiac veins', tier: 'C' }
];
const rank = function (yours, borrowed) {
    return L.cramRanking(GROUPS, LIKELY, yours || [], borrowed || []);
};
const byName = function (rows, n) {
    return rows.filter(function (r) { return r.name === n; })[0];
};

check('every unique term is ranked', rank([]).length, 6);
check('a tier A term outscores an unflagged one with nothing pinned',
    byName(rank([]), 'Aortic arch').score > byName(rank([]), 'Monocyte').score, true);
check('pinning something yourself lowers its priority',
    byName(rank(['Aortic arch']), 'Aortic arch').score <
    byName(rank([]), 'Aortic arch').score, true);

/* A borrowed pin is evidence about the import, not about you. */
const borrowedOnly = rank([], ['Aortic arch']);
check('a borrowed pin barely lowers priority',
    byName(borrowedOnly, 'Aortic arch').missChance, 0.75);
check('your own pin lowers it properly',
    byName(rank(['Aortic arch']), 'Aortic arch').missChance, 0.35);
check('nothing anywhere scores highest', byName(rank([]), 'Aortic arch').missChance, 0.9);
check('borrowed is reported separately from yours',
    [byName(borrowedOnly, 'Aortic arch').pinned, byName(borrowedOnly, 'Aortic arch').borrowed],
    [false, true]);
check('your own pin reads as yours',
    [byName(rank(['Aortic arch']), 'Aortic arch').pinned,
     byName(rank(['Aortic arch']), 'Aortic arch').borrowed], [true, false]);

check('ranking is sorted by score', (function () {
    const r = rank([]);
    for (let i = 1; i < r.length; i++) if (r[i - 1].score < r[i].score) return false;
    return true;
})(), true);

/* Confusable neighbours get a boost, and the pairs found are real ones. */
const CONF = L.confusionMap(['Superior vena cava', 'Inferior vena cava', 'Diaphragm']);
check('superior and inferior vena cava are flagged as confusable',
    CONF['Superior vena cava'], ['Inferior vena cava']);
check('an unrelated structure has no twin', CONF['Diaphragm'], []);

check('tier weights are ordered', [L.tierWeight('A'), L.tierWeight('B'), L.tierWeight('C')],
    [0.9, 0.7, 0.5]);
check('an unflagged term still carries a baseline', L.tierWeight(null), 0.25);
check('an unknown tier falls back to the baseline', L.tierWeight('Z'), 0.25);

check('the whole list covers all the risk', Math.round(L.cramCoverageCurve(rank([]), 6) * 100), 100);
check('an empty head covers none', L.cramCoverageCurve(rank([]), 0), 0);

/* ---- report ---- */
print('');
if (failures.length === 0) {
    print('  ✓ all ' + passed + ' assertions passed');
    print('');
} else {
    print('  ✗ ' + failures.length + ' of ' + (passed + failures.length) + ' assertions failed:');
    print('');
    failures.forEach(function (f) { print('    ' + f); });
    print('');
    imports.system.exit(1);
}
