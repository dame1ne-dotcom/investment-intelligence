Investment Intelligence V4.4 — server-side market prices

1. Deploy this ENTIRE extracted folder to your EXISTING Netlify site, including netlify/functions and netlify.toml.
2. Netlify site configuration > Environment variables: add TWELVE_DATA_API_KEY with your Twelve Data API key.
3. Trigger a new deploy after saving the environment variable.
4. Open Overview: stocks and ETFs load automatically, without entering keys in the app.

IMPORTANT: Manual drag-and-drop deploys may not deploy Netlify Functions depending on your deployment method. If /.netlify/functions/market-data returns 404, deploy the folder using Netlify CLI or a connected Git repository (recommended). The API key must never be placed in index.html or committed to Git.
Provider free-tier limits, symbol coverage, and delayed data apply. The site does not connect to your brokerage.
