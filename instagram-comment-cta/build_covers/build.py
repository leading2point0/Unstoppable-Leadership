"""Rebuild slide 1 covers for 14 scheduled carousels. Run: python3 -I build.py"""
import os, html, re
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(BASE), "out_covers")
W, H = 1080, 1350
BADGE = "UNOFFICIAL • INDEPENDENT • NOT ENDORSED"

CSS = """
html,body{margin:0;width:1080px;height:1350px}
body{font-family:'Inter',sans-serif;color:#12151A;position:relative;overflow:hidden;background:linear-gradient(180deg,#FFFFFF 0%,#F4F6F9 100%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(18,21,26,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(18,21,26,.045) 1px,transparent 1px);background-size:60px 60px}
.tint{position:absolute;inset:0;background:linear-gradient(225deg,rgba(47,121,240,.14) 0%,rgba(47,121,240,0) 38%)}
.hdr{position:absolute;left:90px;right:90px;top:50px;height:96px;display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:22px;font-weight:800;font-size:30px;letter-spacing:.08em;color:#2F79F0}
.logo{width:131px;height:96px;border-radius:20px;overflow:hidden;background:#1B2027}
.logo img{width:100%;height:100%;object-fit:cover;display:block}
.rt{font-weight:800;font-size:30px;letter-spacing:.08em;color:#12151A}
.main{position:absolute;left:90px;right:90px;top:192px;bottom:146px;display:flex;flex-direction:column;justify-content:space-between}
.ftr{position:absolute;left:90px;right:90px;bottom:54px;display:flex;justify-content:space-between;align-items:center}
.badge{font-weight:800;font-size:30px;letter-spacing:.02em;color:#5B6472}
.ctr{font-weight:800;font-size:34px;color:#12151A}
.lab{font-weight:800;font-size:36px;letter-spacing:.1em;color:#2F79F0;line-height:1.25;text-wrap:balance}
.by{font-weight:800;font-size:34px;letter-spacing:.06em;color:#12151A;margin-top:14px}
h1{font-family:'Inter Display','Inter',sans-serif;font-weight:800;font-size:96px;line-height:1.05;letter-spacing:-.02em;margin:0;text-wrap:balance}
.sub{font-size:46px;line-height:1.28;color:#5B6472;margin:34px 0 0;font-weight:500;text-wrap:balance}
.panel{background:#1B2027;color:#FFFFFF;border-radius:28px;padding:34px 44px}
.panel .a{font-weight:800;font-size:44px;letter-spacing:.04em;color:#8FBAFF}
.panel .b{font-size:36px;font-weight:500;margin-top:10px;color:#FFFFFF}
.small{font-size:30px;color:#5B6472;font-weight:500;margin:0}
"""

BOOK = ("SWIPE FOR 3 IDEAS", "Plus one question to ask yourself this week")
# date, uuid, label, byline, headline, subline, swipe, n, alt label
C = [
 ("Oct 16","848761642378480622","GOOD TO GREAT","JIM COLLINS","Most leaders are fixing the wrong problem.","A strategy problem is often a people problem.",BOOK,6,"Good to Great"),
 ("Oct 17","6398830042024987560","EXTREME OWNERSHIP","JOCKO WILLINK AND LEIF BABIN","When the team fails, the leader owns it.","All of it. No excuses.",BOOK,6,"Extreme Ownership"),
 ("Oct 18","-9021970532834588593","DARE TO LEAD","BRENÉ BROWN","Being clear is kind.\nBeing vague is not.","What have you been softening?",BOOK,6,"Dare to Lead"),
 ("Oct 19","-593747888790222304","LEADERS EAT LAST","SIMON SINEK","Team gone quiet in meetings? Read this.","People do their best work when they feel safe.",BOOK,6,"Leaders Eat Last"),
 ("Oct 20","6426503494341250720","THE 5 LEVELS OF LEADERSHIP","JOHN MAXWELL","A title gets people to show up.","It does not get them to follow.",BOOK,6,"The 5 Levels of Leadership"),
 ("Oct 21","-5920998466062168564","NO RULES RULES","REED HASTINGS AND ERIN MEYER","Some of your rules signal distrust.","The playbook behind the Netflix culture.",BOOK,6,"No Rules Rules"),
 ("Oct 22","-2859306132122808407","LEADERSHIP BOOK SERIES","HALFWAY","Which book changed how you lead?","Halfway through the series, we need your help.",("SWIPE, THEN COMMENT","Your answer may become our next Quick Start"),5,"Leadership Book Series Halfway"),
 ("Oct 23","-8918772625513494285","THE EFFECTIVE EXECUTIVE","PETER DRUCKER","Busy is a warning sign.","It is not a status symbol.",BOOK,6,"The Effective Executive"),
 ("Oct 24","-2320236057150537172","SUPERTEAMS",None,"A room full of talent is not a team.","What separates great teams from groups that share a calendar?",BOOK,6,"Superteams"),
 ("Oct 25","3450333253791270488","GRADUALLY THEN SUDDENLY","MARK BATTERSON","The 10-minute check-in you skip matters most.","Small habits compound.",BOOK,6,"Gradually Then Suddenly"),
 ("Oct 26","7598576592277228665","IN A PIT WITH A LION ON A SNOWY DAY","MARK BATTERSON","The conversation you avoid may define you.","What is the lion you have been walking around?",BOOK,6,"In a Pit with a Lion on a Snowy Day"),
 ("Oct 27","-2259490962337543866","ALL IN","MARK BATTERSON","Your team can tell you are half in.","Half-hearted commitment gets half-hearted results.",BOOK,6,"All In"),
 ("Oct 28","5090813142659254912","LEADERSHIP INTELLIGENCE",None,"Nobody is a born leader.","Every good leader is a practiced one.",BOOK,6,"Leadership Intelligence"),
 ("Oct 29","-5620700451809836120","SERIES WRAP UP","12 BOOKS","12 books.\nOne question.","What will you actually change on Monday?",("SWIPE FOR 12 CODES","Comment your code. I will send you the link."),5,"Series Wrap Up 12 Books"),
]

