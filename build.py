"""Build the deck: src/template.html + src/theme.css + src/deck.js + slides/*.html -> index.html.

    python build.py              # the full deck, index.html
    python build.py --only 2     # slide 2 alone with stubs for the others, preview-2.html (open at #2)
"""
import argparse
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
# (fragment, section id, chapter on the footer rail)
SLIDES = [
    ("01-reroute.html", "r1", "Reroute"),
    ("02-pricing.html", "p2", "Pricing"),
    ("03-pickup.html", "k3", "Pick-up"),
]


def read(*parts):
    with open(os.path.join(ROOT, *parts), encoding="utf-8") as f:
        return f.read()


def fragment(name, sid, chapter):
    html = read("slides", name).strip()
    sections = re.findall(r"<section\b[^>]*>", html)
    assert len(sections) == 1, f"{name}: expected exactly one <section>, found {len(sections)}"
    tag = sections[0]
    assert f'id="{sid}"' in tag, f"{name}: the section must have id=\"{sid}\""
    assert f'data-chapter="{chapter}"' in tag, f"{name}: the section must have data-chapter=\"{chapter}\""
    assert 'class="slide content' in tag, f"{name}: the section class must start with \"slide content\""
    assert html.endswith("</section>"), f"{name}: the fragment must end with </section>"
    return html


def stub(sid, chapter):
    return (f'<section class="slide content" id="{sid}" data-chapter="{chapter}" data-title="(stub)">'
            f'<div class="inner"></div><div class="foot"><span>stub</span><span class="rail"></span><span class="pg"></span></div></section>')


def build(only=None):
    parts = []
    for i, (name, sid, chapter) in enumerate(SLIDES, 1):
        parts.append(fragment(name, sid, chapter) if only in (None, i) else stub(sid, chapter))
    out = (read("src", "template.html")
           .replace("{{THEME}}", read("src", "theme.css"))
           .replace("{{SLIDES}}", "\n\n".join(parts))
           .replace("{{DECKJS}}", read("src", "deck.js")))
    path = os.path.join(ROOT, "index.html" if only is None else f"preview-{only}.html")
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(out)
    print("wrote", os.path.relpath(path, ROOT), len(out), "bytes")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", type=int, choices=range(1, len(SLIDES) + 1))
    build(ap.parse_args().only)
