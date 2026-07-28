/* BIOL 40B — Practical 2: Build Your Own Pins
 *
 * You place the pins and name them yourself; the test then shows one pin at a
 * time and asks what it is, 2 minutes per slide.
 *
 * Layout of this file:
 *   1. Pure logic (answer grading, queue building) — no DOM, unit-tested
 *   2. Storage
 *   3. Build mode UI
 *   4. Test mode UI
 *   5. Boot
 */

(function (global) {
'use strict';

/* ══════════════════════════════════════════════════════════════════
   1. PURE LOGIC
   ══════════════════════════════════════════════════════════════════ */

/* Fold an answer down to the part that actually matters: lowercase, no
   accents, no punctuation, no leading article, single spaces. */
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

function normalizeAnswer(s) {
    if (s === null || s === undefined) return '';
    return String(s)
        .normalize('NFD').replace(COMBINING_MARKS, '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^(the|a|an)\s+/, '');
}

/* A label may offer several acceptable wordings:
     "Bicuspid valve / Mitral valve"   -> either wording
     "Aorta (ascending)"               -> with or without the bracketed part
   Returns the set of normalized forms that count as correct. */
function expandVariants(label) {
    const out = new Set();
    String(label || '').split(/[\/;]/).forEach(function (alt) {
        const withParens = alt.replace(/[()\[\]]/g, ' ');
        const withoutParens = alt.replace(/[([][^)\]]*[)\]]/g, ' ');
        [withParens, withoutParens].forEach(function (form) {
            const n = normalizeAnswer(form);
            if (n) out.add(n);
        });
    });
    return out;
}

function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let prev = new Array(b.length + 1);
    let cur = new Array(b.length + 1);
    for (let j = 0; j <= b.length; j++) prev[j] = j;
    for (let i = 1; i <= a.length; i++) {
        cur[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
            cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        }
        const swap = prev; prev = cur; cur = swap;
    }
    return prev[b.length];
}

/* How many characters of slop to forgive. Deliberately tight: "superior vena
   cava" and "inferior vena cava" are only 3 edits apart, and a practical that
   accepts one for the other is worse than useless. */
function typoTolerance(len) {
    return Math.min(3, Math.max(1, Math.floor(len / 10)));
}

function bestDistance(given, variants) {
    let best = Infinity;
    variants.forEach(function (v) {
        const d = levenshtein(given, v);
        if (d < best) best = d;
    });
    return best;
}

/* Grade one answer.
     label       the pin's label, as typed in Build mode
     others      every OTHER label in the whole pin set (confusion guard)
     strict      exact match only
   -> { verdict: 'right' | 'close' | 'wrong', normalized }
   'close' means accepted, but the spelling was off. */
function gradeAnswer(given, label, others, strict) {
    const g = normalizeAnswer(given);
    const variants = expandVariants(label);
    if (!g) return { verdict: 'wrong', normalized: g };
    if (variants.has(g)) return { verdict: 'right', normalized: g };
    if (strict) return { verdict: 'wrong', normalized: g };

    const mine = bestDistance(g, variants);
    if (!isFinite(mine)) return { verdict: 'wrong', normalized: g };

    /* Find the closest label that is NOT this one. If the student's answer is
       at least as close to some other structure, it isn't a typo — it's the
       wrong structure. */
    let rivalBest = Infinity;
    (others || []).forEach(function (other) {
        const ov = expandVariants(other);
        // Skip anything that is really the same structure — the pin's own
        // label, a duplicate of it on another slide, or an accepted synonym.
        let sameThing = false;
        ov.forEach(function (v) { if (variants.has(v)) sameThing = true; });
        if (sameThing) return;
        if (ov.has(g)) { rivalBest = 0; return; }
        const d = bestDistance(g, ov);
        if (d < rivalBest) rivalBest = d;
    });

    let shortest = Infinity;
    variants.forEach(function (v) { if (v.length < shortest) shortest = v.length; });
    const tol = typoTolerance(shortest);

    if (mine <= tol && mine < rivalBest) return { verdict: 'close', normalized: g };
    return { verdict: 'wrong', normalized: g };
}

/* ── The professor's checklist ─────────────────────────────────────────
   Coverage asks a looser question than grading does: "have you studied this
   structure at all", not "did you spell it right under exam conditions". So
   it accepts aliases, plurals and typos — a pin labelled "Aortic artach"
   still counts as having covered "Aortic arch". */

function termForms(term) {
    const out = new Set();
    expandVariants(term.name).forEach(function (v) { out.add(v); });
    (term.aliases || []).forEach(function (a) {
        expandVariants(a).forEach(function (v) { out.add(v); });
    });
    return out;
}

/* Crude but sufficient here: "cardiac veins" and "cardiac vein" are the
   same checklist item. Only touches words long enough to be a real noun. */
function depluralize(s) {
    return s.replace(/\b([a-z]{4,}?)s\b/g, '$1');
}

/* Deliberately looser than grading. "Have I studied this structure?" tolerates
   a mangled spelling; "is this answer right?" does not. */
function coverageTolerance(len) {
    return Math.min(4, Math.max(1, Math.round(len * 0.2)));
}

/* A label carries its own alternatives — "Aortic arch / Aorta" should satisfy
   the checklist entry for either — so match variant-against-variant. */
function labelCoversTerm(labelVariants, forms) {
    const variants = (labelVariants instanceof Set)
        ? Array.from(labelVariants)
        : [].concat(labelVariants).filter(Boolean);
    let hit = false;
    variants.forEach(function (lv) {
        if (hit || !lv) return;
        if (forms.has(lv)) { hit = true; return; }
        const flat = depluralize(lv);
        forms.forEach(function (f) {
            if (hit) return;
            if (depluralize(f) === flat) { hit = true; return; }
            const tol = coverageTolerance(f.length);
            if (Math.abs(f.length - lv.length) <= tol + 1 &&
                levenshtein(f, lv) <= tol) hit = true;
        });
    });
    return hit;
}

/* groups: OBJECTIVE_GROUPS, labels: every pin label in the whole pin set.
   -> per group, which required terms are covered and which are missing. */
function computeCoverage(groups, labels) {
    const variants = (labels || []).map(function (l) { return expandVariants(l); });

    return (groups || []).map(function (g) {
        const terms = g.terms.map(function (t) {
            const forms = termForms(t);
            let by = null;
            variants.forEach(function (v, i) {
                if (by === null && labelCoversTerm(v, forms)) by = labels[i];
            });
            return { name: t.name, covered: by !== null, by: by };
        });
        const done = terms.filter(function (t) { return t.covered; }).length;
        return {
            id: g.id,
            title: g.title,
            kind: g.kind,
            slide: g.slide || null,
            terms: terms,
            covered: done,
            total: terms.length,
            missing: terms.filter(function (t) { return !t.covered; })
                          .map(function (t) { return t.name; })
        };
    });
}

function coverageTotals(report) {
    const sum = function (kind) {
        const rows = report.filter(function (r) { return !kind || r.kind === kind; });
        return {
            covered: rows.reduce(function (n, r) { return n + r.covered; }, 0),
            total: rows.reduce(function (n, r) { return n + r.total; }, 0)
        };
    };
    return { all: sum(null), model: sum('model'), histology: sum('histology') };
}

/* Every required term, flattened — the word bank you pick names from. */
function allTerms(groups) {
    const out = [];
    (groups || []).forEach(function (g) {
        g.terms.forEach(function (t) {
            out.push({ name: t.name, group: g.title, kind: g.kind, aliases: t.aliases || [] });
        });
    });
    return out;
}

function searchTerms(groups, query, limit) {
    const q = normalizeAnswer(query);
    const terms = allTerms(groups);
    if (!q) return terms.slice(0, limit || 8);
    const scored = [];
    terms.forEach(function (t) {
        const n = normalizeAnswer(t.name);
        let score = -1;
        if (n === q) score = 0;
        else if (n.indexOf(q) === 0) score = 1;
        else if (n.indexOf(q) >= 0) score = 2;
        else if (t.aliases.some(function (a) { return normalizeAnswer(a).indexOf(q) >= 0; })) score = 3;
        else if (levenshtein(n, q) <= typoTolerance(n.length) + 1) score = 4;
        if (score >= 0) scored.push({ term: t, score: score, len: n.length });
    });
    scored.sort(function (a, b) { return a.score - b.score || a.len - b.len; });
    return scored.slice(0, limit || 8).map(function (s) { return s.term; });
}

/* If a typed label is unmistakably a misspelling of one official term, hand
   back the official wording. Guarded hard: a near-tie between two terms, or
   anything not close enough, is left exactly as typed. Answer keys must never
   be silently corrected to the wrong structure. */
