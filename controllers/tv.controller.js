import { fetchFromTMDB } from "../services/tmdb.service.js";

/**
 * @swagger
 * /tvs/trending:
 *   get:
 *     summary: Get trending TV shows
 *     tags: [TV]
 *     responses:
 *       200:
 *         description: Successfully retrieved trending TV shows
 *       500:
 *         description: Internal Server Error
 */
export async function getTrendingTv(req, res) {
	try {
		const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/tv/day?language=en-US");
		const randomMovie = data.results[Math.floor(Math.random() * data.results?.length)];

		res.json({ success: true, content: randomMovie });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

/**
 * @swagger
 * /tvs/{id}/trailers:
 *   get:
 *     summary: Get trailers for a specific TV show
 *     tags: [TV]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the TV show
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved trailers
 *       404:
 *         description: TV show not found
 *       500:
 *         description: Internal Server Error
 */
export async function getTvTrailers(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`);
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
 * /tvs/{id}:
 *   get:
 *     summary: Get details for a specific TV show
 *     tags: [TV]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the TV show
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved TV show details
 *       404:
 *         description: TV show not found
 *       500:
 *         description: Internal Server Error
 */
export async function getTvDetails(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`);
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
 * /tvs/{id}/similar:
 *   get:
 *     summary: Get similar TV shows
 *     tags: [TV]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the TV show
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved similar TV shows
 *       500:
 *         description: Internal Server Error
 */
export async function getSimilarTvs(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`);
		res.status(200).json({ success: true, similar: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

/**
 * @swagger
 * /tvs/category/{category}:
 *   get:
 *     summary: Get TV shows by category
 *     tags: [TV]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: The category of TV shows
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved TV shows by category
 *       500:
 *         description: Internal Server Error
 */
export async function getTvsByCategory(req, res) {
	const { category } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`);
		res.status(200).json({ success: true, content: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}
