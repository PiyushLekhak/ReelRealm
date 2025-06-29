# 🎬 Movie Recommendation System

A full-stack, content-based movie recommendation system built using **Django** (backend), **React** (frontend), and **TMDB API** (for visuals and metadata). This system recommends movies based on user interests and ratings by analyzing movie metadata such as plot keywords and genres.

---

## 🔍 Features

- 🔎 **Content-Based Filtering** using NLP and cosine similarity
- 🧠 **Keyword Extraction & Stemming** using `NLTK` and `Scikit-learn`
- 📊 Recommends top 25 similar movies based on user interests
- 🖼️ Movie posters, summaries, and other visuals fetched from TMDB API
- 🔄 Automatic recommendation generation using Django Signals
- 🧾 User ratings and interest logging
- ⚛️ React-powered responsive UI

---

## 🏗️ Tech Stack

| Layer        | Tools/Frameworks                           |
|-------------|---------------------------------------------|
| Frontend    | React, JavaScript, HTML, CSS                |
| Backend     | Django, Django REST Framework               |
| ML/NLP      | Scikit-learn, NLTK                          |
| Database    | MySQL           |
| External API| [TMDB API](https://www.themoviedb.org/)     |

---

## 🧠 Recommender System Logic

1. **Feature Extraction:**
   - From each movie’s metadata (`movie_features` field), extract important keywords and remove stopwords.
   - Apply stemming using `PorterStemmer`.

2. **Vectorization & Similarity:**
   - Use `CountVectorizer` (with 3000 max features and stopword removal) to convert text data to vectors.
   - Compute **cosine similarity** between the user’s interest vector and the entire movie dataset.

3. **Recommendation Generation:**
   - Top 25 most similar movies are selected (excluding already rated ones).
   - Automatically saved into the database (`Recommendation` model) when a new `UserInterest` is created.

---