function capitalizeFirst(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/* Closest official wording to a typed label, with the distance to it.
   Crucially this resolves to a SPECIFIC wording: matching via the alias
   "right coronary artery" yields that, not the handout's grouped heading
   "R & L coronary arteries", which would be a terrible answer key for one pin. */
function bestTermMatch(groups, text) {
    const q = normalizeAnswer(text);
    if (!q) return null;
    let best = null;
    allTerms(groups).forEach(function (t) {
        [t.name].concat(t.aliases).forEach(function (cand) {
            let d = Infinity;
            expandVariants(cand).forEach(function (f) {
                const dd = levenshtein(f, q);
                if (dd < d) d = dd;
            });
            if (!best || d < best.distance) {
                best = {
                    term: t,
                    distance: d,
                    // the term's own name keeps its casing; aliases are stored
                    // lowercase, so give them a capital to read as a label
                    wording: cand === t.name ? t.name : capitalizeFirst(cand)
                };
            }
        });
    });
    return best;
}

/* Runner-up distance among terms *other* than this one, so an ambiguous
   label is left alone rather than guessed at. */
function rivalDistance(groups, text, keepTerm) {
    const q = normalizeAnswer(text);
    let best = Infinity;
    allTerms(groups).forEach(function (t) {
        if (t.name === keepTerm.name) return;
        termForms(t).forEach(function (f) {
            const d = levenshtein(f, q);
            if (d < best) best = d;
        });
    });
    return best;
}

function canonicalizeLabel(groups, label) {
    const raw = String(label || '').trim();
    if (!normalizeAnswer(raw)) return { label: raw, snapped: false };

    const best = bestTermMatch(groups, raw);
    if (!best) return { label: raw, snapped: false };
    if (best.distance === 0) return { label: raw, snapped: false };   // already official

    const tol = typoTolerance(normalizeAnswer(best.wording).length);
    const rival = rivalDistance(groups, raw, best.term);
    if (best.distance <= tol && rival > best.distance + 1) {
        return { label: best.wording, snapped: true, from: raw };
    }
    return { label: raw, snapped: false };
}

/* Labels that match nothing on the handout — typos to fix before they become
   an answer key that marks the right answer wrong. `suggestion` is the closest
   official wording, or null when nothing is close enough to be worth offering. */
function unmatchedLabels(groups, pinsBySlide, slideTitles) {
    const out = [];
    Object.keys(pinsBySlide || {}).forEach(function (slideId) {
        (pinsBySlide[slideId] || []).forEach(function (pin) {
            const label = String(pin.label || '').trim();
            if (!label || pin.keepWording) return;
            const q = normalizeAnswer(label);
            const variants = expandVariants(label);
            // Deliberately an EXACT test, not the loose coverage one: this list
            // exists to catch labels that would mark a right answer wrong, and
            // grading does not forgive what coverage does.
            let exact = false;
            allTerms(groups).forEach(function (t) {
                if (exact) return;
                const forms = termForms(t);
                variants.forEach(function (v) { if (forms.has(v)) exact = true; });
            });
            if (exact) return;
            const best = bestTermMatch(groups, label);
            // A two-letter stub is a slip of the finger, not a misspelling of
            // something — offering it a "correction" is just noise.
            const worth = best && q.length >= 4 &&
                best.distance <= Math.max(3, Math.round(q.length * 0.45));
            out.push({
                slideId: slideId,
                slideTitle: (slideTitles && slideTitles[slideId]) || slideId,
                pinId: pin.id,
                label: label,
                suggestion: worth ? best.wording : null,
                distance: best ? best.distance : Infinity
            });
        });
    });
    return out;
}

/* ── Cram ranking ──────────────────────────────────────────────────────
   With one evening left, the question isn't "what's on the list" but "what
   earns the most marks per minute". Score each structure by

       expected marks at risk  =  P(it gets tagged) × P(you'd miss it now)

   and nudge up anything that has a near-twin, because directional pairs are
   where practical marks actually leak.

   P(tagged) comes from the tier estimate in likelihood.js.
   P(missed) is inferred from whether you have a pin for it at all: a
   structure you have never located is one you cannot answer, whereas one you
   have pinned you have at least handled once. Crude, but it is real
   information about you rather than a guess. */

const MODIFIERS = ['right','left','superior','middle','inferior','internal',
    'external','visceral','parietal','primary','secondary','tertiary',
    'anterior','posterior','ascending','descending','true','false'];

/* Two structures are confusable when their names are close enough that under
   pressure you could produce one for the other — which is exactly the trap a
   practical sets with superior/inferior and epi/endo/myo. */
function confusionMap(names) {
    const norm = names.map(function (n) { return normalizeAnswer(n); });
    const map = {};
    names.forEach(function (n, i) { map[n] = []; void i; });
    for (let i = 0; i < names.length; i++) {
        for (let j = i + 1; j < names.length; j++) {
            const a = norm[i], b = norm[j];
            if (!a || !b || a === b) continue;
            const span = Math.max(a.length, b.length);
            if (span < 6) continue;
            const d = levenshtein(a, b);
            if (d === 0) continue;
            if (d <= Math.max(2, Math.round(span * 0.4))) {
                map[names[i]].push(names[j]);
                map[names[j]].push(names[i]);
            }
        }
    }
    return map;
}

function tierWeight(tier) {
    const table = (typeof TIER_WEIGHT !== 'undefined') ? TIER_WEIGHT : { A: 0.9, B: 0.7, C: 0.5 };
    const base = (typeof UNFLAGGED_WEIGHT !== 'undefined') ? UNFLAGGED_WEIGHT : 0.25;
    if (tier && table[tier] !== undefined) return table[tier];
    return base;
}

/* -> [{ name, group, kind, tier, pinned, rivals, missChance, weight, score }]
   sorted by score, highest first. */
function cramRanking(groups, likely, yourLabels, borrowedLabels) {
    const yours = {}, anywhere = {};
    computeCoverage(groups, yourLabels || []).forEach(function (g) {
        g.terms.forEach(function (t) { yours[t.name] = t.covered; });
    });
    computeCoverage(groups, (yourLabels || []).concat(borrowedLabels || []))
        .forEach(function (g) {
            g.terms.forEach(function (t) { anywhere[t.name] = t.covered; });
        });

    const tierOf = {};
    (likely || []).forEach(function (l) { tierOf[l.name] = l.tier; });

    const terms = allTerms(groups);
    const seen = {};
    const unique = terms.filter(function (t) {
        if (seen[t.name]) return false;
        seen[t.name] = true;
        return true;
    });
    const rivals = confusionMap(unique.map(function (t) { return t.name; }));

    return unique.map(function (t) {
        const mine = !!yours[t.name];
        const borrowed = !mine && !!anywhere[t.name];
        const weight = tierWeight(tierOf[t.name]);
        /* A pin YOU placed means you found the thing and named it — real
           evidence. A pin that arrived with an imported reference station is
           evidence of nothing about you, so it barely lowers the risk; it only
           means the structure is available to study here. */
        const missChance = mine ? 0.35 : borrowed ? 0.75 : 0.9;
        const twins = rivals[t.name] || [];
        const bonus = twins.length ? 1.3 : 1.0;
        return {
            name: t.name,
            group: t.group,
            kind: t.kind,
            tier: tierOf[t.name] || null,
            pinned: mine,
            borrowed: borrowed,
            rivals: twins,
            weight: weight,
            missChance: missChance,
            score: weight * missChance * bonus
        };
    }).sort(function (a, b) {
        return b.score - a.score || a.name.localeCompare(b.name);
    });
}

/* How much of the total marks-at-risk the first n items account for — the
   line that justifies stopping early when you run out of night. */
function cramCoverageCurve(ranked, n) {
    const total = ranked.reduce(function (s, r) { return s + r.score; }, 0);
    const head = ranked.slice(0, n).reduce(function (s, r) { return s + r.score; }, 0);
    return total ? head / total : 0;
}

function shuffleInPlace(arr, rand) {
    const r = rand || Math.random;
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
}

/* Build the run queue: an array of slide blocks, each holding its pin ids in
   ask-order. Blocks stay whole so the per-slide clock means something.
     pinsBySlide  { slideId: [pin, ...] }
     order        slide ids to include, in display order
     opts         { shuffle }
     only         optional Set of "slideId::pinId" to restrict to (retry) */
function buildQueue(pinsBySlide, order, opts, only) {
    const blocks = [];
    order.forEach(function (slideId) {
        const list = (pinsBySlide[slideId] || []).filter(function (p) {
            if (!String(p.label || '').trim()) return false;
            if (only && !only.has(slideId + '::' + p.id)) return false;
            return true;
        });
        if (list.length) blocks.push({ slideId: slideId, pinIds: list.map(function (p) { return p.id; }) });
    });
    if (opts && opts.shuffle) {
        shuffleInPlace(blocks, opts.rand);
        blocks.forEach(function (b) { shuffleInPlace(b.pinIds, opts.rand); });
    }
    return blocks;
}

function countQuestions(blocks) {
    return blocks.reduce(function (n, b) { return n + b.pinIds.length; }, 0);
}

/* Where a leader line should meet a label box: walk from the label's centre
   toward the pin and stop at the box edge, so the dotted line touches the
   label rather than disappearing under it.
     cx, cy   label centre
     hw, hh   label half-width / half-height
     px, py   the pin
   Returns null when the pin sits inside the label — then no line is wanted. */
function rectEdgePoint(cx, cy, hw, hh, px, py) {
    const dx = px - cx, dy = py - cy;
    if (!dx && !dy) return null;
    const tx = dx ? Math.abs(hw / dx) : Infinity;
    const ty = dy ? Math.abs(hh / dy) : Infinity;
    const t = Math.min(tx, ty);
    if (!isFinite(t) || t >= 1) return null;
    return { x: cx + dx * t, y: cy + dy * t };
}

function clamp01(v) { return Math.min(1, Math.max(0, v)); }

function formatClock(sec) {
    const s = Math.max(0, Math.ceil(sec));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

const LOGIC = {
    normalizeAnswer: normalizeAnswer,
    expandVariants: expandVariants,
    levenshtein: levenshtein,
    typoTolerance: typoTolerance,
    gradeAnswer: gradeAnswer,
    buildQueue: buildQueue,
    countQuestions: countQuestions,
    rectEdgePoint: rectEdgePoint,
    clamp01: clamp01,
    termForms: termForms,
    depluralize: depluralize,
    labelCoversTerm: labelCoversTerm,
    computeCoverage: computeCoverage,
    coverageTotals: coverageTotals,
    allTerms: allTerms,
    searchTerms: searchTerms,
    canonicalizeLabel: canonicalizeLabel,
    bestTermMatch: bestTermMatch,
    unmatchedLabels: unmatchedLabels,
    coverageTolerance: coverageTolerance,
    confusionMap: confusionMap,
    tierWeight: tierWeight,
    cramRanking: cramRanking,
    cramCoverageCurve: cramCoverageCurve,
    formatClock: formatClock,
    shuffleInPlace: shuffleInPlace
};

global.P2_LOGIC = LOGIC;

/* Loaded for unit tests (gjs, no DOM) — stop here. */
if (typeof document === 'undefined') return;

/* ══════════════════════════════════════════════════════════════════
   2. STORAGE
   ══════════════════════════════════════════════════════════════════ */

/* Namespaced hard: this site shares the producer456.github.io origin (and so
   localStorage) with the labeling app and the spelling drill. Nothing here may
   read or write their keys. */
/* Its own namespace. This site shares the producer456.github.io origin with
   the labeling app, the spelling drill AND the original practical-2 pins site,
   so reusing 'bio40b_p2_' here would have this page silently reading and
   overwriting the pins saved on that other site. */
const NS = 'bio40b_p2cram_';
const K_PINS = NS + 'pins';
const K_TITLES = NS + 'titles';
const K_SETTINGS = NS + 'settings';

let pinsBySlide = {};
let titleOverrides = {};
let settings = {
    timed: true,
    seconds: 120,
    shuffle: true,
    showOthers: false,
    strict: false,
    slides: null      // null = "every slide that has pins"
};

let nextPinSeq = 1;

function readJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const val = JSON.parse(raw);
        return (val && typeof val === 'object') ? val : fallback;
    } catch (e) {
        return fallback;
    }
}

