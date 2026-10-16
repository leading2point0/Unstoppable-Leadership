# Comment CTA rework for 14 scheduled Instagram carousels

Goal: every scheduled @leading2point0 carousel (Oct 16 to Oct 29, 10:00 AM CT) must ask people to follow and comment a code, and say "I will send you the link." No post may say "link in bio" or "enter the code."

Everything you need is in this folder.

- `manifest.json`: one entry per post. It lists the Metricool post uuid, the code, the DM link, the current slide URLs, which slide to replace, the new slide file and its raw GitHub URL, the exact caption edits (old text to new text) and the new alt text.
- `slides/`: the 14 new closing slides (1080 x 1350 PNG) plus the new Oct 29 cover.
- `build_slides/build.py`: rebuilds the closing slides (needs Playwright, Pillow and the Inter font). `build_covers/build.py` rebuilds the 14 covers.
- ClickUp list "Instagram Carousels: Comment CTA Rework (Oct 16 to 29)" mirrors this manifest, one task per post.

## What to do, per post

1. Get the post with `getScheduledPosts` (blogId 6966414, timezone America/Chicago, range Oct 16 to Oct 30). The post id changes after every update. The uuid does not.
2. Apply each `caption_edits` pair to the caption. Replace only the old text. Keep everything else.
3. In `media`, replace only the slide named in `replace_slide_number`, using `new_slide_raw_url`. Instagram needs a public image URL. This branch is public, so the raw URLs work. For Oct 29, also replace slide 1.
4. In `mediaAltText`, replace only the same slide with `alt_text_new_for_replaced_slide`.
5. Call `updateScheduledPost` with id, uuid, blogId and the full `info` JSON. Keep the date, time, providers (instagram only) and every other field as they are.

## Check at the end

Re-fetch all 14 posts and confirm for each: date and time unchanged, instagram only, caption has the new line and no "link in bio," media count unchanged (6, or 5 for Oct 22 and Oct 29), and the replaced slide is a new Metricool URL.

Posts for Oct 22 and Oct 29 have code slides (2 and 3, 2 to 4) that were not reviewed. Open them and fix any "link in bio" wording.

## Clean up

Metricool copies the images to its own host when you update a post. After all 14 pass the check, delete this branch (`carousel-comment-cta`) from GitHub.

## Not covered here

The comment to DM automation (12 code triggers that reply with the link) is set up in Metricool or ManyChat, not in this repo. Without it, someone has to send each link by hand.

Rules for any copy you write: no dashes in sentences, never start a sentence with "This," keep "Independent and unofficial review" on the closing slide.
