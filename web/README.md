# Sarra web workspace

The web workspace is a static browser view of Sarra's developer utilities. Open `index.html` directly for local utilities, or serve the repository root when you want the embedded documentation viewer to fetch the Markdown files.

## Navigation

- **Home** is the default tab and explains the workspace.
- **id**, **crypto**, **data**, **qr**, **time**, **ssl**, and **geo** each have their own tab.
- **Docs** renders the detailed command help from `docs/*-help.md`.
- Utility tabs keep their task cards collapsed until you open them. The first task in each tab is ready to use.

## Privacy

Most tools run entirely in the browser. AES, RSA, hashing, JSON, QR, and time operations do not need a network request. The geo tab asks for consent before using public IP or geolocation services.

## Source of truth

- `web/components/*.html` contains the rendered utility fragments.
- `web/js/components/*.js` is generated from those fragments for file:// compatibility.
- `docs/*-help.md` contains the detailed CLI reference.
- `web/js/app.js` adds tabs and task disclosures after the fragments load.

Regenerate the component scripts after editing a component with:

```bash
npm run web:inline
```
