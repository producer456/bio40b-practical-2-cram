# BIOL 40B — Practical 2: Cram Trainer

A study site for the BIOL 40B lab practical 2. **You** place every pin and name
it — nothing ships pre-pinned, because finding and naming a structure is the
studying. Then it tests you on what you built (one pin lights up, you type what
it is, two minutes per slide), tracks you against the professor's objectives
handout, and ranks what to learn first when time is short.

Live: https://producer456.github.io/bio40b-practical-2-cram/

This is a **separate site** from its three siblings:

- build-your-own-pins — https://producer456.github.io/bio40b-practical-2-pins/
- the labeling app — https://producer456.github.io/bio40b-lab-exam-2-labeling/
- the spelling drill — https://producer456.github.io/bio40b-spelling-drill/

All four share the `producer456.github.io` origin, and therefore its
localStorage. This one namespaces every key under **`bio40b_p2cram_`** so it
cannot read or overwrite the pins saved on any of the others — in particular
the practical-2-pins site, which uses `bio40b_p2_`.

## Using it

**Build mode**

- Tap the image to drop a pin, type what it is, Enter.
- Drag a pin to nudge it; tap a pin (or its label) to rename; `×` to delete.
- **Drag a label anywhere you like** — a dotted leader line keeps it connected
  to its pin, so labels can sit clear of the structure instead of covering it.
  Drop one back on top of its pin and it reverts to tracking the pin. Moved
  labels are stored as `lx`/`ly` alongside the pin and travel through
  export/import and the repo preset.
- Pinch, scroll or use the zoom buttons for precise placement — pins keep a
  constant on-screen size at any zoom, and tags hide past 160% so they don't
  cover the model.
- Rename a slide in the sidebar if you prefer your own wording.
- Everything saves to the browser as you go.

**Label syntax**

| You type | Accepted answers |
| --- | --- |
| `Bicuspid valve / Mitral valve` | either wording |
| `Aorta (ascending)` | `aorta` or `aorta ascending` |

Answers ignore case, punctuation, extra spaces and a leading "the".

**Checklist mode**

The professor's Lab Exam 2 objectives handout is transcribed into
`objectives.js` — 127 required structures in 21 groups. Checklist mode shows
which of them you have a pin for anywhere, split into lab models and
microscope slides, and flags any label of yours that is not the handout's
exact wording (with a one-tap fix, since your labels *are* the answer key).

Tap any missing term to arm it, then tap its spot on the image; it is placed
with the professor's spelling and no typing. The word bank in the Build
sidebar does the same thing while you work.

Automatic corrections are always reversible: an unmistakable misspelling snaps
to the official wording with a **Keep mine** action on the toast, and taking
that once marks the pin so it is never auto-changed again.

**Donor stations**

`donor.js` carries 19 pre-pinned reference stations imported from the sibling
labeling app (`tools/import-donor.py`), covering what lab-bench photos cannot:
the histology slides, the conduction system and the pericardial layers. They
appear after your own slides, marked ★. Editing or clearing one is fine — your
version wins over what ships. Regenerate with:

```sh
python3 tools/import-donor.py
```

**Function quiz**

Naming a pinned structure is half of the objectives sheet; the other half asks
what it *does*. `functions.js` carries **one multiple-choice question for every
one of the 127 entries on the handout** — 122 questions, since Cilia, Mucosa,
Lumen and Goblet cells are listed under more than one slide and are asked once.

- Pick which objectives groups to be asked about; lab models and microscope
  slides are listed separately.
- Four options, three of them distractors. The distractors are deliberately the
  *real* functions of the structures you are most likely to confuse it with —
  the tricuspid question offers you the bicuspid's job, the epiglottis question
  offers you the glottis. A vague memory does not survive that.
- Answer with a tap or the **1**–**4** keys; **Enter** moves on.
- After each answer you get the right one plus a line on how to tell the pair
  apart, and the results screen lists every miss with the same note.
- **Drill the ones I keep missing** builds a quiz from your own miss history,
  which is kept under `bio40b_p2cram_fnmissed`. A term drops off that list once
  you get it right again.

`tests/functions-test.js` fails the build if any handout term has no question,
if a question invents a term the professor never listed, or if the correct
answer is usually the longest option — a quiz you can beat by picking the
wordiest answer teaches nothing.

**Test mode**

- Pick slides, then Start.
- Timed (default 2:00 per slide) or untimed; when the clock runs out the
  remaining pins on that slide are marked wrong and it moves on.
- Optional shuffle, optional dimmed context pins, optional strict spelling.
- Results break down per slide, and you can retry only the ones you missed.

**Typo forgiveness.** A near miss is accepted and flagged "watch the spelling"
— but only if the answer isn't closer to some *other* structure you've pinned.
`inferior vena cava` is three edits from `superior vena cava` and is always
marked wrong, never treated as a typo. Turn on Strict spelling to require
exact answers.

## Sharing a pin set

- **Export pin set** downloads a JSON file — import it on another device or
  send it to a classmate.
- To make your pins the site default for everyone:

  ```sh
  python3 tools/key-to-preset.py ~/Downloads/bio40b-practical2-pins-YYYY-MM-DD.json
  git commit -am "Update the built-in pin set"
  ```

  Then hit **Reset everything** in the browser so your device copy stops
  shadowing the committed one. Load order is
  `localStorage` → `preset.js` → empty.

## Layout

```
index.html      markup for every view (build / checklist / cram / functions / test)
styles.css      the shared BIOL 40B look
slides.js       the 14 slides: image path, default title, hint
objectives.js   the professor's Lab Exam 2 checklist, transcribed
functions.js    one function question per checklist term, with distractors
preset.js       GENERATED — the built-in pin set
app.js          logic + UI; the top section is DOM-free and unit-tested
tools/          key-to-preset.py
tests/          logic-test.js, functions-test.js
images/         the lab photos, renamed to stable slugs
```

## Tests

No node on this machine, so the suite runs under gjs (SpiderMonkey). `app.js`
returns before touching the DOM when `document` is undefined, so it loads
cleanly there.

```sh
gjs tests/logic-test.js
gjs tests/functions-test.js
```

The first suite covers answer normalization, synonym and parenthetical
handling, typo tolerance, the confusable-structure guard, queue building and
the clock. The second checks the function bank against `objectives.js` — full
coverage, no invented terms, three distinct distractors each, and no
answer-is-longest tell.

To try it in a browser, serve it locally — **never** test against
`producer456.github.io`, since that origin holds real saved work for the other
two sites:

```sh
python3 -m http.server 8137   # then open http://localhost:8137/
```

## Images

The 14 photos are the author's own lab images of the practical 2 models,
copied in from `~/Downloads/Images for practical 2 40b` and renamed to stable
slugs so pin coordinates never break.
