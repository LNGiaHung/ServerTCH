import express from "express";
import {
	getSearchHistory,
	removeItemFromSearchHistory,
	searchMovie,
	searchPerson,
	searchTv,
} from "../controllers/search.controller.js";

const router = express.Router();

router.get("/persons/:query", searchPerson);
router.get("/movies/:query", searchMovie);
router.get("/tvs/:query", searchTv);

router.get("/history", getSearchHistory);

router.delete("/history/:id", removeItemFromSearchHistory);

export default router;