def page(c):
    d,u,lab,by,head,sub,sw,n,alt = c
    e = html.escape
    byl = f'<div class="by">{e(by)}</div>' if by else ""
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="grid"></div><div class="tint"></div>
<div class="hdr"><div class="brand"><div class="logo"><img src="leading2_mark_clean.png"></div>THE KNOWLEDGE MATRIX</div><div class="rt">LEADING 2.0</div></div>
<div class="main">
 <div><div class="lab">{e(lab)}</div>{byl}</div>
 <div><h1>{e(head).replace(chr(10),"<br>")}</h1><p class="sub">{e(sub)}</p></div>
 <div><div class="panel"><div class="a">{e(sw[0])} →</div><div class="b">{e(sw[1])}</div></div>
 <p class="small" style="margin-top:22px">Independent and unofficial review.</p></div>
</div>
<div class="ftr"><div class="badge">{BADGE}</div><div class="ctr">01 / {n:02d}</div></div>
</body></html>"""

def main():
    os.makedirs(OUT, exist_ok=True)
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(viewport={"width":W,"height":H})
        for i,c in enumerate(C,1):
            p = os.path.join(BASE, f"cover_{i:02d}.html"); open(p,"w",encoding="utf-8").write(page(c))
            pg.goto("file://"+p); pg.wait_for_timeout(250)
            pg.evaluate("""()=>{const h=document.querySelector('h1'),m=document.querySelector('.main');
              const gap=()=>{const k=[...m.children].map(e=>e.getBoundingClientRect());return Math.min(k[1].top-k[0].bottom,k[2].top-k[1].bottom)};
              let s=96;while(s<150){h.style.fontSize=(s+4)+'px';if(gap()<90){h.style.fontSize=s+'px';break}s+=4}
              h.dataset.s=s}""")
            pg.screenshot(path=os.path.join(OUT, f"cover_{i:02d}.png"))
            r = pg.evaluate("""()=>{const m=document.querySelector('.main').getBoundingClientRect();
              const k=[...document.querySelector('.main').children].map(e=>e.getBoundingClientRect());
              const h=document.querySelector('h1');const lh=parseFloat(getComputedStyle(h).lineHeight);
              return {top:Math.round(Math.min(...k.map(x=>x.top))-m.top), bot:Math.round(m.bottom-Math.max(...k.map(x=>x.bottom))), h1lines:Math.round(h.getBoundingClientRect().height/lh), gap1:Math.round(k[1].top-k[0].bottom), gap2:Math.round(k[2].top-k[1].bottom)}}""")
            print(i, c[0], r)
        b.close()
    # contact sheet 4 x 4 (14 + blank)
    tw = 405; th = int(tw*H/W); pad = 20; cols = 4; rows = 4
    sheet = Image.new("RGB", (cols*tw+(cols+1)*pad, rows*(th+44)+pad), "#E9ECF1")
    dr = ImageDraw.Draw(sheet)
    try: f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 17)
    except: f = None
    for i,c in enumerate(C):
        im = Image.open(os.path.join(OUT, f"cover_{i+1:02d}.png")).convert("RGB").resize((tw,th), Image.LANCZOS)
        x = pad + (i%cols)*(tw+pad); y = pad + (i//cols)*(th+44)
        sheet.paste(im,(x,y)); dr.text((x, y+th+8), f"{c[0]}  {c[2][:30]}", fill="#12151A", font=f)
    sheet.save(os.path.join(OUT, "contact_sheet.png"))
    print(sheet.size)
if __name__ == "__main__": main()
