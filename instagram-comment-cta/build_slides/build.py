"""Rebuild the closing slide of the 14 scheduled carousels with the comment-for-link call to action.
Run: python3 build.py   (reads its CSS from template.html in this folder; needs playwright and the Inter font)
"""
import os, re
from playwright.sync_api import sync_playwright
BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "out")
os.makedirs(OUT, exist_ok=True)
src = open(os.path.join(BASE, "template.html"), encoding="utf-8").read()
CSS = re.search(r"<style>(.*?)</style>", src, re.S).group(1)
BADGE = "UNOFFICIAL • INDEPENDENT • NOT ENDORSED"

# file, code, book (h1 split: plain part, blue part), n, alt prefix
BOOKS = [
 ("01","GREAT","Good to Great","Good to Great"),
 ("02","OWNIT","Extreme Ownership","Extreme Ownership"),
 ("03","DARE","Dare to Lead","Dare to Lead"),
 ("04","EATLAST","Leaders Eat Last","Leaders Eat Last"),
 ("05","LEVELS","The 5 Levels of Leadership","5 Levels of Leadership"),
 ("06","NORULES","No Rules Rules","No Rules Rules"),
 ("08","EFFECTIVE","The Effective Executive","Effective Executive"),
 ("09","SUPERTEAMS","Superteams","Superteams"),
 ("10","SUDDENLY","Gradually Then Suddenly","Gradually Then Suddenly"),
 ("11","LION","In a Pit with a Lion on a Snowy Day","In a Pit with a Lion on a Snowy Day"),
 ("12","ALLIN","All&nbsp;In","All In"),
 ("13","LEADIQ","Leadership Intelligence","Leadership Intelligence"),
]

def page(label, h1, code, tail, ctr, codesize=128, h1size=84):
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}
h1{{font-size:{h1size}px}}
</style></head><body>
<div class="grid"></div><div class="tint"></div>
<div class="hdr"><div class="brand"><div class="logo"><img src="leading2_mark_clean.png"></div>THE KNOWLEDGE MATRIX</div>
<div class="rt">LEADING 2.0</div></div>
<div class="main"><div class="lab">{label}</div>
<h1>{h1}</h1>
<div class="panel" style="padding:36px 44px">
 <div style="font-weight:800;font-size:34px;letter-spacing:.1em;color:#FFFFFF">FOLLOW @LEADING2POINT0, THEN COMMENT</div>
 <div class="cta-word" id="cw" style="font-size:{codesize}px;white-space:nowrap">{code}</div>
 <div style="font-size:42px;color:#FFFFFF;line-height:1.25">{tail}</div>
</div>
<div><p class="site">leading2point0.com</p><p class="tag">Lead Different | Lead Better | Lead Now</p></div>
<p class="small">Independent and unofficial review. Not affiliated with or endorsed by the author or publisher.</p></div>
<div class="ftr"><div class="badge">{BADGE}</div><div class="ctr">{ctr}</div></div>
<script>
const cw=document.getElementById('cw');const maxw=cw.parentElement.clientWidth-88;
let s={codesize};while(cw.scrollWidth>maxw&&s>60){{s-=4;cw.style.fontSize=s+'px';}}
</script>
</body></html>"""

def main():
    jobs=[]
    for n,code,book,_ in BOOKS:
        size = 76 if len(book)>26 else 84
        jobs.append((f"slide6_{n}.png", page("FREE QUICK START GUIDE", f"Want the free <em>{book} Quick Start?</em>", code,
              "and I will send you the link to the free Quick Start.", "06 / 06", h1size=size)))
    jobs.append(("slide5_07.png", page("YOUR TURN", "Pick a book. <em>Get the guide.</em>", "ANY CODE",
        "from the series and I will send you the link to that Quick Start.", "05 / 05", codesize=110)))
    jobs.append(("slide5_14.png", page("PICK ONE BOOK", "Take one step <em>on Monday.</em>", "YOUR CODE",
        "from the 12 and I will send you the link to that Quick Start.", "05 / 05", codesize=110)))
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(viewport={"width":1080,"height":1350})
        for name, html in jobs:
            p = os.path.join(BASE, name.replace(".png",".html")); open(p,"w",encoding="utf-8").write(html)
            pg.goto("file://"+p); pg.wait_for_timeout(300)
            pg.screenshot(path=os.path.join(OUT,name))
        b.close()
main()
