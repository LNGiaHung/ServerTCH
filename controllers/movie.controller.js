import { fetchFromTMDB } from "../services/tmdb.service.js";

/**
 * @swagger
 * /movies/trending:
 *   get:
 *     summary: Get trending movies
 *     tags: [Movie]
 *     responses:
 *       200:
 *         description: Successfully retrieved trending movies
 *       500:
 *         description: Internal Server Error
 */
export async function getTrendingMovie(req, res) {
	try {
		const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/movie/day?language=en-US");
		const randomMovie = data.results[Math.floor(Math.random() * data.results?.length)];

		res.json({ success: true, content: randomMovie });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

/**
 * @swagger
 * /movies/{id}/trailers:
 *   get:
 *     summary: Get trailers for a specific movie
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the movie
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved trailers
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 */
export async function getMovieTrailers(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
		res.json({ success: true, trailers: data.results });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}

		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

/**
 * @swagger
 * /movies/{id}/details:
 *   get:
 *     summary: Get details for a specific movie
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the movie
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved movie details
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal Server Error
 */
export async function getMovieDetails(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
		res.status(200).json({ success: true, content: data });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}

		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

/**
 * @swagger
 * /movies/{id}/similar:
 *   get:
 *     summary: Get similar movies
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the movie
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved similar movies
 *       500:
 *         description: Internal Server Error
 */
export async function getSimilarMovies(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);
		res.status(200).json({ success: true, similar: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

/**
 * @swagger
 * /movies/category/{category}:
 *   get:
 *     summary: Get movies by category
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: The category of movies
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved movies by category
 *       500:
 *         description: Internal Server Error
 */
export async function getMoviesByCategory(req, res) {
	const { category } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`);
		res.status(200).json({ success: true, content: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}