function writeJSON(key, val) {
    try {
        localStorage.setItem(key, JSON.stringify(val));
        return true;
    } catch (e) {
        toast('Could not save — browser storage is full or blocked', 'error');
        return false;
    }
}

/* Donor stations from the sibling sites are appended after your own photos.
   They arrive pre-pinned; anything you then change wins over them. */
function mergeDonorSlides() {
    if (typeof DONOR_SLIDES === 'undefined') return;
    DONOR_SLIDES.forEach(function (s) {
        if (SLIDE_DATA[s.id]) return;
        SLIDE_DATA[s.id] = { src: s.src, title: s.title, hint: s.hint, donor: true };
        SLIDE_ORDER.push(s.id);
    });
}

function mergeSourcedSlides() {
    if (typeof SOURCED_SLIDES === 'undefined') return;
    SOURCED_SLIDES.forEach(function (s) {
        if (SLIDE_DATA[s.id]) return;
        // No pins shipped: these are here for you to label.
        SLIDE_DATA[s.id] = { src: s.src, title: s.title, hint: s.hint, sourced: true };
        SLIDE_ORDER.push(s.id);
    });
}

function isDonorSlide(slideId) {
    return !!(SLIDE_DATA[slideId] && SLIDE_DATA[slideId].donor);
}

function sanitizePins(raw) {
    const clean = {};
    if (!raw || typeof raw !== 'object') return clean;
    SLIDE_ORDER.forEach(function (slideId) {
        const list = raw[slideId];
        if (!Array.isArray(list)) return;
        const kept = [];
        list.forEach(function (p) {
            if (!p || typeof p !== 'object') return;
            const x = Number(p.x), y = Number(p.y);
            if (!isFinite(x) || !isFinite(y)) return;
            const pin = {
                id: String(p.id || ('p' + (nextPinSeq++))),
                x: Math.min(1, Math.max(0, x)),
                y: Math.min(1, Math.max(0, y)),
                label: String(p.label || '')
            };
            // lx/ly are only present once the label has been dragged off its
            // default spot; absent means "park it just above the pin".
            const lx = Number(p.lx), ly = Number(p.ly);
            if (isFinite(lx) && isFinite(ly)) {
                pin.lx = Math.min(1, Math.max(0, lx));
                pin.ly = Math.min(1, Math.max(0, ly));
            }
            if (p.func) pin.func = String(p.func);
            if (p.keepWording) pin.keepWording = true;
            kept.push(pin);
        });
        // Keep empty arrays: a slide you deliberately cleared must stay clear
        // rather than having the shipped pins reappear on the next load.
        clean[slideId] = kept;
    });
    return clean;
}

function loadState() {
    const stored = localStorage.getItem(K_PINS) ? readJSON(K_PINS, {}) : null;

    // The site starts BLANK on purpose: placing and naming a structure is the
    // studying. The imported stations contribute their IMAGES only — their
    // pin key stays in donor.js unused, so every slide here is yours to fill.
    const merged = Object.assign({}, PRESET_PINS);
    if (stored) {
        Object.keys(stored).forEach(function (k) { merged[k] = stored[k]; });
    }

    pinsBySlide = sanitizePins(merged);
    titleOverrides = stored
        ? readJSON(K_TITLES, {})
        : Object.assign({}, PRESET_TITLES);
    settings = Object.assign(settings, readJSON(K_SETTINGS, {}));

    // Keep the id counter clear of anything already stored.
    Object.keys(pinsBySlide).forEach(function (s) {
        pinsBySlide[s].forEach(function (p) {
            const n = parseInt(String(p.id).replace(/\D/g, ''), 10);
            if (isFinite(n) && n >= nextPinSeq) nextPinSeq = n + 1;
        });
    });
}

function savePins() { writeJSON(K_PINS, pinsBySlide); writeJSON(K_TITLES, titleOverrides); }
function saveSettings() { writeJSON(K_SETTINGS, settings); }

function slideTitle(slideId) {
    return titleOverrides[slideId] || (SLIDE_DATA[slideId] && SLIDE_DATA[slideId].title) || slideId;
}

function slidePins(slideId) {
    if (!pinsBySlide[slideId]) pinsBySlide[slideId] = [];
    return pinsBySlide[slideId];
}

function namedPinCount(slideId) {
    return (pinsBySlide[slideId] || []).filter(function (p) { return String(p.label || '').trim(); }).length;
}

function allLabels() {
    const out = [];
    Object.keys(pinsBySlide).forEach(function (s) {
        pinsBySlide[s].forEach(function (p) {
            const l = String(p.label || '').trim();
            if (l) out.push(l);
        });
    });
    return out;
}

/* Nothing ships pre-pinned, so every label in storage is one you placed —
   including those on the borrowed images. cramRanking still understands
   imported pins, which matters if you ever load someone else's set. */
function labelsBySource() {
    return { yours: allLabels(), borrowed: [] };
}

/* ══════════════════════════════════════════════════════════════════
   3. BUILD MODE
   ══════════════════════════════════════════════════════════════════ */

const $ = function (id) { return document.getElementById(id); };

let currentSlide = SLIDE_ORDER[0];
let selectedPinId = null;
let scale = 1, panX = 0, panY = 0;

const MIN_SCALE = 1, MAX_SCALE = 6;

/* action: optional { label, onClick } — used so an automatic correction can
   always be taken back. */
function toast(msg, kind, action) {
    const el = $('toast');
    el.textContent = '';
    const text = document.createElement('span');
    text.textContent = msg;
    el.appendChild(text);

    if (action) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'toast-action';
        btn.textContent = action.label;
        btn.addEventListener('click', function () {
            el.className = 'toast';
            action.onClick();
        });
        el.appendChild(btn);
    }

    el.className = 'toast show' + (kind ? ' ' + kind : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.className = 'toast'; }, action ? 7000 : 2600);
}

function showView(name) {
    ['view-build', 'view-checklist', 'view-cram', 'view-setup', 'view-run', 'view-results']
        .forEach(function (id) { $(id).hidden = (id !== 'view-' + name); });
    $('btn-mode-build').classList.toggle('active', name === 'build');
    $('btn-mode-list').classList.toggle('active', name === 'checklist');
    $('btn-mode-cram').classList.toggle('active', name === 'cram');
    $('btn-mode-test').classList.toggle('active',
        name === 'setup' || name === 'run' || name === 'results');
    window.scrollTo(0, 0);
}

/* ---- the professor's term list as a word bank ---- */

let pendingTerm = null;      // term armed for the next tap on the image

function coverageReport() {
    return computeCoverage(OBJECTIVE_GROUPS, allLabels());
}

function setPendingTerm(name) {
    pendingTerm = name;
    $('pending-bar').hidden = !name;
    if (name) $('pending-name').textContent = name;
    renderWordBank();
}

function renderWordBank() {
    const box = $('bank-list');
    if (!box) return;
    const report = coverageReport();
    const totals = coverageTotals(report);

    const done = {};
    report.forEach(function (g) {
        g.terms.forEach(function (t) { done[t.name] = t.covered; });
    });

    $('bank-count').textContent = totals.all.covered + '/' + totals.all.total;

    const query = $('bank-search').value;
    const missingOnly = $('bank-missing-only').checked;
    let terms = searchTerms(OBJECTIVE_GROUPS, query, 400);
    if (missingOnly) terms = terms.filter(function (t) { return !done[t.name]; });

    box.textContent = '';
    if (!terms.length) {
        const p = document.createElement('p');
        p.className = 'empty-note';
        p.textContent = missingOnly
            ? 'Nothing missing here — every term matching that is pinned.'
            : 'No terms match that search.';
        box.appendChild(p);
        return;
    }

    terms.slice(0, 60).forEach(function (t) {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'term-chip' +
            (done[t.name] ? ' done' : '') +
            (t.kind === 'histology' ? ' histo' : '') +
            (pendingTerm === t.name ? ' armed' : '');
        chip.title = t.group + (t.kind === 'histology' ? ' · microscope slide' : '');

        const mark = document.createElement('span');
        mark.className = 'tick';
        mark.textContent = done[t.name] ? '✓' : '○';
        const label = document.createElement('span');
        label.textContent = t.name;

        chip.appendChild(mark);
        chip.appendChild(label);
        const fb = flagBadge(tierOfTerm(t.name));
        if (fb) chip.appendChild(fb);
        chip.addEventListener('click', function () {
            setPendingTerm(pendingTerm === t.name ? null : t.name);
        });
        box.appendChild(chip);
    });
}

/* ---- exam-likelihood flags ---- */

function tierOfTerm(name) {
    if (typeof LIKELY_ITEMS === 'undefined') return null;
    for (let i = 0; i < LIKELY_ITEMS.length; i++) {
        if (LIKELY_ITEMS[i].name === name) return LIKELY_ITEMS[i].tier;
    }
    return null;
}

