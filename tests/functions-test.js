#!/usr/bin/env gjs
// Checks the function question bank against the professor's objectives:
//     gjs tests/functions-test.js
//
// The point of this suite is the first check — every single structure on the
// Lab Exam 2 handout must have a function question, or the quiz quietly
// leaves a hole in your revision.

const GLib = imports.gi.GLib;

const here = GLib.path_get_dirname(new Error().fileName || 'tests/x');
const repo = GLib.path_get_dirname(here);

function load(relative) {
    const [ok, bytes] = GLib.file_get_contents(GLib.build_filenamev([repo, relative]));
    if (!ok) throw new Error('cannot read ' + relative);
    return new TextDecoder().decode(bytes);
}

(0, eval)(load('objectives.js') + '\n' + load('functions.js') + '\n' +
         load('likelihood.js') + '\n' + load('app.js') + '\n' +
         'globalThis.__G = OBJECTIVE_GROUPS;' +
         'globalThis.__F = FUNCTION_ITEMS;' +
         'globalThis.__BY = FUNCTION_BY_TERM;' +
         'globalThis.__FOR = functionItemsForGroup;');

const GROUPS = globalThis.__G;
const ITEMS = globalThis.__F;
const BY_TERM = globalThis.__BY;
const forGroup = globalThis.__FOR;
const L = globalThis.P2_LOGIC;

let passed = 0;
const failures = [];

function ok(name, cond, detail) {
    if (cond) passed++;
    else failures.push(name + (detail ? '\n      ' + detail : ''));
}

/* ---- 1. every objective term has a question ---- */
const missing = [];
GROUPS.forEach(function (g) {
    g.terms.forEach(function (t) {
        if (!BY_TERM[t.name]) missing.push(g.id + ' / ' + t.name);
    });
});
ok('every objectives term has a function question', missing.length === 0,
   missing.length + ' missing: ' + missing.join(', '));

/* ---- 2. no question invents a term the handout does not list ---- */
const known = new Set();
GROUPS.forEach(function (g) { g.terms.forEach(function (t) { known.add(t.name); }); });
const stray = ITEMS.filter(function (it) { return !known.has(it.term); })
                   .map(function (it) { return it.term; });
ok('no question for a term outside the handout', stray.length === 0, stray.join(', '));

/* ---- 3. every question claims a real group, and lands in it ---- */
const groupIds = new Set(GROUPS.map(function (g) { return g.id; }));
const badGroup = ITEMS.filter(function (it) {
    if (!groupIds.has(it.group)) return true;
    return (it.also || []).some(function (id) { return !groupIds.has(id); });
}).map(function (it) { return it.term; });
ok('every question names a real objectives group', badGroup.length === 0, badGroup.join(', '));

const notListedThere = [];
ITEMS.forEach(function (it) {
    [it.group].concat(it.also || []).forEach(function (gid) {
        const g = GROUPS.find(function (x) { return x.id === gid; });
        if (g && !g.terms.some(function (t) { return t.name === it.term; })) {
            notListedThere.push(it.term + ' -> ' + gid);
        }
    });
});
ok('each question sits in a group that actually lists its term',
   notListedThere.length === 0, notListedThere.join(', '));

/* ---- 4. shape: three distractors, all distinct, none empty ---- */
const badShape = [];
const dupOptions = [];
ITEMS.forEach(function (it) {
    if (!it.fn || !Array.isArray(it.wrong) || it.wrong.length !== 3) {
        badShape.push(it.term);
        return;
    }
    const opts = [it.fn].concat(it.wrong);
    if (opts.some(function (o) { return !o || !String(o).trim(); })) badShape.push(it.term);
    const seen = new Set(opts.map(function (o) { return L.normalizeAnswer(o); }));
    if (seen.size !== 4) dupOptions.push(it.term);
});
ok('every question has exactly three distractors', badShape.length === 0, badShape.join(', '));
ok('no question repeats an option', dupOptions.length === 0, dupOptions.join(', '));

/* ---- 5. no duplicate questions ---- */
const seenTerms = new Set();
const dupTerms = [];
ITEMS.forEach(function (it) {
    if (seenTerms.has(it.term)) dupTerms.push(it.term);
    seenTerms.add(it.term);
});
ok('no term is asked twice', dupTerms.length === 0, dupTerms.join(', '));

/* ---- 6. the right answer is not simply the longest option ---- */
/* A quiz where "pick the wordiest" always works teaches nothing. Allow it
   sometimes, but not as a rule. */
let longest = 0;
ITEMS.forEach(function (it) {
    const max = Math.max.apply(null, it.wrong.map(function (w) { return w.length; }));
    if (it.fn.length > max) longest++;
});
ok('the correct answer is not usually the longest option',
   longest <= ITEMS.length * 0.5,
   longest + ' of ' + ITEMS.length + ' have the longest correct answer');

/* ---- 7. group lookup ---- */
ok('shared terms appear under each of their groups',
   forGroup('trachea_histo').some(function (it) { return it.term === 'Cilia'; }) &&
   forGroup('nasal_epithelium').some(function (it) { return it.term === 'Cilia'; }) &&
   forGroup('lung_histo').some(function (it) { return it.term === 'Mucosa'; }));

ok('group lookup returns nothing for an unknown group',
   forGroup('not_a_group').length === 0);

/* ---- 8. queue building ---- */
const q = L.buildFunctionQueue(['valves'], { shuffle: false });
ok('queue covers a whole group in handout order', q.length === 4 &&
   q[0].term === 'Tricuspid valve' && q[3].term === 'Aortic semilunar valve',
   JSON.stringify(q.map(function (x) { return x.term; })));

const both = L.buildFunctionQueue(['valves', 'valves'], { shuffle: false });
ok('a term is never queued twice', both.length === 4);

const only = L.buildFunctionQueue(['valves'], { shuffle: false },
                                  new Set(['Bicuspid valve']));
ok('retry-only filter keeps just the named terms', only.length === 1 &&
   only[0].term === 'Bicuspid valve');

/* deterministic shuffle so the check is not flaky */
let n = 0;
const rand = function () { n = (n * 9301 + 49297) % 233280; return n / 233280; };
const shuffled = L.buildFunctionQueue(['great_vessels'], { shuffle: true, rand: rand });
ok('shuffling keeps every question', shuffled.length === 12);
ok('a shuffled question still carries four options',
   shuffled.every(function (x) { return x.options.length === 4; }));
ok('exactly one option is flagged correct',
   shuffled.every(function (x) {
       return x.options.filter(function (o) { return o.correct; }).length === 1;
   }));
ok('the correct option is the item’s stated function',
   shuffled.every(function (x) {
       return x.options.find(function (o) { return o.correct; }).text === x.item.fn;
   }));

/* option order must actually move around, not sit at index 0 every time */
const positions = new Set(shuffled.map(function (x) {
    return x.options.findIndex(function (o) { return o.correct; });
}));
ok('the answer does not always land in the same slot', positions.size > 1,
   'positions seen: ' + Array.from(positions).join(','));

/* ---- 9. scoring ---- */
const sc = L.scoreFunctionRun([{ correct: true }, { correct: false }, { correct: true }]);
ok('scoring counts a run', sc.right === 2 && sc.total === 3 && sc.pct === 67,
   JSON.stringify(sc));
ok('scoring an empty run does not divide by zero',
   L.scoreFunctionRun([]).pct === 0);

/* ---- report ---- */
print('functions: ' + passed + ' passed, ' + failures.length + ' failed  (' +
      ITEMS.length + ' questions)');
failures.forEach(function (f) { print('  FAIL  ' + f); });
if (failures.length) imports.system.exit(1);
