import React, { useEffect, useState, useContext, useRef } from "react";
import AuthContext from "../../context/AuthContext";
import ICards from "../../components/idcard/idcard";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Rectangle } from 'recharts';
import "./profile.css";
import { IoStatsChartSharp } from "react-icons/io5";
import TagCloud from "TagCloud";
import { Link } from 'react-router-dom';

function Profile() {
    const { authTokens } = useContext(AuthContext);
    const [favoriteMovie, setFavoriteMovie] = useState(null);
    const [totalRatedMovies, setTotalRatedMovies] = useState(0);
    const [totalMoviesInWatchlist, setTotalMoviesInWatchlist] = useState(0);
    const [topGenres, setTopGenres] = useState([]);
    const [userInterests, setUserInterests] = useState([]);
    const tagCloudRef = useRef(null);

    useEffect(() => {
        if (authTokens) {
            fetchFavoriteMovie();
            fetchTotalRatedMovies();
            fetchTotalMoviesInWatchlist();
            fetchTopGenres();
            fetchUserInterests();
        }
    }, [authTokens]);

    const fetchFavoriteMovie = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/get_favorite_movie/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFavoriteMovie(data.favorite_movie);
            } else {
                throw new Error("Failed to fetch favorite movie");
            }
        } catch (error) {
            console.error("Error fetching favorite movie:", error);
        }
    };

    const fetchTotalRatedMovies = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/get_total_rated_movies/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTotalRatedMovies(data.total_rated_movies);
            } else {
                throw new Error("Failed to fetch total rated movies");
            }
        } catch (error) {
            console.error("Error fetching total rated movies:", error);
        }
    };

    const fetchTotalMoviesInWatchlist = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/get_total_movies_in_watchlist/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                setTotalMoviesInWatchlist(data.total_movies_in_watchlist);
            } else {
                throw new Error("Failed to fetch total movies in watchlist");
            }
        } catch (error) {
            console.error("Error fetching total movies in watchlist:", error);
        }
    };

    // Shuffle function to randomize array order
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const fetchTopGenres = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/get_top_5_genres/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                const genresArray = data.top_5_genres.split(',').map(genre => genre.trim());
                const formattedGenres = genresArray.map(genre => ({
                    name: genre.split(' ')[0], // Get the genre name
                    value: parseInt(genre.match(/\d+/)[0]) // Get the count as the value
                }));
                // Randomize the order of genres
                const randomizedGenres = shuffleArray(formattedGenres);
                setTopGenres(randomizedGenres);
            } else {
                throw new Error("Failed to fetch top 5 genres");
            }
        } catch (error) {
            console.error("Error fetching top 5 genres:", error);
        }
    };

    const fetchUserInterests = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/get_user_interest/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserInterests(data);
            } else {
                throw new Error("Failed to fetch user interests");
            }
        } catch (error) {
            console.error("Error fetching user interests:", error);
        }
    };

    // Extract words from interests and count occurrences
    const countWords = () => {
        const wordsCount = {};
        userInterests.forEach((interest) => {
            const words = interest.interest.split(/[ ,]+/);
            words.forEach((word) => {
                if (wordsCount[word]) {
                    wordsCount[word]++;
                } else {
                    wordsCount[word] = 1;
                }
            });
        });
        return wordsCount;
    };

    const getTopWords = () => {
        const wordsCount = countWords();
        // Define common words to be excluded
        const commonWords = ["0o", "0s", "3a", "3b", "3d", "6b", "6o", "a", "a1", "a2", "a3", "a4", "ab", "able", "about", "above", "abst", "ac", "accordance", "according", "accordingly", "across", "act", "actually", "ad", "added", "adj", "ae", "af", "affected", "affecting", "affects", "after", "afterwards", "ag", "again", "against", "ah", "ain", "ain't", "aj", "al", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "announce", "another", "any", "anybody", "anyhow", "anymore", "anyone", "anything", "anyway", "anyways", "anywhere", "ao", "ap", "apart", "apparently", "appear", "appreciate", "appropriate", "approximately", "ar", "are", "aren", "arent", "aren't", "arise", "around", "as", "a's", "aside", "ask", "asking", "associated", "at", "au", "auth", "av", "available", "aw", "away", "awfully", "ax", "ay", "az", "b", "b1", "b2", "b3", "ba", "back", "bc", "bd", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "begin", "beginning", "beginnings", "begins", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "bi", "bill", "biol", "bj", "bk", "bl", "bn", "both", "bottom", "bp", "br", "brief", "briefly", "bs", "bt", "bu", "but", "bx", "by", "c", "c1", "c2", "c3", "ca", "call", "came", "can", "cannot", "cant", "can't", "cause", "causes", "cc", "cd", "ce", "certain", "certainly", "cf", "cg", "ch", "changes", "ci", "cit", "cj", "cl", "clearly", "cm", "c'mon", "cn", "co", "com", "come", "comes", "con", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn", "couldnt", "couldn't", "course", "cp", "cq", "cr", "cry", "cs", "c's", "ct", "cu", "currently", "cv", "cx", "cy", "cz", "d", "d2", "da", "date", "dc", "dd", "de", "definitely", "describe", "described", "despite", "detail", "df", "di", "did", "didn", "didn't", "different", "dj", "dk", "dl", "do", "does", "doesn", "doesn't", "doing", "don", "done", "don't", "down", "downwards", "dp", "dr", "ds", "dt", "du", "due", "during", "dx", "dy", "e", "e2", "e3", "ea", "each", "ec", "ed", "edu", "ee", "ef", "effect", "eg", "ei", "eight", "eighty", "either", "ej", "el", "eleven", "else", "elsewhere", "em", "empty", "en", "end", "ending", "enough", "entirely", "eo", "ep", "eq", "er", "es", "especially", "est", "et", "et-al", "etc", "eu", "ev", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "ey", "f", "f2", "fa", "far", "fc", "few", "ff", "fi", "fifteen", "fifth", "fify", "fill", "find", "fire", "first", "five", "fix", "fj", "fl", "fn", "fo", "followed", "following", "follows", "for", "former", "formerly", "forth", "forty", "found", "four", "fr", "from", "front", "fs", "ft", "fu", "full", "further", "furthermore", "fy", "g", "ga", "gave", "ge", "get", "gets", "getting", "gi", "give", "given", "gives", "giving", "gj", "gl", "go", "goes", "going", "gone", "got", "gotten", "gr", "greetings", "gs", "gy", "h", "h2", "h3", "had", "hadn", "hadn't", "happens", "hardly", "has", "hasn", "hasnt", "hasn't", "have", "haven", "haven't", "having", "he", "hed", "he'd", "he'll", "hello", "help", "hence", "her", "here", "hereafter", "hereby", "herein", "heres", "here's", "hereupon", "hers", "herself", "hes", "he's", "hh", "hi", "hid", "him", "himself", "his", "hither", "hj", "ho", "home", "hopefully", "how", "howbeit", "however", "how's", "hr", "hs", "http", "hu", "hundred", "hy", "i", "i2", "i3", "i4", "i6", "i7", "i8", "ia", "ib", "ibid", "ic", "id", "i'd", "ie", "if", "ig", "ignored", "ih", "ii", "ij", "il", "i'll", "im", "i'm", "immediate", "immediately", "importance", "important", "in", "inasmuch", "inc", "indeed", "index", "indicate", "indicated", "indicates", "information", "inner", "insofar", "instead", "interest", "into", "invention", "inward", "io", "ip", "iq", "ir", "is", "isn", "isn't", "it", "itd", "it'd", "it'll", "its", "it's", "itself", "iv", "i've", "ix", "iy", "iz", "j", "jj", "jr", "js", "jt", "ju", "just", "k", "ke", "keep", "keeps", "kept", "kg", "kj", "km", "know", "known", "knows", "ko", "l", "l2", "la", "largely", "last", "lately", "later", "latter", "latterly", "lb", "lc", "le", "least", "les", "less", "lest", "let", "lets", "let's", "lf", "like", "liked", "likely", "line", "little", "lj", "ll", "ll", "ln", "lo", "look", "looking", "looks", "los", "lr", "ls", "lt", "ltd", "m", "m2", "ma", "made", "mainly", "make", "makes", "many", "may", "maybe", "me", "mean", "means", "meantime", "meanwhile", "merely", "mg", "might", "mightn", "mightn't", "mill", "million", "mine", "miss", "ml", "mn", "mo", "more", "moreover", "most", "mostly", "move", "mr", "mrs", "ms", "mt", "mu", "much", "mug", "must", "mustn", "mustn't", "my", "myself", "n", "n2", "na", "name", "namely", "nay", "nc", "nd", "ne", "near", "nearly", "necessarily", "necessary", "need", "needn", "needn't", "needs", "neither", "never", "nevertheless", "new", "next", "ng", "ni", "nine", "ninety", "nj", "nl", "nn", "no", "nobody", "non", "none", "nonetheless", "noone", "nor", "normally", "nos", "not", "noted", "nothing", "novel", "now", "nowhere", "nr", "ns", "nt", "ny", "o", "oa", "ob", "obtain", "obtained", "obviously", "oc", "od", "of", "off", "often", "og", "oh", "oi", "oj", "ok", "okay", "ol", "old", "om", "omitted", "on", "once", "one", "ones", "only", "onto", "oo", "op", "oq", "or", "ord", "os", "ot", "other", "others", "otherwise", "ou", "ought", "our", "ours", "ourselves", "out", "outside", "over", "overall", "ow", "owing", "own", "ox", "oz", "p", "p1", "p2", "p3", "page", "pagecount", "pages", "par", "part", "particular", "particularly", "pas", "past", "pc", "pd", "pe", "per", "perhaps", "pf", "ph", "pi", "pj", "pk", "pl", "placed", "please", "plus", "pm", "pn", "po", "poorly", "possible", "possibly", "potentially", "pp", "pq", "pr", "predominantly", "present", "presumably", "previously", "primarily", "probably", "promptly", "proud", "provides", "ps", "pt", "pu", "put", "py", "q", "qj", "qu", "que", "quickly", "quite", "qv", "r", "r2", "ra", "ran", "rather", "rc", "rd", "re", "readily", "really", "reasonably", "recent", "recently", "ref", "refs", "regarding", "regardless", "regards", "related", "relatively", "research", "research-articl", "respectively", "resulted", "resulting", "results", "rf", "rh", "ri", "right", "rj", "rl", "rm", "rn", "ro", "rq", "rr", "rs", "rt", "ru", "run", "rv", "ry", "s", "s2", "sa", "said", "same", "saw", "say", "saying", "says", "sc", "sd", "se", "sec", "second", "secondly", "section", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "sf", "shall", "shan", "shan't", "she", "shed", "she'd", "she'll", "shes", "she's", "should", "shouldn", "shouldn't", "should've", "show", "showed", "shown", "showns", "shows", "si", "side", "significant", "significantly", "similar", "similarly", "since", "sincere", "six", "sixty", "sj", "sl", "slightly", "sm", "sn", "so", "some", "somebody", "somehow", "someone", "somethan", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "sp", "specifically", "specified", "specify", "specifying", "sq", "sr", "ss", "st", "still", "stop", "strongly", "sub", "substantially", "successfully", "such", "sufficiently", "suggest", "sup", "sure", "sy", "system", "sz", "t", "t1", "t2", "t3", "take", "taken", "taking", "tb", "tc", "td", "te", "tell", "ten", "tends", "tf", "th", "than", "thank", "thanks", "thanx", "that", "that'll", "thats", "that's", "that've", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "thered", "therefore", "therein", "there'll", "thereof", "therere", "theres", "there's", "thereto", "thereupon", "there've", "these", "they", "theyd", "they'd", "they'll", "theyre", "they're", "they've", "thickv", "thin", "think", "third", "this", "thorough", "thoroughly", "those", "thou", "though", "thoughh", "thousand", "three", "throug", "through", "throughout", "thru", "thus", "ti", "til", "tip", "tj", "tl", "tm", "tn", "to", "together", "too", "took", "top", "toward", "towards", "tp", "tq", "tr", "tried", "tries", "truly", "try", "trying", "ts", "t's", "tt", "tv", "twelve", "twenty", "twice", "two", "tx", "u", "u201d", "ue", "ui", "uj", "uk", "um", "un", "under", "unfortunately", "unless", "unlike", "unlikely", "until", "unto", "uo", "up", "upon", "ups", "ur", "us", "use", "used", "useful", "usefully", "usefulness", "uses", "using", "usually", "ut", "v", "va", "value", "various", "vd", "ve", "ve", "very", "via", "viz", "vj", "vo", "vol", "vols", "volumtype", "vq", "vs", "vt", "vu", "w", "wa", "want", "wants", "was", "wasn", "wasnt", "wasn't", "way", "we", "wed", "we'd", "welcome", "well", "we'll", "well-b", "went", "were", "we're", "weren", "werent", "weren't", "we've", "what", "whatever", "what'll", "whats", "what's", "when", "whence", "whenever", "when's", "where", "whereafter", "whereas", "whereby", "wherein", "wheres", "where's", "whereupon", "wherever", "whether", "which", "while", "whim", "whither", "who", "whod", "whoever", "whole", "who'll", "whom", "whomever", "whos", "who's", "whose", "why", "why's", "wi", "widely", "will", "willing", "wish", "with", "within", "without", "wo", "won", "wonder", "wont", "won't", "words", "world", "would", "wouldn", "wouldnt", "wouldn't", "www", "x", "x1", "x2", "x3", "xf", "xi", "xj", "xk", "xl", "xn", "xo", "xs", "xt", "xv", "xx", "y", "y2", "yes", "yet", "yj", "yl", "you", "youd", "you'd", "you'll", "your", "youre", "you're", "yours", "yourself", "yourselves", "you've", "yr", "ys", "yt", "z", "zero", "zi", "zz"];
        // Filter out common words and capitalized genres
        const filteredWords = Object.keys(wordsCount).filter(word => !commonWords.includes(word.toLowerCase()) && word === word.toLowerCase());
        // Sort filtered words by count
        const sortedWords = filteredWords.sort((a, b) => wordsCount[b] - wordsCount[a]);
        return sortedWords.slice(0, 45);
    };
    
    const topWords = getTopWords();

    useEffect(() => {
        // Initialize TagCloud instance when topWords change
        if (topWords.length > 0 && tagCloudRef.current) {
            const tagCloudOptions = {
                radius: 200,
                maxSpeed: 'normal',
                initSpeed: 'normal',
                direction: 135,
                keep: true,
                containerClass: 'tag-cloud-container',
                itemClass: 'tag-cloud-item',
                useContainerInlineStyles: true,
                useItemInlineStyles: true,
                useHTML: false,
            };
            TagCloud(tagCloudRef.current, topWords, tagCloudOptions);
        }
    }, [topWords]);

    return (
        <div className = 'profile-section'>
        <div className="profile-container">
            <div className="left-header-container">
                <Link to="/rated-movies" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="left-header">
                    <h2><i className="fas fa-star" style={{ color: 'gold' }}></i> Total Rated Movies</h2>
                </div>
                <div className="left-card">
                    <div className="card-content">
                    <p style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>{totalRatedMovies}</p>
                    </div>
                </div>
                </Link>
            </div>
            <div className="card-wrapper">
                <h2 style={{ marginLeft: '30px' }}><i className="fas fa-heart" style={{ color: 'red' }}></i> Favorite Movie</h2>
                <div className="card-content">
                    {favoriteMovie ? (
                        <ICards movieId={favoriteMovie} />
                    ) : (
                        <p className="empty-favorites">No movies rated yet.</p>
                    )}
                </div>
            </div>
            <div className="right-header-container">
                <Link to="/watchlist" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="right-header">
                        <h2><i className="fas fa-bookmark" style={{ color: '#3498db' }}></i> Movies in Watchlist</h2>
                    </div>
                    <div className="right-card">
                        <div className="card-content">
                            <p style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>{totalMoviesInWatchlist}</p>
                        </div>
                    </div>
                </Link>
            </div>
            </div>
            {/* Bar chart */}
            <div className="bar-chart-container">                
                <ResponsiveContainer height={450}>
                    <h2 style={{ display: "flex", alignItems: "center", marginLeft: '350px', marginBottom: '20px' }}>
                        <IoStatsChartSharp style={{ marginRight: "10px", color: "rgba(250, 84, 55, 1)" }} />
                        My Top 5 Genres
                    </h2>
                    <BarChart
                        data={topGenres}
                        margin={{ top: 20, right: 30, left: 10, bottom: 30 }}
                    >
                        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontWeight: 'bold', fill: 'grey' }} />
                        <YAxis tick={{ fontWeight: 'bold', fill: 'grey' }} domain={[0,'dataMax + 1']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#333', borderColor: '#666' }}
                            cursor={{ fill: 'transparent' }}
                            formatter={(value, name) => [value, "Count"]}
                            labelStyle={{ color: '#f4eba3' }}
                        />
                        <Bar dataKey="value" fill="rgba(250, 84, 55, 1)" barSize={50} activeBar={<Rectangle fill="#f4eba3" />} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
                    {/* Tag Cloud Container */}
            <div className="tag-cloud-container">
                <h2>
                <i class="fas fa-cloud" style={{ marginRight: "10px", color: "rgba(244, 235, 163, 1)" }}></i>
                    Most commonly occuring words in watched movies
                </h2>
                <div className="tag-cloud-container">
                {topWords.length > 0 ? (
                    <div className="tag-cloud" ref={tagCloudRef}></div>
                ) : (
                    <p className="empty-favorites">No movies rated yet.</p>
                )}
            </div>
            </div>
            </div>
    );
}

export default Profile;