const TIER_BLURB = {
    A: 'Claude rates this very likely to be tagged',
    B: 'Claude rates this likely to be tagged',
    C: 'Claude rates this plausible'
};

function flagBadge(tier) {
    if (!tier) return null;
    const b = document.createElement('span');
    b.className = 'flag ' + tier.toLowerCase();
    b.textContent = tier;
    b.title = TIER_BLURB[tier] + ' — an estimate, not inside information';
    return b;
}

/* ---- cram view ---- */

function renderCram() {
    const src = labelsBySource();
    const ranked = cramRanking(OBJECTIVE_GROUPS, LIKELY_ITEMS, src.yours, src.borrowed);
    const stats = $('cram-stats');
    stats.textContent = '';

    const unpinned = ranked.filter(function (r) { return !r.pinned && !r.borrowed; }).length;
    const onlyBorrowed = ranked.filter(function (r) { return r.borrowed; }).length;
    const top20 = Math.round(cramCoverageCurve(ranked, 20) * 100);
    const top40 = Math.round(cramCoverageCurve(ranked, 40) * 100);

    const rows = [
        ['Top 20 items cover', top20 + '%', 'of the marks you stand to lose'],
        ['Top 40 items cover', top40 + '%', 'of the marks you stand to lose'],
        ['Still unpinned', String(unpinned), 'you have not placed these anywhere yet']
    ];
    // only worth showing once someone has imported a set
    if (onlyBorrowed) {
        rows.push(['On an imported slide only', String(onlyBorrowed),
                   'available to study, but not placed by you']);
    }
    rows.forEach(function (row) {
        const el = document.createElement('div');
        el.className = 'cram-stat';
        const n = document.createElement('span');
        n.className = 'v';
        n.textContent = row[1];
        const l = document.createElement('span');
        l.className = 'l';
        l.textContent = row[0];
        const s = document.createElement('span');
        s.className = 's';
        s.textContent = row[2];
        el.appendChild(l); el.appendChild(n); el.appendChild(s);
        stats.appendChild(el);
    });

    $('cram-first-sub').textContent = '· biggest gaps on the likeliest structures';

    fillCramList($('cram-first'), ranked.slice(0, 15));
    fillCramList($('cram-then'), ranked.slice(15, 40));
    fillCramList($('cram-rest'), ranked.slice(40));
}

function fillCramList(box, rows) {
    box.textContent = '';
    rows.forEach(function (r, i) {
        const row = document.createElement('div');
        row.className = 'cram-row' + (r.pinned ? ' has' : '');

        const rank = document.createElement('span');
        rank.className = 'rank';
        rank.textContent = String(i + 1);

        const main = document.createElement('div');
        main.className = 'cram-main';

        const line = document.createElement('div');
        line.className = 'cram-name';
        const nm = document.createElement('span');
        nm.textContent = r.name;
        line.appendChild(nm);
        const badge = flagBadge(r.tier);
        if (badge) line.appendChild(badge);
        if (!r.pinned) {
            const gap = document.createElement('span');
            gap.className = 'gap-tag' + (r.borrowed ? ' borrowed' : '');
            gap.textContent = r.borrowed ? 'only on a borrowed slide' : 'no pin yet';
            line.appendChild(gap);
        }
        main.appendChild(line);

        const meta = document.createElement('div');
        meta.className = 'cram-meta';
        let text = r.group;
        if (r.kind === 'histology') text += ' · microscope slide';
        if (r.rivals.length) {
            text += ' · don’t mix up with ' + r.rivals.slice(0, 2).join(', ');
        }
        meta.textContent = text;
        main.appendChild(meta);

        row.appendChild(rank);
        row.appendChild(main);

        if (!r.pinned) {
            const go = document.createElement('button');
            go.type = 'button';
            go.className = 'mini-btn';
            go.textContent = 'Pin it';
            go.addEventListener('click', function () {
                setPendingTerm(r.name);
                showView('build');
                toast('Now tap where "' + r.name + '" is');
            });
            row.appendChild(go);
        }
        box.appendChild(row);
    });
}

/* ---- image credits ---- */

function renderCredits() {
    const box = $('credits-list');
    if (!box || typeof SOURCED_CREDITS === 'undefined') return;
    box.textContent = '';
    SOURCED_CREDITS.forEach(function (c) {
        const p = document.createElement('p');
        p.className = 'credit';
        const what = document.createElement('b');
        what.textContent = c.what + ' — ';
        p.appendChild(what);
        const src = document.createElement('span');
        src.innerHTML = c.src;          // trusted, authored in this repo
        p.appendChild(src);
        const lic = document.createElement('span');
        lic.className = 'lic';
        lic.textContent = c.lic;
        p.appendChild(lic);
        if (c.url) {
            const a = document.createElement('a');
            a.href = c.url;
            a.target = '_blank';
            a.rel = 'noopener';
            a.textContent = ' source';
            p.appendChild(a);
        }
        box.appendChild(p);
    });
}

/* ---- checklist view ---- */

function renderFixups() {
    const titles = {};
    SLIDE_ORDER.forEach(function (s) { titles[s] = slideTitle(s); });
    const rows = unmatchedLabels(OBJECTIVE_GROUPS, pinsBySlide, titles)
        .filter(function (r) { return !isDonorSlide(r.slideId); })   // donors are already his wording
        .sort(function (a, b) { return a.distance - b.distance; });

    $('fixups').hidden = rows.length === 0;
    $('fixup-count').textContent = rows.length;
    const box = $('fixup-list');
    box.textContent = '';

    rows.forEach(function (r) {
        const row = document.createElement('div');
        row.className = 'fixup-row';

        const what = document.createElement('div');
        what.className = 'fixup-what';
        const yours = document.createElement('span');
        yours.className = 'yours';
        yours.textContent = '"' + r.label + '"';
        const where = document.createElement('span');
        where.className = 'where';
        where.textContent = r.slideTitle;
        what.appendChild(yours);
        what.appendChild(where);
        row.appendChild(what);

        const act = document.createElement('div');
        act.className = 'fixup-act';
        if (r.suggestion) {
            const fix = document.createElement('button');
            fix.type = 'button';
            fix.className = 'mini-btn fix';
            fix.textContent = '→ ' + r.suggestion;
            fix.addEventListener('click', function () {
                const pin = findPin(r.slideId, r.pinId);
                if (!pin) return;
                pin.label = r.suggestion;
                savePins();
                renderWordBank();
                renderChecklist();
                if (r.slideId === currentSlide) renderPins();
                toast('Renamed to "' + r.suggestion + '"', 'success');
            });
            act.appendChild(fix);
        } else {
            const none = document.createElement('span');
            none.className = 'no-guess';
            none.textContent = 'not on his list';
            act.appendChild(none);
        }

        const go = document.createElement('button');
        go.type = 'button';
        go.className = 'mini-btn';
        go.textContent = 'Show me';
        go.addEventListener('click', function () {
            selectSlide(r.slideId);
            selectedPinId = r.pinId;
            renderPins();
            showView('build');
            openEditor(r.pinId);
        });
        act.appendChild(go);

        row.appendChild(act);
        box.appendChild(row);
    });
}

function renderChecklist() {
    renderFixups();
    const report = coverageReport();
    const totals = coverageTotals(report);

    const sum = $('cov-summary');
    sum.textContent = '';
    [
        { label: 'Everything on the handout', v: totals.all },
        { label: 'Lab models', v: totals.model },
        { label: 'Microscope slides', v: totals.histology }
    ].forEach(function (row) {
        const pct = row.v.total ? Math.round(row.v.covered / row.v.total * 100) : 0;
        const el = document.createElement('div');
        el.className = 'cov-row';

        const name = document.createElement('span');
        name.className = 'cov-name';
        name.textContent = row.label;

        const bar = document.createElement('span');
        bar.className = 'cov-bar';
        const fill = document.createElement('span');
        fill.className = 'cov-fill' + (pct === 100 ? ' full' : pct >= 60 ? ' most' : '');
        fill.style.width = pct + '%';
        bar.appendChild(fill);

        const num = document.createElement('span');
        num.className = 'cov-num';
        num.textContent = row.v.covered + ' / ' + row.v.total;

        el.appendChild(name);
        el.appendChild(bar);
        el.appendChild(num);
        sum.appendChild(el);
    });

    const box = $('checklist-groups');
    box.textContent = '';
    report.forEach(function (g) {
        const wrap = document.createElement('div');
        wrap.className = 'cov-group' + (g.kind === 'histology' ? ' histo' : '');

        const head = document.createElement('div');
        head.className = 'cov-group-head';
        const title = document.createElement('span');
        title.textContent = g.title + (g.slide ? '  (Slide ' + g.slide + ')' : '');
        const frac = document.createElement('span');
        frac.className = 'frac ' + (g.covered === g.total ? 'all' : g.covered ? 'some' : 'none');
        frac.textContent = g.covered + ' / ' + g.total;
        head.appendChild(title);
        head.appendChild(frac);
        wrap.appendChild(head);

        const list = document.createElement('div');
        list.className = 'cov-terms';
        g.terms.forEach(function (t) {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'term-chip' + (t.covered ? ' done' : '');
            if (t.covered && t.by) chip.title = 'pinned as "' + t.by + '"';
            else chip.title = 'Tap to place this one';

            const mark = document.createElement('span');
            mark.className = 'tick';
            mark.textContent = t.covered ? '✓' : '○';
            const label = document.createElement('span');
            label.textContent = t.name;
            chip.appendChild(mark);
            chip.appendChild(label);
            const fb = flagBadge(tierOfTerm(t.name));
            if (fb) chip.appendChild(fb);

            chip.addEventListener('click', function () {
                setPendingTerm(t.name);
                showView('build');
                toast('Now tap where "' + t.name + '" is');
            });
            list.appendChild(chip);
        });
        wrap.appendChild(list);
        box.appendChild(wrap);
    });
}

