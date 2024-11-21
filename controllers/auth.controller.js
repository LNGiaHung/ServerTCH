import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               username:
 *                 type: string
 *                 example: username123
 *     responses:
 *       201:
 *         description: User signed up successfully
 *       400:
 *         description: All fields are required or invalid input
 *       500:
 *         description: Internal server error
 */
export async function signup(req, res) {
	try {
		const { email, password, username } = req.body;

		if (!email || !password || !username) {
			return res.status(400).json({ success: false, message: "All fields are required" });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			return res.status(400).json({ success: false, message: "Invalid email" });
		}

		if (password.length < 6) {
			return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
		}

		const existingUserByEmail = await User.findOne({ email: email });

		if (existingUserByEmail) {
			return res.status(400).json({ success: false, message: "Email already exists" });
		}

		const existingUserByUsername = await User.findOne({ username: username });

		if (existingUserByUsername) {
			return res.status(400).json({ success: false, message: "Username already exists" });
		}

		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);

		const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

		const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

		const newUser = new User({
			email,
			password: hashedPassword,
			username,
			image,
		});

		const accessToken = generateAccessToken(newUser._id);
		const refreshToken = generateRefreshToken(newUser._id);

		newUser.refreshToken = refreshToken;

		await newUser.save();

		setRefreshTokenCookie(refreshToken, res);

		res.status(201).json({
			success: true,
			user: {
				...newUser._doc,
				password: "",
			},
			accessToken: accessToken,
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
export async function login(req, res) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ success: false, message: "All fields are required" });
		}

		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(404).json({ success: false, message: "Invalid credentials" });
		}

		const isPasswordCorrect = await bcryptjs.compare(password, user.password);

		if (!isPasswordCorrect) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		const accessToken = generateAccessToken(user._id);
		const refreshToken = generateRefreshToken(user._id);

		user.refreshToken = refreshToken;

		await user.save();

		setRefreshTokenCookie(refreshToken, res);

		res.status(200).json({
			success: true,
			user: {
				...user._doc,
				password: "",
			},
			accessToken: accessToken
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Internal server error
 */
export async function logout(req, res) {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

		if (!token) {
			return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
		const userId = decoded.userId;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(401).json({ success: false, message: "Unauthorized - User not found" });
		}

		user.refreshToken = null;
		await user.save();
		res.clearCookie("refreshToken");

		res.status(200).json({ success: true, message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}

/**
 * @swagger
 * /auth/auth-check:
 *   get:
 *     summary: Check if the user is authenticated
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Internal server error
 */
export async function authCheck(req, res) {
	try {
		console.log("req.user:", req.user);
		res.status(200).json({ success: true, user: req.user });
	} catch (error) {
		console.log("Error in authCheck controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: your_refresh_token_here
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Refresh token is required
 *       403:
 *         description: Invalid refresh token
 *       500:
 *         description: Internal server error
 */
export async function refreshToken(req, res) {
	try {
		const token = req.cookies.refreshToken;

		if (!token) {
			return res.status(401).json({ success: false, message: "Refresh token is required" });
		}

		const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
		const user = await User.findById(decoded.userId);

		if (!user || user.refreshToken !== token) {
			return res.status(403).json({ success: false, message: "Invalid refresh token" });
		}

		const newAccessToken = generateAccessToken(user._id);

		res.status(200).json({
			success: true,
			accessToken: newAccessToken,
		});
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}