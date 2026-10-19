# Beringei Shield

Beringei Shield is a Next.js landing page and image-upload demo for the coffee leaf
screening proof of concept. The Next.js API route forwards images to the
FastAPI app; the Gemini API key stays on the server.

## Run locally

1. From the project root, install the Python dependencies and start the API:

   ```powershell
   python -m pip install -r requirements.txt
   uvicorn coffee:app --reload
   ```

   The API reads `GEMINI_API_KEY` from the root `.env` file.

2. In `web`, install the Node dependencies and start Next.js:

   ```powershell
   npm install
   npm run dev
   ```

   The API proxy defaults to `http://127.0.0.1:8000`. Set `COFFEE_API_URL` in
   the Next.js server environment to override it.

The demo accepts JPEG, PNG, and WebP images up to 8 MB. Assessments are an
early AI screening only and should be confirmed with a qualified local
agronomist.