/* ---- tabs ---- */

function renderTabs() {
    const nav = $('slide-tabs');
    nav.textContent = '';
    SLIDE_ORDER.forEach(function (slideId) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tab' + (slideId === currentSlide ? ' active' : '') +
            (isDonorSlide(slideId) ? ' donor' : '');
        const name = document.createElement('span');
        name.textContent = slideTitle(slideId);
        if (isDonorSlide(slideId)) btn.title = 'Reference station from the labeling app';
        const badge = document.createElement('span');
        const n = (pinsBySlide[slideId] || []).length;
        badge.className = 'badge' + (n ? '' : ' zero');
        badge.textContent = String(n);
        btn.appendChild(name);
        btn.appendChild(badge);
        btn.addEventListener('click', function () { selectSlide(slideId); });
        nav.appendChild(btn);
    });
    const active = nav.querySelector('.tab.active');
    if (active && active.scrollIntoView) {
        active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
}

function selectSlide(slideId) {
    closeEditor();
    currentSlide = slideId;
    selectedPinId = null;
    resetZoom();
    const data = SLIDE_DATA[slideId];
    $('main-image').src = data.src;
    $('main-image').alt = slideTitle(slideId);
    $('slide-title-input').value = slideTitle(slideId);
    $('slide-hint').textContent = data.hint || '';
    renderTabs();
    renderPins();
}

/* ---- zoom & pan ---- */

function applyTransform() {
    const container = $('image-container');
    const vp = $('image-viewport');
    const w = container.offsetWidth, h = container.offsetHeight;
    const maxX = 0, maxY = 0;
    const minX = Math.min(0, vp.clientWidth - w * scale);
    const minY = Math.min(0, vp.clientHeight - h * scale);
    panX = Math.min(maxX, Math.max(minX, panX));
    panY = Math.min(maxY, Math.max(minY, panY));
    container.style.transform = 'translate(' + panX + 'px,' + panY + 'px) scale(' + scale + ')';
    $('markers-layer').style.setProperty('--inv', String(1 / scale));
    $('zoom-level').textContent = Math.round(scale * 100) + '%';
    vp.classList.toggle('zoomed', scale > 1.001);
    renderPins();
}

function resetZoom() { scale = 1; panX = 0; panY = 0; fitImageBox(); applyTransform(); }

/* Most of these are portrait phone photos. Left to fill the column width they
   run off the bottom of the screen, which in Test mode would put the pin and
   the answer box on different scrolls. Size the image box to whichever of
   width or height runs out first, and centre it. */
function fitImageBox() { sizeBox($('main-image'), $('image-viewport'), 48); }

function fitRunImageBox() { sizeBox($('run-image'), $('run-viewport'), 260); }

const VIEWPORT_BORDER = 4;   // 2px each side, and the box is border-box

function sizeBox(img, viewport, reserve) {
    if (!img.naturalWidth || !img.naturalHeight) return;
    const slot = viewport.parentElement;
    const aspect = img.naturalWidth / img.naturalHeight;
    const availW = slot.clientWidth || slot.getBoundingClientRect().width;
    const top = viewport.getBoundingClientRect().top;
    const availH = Math.max(260, window.innerHeight - top - reserve);
    const w = Math.max(200, Math.min(availW - VIEWPORT_BORDER, availH * aspect));
    viewport.style.width = (w + VIEWPORT_BORDER) + 'px';
}

function zoomAt(factor, clientX, clientY) {
    const vp = $('image-viewport');
    const rect = vp.getBoundingClientRect();
    const px = (clientX === undefined) ? rect.width / 2 : clientX - rect.left;
    const py = (clientY === undefined) ? rect.height / 2 : clientY - rect.top;
    const before = scale;
    scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor));
    if (scale === before) return;
    const cx = (px - panX) / before;
    const cy = (py - panY) / before;
    panX = px - cx * scale;
    panY = py - cy * scale;
    if (scale <= MIN_SCALE + 0.001) { scale = MIN_SCALE; panX = 0; panY = 0; }
    closeEditor();
    applyTransform();
}

/* Client coords -> 0..1 position on the image. Reading the container's own
   rect means zoom, pan and layout are already baked in. */
function clientToNorm(clientX, clientY) {
    const rect = $('image-container').getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return null;
    return { x: x, y: y };
}

/* Client coords -> px within the image box's own (unzoomed) coordinate space,
   which is what label positions and leader lines are expressed in. */
function clientToContainerPx(clientX, clientY) {
    const container = $('image-container');
    const rect = container.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return {
        x: (clientX - rect.left) / rect.width * container.offsetWidth,
        y: (clientY - rect.top) / rect.height * container.offsetHeight
    };
}

/* Dropped a label back roughly where it started? Forget the manual position
   so it goes back to tracking its pin. */
function settleLabel(pinId) {
    const pin = findPin(currentSlide, pinId);
    const here = labelPos[pinId], home = autoLabelPos[pinId];
    if (!pin || !here || !home) return;
    const dx = here.x - home.x, dy = here.y - home.y;
    if (Math.sqrt(dx * dx + dy * dy) <= 10) {
        delete pin.lx;
        delete pin.ly;
    }
}

/* ---- pin rendering ---- */

/* Offsets that must stay a constant size on screen have to be divided by the
   zoom, because they live inside the scaled container. */
function pxAtScale(px) { return (px / scale).toFixed(2) + 'px'; }

const SVG_NS = 'http://www.w3.org/2000/svg';

/* Where each label ended up this render, in container px. Used to anchor the
   inline editor and to decide whether a dropped label has come home. */
let labelPos = {};
let autoLabelPos = {};

let draggingPinId = null;
let draggingTagId = null;

function renderPins() {
    const layer = $('markers-layer');
    const lines = $('lines-layer');
    layer.textContent = '';
    while (lines.firstChild) lines.removeChild(lines.firstChild);

    const container = $('image-container');
    const W = container.offsetWidth, H = container.offsetHeight;
    const list = slidePins(currentSlide);
    const showTags = scale <= 1.6;
    const inv = 1 / scale;
    const gap = 14 * inv;          // breathing room between pin and label
    labelPos = {};
    autoLabelPos = {};

    list.forEach(function (pin) {
        const dot = document.createElement('div');
        dot.className = 'pin' +
            (pin.id === selectedPinId ? ' selected' : '') +
            (pin.id === draggingPinId ? ' dragging' : '');
        dot.style.left = (pin.x * 100) + '%';
        dot.style.top = (pin.y * 100) + '%';
        dot.dataset.pinId = pin.id;
        dot.title = pin.label || 'Unnamed pin';
        layer.appendChild(dot);

        if (pin.id === selectedPinId) {
            const del = document.createElement('div');
            del.className = 'pin-del';
            del.textContent = '×';
            del.title = 'Delete this pin';
            del.dataset.pinId = pin.id;
            del.style.left = 'calc(' + (pin.x * 100) + '% + ' + pxAtScale(18) + ')';
            del.style.top = 'calc(' + (pin.y * 100) + '% + ' + pxAtScale(18) + ')';
            // No click listener on purpose: closing the label editor re-renders
            // this layer, so a click listener here can be destroyed between
            // pointerdown and click and never fire. The pointer gesture below
            // carries the id instead.
            layer.appendChild(del);
        }

        if (!showTags || !W || !H) return;

        const named = String(pin.label || '').trim();
        const tag = document.createElement('div');
        tag.className = 'pin-tag' +
            (named ? '' : ' unnamed') +
            (pin.lx === undefined ? '' : ' placed') +
            (pin.id === draggingTagId ? ' dragging' : '');
        tag.textContent = named || 'name me';
        tag.dataset.pinId = pin.id;
        layer.appendChild(tag);

        // Measure first — the label's size decides where it can sit.
        const hw = tag.offsetWidth * inv / 2;
        const hh = tag.offsetHeight * inv / 2;
        const px = pin.x * W, py = pin.y * H;

        const auto = {
            x: Math.min(W - hw, Math.max(hw, px)),
            y: Math.min(H - hh, Math.max(hh, py - gap - hh))
        };
        autoLabelPos[pin.id] = auto;

        const centre = (pin.lx === undefined)
            ? auto
            : {
                x: Math.min(W - hw, Math.max(hw, pin.lx * W)),
                y: Math.min(H - hh, Math.max(hh, pin.ly * H))
            };
        labelPos[pin.id] = centre;

        tag.style.left = centre.x + 'px';
        tag.style.top = centre.y + 'px';

        const edge = rectEdgePoint(centre.x, centre.y, hw, hh, px, py);
        if (edge) {
            const ln = document.createElementNS(SVG_NS, 'line');
            ln.setAttribute('class', 'leader' + (named ? '' : ' unnamed'));
            ln.setAttribute('x1', edge.x);
            ln.setAttribute('y1', edge.y);
            ln.setAttribute('x2', px);
            ln.setAttribute('y2', py);
            lines.appendChild(ln);
        }
    });

    renderPinList();
}

function renderPinList() {
    const box = $('pin-list');
    const list = slidePins(currentSlide);
    box.textContent = '';
    $('pin-count').textContent = String(list.length);
    $('pin-empty').hidden = list.length > 0;

    list.forEach(function (pin, i) {
        const row = document.createElement('div');
        row.className = 'pin-row' + (pin.id === selectedPinId ? ' selected' : '');

        const num = document.createElement('span');
        num.className = 'num';
        num.textContent = String(i + 1);

        const name = document.createElement('span');
        const named = String(pin.label || '').trim();
        name.className = 'name' + (named ? '' : ' unnamed');
        name.textContent = named || 'unnamed — tap to name';

        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'row-del';
        del.textContent = '×';
        del.title = 'Delete';
        del.addEventListener('click', function (e) {
            e.stopPropagation();
            deletePin(pin.id);
        });

        row.appendChild(num);
        row.appendChild(name);
        row.appendChild(del);
        row.addEventListener('click', function () {
            selectedPinId = pin.id;
            renderPins();
            openEditor(pin.id);
        });
        box.appendChild(row);
    });
}

