from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from nltk.stem.porter import PorterStemmer
from .models import Movie  # Import your Movie model

# Function to apply stemming to text
def stem_text(text):
    ps = PorterStemmer()
    stemmed_words = [ps.stem(word) for word in text.split()]
    return " ".join(stemmed_words)

# Function to create content-based recommender
def create_content_based_recommender():
    # Fetch all movie objects from the Movie table
    all_movies = Movie.objects.all()

    # Extract features from all movies
    all_features = [movie.movie_features for movie in all_movies]

    # Creating a CountVectorizer with maximum of 3000 features and excluding common English stop words
    cv = CountVectorizer(max_features=3000, stop_words='english')

    # Transforming the combined info of all movies into a numerical matrix using CountVectorizer
    vector = cv.fit_transform(all_features).toarray()

    # Calculating cosine similarity between items based on the transformed numerical matrix
    content_based_similarity = cosine_similarity(vector)

    # Modified content-based recommender function
    def content_based_recommender(words):
        # Combine the input words into a single string
        input_text = ' '.join(words)

        # Apply stemming to the input text
        input_text_stemmed = stem_text(input_text)

        # Transform the input text into a numerical vector
        input_vector = cv.transform([input_text_stemmed]).toarray()

        # Calculate cosine similarity between the input vector and all movies
        similarity_scores = cosine_similarity(input_vector, vector)

        # Get the indices of movies sorted by similarity score
        sorted_indices = np.argsort(similarity_scores)[0][::-1]

        # Display the titles of the top 10 most similar movies
        similar_movies = []
        for index in sorted_indices[1:11]:  # Exclude the first index (self-similarity)
            similar_movies.append(all_movies[index].title)
        return similar_movies

    return content_based_recommender
