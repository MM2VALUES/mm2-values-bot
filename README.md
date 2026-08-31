# MM2 Values Bot website v4

Static GitHub Pages website for MM2 Values Bot.

## Upload
Replace the website repository files with:
- `index.html`
- `style.css`
- `script.js`
- `privacy.html`
- `terms.html`

## Value snapshot
The visible item/trade values in `script.js` are a source snapshot dated 31 August 2026:
- Candy: 85
- Bat: 120
- WaterGun: 225

The site labels these as a dated snapshot so it does not imply they will remain current forever.

## Important
The website intentionally reflects the bot's current v1 behaviour:
- 9 slash commands
- MM2Values as the current source
- `/updates` shows value changes rather than cache category counts
- `/setup` configuration is currently memory-only and can reset on process restart
- `/inventory` and `/set` are not shown because they were removed from scope