function findPin(slideId, pinId) {
    return (pinsBySlide[slideId] || []).filter(function (p) { return p.id === pinId; })[0] || null;
}

function addPin(x, y) {
    const armed = pendingTerm;
    const pin = { id: 'p' + (nextPinSeq++), x: x, y: y, label: armed || '' };
    slidePins(currentSlide).push(pin);
    selectedPinId = pin.id;
    savePins();
    renderTabs();

    if (armed) {
        // Came from the word bank, so it is already spelled his way — no
        // need to make you type anything.
        setPendingTerm(null);
        renderPins();
        const tier = tierOfTerm(armed);
        toast(tier ? 'Placed ' + armed + ' — flagged tier ' + tier + ' for the practical'
                   : 'Placed ' + armed, 'success');
        return;
    }
    renderPins();
    renderWordBank();
    openEditor(pin.id);
}

function deletePin(pinId) {
    const list = slidePins(currentSlide);
    const idx = list.findIndex(function (p) { return p.id === pinId; });
    if (idx < 0) return;
    const name = list[idx].label || 'pin';
    list.splice(idx, 1);
    if (selectedPinId === pinId) selectedPinId = null;
    closeEditor();
    savePins();
    renderTabs();
    renderPins();
    renderWordBank();
    toast('Deleted ' + name);
}

/* ---- inline label editor ----
   A real <input> parked over the pin. No prompt()/confirm() anywhere: modal
   browser dialogs freeze the page and are miserable on a tablet. */

let editorEl = null;

function closeEditor(commit) {
    if (!editorEl) return;
    const el = editorEl;
    const pinId = el.dataset.pinId;
    editorEl = null;
    if (commit) {
        const pin = findPin(currentSlide, pinId);
        if (pin) {
            // An answer key with a typo in it marks the right answer wrong, so
            // snap unmistakable misspellings onto the professor's wording —
            // but never behind your back, and never irreversibly. `keepWording`
            // means you have already overruled this pin once; leave it be.
            const typed = String(el.value || '').trim();
            const result = pin.keepWording
                ? { label: typed, snapped: false }
                : canonicalizeLabel(OBJECTIVE_GROUPS, typed);
            pin.label = result.label;
            savePins();
            if (result.snapped) {
                toast('Saved as "' + result.label + '"', 'success', {
                    label: 'Keep mine',
                    onClick: function () {
                        const p = findPin(currentSlide, pinId);
                        if (!p) return;
                        p.label = result.from;
                        p.keepWording = true;      // and don't ask again
                        savePins();
                        renderPins();
                        renderWordBank();
                        toast('Kept "' + result.from + '"');
                    }
                });
            }
        }
    }
    if (el.parentNode) el.parentNode.removeChild(el);
    renderPins();
    renderWordBank();
}

function openEditor(pinId) {
    closeEditor(true);
    const pin = findPin(currentSlide, pinId);
    if (!pin) return;
    selectedPinId = pinId;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'pin-editor';
    input.value = pin.label || '';
    input.placeholder = 'what is it?';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.dataset.pinId = pinId;
    // Anchor the editor on the label, wherever the label has been dragged to.
    const anchor = labelPos[pinId];
    if (anchor) {
        input.style.left = anchor.x + 'px';
        input.style.top = anchor.y + 'px';
        input.style.transform = 'translate(-50%, -50%) scale(' + (1 / scale) + ')';
    } else {
        input.style.left = (pin.x * 100) + '%';
        input.style.top = 'calc(' + (pin.y * 100) + '% - ' + pxAtScale(20) + ')';
        input.style.transform = 'translate(-50%, -100%) scale(' + (1 / scale) + ')';
    }

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); closeEditor(true); }
        else if (e.key === 'Escape') { e.preventDefault(); closeEditor(false); }
    });
    input.addEventListener('blur', function () { closeEditor(true); });
    input.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    input.addEventListener('click', function (e) { e.stopPropagation(); });

    $('markers-layer').appendChild(input);
    editorEl = input;
    input.focus();
    input.select();
}

/* ---- pointer handling: tap to place, drag a pin, drag to pan ---- */

let gesture = null;

function onViewportPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    if (editorEl && e.target === editorEl) return;
    // The zoom buttons sit inside the viewport; without this, tapping one also
    // drops a pin on the image underneath it.
    if (e.target.closest && e.target.closest('.zoom-controls')) { gesture = null; return; }

    const vp = $('image-viewport');
    const cls = e.target.classList;
    const pinEl = (cls && cls.contains('pin')) ? e.target : null;
    const tagEl = (cls && cls.contains('pin-tag')) ? e.target : null;
    const delEl = (cls && cls.contains('pin-del')) ? e.target : null;

    // Read the ids before anything re-renders; datasets survive detachment.
    const delId = delEl ? delEl.dataset.pinId : null;
    const pinId = pinEl ? pinEl.dataset.pinId : null;
    const tagId = tagEl ? tagEl.dataset.pinId : null;

    // Deleting discards whatever is half-typed; everything else keeps it.
    if (editorEl) closeEditor(!delId);

    gesture = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        moved: false,
        pinId: pinId,
        tagId: tagId,
        delId: delId,
        grabDX: 0,
        grabDY: 0
    };

    if (pinEl) {
        draggingPinId = gesture.pinId;
        selectedPinId = gesture.pinId;
    }

    if (tagEl) {
        // Remember where in the label the grab happened, so it doesn't jump
        // its own centre under the finger on the first move.
        const centre = labelPos[gesture.tagId];
        const p = clientToContainerPx(e.clientX, e.clientY);
        if (centre && p) {
            gesture.grabDX = centre.x - p.x;
            gesture.grabDY = centre.y - p.y;
        }
        draggingTagId = gesture.tagId;
        selectedPinId = gesture.tagId;
        renderPins();
    }

    try { vp.setPointerCapture(e.pointerId); } catch (err) { /* not fatal */ }
}

function onViewportPointerMove(e) {
    if (!gesture || e.pointerId !== gesture.pointerId) return;
    const dx = e.clientX - gesture.startX;
    const dy = e.clientY - gesture.startY;
    if (!gesture.moved && Math.abs(dx) + Math.abs(dy) > 5) gesture.moved = true;
    if (!gesture.moved) return;

    if (gesture.pinId) {
        const pos = clientToNorm(e.clientX, e.clientY);
        if (pos) {
            const pin = findPin(currentSlide, gesture.pinId);
            if (pin) { pin.x = pos.x; pin.y = pos.y; renderPins(); }
        }
    } else if (gesture.tagId) {
        const p = clientToContainerPx(e.clientX, e.clientY);
        const container = $('image-container');
        const W = container.offsetWidth, H = container.offsetHeight;
        const pin = findPin(currentSlide, gesture.tagId);
        if (p && pin && W && H) {
            pin.lx = clamp01((p.x + gesture.grabDX) / W);
            pin.ly = clamp01((p.y + gesture.grabDY) / H);
            renderPins();
        }
    } else if (!gesture.delId && scale > 1.001) {
        panX += e.clientX - gesture.lastX;
        panY += e.clientY - gesture.lastY;
        $('image-viewport').classList.add('panning');
        applyTransform();
    }
    gesture.lastX = e.clientX;
    gesture.lastY = e.clientY;
}

function onViewportPointerUp(e) {
    if (!gesture || e.pointerId !== gesture.pointerId) return;
    const g = gesture;
    gesture = null;
    draggingPinId = null;
    draggingTagId = null;
    $('image-viewport').classList.remove('panning');
    try { $('image-viewport').releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }

    if (g.delId) {
        // Forgiving on a wobbly pen or fingertip, but a deliberate drag away
        // from the button is treated as a change of mind.
        const slip = Math.abs(e.clientX - g.startX) + Math.abs(e.clientY - g.startY);
        if (slip < 24) deletePin(g.delId);     // never falls through to placing one
        return;
    }

    if (g.pinId) {
        if (g.moved) { savePins(); renderPins(); }
        else { openEditor(g.pinId); }
        return;
    }

    if (g.tagId) {
        if (g.moved) { settleLabel(g.tagId); savePins(); renderPins(); }
        else { renderPins(); openEditor(g.tagId); }
        return;
    }

    if (g.moved) return;                       // that was a pan, not a tap

    const pos = clientToNorm(e.clientX, e.clientY);
    if (pos) addPin(pos.x, pos.y);
    else { selectedPinId = null; renderPins(); }
}

/* ---- build actions ---- */

function clearSlide() {
    const n = slidePins(currentSlide).length;
    if (!n) { toast('Nothing to clear on this slide'); return; }
    pinsBySlide[currentSlide] = [];
    selectedPinId = null;
    closeEditor();
    savePins();
    renderTabs();
    renderPins();
    renderWordBank();
    toast('Cleared ' + n + ' pin' + (n === 1 ? '' : 's') + ' from this slide');
}

function resetEverything() {
    const btn = $('btn-reset-all');
    if (btn.dataset.armed !== '1') {
        btn.dataset.armed = '1';
        btn.textContent = 'Really wipe every pin? Tap again';
        setTimeout(function () {
            btn.dataset.armed = '0';
            btn.textContent = 'Reset everything';
        }, 4000);
        return;
    }
    btn.dataset.armed = '0';
    btn.textContent = 'Reset everything';
    try {
        localStorage.removeItem(K_PINS);
        localStorage.removeItem(K_TITLES);
        localStorage.removeItem(K_SETTINGS);
    } catch (e) { /* ignore */ }
    pinsBySlide = sanitizePins(Object.assign({}, PRESET_PINS));
    titleOverrides = Object.assign({}, PRESET_TITLES);
    selectedPinId = null;
    pendingTerm = null;
    closeEditor();
    selectSlide(SLIDE_ORDER[0]);
    toast('Reset — back to the built-in pin set', 'success');
}

