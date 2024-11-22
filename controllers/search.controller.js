import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

/**
 * @swagger
 * /search/persons/{query}:
 *   get:
 *     summary: Search for a person
 *     tags: [Search]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         description: The search query for the person
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No results found
 *       500:
 *         description: Internal Server Error
 */
export async function searchPerson(req, res) {
	if (!req.user) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	const { query } = req.params;
	try {
		const response = await fetchFromTMDB(
			`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
		);

		if (response.results.length === 0) {
			return res.status(404).send(null);
		}

		await User.findByIdAndUpdate(req.user._id, {
			$push: {
				searchHistory: {
					id: response.results[0].id,
					image: response.results[0].profile_path,
					title: response.results[0].name,
					searchType: "person",
					createdAt: new Date(),
				},
			},
		});

		res.status(200).json({ success: true, content: response.results });
	} catch (error) {
		console.log("Error in searchPerson controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

/**
 * @swagger
 * /search/movies/{query}:
 *   get:
 *     summary: Search for a movie
 *     tags: [Search]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         description: The search query for the movie
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No results found
 *       500:
 *         description: Internal Server Error
 */
export async function searchMovie(req, res) {
	if (!req.user) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	const { query } = req.params;

	try {
		const response = await fetchFromTMDB(
			`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
		);

		if (response.results.length === 0) {
			return res.status(404).send(null);
		}

		await User.findByIdAndUpdate(req.user._id, {
			$push: {
				searchHistory: {
					id: response.results[0].id,
					image: response.results[0].poster_path,
					title: response.results[0].title,
					searchType: "movie",
					createdAt: new Date(),
				},
			},
		});
		res.status(200).json({ success: true, content: response.results });
	} catch (error) {
		console.log("Error in searchMovie controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

/**
 * @swagger
 * /search/tvs/{query}:
 *   get:
 *     summary: Search for a TV show
 *     tags: [Search]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         description: The search query for the TV show
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No results found
 *       500:
 *         description: Internal Server Error
 */
export async function searchTv(req, res) {
	if (!req.user) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	const { query } = req.params;

	try {
		const response = await fetchFromTMDB(
			`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
		);

		if (response.results.length === 0) {
			return res.status(404).send(null);
		}

		await User.findByIdAndUpdate(req.user._id, {
			$push: {
				searchHistory: {
					id: response.results[0].id,
					image: response.results[0].poster_path,
					title: response.results[0].name,
					searchType: "tv",
					createdAt: new Date(),
				},
			},
		});
		res.json({ success: true, content: response.results });
	} catch (error) {
		console.log("Error in searchTv controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

/**
 * @swagger
 * /search/history:
 *   get:
 *     summary: Get search history for the authenticated user
 *     tags: [Search]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved search history
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
export async function getSearchHistory(req, res) {
	if (!req.user) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	try {
		res.status(200).json({ success: true, content: req.user.searchHistory });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

/**
 * @swagger
 * /search/history/{id}:
 *   delete:
 *     summary: Remove an item from search history
 *     tags: [Search]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the item to remove
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully removed item from search history
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
export async function removeItemFromSearchHistory(req, res) {
	if (!req.user) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	let { id } = req.params;
	id = parseInt(id);

	try {
		await User.findByIdAndUpdate(req.user._id, {
			$pull: {
				searchHistory: { id: id },
			},
		});

		res.status(200).json({ success: true, message: "Item removed from search history" });
	} catch (error) {
		console.log("Error in removeItemFromSearchHistory controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}
