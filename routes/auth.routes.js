import express from "express";
import { login, signup, logout, authCheck, refreshToken } from "../controllers/auth.controller.js";

const router = express.Router();

// User registration
router.post("/signup", signup);

// User login
router.post("/login", login);

// User logout
router.post("/logout", logout);

// Check authentication status
router.get("/auth-check", authCheck);

// Refresh access token
router.post("/refresh-token", refreshToken);

export default router;