function exportPinSet() {
    const payload = {
        app: 'bio40b-practical-2-pins',
        version: 1,
        exported: new Date().toISOString(),
        titles: titleOverrides,
        pins: pinsBySlide
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = 'bio40b-practical2-pins-' + stamp + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast('Exported ' + countAllPins() + ' pins', 'success');
}

function countAllPins() {
    return Object.keys(pinsBySlide).reduce(function (n, s) { return n + pinsBySlide[s].length; }, 0);
}

function importPinSet(evt) {
    const file = evt.target.files && evt.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
        let data;
        try { data = JSON.parse(reader.result); }
        catch (e) { toast('That file is not valid JSON', 'error'); return; }
        if (!data || typeof data !== 'object' || !data.pins) {
            toast('That does not look like a pin set export', 'error');
            return;
        }
        const cleaned = sanitizePins(data.pins);
        const n = Object.keys(cleaned).reduce(function (t, s) { return t + cleaned[s].length; }, 0);
        if (!n) { toast('No usable pins in that file', 'error'); return; }
        pinsBySlide = cleaned;
        titleOverrides = (data.titles && typeof data.titles === 'object') ? data.titles : {};
        selectedPinId = null;
        savePins();
        selectSlide(currentSlide);
        renderWordBank();
        toast('Imported ' + n + ' pins', 'success');
    };
    reader.onerror = function () { toast('Could not read that file', 'error'); };
    reader.readAsText(file);
    evt.target.value = '';
}

/* ══════════════════════════════════════════════════════════════════
   4. TEST MODE
   ══════════════════════════════════════════════════════════════════ */

let run = null;

function slidesWithPins() {
    return SLIDE_ORDER.filter(function (s) { return namedPinCount(s) > 0; });
}

function selectedSlides() {
    const available = slidesWithPins();
    if (!settings.slides) return available;
    const chosen = available.filter(function (s) { return settings.slides[s] !== false; });
    return chosen;
}

function renderSetup() {
    const available = slidesWithPins();
    const box = $('setup-slide-list');
    box.textContent = '';
    $('setup-empty').hidden = available.length > 0;

    available.forEach(function (slideId) {
        const on = !settings.slides || settings.slides[slideId] !== false;
        const row = document.createElement('label');
        row.className = 'slide-check' + (on ? '' : ' off');

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = on;
        cb.addEventListener('change', function () {
            if (!settings.slides) settings.slides = {};
            settings.slides[slideId] = cb.checked;
            saveSettings();
            renderSetup();
        });

        const name = document.createElement('span');
        name.className = 'cname';
        name.textContent = slideTitle(slideId);

        const count = document.createElement('span');
        const n = namedPinCount(slideId);
        count.className = 'cpins';
        count.textContent = n + ' pin' + (n === 1 ? '' : 's');

        row.appendChild(cb);
        row.appendChild(name);
        row.appendChild(count);
        box.appendChild(row);
    });

    $('opt-timed').checked = settings.timed;
    $('opt-seconds').value = settings.seconds;
    $('opt-shuffle').checked = settings.shuffle;
    $('opt-show-others').checked = settings.showOthers;
    $('opt-strict').checked = settings.strict;
    $('timer-row').hidden = !settings.timed;
    $('timed-desc').textContent = formatClock(settings.seconds) + ' per slide';

    const chosen = selectedSlides();
    const total = chosen.reduce(function (n, s) { return n + namedPinCount(s); }, 0);
    $('setup-tally').textContent = total
        ? total + ' question' + (total === 1 ? '' : 's') + ' across ' + chosen.length + ' slide' + (chosen.length === 1 ? '' : 's')
        : 'Pick at least one slide';
    $('btn-start').disabled = total === 0;
}

function startTest(only) {
    const blocks = buildQueue(pinsBySlide, selectedSlides(), { shuffle: settings.shuffle }, only);
    if (!countQuestions(blocks)) { toast('Nothing to test yet', 'error'); return; }
    run = {
        blocks: blocks,
        bi: 0,
        qi: 0,
        total: countQuestions(blocks),
        done: 0,
        results: [],
        deadline: 0,
        ticker: null,
        awaitingNext: false,
        labels: allLabels()
    };
    showView('run');
    $('run-viewport').classList.toggle('show-others', settings.showOthers);
    enterBlock();
}

function currentBlock() { return run.blocks[run.bi]; }

function enterBlock() {
    const block = currentBlock();
    if (!block) { finishTest(); return; }
    run.qi = 0;
    $('run-image').src = SLIDE_DATA[block.slideId].src;
    $('run-image').alt = slideTitle(block.slideId);
    $('run-slide-name').textContent = slideTitle(block.slideId);
    fitRunImageBox();          // again on 'load' — this covers the cached case
    startBlockTimer();
    showQuestion();
}

function startBlockTimer() {
    stopTicker();
    const track = $('timer-track'), clock = $('run-clock');
    if (!settings.timed) {
        track.hidden = true;
        clock.hidden = true;
        return;
    }
    track.hidden = false;
    clock.hidden = false;
    run.deadline = Date.now() + settings.seconds * 1000;
    tickTimer();
    run.ticker = setInterval(tickTimer, 200);
}

function stopTicker() {
    if (run && run.ticker) { clearInterval(run.ticker); run.ticker = null; }
}

function tickTimer() {
    if (!run || !settings.timed) return;
    const left = (run.deadline - Date.now()) / 1000;
    const frac = Math.max(0, Math.min(1, left / settings.seconds));
    const low = left <= 15;
    $('run-clock').textContent = formatClock(left);
    $('run-clock').classList.toggle('low', low);
    $('timer-fill').style.transform = 'scaleX(' + frac + ')';
    $('timer-fill').classList.toggle('low', low);
    if (left <= 0) expireBlock();
}

function expireBlock() {
    stopTicker();
    const block = currentBlock();
    if (!block) return;
    for (let i = run.qi; i < block.pinIds.length; i++) {
        const pin = findPin(block.slideId, block.pinIds[i]);
        if (!pin) continue;
        run.results.push({
            slideId: block.slideId,
            pinId: pin.id,
            label: pin.label,
            given: '',
            verdict: 'timeout'
        });
        run.done++;
    }
    toast("Time's up on " + slideTitle(block.slideId), 'error');
    run.bi++;
    run.awaitingNext = false;
    enterBlock();
}

function showQuestion() {
    const block = currentBlock();
    if (!block) { finishTest(); return; }
    if (run.qi >= block.pinIds.length) {
        stopTicker();
        run.bi++;
        enterBlock();
        return;
    }

    run.awaitingNext = false;
    $('run-progress').textContent = 'Q' + (run.done + 1) + ' / ' + run.total;
    $('feedback').hidden = true;
    $('feedback').textContent = '';
    const input = $('answer-input');
    input.value = '';
    input.disabled = false;
    $('btn-answer').textContent = 'Submit';
    $('btn-answer').disabled = false;
    $('btn-skip').hidden = false;
    renderRunPins();
    input.focus();
}

function renderRunPins() {
    const block = currentBlock();
    const layer = $('run-markers');
    layer.textContent = '';
    if (!block) return;

    const activeId = block.pinIds[run.qi];
    const answered = {};
    run.results.forEach(function (r) {
        if (r.slideId === block.slideId) answered[r.pinId] = r.verdict;
    });

    (pinsBySlide[block.slideId] || []).forEach(function (pin) {
        const isActive = pin.id === activeId;
        const verdict = answered[pin.id];
        if (!isActive && !verdict && !settings.showOthers) return;

        const dot = document.createElement('div');
        let cls = 'pin ';
        if (isActive) cls += 'quiz-active';
        else if (verdict === 'right' || verdict === 'close') cls += 'quiz-correct';
        else if (verdict) cls += 'quiz-wrong';
        else cls += 'quiz-dim';
        dot.className = cls;
        dot.style.left = (pin.x * 100) + '%';
        dot.style.top = (pin.y * 100) + '%';
        layer.appendChild(dot);
    });
}

function submitAnswer(skipped) {
    if (!run || run.awaitingNext) { advance(); return; }
    const block = currentBlock();
    if (!block) return;
    const pin = findPin(block.slideId, block.pinIds[run.qi]);
    if (!pin) { run.qi++; showQuestion(); return; }

    const given = skipped ? '' : $('answer-input').value;
    if (!skipped && !String(given).trim()) {
        $('answer-input').focus();
        return;
    }

    const others = run.labels.filter(function (l) { return l !== pin.label; });
    const graded = skipped
        ? { verdict: 'wrong' }
        : gradeAnswer(given, pin.label, others, settings.strict);

    run.results.push({
        slideId: block.slideId,
        pinId: pin.id,
        label: pin.label,
        given: skipped ? '(skipped)' : given,
        verdict: skipped ? 'skipped' : graded.verdict
    });
    run.done++;

    showFeedback(graded.verdict, pin.label, skipped);
    renderRunPins();
}

function showFeedback(verdict, label, skipped) {
    const fb = $('feedback');
    fb.textContent = '';
    fb.hidden = false;
    run.awaitingNext = true;

    const headline = document.createElement('span');
    if (verdict === 'right') {
        fb.className = 'feedback right';
        headline.textContent = 'Correct.';
    } else if (verdict === 'close') {
        fb.className = 'feedback close';
        headline.textContent = 'Close enough — watch the spelling.';
    } else {
        fb.className = 'feedback wrong';
        headline.textContent = skipped ? 'Skipped.' : 'Not quite.';
    }
    fb.appendChild(headline);

    if (verdict !== 'right') {
        const ans = document.createElement('span');
        ans.className = 'ans';
        ans.textContent = label;
        fb.appendChild(ans);
    }

    const nudge = document.createElement('span');
    nudge.className = 'nudge';
    nudge.textContent = 'Enter for the next one';
    fb.appendChild(nudge);

    $('answer-input').disabled = true;
    $('btn-answer').textContent = 'Next →';
    $('btn-skip').hidden = true;
    $('btn-answer').focus();

    if (verdict === 'right') {
        clearTimeout(showFeedback._t);
        showFeedback._t = setTimeout(function () {
            if (run && run.awaitingNext) advance();
        }, 1100);
    }
}

