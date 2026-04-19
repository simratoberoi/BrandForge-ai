# BrandForge AI

BrandForge AI turns a normal product image into polished ad-ready creatives for websites, social posts, and campaign mockups.

Upload your product image, choose creative settings, and generate premium visuals with Gemini image generation.

## Features

- Product-To-Mockup Engine
  Upload a bottle, sneaker, gadget, or any product image and generate polished marketing visuals with realistic lighting and composition.

- Lifestyle Scene Generation
  Create visuals that place your product into believable contexts such as desks, kitchens, gym setups, and other conversion-focused environments.

- Multi-Channel Ad Outputs
  Generate assets for studio ads, landing page heroes, and social creatives across different aspect ratios.

- Prompt-Controlled Art Direction
  Use style, color mood, aspect ratio, and additional prompt directions to shape the final creative output.

- Saved Generations
  Generated creatives are saved to your account and listed in My Generations.

- Download Generated Creative
  Download generated output directly from Generate and My Generations pages.

## Architecture

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB Atlas + Mongoose
- Media Storage: Cloudinary
- AI: Google Gemini API

## Project Structure

- frontend: React application
- backend: Express API, auth, generation, media services

## Environment Variables

Create backend/.env with:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Important: Use a valid Gemini API key from Google AI Studio. If the key is invalid, generation requests will fail.

## Run Locally

1. Install dependencies

```
cd backend
npm install

cd ../frontend
npm install
```

2. Start backend

```
cd backend
npm run dev
```

3. Start frontend

```
cd frontend
npm run dev
```

4. Open app

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Generation Flow

1. User uploads a product image on Generate page.
2. Frontend sends multipart form data (image + creative options) to backend.
3. Backend creates/refines prompt and calls Gemini image generation.
4. Generated image is uploaded to Cloudinary.
5. Creative metadata is saved in MongoDB.
6. User sees preview, can download, and finds it under My Generations.

## Troubleshooting

- Generation failed with API_KEY_INVALID
  Update GEMINI_API_KEY in backend/.env and restart backend.

- Upload failed
  Ensure image is valid and under 10MB.

- Unauthorized errors
  Log in again to refresh auth token.
