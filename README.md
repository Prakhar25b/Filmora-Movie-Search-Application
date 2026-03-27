# 🎬 Movie Search App (React + OMDb API)

A modern **Movie Search Web Application** built using **React.js** and the **OMDb API**.
Users can search for movies, view ratings and genres, watch trailers, and save favorites.
The UI features **Dark/Light mode**, **Glassmorphism design**, and a **Netflix-style layout**.

---
[🔗 Live Demo](https://prakhar25b.github.io/Filmora-Movie-Search-Application/) , [🔗 Vercel](https://filmora-movie-search-application.vercel.app/)

# 🚀 Features

### 🔎 Movie Search

* Search for movies using the **OMDb API**
* Press **Enter** or click the **Search button**

### ⭐ Movie Details

Each movie card displays:

* Movie Poster
* Title
* Year
* IMDb Rating
* Genre

### 🎥 Movie Popup

Click a movie poster to open a popup showing:

* IMDb Rating
* Genre
* Plot Summary
* **YouTube trailer search link**

### ❤️ Favorites System

* Add movies to favorites
* Toggle favorites on/off
* Favorites are saved using **LocalStorage**

### 🌙 Dark / Light Mode

* Toggle between dark and light UI themes
* Fully responsive styling across both themes

### 🧊 Glassmorphism UI

* Frosted glass card design
* Smooth hover animations
* Modern Netflix-inspired layout

### ⚠️ Error Handling

* Displays messages if:

  * No movies found
  * API request fails

---

# 🛠️ Tech Stack

| Technology       | Purpose            |
| ---------------- | ------------------ |
| React.js         | Frontend framework |
| JavaScript (ES6) | Application logic  |
| OMDb API         | Movie data         |
| CSS3             | Styling            |
| LocalStorage     | Save favorites     |
| Fetch API        | API calls          |

---

# 📁 Project Structure

```
movie-search-app
│
├── public
│
├── src
│   ├── components
│   │   └── MovieCard.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── package.json
└── README.md
```

---

# ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/movie-search-app.git
```

---

### 2️⃣ Navigate to the Project

```bash
cd movie-search-app
```

---

### 3️⃣ Install Dependencies

```bash
npm install
```

---

### 4️⃣ Start Development Server

```bash
npm run dev
```

---

### 5️⃣ Open in Browser

```
http://localhost:5173
```

---

# 🔑 API Used

### OMDb API

Website:

```
https://www.omdbapi.com
```

Example Request:

```
https://www.omdbapi.com/?s=batman&apikey=YOUR_API_KEY
```

---

# 📸 Application Flow

1️⃣ User searches for a movie
2️⃣ App fetches movie list from OMDb API
3️⃣ Movie cards display poster, rating, and genre
4️⃣ Clicking a card opens detailed popup
5️⃣ User can watch trailer or add to favorites

---

# ✨ Future Improvements

Possible enhancements:

* 🎬 Embedded YouTube trailer player
* ⭐ Sort movies by rating
* 🎭 Filter by genre
* 📱 Fully mobile-first UI
* 🔐 User authentication
* 🧠 Debounced search

---

# 👨‍💻 Author

**Prakhar Bhatnagar**
B.Tech Computer Science Engineering

Interested in:

* MERN Stack Development
* Full Stack Web Applications
* Scalable Web Systems

---

# 📜 License

This project is for **educational and portfolio purposes**.

---

⭐ If you found this project helpful, consider giving it a star!
