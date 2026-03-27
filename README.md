# Cinemate 🎬

A cinematic movie search app built with React + Vite and the OMDB API.

## Features
- Live search with 500ms debounce
- Skeleton loading cards
- Pagination (10 results per page)
- Sort by relevance, year, rating, or title
- Filter by type: movies, series, episodes
- Save favourites (persisted in localStorage)
- Rich detail modal with plot, cast, awards, trailer link
- Cinematic dark UI with DM Serif Display typography

## Setup

1. Install dependencies:
   npm install

2. Add your API key:
   cp .env.example .env
   # Edit .env and set VITE_OMDB_KEY=your_key
   # Get a free key at https://www.omdbapi.com/apikey.aspx

3. Run the dev server:
   npm run dev

4. Build for production:
   npm run build

## Project Structure
cinemate/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── MovieCard.jsx   # Individual movie card
│   ├── App.jsx             # Main app — search, state, modal, pagination
│   ├── App.css             # All styles (cinematic dark theme)
│   ├── index.css           # Base reset
│   └── main.jsx            # React entry point
├── .env.example
├── index.html
├── package.json
└── eslint.config.js