function advance() {
    clearTimeout(showFeedback._t);
    if (!run) return;
    run.awaitingNext = false;
    run.qi++;
    showQuestion();
}

function finishTest() {
    stopTicker();
    renderResults();
    showView('results');
}

function quitTest() {
    stopTicker();
    if (run && run.results.length) { renderResults(); showView('results'); }
    else { run = null; showView('build'); }
}

function renderResults() {
    const results = run ? run.results : [];
    const good = results.filter(function (r) { return r.verdict === 'right' || r.verdict === 'close'; }).length;
    const total = results.length;
    const pct = total ? Math.round((good / total) * 100) : 0;

    const scoreEl = $('result-score');
    scoreEl.textContent = pct + '%';
    scoreEl.className = 'score ' + (pct === 100 ? 'perfect' : pct >= 70 ? 'good' : 'poor');

    const typos = results.filter(function (r) { return r.verdict === 'close'; }).length;
    const timeouts = results.filter(function (r) { return r.verdict === 'timeout'; }).length;
    let detail = good + ' of ' + total + ' correct';
    if (typos) detail += ' · ' + typos + ' accepted with a spelling slip';
    if (timeouts) detail += ' · ' + timeouts + ' ran out of time';
    $('result-detail').textContent = detail;

    const box = $('result-breakdown');
    box.textContent = '';

    const bySlide = {};
    const order = [];
    results.forEach(function (r) {
        if (!bySlide[r.slideId]) { bySlide[r.slideId] = []; order.push(r.slideId); }
        bySlide[r.slideId].push(r);
    });

    order.forEach(function (slideId) {
        const rows = bySlide[slideId];
        const okCount = rows.filter(function (r) { return r.verdict === 'right' || r.verdict === 'close'; }).length;

        const wrap = document.createElement('div');
        wrap.className = 'slide-result';

        const head = document.createElement('div');
        head.className = 'slide-result-head';
        const nm = document.createElement('span');
        nm.textContent = slideTitle(slideId);
        const frac = document.createElement('span');
        frac.className = 'frac ' + (okCount === rows.length ? 'all' : okCount === 0 ? 'none' : 'some');
        frac.textContent = okCount + ' / ' + rows.length;
        head.appendChild(nm);
        head.appendChild(frac);
        wrap.appendChild(head);

        rows.forEach(function (r) {
            const ok = r.verdict === 'right' || r.verdict === 'close';
            const row = document.createElement('div');
            row.className = 'q-row ' + (ok ? 'ok' : 'no');

            const mark = document.createElement('span');
            mark.className = 'mark';
            mark.textContent = ok ? '✓' : '✗';

            const body = document.createElement('span');
            body.className = 'body';
            const correct = document.createElement('span');
            correct.className = 'correct';
            correct.textContent = r.label;
            body.appendChild(correct);

            const given = document.createElement('span');
            given.className = 'given' + (r.verdict === 'close' ? ' typo' : '');
            if (r.verdict === 'timeout') given.textContent = '  — ran out of time';
            else if (r.verdict === 'close') given.textContent = '  — you wrote "' + r.given + '"';
            else if (!ok) given.textContent = '  — you wrote "' + r.given + '"';
            body.appendChild(given);

            row.appendChild(mark);
            row.appendChild(body);
            wrap.appendChild(row);
        });

        box.appendChild(wrap);
    });

    const missed = results.filter(function (r) { return r.verdict !== 'right' && r.verdict !== 'close'; });
    $('btn-retry-missed').disabled = missed.length === 0;
    $('btn-retry-missed').textContent = missed.length
        ? 'Retry the ' + missed.length + ' I missed'
        : 'Nothing missed';
}

function retryMissed() {
    if (!run) return;
    const only = new Set();
    run.results.forEach(function (r) {
        if (r.verdict !== 'right' && r.verdict !== 'close') only.add(r.slideId + '::' + r.pinId);
    });
    if (!only.size) return;
    startTest(only);
}

/* ══════════════════════════════════════════════════════════════════
   5. BOOT
   ══════════════════════════════════════════════════════════════════ */

function wire() {
    $('btn-mode-build').addEventListener('click', function () {
        stopTicker();
        run = null;
        showView('build');
    });
    $('btn-mode-list').addEventListener('click', function () {
        closeEditor(true);
        stopTicker();
        renderChecklist();
        showView('checklist');
    });
    $('btn-mode-cram').addEventListener('click', function () {
        closeEditor(true);
        stopTicker();
        renderCram();
        showView('cram');
    });
    $('btn-mode-test').addEventListener('click', function () {
        closeEditor(true);
        stopTicker();
        renderSetup();
        showView('setup');
    });
    $('btn-why-cram').addEventListener('click', function () { $('cram-modal').hidden = false; });
    $('btn-close-cram-modal').addEventListener('click', function () { $('cram-modal').hidden = true; });
    $('cram-modal').addEventListener('click', function (e) {
        if (e.target === $('cram-modal')) $('cram-modal').hidden = true;
    });

    // Word bank
    $('bank-search').addEventListener('input', renderWordBank);
    $('bank-missing-only').addEventListener('change', renderWordBank);
    $('btn-pending-cancel').addEventListener('click', function () { setPendingTerm(null); });
    $('btn-goto-test').addEventListener('click', function () {
        closeEditor(true);
        renderSetup();
        showView('setup');
    });

    // Build
    const vp = $('image-viewport');
    vp.addEventListener('pointerdown', onViewportPointerDown);
    vp.addEventListener('pointermove', onViewportPointerMove);
    vp.addEventListener('pointerup', onViewportPointerUp);
    vp.addEventListener('pointercancel', function (e) {
        if (gesture && e.pointerId === gesture.pointerId) {
            const wasDragging = gesture.pinId || gesture.tagId;
            gesture = null;
            draggingPinId = null;
            draggingTagId = null;
            vp.classList.remove('panning');
            if (wasDragging) { savePins(); renderPins(); }
        }
    });
    vp.addEventListener('wheel', function (e) {
        e.preventDefault();
        zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY);
    }, { passive: false });

    $('btn-zoom-in').addEventListener('click', function () { zoomAt(1.3); });
    $('btn-zoom-out').addEventListener('click', function () { zoomAt(1 / 1.3); });
    $('btn-zoom-fit').addEventListener('click', resetZoom);

    $('main-image').addEventListener('load', function () { fitImageBox(); applyTransform(); });
    $('run-image').addEventListener('load', function () { fitRunImageBox(); renderRunPins(); });
    window.addEventListener('resize', function () {
        closeEditor(true);
        fitImageBox();
        applyTransform();
        if (run) { fitRunImageBox(); renderRunPins(); }
    });

    $('slide-title-input').addEventListener('change', function () {
        const v = $('slide-title-input').value.trim();
        if (v && v !== SLIDE_DATA[currentSlide].title) titleOverrides[currentSlide] = v;
        else delete titleOverrides[currentSlide];
        savePins();
        renderTabs();
    });

    $('btn-clear-slide').addEventListener('click', clearSlide);
    $('btn-reset-all').addEventListener('click', resetEverything);
    $('btn-export').addEventListener('click', exportPinSet);
    $('btn-import-click').addEventListener('click', function () { $('import-file').click(); });
    $('import-file').addEventListener('change', importPinSet);

    // Setup
    $('btn-select-all').addEventListener('click', function () {
        settings.slides = null; saveSettings(); renderSetup();
    });
    $('btn-select-none').addEventListener('click', function () {
        settings.slides = {};
        slidesWithPins().forEach(function (s) { settings.slides[s] = false; });
        saveSettings(); renderSetup();
    });
    $('opt-timed').addEventListener('change', function () {
        settings.timed = $('opt-timed').checked; saveSettings(); renderSetup();
    });
    $('opt-seconds').addEventListener('change', function () {
        const v = parseInt($('opt-seconds').value, 10);
        settings.seconds = (isFinite(v) && v >= 15 && v <= 900) ? v : 120;
        saveSettings(); renderSetup();
    });
    $('opt-shuffle').addEventListener('change', function () {
        settings.shuffle = $('opt-shuffle').checked; saveSettings();
    });
    $('opt-show-others').addEventListener('change', function () {
        settings.showOthers = $('opt-show-others').checked; saveSettings();
    });
    $('opt-strict').addEventListener('change', function () {
        settings.strict = $('opt-strict').checked; saveSettings();
    });
    $('btn-start').addEventListener('click', function () { startTest(null); });

    // Runner
    $('answer-form').addEventListener('submit', function (e) {
        e.preventDefault();
        if (run && run.awaitingNext) advance();
        else submitAnswer(false);
    });
    $('btn-skip').addEventListener('click', function () { submitAnswer(true); });
    $('btn-quit').addEventListener('click', quitTest);

    // Results
    $('btn-retry-missed').addEventListener('click', retryMissed);
    $('btn-retry-all').addEventListener('click', function () { startTest(null); });
    $('btn-back-build').addEventListener('click', function () {
        run = null;
        showView('build');
    });

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (!$('cram-modal').hidden) { $('cram-modal').hidden = true; return; }
        if (editorEl) closeEditor(false);
        else if (pendingTerm) setPendingTerm(null);
    });
}

function boot() {
    mergeDonorSlides();
    mergeSourcedSlides();
    loadState();
    wire();
    renderCredits();
    renderWordBank();
    selectSlide(SLIDE_ORDER[0]);
    showView('build');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}

})(typeof globalThis !== 'undefined' ? globalThis : this);
