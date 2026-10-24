# Chagee Singapore · online retail improvements

Three slides for OPIM639 (Group 3), one per proposed improvement to Chagee Singapore's online retail:

1. **Capacity-aware order alerts and rerouting**: a static lunch-rush view in 10-minute slots, with the two customer-side options (an in-app pop-up, or closing the busy outlet on delivery apps).
2. **Dynamic pricing for different scenarios**: an offer engine over time of day, weather and nearby events, plus the dormant-member nudges.
3. **Self pick-up to reduce last-mile delivery**: what leaves Chagee per cup on each channel, and the pick-up incentives on a checkout mock.

The theme follows the group's storyboard deck, [KeziahVickraman-MBAI/new-chagee-deck](https://github.com/KeziahVickraman-MBAI/new-chagee-deck).

## View it

Open `index.html` in a browser. It is one self-contained file (Google Fonts aside).

- **→**, Space, PageDown or the toolbar ▶: darken the right-hand cards one at a time, then go to the next slide. **←**, PageUp or ◀ steps back. Click a card to darken it directly.
- **N** speaker notes · **F** full screen · **P** print or save as PDF · **G** go to a slide · **Home / End** first / last slide
- Every slide opens on a complete static state, so a printed or PDF copy reads without clicking.

To publish it, deploy the repository as a static site (for example on Vercel, with no build command). `index.html` at the root is the deck.

## Edit it

```
slides/01-reroute.html    slide 1 (section #r1)
slides/02-pricing.html    slide 2 (section #p2)
slides/03-pickup.html     slide 3 (section #k3)
src/theme.css             theme, trimmed from the group deck
src/template.html         page shell and presenter toolbar
src/deck.js               scaling, navigation, notes, print
build.py                  assembles index.html
```

Edit a fragment, then rebuild:

```
python build.py            # index.html
python build.py --only 2   # preview-2.html, slide 2 alone
```

Each fragment holds its own markup, scoped `<style>` and `<script>`. Selectors are prefixed with the slide id (`#r1`, `#p2`, `#k3`).

## Numbers

All figures are illustrative assumptions, not Chagee data.

| | Assumption | Result |
|---|---|---|
| Sales base | S$48.2M a year (44 outlets × ~500 cups a day × S$6 × 365) | |
| Slide 1 | peak hours 40% of volume; rerouting keeps 3% more peak cups; 70% gross margin | S$0.58M revenue, S$0.4M gross profit a year |
| Slide 2 | S$6 price − S$1 voucher − S$1.80 ingredients; +5% on S$12.05M delivery sales at ~40% margin | S$3.20 a cup; S$241k a year |
| Slide 3 | delivery 25% of sales; 10% shifts to app pick-up; 17% average saving per shifted order | S$205k a year |

Simulation values inside the explainers (slot capacity, demand curves, walking time) are toy values chosen for illustration.
